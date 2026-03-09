// DevLearn Session Builder
// Builds an ordered queue of AudioCards for a session based on context mode + available time

function buildSession({ modeConfig, availableMinutes, cards, audioProgress }) {
  const sessionMin = Math.min(availableMinutes || modeConfig.sessionMin, modeConfig.sessionMin);
  const totalSeconds = sessionMin * 60;
  const chunkSec = modeConfig.chunkSec;

  const progress = audioProgress || {};

  // Separate review cards (overdue SRS) from new cards
  const now = Date.now();
  const reviewCards = [];
  const newCards = [];

  for (const card of cards) {
    const p = progress[card.id];
    if (p && p.nextReviewAt && p.nextReviewAt <= now) {
      reviewCards.push(card);
    } else if (!p || !p.heardAt) {
      newCards.push(card);
    }
  }

  // First 2 minutes = SRS review cards (overdue)
  const reviewBudget = 2 * 60; // seconds
  const queue = [];
  let elapsed = 0;

  for (const card of reviewCards) {
    if (elapsed >= reviewBudget) break;
    queue.push({ ...card, isReview: true });
    elapsed += chunkSec;
  }

  // Fill the rest with new cards
  for (const card of newCards) {
    if (elapsed >= totalSeconds) break;
    queue.push({ ...card, isReview: false });
    elapsed += chunkSec;
  }

  return {
    cards: queue,
    totalCards: queue.length,
    estimatedMinutes: Math.ceil(elapsed / 60),
    reviewCount: queue.filter(c => c.isReview).length,
    newCount: queue.filter(c => !c.isReview).length
  };
}

function getNextReviewDate(card, wasCorrect) {
  const intervals = [1, 3, 7, 14, 30, 90]; // days
  const currentLevel = card.reviewLevel || 0;
  const nextLevel = wasCorrect
    ? Math.min(currentLevel + 1, intervals.length - 1)
    : Math.max(currentLevel - 1, 0);
  const days = intervals[nextLevel];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { nextLevel, nextReviewAt: date.getTime() };
}

if (typeof module !== 'undefined') module.exports = { buildSession, getNextReviewDate };
