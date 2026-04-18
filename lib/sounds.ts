// Synthesized Windows 95-style sound effects using Web Audio API.
// All sounds are generated programmatically — no external files needed.

import { useGameStore } from "./store";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Check if sounds are muted via the store. */
function isMuted(): boolean {
  return !useGameStore.getState().soundEnabled;
}

/** Ensure AudioContext is resumed (must be called from a user gesture). */
function unlock() {
  if (isMuted()) return;
  const ctx = getCtx();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
}

// ── Helpers ────────────────────────────────────────────────

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.15,
  startTime = 0,
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startTime + duration,
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}

function playNoise(duration: number, volume = 0.08) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

// ── Sound Effects ──────────────────────────────────────────

/** Short, crisp UI button click — reminiscent of a Win95 button press. */
export function playClick() {
  if (isMuted()) return;
  unlock();
  playNoise(0.04, 0.1);
  playTone(800, 0.05, "square", 0.06);
}

/** Positive ding for correct decisions during gameplay. */
export function playCorrect() {
  if (isMuted()) return;
  unlock();
  playTone(660, 0.12, "square", 0.12);
  playTone(880, 0.15, "square", 0.12, 0.08);
}

/** Negative buzz for incorrect decisions. */
export function playIncorrect() {
  if (isMuted()) return;
  unlock();
  playTone(280, 0.15, "square", 0.12);
  playTone(220, 0.2, "sawtooth", 0.08, 0.1);
}

/** Triumphant ascending chime — case completed successfully. */
export function playSuccess() {
  if (isMuted()) return;
  unlock();
  playTone(523, 0.15, "square", 0.12); // C5
  playTone(659, 0.15, "square", 0.12, 0.12); // E5
  playTone(784, 0.15, "square", 0.12, 0.24); // G5
  playTone(1047, 0.3, "square", 0.14, 0.36); // C6
}

/** Rating-specific end-of-day sound — higher rating = more triumphant. */
export function playRatingSound(rating: string) {
  if (isMuted()) return;
  unlock();
  switch (rating) {
    case "S":
      // Fanfare — bright ascending arpeggio with final sustain
      playTone(523, 0.12, "square", 0.12);    // C5
      playTone(659, 0.12, "square", 0.12, 0.1);  // E5
      playTone(784, 0.12, "square", 0.12, 0.2);  // G5
      playTone(1047, 0.12, "square", 0.14, 0.3); // C6
      playTone(1319, 0.4, "square", 0.14, 0.4);  // E6
      break;
    case "A":
      // Upbeat ascending — happy resolution
      playTone(523, 0.15, "square", 0.12);    // C5
      playTone(659, 0.15, "square", 0.12, 0.12); // E5
      playTone(784, 0.15, "square", 0.12, 0.24); // G5
      playTone(1047, 0.3, "square", 0.14, 0.36); // C6
      break;
    case "B":
      // Moderate — two-step okay
      playTone(440, 0.15, "square", 0.1);     // A4
      playTone(523, 0.15, "square", 0.1, 0.12);  // C5
      playTone(659, 0.25, "square", 0.1, 0.24);  // E5
      break;
    case "C":
      // Flat, hesitant — uncertain resolution
      playTone(392, 0.18, "square", 0.1);     // G4
      playTone(349, 0.18, "square", 0.1, 0.16);  // F4
      playTone(392, 0.3, "square", 0.08, 0.32);  // G4
      break;
    case "F":
      // Descending minor — sad trombone vibe
      playTone(392, 0.2, "square", 0.1);      // G4
      playTone(349, 0.2, "square", 0.1, 0.2);    // F4
      playTone(311, 0.2, "sawtooth", 0.08, 0.4); // Eb4
      playTone(262, 0.45, "sawtooth", 0.1, 0.6); // C4
      break;
    default:
      playSuccess();
  }
}

/** Descending game-over chord — you've been fired. */
export function playGameOver() {
  if (isMuted()) return;
  unlock();
  playTone(440, 0.2, "square", 0.12); // A4
  playTone(370, 0.2, "square", 0.12, 0.18); // F#4
  playTone(311, 0.2, "sawtooth", 0.1, 0.36); // Eb4
  playTone(220, 0.5, "sawtooth", 0.12, 0.54); // A3
}

/** Quick alert beep — timer running out. */
export function playTimerWarning() {
  if (isMuted()) return;
  unlock();
  playTone(1000, 0.08, "square", 0.1);
  playTone(1000, 0.08, "square", 0.1, 0.12);
}

/** Short notification blip — toast / system message appearing. */
export function playNotification() {
  if (isMuted()) return;
  unlock();
  playTone(600, 0.08, "square", 0.08);
  playTone(900, 0.1, "square", 0.08, 0.07);
}

/** Tiny typewriter click — Win95 letter-by-letter text sound. */
export function playTypeClick() {
  if (isMuted()) return;
  unlock();
  const ctx = getCtx();
  // Slight random pitch variation for natural feel
  const freq = 1200 + Math.random() * 400;
  playTone(freq, 0.02, "square", 0.04);
  // Tiny noise burst layered on top
  const bufferSize = Math.floor(ctx.sampleRate * 0.012);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

/** Paper shuffle — resume sliding into out-tray on Hire. */
export function playPaperShuffle() {
  if (isMuted()) return;
  unlock();
  const ctx = getCtx();
  // Layered noise bursts that mimic paper sliding
  for (let i = 0; i < 3; i++) {
    const bufLen = Math.floor(ctx.sampleRate * (0.06 + Math.random() * 0.03));
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let j = 0; j < bufLen; j++) {
      d[j] = (Math.random() * 2 - 1) * 0.5;
    }
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000 + Math.random() * 2000;
    filter.Q.value = 0.5;
    src.buffer = buf;
    const t = ctx.currentTime + i * 0.06;
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start(t);
  }
}

/** Rubber stamp thud — heavy impact for Flag as Alien. */
export function playStamp() {
  if (isMuted()) return;
  unlock();
  const ctx = getCtx();
  // Low thud
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
  g.gain.setValueAtTime(0.25, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
  // Impact noise
  const bufLen = Math.floor(ctx.sampleRate * 0.05);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    d[i] = (Math.random() * 2 - 1);
  }
  const src = ctx.createBufferSource();
  const ng = ctx.createGain();
  src.buffer = buf;
  ng.gain.setValueAtTime(0.15, ctx.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  src.connect(ng);
  ng.connect(ctx.destination);
  src.start();
}

/** Soft paper landing — new resume placed on desk. */
export function playPaperLand() {
  if (isMuted()) return;
  unlock();
  const ctx = getCtx();
  const bufLen = Math.floor(ctx.sampleRate * 0.08);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2000;
  src.buffer = buf;
  g.gain.setValueAtTime(0.1, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  src.start();
}
