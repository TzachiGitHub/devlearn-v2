// DevLearn Web Speech API Fallback
// Used when MP3 files are not available (dev/testing mode)

class WebSpeechPlayer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
    this.supported = 'speechSynthesis' in window;
    this.onEnd = null;
    this.onStart = null;
    this.paused = false;
  }

  // Convert WPM to speechSynthesis rate (rate=1 ≈ 150-180 WPM depending on browser/voice)
  wpmToRate(wpm) {
    const baseWpm = 160;
    return Math.max(0.5, Math.min(2.0, wpm / baseWpm));
  }

  speak(transcript, { wpm = 150, speed = 1.0, onStart, onEnd, onBoundary } = {}) {
    if (!this.supported) {
      console.warn('Web Speech API not supported');
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    // Strip [pause] markers — actual quiz pause is handled by engine state machine
    // Also strip [* ] style stage directions from transcript
    const cleanTranscript = transcript
      .replace(/\[pause\]/gi, '...')
      .replace(/\[[\w\s]+\]/g, '');

    this.utterance = new SpeechSynthesisUtterance(cleanTranscript);
    this.utterance.rate = this.wpmToRate(wpm) * speed;
    this.utterance.pitch = 1.0;
    this.utterance.volume = 1.0;

    // Prefer a natural-sounding voice
    const voices = this.synth.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')
    ) || voices[0];
    if (preferred) this.utterance.voice = preferred;

    this.utterance.onstart = () => {
      this.paused = false;
      if (onStart) onStart();
      if (this.onStart) this.onStart();
    };

    this.utterance.onend = () => {
      this.paused = false;
      if (onEnd) onEnd();
      if (this.onEnd) this.onEnd();
    };

    if (onBoundary) {
      this.utterance.onboundary = onBoundary;
    }

    this.utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e.error);
        if (onEnd) onEnd();
        if (this.onEnd) this.onEnd();
      }
    };

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.supported && this.synth.speaking) {
      this.synth.pause();
      this.paused = true;
    }
  }

  resume() {
    if (this.supported && this.synth.paused) {
      this.synth.resume();
      this.paused = false;
    }
  }

  stop() {
    if (this.supported) {
      this.synth.cancel();
      this.paused = false;
    }
  }

  isSpeaking() {
    return this.supported && this.synth.speaking && !this.synth.paused;
  }

  isPaused() {
    return this.paused || (this.supported && this.synth.paused);
  }
}

// Export
if (typeof module !== 'undefined') module.exports = { WebSpeechPlayer };
