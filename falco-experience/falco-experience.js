const acts = document.querySelectorAll(".fx-act");
const canvas = document.getElementById("falcoParticles");
const ctx = canvas.getContext("2d");

const actTitles = [
  "Introducción",
  "FALCO Core",
  "Ecosistema",
  "Interfaces",
  "Centro de Operaciones",
  "Universo FALCO",
  "Gran Final",
  "Cierre"
];

/* tiempos en segundos */
const timeline = [
  0,    // Intro
  12,   // Core
  28,   // Ecosistema
  44,   // Interfaces
  62,   // Centro Operaciones
  84,   // Universo FALCO
  114,  // Gran Final
  132   // Cierre
];

let currentAct = 0;
let particles = [];
let isPlaying = true;
let intervalId = null;
let audioEnabled = false;
let syncMode = false;

const actDuration = 7800;

const audioButton = document.getElementById("fxAudioToggle");
const ambientAudio = document.getElementById("fxAmbientAudio");

if (ambientAudio) {
  ambientAudio.volume = 0;
}

function updateProgress(index) {
  const progress = document.getElementById("fxProgressBar");

  if (progress) {
    progress.style.width = (((index + 1) / acts.length) * 100) + "%";
  }
}

function updateIndicator(index) {
  const number = document.getElementById("fxActNumber");
  const title = document.getElementById("fxActTitle");

  if (number) number.textContent = String(index + 1).padStart(2, "0");
  if (title) title.textContent = actTitles[index] || "FALCO Experience";
}

function updateCamera(index) {
  const camera = document.querySelector(".fx-camera");
  const cameraScale = acts[index]?.dataset.camera || "1";

  if (camera) {
    camera.style.transform = `scale(${cameraScale})`;
  }
}

function flashScene() {
  const flash = document.querySelector(".fx-scene-flash");

  if (!flash) return;

  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
}





function showAct(index) {
  if (!acts[index]) return;

  acts.forEach(act => act.classList.remove("fx-act-active"));
  acts[index].classList.add("fx-act-active");

  currentAct = index;

  updateProgress(index);
  updateIndicator(index);
  updateCamera(index);
  flashScene();

if (acts[index]?.classList.contains("fx-act-showcase")) {
  activateShowcase3D();
} else {
  resetShowcase3D();
}

if (acts[index]?.classList.contains("fx-act-showcase")) {
  startModuleCounter();
}


}

function getActFromTime(time) {
  let index = 0;

  for (let i = 0; i < timeline.length; i++) {
    if (time >= timeline[i]) {
      index = i;
    }
  }

  return index;
}

function syncWithAudio() {
  if (!ambientAudio || !syncMode) return;

  const index = getActFromTime(ambientAudio.currentTime);

  if (index !== currentAct) {
    showAct(index);
  }
}

function nextAct() {
  const next = (currentAct + 1) % acts.length;
  showAct(next);

  if (syncMode && ambientAudio) {
    ambientAudio.currentTime = timeline[next] || 0;
  }
}

function prevAct() {
  const prev = (currentAct - 1 + acts.length) % acts.length;
  showAct(prev);

  if (syncMode && ambientAudio) {
    ambientAudio.currentTime = timeline[prev] || 0;
  }
}

function startAutoplay() {
  clearInterval(intervalId);

  if (!syncMode) {
    intervalId = setInterval(nextAct, actDuration);
  }
}

function stopAutoplay() {
  clearInterval(intervalId);
}

document.getElementById("fxNextAct")?.addEventListener("click", () => {
  nextAct();
  if (isPlaying) startAutoplay();
});

document.getElementById("fxPrevAct")?.addEventListener("click", () => {
  prevAct();
  if (isPlaying) startAutoplay();
});

document.getElementById("fxPlayPause")?.addEventListener("click", (e) => {
  isPlaying = !isPlaying;

  e.target.textContent = isPlaying ? "Pausar" : "Reproducir";

  if (ambientAudio && audioEnabled) {
    isPlaying ? ambientAudio.play() : ambientAudio.pause();
  }

  isPlaying ? startAutoplay() : stopAutoplay();
});

audioButton?.addEventListener("click", async () => {
  audioEnabled = !audioEnabled;
  syncMode = audioEnabled;

  audioButton.textContent = audioEnabled ? "Audio ON" : "Audio OFF";
  audioButton.classList.toggle("fx-audio-on", audioEnabled);

  if (!ambientAudio) return;

  if (audioEnabled) {
    stopAutoplay();

    ambientAudio.currentTime = 0;
    showAct(0);

    try {
      await ambientAudio.play();

      let volume = 0;
      const fade = setInterval(() => {
        volume += 0.02;
        ambientAudio.volume = Math.min(volume, 0.25);

        if (volume >= 0.25) {
          clearInterval(fade);
        }
      }, 120);

    } catch (error) {
      console.warn("Audio bloqueado por el navegador.");
    }

  } else {
    syncMode = false;

    ambientAudio.pause();
    ambientAudio.volume = 0;

    if (isPlaying) startAutoplay();
  }
});

ambientAudio?.addEventListener("timeupdate", syncWithAudio);

showAct(currentAct);
startAutoplay();

/* PARTÍCULAS */

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];

  const total = window.innerWidth < 700 ? 70 : 140;

  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.9 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.65 + 0.18
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    const pulse = 0.15 * Math.sin(Date.now() / 800 + p.x);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212,175,55,${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

/* TECLADO */

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextAct();
  if (e.key === "ArrowLeft") prevAct();

  if (e.code === "Space") {
    e.preventDefault();
    document.getElementById("fxPlayPause")?.click();
  }

  if (e.key === "Escape") {
    window.location.href = "../FALCO-CMS-V2/ecosistema-falco.html";
  }
});



/* ===============================
   INICIAR EXPERIENCIA DESDE INTRO
================================ */

const startButton = document.getElementById("fxStartExperience");

startButton?.addEventListener("click", () => {
  document.body.classList.add("fx-starting");

  setTimeout(() => {
    window.location.href = "falco-experience.html?autoplay=1";
  }, 1100);
});

/* ===============================
   PRECARGA INTRO
================================ */

const assetsToPreload = [
  "assets/images/hero-ecosistema.png",
  "assets/images/centro-operaciones.png",
  "audio/falco-theme.mp3"
];

assetsToPreload.forEach(src => {
  if (src.endsWith(".mp3")) {
    const audio = new Audio();
    audio.src = src;
    audio.preload = "auto";
  } else {
    const img = new Image();
    img.src = src;
  }
});


/*==================================================
            INTRO LOADER
==================================================*/

const loader=document.getElementById("fxLoadingFill");

const loaderText=document.getElementById("fxLoadingText");

if(loader){

const steps=[

"Inicializando módulos...",

"Cargando Biblioteca...",

"Sincronizando CMS...",

"Preparando Centro Profesional...",

"Verificando recursos...",

"Sistema listo."

];

let p=0;

const timer=setInterval(()=>{

p++;

loader.style.width=(p*100/steps.length)+"%";

loaderText.textContent=steps[p-1];

if(p>=steps.length){

clearInterval(timer);

}

},700);

}


/* ===============================
   AUTOPLAY DESDE INTRO
================================ */

window.addEventListener("load", async () => {
  const params = new URLSearchParams(window.location.search);
  const shouldAutoplay = params.get("autoplay") === "1";

  if (!shouldAutoplay) return;

  const audioButton = document.getElementById("fxAudioToggle");
  const ambientAudio = document.getElementById("fxAmbientAudio");

  if (!ambientAudio) return;

  try {
    audioEnabled = true;
    syncMode = true;

    ambientAudio.currentTime = 0;
    ambientAudio.volume = 0;

    showAct(0);
    stopAutoplay();

    await ambientAudio.play();

    if (audioButton) {
      audioButton.textContent = "Audio ON";
      audioButton.classList.add("fx-audio-on");
    }

    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.02;
      ambientAudio.volume = Math.min(volume, 0.25);

      if (volume >= 0.25) {
        clearInterval(fade);
      }
    }, 120);

  } catch (error) {
    console.warn("El navegador bloqueó el autoplay. Usar botón Audio ON.");

    if (audioButton) {
      audioButton.textContent = "Audio OFF";
      audioButton.classList.remove("fx-audio-on");
    }
  }
});




/* ===============================
   SHOWCASE 3D - UNIVERSO FALCO
================================ */

function activateShowcase3D() {
  const showcase = document.querySelector(".fx-act-showcase");
  if (!showcase) return;

  const shots = showcase.querySelectorAll(".fx-shot");

  shots.forEach((shot, index) => {
    const delay = index * 110;

    setTimeout(() => {
      shot.classList.add("fx-shot-live");
    }, delay);
  });
}

function resetShowcase3D() {
  document.querySelectorAll(".fx-shot").forEach(shot => {
    shot.classList.remove("fx-shot-live");
  });
}


/* ===============================
   CONTADOR UNIVERSO FALCO
================================ */

let moduleCounterStarted = false;

function startModuleCounter() {
  const counter = document.getElementById("fxModuleCounter");

  if (!counter || moduleCounterStarted) return;

  moduleCounterStarted = true;

  let value = 1;

  counter.textContent = "01";

  const timer = setInterval(() => {
    value++;

    counter.textContent =
      value < 10 ? "0" + value : value;

    counter.classList.remove("fx-counter-pop");
    void counter.offsetWidth;
    counter.classList.add("fx-counter-pop");

    if (value >= 15) {
      clearInterval(timer);

      setTimeout(() => {
        counter.textContent = "15+";
        counter.classList.remove("fx-counter-pop");
        void counter.offsetWidth;
        counter.classList.add("fx-counter-pop");
      }, 250);
    }
  }, 180);
}
