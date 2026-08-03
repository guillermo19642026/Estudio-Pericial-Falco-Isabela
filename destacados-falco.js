/* =========================================================
   SISTEMA FALCO®
   FALCO® DESTACADOS
   Carrusel editorial institucional
========================================================= */

const falcoDestacados =
  document.getElementById("falcoDestacados");

const falcoDestacadosViewport =
  document.getElementById("falcoDestacadosViewport");

const falcoSlides =
  [...document.querySelectorAll("[data-destacado-slide]")];

const falcoIndicadores =
  [
    ...document.querySelectorAll(
      "[data-destacado-indice]"
    )
  ];

const btnFalcoAnterior =
  document.getElementById("falcoDestacadoAnterior");

const btnFalcoSiguiente =
  document.getElementById("falcoDestacadoSiguiente");

const falcoProgreso =
  document.getElementById("falcoDestacadosProgreso");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_INTERVALO = 7000;
const FALCO_TRANSICION = 520;

let falcoIndiceActual = 0;
let falcoTemporizador = null;
let falcoTemporizadorProgreso = null;
let falcoEstaPausado = false;
let falcoEstaCambiando = false;

let falcoTouchInicioX = 0;
let falcoTouchInicioY = 0;
let falcoTouchFinX = 0;
let falcoTouchFinY = 0;


/* =========================================================
   UTILIDADES
========================================================= */

function normalizarIndice(indice) {
  const total = falcoSlides.length;

  if (!total) {
    return 0;
  }

  return (indice + total) % total;
}


function obtenerSlideActual() {
  return falcoSlides[falcoIndiceActual] || null;
}


function actualizarIndicadores() {
  falcoIndicadores.forEach((indicador, indice) => {
    const esActivo = indice === falcoIndiceActual;

    indicador.classList.toggle(
      "is-active",
      esActivo
    );

    indicador.setAttribute(
      "aria-current",
      esActivo ? "true" : "false"
    );
  });
}


function actualizarAccesibilidadSlides() {
  falcoSlides.forEach((slide, indice) => {
    const esActivo = indice === falcoIndiceActual;

    slide.setAttribute(
      "aria-hidden",
      esActivo ? "false" : "true"
    );

    const enlace =
      slide.querySelector(".falco-destacado__enlace");

    if (enlace) {
      enlace.tabIndex = esActivo ? 0 : -1;
    }
  });
}


/* =========================================================
   BARRA DE PROGRESO
========================================================= */

function detenerProgreso() {
  if (falcoTemporizadorProgreso) {
    clearTimeout(falcoTemporizadorProgreso);
    falcoTemporizadorProgreso = null;
  }

  if (!falcoProgreso) {
    return;
  }

  falcoProgreso.style.transition = "none";
  falcoProgreso.style.width = "0%";
}


function iniciarProgreso() {
  detenerProgreso();

  if (
    !falcoProgreso ||
    falcoEstaPausado ||
    falcoSlides.length <= 1
  ) {
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      falcoProgreso.style.transition =
        `width ${FALCO_INTERVALO}ms linear`;

      falcoProgreso.style.width = "100%";
    });
  });

  falcoTemporizadorProgreso = setTimeout(() => {
    detenerProgreso();
  }, FALCO_INTERVALO);
}


/* =========================================================
   CAMBIO DE DIAPOSITIVA
========================================================= */

function mostrarSlide(nuevoIndice, reiniciar = true) {
  if (
    !falcoSlides.length ||
    falcoEstaCambiando
  ) {
    return;
  }

  const indiceNormalizado =
    normalizarIndice(nuevoIndice);

  if (indiceNormalizado === falcoIndiceActual) {
    if (reiniciar) {
      reiniciarAutoplay();
    }

    return;
  }

  const slideAnterior =
    falcoSlides[falcoIndiceActual];

  const slideNuevo =
    falcoSlides[indiceNormalizado];

  if (!slideAnterior || !slideNuevo) {
    return;
  }

  falcoEstaCambiando = true;

  slideAnterior.classList.add("is-leaving");
  slideAnterior.classList.remove("is-active");

  falcoIndiceActual = indiceNormalizado;

  slideNuevo.classList.remove("is-leaving");
  slideNuevo.classList.add("is-active");

  actualizarIndicadores();
  actualizarAccesibilidadSlides();

  window.setTimeout(() => {
    slideAnterior.classList.remove("is-leaving");
    falcoEstaCambiando = false;
  }, FALCO_TRANSICION);

  if (reiniciar) {
    reiniciarAutoplay();
  }
}


function mostrarSiguiente() {
  mostrarSlide(falcoIndiceActual + 1);
}


function mostrarAnterior() {
  mostrarSlide(falcoIndiceActual - 1);
}


/* =========================================================
   AUTOPLAY
========================================================= */

function detenerAutoplay() {
  if (falcoTemporizador) {
    clearInterval(falcoTemporizador);
    falcoTemporizador = null;
  }

  detenerProgreso();
}


function iniciarAutoplay() {
  detenerAutoplay();

  if (
    falcoEstaPausado ||
    falcoSlides.length <= 1 ||
    document.hidden
  ) {
    return;
  }

  iniciarProgreso();

  falcoTemporizador = setInterval(() => {
    mostrarSlide(
      falcoIndiceActual + 1,
      false
    );

    iniciarProgreso();
  }, FALCO_INTERVALO);
}


function reiniciarAutoplay() {
  if (falcoEstaPausado) {
    detenerAutoplay();
    return;
  }

  iniciarAutoplay();
}


/* =========================================================
   PAUSA
========================================================= */

function pausarDestacados() {
  falcoEstaPausado = true;

  falcoDestacados?.classList.add(
    "is-paused"
  );

  detenerAutoplay();
}


function reanudarDestacados() {
  falcoEstaPausado = false;

  falcoDestacados?.classList.remove(
    "is-paused"
  );

  iniciarAutoplay();
}


/* =========================================================
   BOTONES
========================================================= */

btnFalcoAnterior?.addEventListener(
  "click",
  () => {
    mostrarAnterior();
  }
);

btnFalcoSiguiente?.addEventListener(
  "click",
  () => {
    mostrarSiguiente();
  }
);


/* =========================================================
   INDICADORES
========================================================= */

falcoIndicadores.forEach((indicador) => {
  indicador.addEventListener(
    "click",
    () => {
      const indice =
        Number(indicador.dataset.destacadoIndice);

      if (!Number.isInteger(indice)) {
        return;
      }

      mostrarSlide(indice);
    }
  );
});


/* =========================================================
   INTERACCIÓN CON MOUSE Y FOCO
   El carrusel continúa automáticamente.
========================================================= */

falcoDestacados?.addEventListener(
  "mouseenter",
  () => {
    falcoDestacados.classList.add(
      "is-hovered"
    );
  }
);

falcoDestacados?.addEventListener(
  "mouseleave",
  () => {
    falcoDestacados.classList.remove(
      "is-hovered"
    );

    reiniciarAutoplay();
  }
);

falcoDestacados?.addEventListener(
  "focusout",
  () => {
    reiniciarAutoplay();
  }
);

/* =========================================================
   GESTO TÁCTIL
========================================================= */

falcoDestacadosViewport?.addEventListener(
  "touchstart",
  (evento) => {
    const toque = evento.touches[0];

    falcoTouchInicioX = toque.clientX;
    falcoTouchInicioY = toque.clientY;
    falcoTouchFinX = toque.clientX;
    falcoTouchFinY = toque.clientY;

    pausarDestacados();
  },
  { passive: true }
);


falcoDestacadosViewport?.addEventListener(
  "touchmove",
  (evento) => {
    const toque = evento.touches[0];

    falcoTouchFinX = toque.clientX;
    falcoTouchFinY = toque.clientY;
  },
  { passive: true }
);


falcoDestacadosViewport?.addEventListener(
  "touchend",
  () => {
    const desplazamientoX =
      falcoTouchFinX - falcoTouchInicioX;

    const desplazamientoY =
      falcoTouchFinY - falcoTouchInicioY;

    const esHorizontal =
      Math.abs(desplazamientoX) >
      Math.abs(desplazamientoY);

    const superaUmbral =
      Math.abs(desplazamientoX) >= 45;

    if (esHorizontal && superaUmbral) {
      if (desplazamientoX < 0) {
        mostrarSiguiente();
      } else {
        mostrarAnterior();
      }
    }

    window.setTimeout(
      reanudarDestacados,
      700
    );
  },
  { passive: true }
);


/* =========================================================
   TECLADO
========================================================= */

falcoDestacados?.addEventListener(
  "keydown",
  (evento) => {
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      mostrarAnterior();
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      mostrarSiguiente();
    }
  }
);


/* =========================================================
   VISIBILIDAD DE LA PESTAÑA
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      detenerAutoplay();
      return;
    }

    if (!falcoEstaPausado) {
      iniciarAutoplay();
    }
  }
);


/* =========================================================
   OBSERVAR SI EL CARRUSEL ESTÁ EN PANTALLA
========================================================= */

if (
  falcoDestacados &&
  "IntersectionObserver" in window
) {
  const observadorDestacados =
    new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            if (!falcoEstaPausado) {
              iniciarAutoplay();
            }
          } else {
            detenerAutoplay();
          }
        });
      },
      {
        threshold: 0.18
      }
    );

  observadorDestacados.observe(
    falcoDestacados
  );
}


/* =========================================================
   REDUCCIÓN DE MOVIMIENTO
========================================================= */

const falcoReduceMovimiento =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

function aplicarPreferenciaMovimiento() {
  if (falcoReduceMovimiento.matches) {
    pausarDestacados();
  } else {
    reanudarDestacados();
  }
}

falcoReduceMovimiento.addEventListener?.(
  "change",
  aplicarPreferenciaMovimiento
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function inicializarFalcoDestacados() {
  if (!falcoSlides.length) {
    return;
  }

  falcoIndiceActual = 0;

  falcoSlides.forEach((slide, indice) => {
    slide.classList.toggle(
      "is-active",
      indice === 0
    );

    slide.classList.remove(
      "is-leaving"
    );
  });

  actualizarIndicadores();
  actualizarAccesibilidadSlides();

  if (falcoReduceMovimiento.matches) {
    pausarDestacados();
  } else {
    iniciarAutoplay();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  inicializarFalcoDestacados
);