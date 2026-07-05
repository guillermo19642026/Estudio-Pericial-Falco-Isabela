/* =========================
   FALCO IA® CINEMATIC
========================= */

const scenes = document.querySelectorAll(".ia-scene");
const nextButton = document.getElementById("iaNext");
const prevButton = document.getElementById("iaPrev");
const progressBar = document.getElementById("iaProgressBar");
const actCounter = document.getElementById("iaActCounter");


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

showScene(0);


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

    createParticles();
  } catch (error) {
    console.error("Error cargando Corpus FALCO®:", error);

    knowledgeNodes = [
      "Daño Psíquico",
      "SCL-90",
      "Informe Pericial",
      "Impugnación",
      "Metodología FALCO®"
    ];

    createParticles();
  }
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  connections = [];

  const total = Math.min(110, Math.floor((width * height) / 9000));

  for (let i = 0; i < total; i++) {
    const isKnowledgeNode = i < knowledgeNodes.length;

    particles.push({
      x: width / 2 + (Math.random() - 0.5) * width * 0.72,
      y: height / 2 + (Math.random() - 0.5) * height * 0.62,
      radius: isKnowledgeNode ? Math.random() * 2.6 + 2.2 : Math.random() * 1.7 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: isKnowledgeNode ? 0.95 : Math.random() * 0.5 + 0.18,
      label: isKnowledgeNode ? knowledgeNodes[i] : null,
      pulse: Math.random() * Math.PI * 2
    });
  }

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

function drawScene() {
  ctx.clearRect(0, 0, width, height);

  drawCorpusGlow();
  updateParticles();
  drawConnections();
  drawParticles();

  requestAnimationFrame(drawScene);
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
    const radius = particle.radius + pulseSize;

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
  createParticles();
});



/* =========================
   FALCO LIFE ENGINE™
========================= */

function animateLife() {
  const knowledgeNodes = document.querySelectorAll(".ia-knowledge-cloud span");
  const modules = document.querySelectorAll(".ia-orbit span");
  const titles = document.querySelectorAll(".ia-title-block h1, .ia-system-map h2, .ia-final h2");
  const finalButton = document.querySelector(".ia-enter-btn");

  knowledgeNodes.forEach((node, index) => {
    node.classList.add("life-breath");
    node.style.animationDelay = `${index * 0.18}s`;
  });

  modules.forEach((module, index) => {
    module.classList.add("life-breath");
    module.style.animationDelay = `${index * 0.25}s`;
  });

  titles.forEach((title) => {
    title.classList.add("life-glow");
  });

  if (finalButton) {
    finalButton.classList.add("life-float");
  }
}


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
    iaCorpusRoom.classList.add("active");

    const corpus = await FalcoCorpusLoader.load();
    renderCorpusRoom(corpus.nodos || []);
  });
}

if (closeCorpusRoom) {
  closeCorpusRoom.addEventListener("click", () => {
    iaCorpusRoom.classList.remove("active");
  });
}

function renderCorpusRoom(nodes) {
  corpusNodeList.innerHTML = "";

  if (corpusTotalNodes) {
    corpusTotalNodes.textContent = nodes.length;
  }

  nodes.forEach((node, index) => {
    const card = document.createElement("article");
    card.className = "corpus-node-card";

    card.innerHTML = `
      <span>${node.tipo || "Unidad"}</span>
      <h4>${node.titulo || "Sin título"}</h4>
      <p>${node.descripcion || "Sin descripción disponible."}</p>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".corpus-node-card").forEach((item) => {
        item.classList.remove("active");
      });

      card.classList.add("active");
      renderCorpusDetail(node);
    });

    corpusNodeList.appendChild(card);

    if (index === 0) {
      card.classList.add("active");
      renderCorpusDetail(node);
    }
  });
}

function renderCorpusDetail(node) {
  corpusDetail.innerHTML = `
    <span>${node.id || "UCF"}</span>
    <h3>${node.titulo || "Unidad de Conocimiento"}</h3>
    <p>${node.descripcion || "Sin descripción disponible."}</p>

    <div class="corpus-meta">
      <div><strong>Tipo:</strong> ${node.tipo || "-"}</div>
      <div><strong>Categoría:</strong> ${node.categoria || "-"}</div>
      <div><strong>Subcategoría:</strong> ${node.subcategoria || "-"}</div>
      <div><strong>Acceso:</strong> ${node.nivelAcceso || "-"}</div>
      <div><strong>Estado:</strong> ${node.estado || "-"}</div>
      <div><strong>Relaciones:</strong> ${
        node.relaciones && node.relaciones.length
          ? node.relaciones.join(", ")
          : "Sin relaciones registradas"
      }</div>
    </div>
  `;
}




resizeCanvas();

loadCorpusDemo();

drawScene();

animateLife();