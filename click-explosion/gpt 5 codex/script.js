const stage = document.querySelector('.stage');
const hint = document.querySelector('.hint');

if (stage) {
  stage.addEventListener('pointerdown', handlePointerDown, { passive: true });
  stage.addEventListener('pointermove', handlePointerMove, { passive: true });
}

function handlePointerDown(event) {
  if (hint && !hint.classList.contains('hidden')) {
    hint.classList.add('hidden');
  }

  spawnExplosion(event.clientX, event.clientY);
}

function handlePointerMove(event) {
  if (!event.buttons) return;
  spawnExplosion(event.clientX, event.clientY, true);
}

function spawnExplosion(x, y, isTrail = false) {
  const explosion = document.createElement('div');
  explosion.className = 'explosion';

  const size = randomBetween(140, 260);
  explosion.style.setProperty('--size', `${size}px`);

  if (isTrail) {
    explosion.style.animationDuration = `${randomBetween(360, 520)}ms`;
    explosion.style.opacity = '0.75';
  }

  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  explosion.style.setProperty('--rotation', `${Math.random() * 360}deg`);

  document.body.appendChild(explosion);

  const remove = () => explosion.remove();
  explosion.addEventListener('animationend', remove, { once: true });
  setTimeout(remove, 1200);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
