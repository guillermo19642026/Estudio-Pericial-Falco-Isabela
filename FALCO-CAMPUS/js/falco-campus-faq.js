/* =========================================================
   FALCO® CAMPUS
   PREGUNTAS FRECUENTES
========================================================= */

const faqItems =
  [...document.querySelectorAll(".fcq-item")];

const faqQuestions =
  [...document.querySelectorAll(".fcq-question")];

const faqCategories =
  [...document.querySelectorAll("[data-faq-filter]")];

const faqEmpty =
  document.getElementById("faqEmpty");


/* =========================================================
   ABRIR Y CERRAR PREGUNTAS
========================================================= */

function cerrarPregunta(item) {
  if (!item) {
    return;
  }

  const boton =
    item.querySelector(".fcq-question");

  const respuesta =
    item.querySelector(".fcq-answer");

  item.classList.remove("is-open");

  boton?.setAttribute(
    "aria-expanded",
    "false"
  );

  if (respuesta) {
    respuesta.hidden = true;
  }
}


function abrirPregunta(item) {
  if (!item) {
    return;
  }

  const boton =
    item.querySelector(".fcq-question");

  const respuesta =
    item.querySelector(".fcq-answer");

  item.classList.add("is-open");

  boton?.setAttribute(
    "aria-expanded",
    "true"
  );

  if (respuesta) {
    respuesta.hidden = false;
  }
}


function alternarPregunta(evento) {
  const boton =
    evento.currentTarget;

  const item =
    boton.closest(".fcq-item");

  if (!item) {
    return;
  }

  const estaAbierta =
    item.classList.contains("is-open");

  faqItems.forEach((otroItem) => {
    if (otroItem !== item) {
      cerrarPregunta(otroItem);
    }
  });

  if (estaAbierta) {
    cerrarPregunta(item);
  } else {
    abrirPregunta(item);
  }
}


faqQuestions.forEach((boton) => {
  boton.addEventListener(
    "click",
    alternarPregunta
  );
});


/* =========================================================
   FILTRO POR CATEGORÍA
========================================================= */

function actualizarEstadoVacio() {
  if (!faqEmpty) {
    return;
  }

  const cantidadVisibles =
    faqItems.filter(
      (item) =>
        !item.classList.contains("is-hidden")
    ).length;

  faqEmpty.hidden =
    cantidadVisibles > 0;
}


function aplicarFiltro(categoria) {
  faqItems.forEach((item) => {
    const categoriaItem =
      item.dataset.faqCategory || "";

    const mostrar =
      categoria === "todas" ||
      categoriaItem === categoria;

    item.classList.toggle(
      "is-hidden",
      !mostrar
    );

    if (!mostrar) {
      cerrarPregunta(item);
    }
  });

  actualizarEstadoVacio();
}


faqCategories.forEach((boton) => {
  boton.addEventListener(
    "click",
    () => {
      const categoria =
        boton.dataset.faqFilter || "todas";

      faqCategories.forEach(
        (otroBoton) => {
          otroBoton.classList.remove(
            "is-active"
          );

          otroBoton.setAttribute(
            "aria-pressed",
            "false"
          );
        }
      );

      boton.classList.add("is-active");

      boton.setAttribute(
        "aria-pressed",
        "true"
      );

      aplicarFiltro(categoria);
    }
  );
});


/* =========================================================
   NAVEGACIÓN CON TECLADO ENTRE PREGUNTAS
========================================================= */

faqQuestions.forEach((boton, indice) => {
  boton.addEventListener(
    "keydown",
    (evento) => {
      if (
        evento.key !== "ArrowDown" &&
        evento.key !== "ArrowUp"
      ) {
        return;
      }

      evento.preventDefault();

      const preguntasVisibles =
        faqQuestions.filter((pregunta) => {
          const item =
            pregunta.closest(".fcq-item");

          return (
            item &&
            !item.classList.contains("is-hidden")
          );
        });

      const indiceActual =
        preguntasVisibles.indexOf(boton);

      if (indiceActual === -1) {
        return;
      }

      let siguienteIndice =
        indiceActual;

      if (evento.key === "ArrowDown") {
        siguienteIndice =
          (indiceActual + 1) %
          preguntasVisibles.length;
      }

      if (evento.key === "ArrowUp") {
        siguienteIndice =
          (
            indiceActual -
            1 +
            preguntasVisibles.length
          ) %
          preguntasVisibles.length;
      }

      preguntasVisibles[
        siguienteIndice
      ]?.focus();
    }
  );
});


/* =========================================================
   ESTADO INICIAL
========================================================= */

function inicializarFaq() {
  faqItems.forEach((item) => {
    cerrarPregunta(item);
  });

  faqCategories.forEach((boton) => {
    const esActivo =
      boton.classList.contains("is-active");

    boton.setAttribute(
      "aria-pressed",
      esActivo ? "true" : "false"
    );
  });

  aplicarFiltro("todas");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}


document.addEventListener(
  "DOMContentLoaded",
  inicializarFaq
);