/* =========================
   FALCO IA® CINEMATIC
========================= */

let animationFrameId = null;

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

function syncCanvasParticles(act = 1) {
  FalcoCanvasEngine.createParticlesForAct(act);

  particles = FalcoCanvasEngine.particles;
  connections = FalcoCanvasEngine.connections;
}

async function loadCorpusDemo() {
  try {
    const response = await fetch("data/corpus-demo.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar el Corpus FALCO®");
    }

    corpusData = await response.json();
    knowledgeNodes = corpusData.nodos.map((nodo) => nodo.titulo);

    FalcoCanvasEngine.setKnowledgeNodes(knowledgeNodes);
    syncCanvasParticles(1);

  } catch (error) {
    console.error("Error cargando Corpus FALCO®:", error);

    knowledgeNodes = [
      "Daño Psíquico",
      "SCL-90",
      "Informe Pericial",
      "Impugnación",
      "Metodología FALCO®"
    ];

    FalcoCanvasEngine.setKnowledgeNodes(knowledgeNodes);
    syncCanvasParticles(1);
  }
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  FalcoCanvasEngine.resize();
}

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  FalcoCanvasEngine.drawCorpusGlow();
  FalcoCanvasEngine.updateParticles();
  particles = FalcoCanvasEngine.particles;
  FalcoCanvasEngine.drawConnections();
  FalcoCanvasEngine.drawParticles();

  if (FalcoPresentationController.running) {
    animationFrameId = requestAnimationFrame(drawScene);
  }
}

window.addEventListener("resize", () => {
  resizeCanvas();
  syncCanvasParticles(1);
});

/* =========================
   SALA DEL CORPUS
========================= */

const enterCorpusRoom = document.getElementById("enterCorpusRoom");
const closeCorpusRoom = document.getElementById("closeCorpusRoom");
const iaCorpusRoom = document.getElementById("iaCorpusRoom");

if (enterCorpusRoom) {
  enterCorpusRoom.addEventListener("click", async () => {
    FalcoPresentationController.pause();

    if (typeof stopAudio === "function") {
      stopAudio();
    }

    iaCorpusRoom.classList.add("active");

    const corpus = await FalcoCorpusLoader.load();

    FalcoCorpusRoom.render(corpus.nodos || []);
  });
}

if (closeCorpusRoom) {
  closeCorpusRoom.addEventListener("click", () => {
    iaCorpusRoom.classList.remove("active");

    FalcoPresentationController.resume();
  });
}

/* =========================
   INIT
========================= */

FalcoCanvasEngine.init();

resizeCanvas();

loadCorpusDemo();

FalcoActController.init();

FalcoActController.showScene(0);

drawScene();

FalcoLifeEngine.init();

FalcoAwakening.init();

FalcoCorpusRoom.init();

FalcoPresentationController.init();