/* =========================================================
   FALCO Campus Admin™
   Cursos v1.0
========================================================= */

const CampusCursos = {

  tarjetas: [],
  buscador: null,
  filtro: null,
  contador: null,
  estadoVacio: null,

  init() {

    this.tarjetas = [
      ...document.querySelectorAll("[data-curso]")
    ];

    this.buscador =
      document.getElementById("buscadorCursos");

    this.filtro =
      document.getElementById("filtroEstado");

    this.contador =
      document.getElementById("cantidadResultados");

    this.estadoVacio =
      document.getElementById("estadoSinResultados");

    this.eventos();

    this.filtrar();

    console.info(
      "FALCO Campus Cursos™ v1.0 Ready"
    );

  },

  eventos() {

    if (this.buscador) {

      this.buscador.addEventListener(
        "input",
        () => this.filtrar()
      );

    }

    if (this.filtro) {

      this.filtro.addEventListener(
        "change",
        () => this.filtrar()
      );

    }

    const limpiar =
      document.getElementById("btnLimpiarFiltros");

    if (limpiar) {

      limpiar.addEventListener(
        "click",
        () => {

          this.buscador.value = "";
          this.filtro.value = "todos";

          this.filtrar();

        }
      );

    }

    const nuevo =
      document.getElementById("btnNuevoCurso");

    if (nuevo) {

      nuevo.addEventListener(
        "click",
        () => {

          alert(
            "Próximamente: Alta de nuevos cursos."
          );

        }
      );

    }

  },

  filtrar() {

    const texto =
      this.buscador.value
        .trim()
        .toLowerCase();

    const estado =
      this.filtro.value;

    let visibles = 0;

    this.tarjetas.forEach(tarjeta => {

      const nombre =
        (tarjeta.dataset.nombre || "")
          .toLowerCase();

      const descripcion =
        (tarjeta.dataset.descripcion || "")
          .toLowerCase();

      const estadoCurso =
        tarjeta.dataset.estado;

      const coincideTexto =
        nombre.includes(texto) ||
        descripcion.includes(texto);

      const coincideEstado =
        estado === "todos" ||
        estadoCurso === estado;

      const mostrar =
        coincideTexto &&
        coincideEstado;

      tarjeta.classList.toggle(
        "curso-card--hidden",
        !mostrar
      );

      if (mostrar) visibles++;

    });

    this.actualizarContador(visibles);

    this.estadoVacio.classList.toggle(
      "campus-hidden",
      visibles !== 0
    );

  },

  actualizarContador(total) {

    this.contador.textContent =
      total === 1
        ? "1 curso"
        : `${total} cursos`;

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => {

    CampusCursos.init();

  }
);