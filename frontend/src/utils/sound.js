let ctx;

const getCtx = () => {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
};

export const playPop = (volume = 0.12) => {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(880, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(420, c.currentTime + 0.09);
  g.gain.setValueAtTime(volume, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.13);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.14);
};

export const playChime = (volume = 0.16) => {
  const c = getCtx();
  if (!c) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    const t = c.currentTime + i * 0.07;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.6);
  });
};

export const playCombo = (level = 1, volume = 0.14) => {
  const c = getCtx();
  if (!c) return;
  const base = 440 * Math.pow(1.18, level);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(base, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(base * 1.5, c.currentTime + 0.08);
  g.gain.setValueAtTime(volume, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.16);
  o.connect(g).connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.18);
};
