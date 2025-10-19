// Rotating star with balls physics demo
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

window.addEventListener('resize', resize);
resize();

// Controls
const rotationControl = document.getElementById('rotationSpeed');
const gravityControl = document.getElementById('gravity');
const resetBtn = document.getElementById('reset');

// Scene params
let rotation = 0;
let rotationSpeed = parseFloat(rotationControl.value);
let gravity = parseFloat(gravityControl.value);

rotationControl.addEventListener('input', e=> rotationSpeed = parseFloat(e.target.value));
gravityControl.addEventListener('input', e=> gravity = parseFloat(e.target.value));
resetBtn.addEventListener('click', init);

// Star geometry
const star = {
  x: 0,
  y: 0,
  outerR: 240,
  innerR: 100,
  points: 5
};

class Ball {
  constructor(x,y,r){
    this.x = x; this.y = y; this.r = r;
    this.vx = (Math.random()-0.5)*2; this.vy = (Math.random()-0.5)*2;
    this.color = `hsl(${Math.random()*360} 70% 60%)`;
  }
}

let balls = [];
const BALL_COUNT = 10;

function generateStarPath(cx,cy,outerR,innerR,points,angle=0){
  const path = new Path2D();
  const step = Math.PI / points;
  for(let i=0;i<2*points;i++){
    const r = (i%2===0) ? outerR : innerR;
    const a = angle + i * step - Math.PI/2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if(i===0) path.moveTo(x,y); else path.lineTo(x,y);
  }
  path.closePath();
  return path;
}

function generateStarPoints(cx,cy,outerR,innerR,points,angle=0){
  const arr = [];
  const step = Math.PI / points;
  for(let i=0;i<2*points;i++){
    const r = (i%2===0) ? outerR : innerR;
    const a = angle + i * step - Math.PI/2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    arr.push({x,y});
  }
  return arr;
}

function pointInStar(px,py){
  // Use isPointInPath
  return ctx.isPointInPath(generateStarPath(star.x,star.y,star.outerR,star.innerR,star.points,rotation), px, py);
}

function init(){
  const rect = canvas.getBoundingClientRect();
  star.x = rect.width/2;
  star.y = rect.height/2;
  balls = [];
  for(let i=0;i<BALL_COUNT;i++){
    // place inside star bounding circle
    const angle = Math.random()*Math.PI*2;
    const radius = Math.random()*(star.innerR-30);
    const x = star.x + Math.cos(angle)*radius;
    const y = star.y + Math.sin(angle)*radius;
    const r = 10 + Math.random()*10;
    balls.push(new Ball(x,y,r));
  }
}

init();

// Physics helper: collision between two balls (elastic)
function resolveBallCollision(a,b){
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx,dy) || 0.0001;
  const overlap = a.r + b.r - dist;
  if(overlap > 0){
    // push them apart
    const nx = dx/dist, ny = dy/dist;
    const push = nx * overlap * 0.5, pky = ny * overlap * 0.5;
    a.x -= push; a.y -= pky; b.x += push; b.y += pky;
    // exchange velocities along normal
    const dvx = b.vx - a.vx;
    const dvy = b.vy - a.vy;
    const vrel = dvx*nx + dvy*ny;
    if(vrel < 0){
      const impulse = vrel * -1;
      const invMass = 1; // equal mass
      a.vx -= nx * impulse * 0.5; a.vy -= ny * impulse * 0.5;
      b.vx += nx * impulse * 0.5; b.vy += ny * impulse * 0.5;
    }
  }
}

function update(dt){
  rotation += rotationSpeed * dt * 0.001;
  // star rotating around center implicit via rotation angle when checking collisions
  // integrate
  for(let ball of balls){
    ball.vy += gravity * dt * 0.001 * 60 * 0.5; // tuned
    ball.x += ball.vx * dt * 0.06;
    ball.y += ball.vy * dt * 0.06;
  }

  // ball-ball collisions
  for(let i=0;i<balls.length;i++){
    for(let j=i+1;j<balls.length;j++) resolveBallCollision(balls[i], balls[j]);
  }

  // collisions with star polygon: check distance to each edge and resolve
  const starPoints = generateStarPoints(star.x, star.y, star.outerR, star.innerR, star.points, rotation);
  const starPath = generateStarPath(star.x, star.y, star.outerR, star.innerR, star.points, rotation);
  for(let ball of balls){
    // first, if completely outside center test, we still want to push inside via edge checks
    for(let i=0;i<starPoints.length;i++){
      const p1 = starPoints[i];
      const p2 = starPoints[(i+1) % starPoints.length];
      const ex = p2.x - p1.x, ey = p2.y - p1.y;
      const len2 = ex*ex + ey*ey || 0.0001;
      // projection t
      let t = ((ball.x - p1.x)*ex + (ball.y - p1.y)*ey) / len2;
      t = Math.max(0, Math.min(1, t));
      const cxp = p1.x + ex * t;
      const cyp = p1.y + ey * t;
      const dx = ball.x - cxp, dy = ball.y - cyp;
      const dist = Math.hypot(dx, dy);
      if(dist < ball.r + 0.001){
        // determine inward normal for this edge
        const nxCand = -ey; const nyCand = ex; // perpendicular
        // test which perpendicular points to interior
        const midx = (p1.x + p2.x) * 0.5; const midy = (p1.y + p2.y) * 0.5;
        const testInX = midx + nxCand * 0.01; const testInY = midy + nyCand * 0.01;
        let interiorNx = nxCand, interiorNy = nyCand;
        if(!ctx.isPointInPath(starPath, testInX, testInY)){
          interiorNx = -nxCand; interiorNy = -nyCand;
        }
        const nlen = Math.hypot(interiorNx, interiorNy) || 0.0001;
        const nx = interiorNx / nlen, ny = interiorNy / nlen;
        const penetration = ball.r - dist;
        // push ball inside
        ball.x += nx * penetration;
        ball.y += ny * penetration;
        // reflect velocity along normal with restitution
        const vn = ball.vx * nx + ball.vy * ny;
        if(vn < 0){
          const restitution = 0.8;
          ball.vx -= (1 + restitution) * vn * nx;
          ball.vy -= (1 + restitution) * vn * ny;
          // small tangential friction
          ball.vx *= 0.995; ball.vy *= 0.995;
        }
      }
    }
    // If still outside center, do a coarse correction (keep inside main bounding)
    if(!ctx.isPointInPath(starPath, ball.x, ball.y)){
      const dx = star.x - ball.x;
      const dy = star.y - ball.y;
      const d = Math.hypot(dx,dy) || 0.0001;
      ball.x += dx/d * 1.5; ball.y += dy/d * 1.5;
      const nx = dx/d, ny = dy/d;
      const vn = ball.vx*nx + ball.vy*ny;
      ball.vx -= 1.2 * vn * nx; ball.vy -= 1.2 * vn * ny;
    }
  }

  // contain to canvas bounds softly
  const rect = canvas.getBoundingClientRect();
  for(let b of balls){
    if(b.x - b.r < 0){ b.x = b.r; b.vx = Math.abs(b.vx)*0.6; }
    if(b.x + b.r > rect.width){ b.x = rect.width - b.r; b.vx = -Math.abs(b.vx)*0.6; }
    if(b.y - b.r < 0){ b.y = b.r; b.vy = Math.abs(b.vy)*0.6; }
    if(b.y + b.r > rect.height){ b.y = rect.height - b.r; b.vy = -Math.abs(b.vy)*0.6; }
  }
}

function draw(){
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0,0,rect.width, rect.height);

  // draw star
  ctx.save();
  ctx.translate(star.x, star.y);
  ctx.rotate(rotation);
  ctx.translate(-star.x, -star.y);

  // fill star with gradient
  const grad = ctx.createLinearGradient(star.x-star.outerR,star.y-star.outerR, star.x+star.outerR, star.y+star.outerR);
  grad.addColorStop(0,'#ffd86b');
  grad.addColorStop(0.5,'#ff9f6b');
  grad.addColorStop(1,'#ff6b9a');
  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 4;
  ctx.fill(generateStarPath(star.x, star.y, star.outerR, star.innerR, star.points, rotation));
  ctx.stroke(generateStarPath(star.x, star.y, star.outerR, star.innerR, star.points, rotation));
  ctx.restore();

  // draw balls
  for(let b of balls){
    ctx.beginPath();
    ctx.fillStyle = b.color;
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.2)';
    ctx.stroke();
  }

  // optional overlay
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  ctx.fillRect(0,0,rect.width,rect.height);
}

let last = performance.now();
function frame(t){
  const dt = t - last; last = t;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// small interaction: move gravity toggle via mouse down to let user flick balls
let dragging = false; let dragBall = null;
canvas.addEventListener('pointerdown', e=>{
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.x, y = e.clientY - rect.y;
  // find nearest ball
  let nearest = null, nd = 1e9;
  for(let b of balls){
    const d = Math.hypot(b.x-x,b.y-y);
    if(d < nd && d < b.r+10){ nd = d; nearest = b; }
  }
  if(nearest){ dragging = true; dragBall = nearest; }
});
canvas.addEventListener('pointermove', e=>{
  if(dragging && dragBall){
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.x, y = e.clientY - rect.y;
    dragBall.x = x; dragBall.y = y;
    dragBall.vx = (Math.random()-0.5)*2; dragBall.vy = (Math.random()-0.5)*2;
  }
});
canvas.addEventListener('pointerup', e=>{ dragging=false; dragBall=null; });

// handle DPI resize when page loaded
window.addEventListener('load', ()=>{ resize(); init(); });
