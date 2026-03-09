// DevLearn Audio Engine
// State machine: IDLE → LOADING → PLAYING → QUIZ_PAUSE → ANSWER_REVEAL → NEXT_CARD

const PLAYER_STATES = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  QUIZ_PAUSE: 'QUIZ_PAUSE',
  ANSWER_REVEAL: 'ANSWER_REVEAL',
  NEXT_CARD: 'NEXT_CARD',
  SESSION_END: 'SESSION_END'
};

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

const AUDIO_PROGRESS_KEY = 'devlearn_audio_progress';

class AudioEngine {
  constructor({ onStateChange, onCardChange, onQuiz, onSessionEnd, onXP }) {
    this.state = PLAYER_STATES.IDLE;
    this.queue = [];
    this.currentIndex = 0;
    this.modeConfig = null;
    this.speedIndex = 1; // default 1.0x
    this.quizTimer = null;
    this.sessionStartedAt = null;
    this.xpEarned = 0;

    // Callbacks
    this.onStateChange = onStateChange || (() => {});
    this.onCardChange = onCardChange || (() => {});
    this.onQuiz = onQuiz || (() => {});
    this.onSessionEnd = onSessionEnd || (() => {});
    this.onXP = onXP || (() => {});

    // Audio element
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this._setupAudioListeners();

    // Web Speech fallback
    this.speechPlayer = new WebSpeechPlayer();

    // Audio context for sound events
    this._audioCtx = null;

    this._loadProgress();
  }

  // ── Progress persistence ──────────────────────────────────
  _loadProgress() {
    try { this.progress = JSON.parse(localStorage.getItem(AUDIO_PROGRESS_KEY) || '{}'); }
    catch { this.progress = {}; }
  }

  _saveProgress() {
    try { localStorage.setItem(AUDIO_PROGRESS_KEY, JSON.stringify(this.progress)); }
    catch {}
  }

  getProgress() { return this.progress; }

  // ── State machine ─────────────────────────────────────────
  _setState(newState) {
    this.state = newState;
    this.onStateChange(newState, this._currentCard());
  }

  _currentCard() {
    return this.queue[this.currentIndex] || null;
  }

  // ── Session management ────────────────────────────────────
  loadSession(queue, modeConfig) {
    this.queue = queue;
    this.currentIndex = 0;
    this.modeConfig = modeConfig;
    this.xpEarned = 0;
    this.sessionStartedAt = Date.now();
    this._setState(PLAYER_STATES.IDLE);
    this.onCardChange(this._currentCard(), 0, queue.length);
  }

  play() {
    if (this.state === PLAYER_STATES.PAUSED) {
      this._resumePlayback();
      return;
    }
    if (this.state === PLAYER_STATES.IDLE || this.state === PLAYER_STATES.NEXT_CARD) {
      this._playCurrentCard();
    }
  }

  pause() {
    if (this.state !== PLAYER_STATES.PLAYING) return;
    this.audio.pause();
    this.speechPlayer.pause();
    this._setState(PLAYER_STATES.PAUSED);
  }

  _resumePlayback() {
    if (this.audio.src && !this._usingFallback) {
      this.audio.play().catch(() => {});
    } else {
      this.speechPlayer.resume();
    }
    this._setState(PLAYER_STATES.PLAYING);
    this._updateMediaSession();
  }

  skipCard() {
    this._clearQuizTimer();
    this._markCardComplete(this._currentCard(), 'skipped');
    this._advanceToNextCard();
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this._clearQuizTimer();
      this.audio.pause();
      this.speechPlayer.stop();
      this.currentIndex--;
      this.onCardChange(this._currentCard(), this.currentIndex, this.queue.length);
      this._setState(PLAYER_STATES.IDLE);
      this._playCurrentCard();
    }
  }

  toggleSpeed() {
    const available = this.modeConfig?.speeds || SPEEDS;
    const currentSpeed = this.getSpeed();
    const idx = available.indexOf(currentSpeed);
    const nextIdx = (idx + 1) % available.length;
    this.speedIndex = SPEEDS.indexOf(available[nextIdx]);
    if (this.speedIndex < 0) this.speedIndex = 1;
    this._applySpeed();
    return this.getSpeed();
  }

  getSpeed() {
    return SPEEDS[this.speedIndex] || 1.0;
  }

  _applySpeed() {
    const speed = this.getSpeed();
    this.audio.playbackRate = speed;
    // For web speech, we restart with new rate (handled on next card)
  }

  // ── Playback ──────────────────────────────────────────────
  _usingFallback = false;

  _playCurrentCard() {
    const card = this._currentCard();
    if (!card) {
      this._endSession();
      return;
    }

    this._setState(PLAYER_STATES.LOADING);
    this.onCardChange(card, this.currentIndex, this.queue.length);
    this._updateMediaSession();

    this._usingFallback = false;

    // Try MP3 first
    this.audio.src = card.audioUrl;
    this.audio.playbackRate = this.getSpeed();

    const playPromise = this.audio.play();
    if (playPromise) {
      playPromise.then(() => {
        this._setState(PLAYER_STATES.PLAYING);
      }).catch(() => {
        // MP3 not available — use Web Speech fallback
        this._useSpeechFallback(card);
      });
    }
  }

  _useSpeechFallback(card) {
    this._usingFallback = true;
    this._setState(PLAYER_STATES.PLAYING);

    this.speechPlayer.speak(card.transcript, {
      wpm: this.modeConfig?.wpm || 150,
      speed: this.getSpeed(),
      onEnd: () => {
        if (this.state === PLAYER_STATES.PLAYING) {
          this._onCardAudioEnded();
        }
      }
    });
  }

  _setupAudioListeners() {
    this.audio.addEventListener('ended', () => {
      if (this.state === PLAYER_STATES.PLAYING) {
        this._onCardAudioEnded();
      }
    });

    this.audio.addEventListener('playing', () => {
      if (this.state === PLAYER_STATES.LOADING) {
        this._setState(PLAYER_STATES.PLAYING);
      }
    });

    this.audio.addEventListener('error', () => {
      if (this.state === PLAYER_STATES.LOADING || this.state === PLAYER_STATES.PLAYING) {
        const card = this._currentCard();
        if (card) this._useSpeechFallback(card);
      }
    });
  }

  _onCardAudioEnded() {
    const card = this._currentCard();
    if (!card) return;

    // Check if we should show a quiz
    if (card.quizPrompt && this.modeConfig?.pauseForQuiz) {
      this._showQuiz(card.quizPrompt);
    } else {
      this._markCardComplete(card, null);
      this._advanceToNextCard();
    }
  }

  // ── Quiz ──────────────────────────────────────────────────
  _showQuiz(quizPrompt) {
    this._setState(PLAYER_STATES.QUIZ_PAUSE);
    this.onQuiz(quizPrompt, (answer) => {
      this._handleQuizAnswer(answer);
    });

    // Auto-dismiss after pauseMs
    this._clearQuizTimer();
    this.quizTimer = setTimeout(() => {
      if (this.state === PLAYER_STATES.QUIZ_PAUSE) {
        this._handleQuizAnswer('timeout');
      }
    }, quizPrompt.pauseMs || 5000);
  }

  _handleQuizAnswer(answer) {
    this._clearQuizTimer();
    const card = this._currentCard();

    let wasCorrect = false;
    if (answer !== 'timeout' && card?.quizPrompt?.correctAnswer) {
      wasCorrect = answer === card.quizPrompt.correctAnswer;
    }

    // Play answer reveal
    this._setState(PLAYER_STATES.ANSWER_REVEAL);
    this._playAnswerSound(wasCorrect);

    // Speak the answer text
    if (card?.quizPrompt?.answerText) {
      setTimeout(() => {
        this.speechPlayer.speak(card.quizPrompt.answerText, {
          wpm: this.modeConfig?.wpm || 150,
          onEnd: () => {
            this._markCardComplete(card, wasCorrect ? 'correct' : (answer === 'timeout' ? 'skipped' : 'wrong'));
            this._advanceToNextCard();
          }
        });
      }, 300);
    } else {
      setTimeout(() => {
        this._markCardComplete(card, wasCorrect ? 'correct' : 'wrong');
        this._advanceToNextCard();
      }, 1500);
    }
  }

  _clearQuizTimer() {
    if (this.quizTimer) {
      clearTimeout(this.quizTimer);
      this.quizTimer = null;
    }
  }

  // ── Card completion & XP ──────────────────────────────────
  _markCardComplete(card, quizResult) {
    if (!card) return;

    const xp = quizResult === 'correct' ? 30 : quizResult === 'skipped' ? 10 : 20;
    this.xpEarned += xp;

    const { nextLevel, nextReviewAt } = getNextReviewDate(card, quizResult === 'correct');

    this.progress[card.id] = {
      cardId: card.id,
      heardAt: Date.now(),
      completionRate: 1,
      quizAnswer: quizResult,
      context: this.modeConfig?.id,
      playbackSpeed: this.getSpeed(),
      reviewLevel: nextLevel,
      nextReviewAt
    };
    this._saveProgress();

    this._playXpSound();
    this.onXP(xp, this.xpEarned);
  }

  _advanceToNextCard() {
    this._setState(PLAYER_STATES.NEXT_CARD);

    // Check session time limit
    const elapsed = (Date.now() - this.sessionStartedAt) / 1000 / 60;
    if (elapsed >= (this.modeConfig?.sessionMin || 20)) {
      this._endSession();
      return;
    }

    this.currentIndex++;
    if (this.currentIndex >= this.queue.length) {
      this._endSession();
      return;
    }

    this.onCardChange(this._currentCard(), this.currentIndex, this.queue.length);

    // Small gap between cards
    setTimeout(() => {
      this._playTransitionSound();
      setTimeout(() => this._playCurrentCard(), 600);
    }, 400);
  }

  _endSession() {
    this.audio.pause();
    this.speechPlayer.stop();
    this._setState(PLAYER_STATES.SESSION_END);
    this._playSessionEndSound();
    this.onSessionEnd({
      cardsCompleted: this.currentIndex,
      totalCards: this.queue.length,
      xpEarned: this.xpEarned,
      durationMin: Math.round((Date.now() - this.sessionStartedAt) / 1000 / 60)
    });
  }

  // ── Media Session API ─────────────────────────────────────
  _updateMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const card = this._currentCard();
    if (!card) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: card.title,
      artist: 'DevLearn',
      album: card.topicTitle,
      artwork: [
        { src: 'https://fav.farm/⚡', sizes: '192x192', type: 'image/png' },
        { src: 'https://fav.farm/⚡', sizes: '512x512', type: 'image/png' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => this.play());
    navigator.mediaSession.setActionHandler('pause', () => this.pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => this.skipCard());
    navigator.mediaSession.setActionHandler('previoustrack', () => this.previousCard());
  }

  _updateMediaSessionState(playing) {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    } catch {}
  }

  // ── Sound Events (Web Audio API) ──────────────────────────
  _getAudioCtx() {
    if (!this._audioCtx) {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._audioCtx;
  }

  _playTone(freq, duration, type = 'sine', volume = 0.15, startDelay = 0) {
    try {
      const ctx = this._getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const start = ctx.currentTime + startDelay;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.start(start);
      osc.stop(start + duration);
    } catch {}
  }

  _playAnswerSound(correct) {
    if (correct) {
      // Bright C major chord
      this._playTone(523, 0.3, 'sine', 0.12);
      this._playTone(659, 0.3, 'sine', 0.1, 0.05);
      this._playTone(784, 0.4, 'sine', 0.08, 0.1);
    } else {
      // Soft low thud
      this._playTone(180, 0.4, 'triangle', 0.1);
    }
  }

  _playXpSound() {
    // Ascending 3-note jingle
    this._playTone(440, 0.15, 'sine', 0.08);
    this._playTone(554, 0.15, 'sine', 0.08, 0.15);
    this._playTone(659, 0.25, 'sine', 0.1, 0.3);
  }

  _playTransitionSound() {
    // Subtle whoosh
    this._playTone(800, 0.15, 'sine', 0.05);
    this._playTone(600, 0.15, 'sine', 0.03, 0.1);
  }

  _playSessionEndSound() {
    // Mini fanfare
    [523, 659, 784, 1047].forEach((freq, i) => {
      this._playTone(freq, 0.3, 'sine', 0.12, i * 0.2);
    });
  }

  destroy() {
    this._clearQuizTimer();
    this.audio.pause();
    this.speechPlayer.stop();
    try { if (this._audioCtx) this._audioCtx.close(); } catch {}
  }
}

if (typeof module !== 'undefined') module.exports = { AudioEngine, PLAYER_STATES, SPEEDS };
