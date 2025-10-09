// Configuração do canvas
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Ajusta o canvas para o tamanho da janela
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Configuração das estrelas
const starLayers = [
    { count: 100, speed: 0.2, size: 1, opacity: 0.3 },  // Camada mais distante
    { count: 75, speed: 0.5, size: 1.5, opacity: 0.5 },  // Camada intermediária
    { count: 50, speed: 1, size: 2, opacity: 0.7 },      // Camada intermediária-próxima
    { count: 30, speed: 2, size: 2.5, opacity: 0.9 }     // Camada mais próxima
];

// Array para armazenar todas as estrelas
const stars = [];

// Classe Star
class Star {
    constructor(layer) {
        this.layer = layer;
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.brightness = 0.5 + Math.random() * 0.5; // Variação no brilho
    }

    update() {
        // Move a estrela para a esquerda (simulando movimento da nave para direita)
        this.x -= this.layer.speed;

        // Se a estrela sair da tela pela esquerda, reposiciona na direita
        if (this.x < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    draw() {
        ctx.save();
        
        // Cor da estrela com variação de brilho
        const alpha = this.layer.opacity * this.brightness;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        
        // Desenha a estrela
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.layer.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Adiciona um pequeno brilho para estrelas maiores
        if (this.layer.size > 2) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.layer.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Cria todas as estrelas
function initStars() {
    stars.length = 0;
    starLayers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            stars.push(new Star(layer));
        }
    });
}

// Animação
function animate() {
    // Limpa o canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Atualiza e desenha todas as estrelas
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

// Inicializa e começa a animação
initStars();
animate();

// Reinicializa as estrelas quando a janela é redimensionada
window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});
