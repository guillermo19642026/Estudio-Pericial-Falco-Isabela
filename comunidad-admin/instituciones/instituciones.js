/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Instituciones
   Versión 1.1
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_INSTITUCIONES_CONFIG = {

  claveInstitucionesLocales:
    "falco_comunidad_instituciones"

};


/* =========================================================
   MÓDULO PRINCIPAL
========================================================= */

const FalcoComunidadInstituciones = {

  elementos: {},

  instituciones: [],

  filtros: {

    busqueda: "",

    tipo: "",

    estado: ""

  },


  /* =======================================================
     INICIO
  ======================================================= */

  init() {

    this.obtenerElementos();

    this.vincularEventos();

    this.cargarInstituciones();

    console.info(
      "FALCO Comunidad Instituciones™ v1.1 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

obtenerElementos() {

  this.elementos = {

    buscador:
      document.getElementById("buscadorInstituciones") ||
      document.getElementById("buscarInstituciones") ||
      document.querySelector(
        'input[type="search"]'
      ),

    filtroTipo:
      document.getElementById("filtroTipoInstitucion") ||
      document.getElementById("filtroTipo") ||
      document.querySelector(
        'select[name="tipo"]'
      ),

    filtroEstado:
      document.getElementById("filtroEstadoInstitucion") ||
      document.getElementById("filtroEstado") ||
      document.querySelector(
        'select[name="estado"]'
      ),

    botonLimpiar:
      document.getElementById("botonLimpiarFiltros") ||
      document.getElementById("limpiarFiltros"),

    botonActualizar:
      document.getElementById("botonActualizarInstituciones") ||
      document.getElementById("actualizarInstituciones"),

    lista:
      document.getElementById("listaInstituciones") ||
      document.getElementById("contenedorInstituciones"),

    sinResultados:
      document.getElementById("sinResultadosInstituciones") ||
      document.getElementById("estadoSinResultados"),

    estadoCarga:
      document.getElementById("estadoCargaInstituciones") ||
      document.getElementById("cargandoInstituciones"),

    resumen:
      document.getElementById("resumenInstituciones") ||
      document.getElementById("textoResumenInstituciones"),

    total:
      document.getElementById("totalInstituciones"),

    totalActivas:
      document.getElementById("totalInstitucionesActivas") ||
      document.getElementById("institucionesActivas"),

    totalPendientes:
      document.getElementById("totalInstitucionesPendientes") ||
      document.getElementById("institucionesPendientes"),

    totalInactivas:
      document.getElementById("totalInstitucionesInactivas") ||
      document.getElementById("institucionesInactivas")

  };

},


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    const {
      buscador,
      filtroTipo,
      filtroEstado,
      botonLimpiar,
      botonActualizar
    } = this.elementos;


    if (buscador) {

      buscador.addEventListener(
        "input",
        (evento) => {

          this.filtros.busqueda =
            this.normalizarTexto(
              evento.target.value
            );

          this.actualizarVista();

        }
      );

    }


    if (filtroTipo) {

      filtroTipo.addEventListener(
        "change",
        (evento) => {

          this.filtros.tipo =
            evento.target.value;

          this.actualizarVista();

        }
      );

    }


    if (filtroEstado) {

      filtroEstado.addEventListener(
        "change",
        (evento) => {

          this.filtros.estado =
            evento.target.value;

          this.actualizarVista();

        }
      );

    }


    if (botonLimpiar) {

      botonLimpiar.addEventListener(
        "click",
        () => {

          this.limpiarFiltros();

        }
      );

    }


    if (botonActualizar) {

      botonActualizar.addEventListener(
        "click",
        () => {

          this.actualizarInstituciones();

        }
      );

    }

    const lista =
  this.elementos.lista;


if (lista) {

  lista.addEventListener(
    "click",
    (evento) => {

      const tarjeta =
        evento.target.closest(
          "[data-institucion-id]"
        );


      if (!tarjeta) {

        return;

      }


      const id =
        tarjeta.dataset.institucionId;


      if (!id) {

        return;

      }


      window.location.href =
        `institucion.html?id=${encodeURIComponent(
          id
        )}`;

    }
  );


  lista.addEventListener(
    "keydown",
    (evento) => {

      if (
        evento.key !== "Enter" &&
        evento.key !== " "
      ) {

        return;

      }


      const tarjeta =
        evento.target.closest(
          "[data-institucion-id]"
        );


      if (!tarjeta) {

        return;

      }


      evento.preventDefault();


      const id =
        tarjeta.dataset.institucionId;


      if (!id) {

        return;

      }


      window.location.href =
        `institucion.html?id=${encodeURIComponent(
          id
        )}`;

    }
  );

}

  },


  /* =======================================================
     CARGA DE DATOS
  ======================================================= */

  cargarInstituciones() {

    this.mostrarCarga(true);


    window.setTimeout(
      () => {

        this.instituciones =
          this.obtenerInstitucionesLocales();

        this.ordenarInstituciones();

        this.mostrarCarga(false);

        this.actualizarVista();

      },
      250
    );

  },


  obtenerInstitucionesLocales() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_INSTITUCIONES_CONFIG
            .claveInstitucionesLocales
        );


      if (!contenido) {

        return [];

      }


      const instituciones =
        JSON.parse(contenido);


      if (!Array.isArray(instituciones)) {

        return [];

      }


      return instituciones.filter(
        (institucion) =>
          institucion &&
          typeof institucion === "object"
      );

    } catch (error) {

      console.error(
        "No fue posible cargar las instituciones:",
        error
      );

      return [];

    }

  },


  ordenarInstituciones() {

    this.instituciones.sort(
      (institucionA, institucionB) => {

        const fechaA =
          new Date(
            institucionA.fechaAlta || 0
          ).getTime();

        const fechaB =
          new Date(
            institucionB.fechaAlta || 0
          ).getTime();


        return fechaB - fechaA;

      }
    );

  },


  /* =======================================================
     ACTUALIZAR
  ======================================================= */

  actualizarInstituciones() {

    this.mostrarCarga(true);


    window.setTimeout(
      () => {

        this.instituciones =
          this.obtenerInstitucionesLocales();

        this.ordenarInstituciones();

        this.mostrarCarga(false);

        this.actualizarVista();

      },
      350
    );

  },


  /* =======================================================
     FILTROS
  ======================================================= */

  limpiarFiltros() {

    this.filtros = {

      busqueda: "",

      tipo: "",

      estado: ""

    };


    if (this.elementos.buscador) {

      this.elementos.buscador.value = "";

    }


    if (this.elementos.filtroTipo) {

      this.elementos.filtroTipo.value = "";

    }


    if (this.elementos.filtroEstado) {

      this.elementos.filtroEstado.value = "";

    }


    this.actualizarVista();

  },


  obtenerInstitucionesFiltradas() {

    return this.instituciones.filter(
      (institucion) => {

        const coincideBusqueda =
          this.coincideBusqueda(
            institucion
          );

        const tipoInstitucion =
  String(institucion.tipo || "")
    .trim()
    .toLowerCase();

const estadoInstitucion =
  String(institucion.estado || "")
    .trim()
    .toLowerCase();


const coincideTipo =
  !this.filtros.tipo ||
  tipoInstitucion === this.filtros.tipo;


const coincideEstado =
  !this.filtros.estado ||
  estadoInstitucion === this.filtros.estado;


        return (
          coincideBusqueda &&
          coincideTipo &&
          coincideEstado
        );

      }
    );

  },


  coincideBusqueda(institucion) {

    if (!this.filtros.busqueda) {

      return true;

    }


    const campos = [

      institucion.nombre,

      institucion.tipo,

      institucion.referente,

      institucion.cargo,

      institucion.localidad,

      institucion.provincia,

      institucion.correo,

      institucion.telefono

    ];


    const contenido =
      this.normalizarTexto(
        campos
          .filter(Boolean)
          .join(" ")
      );


    return contenido.includes(
      this.filtros.busqueda
    );

  },


  normalizarTexto(valor) {

    return String(valor || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  },


  /* =======================================================
     VISTA
  ======================================================= */

  actualizarVista() {

    const institucionesFiltradas =
      this.obtenerInstitucionesFiltradas();


    this.actualizarIndicadores();

    this.renderizarInstituciones(
      institucionesFiltradas
    );

    this.actualizarResumen(
      institucionesFiltradas.length
    );

  },


  actualizarIndicadores() {

    const total =
      this.instituciones.length;

    const activas =
      this.instituciones.filter(
        (institucion) =>
          institucion.estado === "activa"
      ).length;

    const pendientes =
      this.instituciones.filter(
        (institucion) =>
          institucion.estado === "pendiente"
      ).length;

    const inactivas =
      this.instituciones.filter(
        (institucion) =>
          institucion.estado === "inactiva"
      ).length;


    this.escribirTexto(
      this.elementos.total,
      total
    );

    this.escribirTexto(
      this.elementos.totalActivas,
      activas
    );

    this.escribirTexto(
      this.elementos.totalPendientes,
      pendientes
    );

    this.escribirTexto(
      this.elementos.totalInactivas,
      inactivas
    );

  },


  renderizarInstituciones(
    instituciones
  ) {

    const {
      lista,
      sinResultados
    } = this.elementos;


    if (!lista) {

      return;

    }


    const hayInstituciones =
      this.instituciones.length > 0;

    const hayResultados =
      instituciones.length > 0;


    if (!hayInstituciones) {

      lista.hidden = false;

      lista.innerHTML =
        this.crearEstadoVacio();

      if (sinResultados) {

        sinResultados.hidden = true;

      }

      return;

    }


    if (!hayResultados) {

      lista.hidden = true;

      if (sinResultados) {

        sinResultados.hidden = false;

      }

      return;

    }


    if (sinResultados) {

      sinResultados.hidden = true;

    }


    lista.hidden = false;

    lista.innerHTML =
      instituciones
        .map(
          (institucion) =>
            this.crearTarjetaInstitucion(
              institucion
            )
        )
        .join("");

  },


  crearEstadoVacio() {

    return `
      <div class="admin-panel-vacio">

        <div>

          <span
            class="admin-panel-vacio-icono"
            aria-hidden="true"
          >
            01
          </span>

          <h4>
            No hay instituciones registradas
          </h4>

          <p>
            Registrá la primera institución para comenzar
            a organizar los vínculos de FALCO® Comunidad.
          </p>

          <a
            class="admin-boton admin-boton-primario"
            href="nueva-institucion.html"
          >
            Registrar institución
          </a>

        </div>

      </div>
    `;

  },


  crearTarjetaInstitucion(
    institucion
  ) {

    const nombre =
      this.escaparHTML(
        institucion.nombre ||
        "Institución sin nombre"
      );

    const tipo =
      this.formatearTipo(
        institucion.tipo
      );

    const referente =
      this.escaparHTML(
        institucion.referente ||
        "Sin referente"
      );

    const cargo =
      this.escaparHTML(
        institucion.cargo ||
        ""
      );

    const localidad =
      this.escaparHTML(
        institucion.localidad ||
        "Sin localidad"
      );

    const provincia =
      this.escaparHTML(
        institucion.provincia ||
        ""
      );

    const ubicacion =
      provincia
        ? `${localidad}, ${provincia}`
        : localidad;

    const estado =
      institucion.estado ||
      "pendiente";

    const estadoTexto =
      this.formatearEstado(
        estado
      );

    const inicial =
      nombre
        .charAt(0)
        .toUpperCase();

    const referenteCompleto =
      cargo
        ? `${referente} · ${cargo}`
        : referente;


   const institucionId =
  this.escaparHTML(
    institucion.id || ""
  );


return `
      <article
        class="institucion-item"
        data-institucion-id="${institucionId}"
        tabindex="0"
        role="link"
        aria-label="Abrir ficha de ${nombre}"
      >

        <div class="institucion-identidad">

          <span
            class="institucion-avatar"
            aria-hidden="true"
          >
            ${inicial}
          </span>

          <div class="institucion-identidad-texto">

            <h4>
              ${nombre}
            </h4>

            <p>
              ${tipo}
            </p>

          </div>

        </div>


        <div class="institucion-dato">

          <span class="institucion-dato-etiqueta">
            Referente
          </span>

          <span class="institucion-dato-valor">
            ${referenteCompleto}
          </span>

        </div>


        <div class="institucion-dato">

          <span class="institucion-dato-etiqueta">
            Ubicación
          </span>

          <span class="institucion-dato-valor">
            ${ubicacion}
          </span>

        </div>


        <div class="institucion-acciones">

          <span
            class="
              institucion-estado
              institucion-estado-${estado}
            "
          >
            ${estadoTexto}
          </span>

        </div>

      </article>
    `;

  },


  /* =======================================================
     CARGA
  ======================================================= */

  mostrarCarga(mostrar) {

    const {
      estadoCarga,
      lista,
      sinResultados
    } = this.elementos;


    if (estadoCarga) {

      estadoCarga.hidden = !mostrar;

    }


    if (mostrar) {

      if (lista) {

        lista.hidden = true;

      }

      if (sinResultados) {

        sinResultados.hidden = true;

      }

    }

  },


  /* =======================================================
     RESUMEN
  ======================================================= */

  actualizarResumen(cantidad) {

    const texto =
      cantidad === 1
        ? "1 institución encontrada."
        : `${cantidad} instituciones encontradas.`;


    this.escribirTexto(
      this.elementos.resumen,
      texto
    );

  },


  /* =======================================================
     FORMATO
  ======================================================= */

  formatearTipo(tipo) {

    const tipos = {

      municipalidad:
        "Municipalidad",

      escuela:
        "Escuela",

      hospital:
        "Hospital",

      ong:
        "ONG",

      fundacion:
        "Fundación",

      empresa:
        "Empresa",

      club:
        "Club",

      universidad:
        "Universidad",

      "organismo-publico":
        "Organismo público",

      otro:
        "Otra institución"

    };


    return tipos[tipo] || "Institución";

  },


  formatearEstado(estado) {

    const estados = {

      activa:
        "Activa",

      pendiente:
        "Pendiente",

      inactiva:
        "Inactiva"

    };


    return estados[estado] || "Pendiente";

  },


  escribirTexto(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }


    elemento.textContent =
      String(valor);

  },


  escaparHTML(valor) {

    return String(valor || "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadInstituciones.init();

  }
);


/* =========================================================
   ACCESO GLOBAL PARA PRUEBAS
========================================================= */

window.FalcoComunidadInstituciones =
  FalcoComunidadInstituciones;