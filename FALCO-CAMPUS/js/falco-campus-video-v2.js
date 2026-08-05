/* =========================================================
   FALCO® CAMPUS
   FALCO EXPERIENCE® — CAMPUS EDITION
   Archivo: falco-campus-video.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const FCEV_CONFIG = Object.freeze({

  totalDuration: 154.4,

  particleCountDesktop: 145,

  particleCountMobile: 70,

  sceneTransitionDuration: 700,

  scenes: [

    {
      id: "fcevScene01",
      number: 1,
      start: 0,
      end: 6,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1.2
        }
      ]
    },

    {
      id: "fcevScene02",
      number: 2,
      start: 6,
      end: 12,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 0.8
        }
      ]
    },

    {
      id: "fcevScene03",
      number: 3,
      start: 12,
      end: 18,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 0.6
        },
        {
          selector: '[data-text-step="2"]',
          at: 2.1
        },
        {
          selector: '[data-text-step="3"]',
          at: 3.7
        }
      ]
    },

    {
      id: "fcevScene04",
      number: 4,
      start: 18,
      end: 26,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 4
        }
      ]
    },

    {
      id: "fcevScene05",
      number: 5,
      start: 26,
      end: 36,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1.1
        },
        {
          selector: '[data-text-step="2"]',
          at: 4.8
        }
      ]
    },

    {
      id: "fcevScene06",
      number: 6,
      start: 36,
      end: 46,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 5
        }
      ]
    },

    {
      id: "fcevScene07",
      number: 7,
      start: 46,
      end: 56,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 0.8
        },
        {
          selector: '[data-text-step="2"]',
          at: 2.4
        },
        {
          selector: '[data-text-step="3"]',
          at: 4
        },
        {
          selector: '[data-text-step="4"]',
          at: 6.1
        }
      ]
    },

    {
      id: "fcevScene08",
      number: 8,
      start: 56,
      end: 68,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 5.6
        }
      ]
    },

    {
      id: "fcevScene09",
      number: 9,
      start: 68,
      end: 80,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 5.5
        }
      ]
    },

    {
      id: "fcevScene10",
      number: 10,
      start: 80,
      end: 95,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1.3
        },
        {
          selector: '[data-text-step="2"]',
          at: 7
        }
      ]
    },

    {
      id: "fcevScene11",
      number: 11,
      start: 95,
      end: 110,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 6
        }
      ]
    },

    {
      id: "fcevScene12",
      number: 12,
      start: 110,
      end: 130,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 7.5
        },
        {
          selector: '[data-text-step="3"]',
          at: 12
        }
      ]
    },

    {
      id: "fcevScene13",
      number: 13,
      start: 130,
     end: 154.4,
      textSteps: [
        {
          selector: '[data-text-step="1"]',
          at: 1
        },
        {
          selector: '[data-text-step="2"]',
          at: 7
        }
      ]
    }

  ]

});


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const fcExperienceModal =
  document.getElementById("fcExperienceModal");

const fcExperienceStage =
  document.getElementById("fcExperienceStage");

const fcExperienceParticles =
  document.getElementById("fcExperienceParticles");

const fcExperienceMusic =
  document.getElementById("fcExperienceMusic");

const fcExperienceVoice =
  document.getElementById("fcExperienceVoice");

const fcExperienceAudioTracks =
  [
    fcExperienceMusic,
    fcExperienceVoice
  ].filter(Boolean);

const fcExperienceVideo =
  document.getElementById("fcExperienceVideo");

const btnAbrirExperience =
  document.getElementById("btnAbrirExperience");

const btnAbrirExperienceSecundario =
  document.getElementById(
    "btnAbrirExperienceSecundario"
  );

const fcVideoPreview =
  document.getElementById("fcVideoPreview");

const btnCerrarExperience =
  document.getElementById("btnCerrarExperience");

const btnReiniciarExperience =
  document.getElementById("btnReiniciarExperience");

const btnSonidoExperience =
  document.getElementById("btnSonidoExperience");

const iconoSonidoExperience =
  document.getElementById("iconoSonidoExperience");

const btnPlayPauseExperience =
  document.getElementById("btnPlayPauseExperience");

const iconoPlayPauseExperience =
  document.getElementById(
    "iconoPlayPauseExperience"
  );

const btnPantallaCompletaExperience =
  document.getElementById(
    "btnPantallaCompletaExperience"
  );

const fcevTimelineTrack =
  document.getElementById("fcevTimelineTrack");

const fcevTimelineProgress =
  document.getElementById("fcevTimelineProgress");

const fcevCurrentTime =
  document.getElementById("fcevCurrentTime");

const fcevTotalTime =
  document.getElementById("fcevTotalTime");

const fcevCurrentScene =
  document.getElementById("fcevCurrentScene");

const fcevProgressNumber =
  document.getElementById("fcevProgressNumber");

const fcevProgressBar =
  document.getElementById("fcevProgressBar");

const elementosCerrarExperience =
  document.querySelectorAll(
    "[data-close-experience]"
  );

const escenas =
  FCEV_CONFIG.scenes
    .map((configuracion) => {

      const elemento =
        document.getElementById(configuracion.id);

      return {
        ...configuracion,
        element: elemento
      };

    })
    .filter((escena) => Boolean(escena.element));


/* =========================================================
   ESTADO
========================================================= */

let experienceTime = 0;

let lastFrameTime = 0;

let animationFrameId = null;

let isPlaying = false;

let isModalOpen = false;

let isSoundEnabled = false;

let activeSceneNumber = 0;

let elementoQueAbrioModal = null;

let progressAnimationValue = 0;

let progressAnimationFrame = null;

let particles = [];

let particleContext = null;

let particleWidth = 0;

let particleHeight = 0;

let particleAnimationFrame = null;

let lastParticleFrame = 0;

let previousBodyOverflow = "";

let supportsReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


/* =========================================================
   UTILIDADES
========================================================= */

function limitar(valor, minimo, maximo) {
  return Math.min(
    Math.max(valor, minimo),
    maximo
  );
}


function formatearTiempo(segundos) {

  const total =
    Math.max(0, Math.floor(segundos));

  const minutos =
    Math.floor(total / 60);

  const segundosRestantes =
    total % 60;

  return [
    String(minutos).padStart(2, "0"),
    String(segundosRestantes).padStart(2, "0")
  ].join(":");

}


function obtenerEscenaPorTiempo(tiempo) {

  return escenas.find(
    (escena) =>
      tiempo >= escena.start &&
      tiempo < escena.end
  ) || escenas[escenas.length - 1];

}


function obtenerTiempoLocalDeEscena(
  escena,
  tiempoGlobal
) {

  if (!escena) {
    return 0;
  }

  return limitar(
    tiempoGlobal - escena.start,
    0,
    escena.end - escena.start
  );

}


function actualizarIconosLucide() {

  if (window.lucide) {
    window.lucide.createIcons();
  }

}


function crearIconoLucide(
  nombre,
  id = ""
) {

  const elemento =
    document.createElement("i");

  elemento.setAttribute(
    "data-lucide",
    nombre
  );

  if (id) {
    elemento.id = id;
  }

  return elemento;

}


/* =========================================================
   CONTROL DE ICONOS
========================================================= */

function actualizarIconoPlayPause() {

  if (!btnPlayPauseExperience) {
    return;
  }

  btnPlayPauseExperience.innerHTML = "";

  const icono =
    crearIconoLucide(
      isPlaying ? "pause" : "play",
      "iconoPlayPauseExperience"
    );

  btnPlayPauseExperience.appendChild(icono);

  btnPlayPauseExperience.setAttribute(
    "aria-label",
    isPlaying
      ? "Pausar experiencia"
      : "Reproducir experiencia"
  );

  actualizarIconosLucide();

}


function actualizarIconoSonido() {

  if (!btnSonidoExperience) {
    return;
  }

  btnSonidoExperience.innerHTML = "";

  const icono =
    crearIconoLucide(
      isSoundEnabled
        ? "volume-2"
        : "volume-x",
      "iconoSonidoExperience"
    );

  btnSonidoExperience.appendChild(icono);

  btnSonidoExperience.setAttribute(
    "aria-pressed",
    String(isSoundEnabled)
  );

  btnSonidoExperience.setAttribute(
    "aria-label",
    isSoundEnabled
      ? "Desactivar sonido"
      : "Activar sonido"
  );

  actualizarIconosLucide();

}


/* =========================================================
   ESCENAS
========================================================= */

function reiniciarTextosDeEscena(escena) {

  if (!escena?.element) {
    return;
  }

  escena.element
    .querySelectorAll(
      ".fcev-scene__sentence"
    )
    .forEach((texto) => {
      texto.classList.remove("is-visible");
    });

}


function actualizarTextosDeEscena(
  escena,
  tiempoLocal
) {

  if (!escena?.element) {
    return;
  }

  escena.textSteps.forEach((paso) => {

    const texto =
      escena.element.querySelector(
        paso.selector
      );

    if (!texto) {
      return;
    }

    texto.classList.toggle(
      "is-visible",
      tiempoLocal >= paso.at
    );

  });

}


function activarEscena(
  nuevaEscena,
  forzar = false
) {

  if (!nuevaEscena?.element) {
    return;
  }

  if (
    !forzar &&
    activeSceneNumber === nuevaEscena.number
  ) {
    return;
  }

  escenas.forEach((escena) => {

    if (!escena.element) {
      return;
    }

    const esActiva =
      escena.number === nuevaEscena.number;

    escena.element.classList.toggle(
      "is-active",
      esActiva
    );

    escena.element.classList.remove(
      "is-leaving"
    );

    escena.element.setAttribute(
      "aria-hidden",
      esActiva ? "false" : "true"
    );

    if (!esActiva) {
      reiniciarTextosDeEscena(escena);
    }

  });

  activeSceneNumber =
    nuevaEscena.number;

  if (fcevCurrentScene) {
    fcevCurrentScene.textContent =
      String(nuevaEscena.number)
        .padStart(2, "0");
  }

  reiniciarAnimacionesEspeciales(
    nuevaEscena.number
  );

}


/* =========================================================
   REINICIO DE ANIMACIONES CSS
========================================================= */

function reiniciarElementoAnimado(elemento) {

  if (!elemento) {
    return;
  }

  elemento.style.animation = "none";

  void elemento.offsetWidth;

  elemento.style.animation = "";

}


function reiniciarAnimacionesEspeciales(
  numeroEscena
) {

  const escena =
    escenas.find(
      (item) =>
        item.number === numeroEscena
    );

  if (!escena?.element) {
    return;
  }

  const selectores = [

    ".fcev-central-light",

    ".fcev-knowledge-item",

    ".fcev-connections path",

    ".fcev-connection-core",

    ".fcev-device__base",

    ".fcev-device__lid",

    ".fcev-module",

    ".fcev-dashboard",

    ".fcev-course",

    ".fcev-progress-panel",

    ".fcev-certificate",

    ".fcev-academy",

    ".fcev-professional-system__event",

    ".fcev-falco-network__node",

    ".fcev-falco-network__core",

    ".fcev-closing-brand"

  ];

  escena.element
    .querySelectorAll(
      selectores.join(",")
    )
    .forEach(reiniciarElementoAnimado);

  if (numeroEscena === 8) {
    reiniciarProgresoAcademico();
  }

}


/* =========================================================
   PROGRESO ACADÉMICO — ESCENA 08
========================================================= */

function reiniciarProgresoAcademico() {

  if (progressAnimationFrame) {
    cancelAnimationFrame(
      progressAnimationFrame
    );
  }

  progressAnimationValue = 0;

  if (fcevProgressNumber) {
    fcevProgressNumber.textContent = "0%";
  }

  if (fcevProgressBar) {
    fcevProgressBar.style.width = "0%";
  }

  document
    .querySelectorAll(
      "[data-progress-module]"
    )
    .forEach((modulo) => {
      modulo.classList.remove("is-complete");
    });

}


function actualizarProgresoAcademico(
  tiempoLocal
) {

  const inicio = 1.4;

  const duracion = 7.7;

  const porcentaje =
    limitar(
      ((tiempoLocal - inicio) / duracion) * 100,
      0,
      100
    );

  progressAnimationValue =
    porcentaje;

  if (fcevProgressNumber) {
    fcevProgressNumber.textContent =
      `${Math.round(porcentaje)}%`;
  }

  if (fcevProgressBar) {
    fcevProgressBar.style.width =
      `${porcentaje}%`;
  }

  const modulos =
    document.querySelectorAll(
      "[data-progress-module]"
    );

  modulos.forEach(
    (modulo, indice) => {

      const limite =
        ((indice + 1) / modulos.length)
        * 100;

      modulo.classList.toggle(
        "is-complete",
        porcentaje >= limite - 5
      );

    }
  );

}


/* =========================================================
   ACTUALIZACIÓN VISUAL GENERAL
========================================================= */

function actualizarExperienciaVisual() {

  const escena =
    obtenerEscenaPorTiempo(experienceTime);

  if (!escena) {
    return;
  }

  activarEscena(escena);

  const tiempoLocal =
    obtenerTiempoLocalDeEscena(
      escena,
      experienceTime
    );

  actualizarTextosDeEscena(
    escena,
    tiempoLocal
  );

  if (escena.number === 8) {
    actualizarProgresoAcademico(
      tiempoLocal
    );
  }

  const porcentajeGeneral =
    limitar(
      (
        experienceTime /
        FCEV_CONFIG.totalDuration
      ) * 100,
      0,
      100
    );

  if (fcevTimelineProgress) {
    fcevTimelineProgress.style.width =
      `${porcentajeGeneral}%`;
  }

  if (fcevCurrentTime) {
    fcevCurrentTime.textContent =
      formatearTiempo(experienceTime);
  }

  sincronizarAudioConExperiencia();

}


/* =========================================================
   MOTOR DE REPRODUCCIÓN
========================================================= */

function cicloExperiencia(timestamp) {

  if (
    !isPlaying ||
    !isModalOpen
  ) {
    animationFrameId = null;
    return;
  }

  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }

  const delta =
    Math.min(
      (timestamp - lastFrameTime) / 1000,
      0.12
    );

  lastFrameTime = timestamp;

  experienceTime += delta;

  if (
    experienceTime >=
    FCEV_CONFIG.totalDuration
  ) {

    experienceTime =
      FCEV_CONFIG.totalDuration;

    actualizarExperienciaVisual();

    pausarExperiencia();

    return;

  }

  actualizarExperienciaVisual();

  animationFrameId =
    requestAnimationFrame(
      cicloExperiencia
    );

}

function reproducirExperiencia() {

  if (!isModalOpen) {
    return;
  }

  if (
    experienceTime >=
    FCEV_CONFIG.totalDuration
  ) {
    irATiempo(0);
  }

  isPlaying = true;

  lastFrameTime = 0;

  actualizarIconoPlayPause();

  if (isSoundEnabled) {

    if (fcExperienceMusic) {
      fcExperienceMusic.currentTime =
        experienceTime;

      fcExperienceMusic.play().catch(() => {});
    }

    if (fcExperienceVoice) {
      fcExperienceVoice.currentTime =
        experienceTime;

      fcExperienceVoice.play().catch(() => {});
    }

  }

  if (!animationFrameId) {
    animationFrameId =
      requestAnimationFrame(
        cicloExperiencia
      );
  }

}





function pausarExperiencia() {

  isPlaying = false;

  lastFrameTime = 0;

  if (animationFrameId) {
    cancelAnimationFrame(
      animationFrameId
    );

    animationFrameId = null;
  }

  if (
    fcExperienceMusic &&
    !fcExperienceMusic.paused
  ) {
    fcExperienceMusic.pause();
  }

  if (
    fcExperienceVoice &&
    !fcExperienceVoice.paused
  ) {
    fcExperienceVoice.pause();
  }

  actualizarIconoPlayPause();

}


function alternarPlayPause() {

  if (isPlaying) {
    pausarExperiencia();
  } else {
    reproducirExperiencia();
  }

}


function reiniciarExperiencia() {

  pausarExperiencia();

  experienceTime = 0;

  activeSceneNumber = 0;

  escenas.forEach((escena) => {
    reiniciarTextosDeEscena(escena);
  });

  reiniciarProgresoAcademico();

  if (fcExperienceMusic) {
    fcExperienceMusic.pause();
    fcExperienceMusic.currentTime = 0;
  }

  if (fcExperienceVoice) {
    fcExperienceVoice.pause();
    fcExperienceVoice.currentTime = 0;
  }

  activarEscena(
    escenas[0],
    true
  );

  actualizarExperienciaVisual();

  reproducirExperiencia();

}


function irATiempo(nuevoTiempo) {

  experienceTime =
    limitar(
      nuevoTiempo,
      0,
      FCEV_CONFIG.totalDuration
    );

  activeSceneNumber = 0;

  actualizarExperienciaVisual();

  if (fcExperienceMusic) {
    fcExperienceMusic.currentTime =
      Math.min(
        experienceTime,
        Math.max(
          0,
          (fcExperienceMusic.duration || experienceTime) - 0.05
        )
      );
  }

  if (fcExperienceVoice) {
    fcExperienceVoice.currentTime =
      Math.min(
        experienceTime,
        Math.max(
          0,
          (fcExperienceVoice.duration || experienceTime) - 0.05
        )
      );
  }

}


/* =========================================================
   AUDIO — MÚSICA + NARRACIÓN
========================================================= */

function obtenerVolumenMusica() {

  /*
   * Entrada suave:
   * la música sube de 0 a su volumen normal
   * durante los primeros 3 segundos.
   */

  if (experienceTime < 3) {
    return limitar(
      (experienceTime / 3) * 0.18,
      0,
      0.18
    );
  }


  /*
   * Variaciones muy sutiles por tramo.
   * La voz permanece siempre al 100 %.
   */

  let volumenObjetivo = 0.18;

  if (experienceTime >= 26 && experienceTime < 56) {
    volumenObjetivo = 0.20;
  }

  if (experienceTime >= 56 && experienceTime < 95) {
    volumenObjetivo = 0.16;
  }

  if (experienceTime >= 95 && experienceTime < 130) {
    volumenObjetivo = 0.19;
  }

  if (experienceTime >= 130) {
    volumenObjetivo = 0.21;
  }


  /*
   * Salida suave durante los últimos 5 segundos
   * de la experiencia.
   */

  const inicioFadeOut =
    FCEV_CONFIG.totalDuration - 5;

  if (experienceTime >= inicioFadeOut) {

    const proporcionRestante =
      limitar(
        (
          FCEV_CONFIG.totalDuration -
          experienceTime
        ) / 5,
        0,
        1
      );

    return volumenObjetivo *
      proporcionRestante;

  }

  return volumenObjetivo;

}


function establecerTiempoDeAudio(
  pista,
  tiempo
) {

  if (!pista) {
    return;
  }

  let tiempoSeguro =
    Math.max(0, tiempo);

  if (
    Number.isFinite(pista.duration) &&
    pista.duration > 0
  ) {

    tiempoSeguro =
      Math.min(
        tiempoSeguro,
        Math.max(
          0,
          pista.duration - 0.05
        )
      );

  }

  try {

    pista.currentTime =
      tiempoSeguro;

  } catch (error) {

    console.info(
      "FALCO® Campus: la pista de audio todavía se está cargando."
    );

  }

}


function sincronizarPista(
  pista
) {

  if (!pista) {
    return;
  }

  if (
    Number.isFinite(pista.duration) &&
    experienceTime >= pista.duration
  ) {

    pista.pause();

    return;

  }

  const diferencia =
    Math.abs(
      pista.currentTime -
      experienceTime
    );

  if (diferencia > 0.35) {

    establecerTiempoDeAudio(
      pista,
      experienceTime
    );

  }

}


function sincronizarAudioConExperiencia() {

  if (
    !isSoundEnabled ||
    !isPlaying
  ) {
    return;
  }

  sincronizarPista(
    fcExperienceMusic
  );

  sincronizarPista(
    fcExperienceVoice
  );


  /*
   * Actualiza suavemente el volumen musical
   * según el momento de la experiencia.
   */

  if (fcExperienceMusic) {

    const volumenObjetivo =
      obtenerVolumenMusica();

    const diferencia =
      volumenObjetivo -
      fcExperienceMusic.volume;

    fcExperienceMusic.volume =
      limitar(
        fcExperienceMusic.volume +
        diferencia * 0.035,
        0,
        1
      );

  }

}


function activarSonido() {

  if (
    !fcExperienceMusic &&
    !fcExperienceVoice
  ) {

    console.warn(
      "FALCO® Campus: no se encontraron las pistas de audio."
    );

    return;

  }

  isSoundEnabled = true;


  if (fcExperienceMusic) {

    fcExperienceMusic.muted = false;

    fcExperienceMusic.volume =
  obtenerVolumenMusica();

    establecerTiempoDeAudio(
      fcExperienceMusic,
      experienceTime
    );

  }


  if (fcExperienceVoice) {

    fcExperienceVoice.muted = false;

    fcExperienceVoice.volume = 1;

    establecerTiempoDeAudio(
      fcExperienceVoice,
      experienceTime
    );

  }


  actualizarIconoSonido();


  if (isPlaying) {

    if (
      fcExperienceMusic &&
      (
        !Number.isFinite(
          fcExperienceMusic.duration
        ) ||
        experienceTime <
          fcExperienceMusic.duration
      )
    ) {

      fcExperienceMusic
        .play()
        .catch((error) => {

          console.info(
            "FALCO® Campus: la música espera una interacción del usuario.",
            error
          );

        });

    }


    if (
      fcExperienceVoice &&
      (
        !Number.isFinite(
          fcExperienceVoice.duration
        ) ||
        experienceTime <
          fcExperienceVoice.duration
      )
    ) {

      fcExperienceVoice
        .play()
        .catch((error) => {

          console.info(
            "FALCO® Campus: la narración espera una interacción del usuario.",
            error
          );

        });

    }

  }

}


function desactivarSonido() {

  isSoundEnabled = false;


  if (fcExperienceMusic) {
    fcExperienceMusic.pause();
  }


  if (fcExperienceVoice) {
    fcExperienceVoice.pause();
  }


  actualizarIconoSonido();

}


function alternarSonido() {

  if (isSoundEnabled) {

    desactivarSonido();

  } else {

    activarSonido();

  }

}

/* =========================================================
   PARTÍCULAS
========================================================= */

function obtenerCantidadParticulas() {

  const esMovil =
    window.matchMedia(
      "(max-width: 700px)"
    ).matches;

  return esMovil
    ? FCEV_CONFIG.particleCountMobile
    : FCEV_CONFIG.particleCountDesktop;

}


function crearParticula() {

  const velocidadBase =
    0.12 + Math.random() * 0.35;

  return {

    x:
      Math.random() *
      particleWidth,

    y:
      Math.random() *
      particleHeight,

    radius:
      0.45 + Math.random() * 1.45,

    opacity:
      0.16 + Math.random() * 0.62,

    velocityX:
      (Math.random() - 0.5)
      * velocidadBase,

    velocityY:
      (
        -0.08 -
        Math.random() * 0.22
      ),

    pulse:
      Math.random() * Math.PI * 2,

    pulseSpeed:
      0.004 +
      Math.random() * 0.009,

    warm:
      Math.random() > 0.28

  };

}


function inicializarParticulas() {

  if (!fcExperienceParticles) {
    return;
  }

  particleContext =
    fcExperienceParticles.getContext(
      "2d",
      {
        alpha: true
      }
    );

  if (!particleContext) {
    return;
  }

  redimensionarCanvasParticulas();

  particles = Array.from(
    {
      length:
        obtenerCantidadParticulas()
    },
    crearParticula
  );

  if (!particleAnimationFrame) {
    particleAnimationFrame =
      requestAnimationFrame(
        animarParticulas
      );
  }

}


function redimensionarCanvasParticulas() {

  if (
    !fcExperienceParticles ||
    !particleContext
  ) {
    return;
  }

  const rect =
    fcExperienceParticles
      .getBoundingClientRect();

  const ratio =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  particleWidth = rect.width;

  particleHeight = rect.height;

  fcExperienceParticles.width =
    Math.max(
      1,
      Math.floor(rect.width * ratio)
    );

  fcExperienceParticles.height =
    Math.max(
      1,
      Math.floor(rect.height * ratio)
    );

  fcExperienceParticles.style.width =
    `${rect.width}px`;

  fcExperienceParticles.style.height =
    `${rect.height}px`;

  particleContext.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

}


function actualizarParticula(
  particula,
  delta
) {

  particula.x +=
    particula.velocityX * delta;

  particula.y +=
    particula.velocityY * delta;

  particula.pulse +=
    particula.pulseSpeed * delta;

  if (
    particula.x <
    -10
  ) {
    particula.x =
      particleWidth + 10;
  }

  if (
    particula.x >
    particleWidth + 10
  ) {
    particula.x = -10;
  }

  if (
    particula.y <
    -10
  ) {
    particula.y =
      particleHeight + 10;

    particula.x =
      Math.random() *
      particleWidth;
  }

}


function dibujarParticula(particula) {

  if (!particleContext) {
    return;
  }

  const pulso =
    0.72 +
    Math.sin(particula.pulse) * 0.28;

  const opacidad =
    particula.opacity * pulso;

  const radio =
    particula.radius *
    (
      0.85 +
      pulso * 0.25
    );

  const gradiente =
    particleContext
      .createRadialGradient(
        particula.x,
        particula.y,
        0,
        particula.x,
        particula.y,
        radio * 4.5
      );

  if (particula.warm) {

    gradiente.addColorStop(
      0,
      `rgba(244, 216, 158, ${opacidad})`
    );

    gradiente.addColorStop(
      0.3,
      `rgba(212, 175, 103, ${opacidad * 0.55})`
    );

  } else {

    gradiente.addColorStop(
      0,
      `rgba(137, 207, 238, ${opacidad})`
    );

    gradiente.addColorStop(
      0.3,
      `rgba(55, 135, 183, ${opacidad * 0.55})`
    );

  }

  gradiente.addColorStop(
    1,
    "rgba(0, 0, 0, 0)"
  );

  particleContext.beginPath();

  particleContext.fillStyle =
    gradiente;

  particleContext.arc(
    particula.x,
    particula.y,
    radio * 4.5,
    0,
    Math.PI * 2
  );

  particleContext.fill();

}


function animarParticulas(timestamp) {

  if (
    !particleContext ||
    !fcExperienceParticles
  ) {
    particleAnimationFrame = null;
    return;
  }

  if (!lastParticleFrame) {
    lastParticleFrame = timestamp;
  }

  const delta =
    Math.min(
      timestamp - lastParticleFrame,
      40
    );

  lastParticleFrame = timestamp;

  particleContext.clearRect(
    0,
    0,
    particleWidth,
    particleHeight
  );

  particles.forEach((particula) => {

    if (!supportsReducedMotion) {
      actualizarParticula(
        particula,
        delta
      );
    }

    dibujarParticula(particula);

  });

  particleAnimationFrame =
    requestAnimationFrame(
      animarParticulas
    );

}


/* =========================================================
   APERTURA Y CIERRE
========================================================= */

function abrirExperience(evento) {

  if (!fcExperienceModal) {
    return;
  }

  elementoQueAbrioModal =
    evento?.currentTarget ||
    document.activeElement;

  previousBodyOverflow =
    document.body.style.overflow;

  fcExperienceModal.hidden = false;

  document.body.classList.add(
    "is-modal-open"
  );

  isModalOpen = true;

  experienceTime = 0;

  activeSceneNumber = 0;

  escenas.forEach((escena) => {
    reiniciarTextosDeEscena(escena);
  });

  activarEscena(
    escenas[0],
    true
  );

  actualizarExperienciaVisual();

  inicializarParticulas();

  if (fcevTotalTime) {
    fcevTotalTime.textContent =
      formatearTiempo(
        FCEV_CONFIG.totalDuration
      );
  }

  requestAnimationFrame(() => {

    redimensionarCanvasParticulas();

    fcExperienceStage?.focus();

    reproducirExperiencia();

  });

}


function cerrarExperience() {

  if (!fcExperienceModal) {
    return;
  }

  pausarExperiencia();

  isModalOpen = false;

  experienceTime = 0;

  activeSceneNumber = 0;

 if (fcExperienceMusic) {
  fcExperienceMusic.pause();
  fcExperienceMusic.currentTime = 0;
}

if (fcExperienceVoice) {
  fcExperienceVoice.pause();
  fcExperienceVoice.currentTime = 0;
}

  if (fcExperienceVideo) {
    fcExperienceVideo.pause();
    fcExperienceVideo.currentTime = 0;
  }

  fcExperienceModal.hidden = true;

  document.body.classList.remove(
    "is-modal-open"
  );

  document.body.style.overflow =
    previousBodyOverflow;

  escenas.forEach((escena) => {

    escena.element?.classList.remove(
      "is-active",
      "is-leaving"
    );

    escena.element?.setAttribute(
      "aria-hidden",
      "true"
    );

    reiniciarTextosDeEscena(escena);

  });

  reiniciarProgresoAcademico();

  if (
    elementoQueAbrioModal &&
    typeof elementoQueAbrioModal.focus ===
      "function"
  ) {
    elementoQueAbrioModal.focus();
  }

  elementoQueAbrioModal = null;

}


/* =========================================================
   LÍNEA DE TIEMPO
========================================================= */

function calcularTiempoDesdeEvento(evento) {

  if (!fcevTimelineTrack) {
    return 0;
  }

  const rect =
    fcevTimelineTrack
      .getBoundingClientRect();

  const posicion =
    limitar(
      evento.clientX - rect.left,
      0,
      rect.width
    );

  const proporcion =
    rect.width > 0
      ? posicion / rect.width
      : 0;

  return (
    proporcion *
    FCEV_CONFIG.totalDuration
  );

}


function buscarEnTimeline(evento) {

  const tiempo =
    calcularTiempoDesdeEvento(evento);

  irATiempo(tiempo);

}


function controlarTimelineConTeclado(evento) {

  if (
    evento.key !== "ArrowLeft" &&
    evento.key !== "ArrowRight" &&
    evento.key !== "Home" &&
    evento.key !== "End"
  ) {
    return;
  }

  evento.preventDefault();

  if (evento.key === "Home") {
    irATiempo(0);
    return;
  }

  if (evento.key === "End") {
    irATiempo(
      FCEV_CONFIG.totalDuration
    );
    return;
  }

  const desplazamiento =
    evento.key === "ArrowRight"
      ? 5
      : -5;

  irATiempo(
    experienceTime +
    desplazamiento
  );

}


/* =========================================================
   PANTALLA COMPLETA
========================================================= */

async function alternarPantallaCompleta() {

  if (!fcExperienceModal) {
    return;
  }

  try {

    if (!document.fullscreenElement) {

      await fcExperienceModal
        .requestFullscreen?.();

    } else {

      await document.exitFullscreen?.();

    }

  } catch (error) {

    console.warn(
      "FALCO® Campus: no fue posible cambiar el modo de pantalla completa.",
      error
    );

  }

}


function actualizarBotonPantallaCompleta() {

  if (!btnPantallaCompletaExperience) {
    return;
  }

  btnPantallaCompletaExperience.innerHTML = "";

  const nombreIcono =
    document.fullscreenElement
      ? "minimize"
      : "maximize";

  btnPantallaCompletaExperience
    .appendChild(
      crearIconoLucide(nombreIcono)
    );

  btnPantallaCompletaExperience
    .setAttribute(
      "aria-label",
      document.fullscreenElement
        ? "Salir de pantalla completa"
        : "Ver en pantalla completa"
    );

  actualizarIconosLucide();

  requestAnimationFrame(
    redimensionarCanvasParticulas
  );

}


/* =========================================================
   FOCO DENTRO DEL MODAL
========================================================= */

function obtenerElementosInteractivosModal() {

  if (!fcExperienceModal) {
    return [];
  }

  return [
    ...fcExperienceModal.querySelectorAll(
      [
        "button:not([disabled])",
        "a[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])'
      ].join(",")
    )
  ].filter((elemento) => {

    const estilo =
      window.getComputedStyle(elemento);

    return (
      !elemento.hasAttribute("hidden") &&
      estilo.display !== "none" &&
      estilo.visibility !== "hidden"
    );

  });

}


function mantenerFocoEnModal(evento) {

  if (
    evento.key !== "Tab" ||
    !isModalOpen
  ) {
    return;
  }

  const elementos =
    obtenerElementosInteractivosModal();

  if (!elementos.length) {
    evento.preventDefault();
    return;
  }

  const primero =
    elementos[0];

  const ultimo =
    elementos[elementos.length - 1];

  if (
    evento.shiftKey &&
    document.activeElement === primero
  ) {

    evento.preventDefault();

    ultimo.focus();

    return;

  }

  if (
    !evento.shiftKey &&
    document.activeElement === ultimo
  ) {

    evento.preventDefault();

    primero.focus();

  }

}


/* =========================================================
   TECLADO
========================================================= */

function controlarTecladoGlobal(evento) {

  if (!isModalOpen) {
    return;
  }

  if (evento.key === "Escape") {

    if (document.fullscreenElement) {
      return;
    }

    cerrarExperience();

    return;

  }

  if (
    evento.code === "Space" &&
    ![
      "BUTTON",
      "A",
      "INPUT",
      "TEXTAREA",
      "SELECT"
    ].includes(
      document.activeElement?.tagName
    )
  ) {

    evento.preventDefault();

    alternarPlayPause();

    return;

  }

  if (
    evento.key === "ArrowRight"
  ) {

    evento.preventDefault();

    irATiempo(
      experienceTime + 5
    );

    return;

  }

  if (
    evento.key === "ArrowLeft"
  ) {

    evento.preventDefault();

    irATiempo(
      experienceTime - 5
    );

  }

}


/* =========================================================
   VISIBILIDAD DE LA PESTAÑA
========================================================= */

function controlarVisibilidadDocumento() {

  if (
    document.hidden &&
    isPlaying
  ) {
    pausarExperiencia();
  }

}





/* =========================================================
   REGISTRO DE EVENTOS
========================================================= */

function registrarEventos() {

  [
    btnAbrirExperience,
    btnAbrirExperienceSecundario,
    fcVideoPreview
  ]
    .filter(Boolean)
    .forEach((boton) => {

      boton.addEventListener(
        "click",
        abrirExperience
      );

    });


  btnCerrarExperience
    ?.addEventListener(
      "click",
      cerrarExperience
    );


  elementosCerrarExperience
    .forEach((elemento) => {

      elemento.addEventListener(
        "click",
        cerrarExperience
      );

    });


  btnPlayPauseExperience
    ?.addEventListener(
      "click",
      alternarPlayPause
    );


  btnReiniciarExperience
    ?.addEventListener(
      "click",
      reiniciarExperiencia
    );


  btnSonidoExperience
    ?.addEventListener(
      "click",
      alternarSonido
    );


  btnPantallaCompletaExperience
    ?.addEventListener(
      "click",
      alternarPantallaCompleta
    );


  fcevTimelineTrack
    ?.addEventListener(
      "click",
      buscarEnTimeline
    );


  fcevTimelineTrack
    ?.setAttribute(
      "tabindex",
      "0"
    );


  fcevTimelineTrack
    ?.setAttribute(
      "role",
      "slider"
    );


  fcevTimelineTrack
    ?.setAttribute(
      "aria-label",
      "Línea de tiempo de la experiencia"
    );


  fcevTimelineTrack
    ?.setAttribute(
      "aria-valuemin",
      "0"
    );


  fcevTimelineTrack
    ?.setAttribute(
      "aria-valuemax",
      String(
        FCEV_CONFIG.totalDuration
      )
    );


  fcevTimelineTrack
    ?.addEventListener(
      "keydown",
      controlarTimelineConTeclado
    );


  document.addEventListener(
    "keydown",
    controlarTecladoGlobal
  );


  document.addEventListener(
    "keydown",
    mantenerFocoEnModal
  );


  document.addEventListener(
    "visibilitychange",
    controlarVisibilidadDocumento
  );


  document.addEventListener(
    "fullscreenchange",
    actualizarBotonPantallaCompleta
  );


  window.addEventListener(
    "resize",
    redimensionarCanvasParticulas
  );


 fcExperienceMusic
  ?.addEventListener(
    "error",
    () => {
      console.warn(
        "FALCO® Campus: no se pudo cargar la música."
      );
    }
  );


fcExperienceVoice
  ?.addEventListener(
    "error",
    () => {
      console.warn(
        "FALCO® Campus: no se pudo cargar la narración."
      );
    }
  );


fcExperienceMusic
  ?.addEventListener(
    "ended",
    () => {
      console.info(
        "FALCO® Campus: finalizó la música."
      );
    }
  );


fcExperienceVoice
  ?.addEventListener(
    "ended",
    () => {
      console.info(
        "FALCO® Campus: finalizó la narración."
      );
    }
  );

}


/* =========================================================
   OBSERVADOR DE MOVIMIENTO REDUCIDO
========================================================= */

function registrarPreferenciaMovimiento() {

  const mediaQuery =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  const actualizarPreferencia =
    (evento) => {

      supportsReducedMotion =
        evento.matches;

    };

  if (
    typeof mediaQuery.addEventListener ===
    "function"
  ) {

    mediaQuery.addEventListener(
      "change",
      actualizarPreferencia
    );

  } else {

    mediaQuery.addListener(
      actualizarPreferencia
    );

  }

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function inicializarFALCOExperience() {

  if (!fcExperienceModal) {
    return;
  }

  if (!escenas.length) {

    console.warn(
      "FALCO® Campus: no se encontraron las escenas de FALCO Experience®."
    );

    return;

  }

  if (fcevTotalTime) {

    fcevTotalTime.textContent =
      formatearTiempo(
        FCEV_CONFIG.totalDuration
      );

  }

  if (fcevCurrentTime) {
    fcevCurrentTime.textContent = "00:00";
  }

  actualizarIconoPlayPause();

  actualizarIconoSonido();

  actualizarBotonPantallaCompleta();

  registrarEventos();

  registrarPreferenciaMovimiento();

  activarEscena(
    escenas[0],
    true
  );

  actualizarExperienciaVisual();

  fcExperienceModal.hidden = true;

}


/* =========================================================
   INICIO
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    inicializarFALCOExperience,
    {
      once: true
    }
  );

} else {

  inicializarFALCOExperience();

}