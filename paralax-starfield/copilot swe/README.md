Parallax Starfield

Descrição

Uma pequena demo de starfield com efeito parallax usando apenas HTML, CSS e JavaScript (Canvas). Fundo preto, estrelas em tons de branco, camadas com velocidades diferentes e controle de velocidade.

Como usar

1. Abra `index.html` no seu navegador (pode arrastar no navegador ou usar um servidor local).
2. Ajuste a velocidade com o slider. Clique em "Pausar" para parar a animação.

Controles

- Velocidade: ajusta a velocidade de deslocamento do starfield.
- Densidade: aumenta ou reduz a quantidade de estrelas (útil para performance).
- Direção: alterna o movimento entre "Para baixo" e "Para cima".

Executando localmente

Você pode abrir `index.html` diretamente no navegador, mas alguns recursos (e modos de desenvolvimento) funcionam melhor servindo por um servidor local simples. Se tiver Python instalado, execute:

```bash
python -m http.server 8000
```

E então abra `http://localhost:8000` no navegador.

Notas

- Ajustei suporte a telas de alta densidade (DPR).
- O código é intencionalmente simples para ser compreensível e fácil de ajustar.
