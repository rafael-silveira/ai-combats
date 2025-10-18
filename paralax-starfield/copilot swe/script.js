// Parallax starfield em Canvas puro
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Ajuste de DPR para telas de alta resolução
function fitCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  // use clientWidth/Height because canvas uses CSS pixels
  const cssW = canvas.clientWidth || window.innerWidth;
  const cssH = canvas.clientHeight || window.innerHeight;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', fitCanvas);
fitCanvas();

// Configuração das camadas
const LAYERS = [
  {base:80, size: [0.4, 1.0], speed: 0.25, drift: 0.05}, // distante
  {base:40, size: [1.0, 1.8], speed: 0.8, drift: 0.15}, // médio
  {base:20, size: [1.8, 3.2], speed: 1.6, drift: 0.35}, // perto
];

let stars = [];

function rand(a,b){return a + Math.random()*(b-a)}

let density = 1.0; // multiplicador configurável

function createStars(){
  stars = [];
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  LAYERS.forEach((layer) => {
    const count = Math.round(layer.base * density);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: rand(layer.size[0], layer.size[1]),
        speed: layer.speed * (0.7 + Math.random()*0.6),
        drift: (Math.random() - 0.5) * layer.drift,
        phase: Math.random()*Math.PI*2,
        layer
      });
    }
  });
}

createStars();

let last = 0;
let running = true;
let baseSpeed = 1.0;
let direction = 'down';

const speedSlider = document.getElementById('speed');
const densitySlider = document.getElementById('density');
const directionSelect = document.getElementById('direction');
const toggleBtn = document.getElementById('toggle');

speedSlider.addEventListener('input', (e)=>{ baseSpeed = Number(e.target.value); });
densitySlider.addEventListener('input', (e)=>{ density = Number(e.target.value); createStars(); });
directionSelect.addEventListener('change', (e)=>{ direction = e.target.value; });

toggleBtn.addEventListener('click', ()=>{running = !running; toggleBtn.textContent = running? 'Pausar' : 'Retomar'; if(running) last = performance.now();});

function resizeAndRepopulate(){
  fitCanvas();
  createStars();
}

window.addEventListener('orientationchange', resizeAndRepopulate);

function drawStar(x,y,r,alpha){
  // brilho baseado no r (tamanho)
  ctx.beginPath();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.arc(x, y, r/2, 0, Math.PI*2);
  ctx.fill();
}

function loop(t){
  const dt = (t - last) / 1000 || 0;
  last = t;
  if(!running){
    requestAnimationFrame(loop);
    return;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const w = canvas.width / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);

  for(let s of stars){
    const dirMult = direction === 'down' ? 1 : -1;
    // deslocamento vertical simulando movimento
    s.y += s.speed * baseSpeed * dt * 60 * dirMult;
    // pequena deriva horizontal para mais dinamismo
    s.x += s.drift * baseSpeed * dt * 60;

    // efeito de piscada (twinkle) com phase e r
    const alpha = 0.35 + 0.65 * Math.abs(Math.sin((t/1000) * (0.35 + s.r*0.12) + s.phase));

    // desenhar
    drawStar(s.x, s.y, s.r, alpha);

    // reposicionar quando sair da tela (wrap-around suave)
    if(dirMult === 1 && s.y > h + 8){
      s.y = -8 - Math.random()*20;
      s.x = Math.random()*w;
    } else if(dirMult === -1 && s.y < -8){
      s.y = h + 8 + Math.random()*20;
      s.x = Math.random()*w;
    }
    // horizontal wrap
    if(s.x < -8) s.x = w + 8;
    if(s.x > w + 8) s.x = -8;
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame((t)=>{ last = t; loop(t); });

// recriar estrelas se o canvas mudar de tamanho visível
new ResizeObserver(resizeAndRepopulate).observe(canvas);
