// Parâmetros da árvore
const svg = document.getElementById('treeSVG');
const width = svg.width.baseVal.value;
const height = svg.height.baseVal.value;

function clearSVG() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function drawHeart(x, y, size, color) {
  // Desenha um coração SVG estilizado
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const s = size / 32;
  path.setAttribute('d', `M16 29
    C-8 12, 8 -4, 16 7
    C24 -4, 40 12, 16 29`);
  path.setAttribute('fill', color);
  path.setAttribute('transform', `translate(${x - 16 * s},${y - 16 * s}) scale(${s})`);
  svg.appendChild(path);
  return path;
}

function drawBranch(x1, y1, x2, y2, width, duration, delay) {
  // Desenha um galho animado
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x1);
  line.setAttribute('y2', y1);
  line.setAttribute('stroke', '#7c4d03');
  line.setAttribute('stroke-width', width);
  line.setAttribute('stroke-linecap', 'round');
  svg.appendChild(line);
  anime({
    targets: line,
    x2: x2,
    y2: y2,
    duration: duration,
    delay: delay,
    easing: 'easeOutQuad',
  });
  return line;
}

function animateTree(onComplete) {
  clearSVG();
  // Semente inicial
  const seed = drawHeart(width/2, height-30, 32, '#d72660');
  seed.setAttribute('opacity', 0);
  anime({
    targets: seed,
    translateY: [-(height/2-60), 0],
    opacity: [0, 1],
    duration: 900,
    easing: 'easeOutBounce',
    complete: () => {
      growBranches(onComplete);
    }
  });
}

function growBranches(onComplete) {
  // Parâmetros dos galhos
  const baseX = width/2;
  const baseY = height-30;
  const trunkLen = 120;
  const branches = [
    { angle: -25, len: 90, color: '#d72660' },
    { angle: 0, len: 110, color: '#e57373' },
    { angle: 25, len: 90, color: '#d72660' },
    { angle: -45, len: 60, color: '#e57373' },
    { angle: 45, len: 60, color: '#d72660' },
    { angle: -70, len: 40, color: '#e57373' },
    { angle: 70, len: 40, color: '#d72660' },
  ];
  // Tronco
  const trunk = drawBranch(baseX, baseY, baseX, baseY-trunkLen, 12, 900, 0);
  // Galhos
  setTimeout(() => {
    branches.forEach((b, i) => {
      const rad = (b.angle-90)*Math.PI/180;
      const x2 = baseX + Math.cos(rad)*b.len;
      const y2 = baseY-trunkLen + Math.sin(rad)*b.len;
      drawBranch(baseX, baseY-trunkLen, x2, y2, 6, 700, i*200);
      setTimeout(() => {
        // Folha coração
        drawHeart(x2, y2, 28, b.color);
      }, 700 + i*200);
    });
    // Folha topo
    setTimeout(() => {
      drawHeart(baseX, baseY-trunkLen-18, 32, '#d72660');
      if (onComplete) setTimeout(onComplete, 600);
    }, 700 + branches.length*200);
  }, 900);
}

function startTreeAnimation() {
  animateTree(() => {});
}

// Mensagem de aniversário
const mensagem =
  "Feliz aniversário, meu amor!\n\nQue sua vida floresça como esta árvore: cheia de corações, carinho e sonhos. Obrigado por ser minha inspiração todos os dias. Te amo!";
let typed = null;

function startTyped() {
  if (typed) {
    typed.destroy();
  }
  typed = new Typed('#typed-message', {
    strings: [mensagem],
    typeSpeed: 38,
    backSpeed: 0,
    showCursor: false,
  });
}

function startAll() {
  startTreeAnimation();
  setTimeout(startTyped, 1800);
}

document.getElementById('restart-btn').addEventListener('click', startAll);

// Inicialização automática
window.onload = startAll;
