"use strict";


/* =========================================================
   FALCO® COMUNIDAD
   MÓDULO PROYECTOS
   Listado administrativo
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_PROYECTOS_CONFIG = {

  claveProyectosLocales:
    "falco_comunidad_proyectos",

  paginaDetalle:
    "proyecto.html",

  paginaNueva:
    "nuevo-proyecto.html",

  proyectoInicial: {

    id:
      "adolescencia-hoy",

    slug:
      "adolescencia-hoy",

    nombre:
      "Adolescencia Hoy",

    institucion:
      "Programa institucional FALCO®",

    institucionNombre:
      "Programa institucional FALCO®",

    responsable:
      "Lic. Isabela Falco",

    area:
      "adolescencia",

    estado:
      "en_ejecucion",

    fechaInicio:
      "2026",

    fechaFinalizacion:
      "",

    descripcion:
      "Programa institucional orientado al abordaje, comprensión y acompañamiento de la adolescencia desde una perspectiva psicológica, familiar y comunitaria.",

    objetivo:
      "Promover recursos de orientación, prevención y acompañamiento para adolescentes, familias e instituciones.",

    destacado:
      true,

    origen:
      "sistema",

    fechaCreacion:
      "2026-07-30T00:00:00.000Z",

    ultimaActualizacion:
      "2026-07-30T00:00:00.000Z"

  }

};


/* =========================================================
   APLICACIÓN
========================================================= */

const FALCOComunidadProyectos = {

  elementos: {},

  proyectos: [],

  proyectosFiltrados: [],


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.obtenerElementos();

    this.cargarProyectos();

    this.incorporarProyectoInicial();

    this.vincularEventos();

    this.aplicarFiltros();

    console.log(
      "FALCO Comunidad Proyectos™ v1.0 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  obtenerElementos() {

    this.elementos = {

      contenedor:
        document.getElementById(
          "contenedorProyectos"
        ),

      estadoCarga:
        document.getElementById(
          "estadoCargaProyectos"
        ),

      estadoError:
        document.getElementById(
          "estadoErrorProyectos"
        ),

      mensajeError:
        document.getElementById(
          "mensajeErrorProyectos"
        ),

      estadoVacio:
        document.getElementById(
          "estadoVacioProyectos"
        ),

      estadoSinResultados:
        document.getElementById(
          "estadoSinResultados"
        ),

      buscar:
        document.getElementById(
          "buscarProyecto"
        ),

      filtroEstado:
        document.getElementById(
          "filtroEstado"
        ),

      filtroArea:
        document.getElementById(
          "filtroArea"
        ),

      limpiarFiltros:
        document.getElementById(
          "limpiarFiltros"
        ),

      reintentar:
        document.getElementById(
          "reintentarCarga"
        ),

      total:
        document.getElementById(
          "totalProyectos"
        ),

      activos:
        document.getElementById(
          "proyectosActivos"
        ),

      planificados:
        document.getElementById(
          "proyectosPlanificados"
        ),

      finalizados:
        document.getElementById(
          "proyectosFinalizados"
        )

    };

  },


  /* =======================================================
     CARGA
  ======================================================= */

  cargarProyectos() {

    const clave =
      FALCO_COMUNIDAD_PROYECTOS_CONFIG
        .claveProyectosLocales;


    const contenido =
      localStorage.getItem(
        clave
      );


    if (!contenido) {

      this.proyectos = [];

      return;

    }


    try {

      const datos =
        JSON.parse(
          contenido
        );


      this.proyectos =
        Array.isArray(datos)
          ? datos
          : [];

    } catch (error) {

      console.error(
        "No fue posible cargar los proyectos:",
        error
      );

      this.proyectos = [];

      this.mostrarError(
        "No fue posible cargar correctamente los proyectos guardados."
      );

    }

  },


  /* =======================================================
     PROYECTO INICIAL
  ======================================================= */

  incorporarProyectoInicial() {

    const proyectoInicial =
      FALCO_COMUNIDAD_PROYECTOS_CONFIG
        .proyectoInicial;


    const existe =
      this.proyectos.some(
        proyecto => {

          const id =
            String(
              proyecto.id || ""
            );

          const slug =
            this.normalizarTexto(
              proyecto.slug || ""
            );

          const nombre =
            this.normalizarTexto(
              proyecto.nombre || ""
            );


          return (
            id === proyectoInicial.id ||
            slug === "adolescencia-hoy" ||
            nombre === "adolescencia hoy"
          );

        }
      );


    if (existe) {

      return;

    }


    this.proyectos.unshift(
      {
        ...proyectoInicial
      }
    );


    this.guardarProyectos();

  },


  guardarProyectos() {

    const clave =
      FALCO_COMUNIDAD_PROYECTOS_CONFIG
        .claveProyectosLocales;


    try {

      localStorage.setItem(
        clave,
        JSON.stringify(
          this.proyectos
        )
      );

    } catch (error) {

      console.error(
        "No fue posible guardar los proyectos:",
        error
      );

    }

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    if (this.elementos.buscar) {

      this.elementos.buscar.addEventListener(
        "input",
        () => {

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.filtroEstado) {

      this.elementos.filtroEstado.addEventListener(
        "change",
        () => {

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.filtroArea) {

      this.elementos.filtroArea.addEventListener(
        "change",
        () => {

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.limpiarFiltros) {

      this.elementos.limpiarFiltros.addEventListener(
        "click",
        () => {

          this.limpiarBusqueda();

        }
      );

    }


    if (this.elementos.reintentar) {

      this.elementos.reintentar.addEventListener(
        "click",
        () => {

          this.cargarProyectos();

          this.incorporarProyectoInicial();

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.contenedor) {

      this.elementos.contenedor.addEventListener(
        "click",
        evento => {

          const enlace =
            evento.target.closest(
              "[data-proyecto-id]"
            );


          if (!enlace) {

            return;

          }


          const proyectoId =
            enlace.dataset.proyectoId;


          this.abrirProyecto(
            proyectoId
          );

        }
      );

    }

  },


  /* =======================================================
     FILTROS
  ======================================================= */

  aplicarFiltros() {

    const busqueda =
      this.normalizarTexto(
        this.elementos.buscar?.value || ""
      );


    const estado =
      String(
        this.elementos.filtroEstado?.value ||
        "todos"
      );


    const area =
      String(
        this.elementos.filtroArea?.value ||
        "todas"
      );


    this.proyectosFiltrados =
      this.proyectos.filter(
        proyecto => {

          const coincideBusqueda =
            this.coincideBusqueda(
              proyecto,
              busqueda
            );


          const coincideEstado =
            estado === "todos" ||
            this.normalizarEstado(
              proyecto.estado
            ) === estado;


          const coincideArea =
            area === "todas" ||
            this.normalizarArea(
              proyecto.area
            ) === area;


          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideArea
          );

        }
      );


    this.ordenarProyectos();

    this.actualizarResumen();

    this.renderizar();

  },


  coincideBusqueda(
    proyecto,
    busqueda
  ) {

    if (!busqueda) {

      return true;

    }


    const textoProyecto =
      this.normalizarTexto(
        [
          proyecto.nombre,
          proyecto.titulo,
          proyecto.institucion,
          proyecto.institucionNombre,
          proyecto.responsable,
          proyecto.area,
          proyecto.estado,
          proyecto.descripcion,
          proyecto.objetivo,
          proyecto.localidad,
          proyecto.observaciones
        ]
          .filter(Boolean)
          .join(" ")
      );


    return textoProyecto.includes(
      busqueda
    );

  },


  limpiarBusqueda() {

    if (this.elementos.buscar) {

      this.elementos.buscar.value =
        "";

    }


    if (this.elementos.filtroEstado) {

      this.elementos.filtroEstado.value =
        "todos";

    }


    if (this.elementos.filtroArea) {

      this.elementos.filtroArea.value =
        "todas";

    }


    this.aplicarFiltros();

  },


  ordenarProyectos() {

    this.proyectosFiltrados.sort(
      (proyectoA, proyectoB) => {

        const destacadoA =
          proyectoA.destacado === true
            ? 1
            : 0;

        const destacadoB =
          proyectoB.destacado === true
            ? 1
            : 0;


        if (
          destacadoA !== destacadoB
        ) {

          return (
            destacadoB -
            destacadoA
          );

        }


        const fechaA =
          this.obtenerFechaCreacion(
            proyectoA
          );

        const fechaB =
          this.obtenerFechaCreacion(
            proyectoB
          );


        if (
          fechaA &&
          fechaB
        ) {

          return (
            fechaB.getTime() -
            fechaA.getTime()
          );

        }


        const nombreA =
          String(
            proyectoA.nombre || ""
          );

        const nombreB =
          String(
            proyectoB.nombre || ""
          );


        return nombreA.localeCompare(
          nombreB,
          "es"
        );

      }
    );

  },


  /* =======================================================
     RESUMEN
  ======================================================= */

  actualizarResumen() {

    const total =
      this.proyectos.length;


    const activos =
      this.proyectos.filter(
        proyecto =>
          this.normalizarEstado(
            proyecto.estado
          ) === "en_ejecucion"
      ).length;


    const planificados =
      this.proyectos.filter(
        proyecto =>
          this.normalizarEstado(
            proyecto.estado
          ) === "planificado"
      ).length;


    const finalizados =
      this.proyectos.filter(
        proyecto =>
          this.normalizarEstado(
            proyecto.estado
          ) === "finalizado"
      ).length;


    this.asignarTexto(
      this.elementos.total,
      total
    );


    this.asignarTexto(
      this.elementos.activos,
      activos
    );


    this.asignarTexto(
      this.elementos.planificados,
      planificados
    );


    this.asignarTexto(
      this.elementos.finalizados,
      finalizados
    );

  },


  /* =======================================================
     RENDERIZADO
  ======================================================= */

  renderizar() {

    this.ocultarCarga();

    this.ocultarError();

    this.ocultarEstadosEspeciales();


    if (!this.elementos.contenedor) {

      return;

    }


    this.elementos.contenedor.innerHTML =
      "";


    const total =
      this.proyectos.length;


    const totalFiltrados =
      this.proyectosFiltrados.length;


    const hayFiltros =
      this.hayFiltrosActivos();


    if (total === 0) {

      this.mostrarEstadoVacio();

      return;

    }


    if (
      hayFiltros &&
      totalFiltrados === 0
    ) {

      this.mostrarSinResultados();

      return;

    }


    this.elementos.contenedor.hidden =
      false;


    this.proyectosFiltrados.forEach(
      (proyecto, indice) => {

        const tarjeta =
          this.crearTarjetaProyecto(
            proyecto,
            indice
          );


        this.elementos.contenedor.insertAdjacentHTML(
          "beforeend",
          tarjeta
        );

      }
    );

  },


  crearTarjetaProyecto(
    proyecto,
    indice
  ) {

    const proyectoId =
      this.escaparHTML(
        proyecto.id || ""
      );


    const numero =
      String(
        indice + 1
      ).padStart(
        2,
        "0"
      );


    const nombre =
      this.escaparHTML(
        proyecto.nombre ||
        proyecto.titulo ||
        "Proyecto sin nombre"
      );


    const institucion =
      this.escaparHTML(
        proyecto.institucionNombre ||
        proyecto.institucion ||
        "Sin institución asociada"
      );


    const descripcion =
      this.escaparHTML(
        this.limitarTexto(
          proyecto.descripcion ||
          proyecto.objetivo ||
          "Sin descripción disponible.",
          190
        )
      );


    const responsable =
      this.escaparHTML(
        proyecto.responsable ||
        "Sin responsable asignado"
      );


    const estado =
      this.normalizarEstado(
        proyecto.estado
      );


    const estadoTexto =
      this.obtenerEtiquetaEstado(
        estado
      );


    const area =
      this.normalizarArea(
        proyecto.area
      );


    const areaTexto =
      this.obtenerEtiquetaArea(
        area
      );


    const fechaInicio =
      this.formatearFecha(
        proyecto.fechaInicio
      );


    const claseDestacado =
      proyecto.destacado === true
        ? " proyecto-card--destacado"
        : "";


    return `
      <article
        class="proyecto-card${claseDestacado}"
      >

        <div class="proyecto-card__cabecera">

          <div class="proyecto-card__superior">

            <span class="proyecto-card__numero">
              ${numero}
            </span>

            <span
              class="
                proyecto-card__estado
                proyecto-card__estado--${this.escaparHTML(estado)}
              "
            >
              ${this.escaparHTML(estadoTexto)}
            </span>

          </div>


          <h3 class="proyecto-card__titulo">
            ${nombre}
          </h3>


          <p class="proyecto-card__institucion">
            ${institucion}
          </p>


          <p class="proyecto-card__descripcion">
            ${descripcion}
          </p>

        </div>


        <div class="proyecto-card__datos">

          <div class="proyecto-card__dato">

            <span class="proyecto-card__dato-etiqueta">
              Responsable
            </span>

            <span class="proyecto-card__dato-valor">
              ${responsable}
            </span>

          </div>


          <div class="proyecto-card__dato">

            <span class="proyecto-card__dato-etiqueta">
              Inicio
            </span>

            <span class="proyecto-card__dato-valor">
              ${this.escaparHTML(fechaInicio)}
            </span>

          </div>

        </div>


        <div class="proyecto-card__pie">

          <span class="proyecto-card__area">
            ${this.escaparHTML(areaTexto)}
          </span>

       <button
  type="button"
  class="proyecto-card__enlace"
  data-proyecto-id="${proyectoId}"
  aria-label="Administrar proyecto ${nombre}"
>
  Administrar
  <span aria-hidden="true">
    →
  </span>
</button>

        </div>

      </article>
    `;

  },


  /* =======================================================
     APERTURA DEL PROYECTO
  ======================================================= */

abrirProyecto(
  proyectoId
) {

  if (!proyectoId) {

    console.warn(
      "No se recibió el ID del proyecto."
    );

    return;

  }


  const rutasEspeciales = {

    "adolescencia-hoy":
      "../../escuela-admin/dashboard/dashboard.html"

  };


  const rutaEspecial =
    rutasEspeciales[proyectoId];


  if (rutaEspecial) {

    window.location.href =
      rutaEspecial;

    return;

  }


  const pagina =
    FALCO_COMUNIDAD_PROYECTOS_CONFIG
      .paginaDetalle;


  window.location.href =
    `${pagina}?id=${encodeURIComponent(proyectoId)}`;

},


  /* =======================================================
     ESTADOS DE INTERFAZ
  ======================================================= */

  mostrarEstadoVacio() {

    this.ocultarCarga();

    this.ocultarError();


    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        false;

    }


    if (this.elementos.estadoSinResultados) {

      this.elementos.estadoSinResultados.hidden =
        true;

    }


    if (this.elementos.contenedor) {

      this.elementos.contenedor.hidden =
        true;

    }

  },


  mostrarSinResultados() {

    this.ocultarCarga();

    this.ocultarError();


    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        true;

    }


    if (this.elementos.estadoSinResultados) {

      this.elementos.estadoSinResultados.hidden =
        false;

    }


    if (this.elementos.contenedor) {

      this.elementos.contenedor.hidden =
        true;

    }

  },


  ocultarEstadosEspeciales() {

    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        true;

    }


    if (this.elementos.estadoSinResultados) {

      this.elementos.estadoSinResultados.hidden =
        true;

    }

  },


  ocultarCarga() {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        true;

    }

  },


  mostrarError(
    mensaje
  ) {

    this.ocultarCarga();


    if (this.elementos.mensajeError) {

      this.elementos.mensajeError.textContent =
        mensaje;

    }


    if (this.elementos.estadoError) {

      this.elementos.estadoError.hidden =
        false;

    }


    if (this.elementos.contenedor) {

      this.elementos.contenedor.hidden =
        true;

    }

  },


  ocultarError() {

    if (this.elementos.estadoError) {

      this.elementos.estadoError.hidden =
        true;

    }

  },


  hayFiltrosActivos() {

    const busqueda =
      String(
        this.elementos.buscar?.value || ""
      ).trim();


    const estado =
      String(
        this.elementos.filtroEstado?.value ||
        "todos"
      );


    const area =
      String(
        this.elementos.filtroArea?.value ||
        "todas"
      );


    return Boolean(
      busqueda ||
      estado !== "todos" ||
      area !== "todas"
    );

  },


  /* =======================================================
     ESTADOS
  ======================================================= */

  normalizarEstado(
    valor
  ) {

    const estado =
      this.normalizarTexto(
        valor || ""
      )
        .replace(
          /\s+/g,
          "_"
        )
        .replace(
          /-/g,
          "_"
        );


    const equivalencias = {

      activo:
        "en_ejecucion",

      en_curso:
        "en_ejecucion",

      ejecucion:
        "en_ejecucion",

      en_ejecucion:
        "en_ejecucion",

      planificacion:
        "planificado",

      planificado:
        "planificado",

      pausado:
        "pausado",

      suspendido:
        "pausado",

      terminado:
        "finalizado",

      completado:
        "finalizado",

      finalizado:
        "finalizado",

      cancelado:
        "cancelado"

    };


    return (
      equivalencias[estado] ||
      estado ||
      "planificado"
    );

  },


  obtenerEtiquetaEstado(
    estado
  ) {

    const etiquetas = {

      planificado:
        "Planificado",

      en_ejecucion:
        "En ejecución",

      pausado:
        "Pausado",

      finalizado:
        "Finalizado",

      cancelado:
        "Cancelado"

    };


    return (
      etiquetas[estado] ||
      "Planificado"
    );

  },


  /* =======================================================
     ÁREAS
  ======================================================= */

  normalizarArea(
    valor
  ) {

    const area =
      this.normalizarTexto(
        valor || ""
      )
        .replace(
          /\s+/g,
          "_"
        )
        .replace(
          /-/g,
          "_"
        );


    const equivalencias = {

      comunidad:
        "comunidad",

      comunitaria:
        "comunidad",

      formacion:
        "formacion",

      capacitacion:
        "formacion",

      familia:
        "familia",

      familiar:
        "familia",

      adolescencia:
        "adolescencia",

      adolescentes:
        "adolescencia",

      prevencion:
        "prevencion",

      institucional:
        "institucional",

      instituciones:
        "institucional",

      otra:
        "otra"

    };


    return (
      equivalencias[area] ||
      area ||
      "otra"
    );

  },


  obtenerEtiquetaArea(
    area
  ) {

    const etiquetas = {

      comunidad:
        "Comunidad",

      formacion:
        "Formación",

      familia:
        "Familia",

      adolescencia:
        "Adolescencia",

      prevencion:
        "Prevención",

      institucional:
        "Institucional",

      otra:
        "Otra área"

    };


    return (
      etiquetas[area] ||
      "Otra área"
    );

  },


  /* =======================================================
     FECHAS
  ======================================================= */

  obtenerFechaCreacion(
    proyecto
  ) {

    const valor =
      proyecto.fechaCreacion ||
      proyecto.ultimaActualizacion ||
      proyecto.fechaInicio ||
      "";


    if (!valor) {

      return null;

    }


    if (valor instanceof Date) {

      return Number.isNaN(
        valor.getTime()
      )
        ? null
        : valor;

    }


    const fecha =
      new Date(
        valor
      );


    return Number.isNaN(
      fecha.getTime()
    )
      ? null
      : fecha;

  },


  formatearFecha(
    valor
  ) {

    if (!valor) {

      return "Sin fecha definida";

    }


    const texto =
      String(
        valor
      ).trim();


    if (
      /^\d{4}$/.test(
        texto
      )
    ) {

      return texto;

    }


    const partes =
      texto.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );


    let fecha = null;


    if (partes) {

      fecha =
        new Date(
          Number(partes[1]),
          Number(partes[2]) - 1,
          Number(partes[3])
        );

    } else {

      fecha =
        new Date(
          texto
        );

    }


    if (
      !fecha ||
      Number.isNaN(
        fecha.getTime()
      )
    ) {

      return texto;

    }


    return fecha.toLocaleDateString(
      "es-AR",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric"
      }
    );

  },


  /* =======================================================
     UTILIDADES
  ======================================================= */

  asignarTexto(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }


    elemento.textContent =
      String(
        valor ?? ""
      );

  },


  normalizarTexto(
    valor
  ) {

    return String(
      valor || ""
    )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim();

  },


  limitarTexto(
    texto,
    limite
  ) {

    const contenido =
      String(
        texto || ""
      ).trim();


    if (
      contenido.length <= limite
    ) {

      return contenido;

    }


    return `${contenido
      .slice(
        0,
        limite
      )
      .trim()}…`;

  },


  escaparHTML(
    valor
  ) {

    return String(
      valor ?? ""
    )
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
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FALCOComunidadProyectos.init();

  }
);


/* =========================================================
   EXPOSICIÓN PARA PRUEBAS
========================================================= */

window.FALCOComunidadProyectos =
  FALCOComunidadProyectos;