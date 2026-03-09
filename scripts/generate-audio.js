#!/usr/bin/env node
// DevLearn — ElevenLabs Audio Generation Script
// Usage: node scripts/generate-audio.js [cardId|all]
// Requires: ELEVENLABS_API_KEY in environment

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ─────────────────────────────────────────────────
const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam (clear, confident)
const VOICE_SETTINGS = {
  stability: 0.7,
  similarity_boost: 0.8,
  style: 0.6,
  use_speaker_boost: true
};
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const MODEL_ID = 'eleven_monolingual_v1';

// ── Load audio cards ───────────────────────────────────────
// We inline the card data here so the script works standalone
const AUDIO_CARDS = require('./audioCardsData.json').cards;

// ── ElevenLabs API ─────────────────────────────────────────
async function generateAudio(text, cardId) {
  return new Promise((resolve, reject) => {
    if (!API_KEY) {
      reject(new Error('ELEVENLABS_API_KEY environment variable not set'));
      return;
    }

    const body = JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', d => errData += d);
        res.on('end', () => reject(new Error(`ElevenLabs API error ${res.statusCode}: ${errData}`)));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const outPath = path.join(OUTPUT_DIR, `${cardId}.mp3`);
        fs.writeFileSync(outPath, buffer);
        console.log(`✅ Generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
        resolve(outPath);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Clean transcript for TTS ───────────────────────────────
function cleanTranscriptForTTS(transcript) {
  return transcript
    .replace(/\[pause\]/gi, '... ')
    .replace(/\[[\w\s]+\]/g, '')  // remove stage directions like [Hook: 5s]
    .replace(/`[^`]+`/g, (match) => match.replace(/`/g, ''))  // strip backticks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Cost estimate ──────────────────────────────────────────
function estimateCost(cards) {
  const totalChars = cards.reduce((sum, card) => sum + cleanTranscriptForTTS(card.transcript).length, 0);
  const costPer1k = 0.30; // ElevenLabs ~$0.30 per 1000 chars
  const estimatedCost = (totalChars / 1000) * costPer1k;
  return { totalChars, estimatedCost };
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  const arg = process.argv[2];

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output dir: ${OUTPUT_DIR}`);
  }

  let cardsToGenerate = AUDIO_CARDS;

  if (arg && arg !== 'all') {
    const card = AUDIO_CARDS.find(c => c.id === arg);
    if (!card) {
      console.error(`❌ Card not found: ${arg}`);
      console.log('Available card IDs:', AUDIO_CARDS.map(c => c.id).join(', '));
      process.exit(1);
    }
    cardsToGenerate = [card];
  }

  // Cost estimate
  const { totalChars, estimatedCost } = estimateCost(cardsToGenerate);
  console.log(`\n📊 Generating ${cardsToGenerate.length} card(s)`);
  console.log(`   Total characters: ${totalChars.toLocaleString()}`);
  console.log(`   Estimated cost: $${estimatedCost.toFixed(3)}\n`);

  if (!API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY is not set.');
    console.error('   Set it with: export ELEVENLABS_API_KEY=your_key_here');
    console.error('   Get an API key at: https://elevenlabs.io');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (const card of cardsToGenerate) {
    const outPath = path.join(OUTPUT_DIR, `${card.id}.mp3`);

    // Skip if already exists (use --force to override)
    if (fs.existsSync(outPath) && !process.argv.includes('--force')) {
      console.log(`⏭️  Skipping ${card.id} (already exists — use --force to regenerate)`);
      successCount++;
      continue;
    }

    console.log(`🔊 Generating: ${card.id} (${card.title})`);

    try {
      const cleanText = cleanTranscriptForTTS(card.transcript);
      await generateAudio(cleanText, card.id);
      successCount++;

      // Small delay to respect rate limits
      if (cardsToGenerate.length > 1) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`❌ Failed to generate ${card.id}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n✅ Done: ${successCount} generated, ${failCount} failed`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);

  if (successCount > 0) {
    console.log('\n📋 Generated files:');
    cardsToGenerate.slice(0, successCount).forEach(card => {
      const filePath = path.join(OUTPUT_DIR, `${card.id}.mp3`);
      if (fs.existsSync(filePath)) {
        const size = (fs.statSync(filePath).size / 1024).toFixed(1);
        console.log(`   ${card.id}.mp3 — ${size} KB`);
      }
    });
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
