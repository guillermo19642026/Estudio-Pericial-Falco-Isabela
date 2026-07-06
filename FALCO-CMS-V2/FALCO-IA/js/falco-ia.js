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

function syncCanvasParticles(act = 1) {
  FalcoCanvasEngine.createParticlesForAct(act);
  particles = FalcoCanvasEngine.particles;
  connections = FalcoCanvasEngine.connections;
}

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
    syncCanvasParticles(1);
  } else {
    syncCanvasParticles(2);
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

  if (FalcoCanvasEngine) {
    FalcoCanvasEngine.resize();
  }
}

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  FalcoCanvasEngine.drawCorpusGlow();
  FalcoCanvasEngine.updateParticles();
  particles = FalcoCanvasEngine.particles;
  FalcoCanvasEngine.drawConnections();
  FalcoCanvasEngine.drawParticles();

  if (presentationRunning) {
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

FalcoCanvasEngine.init();

resizeCanvas();

loadCorpusDemo();

showScene(0);

drawScene();

FalcoLifeEngine.init();

FalcoAwakening.init();

FalcoCorpusRoom.init();

startAutoPlay();