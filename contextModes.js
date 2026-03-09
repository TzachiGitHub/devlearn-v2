// DevLearn Context Modes — Configuration
// Each mode adapts the audio experience to the user's physical context

const CONTEXT_MODES = {
  driving: {
    id: 'driving',
    label: 'Drive',
    emoji: '🚗',
    wpm: 130,
    pauseForQuiz: false,
    musicVolume: 0,
    chunkSec: 90,
    sessionMin: 20,
    quizType: 'rhetorical',
    description: 'Fully passive — no tapping required',
    uiStyle: 'large-buttons', // 80% width play button
    speeds: [1.0, 1.5, 2.0]  // simplified speed options for driving
  },
  running: {
    id: 'running',
    label: 'Run',
    emoji: '🏃',
    wpm: 165,
    pauseForQuiz: false,
    musicVolume: 0.15,
    chunkSec: 60,
    sessionMin: 12,
    quizType: 'rhetorical',
    description: 'Shorter chunks, higher energy, no interaction',
    uiStyle: 'minimal',
    speeds: [1.25, 1.5, 2.0]
  },
  commuting: {
    id: 'commuting',
    label: 'Commute',
    emoji: '🚌',
    wpm: 150,
    pauseForQuiz: true,
    musicVolume: 0.1,
    chunkSec: 90,
    sessionMin: 18,
    quizType: 'tap-binary',
    description: 'Quiz taps enabled, 5s to answer',
    uiStyle: 'standard',
    speeds: [0.75, 1.0, 1.25, 1.5, 2.0]
  },
  walking: {
    id: 'walking',
    label: 'Walk',
    emoji: '🚶',
    wpm: 150,
    pauseForQuiz: true,
    musicVolume: 0.12,
    chunkSec: 90,
    sessionMin: 22,
    quizType: 'tap-binary',
    description: 'Full quiz mode, deeper content',
    uiStyle: 'standard',
    speeds: [0.75, 1.0, 1.25, 1.5, 2.0]
  }
};

const MODE_ORDER = ['driving', 'running', 'commuting', 'walking'];

function getModeConfig(modeId) {
  return CONTEXT_MODES[modeId] || CONTEXT_MODES.commuting;
}

function getStoredMode() {
  try { return localStorage.getItem('devlearn_audio_mode') || 'commuting'; } catch { return 'commuting'; }
}

function saveMode(modeId) {
  try { localStorage.setItem('devlearn_audio_mode', modeId); } catch {}
}

if (typeof module !== 'undefined') module.exports = { CONTEXT_MODES, MODE_ORDER, getModeConfig, getStoredMode, saveMode };
