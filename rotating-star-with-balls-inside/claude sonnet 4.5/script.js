const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurar canvas
canvas.width = 800;
canvas.height = 800;

// Centro do canvas
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Configurações da estrela
const starRadius = 250;
const starPoints = 5;
let starRotation = 0;
const starRotationSpeed = 0.01;

// Configurações das bolas
const balls = [];
const numBalls = 10;
const gravity = 0.5;
const friction = 0.99;
const restitution = 0.8; // Elasticidade das colisões

// Classe Ball
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.radius = radius;
        this.color = color;
        this.mass = radius;
    }

    update() {
        // Aplicar gravidade
        this.vy += gravity;

        // Aplicar velocidade
        this.x += this.vx;
        this.y += this.vy;

        // Verificar colisão com os limites da estrela
        this.checkStarCollision();

        // Aplicar atrito
        this.vx *= friction;
        this.vy *= friction;
    }

    checkStarCollision() {
        // Converter posição para sistema de coordenadas relativo ao centro
        const relX = this.x - centerX;
        const relY = this.y - centerY;
        
        // Verificar se está dentro da estrela
        if (!this.isInsideStar(relX, relY)) {
            // Encontrar o ponto mais próximo na borda da estrela
            const angle = Math.atan2(relY, relX);
            const starEdgeRadius = this.getStarRadiusAtAngle(angle - starRotation);
            
            // Calcular distância do centro
            const distance = Math.sqrt(relX * relX + relY * relY);
            
            if (distance + this.radius > starEdgeRadius) {
                // Reposicionar a bola para dentro da estrela
                const penetration = distance + this.radius - starEdgeRadius;
                const normalX = relX / distance;
                const normalY = relY / distance;
                
                this.x -= normalX * penetration;
                this.y -= normalY * penetration;
                
                // Refletir velocidade
                const dotProduct = this.vx * normalX + this.vy * normalY;
                this.vx = (this.vx - 2 * dotProduct * normalX) * restitution;
                this.vy = (this.vy - 2 * dotProduct * normalY) * restitution;
            }
        }
    }

    isInsideStar(x, y) {
        const angle = Math.atan2(y, x);
        const distance = Math.sqrt(x * x + y * y);
        const starEdgeRadius = this.getStarRadiusAtAngle(angle - starRotation);
        return distance + this.radius < starEdgeRadius;
    }

    getStarRadiusAtAngle(angle) {
        // Normalizar ângulo
        angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        
        // Calcular raio da estrela em um ângulo específico
        const anglePerPoint = (Math.PI * 2) / starPoints;
        const outerRadius = starRadius;
        const innerRadius = starRadius * 0.4;
        
        // Encontrar em qual seção da estrela estamos
        const section = Math.floor(angle / anglePerPoint);
        const angleInSection = angle % anglePerPoint;
        const halfSection = anglePerPoint / 2;
        
        // Interpolar entre raio externo e interno
        if (angleInSection < halfSection) {
            // Indo do ponto externo para o interno
            const t = angleInSection / halfSection;
            return outerRadius + (innerRadius - outerRadius) * t;
        } else {
            // Indo do ponto interno para o externo
            const t = (angleInSection - halfSection) / halfSection;
            return innerRadius + (outerRadius - innerRadius) * t;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Adicionar brilho
        const gradient = ctx.createRadialGradient(
            this.x - this.radius / 3,
            this.y - this.radius / 3,
            0,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Função para criar estrela
function createStarPath() {
    const outerRadius = starRadius;
    const innerRadius = starRadius * 0.4;
    
    ctx.beginPath();
    
    for (let i = 0; i <= starPoints * 2; i++) {
        const angle = (i * Math.PI) / starPoints - Math.PI / 2 + starRotation;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
}

// Função para desenhar a estrela
function drawStar() {
    createStarPath();
    
    // Preenchimento com gradiente
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, starRadius);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.5, '#ffed4e');
    gradient.addColorStop(1, '#ff8c00');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Borda da estrela
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Brilho interno
    ctx.save();
    ctx.clip();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
}

// Inicializar bolas
function initBalls() {
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
        '#dfe6e9', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'
    ];
    
    for (let i = 0; i < numBalls; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const distance = Math.random() * starRadius * 0.5;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const radius = 15 + Math.random() * 15;
        const color = colors[i % colors.length];
        
        balls.push(new Ball(x, y, radius, color));
    }
}

// Verificar colisões entre bolas
function checkBallCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ball1 = balls[i];
            const ball2 = balls[j];
            
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ball1.radius + ball2.radius;
            
            if (distance < minDistance) {
                // Colisão detectada
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Rotacionar posições
                const pos1 = { x: 0, y: 0 };
                const pos2 = rotate(dx, dy, sin, cos, true);
                
                // Rotacionar velocidades
                const vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);
                const vel2 = rotate(ball2.vx, ball2.vy, sin, cos, true);
                
                // Colisão elástica 1D
                const vxTotal = vel1.x - vel2.x;
                vel1.x = ((ball1.mass - ball2.mass) * vel1.x + 2 * ball2.mass * vel2.x) / 
                         (ball1.mass + ball2.mass);
                vel2.x = vxTotal + vel1.x;
                
                // Atualizar posições para evitar sobreposição
                const overlap = minDistance - distance;
                pos2.x += overlap;
                
                // Rotacionar de volta
                const pos2Final = rotate(pos2.x, pos2.y, sin, cos, false);
                const vel1Final = rotate(vel1.x, vel1.y, sin, cos, false);
                const vel2Final = rotate(vel2.x, vel2.y, sin, cos, false);
                
                ball2.x = ball1.x + pos2Final.x;
                ball2.y = ball1.y + pos2Final.y;
                
                ball1.vx = vel1Final.x;
                ball1.vy = vel1Final.y;
                ball2.vx = vel2Final.x;
                ball2.vy = vel2Final.y;
            }
        }
    }
}

// Função auxiliar para rotação
function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

// Loop de animação
function animate() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar rotação da estrela
    starRotation += starRotationSpeed;
    
    // Desenhar estrela
    drawStar();
    
    // Usar clip para limitar as bolas dentro da estrela
    ctx.save();
    createStarPath();
    ctx.clip();
    
    // Atualizar e desenhar bolas
    balls.forEach(ball => {
        ball.update();
    });
    
    // Verificar colisões entre bolas
    checkBallCollisions();
    
    // Desenhar bolas
    balls.forEach(ball => {
        ball.draw();
    });
    
    ctx.restore();
    
    requestAnimationFrame(animate);
}

// Iniciar
initBalls();
animate();
