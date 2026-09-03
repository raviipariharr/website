// One shared AudioContext, created on first use and reused for every
// sound after that — avoids the per-call startup delay/desync you'd
// get from calling `new AudioContext()` separately each time.
let sharedCtx = null;

function getAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedCtx) {
    sharedCtx = new AudioCtx();
  }

  // Browsers can suspend the context until a user gesture resumes it —
  // this is a no-op if it's already running.
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }

  return sharedCtx;
}

// Short three-note chime for small interactions (gift boxes).
export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch (e) {
    console.warn('Could not play sound:', e);
  }
}

// Bigger 5-note ascending fanfare for the opening confetti moment.
// delaySeconds schedules it relative to "now" on the shared clock.
export function playFanfare(delaySeconds = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    const base = ctx.currentTime + delaySeconds;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = base + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  } catch (e) {
    console.warn('Could not play fanfare:', e);
  }
}

function schedulePop(ctx, startTime) {
  const duration = 0.18;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, startTime);
  filter.frequency.exponentialRampToValueAtTime(200, startTime + duration);
  filter.Q.value = 0.9;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(startTime);
  noise.stop(startTime + duration);
}

// Single pop, for reuse elsewhere if needed.
export function playPop(delaySeconds = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    schedulePop(ctx, ctx.currentTime + delaySeconds);
  } catch (e) {
    console.warn('Could not play pop sound:', e);
  }
}

// Both confetti pops scheduled together on the SAME context clock,
// so the gap between them is exact instead of drifting per-call.
export function playConfettiPops() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    schedulePop(ctx, now);
    schedulePop(ctx, now + 0.08);
  } catch (e) {
    console.warn('Could not play pop sounds:', e);
  }
}