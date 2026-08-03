/* =========================================================
   FALCO® CAMPUS
   INTERFAZ GENERAL
========================================================= */

const fcHeader =
  document.getElementById("fcHeader");

const fcMenuButton =
  document.getElementById("fcMenuButton");

const fcNav =
  document.getElementById("fcNav");


/* =========================================================
   HEADER AL HACER SCROLL
========================================================= */

function actualizarHeader() {
  if (!fcHeader) {
    return;
  }

  fcHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > 24
  );
}

window.addEventListener(
  "scroll",
  actualizarHeader,
  { passive: true }
);

actualizarHeader();


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function abrirMenu() {
  if (!fcMenuButton || !fcNav) {
    return;
  }

  fcMenuButton.classList.add("is-open");
  fcNav.classList.add("is-open");

  fcMenuButton.setAttribute(
    "aria-expanded",
    "true"
  );
}


function cerrarMenu() {
  if (!fcMenuButton || !fcNav) {
    return;
  }

  fcMenuButton.classList.remove("is-open");
  fcNav.classList.remove("is-open");

  fcMenuButton.setAttribute(
    "aria-expanded",
    "false"
  );
}


function alternarMenu() {
  if (!fcMenuButton || !fcNav) {
    return;
  }

  const estaAbierto =
    fcNav.classList.contains("is-open");

  if (estaAbierto) {
    cerrarMenu();
  } else {
    abrirMenu();
  }
}


fcMenuButton?.addEventListener(
  "click",
  alternarMenu
);


fcNav
  ?.querySelectorAll("a")
  .forEach((enlace) => {
    enlace.addEventListener(
      "click",
      cerrarMenu
    );
  });


document.addEventListener(
  "click",
  (evento) => {
    if (!fcNav || !fcMenuButton) {
      return;
    }

    const clicDentroDelMenu =
      fcNav.contains(evento.target);

    const clicEnBoton =
      fcMenuButton.contains(evento.target);

    if (
      fcNav.classList.contains("is-open") &&
      !clicDentroDelMenu &&
      !clicEnBoton
    ) {
      cerrarMenu();
    }
  }
);


document.addEventListener(
  "keydown",
  (evento) => {
    if (evento.key === "Escape") {
      cerrarMenu();
    }
  }
);


/* =========================================================
   CERRAR MENÚ AL CAMBIAR TAMAÑO
========================================================= */

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > 1080) {
      cerrarMenu();
    }
  }
);


/* =========================================================
   REVEAL AL HACER SCROLL
========================================================= */

const elementosReveal = [
  ...document.querySelectorAll(
    [
      ".fc-manifest__content",
      ".fc-section-heading",
      ".fc-partnership-card",
      ".fc-feature-card",
      ".fc-experience__content",
      ".fc-experience__visual",
      ".fc-process-step",
      ".fc-audience__grid article",
      ".fc-custom",
      ".fc-final-cta__content"
    ].join(",")
  )
];

elementosReveal.forEach(
  (elemento) => {
    elemento.classList.add("fc-reveal");
  }
);


if ("IntersectionObserver" in window) {
  const observadorReveal =
    new IntersectionObserver(
      (entradas, observador) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) {
            return;
          }

          entrada.target.classList.add(
            "is-visible"
          );

          observador.unobserve(
            entrada.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -60px 0px"
      }
    );

  elementosReveal.forEach(
    (elemento) => {
      observadorReveal.observe(elemento);
    }
  );

} else {
  elementosReveal.forEach(
    (elemento) => {
      elemento.classList.add("is-visible");
    }
  );
}


/* =========================================================
   EFECTO PARALLAX SUAVE EN HERO
========================================================= */

const fcHeroProduct =
  document.querySelector(
    ".fc-hero__product"
  );

const fcHeroContent =
  document.querySelector(
    ".fc-hero__content"
  );


function actualizarParallaxHero() {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  if (window.innerWidth < 821) {
    if (fcHeroProduct) {
      fcHeroProduct.style.transform = "";
    }

    if (fcHeroContent) {
      fcHeroContent.style.transform = "";
    }

    return;
  }

  const desplazamiento =
    Math.min(window.scrollY, 700);

  if (fcHeroProduct) {
    fcHeroProduct.style.transform =
      `translateY(${desplazamiento * 0.035}px)`;
  }

  if (fcHeroContent) {
    fcHeroContent.style.transform =
      `translateY(${desplazamiento * 0.018}px)`;
  }
}


window.addEventListener(
  "scroll",
  actualizarParallaxHero,
  { passive: true }
);

actualizarParallaxHero();


/* =========================================================
   RESALTAR ENLACE ACTIVO EN NAVEGACIÓN
========================================================= */

const enlacesInternos =
  [...document.querySelectorAll(
    '.fc-nav a[href^="#"]'
  )];

const seccionesNavegables =
  enlacesInternos
    .map((enlace) => {
      const selector =
        enlace.getAttribute("href");

      if (
        !selector ||
        selector === "#"
      ) {
        return null;
      }

      const seccion =
        document.querySelector(selector);

      if (!seccion) {
        return null;
      }

      return {
        enlace,
        seccion
      };
    })
    .filter(Boolean);


function actualizarEnlaceActivo() {
  if (!seccionesNavegables.length) {
    return;
  }

  const referencia =
    window.scrollY + 150;

  let actual =
    seccionesNavegables[0];

  seccionesNavegables.forEach(
    (item) => {
      if (
        item.seccion.offsetTop <= referencia
      ) {
        actual = item;
      }
    }
  );

  seccionesNavegables.forEach(
    ({ enlace }) => {
      enlace.classList.remove(
        "is-active"
      );
    }
  );

  actual.enlace.classList.add(
    "is-active"
  );
}


window.addEventListener(
  "scroll",
  actualizarEnlaceActivo,
  { passive: true }
);

actualizarEnlaceActivo();


/* =========================================================
   SCROLL SUAVE CON COMPENSACIÓN DEL HEADER
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((enlace) => {
    enlace.addEventListener(
      "click",
      (evento) => {
        const destino =
          enlace.getAttribute("href");

        if (
          !destino ||
          destino === "#"
        ) {
          return;
        }

        const seccion =
          document.querySelector(destino);

        if (!seccion) {
          return;
        }

        evento.preventDefault();

        const alturaHeader =
          fcHeader?.offsetHeight || 0;

        const posicion =
          seccion.getBoundingClientRect().top +
          window.scrollY -
          alturaHeader -
          12;

        window.scrollTo({
          top: posicion,
          behavior: "smooth"
        });
      }
    );
  });


/* =========================================================
   TARJETAS DEL HERO CON MOVIMIENTO DEL MOUSE
========================================================= */

const dispositivo =
  document.querySelector(".fc-device");

const tarjetasFlotantes =
  [
    ...document.querySelectorAll(
      ".fc-floating-card"
    )
  ];


function moverHeroConMouse(evento) {
  if (
    window.innerWidth < 1081 ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  const ancho =
    window.innerWidth;

  const alto =
    window.innerHeight;

  const porcentajeX =
    evento.clientX / ancho - 0.5;

  const porcentajeY =
    evento.clientY / alto - 0.5;

  if (dispositivo) {
    dispositivo.style.setProperty(
      "--fc-mouse-x",
      `${porcentajeX * 10}deg`
    );

    dispositivo.style.setProperty(
      "--fc-mouse-y",
      `${porcentajeY * -7}deg`
    );

    dispositivo.style.transform = `
      translate(-50%, -50%)
      rotateY(calc(-8deg + var(--fc-mouse-x)))
      rotateX(calc(4deg + var(--fc-mouse-y)))
    `;
  }

  tarjetasFlotantes.forEach(
    (tarjeta, indice) => {
      const intensidad =
        7 + indice * 3;

      tarjeta.style.marginLeft =
        `${porcentajeX * intensidad}px`;

      tarjeta.style.marginTop =
        `${porcentajeY * intensidad}px`;
    }
  );
}


function restaurarHero() {
  if (dispositivo) {
    dispositivo.style.transform = "";
  }

  tarjetasFlotantes.forEach(
    (tarjeta) => {
      tarjeta.style.marginLeft = "";
      tarjeta.style.marginTop = "";
    }
  );
}


window.addEventListener(
  "mousemove",
  moverHeroConMouse,
  { passive: true }
);

document
  .querySelector(".fc-hero")
  ?.addEventListener(
    "mouseleave",
    restaurarHero
  );


/* =========================================================
   VIDEO DE FONDO
========================================================= */

const fcHeroVideo =
  document.getElementById("fcHeroVideo");


async function iniciarVideoHero() {
  if (!fcHeroVideo) {
    return;
  }

  try {
    fcHeroVideo.muted = true;

    await fcHeroVideo.play();

  } catch (error) {
    console.info(
      "FALCO® Campus: el video del hero espera interacción del usuario."
    );
  }
}


window.addEventListener(
  "load",
  iniciarVideoHero
);


/* =========================================================
   ESTADO DE CARGA
========================================================= */

window.addEventListener(
  "load",
  () => {
    document.body.classList.add(
      "fc-page-ready"
    );
  }
);


/* =========================================================
   INICIALIZACIÓN DE ICONOS
========================================================= */

function actualizarIconos() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  actualizarIconos
);