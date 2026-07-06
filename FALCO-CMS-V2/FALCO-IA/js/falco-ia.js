
/* =========================
   FALCO IA® CINEMATIC
========================= */

const scenes = document.querySelectorAll(".ia-scene");
const nextButton = document.getElementById("iaNext");
const prevButton = document.getElementById("iaPrev");
const progressBar = document.getElementById("iaProgressBar");
const actCounter = document.getElementById("iaActCounter");


let presentationRunning = true;
let autoPlayScenes = null;
let animationFrameId = null;


FalcoTimeline.init(scenes.length);

FalcoCamera.init(".falco-ia-cinematic");




function showScene(index) {
  scenes.forEach((scene, i) => {
    scene.classList.toggle("ia-scene-active", i === index);
  });

  const progress = ((index + 1) / scenes.length) * 100;
  progressBar.style.width = progress + "%";

  if (actCounter) {
    actCounter.textContent = `ACTO ${index + 1} / ${scenes.length}`;
  }

FalcoCamera.moveTo(index);

if (index === 0) {
  createParticlesForAct(1);
} else {
  createParticlesForAct(2);
}

}

nextButton.addEventListener("click", () => {
    FalcoTimeline.next(showScene);
});

prevButton.addEventListener("click", () => {
    FalcoTimeline.prev(showScene);
});

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
        FalcoTimeline.next(showScene);
    }

    if (event.key === "ArrowLeft") {
        FalcoTimeline.prev(showScene);
    }

});



function startAutoPlay() {
  stopAutoPlay();

  autoPlayScenes = setInterval(() => {
    if (presentationRunning) {
      FalcoTimeline.next(showScene);
    }
  }, 9000);
}

function stopAutoPlay() {
  if (autoPlayScenes) {
    clearInterval(autoPlayScenes);
    autoPlayScenes = null;
  }
}






/* =========================
   CANVAS CORPUS VIVO
========================= */

const canvas = document.getElementById("falcoIaCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let connections = [];

let knowledgeNodes = [];
let corpusData = null;

async function loadCorpusDemo() {
  try {
    const response = await fetch("data/corpus-demo.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar el Corpus FALCO®");
    }

    corpusData = await response.json();

    knowledgeNodes = corpusData.nodos.map((nodo) => nodo.titulo);

createParticlesForAct(1);

} catch (error) {
    console.error("Error cargando Corpus FALCO®:", error);

    knowledgeNodes = [
      "Daño Psíquico",
      "SCL-90",
      "Informe Pericial",
      "Impugnación",
      "Metodología FALCO®"
    ];

    createParticlesForAct(1);
  }
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticlesForAct(act = 1) {
  particles = [];
  connections = [];





let total = act === 1 ? 1 : Math.min(110, Math.floor((width * height) / 9000));



  for (let i = 0; i < total; i++) {
    const isKnowledgeNode = i < knowledgeNodes.length;

    particles.push({
      x: total === 1 ? width / 2 : width / 2 + (Math.random() - 0.5) * width * 0.72,
      y: total === 1 ? height / 2 : height / 2 + (Math.random() - 0.5) * height * 0.62,
      radius: total === 1 ? 7 : isKnowledgeNode ? Math.random() * 2.6 + 2.2 : Math.random() * 1.7 + 0.4,
      vx: total === 1 ? 0 : (Math.random() - 0.5) * 0.22,
      vy: total === 1 ? 0 : (Math.random() - 0.5) * 0.22,
      alpha: total === 1 ? 0.95 : isKnowledgeNode ? 0.95 : Math.random() * 0.5 + 0.18,
      label: isKnowledgeNode ? knowledgeNodes[i] : null,
      pulse: Math.random() * Math.PI * 2
    });
  }

  if (total > 1) {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && Math.random() > 0.55) {
          connections.push([i, j]);
        }
      }
    }
  }
}

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  drawCorpusGlow();
  updateParticles();
  drawConnections();
  drawParticles();

  if (presentationRunning) {
  animationFrameId = requestAnimationFrame(drawScene);
}
}

function drawCorpusGlow() {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    20,
    width / 2,
    height / 2,
    Math.min(width, height) * 0.45
  );

  gradient.addColorStop(0, "rgba(212,175,55,0.16)");
  gradient.addColorStop(0.45, "rgba(212,175,55,0.06)");
  gradient.addColorStop(1, "rgba(212,175,55,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function updateParticles() {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.pulse += 0.025;

    const marginX = width * 0.12;
    const marginY = height * 0.16;

    if (particle.x < marginX || particle.x > width - marginX) {
      particle.vx *= -1;
    }

    if (particle.y < marginY || particle.y > height - marginY) {
      particle.vy *= -1;
    }
  });
}

function drawConnections() {
  connections.forEach(([a, b]) => {
    const p1 = particles[a];
    const p2 = particles[b];

    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const opacity = Math.max(0, 0.13 - distance / 1500);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(212,175,55,${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    const pulseSize = Math.sin(particle.pulse) * 0.8;
    const radius = Math.max(0.5, particle.radius + pulseSize);

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${particle.alpha})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius * 4.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${particle.alpha * 0.06})`;
    ctx.fill();
  });
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticlesForAct(1);
});



/* =========================
   CORPUS AWAKENING™
========================= */

const corpusAwakening = document.getElementById("corpusAwakening");
const awakeningCanvas = document.getElementById("awakeningCanvas");
const awakeningStep = document.getElementById("awakeningStep");
const awakeningMessage = document.getElementById("awakeningMessage");

let awakeningCtx;
let awakeningNodes = [];
let awakeningAnimation = null;
let awakeningPhase = 0;

function initAwakeningCanvas() {
  if (!awakeningCanvas) return;

  awakeningCtx = awakeningCanvas.getContext("2d");
  awakeningCanvas.width = window.innerWidth;
  awakeningCanvas.height = window.innerHeight;
}

function createAwakeningNodes(total = 1) {
  awakeningNodes = [];

  const cx = awakeningCanvas.width / 2;
  const cy = awakeningCanvas.height / 2;

  for (let i = 0; i < total; i++) {
    awakeningNodes.push({
      x: cx + (Math.random() - 0.5) * awakeningCanvas.width * 0.62,
      y: cy + (Math.random() - 0.5) * awakeningCanvas.height * 0.48,
      r: Math.random() * 2.4 + 1.8,
      pulse: Math.random() * Math.PI * 2,
      label: null
    });
  }

  if (awakeningNodes[0]) {
    awakeningNodes[0].x = cx;
    awakeningNodes[0].y = cy;
    awakeningNodes[0].r = 7;
    awakeningNodes[0].label = "Corpus FALCO®";
  }
}

function drawAwakening() {
  if (!awakeningCtx) return;

  const ctx = awakeningCtx;
  const w = awakeningCanvas.width;
  const h = awakeningCanvas.height;

  ctx.clearRect(0, 0, w, h);

  awakeningNodes.forEach((node, index) => {
    node.pulse += 0.035;

    const active = index <= awakeningPhase * 30;

    if (active && awakeningPhase >= 2) {
      awakeningNodes.forEach((other, j) => {
        if (j <= index || j > awakeningPhase * 30) return;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(212,175,55,${0.10 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    if (active) {
      const size = node.r + Math.sin(node.pulse) * 1.4;

      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55,.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55,.06)";
      ctx.fill();

      if (awakeningPhase >= 4 && node.label) {
        ctx.font = "13px Arial";
        ctx.fillStyle = "rgba(248,236,209,.75)";
        ctx.fillText(node.label, node.x + 14, node.y + 4);
      }
    }
  });

  awakeningAnimation = requestAnimationFrame(drawAwakening);
}

async function runCorpusAwakening() {
  if (!corpusAwakening) return;

  corpusAwakening.classList.add("active");

  initAwakeningCanvas();
  createAwakeningNodes(130);
  awakeningPhase = 0;

  if (awakeningAnimation) {
    cancelAnimationFrame(awakeningAnimation);
  }

  drawAwakening();

  const steps = [
    ["Inicializando Corpus FALCO®", "Todo comienza con una idea."],
    ["Atrayendo conocimiento", "Las primeras unidades comienzan a encenderse."],
    ["Relacionando unidades", "El conocimiento empieza a organizarse."],
    ["Validando criterios", "La estructura toma forma institucional."],
    ["Integrando metodología", "El Corpus FALCO® está listo."]
  ];

  for (let i = 0; i < steps.length; i++) {
    awakeningPhase = i + 1;
    awakeningStep.textContent = steps[i][0];
    awakeningMessage.textContent = steps[i][1];

    await new Promise(resolve => setTimeout(resolve, 900));
  }

  corpusAwakening.classList.remove("active");

  if (awakeningAnimation) {
    cancelAnimationFrame(awakeningAnimation);
    awakeningAnimation = null;
  }
}

window.addEventListener("resize", initAwakeningCanvas);






/* =========================
   SALA DEL CORPUS
========================= */

const enterCorpusRoom = document.getElementById("enterCorpusRoom");
const closeCorpusRoom = document.getElementById("closeCorpusRoom");
const iaCorpusRoom = document.getElementById("iaCorpusRoom");
const corpusNodeList = document.getElementById("corpusNodeList");
const corpusDetail = document.getElementById("corpusDetail");
const corpusTotalNodes = document.getElementById("corpusTotalNodes");




if (enterCorpusRoom) {
  enterCorpusRoom.addEventListener("click", async () => {
    presentationRunning = false;

    if (autoPlayScenes) {
      clearInterval(autoPlayScenes);
      autoPlayScenes = null;
    }

    if (typeof stopAudio === "function") {
      stopAudio();
    }

      




    iaCorpusRoom.classList.add("active");

    const corpus = await FalcoCorpusLoader.load();


console.log(corpus);
console.log(corpus.nodos);


    FalcoCorpusRoom.render(corpus.nodos || []);
  });
}



if (closeCorpusRoom) {
  closeCorpusRoom.addEventListener("click", () => {
    iaCorpusRoom.classList.remove("active");

    presentationRunning = true;

    if (!autoPlayScenes) {
      autoPlayScenes = setInterval(() => {
        if (presentationRunning) {
          FalcoTimeline.next(showScene);
        }
      }, 9000);
    }
  });
}










resizeCanvas();

loadCorpusDemo();

showScene(0);

drawScene();

FalcoLifeEngine.init();



FalcoCorpusRoom.init();

startAutoPlay();
