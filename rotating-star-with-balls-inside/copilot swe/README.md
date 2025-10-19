# Estrela Rotativa com Bolas (Demo)

Demo em HTML/CSS/JS que mostra uma estrela girando com 10 bolas dentro.

Como usar
- Abra `index.html` no seu navegador (arraste para o navegador ou use um servidor local).
- Ajuste a velocidade de rotação e gravidade com os controles.
- Clique e arraste uma bola para movê-la.

Notas técnicas
- Canvas 2D puro, física simples (gravidade, colisões bolas-bolas elásticas e contenção pela estrela).
- O modelo é simplificado: colisão com a estrela é resolvida projetando para dentro e refletindo a velocidade.

Próximos passos
- Melhorar colisões com bordas complexas da estrela (detecção por arestas) e resposta precisa.
- Otimizações: broadphase para colisões, massa e restituição configuráveis.

Controles
- Vel. rotação: controla a velocidade angular da estrela (pode ser negativa).
- Gravidade: controla a força da gravidade aplicada às bolas.
- Reset: reposiciona as bolas no interior da estrela.

Dicas
- Clique e arraste uma bola para reposicioná-la e dar impulso.
- Para melhores resultados use um navegador moderno com aceleração de hardware.
