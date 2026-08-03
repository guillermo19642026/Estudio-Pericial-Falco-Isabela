/* =========================================================
   FALCO® CAMPUS
   CONTROL DE FALCO EXPERIENCE®
========================================================= */

const fcExperienceModal =
  document.getElementById("fcExperienceModal");

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

const elementosCerrarExperience =
  document.querySelectorAll(
    "[data-close-experience]"
  );

let elementoQueAbrioModal = null;


/* =========================================================
   ABRIR EXPERIENCIA
========================================================= */

async function abrirExperience(evento) {
  if (!fcExperienceModal) {
    return;
  }

  elementoQueAbrioModal =
    evento?.currentTarget ||
    document.activeElement;

  fcExperienceModal.hidden = false;

  document.body.classList.add(
    "is-modal-open"
  );

  btnCerrarExperience?.focus();

  if (!fcExperienceVideo) {
    return;
  }

  try {
    fcExperienceVideo.currentTime = 0;

    await fcExperienceVideo.play();

  } catch (error) {
    console.info(
      "FALCO® Campus: el video espera interacción del usuario."
    );
  }
}


/* =========================================================
   CERRAR EXPERIENCIA
========================================================= */

function cerrarExperience() {
  if (!fcExperienceModal) {
    return;
  }

  if (fcExperienceVideo) {
    fcExperienceVideo.pause();
    fcExperienceVideo.currentTime = 0;
  }

  fcExperienceModal.hidden = true;

  document.body.classList.remove(
    "is-modal-open"
  );

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
   EVENTOS DE APERTURA
========================================================= */

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


/* =========================================================
   EVENTOS DE CIERRE
========================================================= */

btnCerrarExperience?.addEventListener(
  "click",
  cerrarExperience
);

elementosCerrarExperience.forEach(
  (elemento) => {
    elemento.addEventListener(
      "click",
      cerrarExperience
    );
  }
);


/* =========================================================
   CERRAR CON ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  (evento) => {
    if (
      evento.key === "Escape" &&
      fcExperienceModal &&
      !fcExperienceModal.hidden
    ) {
      cerrarExperience();
    }
  }
);


/* =========================================================
   CONTROL DEL FOCO DENTRO DEL MODAL
========================================================= */

document.addEventListener(
  "keydown",
  (evento) => {
    if (
      evento.key !== "Tab" ||
      !fcExperienceModal ||
      fcExperienceModal.hidden
    ) {
      return;
    }

    const elementosInteractivos =
      [
        ...fcExperienceModal.querySelectorAll(
          [
            "button:not([disabled])",
            "a[href]",
            "video[controls]",
            '[tabindex]:not([tabindex="-1"])'
          ].join(",")
        )
      ].filter(
        (elemento) =>
          !elemento.hasAttribute("hidden")
      );

    if (!elementosInteractivos.length) {
      return;
    }

    const primero =
      elementosInteractivos[0];

    const ultimo =
      elementosInteractivos[
        elementosInteractivos.length - 1
      ];

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
);


/* =========================================================
   PAUSAR VIDEO AL CAMBIAR DE PESTAÑA
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.hidden &&
      fcExperienceVideo &&
      !fcExperienceVideo.paused
    ) {
      fcExperienceVideo.pause();
    }
  }
);


/* =========================================================
   ERRORES DE CARGA
========================================================= */

fcExperienceVideo?.addEventListener(
  "error",
  () => {
    console.warn(
      "FALCO® Campus: todavía no se encontró el video falco-campus-experience.mp4."
    );
  }
);