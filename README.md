# DevLearn v2

ADHD-optimized card-stack learning app for developers. One card at a time, instant feedback, dopamine-friendly.

## How to Run

Open `index.html` in a browser, or serve locally:

```bash
npx serve .
```

Deploy to GitHub Pages by pushing this folder to a repo.

## Features

- **Card Stack Engine** — one card fills the screen, swipe/keyboard to navigate
- **7 card types** — concept, analogy, quiz, code, fill-in-the-blank, diagram, summary
- **Reward system** — XP per card, bonus per chapter, streak tracking
- **Confetti celebrations** — full-screen celebration on chapter completion
- **Sound feedback** — Web Audio API beep on correct/wrong answers
- **PWA** — works offline via service worker, installable
- **Progress persistence** — localStorage saves chapter progress, XP, streak

## Content

5 complete EDA chapters:
1. What is EDA?
2. Traditional vs Event-Driven
3. Publishers & Subscribers
4. The Pub/Sub Pattern
5. Event Sourcing

Plus stub chapters for Redis and Docker subjects.

## Tech

- Vanilla HTML/CSS/JS, no frameworks
- highlight.js (CDN) for code syntax highlighting
- canvas-confetti (CDN) for celebrations
- Web Audio API for sound effects
- Service Worker for offline support

## Design

- Dark theme (#0F1117 background)
- Purple accent (#7C3AED)
- Mobile-first, 44px minimum touch targets
- 200ms card slide transitions
- System font stack
