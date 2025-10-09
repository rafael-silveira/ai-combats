const canvas = document.getElementById('starfield');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 800;
const speed = 0.05;

// Inicializa as estrelas com posições aleatórias
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        pz: Math.random() * canvas.width // previous z
    });
}

function update() {
    for (let i = 0; i < numStars; i++) {
        stars[i].z -= speed;

        if (stars[i].z < 1) {
            stars[i].z = canvas.width;
            stars[i].x = Math.random() * canvas.width - canvas.width / 2;
            stars[i].y = Math.random() * canvas.height - canvas.height / 2;
            stars[i].pz = stars[i].z;
        }
    }
}

function draw() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);

    for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        const sx = (star.x / star.z) * canvas.width;
        const sy = (star.y / star.z) * canvas.height;

        const r = (1 - star.z / canvas.width) * 2.5;

        // Define a cor da estrela com base na distância para um efeito de brilho
        const alpha = (1 - star.z / canvas.width) * 0.8;
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.beginPath();
        context.arc(sx, sy, r, 0, Math.PI * 2);
        context.fill();
    }

    context.restore();
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

// Redimensiona o canvas se a janela mudar de tamanho
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

animate();
