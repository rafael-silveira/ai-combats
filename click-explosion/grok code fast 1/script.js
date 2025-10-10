document.addEventListener('click', function(event) {
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
        createParticle(event.clientX, event.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random direction and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 100 + 50; // 50 to 150px
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, 1000);
}