const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numLayers = 3;
const speeds = [0.5, 1, 2]; // Different speeds for parallax
const numStarsPerLayer = [100, 50, 25]; // Fewer stars in foreground

for (let layer = 0; layer < numLayers; layer++) {
    for (let i = 0; i < numStarsPerLayer[layer]; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: speeds[layer],
            size: Math.random() * 2 + 1, // Size 1-3
            layer: layer
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.x -= star.speed;
        if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();