// Explosão ao clique — bola de fogo com partículas
(function(){
  const LAYER_CLASS = 'explosion-layer';

  // Create a visual layer that covers the viewport
  const layer = document.createElement('div');
  layer.className = LAYER_CLASS;
  document.body.appendChild(layer);

  // Settings
  const PARTICLES = 28; // número de partículas por clique
  const DURATION = 900; // ms
  const GRAVITY = 0.0025; // px / ms^2

  // helpers
  function rand(min, max){ return Math.random() * (max - min) + min }
  function choose(arr){ return arr[Math.floor(Math.random()*arr.length)] }

  // color palette for fire -> from bright yellow to deep red
  const COLORS = [
    'rgb(255,250,200)',
    'rgb(255,220,80)',
    'rgb(255,140,40)',
    'rgb(220,60,20)'
  ];

  function createParticle(x, y){
    const el = document.createElement('div');
    el.className = 'particle core';
    const size = rand(6, 26);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    const color = choose(COLORS);
    el.style.background = color;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.opacity = '1';
    layer.appendChild(el);

    // physics
    const angle = rand(0, Math.PI*2);
    const speed = rand(0.15, 0.8) * (40 / Math.max(size,8)); // smaller = faster
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed * -1; // upward bias

    const start = performance.now();

    function frame(now){
      const t = now - start;
      const progress = Math.min(1, t / DURATION);

      // simple motion: position += velocity * dt; velocity += gravity * dt
      // dt in ms
      const dt = 16; // approximate per-frame delta for easing look

      // ease out radial (slow down outward velocity)
      const ease = 1 - Math.pow(progress, 2);

      const cx = x + vx * t * ease;
      const cy = y + (vy * t * ease) + (GRAVITY * t * t / 2);

      el.style.transform = `translate(${cx - x}px, ${cy - y}px) scale(${1 - 0.4*progress})`;
      el.style.opacity = String(1 - progress);

      if(progress < 1){
        requestAnimationFrame(frame);
      } else {
        el.remove();
      }
    }

    requestAnimationFrame(frame);
  }

  function createShock(x,y){
    const s = document.createElement('div');
    s.className = 'shock';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    layer.appendChild(s);

    const start = performance.now();
    function frame(now){
      const t = now - start;
      const progress = Math.min(1, t / (DURATION * 0.9));
      const scale = 1 + progress * 6;
      s.style.transform = `translate(-50%,-50%) scale(${scale})`;
      s.style.opacity = String(1 - progress);
      s.style.borderColor = `rgba(255, ${Math.floor(180 + 60*progress)}, ${Math.floor(40 - 30*progress)}, ${0.9 - 0.9*progress})`;
      if(progress < 1) requestAnimationFrame(frame);
      else s.remove();
    }
    requestAnimationFrame(frame);
  }

  // Handle click or touch
  function spawnExplosion(clientX, clientY){
    const rect = document.documentElement.getBoundingClientRect();
    const x = clientX;
    const y = clientY;

    // core big ball
    const core = document.createElement('div');
    core.className = 'particle core';
    const coreSize = rand(28, 76);
    core.style.width = coreSize + 'px';
    core.style.height = coreSize + 'px';
    core.style.left = x + 'px';
    core.style.top = y + 'px';
    core.style.background = 'radial-gradient(circle at 30% 30%, #fff5d6 0%, #ffd05b 25%, #ff6b35 60%, #9b1f14 100%)';
    core.style.filter = 'blur(8px) saturate(140%)';
    layer.appendChild(core);

    const start = performance.now();
    function coreFrame(now){
      const t = now - start;
      const progress = Math.min(1, t / DURATION);
      core.style.transform = `translate(-50%,-50%) scale(${1 + 0.6*progress})`;
      core.style.opacity = String(1 - progress);
      if(progress < 1) requestAnimationFrame(coreFrame);
      else core.remove();
    }
    requestAnimationFrame(coreFrame);

    // shock wave
    createShock(x, y);

    // particles
    for(let i=0;i<PARTICLES;i++){
      // small timeout spread to make it look organic
      const delay = rand(0, 80);
      setTimeout(()=> createParticle(x, y), delay);
    }
  }

  // use pointerdown to support mouse/touch/stylus
  window.addEventListener('pointerdown', (e) => {
    // ignore if clicking elements intentionally (like controls) — here everything is visual so spawn always
    spawnExplosion(e.clientX, e.clientY);
  });

})();
