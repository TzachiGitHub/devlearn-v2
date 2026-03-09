// DevLearn v2 — App Controller
// ADHD-first card-based learning engine

const STORAGE_KEY = 'devlearn_v2';

// ── Progress helpers ────────────────────────────────────────
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function getProgress() {
  const p = loadProgress();
  return {
    xp:          p.xp || 0,
    streak:      p.streak || 0,
    lastActive:  p.lastActive || null,
    completed:   p.completed || {},   // chapterId -> true
    cardIndex:   p.cardIndex || {},   // chapterId -> cardNum
    freezeUsed:  p.freezeUsed || false,
    ...p
  };
}

// ── Streak logic ─────────────────────────────────────────────
function updateStreak(p) {
  const now = new Date();
  const today = now.toDateString();
  if (p.lastActive === today) return p;  // already active today

  const yesterday = new Date(now - 86400000).toDateString();
  if (p.lastActive === yesterday) {
    p.streak = (p.streak || 0) + 1;
  } else if (p.lastActive) {
    // check streak freeze
    const twoDaysAgo = new Date(now - 2*86400000).toDateString();
    if (p.lastActive === twoDaysAgo && !p.freezeUsed) {
      p.streak = (p.streak || 0) + 1;
      p.freezeUsed = true;
    } else {
      p.streak = 1;
      p.freezeUsed = false;
    }
  } else {
    p.streak = 1;
  }
  p.lastActive = today;
  return p;
}

// ── App controller ───────────────────────────────────────────
const app = {
  currentChapterId: null,
  currentCardIndex: 0,
  cards: [],
  answered: false,   // quiz/fill-blank answered this card

  // ── init ──────────────────────────────────────────────────
  init() {
    this.renderTopicMap();
    this.setupHomeScreen();
    this.showHome();

    // Swipe support
    let touchStartX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const lessonActive = document.getElementById('screen-lesson').classList.contains('active');
      if (!lessonActive) return;
      if (dx < -50) this.advanceCard();
      if (dx > 50)  this.prevCard();
    }, { passive: true });

    // Keyboard
    document.addEventListener('keydown', e => {
      const lessonActive = document.getElementById('screen-lesson').classList.contains('active');
      if (!lessonActive) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.advanceCard(); }
      if (e.key === 'ArrowLeft')  this.prevCard();
      if (e.key === 'Escape')     this.exitLesson();
    });
  },

  // ── screens ──────────────────────────────────────────────
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  showHome() {
    document.getElementById('progress-bar').classList.add('hidden');
    this.showScreen('screen-home');
    this.refreshHomeStats();
  },

  showTopic(subjectId) {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return;
    const p = getProgress();

    let screen = document.getElementById('screen-topic');
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'screen-topic';
      screen.className = 'screen';
      document.body.appendChild(screen);
    }

    const chaptersHTML = subject.chapters.map((cid, i) => {
      const ch = CHAPTERS[cid];
      if (!ch) return '';
      const done = p.completed[cid];
      const inProg = p.cardIndex[cid] > 0 && !done;
      const isLocked = i > 0 && !p.completed[subject.chapters[i - 1]] && !inProg && !done;
      const status = done ? '✅' : isLocked ? '🔒' : inProg ? '▶️' : '○';
      const cls = isLocked ? 'chapter-item locked' : 'chapter-item';
      return `
        <div class="${cls}" onclick="app.startChapter('${cid}')">
          <span class="chapter-status">${status}</span>
          <div class="chapter-info">
            <div class="chapter-title">${ch.title}</div>
            <div class="chapter-meta">~${ch.estimatedMinutes} min · ${ch.cards.length} cards · ${ch.cards.length * 10 + 50} XP</div>
          </div>
        </div>`;
    }).join('');

    screen.innerHTML = `
      <div class="topic-detail-header">
        <button class="btn-back" onclick="app.showHome()">← Back</button>
        <div class="topic-detail-emoji">${subject.emoji}</div>
        <div class="topic-detail-title">${subject.title}</div>
        <div class="topic-detail-desc">${subject.description}</div>
      </div>
      <div class="topic-detail-body">
        <div class="chapter-list">${chaptersHTML}</div>
      </div>`;

    document.getElementById('progress-bar').classList.add('hidden');
    this.showScreen('screen-topic');
  },

  // ── home screen ──────────────────────────────────────────
  setupHomeScreen() {
    const p = getProgress();
    const now = new Date();
    const lastDate = p.lastActive ? new Date(p.lastActive) : null;
    const daysSince = lastDate ? Math.floor((now - lastDate) / 86400000) : 999;

    if (lastDate && daysSince >= 3) {
      const el = document.getElementById('welcome-back');
      if (el) { el.classList.remove('hidden'); el.querySelector('p').textContent = "Welcome back! 🙌 Let's pick up where you left off."; }
    }
  },

  refreshHomeStats() {
    const p = getProgress();
    const streak = p.streak || 0;
    const xp = p.xp || 0;

    const streakEl = document.getElementById('streak-display');
    if (streakEl) streakEl.textContent = streak > 0 ? `🔥 ${streak}` : '';

    const xpEl = document.getElementById('xp-display');
    if (xpEl) xpEl.textContent = `⚡ ${xp} XP`;

    // Find resume target
    let resumeChapterId = null;
    let resumeCardIdx   = 0;
    for (const s of SUBJECTS) {
      for (const cid of s.chapters) {
        if (!getProgress().completed[cid]) {
          const idx = p.cardIndex[cid] || 0;
          if (idx > 0 || !resumeChapterId) {
            resumeChapterId = cid;
            resumeCardIdx   = idx;
          }
          if (idx > 0) break;
        }
      }
      if (resumeChapterId && (p.cardIndex[resumeChapterId] || 0) > 0) break;
    }

    const card = document.getElementById('continue-card');
    if (resumeChapterId && CHAPTERS[resumeChapterId]) {
      const ch = CHAPTERS[resumeChapterId];
      const remaining = ch.cards.length - resumeCardIdx;
      const minsLeft  = Math.ceil(remaining * 0.4);
      document.getElementById('continue-title').textContent = ch.title;
      document.getElementById('continue-meta').textContent  = `Card ${resumeCardIdx + 1} of ${ch.cards.length} · ~${minsLeft} min left`;
      if (card) card.onclick = () => this.startChapter(resumeChapterId);
    } else {
      // No progress — start first
      const firstCh = CHAPTERS[SUBJECTS[0]?.chapters[0]];
      if (firstCh) {
        document.getElementById('continue-title').textContent = firstCh.title;
        document.getElementById('continue-meta').textContent  = `~${firstCh.estimatedMinutes} min · ${firstCh.cards.length} cards`;
        if (card) card.onclick = () => this.startChapter(firstCh.id);
      }
    }
  },

  // ── topic map ────────────────────────────────────────────
  renderTopicMap() {
    const p = getProgress();
    const el = document.getElementById('topic-map');
    if (!el) return;
    el.innerHTML = SUBJECTS.map(s => {
      const total    = s.chapters.length;
      const done     = s.chapters.filter(c => p.completed[c]).length;
      const pct      = total > 0 ? Math.round(done / total * 100) : 0;
      return `
        <div class="topic-card" onclick="app.showTopic('${s.id}')">
          <span class="topic-emoji">${s.emoji}</span>
          <div class="topic-title">${s.title}</div>
          <div class="topic-meta">${total} chapters · ${pct}% done</div>
          <div class="topic-progress-bar">
            <div class="topic-progress-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');
  },

  // ── chapter / cards ───────────────────────────────────────
  startChapter(chapterId) {
    const ch = CHAPTERS[chapterId];
    if (!ch) return;

    const p = updateStreak(getProgress());
    saveProgress(p);

    this.currentChapterId = chapterId;
    this.cards = ch.cards;

    // Resume from saved position
    const saved = p.cardIndex[chapterId] || 0;
    this.currentCardIndex = p.completed[chapterId] ? 0 : saved;
    this.answered = false;

    document.getElementById('progress-bar').classList.remove('hidden');
    this.showScreen('screen-lesson');
    this.renderCard('right');
    this.updateProgressBar();
  },

  updateProgressBar() {
    const pct = this.cards.length > 0
      ? (this.currentCardIndex / this.cards.length) * 100 : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('card-indicator').textContent =
      `${this.currentCardIndex + 1} / ${this.cards.length}`;

    // Hide/show prev
    document.getElementById('btn-prev').style.visibility =
      this.currentCardIndex > 0 ? 'visible' : 'hidden';
  },

  renderCard(direction = 'right') {
    const stage = document.getElementById('card-stage');
    const card  = this.cards[this.currentCardIndex];
    if (!card) return;

    this.answered = (card.type === 'concept' || card.type === 'analogy' || card.type === 'summary' || card.type === 'code');

    // Remove old card
    const old = stage.querySelector('.card');
    if (old) {
      old.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
      setTimeout(() => old.remove(), 220);
    }

    const el = document.createElement('div');
    el.className = 'card card-' + card.type;
    el.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
    el.innerHTML = this.buildCardHTML(card);
    stage.appendChild(el);

    // Highlight.js on code cards
    if (card.type === 'code' || card.type === 'fill-blank') {
      if (window.hljs) el.querySelectorAll('pre code').forEach(b => hljs.highlightElement(b));
    }

    // Update nav button label
    const isLast = this.currentCardIndex === this.cards.length - 1;
    const btnNext = document.getElementById('btn-next');
    btnNext.innerHTML = isLast
      ? 'Finish <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      : 'Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

    this.updateProgressBar();
  },

  buildCardHTML(card) {
    switch (card.type) {
      case 'concept': return `
        <div class="card-icon">${card.icon || '📖'}</div>
        <div class="card-title">${card.title}</div>
        <div class="card-body">${card.body}</div>
        ${card.highlight ? `<div class="card-highlight">💡 ${card.highlight}</div>` : ''}`;

      case 'analogy': return `
        <div class="analogy-top">
          <div class="analogy-icon">${card.realWorld?.icon || '🤔'}</div>
          <div class="analogy-content">
            <div class="analogy-label">Think of it like…</div>
            <div class="analogy-metaphor">${card.realWorld?.title || ''}</div>
            <div class="analogy-explanation">${card.realWorld?.explanation || ''}</div>
          </div>
        </div>
        <div class="analogy-divider"></div>
        <div class="analogy-connection">${card.connection || ''}</div>`;

      case 'quiz': return `
        <div class="quiz-question">${card.question}</div>
        <div class="quiz-options">
          ${card.options.map((o, i) => `
            <button class="quiz-option" onclick="app.answerQuiz(${i}, ${card.correct}, this)">
              ${o}
            </button>`).join('')}
        </div>
        <div class="quiz-explanation" id="quiz-explanation">${card.explanation || ''}</div>`;

      case 'code': return `
        <div class="code-label">${card.label || card.language}</div>
        <div class="code-block"><pre><code class="language-${card.language || 'typescript'}">${this.escapeHTML(card.snippet)}</code></pre></div>
        ${card.why ? `<div class="code-why">${card.why}</div>` : ''}`;

      case 'fill-blank': return `
        <div class="fill-hint">Fill in the blank</div>
        <div class="fill-code">
          ${this.escapeHTML(card.prefix)}<span class="fill-blank-slot" id="fill-slot">___</span>${this.escapeHTML(card.suffix)}
        </div>
        ${card.hint ? `<div class="fill-hint" style="color:var(--accent2)">💡 ${card.hint}</div>` : ''}
        <div class="fill-options">
          ${card.options.map(o => `
            <button class="fill-option" onclick="app.answerFill('${this.escapeAttr(o)}', '${this.escapeAttr(card.blank)}', this)">${o}</button>
          `).join('')}
        </div>`;

      case 'summary': return `
        <div class="summary-emoji">🎉</div>
        <div class="summary-heading">${card.title}</div>
        <div class="summary-xp">+${card.xpEarned} XP</div>
        ${card.recap ? `<ul class="summary-list">${card.recap.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}`;

      default: return `<div class="card-body">${JSON.stringify(card)}</div>`;
    }
  },

  escapeHTML(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  },
  escapeAttr(str) { return String(str || '').replace(/'/g, "\\'"); },

  // ── quiz answer ───────────────────────────────────────────
  answerQuiz(idx, correct, btn) {
    if (this.answered) return;
    const options = btn.closest('.quiz-options').querySelectorAll('.quiz-option');
    options.forEach(o => o.classList.add('disabled'));

    if (idx === correct) {
      btn.classList.add('correct');
      this.awardXP(10);
      this.answered = true;
    } else {
      btn.classList.add('wrong');
      options[correct].classList.add('correct');
      this.answered = true;
    }
    const expl = document.getElementById('quiz-explanation');
    if (expl) expl.classList.add('visible');
  },

  // ── fill-blank answer ────────────────────────────────────
  answerFill(answer, correct, btn) {
    if (this.answered) return;
    const slot = document.getElementById('fill-slot');
    const allBtns = btn.closest('.fill-options').querySelectorAll('.fill-option');
    allBtns.forEach(b => b.classList.add('used'));

    if (answer === correct) {
      slot.textContent = answer;
      slot.classList.add('correct');
      this.awardXP(10);
      this.answered = true;
    } else {
      slot.textContent = answer;
      slot.classList.add('wrong');
      setTimeout(() => {
        slot.textContent = correct;
        slot.classList.remove('wrong');
        slot.classList.add('correct');
      }, 700);
      this.answered = true;
    }
  },

  // ── advance card ─────────────────────────────────────────
  advanceCard() {
    if (!this.answered) {
      // Shake the next button
      const btn = document.getElementById('btn-next');
      btn.style.animation = 'shake .3s ease';
      setTimeout(() => btn.style.animation = '', 300);
      return;
    }

    // Save progress
    const p = getProgress();
    if (!p.cardIndex) p.cardIndex = {};
    p.cardIndex[this.currentChapterId] = this.currentCardIndex + 1;
    saveProgress(p);

    const isLast = this.currentCardIndex === this.cards.length - 1;

    if (isLast) {
      this.completeChapter();
    } else {
      this.currentCardIndex++;
      this.answered = false;
      this.renderCard('right');
    }
  },

  prevCard() {
    if (this.currentCardIndex === 0) return;
    this.currentCardIndex--;
    this.answered = true;
    this.renderCard('left');
  },

  // ── chapter complete ─────────────────────────────────────
  completeChapter() {
    const p = getProgress();
    const ch = CHAPTERS[this.currentChapterId];

    // Award XP
    const bonus = 50;
    p.xp = (p.xp || 0) + bonus;
    p.completed = p.completed || {};
    p.completed[this.currentChapterId] = true;
    if (!p.cardIndex) p.cardIndex = {};
    p.cardIndex[this.currentChapterId] = this.cards.length;
    saveProgress(p);

    // Show celebration
    document.getElementById('progress-bar').classList.add('hidden');
    const cel = document.getElementById('celebration');
    cel.classList.remove('hidden');
    document.getElementById('celebration-xp').textContent = `+${this.cards.length * 10 + bonus} XP`;

    const recap = ch.cards.find(c => c.type === 'summary')?.recap || [];
    document.getElementById('celebration-list').innerHTML =
      recap.map(r => `<li>${r}</li>`).join('');

    // Confetti
    if (window.confetti) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ['#7C3AED','#10B981','#F59E0B','#fff'] });
    }

    // Find next chapter
    let nextChapterId = null;
    for (const s of SUBJECTS) {
      const idx = s.chapters.indexOf(this.currentChapterId);
      if (idx !== -1 && idx + 1 < s.chapters.length) {
        nextChapterId = s.chapters[idx + 1];
        break;
      }
    }
    const btnNext = document.getElementById('btn-celebrate-next');
    if (nextChapterId) {
      btnNext.textContent = 'Next Chapter →';
      btnNext.onclick = () => {
        cel.classList.add('hidden');
        this.startChapter(nextChapterId);
      };
    } else {
      btnNext.textContent = 'Back to Home';
      btnNext.onclick = () => { cel.classList.add('hidden'); this.showHome(); };
    }
  },

  nextChapter() {}, // set dynamically in completeChapter

  exitLesson() {
    document.getElementById('progress-bar').classList.add('hidden');
    document.getElementById('celebration').classList.add('hidden');
    this.showHome();
  },

  continueLearning() {
    // handled by onclick set in refreshHomeStats
  },

  // ── XP float animation ────────────────────────────────────
  awardXP(amount) {
    const p = getProgress();
    p.xp = (p.xp || 0) + amount;
    saveProgress(p);

    const el = document.getElementById('xp-float');
    el.textContent = `+${amount} XP`;
    el.style.left  = '50%';
    el.style.top   = '60%';
    el.style.transform = 'translateX(-50%)';
    el.classList.remove('animate');
    void el.offsetWidth; // reflow
    el.classList.add('animate');
    setTimeout(() => el.classList.remove('animate'), 1200);
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
