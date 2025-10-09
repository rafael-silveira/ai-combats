const LAYERS = [
  {
    density: 0.00022,
    speed: 22,
    radius: [0.6, 1.1],
    brightness: [0.35, 0.55]
  },
  {
    density: 0.00014,
    speed: 45,
    radius: [0.9, 1.8],
    brightness: [0.45, 0.7]
  },
  {
    density: 0.00009,
    speed: 90,
    radius: [1.4, 2.5],
    brightness: [0.55, 0.95]
  }
];

const TWINKLE_SPEED = 1.3;
const MOUSE_INFLUENCE = 18;

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let dpr = 1;
let viewWidth = window.innerWidth;
let viewHeight = window.innerHeight;
let stars = [];
let lastTimestamp = 0;
let viewTilt = { x: 0, targetX: 0, y: 0, targetY: 0 };

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  viewWidth = window.innerWidth;
  viewHeight = window.innerHeight;

  canvas.style.width = `${viewWidth}px`;
  canvas.style.height = `${viewHeight}px`;
  canvas.width = Math.floor(viewWidth * dpr);
  canvas.height = Math.floor(viewHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createStars() {
  const area = viewWidth * viewHeight;
  stars = LAYERS.flatMap((layer, layerIndex) => {
    const count = Math.ceil(area * layer.density);
    return Array.from({ length: count }, () => ({
      layerIndex,
      x: Math.random() * viewWidth,
      y: Math.random() * viewHeight,
      baseRadius: randomBetween(...layer.radius),
      baseBrightness: randomBetween(...layer.brightness),
      offset: Math.random() * Math.PI * 2
    }));
  });
}

function update(delta) {
  stars.forEach((star) => {
    const layer = LAYERS[star.layerIndex];
    const speed = (layer.speed / 1000) * delta;
    star.x -= speed + viewTilt.x * 0.25;
    star.y += viewTilt.y * 0.15;

    if (star.x < -star.baseRadius * 2) {
      star.x = viewWidth + randomBetween(0, viewWidth * 0.15);
      star.y = Math.random() * viewHeight;
    }
    if (star.y < -star.baseRadius * 2) {
      star.y = viewHeight + randomBetween(0, viewHeight * 0.15);
      star.x = Math.random() * viewWidth;
    } else if (star.y > viewHeight + star.baseRadius * 2) {
      star.y = -randomBetween(0, viewHeight * 0.15);
      star.x = Math.random() * viewWidth;
    }
  });
}

function draw(time) {
  const delta = Math.min(time - lastTimestamp, 40);
  lastTimestamp = time;

  ctx.fillStyle = "rgba(0, 0, 8, 0.85)";
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  const tiltEase = 0.12;
  viewTilt.x += (viewTilt.targetX - viewTilt.x) * tiltEase;
  viewTilt.y += (viewTilt.targetY - viewTilt.y) * tiltEase;

  stars.forEach((star) => {
    const layer = LAYERS[star.layerIndex];
    const twinkle = (Math.sin(time * 0.001 * TWINKLE_SPEED + star.offset) + 1) / 2;
    const brightness = star.baseBrightness + twinkle * 0.3;
    const radius = star.baseRadius * (1 + twinkle * 0.45);

    const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, radius);

    const color = Math.min(255, Math.floor(200 + brightness * 55));
    gradient.addColorStop(0, `rgba(${color}, ${color}, 255, 1)`);
    gradient.addColorStop(0.35, `rgba(${color}, ${color}, 255, 0.9)`);
    gradient.addColorStop(1, "rgba(200, 215, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  update(delta);
  requestAnimationFrame(draw);
}

function handlePointer(event) {
  const centerX = viewWidth / 2;
  const centerY = viewHeight / 2;
  const x = "touches" in event ? event.touches[0].clientX : event.clientX;
  const y = "touches" in event ? event.touches[0].clientY : event.clientY;

  viewTilt.targetX = ((x - centerX) / centerX) * MOUSE_INFLUENCE;
  viewTilt.targetY = ((y - centerY) / centerY) * MOUSE_INFLUENCE;
}

function resetPointer() {
  viewTilt.targetX = 0;
  viewTilt.targetY = 0;
}

function init() {
  resizeCanvas();
  createStars();
  lastTimestamp = performance.now();
  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
});

window.addEventListener("mousemove", handlePointer);
window.addEventListener("touchmove", handlePointer, { passive: true });
window.addEventListener("mouseleave", resetPointer);
window.addEventListener("touchend", resetPointer);
window.addEventListener("touchcancel", resetPointer);

init();
