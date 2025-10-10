const canvas = document.getElementById('explosion-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

class Particle {
  constructor(x, y) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 4 + 2;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = Math.random() * 18 + 12;
    this.life = 0;
    this.maxLife = Math.random() * 0.3 + 0.7;
    this.color = `rgba(${220 + Math.random()*35}, ${80 + Math.random()*60}, 0, 1)`;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.radius *= 0.97;
    this.life += dt;
  }
  draw(ctx) {
    const alpha = 1 - this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, 'rgba(255, 200, 50, 1)');
    grad.addColorStop(0.3, this.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

let explosions = [];

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const particles = [];
  for (let i = 0; i < 32; i++) {
    particles.push(new Particle(x, y));
  }
  explosions.push(particles);
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  const dt = 0.016;
  for (let i = explosions.length - 1; i >= 0; i--) {
    const particles = explosions[i];
    for (let j = particles.length - 1; j >= 0; j--) {
      const p = particles[j];
      p.update(dt);
      p.draw(ctx);
      if (p.life > p.maxLife || p.radius < 2) {
        particles.splice(j, 1);
      }
    }
    if (particles.length === 0) {
      explosions.splice(i, 1);
    }
  }
  requestAnimationFrame(animate);
}

animate();
