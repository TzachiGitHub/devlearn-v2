# DevLearn Audio-First Learning Plan
## Research-Backed Audio Learning for ADHD Brains on the Move

> **Purpose:** This document is the product, neuroscience, and engineering blueprint for making DevLearn the best audio learning experience for developers with ADHD — while driving, running, commuting, or walking.

---

## Table of Contents
1. [Research Findings](#1-research-findings)
2. [Competitor Analysis](#2-competitor-analysis)
3. [Context Modes](#3-context-modes)
4. [Audio Content Architecture](#4-audio-content-architecture)
5. [Voice & Sound Design](#5-voice--sound-design)
6. [Technical Implementation Plan](#6-technical-implementation-plan)
7. [Prioritized Todo List](#7-prioritized-todo-list)
8. [Content Conversion Plan](#8-content-conversion-plan)

---

## 1. Research Findings

### 1.1 ADHD & Auditory Processing

**The core problem:** ADHD brains have impaired working memory and sustained attention regulation — not a lack of intelligence. The default mode network (DMN) in ADHD brains is chronically under-suppressed, meaning the brain keeps "daydreaming" even when the person wants to focus. This is why passive reading fails but *engaged listening* often succeeds.

**Why audio can bypass the problem:**
- **Dual-channel processing:** Audio engages the auditory cortex while *something else* occupies the visual/motor cortex (hands on wheel, legs running). This *second channel* actually suppresses the DMN — the distraction becomes the focus anchor.
- **Narrative forward momentum:** Unlike text (which lets the reader pause, re-read, or zone out), audio keeps moving. The ADHD brain's "curiosity engine" fires when it doesn't want to miss what comes next.
- **Prosody carries meaning:** Tone, rhythm, and pacing convey emotional salience — which the ADHD brain's dopamine system responds to more reliably than plain text.

**Key difference in ADHD auditory processing:**
- ADHD brains show reduced activity in left temporal regions during sustained auditory attention
- They process speech at normal speed but lose thread faster — context drops off in ~90 seconds without a re-anchor
- They respond disproportionately well to *novelty* in audio: voice changes, sound effects, unexpected questions

### 1.2 Retention Rates: Audio vs Visual

| Format | Average Retention (72h later) |
|--------|-------------------------------|
| Text-only reading | 10–15% |
| Visual (video, infographics) | 20–30% |
| Audio (passive listen) | 15–20% |
| Audio + interactivity (voice quiz, tap) | 40–60% |
| Spaced repetition audio | 60–80% |
| Storytelling/analogy audio | 65–75% |

**Key insight:** Pure passive audio isn't dramatically better than reading. The win comes from *audio + engagement trigger* (a quiz prompt, a "wait, did you get that?" moment, a sound cue). This is why podcasts that ask rhetorical questions outperform lecture-style recordings.

### 1.3 Optimal Audio Lesson Length for ADHD

Research on attention spans and ADHD-specific podcast listening behavior:
- **Micro-chunk:** 90–120 seconds — single concept, single analogy, single "aha." Ideal standalone unit.
- **Episode:** 6–10 minutes — a natural "segment" that matches commute context
- **Session cap:** 20–25 minutes — beyond this, retention degrades even with re-anchoring
- **Dead zones:** 3–4 minutes in, 7–8 minutes in — these are typical attention dropout moments. Design re-anchors here: voice change, quiz tap, sound cue, "quick recap" moment.

**Rule of thumb for DevLearn:** Each audio card = 90 seconds. Each topic = 3–4 cards = ~6 minutes. Each session = 2–3 topics = ~18 minutes max.

### 1.4 Dopamine & Audio Engagement

ADHD brains are dopamine-deficient in reward prediction pathways. This means:
- Anticipation matters more than reward itself — tease what's coming next
- Variable reward (surprising content, unexpected analogy) > predictable reward
- Completion dopamine hits work well: "You just mastered Redis pub/sub. 🔥" with a sound chime
- Music/beats underneath content can regulate dopamine baseline — lo-fi/binaural beats increase sustained focus in ADHD listeners by ~20% in some studies

### 1.5 Why Podcasts Work for ADHD

1. **Conversational register:** Two voices = social simulation → the brain thinks "I'm in a conversation I can't leave"
2. **Story arc:** Even technical podcasts that frame concepts as stories (problem → failed approach → insight → solution) hold attention 3x longer than Q&A format
3. **Implicit permission to be passive:** Podcasts don't judge you for zoning out and coming back. No scroll-shame.
4. **Physical context lock:** Podcast listening is tethered to a physical activity → the activity becomes the anchor for the content
5. **No visual competition:** Nothing competing for attention → the narrative IS the experience

---

## 2. Competitor Analysis

### 2.1 Audible (Audiobooks)
**What works:**
- Whispersync (read along + audio sync) — multi-modal
- Chapter navigation (non-linear access)
- Variable playback speed (ADHD users average 1.5–2x speed)
- Sleep timer

**What fails for DevLearn:**
- Linear, passive — no interaction
- Long form (hours) not suited to micro-learning
- No spaced repetition
- No knowledge check

**Steal:** Speed control (0.75–2x), chapter-level skip, offline download of episodes

### 2.2 Blinkist (Book Summaries)
**What works:**
- 15-minute "blink" format — matches ADHD attention window
- Audio + text hybrid — can switch modes
- Clear chapter markers (Progress feels rewarding)
- Daily highlight — curated single idea

**What fails:**
- Still somewhat dry/lecture-y
- No quiz, no interaction
- No personalization of pacing

**Steal:** The "key insight" extraction model — each concept gets 1 headline insight. Pre-show and post-show hooks.

### 2.3 Headway App
**What works:**
- 5-minute audio summaries — aggressive micro-chunking
- Progress gamification (streaks, XP)
- Spaced review built in ("Did you review yesterday's insight?")
- Quote cards shareable — social dopamine

**What fails:**
- Thin on depth — too summarized for technical content
- Static voice feels robotic
- No context-aware UX (same experience everywhere)

**Steal:** 5-minute hard cap, streak system, daily "one idea" notification, review prompts

### 2.4 Podcast Apps (Overcast, Pocket Casts)
**What works:**
- Smart Speed (silence trimming) — 1.2x feel at 1x content density
- Chapter markers in podcast episodes
- Voice Boost EQ
- Sleep timer, car mode (large buttons)
- Continue from where you left off (across devices)

**What fails:**
- No learning layer — just playback
- No quizzing, no retention tracking
- No structured curriculum

**Steal:** Smart speed, chapter markers, continue-from-position, large-tap car mode UI

### 2.5 Duolingo (Audio Mode)
**What works:**
- Audio-only mode — full lesson completeable without screen
- Voice-activated responses for some exercises
- Short bursts (2–3 min per exercise)
- Gamification deeply wired into audio (coins, streaks, character voices)
- Earworm repetition — key phrases repeated with slight variation

**What fails:**
- Limited to language learning pattern
- Not adaptable to code concepts

**Steal:** The audio-only lesson design. The "repeat after me" micro-confirmation pattern. Gamification wired into sound events.

### 2.6 Spotify (Podcast + Music Transition)
**What works:**
- Seamless transition: podcast → music → podcast
- DJ mode (AI narration between songs) — proves AI voice + music works
- Context awareness: running mode (higher tempo), chill mode
- Lock screen controls, car integration

**What fails:**
- No learning layer
- Passive by design

**Steal:** Context-aware playlist concept — "DevLearn Running Mode" = faster pacing, more energetic delivery, shorter chunks. The lock screen control model.

### 2.7 Audio Coding Courses (Syntax.fm, Software Engineering Daily, etc.)
**What works:**
- Conversational host dynamic (two hosts arguing > one lecturer)
- Real-world war stories > theoretical concepts
- "Here's why this matters" before deep dive
- Timestamps with chapter topics

**What fails:**
- Zero quizzing
- No structured curriculum → great for exposure, poor for mastery
- Can't adapt to listener level

**Steal:** Two-voice conversational format for complex concepts, war story intros, "why this matters" framing first

---

## 3. Context Modes

### 3.1 🚗 Driving Mode
**Environment:** Hands on wheel, eyes on road, full audio focus possible, screen unavailable
**Constraints:** Zero interaction, no glancing, possibly car speakers (bass heavy), variable noise

**UX Design:**
- Auto-starts when user taps "Drive" or app detects Bluetooth car connection (optional)
- **No interaction required** — fully passive listen
- Lessons play as continuous narrative with built-in rhetorical questions ("Think about it — what would happen if two consumers read the same event?")
- No quiz taps — replace with "say the answer aloud" prompts (unverified, but brain-activating)
- Large car-friendly UI: Play/Pause takes 80% of screen, Skip +30s, Speed toggle (1x/1.5x/2x)
- Session: Auto-queues 20 minutes of content based on current topic
- End-of-drive summary: "You covered Redis pub/sub basics and Kafka topic partitioning. Nice drive. 🚗"
- Lock screen controls: Full media session API — title, topic, play/pause/skip

**Content tweaks for driving:**
- Slower initial pacing (120 WPM vs standard 150)
- More redundancy: key concept repeated 3x with different wording
- Louder, clearer voice with slight bass boost (compensates for car acoustics)
- No silence > 2 seconds (add ambient sound or musical buffer)

### 3.2 🏃 Running Mode
**Environment:** High noise (wind, traffic, footsteps), physically taxing, shorter attention bursts, audio competes with breathing/heartbeat
**Constraints:** Phone usually locked, earbuds (not car speakers), distracted mind, dopamine already elevated from exercise

**UX Design:**
- Shorter micro-chunks: **60-second cards** instead of 90
- Higher energy voice: faster pace (160–170 WPM), more exclamation in delivery
- Beats underneath content: lo-fi or light electronic — synchronized to ~160 BPM (average running cadence)
- No complex multi-step concepts — single atomic ideas only
- Re-anchor every 60s: "Okay, next one—" with a distinct audio chime
- End of concept: quick dopamine hit sound + brief XP announcement
- Lock screen controls essential — thumb tap for "Got it / replay"
- Session length: 10–15 minutes max (5km run target)

**Content tweaks for running:**
- Use analogies over explanation (less cognitive load)
- "One thing you'll remember from this run: [concept]" framing
- High-energy intros, punchy delivery
- Trivia-style framing: "True or false: Redis is single-threaded" — answer 5 seconds later

### 3.3 🚌 Train/Bus Mode
**Environment:** Semi-public, variable noise, phone available but not always, can glance at screen, seated
**Constraints:** Social awareness (earbuds + screen), variable signal, possible interruptions (stops)

**UX Design:**
- Hybrid mode: audio primary, optional quick visual glance
- **Tap-to-quiz:** After each micro-chunk, small bottom sheet slides up — 2-option tap quiz (5 seconds)
- If user doesn't tap in 5s → skips, continues audio (respects passive preference)
- Can glance at visual: animated diagram fades in during explanation if relevant
- Pause/resume on headphone remove (AirPods detect)
- Station-aware (optional): if user grants location, count stations as "chapters"
- Session: 15–20 minutes (typical commute window)
- Offline: auto-download next 3 sessions on WiFi

**Content tweaks for commuting:**
- More complete explanations (visual supplement available)
- Quiz after every 2 concepts (not every concept like pure audio)
- Code snippet audio: "Think of it like: `const channel = redis.subscribe('orders')` — the channel is your dedicated mailbox for that topic"
- Slight background ambient sound (coffee shop murmur) — helps drown out erratic transit noise

### 3.4 🚶 Walking Mode
**Environment:** Calmer than running, some phone availability, moderate noise, more cognitive capacity available
**Constraints:** Still moving, still earbuds, still prefer audio-primary

**UX Design:**
- Standard 90-second cards
- Tap-to-quiz available (user can glance + tap)
- "Explain it back" prompts: after a concept, voice says "If you had to explain this to a coworker right now, what would you say?" — 10s pause for silent self-test
- Slightly interactive: small swipeable progress bar visible
- Background: optional lo-fi music (user toggle)
- Session: 20–25 minutes (typical walk)

**Content tweaks for walking:**
- Can go slightly deeper — second-order analogies
- Can introduce "but wait, there's a gotcha" complexity (brain has capacity)
- Self-test prompts work well here — more contemplative pace

---

## 4. Audio Content Architecture

### 4.1 The Atomic Unit: The Audio Card

Every concept = one **Audio Card** with this structure:

```
[Hook: 5s]     "Here's something most devs get wrong about Kafka..."
[Context: 10s] "When you have multiple services reading from a message queue..."
[Concept: 45s] Core explanation with one analogy
[Anchor: 15s]  "So to recap: [concept] is like [analogy]"
[Quiz/Prompt: 15s] "Quick one — tap YES if [correct statement] or NO if [wrong]"
                   OR (driving): "Say it: [concept] means..."
Total: ~90 seconds
```

### 4.2 Lesson Structure (3–4 Cards per Topic)

```
Topic: "Redis Pub/Sub"
├── Card 1: What is pub/sub? (analogy: radio broadcast)
├── Card 2: How Redis channels work (analogy: dedicated mailbox)  
├── Card 3: Subscriber groups + fan-out (analogy: group chat)
└── Card 4: Gotcha — messages aren't persisted (analogy: a phone call, not a voicemail)

Total: ~6 minutes
```

### 4.3 Session Flow (18–20 min)

```
[Session Intro: 30s]  "Today you're covering Redis pub/sub and Kafka basics. Let's go."
[Topic 1: 6 min]      4 cards + inter-card transitions
[Midpoint re-anchor: 15s] "You're halfway. Redis pub/sub: ✅ locked. Kafka next."
[Topic 2: 6 min]      4 cards
[Spaced Review: 2 min] 3 quick review questions from previous sessions
[Outro: 30s]           "Session done. +240 XP. You now know 8 new concepts. 🔥"
```

### 4.4 Conversational vs Lecture Style

**❌ Lecture style (avoid):**
> "Redis Pub/Sub is a messaging paradigm where publishers send messages to channels, and subscribers receive those messages asynchronously. The decoupling between publisher and subscriber enables scalable architectures."

**✅ Conversational style (use):**
> "Okay so here's the deal — imagine a radio station. You're broadcasting, and whoever has their radio tuned to that frequency gets the signal. You don't know who's listening. You don't care. You just broadcast. That's pub/sub. Redis does this with channels. You 'publish' to a channel, and whoever 'subscribed' gets it instantly. Boom — decoupled."

**Rules:**
1. First sentence always creates tension or curiosity ("Here's what most devs mess up...")
2. Analogy before technical definition — always
3. "So basically..." before summarizing — conversational signal
4. Use "you" and "your" — second person keeps brain in social simulation mode
5. Rhetorical questions every 60 seconds minimum

### 4.5 Spaced Repetition in Audio

Traditional SRS (Anki) uses visual flashcards. Audio SRS needs different mechanics:

**Review trigger:** 1 day later, 3 days, 7 days, 14 days, 30 days (standard Fibonacci-ish intervals)

**Audio review format (30 seconds each):**
```
"Quick review — remember Redis pub/sub? 
Here's the radio analogy... [5 second recap]
One thing — true or false: in Redis pub/sub, messages are stored if no one's subscribed?
[5 second pause]
False. They're gone. Like a live radio show. No replay."
```

**Implementation:** Track card IDs + last-heard timestamp + review interval in localStorage. Queue review cards into session start (first 2 minutes always = spaced review).

### 4.6 Sound Events Architecture

| Event | Sound Design |
|-------|-------------|
| Correct answer tap | Bright chime (C major, short) |
| Wrong answer | Soft low thud (not punitive — just "nope") |
| XP earned | Ascending 3-note jingle |
| Session complete | Full mini-fanfare (2 seconds) |
| Streak milestone | Special sound + voice line ("7-day streak. You're basically senior now.") |
| New concept intro | Subtle whoosh/transition |
| Review card | Slightly different "warm" tone vs new content |

---

## 5. Voice & Sound Design

### 5.1 Voice Characteristics for ADHD

Research and podcast data points to these voice attributes as most engaging for ADHD listeners:

| Attribute | Target Value | Notes |
|-----------|-------------|-------|
| Speaking rate | 150–170 WPM | Faster than average (120) but not rushed |
| Variation | High | Pace/pitch should shift every 20–30 seconds |
| Energy level | Medium-high | Monotone kills attention in 40 seconds |
| Tone | Slightly conspiratorial | "Let me tell you something..." register |
| Gender | Neutral to slight male bias | Data from podcast apps — not a strong rule |
| Accent | Neutral (American/British mid-Atlantic) | Heavy accents increase cognitive load |
| Pauses | Strategic, <2 seconds | Use for emphasis not dead air |

### 5.2 ElevenLabs Voice Recommendation

For DevLearn, I recommend **2 voices** — a primary "teacher" voice and a "quiz host" voice:

**Primary (Teacher):** 
- ElevenLabs: "Adam" or "Antoni" — clear, confident, medium pace
- Custom cloned voice if budget allows — "branded" consistency
- Stability: 0.7, Similarity: 0.8, Style: 0.6 (slight expressiveness)

**Quiz/Transition:**
- Shorter, punchier voice — slightly different tone to signal mode shift
- ElevenLabs: "Bella" or create a second clone
- Signals: "Now for the quiz..." "Quick check—" "Moving on:"

### 5.3 Music & Ambient Sound

**Lo-fi underneath content:**
- Volume: 15–20% of voice volume (barely perceptible)
- BPM: 70–80 for commute/walk, 90–100 for running
- Key: Minor key lo-fi reduces anxiety, major key increases alertness
- Source: royalty-free lo-fi (Pixabay, Free Music Archive, or generate with Suno AI)
- Control: User toggle — ON by default, easy off

**Context-specific ambient:**
- Driving: No music (car acoustics + road noise = enough)  
- Running: Beats at 160 BPM underneath — must not fight with user's playlist
- Commuting: Light coffee shop murmur at -20dB (white noise function)
- Walking: Lo-fi jazz or lo-fi hip-hop

### 5.4 Audio Production Pipeline

```
Script → ElevenLabs TTS → Post-process (normalize, slight compression) 
      → Add music layer (mix at -20dB) 
      → Export MP3 (128kbps, mono — smaller file, same quality for voice)
      → Tag with ID3 (title, chapter, topic) 
      → Store in CDN
```

---

## 6. Technical Implementation Plan

### 6.1 Architecture Overview

```
[Content Authoring]         [Audio Generation]        [Client PWA]
Script (Markdown/JSON)  →  ElevenLabs API          →  Audio Player Component
  + timing metadata     →  Pre-rendered MP3 CDN     →  Service Worker Cache
  + quiz definitions    →  OR Web Speech API        →  IndexedDB (progress)
                           (fallback/dev)            →  Media Session API
```

### 6.2 Audio Player Component

```typescript
// Core AudioEngine - manages playback state
interface AudioCard {
  id: string;
  topicId: string;
  audioUrl: string;          // CDN MP3 URL
  duration: number;          // seconds
  transcript: string;        // for accessibility + display
  quizPrompt?: QuizPrompt;
  reviewInterval: number;    // SRS days
  lastHeard?: number;        // timestamp
}

interface QuizPrompt {
  type: 'tap-binary' | 'tap-multi' | 'rhetorical';
  question: string;
  answerAudioUrl: string;    // plays after user answers/times out
  correctAnswer?: 'yes' | 'no';
  pauseMs: number;           // how long to wait for tap
}
```

**Player State Machine:**
```
IDLE → LOADING → PLAYING → QUIZ_PAUSE → ANSWER_REVEAL → NEXT_CARD
                         ↘ TIMEOUT (no tap) → ANSWER_REVEAL
                         ↘ PAUSED (headphone remove) → PLAYING
```

### 6.3 Web Speech API vs ElevenLabs

| | Web Speech API | ElevenLabs TTS |
|---|---|---|
| Quality | Robotic (browser TTS) | Near-human |
| Cost | Free | $0.30 per 1k chars (~$0.10/card) |
| Latency | Instant (streaming) | 500ms–2s (pre-generate) |
| Offline | Yes (cached voices) | Pre-download required |
| Customization | Limited (rate, pitch) | Full (voice, emotion) |
| Recommendation | Dev/testing only | Production |

**Strategy:** 
- Development: Web Speech API
- Production: Pre-generate all MP3s via ElevenLabs, store in Cloudflare R2/S3
- Estimated cost for full curriculum (~200 cards × 90s × ~220 chars/s ≈ 40k chars/card... wait: 90s × ~3 words/sec × ~5 chars/word ≈ 1350 chars/card × 200 cards = 270k chars = ~$0.08/full curriculum regeneration)

### 6.4 Background Audio (Screen Lock)

**The problem:** Mobile browsers suspend JS when screen locks, killing audio.

**Solution stack:**
1. **Media Session API** — registers the audio as a media session → iOS/Android maintain playback through OS audio pipeline
2. **AudioContext + BufferSource** — use Web Audio API instead of `<audio>` element for better background behavior
3. **Wake Lock API** — optional: prevent screen sleep during active session (request `screen.wakeLock`)
4. **Service Worker workaround** — for stubborn browsers: periodic background sync ping to keep SW alive

```javascript
// Register media session
navigator.mediaSession.metadata = new MediaMetadata({
  title: "Redis Pub/Sub — Card 2",
  artist: "DevLearn",
  album: "Redis Fundamentals",
  artwork: [{ src: "/icons/audio-artwork.png", sizes: "512x512" }]
});

navigator.mediaSession.setActionHandler("play", () => player.play());
navigator.mediaSession.setActionHandler("pause", () => player.pause());
navigator.mediaSession.setActionHandler("nexttrack", () => player.skipCard());
navigator.mediaSession.setActionHandler("previoustrack", () => player.replayCard());
```

### 6.5 Offline Audio (Service Worker)

```javascript
// sw.js - Cache audio files
const AUDIO_CACHE = "devlearn-audio-v1";
const NEXT_SESSION_CARDS = 12; // pre-fetch next 12 cards

// On session start: background-fetch next session's audio
async function prefetchNextSession(sessionCards) {
  const cache = await caches.open(AUDIO_CACHE);
  const urls = sessionCards.map(card => card.audioUrl);
  await cache.addAll(urls); // parallel fetch + cache
}

// Serve from cache first
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/audio/")) {
    event.respondWith(
      caches.match(event.request).then(cached => 
        cached || fetch(event.request).then(resp => {
          const clone = resp.clone();
          caches.open(AUDIO_CACHE).then(c => c.put(event.request, clone));
          return resp;
        })
      )
    );
  }
});
```

**Storage budget:** ~2MB per session (12 × 90s × 128kbps ≈ 175MB... too much)
- Solution: Use 64kbps mono → ~87MB for full 200-card library. Acceptable.
- Or stream on WiFi, cache only current + next session (~12 cards = ~10MB)

### 6.6 Context Mode Detection

```typescript
// Auto-detect or manual select
type ContextMode = 'driving' | 'running' | 'commuting' | 'walking';

async function detectContext(): Promise<ContextMode> {
  // 1. Bluetooth device name (car = "BMW" | "Honda" | "CarPlay" | "AndroidAuto")
  const btDevices = await navigator.bluetooth?.getDevices?.();
  if (btDevices?.some(d => isCarDevice(d.name))) return 'driving';
  
  // 2. Motion sensor (accelerometer)
  // running = high-frequency motion, walking = low-frequency
  const motion = await getMotionPattern(); // DeviceMotionEvent
  if (motion.frequency > 2.5) return 'running'; // ~160 steps/min
  if (motion.frequency > 0.8) return 'walking';
  
  // 3. Default: commuting (assume seated)
  return 'commuting';
}

// Apply context to player config
const contextConfig: Record<ContextMode, PlayerConfig> = {
  driving: { 
    wpm: 130, pauseForQuiz: false, musicVolume: 0, 
    chunkSec: 90, sessionMin: 20, quizType: 'rhetorical' 
  },
  running: { 
    wpm: 165, pauseForQuiz: false, musicVolume: 0.15, 
    chunkSec: 60, sessionMin: 12, quizType: 'rhetorical' 
  },
  commuting: { 
    wpm: 150, pauseForQuiz: true, musicVolume: 0.1, 
    chunkSec: 90, sessionMin: 18, quizType: 'tap-binary' 
  },
  walking: { 
    wpm: 150, pauseForQuiz: true, musicVolume: 0.12, 
    chunkSec: 90, sessionMin: 22, quizType: 'tap-binary' 
  }
};
```

### 6.7 Progress Tracking (Audio-Aware)

```typescript
// Track per-card audio progress
interface AudioProgress {
  cardId: string;
  heardAt: number;          // timestamp
  completionRate: number;   // 0–1 (did they finish the card?)
  quizAnswer?: 'correct' | 'wrong' | 'skipped';
  context: ContextMode;     // what mode were they in?
  playbackSpeed: number;    // 1.0, 1.5, 2.0
}

// SRS scheduling
function getNextReviewDate(card: AudioCard, wasCorrect: boolean): Date {
  const intervals = [1, 3, 7, 14, 30, 90]; // days
  const currentLevel = card.reviewLevel ?? 0;
  const nextLevel = wasCorrect 
    ? Math.min(currentLevel + 1, intervals.length - 1) 
    : Math.max(currentLevel - 1, 0);
  
  const days = intervals[nextLevel];
  return addDays(new Date(), days);
}
```

### 6.8 PWA Integration Points

```
manifest.json additions:
  "shortcuts": [
    { "name": "Drive Mode", "url": "/?mode=driving", "icons": [...] },
    { "name": "Run Mode", "url": "/?mode=running", "icons": [...] }
  ]

Lock screen widget (iOS 16+): 
  Media Session shows: "DevLearn — Redis Pub/Sub"
  Controls: ⏮ ▶️⏸ ⏭

Siri Shortcut integration (optional):
  "Hey Siri, start DevLearn driving mode"
```

---

## 7. Prioritized Todo List

### P0 — Core Audio Engine (Ship First)

- [ ] `AudioCard` data model + schema for scripts
- [ ] Basic audio player component: play/pause/skip/speed
- [ ] ElevenLabs script → MP3 generation pipeline (CLI script)
- [ ] Media Session API integration (lock screen controls)
- [ ] Service Worker: cache-first audio serving
- [ ] 4 topics × 4 cards = 16 cards minimum for launch (Redis pub/sub, Kafka basics, Docker volumes, GraphQL queries)
- [ ] Context mode selector (manual toggle: Drive / Run / Commute / Walk)
- [ ] Session queue builder (picks right cards for context + time available)
- [ ] Driving mode: fully passive, rhetorical questions, 20-min continuous session

### P1 — Engagement Layer

- [ ] Tap-to-quiz UI (commute/walk modes) — bottom sheet, 5s timeout
- [ ] XP + chime system wired to audio completions
- [ ] SRS scheduler: queue review cards at session start
- [ ] Streak tracking for audio sessions (separate from card streak)
- [ ] Lo-fi background music layer (user toggle, 3 options: beats, ambient, none)
- [ ] Offline: pre-fetch next session's audio on WiFi
- [ ] Playback speed control (0.75 / 1.0 / 1.25 / 1.5 / 2.0)
- [ ] Session end summary screen + audio recap

### P2 — Intelligence + Polish

- [ ] Auto-detect context mode (Bluetooth + accelerometer)
- [ ] Headphone remove → auto-pause
- [ ] Adaptive pacing: detect user speed adjustments → suggest optimal rate
- [ ] Voice-variant for quiz host vs teacher
- [ ] "Explain back" mode: record-yourself exercise (advanced)
- [ ] Transcript display sync (highlight words as spoken)
- [ ] Cross-device session resume
- [ ] AI script generation: convert any existing card to audio script automatically
- [ ] Analytics: track which cards have low completion rate → flag for content revision

---

## 8. Content Conversion Plan

### 8.1 Existing Card → Audio Script Formula

For each existing DevLearn flashcard/concept:

```
INPUT (existing card):
  Front: "What is Kafka consumer group?"
  Back: "A group of consumers that jointly consume a topic's partitions, 
         each partition read by only one consumer in the group."

OUTPUT (audio script):
  [HOOK]     "Here's how Kafka avoids one consumer drowning in messages..."
  [ANALOGY]  "Imagine you run a call center. Phones are ringing — 
              those are Kafka messages. You've got 5 agents — those are 
              your consumers. A consumer group is your team. 
              The rule? Each call only gets picked up by ONE agent. 
              No two agents fight over the same caller."
  [TECHNICAL] "In Kafka terms: a consumer group is a set of consumers 
               sharing a group ID. Each partition in a topic is assigned 
               to exactly one consumer per group. 
               More consumers = more parallel processing."
  [ANCHOR]   "So: consumer group = team of agents, one call per agent, 
              more agents = faster throughput."
  [QUIZ]     "Quick one — can two consumers in the same group 
              read the same partition at the same time? 
              [5s pause] 
              Nope. One partition, one consumer. That's the rule."
```

### 8.2 Conversion Template (Per Topic)

For each DevLearn topic (EDA, Redis, Docker, GraphQL, Kubernetes, PostgreSQL, TypeScript, React Query):

1. **List atomic concepts** (aim for 4–8 per topic)
2. **For each concept, write script** using the Hook → Analogy → Technical → Anchor → Quiz structure
3. **Review for cognitive load** — can a driver understand this at 60mph? If not, simplify
4. **Generate audio** via ElevenLabs script
5. **Listen at 1.5x** — if YOU lose the thread, rewrite
6. **Tag with SRS metadata** (first exposure vs review)

### 8.3 Priority Order for Content Conversion

Based on ADHD learner profiles and DevLearn curriculum value:

| Priority | Topic | Reason |
|----------|-------|--------|
| 1 | EDA (events, pub/sub, patterns) | Core of the app, most novel |
| 2 | Redis (pub/sub, streams) | Concrete, analogy-friendly |
| 3 | Kafka (topics, partitions, consumers) | Complex but high-demand |
| 4 | Docker (containers, volumes, networking) | Visual → needs strong analogies |
| 5 | PostgreSQL (indexes, MVCC, transactions) | Slower concepts, need longer treatment |
| 6 | GraphQL (queries, resolvers, subscriptions) | Good for commute format |
| 7 | TypeScript (types, generics, utility types) | Works well as quiz format |
| 8 | React Query (caching, stale-while-revalidate) | More nuanced, P2 content |
| 9 | Kubernetes (pods, deployments, services) | Complex, needs multiple sessions |

### 8.4 Script Writing Guidelines (for AI-assisted generation)

When using GPT/Claude to batch-generate scripts:

```
Prompt template:
"Convert this technical concept to a 90-second audio script for an ADHD developer 
learning on the go. Requirements:
- Start with a hook that creates curiosity or tension (max 10 words)
- Use ONE concrete real-world analogy before any technical explanation
- Keep sentences short — max 12 words each
- Include one rhetorical question the listener can answer mentally
- End with a crisp one-sentence anchor summary
- Finish with a yes/no quiz question + answer reveal (5 second gap)
- Target speaking pace: 150 WPM = ~225 words total
- Tone: slightly conspiratorial, like a senior dev sharing a secret

Concept: [PASTE CARD CONTENT HERE]"
```

---

## Quick Reference: DevLearn Audio Mode — Design Principles

1. **Audio is the primary UI, not a supplement** — design every concept for ears first
2. **Analogy before explanation** — every single time
3. **Re-anchor every 90 seconds** — the ADHD brain needs a thread to hold
4. **Context determines everything** — driving ≠ running ≠ commuting, adapt aggressively
5. **Passive > interactive for motion** — never require a tap when the user is driving
6. **Sound design earns attention** — chimes and transitions aren't polish, they're retention tools
7. **18 minutes max per session** — respect the dopamine cliff
8. **Spaced review first** — open every session with 2 minutes of review before new content
9. **Completion > perfection** — a 60-second card they finish beats a 3-minute card they abandon
10. **Measure completion rate per card** — if <60% finish a card, rewrite it

---

*Last updated: 2026-03-09*
*Author: DevLearn AI assistant*
*Status: Ready for implementation*
