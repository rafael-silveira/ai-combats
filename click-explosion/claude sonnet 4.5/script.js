document.addEventListener('click', (e) => {
    createExplosion(e.clientX, e.clientY);
});

function createExplosion(x, y) {
    // Criar elemento de explosão principal
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
    document.body.appendChild(explosion);

    // Criar partículas de fogo
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        createParticle(x, y);
    }

    // Remover explosão após a animação
    setTimeout(() => {
        explosion.remove();
    }, 800);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posição inicial no centro da explosão
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Calcular direção aleatória para a partícula
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    // Definir variáveis CSS customizadas para a animação
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    // Variação de tamanho das partículas
    const size = 6 + Math.random() * 8;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Variação no tempo de animação
    const duration = 0.4 + Math.random() * 0.4;
    particle.style.animationDuration = duration + 's';
    
    document.body.appendChild(particle);
    
    // Remover partícula após a animação
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}
