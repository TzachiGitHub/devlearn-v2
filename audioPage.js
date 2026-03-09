// DevLearn Audio Page Controller
// Wires AudioEngine, SessionBuilder, ContextModes, and AudioCards to the UI

const audioPage = (() => {
  let engine = null;
  let currentMode = getStoredMode();
  let sessionData = null;
  let sessionStartTime = null;
  let cardAudioStartTime = null;
  let quizTimerInterval = null;
  let sessionTimerInterval = null;
  let pendingQuizCallback = null;
  let totalXp = 0;

  // ── Boot ──────────────────────────────────────────────────
  function init() {
    // Load XP from main app progress
    try {
      const p = JSON.parse(localStorage.getItem('devlearn_v2') || '{}');
      totalXp = p.xp || 0;
    } catch {}

    // Render mode buttons
    renderModeSelector();

    // Build engine
    engine = new AudioEngine({
      onStateChange: handleStateChange,
      onCardChange: handleCardChange,
      onQuiz: handleQuiz,
      onAnswerReveal: handleAnswerReveal,
      onSessionEnd: handleSessionEnd,
      onXP: handleXP
    });

    // Build and load session
    loadNewSession();

    // Parse URL mode override
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    if (urlMode && CONTEXT_MODES[urlMode]) {
      switchMode(urlMode);
    }

    updateXpDisplay();
  }

  function loadNewSession() {
    forceCloseQuizOverlay();
    const modeConfig = getModeConfig(currentMode);
    sessionData = buildSession({
      modeConfig,
      availableMinutes: modeConfig.sessionMin,
      cards: AUDIO_CARDS,
      audioProgress: engine.getProgress()
    });

    engine.loadSession(sessionData.cards, modeConfig);
    updateSessionInfo();
    updateCardDisplay(sessionData.cards[0], 0, sessionData.totalCards);
    applyModeUI(modeConfig);
  }

  // ── Mode switching ────────────────────────────────────────
  function switchMode(modeId) {
    currentMode = modeId;
    saveMode(modeId);
    updateModeButtons();
    loadNewSession();
  }

  function renderModeSelector() {
    const container = document.getElementById('mode-selector');
    container.innerHTML = MODE_ORDER.map(id => {
      const m = CONTEXT_MODES[id];
      return `<button class="mode-btn ${id === currentMode ? 'active' : ''}"
        onclick="audioPage.switchMode('${id}')">${m.emoji} ${m.label}</button>`;
    }).join('');
  }

  function updateModeButtons() {
    document.querySelectorAll('.mode-btn').forEach((btn, i) => {
      btn.classList.toggle('active', MODE_ORDER[i] === currentMode);
    });
  }

  function applyModeUI(modeConfig) {
    const app = document.getElementById('audio-app');
    app.className = `audio-page ${modeConfig.id}-mode`;
    document.getElementById('mode-desc').textContent = modeConfig.description;
  }

  // ── Player controls ───────────────────────────────────────
  function togglePlay() {
    if (!engine) return;
    const state = engine.state;
    if (state === PLAYER_STATES.PLAYING) {
      engine.pause();
    } else if (state === PLAYER_STATES.PAUSED) {
      engine.play();
    } else {
      engine.play();
    }
  }

  function skipCard() {
    if (engine) engine.skipCard();
  }

  function previousCard() {
    if (engine) engine.previousCard();
  }

  function toggleSpeed() {
    if (!engine) return;
    const newSpeed = engine.toggleSpeed();
    document.getElementById('btn-speed').textContent = `${newSpeed}×`;
  }

  function answerQuiz(answer) {
    if (pendingQuizCallback) {
      pendingQuizCallback(answer);
      pendingQuizCallback = null;
    }
    // Don't clearQuizTimer here — let onAnswerReveal handle the overlay
    // (quiz overlay stays visible until answer is revealed and spoken)
  }

  function handleAnswerReveal(wasCorrect, answerText) {
    const revealEl = document.getElementById('answer-reveal');
    const overlay = document.getElementById('quiz-overlay');
    const timerEl = document.getElementById('quiz-timer');

    // Stop timer animation
    timerEl.style.transition = 'none';
    timerEl.style.width = '0%';

    // Show answer text
    if (answerText) {
      revealEl.textContent = (wasCorrect ? '✅ ' : '❌ ') + answerText;
      revealEl.classList.add('visible');
    }

    // Hide quiz buttons, keep overlay open to show answer
    const quizButtons = overlay.querySelector('.quiz-buttons');
    if (quizButtons) quizButtons.style.opacity = '0.3';

    // Close overlay after answer is read (engine will advance card via onEnd callback)
    // We close it when the next card starts (handleCardChange)
  }

  function restartSession() {
    hideSessionEnd();
    loadNewSession();
  }

  // ── State change handler ──────────────────────────────────
  function handleStateChange(state, card) {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const soundWave = document.getElementById('sound-wave');
    const cardVisual = document.getElementById('card-visual');
    const statusLabel = document.getElementById('status-label');

    const isPlaying = state === PLAYER_STATES.PLAYING;
    const isLoading = state === PLAYER_STATES.LOADING;

    playIcon.style.display = isPlaying ? 'none' : 'block';
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
    soundWave.classList.toggle('active', isPlaying);
    cardVisual.classList.toggle('playing', isPlaying);

    if (isPlaying) {
      statusLabel.textContent = 'Playing...';
      statusLabel.className = 'status-label playing';
      if (!cardAudioStartTime) cardAudioStartTime = Date.now();
      startSessionTimer();
    } else if (isLoading) {
      statusLabel.textContent = 'Loading...';
      statusLabel.className = 'status-label loading';
    } else if (state === PLAYER_STATES.PAUSED) {
      statusLabel.textContent = 'Paused';
      statusLabel.className = 'status-label';
    } else if (state === PLAYER_STATES.QUIZ_PAUSE) {
      statusLabel.textContent = 'Quiz time!';
      statusLabel.className = 'status-label playing';
    } else if (state === PLAYER_STATES.ANSWER_REVEAL) {
      statusLabel.textContent = 'Answer...';
      statusLabel.className = 'status-label';
    } else if (state === PLAYER_STATES.SESSION_END) {
      statusLabel.textContent = 'Done!';
      statusLabel.className = 'status-label';
    } else {
      statusLabel.textContent = 'Ready';
      statusLabel.className = 'status-label';
    }
  }

  function handleCardChange(card, index, total) {
    cardAudioStartTime = null;
    // Close any open quiz overlay when moving to next card
    const overlay = document.getElementById('quiz-overlay');
    if (overlay && overlay.classList.contains('visible')) {
      const quizButtons = overlay.querySelector('.quiz-buttons');
      if (quizButtons) quizButtons.style.opacity = '';
      overlay.classList.remove('visible');
    }
    updateCardDisplay(card, index, total);
  }

  function updateCardDisplay(card, index, total) {
    if (!card) return;
    document.getElementById('card-topic').textContent = card.topicTitle || '';
    document.getElementById('card-title').textContent = card.title || '';
    document.getElementById('card-number').textContent = `Card ${index + 1} of ${total}`;
    document.getElementById('card-emoji').textContent = getTopicEmoji(card.topicId);
    document.getElementById('review-badge').style.display = card.isReview ? 'block' : 'none';

    // Update card progress bar
    const pct = total > 0 ? ((index) / total) * 100 : 0;
    document.getElementById('card-progress').style.width = `${pct}%`;
    document.getElementById('card-progress-label').textContent = `${index + 1} / ${total}`;
  }

  function getTopicEmoji(topicId) {
    const map = {
      'redis-pubsub': '📡',
      'kafka-consumers': '🗂️'
    };
    return map[topicId] || '🎧';
  }

  // ── Quiz handler ──────────────────────────────────────────
  function handleQuiz(quizPrompt, callback) {
    pendingQuizCallback = callback;

    const overlay = document.getElementById('quiz-overlay');
    const questionEl = document.getElementById('quiz-question');
    const timerEl = document.getElementById('quiz-timer');
    const revealEl = document.getElementById('answer-reveal');

    questionEl.textContent = quizPrompt.question;
    revealEl.textContent = quizPrompt.answerText || '';
    revealEl.classList.remove('visible');

    overlay.classList.add('visible');

    // Animate timer
    timerEl.style.transition = 'none';
    timerEl.style.width = '100%';
    requestAnimationFrame(() => {
      timerEl.style.transition = `width ${quizPrompt.pauseMs}ms linear`;
      timerEl.style.width = '0%';
    });
  }

  function clearQuizTimer() {
    clearInterval(quizTimerInterval);
    // Overlay is now closed via handleCardChange when next card loads
    // Only close immediately if we're explicitly resetting (e.g. mode switch)
  }

  function forceCloseQuizOverlay() {
    const overlay = document.getElementById('quiz-overlay');
    const quizButtons = overlay?.querySelector('.quiz-buttons');
    const revealEl = document.getElementById('answer-reveal');
    if (overlay) overlay.classList.remove('visible');
    if (quizButtons) quizButtons.style.opacity = '';
    if (revealEl) revealEl.classList.remove('visible');
  }

  // ── Session end ───────────────────────────────────────────
  function handleSessionEnd({ cardsCompleted, totalCards, xpEarned, durationMin }) {
    stopSessionTimer();

    // Save XP to main app
    try {
      const p = JSON.parse(localStorage.getItem('devlearn_v2') || '{}');
      p.xp = (p.xp || 0) + xpEarned;
      localStorage.setItem('devlearn_v2', JSON.stringify(p));
    } catch {}

    totalXp += xpEarned;
    updateXpDisplay();

    document.getElementById('session-stats').innerHTML =
      `${cardsCompleted} of ${totalCards} cards<br>${durationMin} min session`;
    document.getElementById('session-xp').textContent = `+${xpEarned} XP`;
    document.getElementById('session-end').classList.add('visible');
  }

  function hideSessionEnd() {
    document.getElementById('session-end').classList.remove('visible');
  }

  // ── XP ────────────────────────────────────────────────────
  function handleXP(earned, sessionTotal) {
    updateXpDisplay();
  }

  function updateXpDisplay() {
    const sessionXp = engine ? engine.xpEarned : 0;
    document.getElementById('xp-display').textContent = `+${sessionXp} XP`;
  }

  // ── Session timer ─────────────────────────────────────────
  function updateSessionInfo() {
    sessionStartTime = null;
    stopSessionTimer();
    document.getElementById('session-progress').style.width = '0%';
    const modeConfig = getModeConfig(currentMode);
    document.getElementById('session-time').textContent =
      `0:00 / ${modeConfig.sessionMin}:00`;
  }

  function startSessionTimer() {
    if (sessionTimerInterval) return;
    if (!sessionStartTime) sessionStartTime = Date.now();

    const modeConfig = getModeConfig(currentMode);
    const totalMs = modeConfig.sessionMin * 60 * 1000;

    sessionTimerInterval = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime;
      const pct = Math.min((elapsed / totalMs) * 100, 100);
      document.getElementById('session-progress').style.width = `${pct}%`;

      const elapsedSec = Math.floor(elapsed / 1000);
      const totalSec = modeConfig.sessionMin * 60;
      document.getElementById('session-time').textContent =
        `${formatTime(elapsedSec)} / ${formatTime(totalSec)}`;
    }, 1000);
  }

  function stopSessionTimer() {
    clearInterval(sessionTimerInterval);
    sessionTimerInterval = null;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ── Public API ────────────────────────────────────────────
  return { init, togglePlay, skipCard, previousCard, toggleSpeed, switchMode, answerQuiz, restartSession };

})();

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', () => audioPage.init());
