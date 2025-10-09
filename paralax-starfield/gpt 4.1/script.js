const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const STAR_LAYERS = [
    { count: 50, speed: 0.5, size: 1 },
    { count: 30, speed: 1.2, size: 2 },
    { count: 15, speed: 2, size: 3 }
];

let stars = [];

function randomWhite() {
    const shade = Math.floor(200 + Math.random() * 55);
    return `rgb(${shade},${shade},${shade})`;
}

function createStars() {
    stars = STAR_LAYERS.flatMap(layer => {
        return Array.from({ length: layer.count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: layer.speed,
            size: layer.size,
            color: randomWhite()
        }));
    });
}
createStars();

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
    }
}

function updateStars() {
    for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.x = Math.random() * canvas.width;
            star.y = 0;
            star.color = randomWhite();
        }
    }
}

function animate() {
    updateStars();
    drawStars();
    requestAnimationFrame(animate);
}

animate();
