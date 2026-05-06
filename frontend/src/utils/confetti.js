let canvas, ctx, particles = [], running = false;
const COLORS = ["#FF5F8F", "#7C5CFF", "#FFB627", "#22C55E", "#06B6D4", "#FFCB5C"];

const ensure = () => {
  if (canvas) return;
  canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9999",
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
};

const resize = () => {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const loop = () => {
  if (particles.length === 0) {
    running = false;
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 80);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.vy += p.gravity;
    p.rot += p.vr;
    p.life -= p.decay;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
    ctx.fillStyle = p.color;
    if (p.shape === "rect") {
      ctx.fillRect(-p.r / 2, -p.r * 0.8, p.r, p.r * 1.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  requestAnimationFrame(loop);
};

export const fireConfetti = ({ count = 110, originY = 0.42 } = {}) => {
  ensure();
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * originY;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 12;
    particles.push({
      x: cx + (Math.random() - 0.5) * 100,
      y: cy,
      vx: Math.cos(angle) * speed * 0.85,
      vy: Math.sin(angle) * speed - 6,
      r: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.45,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      gravity: 0.32,
      life: 1,
      decay: 0.006 + Math.random() * 0.008,
      shape: Math.random() < 0.55 ? "rect" : "circle",
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
};

export const fireBurst = ({ count = 24, x, y } = {}) => {
  ensure();
  const ox = x ?? window.innerWidth / 2;
  const oy = y ?? window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      gravity: 0.24,
      life: 1,
      decay: 0.018,
      shape: Math.random() < 0.4 ? "rect" : "circle",
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
};
