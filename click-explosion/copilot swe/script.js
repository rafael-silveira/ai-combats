const stage = document.getElementById('stage');

function rand(min, max){ return Math.random() * (max - min) + min }

function createExplosion(x, y){
  const container = document.createElement('div');
  container.className = 'explosion';
  container.style.left = x + 'px';
  container.style.top = y + 'px';

  // fireball
  const fireball = document.createElement('div');
  fireball.className = 'fireball';
  container.appendChild(fireball);

  // puff
  const puff = document.createElement('div');
  puff.className = 'puff';
  container.appendChild(puff);

  // particles
  const particles = document.createElement('div');
  particles.className = 'particles';
  const count = Math.floor(rand(14, 26));
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.round(rand(6, 18));
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    const angle = rand(0, Math.PI * 2);
    const dist = rand(60, 220);
    const tx = Math.cos(angle) * dist + 'px';
    const ty = Math.sin(angle) * dist + 'px';
    const dur = rand(650, 1200);
    p.style.setProperty('--tx', tx);
    p.style.setProperty('--ty', ty);
    p.style.setProperty('--dur', dur + 'ms');
    // color variation
    const r = Math.floor(rand(200,255));
    const g = Math.floor(rand(80,180));
    p.style.background = `rgba(${r},${g},0,0.95)`;
    p.style.boxShadow = `0 0 ${rand(8,20)}px rgba(${r},${g},0,0.9)`;
    particles.appendChild(p);
    // force reflow then animate
    requestAnimationFrame(()=>{
      p.classList.add('animate');
    });
  }
  container.appendChild(particles);

  stage.appendChild(container);

  // start fireball and puff animations
  requestAnimationFrame(()=>{
    fireball.classList.add('animate');
    puff.classList.add('animate');
  });

  // cleanup after animations
  const cleanupTime = 1800;
  setTimeout(()=>{
    container.remove();
  }, cleanupTime);
}

stage.addEventListener('click', (e)=>{
  const rect = stage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createExplosion(x,y);
});
