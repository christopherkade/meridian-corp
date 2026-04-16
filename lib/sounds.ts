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
