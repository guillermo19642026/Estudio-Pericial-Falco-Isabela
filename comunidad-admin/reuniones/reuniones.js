"use strict";


/* =========================================================
   FALCO® COMUNIDAD
   MÓDULO REUNIONES
   Listado administrativo
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_REUNIONES_CONFIG = {

  claveReunionesLocales:
    "falco_comunidad_reuniones",

  paginaDetalle:
    "reunion.html",

  paginaNueva:
    "nueva-reunion.html"

};


/* =========================================================
   APLICACIÓN
========================================================= */

const FALCOComunidadReuniones = {

  elementos: {},

  reuniones: [],

  reunionesFiltradas: [],


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.obtenerElementos();

    this.cargarReuniones();

    this.vincularEventos();

    this.aplicarFiltros();

    console.log(
      "FALCO Comunidad Reuniones™ v1.0 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  obtenerElementos() {

    this.elementos = {

      total:
        document.getElementById(
          "totalReuniones"
        ),

      totalProximas:
        document.getElementById(
          "totalReunionesProximas"
        ),

      totalCompletadas:
        document.getElementById(
          "totalReunionesCompletadas"
        ),

      totalSeguimiento:
        document.getElementById(
          "totalReunionesSeguimiento"
        ),

      busqueda:
        document.getElementById(
          "busquedaReuniones"
        ),

      filtroEstado:
        document.getElementById(
          "filtroEstadoReuniones"
        ),

      filtroModalidad:
        document.getElementById(
          "filtroModalidadReuniones"
        ),

      filtroPeriodo:
        document.getElementById(
          "filtroPeriodoReuniones"
        ),

      botonLimpiar:
        document.getElementById(
          "botonLimpiarFiltrosReuniones"
        ),

      botonRestablecer:
        document.getElementById(
          "botonRestablecerBusquedaReuniones"
        ),

      lista:
        document.getElementById(
          "listaReuniones"
        ),

      textoCantidad:
        document.getElementById(
          "textoCantidadReuniones"
        ),

      estadoVacio:
        document.getElementById(
          "estadoVacioReuniones"
        ),

      sinResultados:
        document.getElementById(
          "sinResultadosReuniones"
        ),

      mensaje:
        document.getElementById(
          "mensajeReuniones"
        )

    };

  },


  /* =======================================================
     CARGA
  ======================================================= */

  cargarReuniones() {

    const clave =
      FALCO_COMUNIDAD_REUNIONES_CONFIG
        .claveReunionesLocales;


    const contenido =
      localStorage.getItem(
        clave
      );


    if (!contenido) {

      this.reuniones = [];

      return;

    }


    try {

      const datos =
        JSON.parse(
          contenido
        );


      this.reuniones =
        Array.isArray(datos)
          ? datos
          : [];

    } catch (error) {

      console.error(
        "No fue posible cargar las reuniones:",
        error
      );

      this.reuniones = [];

      this.mostrarMensaje(
        "No fue posible cargar correctamente las reuniones guardadas.",
        "error"
      );

    }

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    if (this.elementos.busqueda) {

      this.elementos.busqueda.addEventListener(
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


    if (this.elementos.filtroModalidad) {

      this.elementos.filtroModalidad.addEventListener(
        "change",
        () => {

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.filtroPeriodo) {

      this.elementos.filtroPeriodo.addEventListener(
        "change",
        () => {

          this.aplicarFiltros();

        }
      );

    }


    if (this.elementos.botonLimpiar) {

      this.elementos.botonLimpiar.addEventListener(
        "click",
        () => {

          this.limpiarFiltros();

        }
      );

    }


    if (this.elementos.botonRestablecer) {

      this.elementos.botonRestablecer.addEventListener(
        "click",
        () => {

          this.limpiarFiltros();

        }
      );

    }


    if (this.elementos.lista) {

      this.elementos.lista.addEventListener(
        "click",
        evento => {

          const tarjeta =
            evento.target.closest(
              "[data-reunion-id]"
            );


          if (!tarjeta) {

            return;

          }


          const reunionId =
            tarjeta.dataset.reunionId;


          this.abrirReunion(
            reunionId
          );

        }
      );


      this.elementos.lista.addEventListener(
        "keydown",
        evento => {

          if (
            evento.key !== "Enter" &&
            evento.key !== " "
          ) {

            return;

          }


          const tarjeta =
            evento.target.closest(
              "[data-reunion-id]"
            );


          if (!tarjeta) {

            return;

          }


          evento.preventDefault();


          const reunionId =
            tarjeta.dataset.reunionId;


          this.abrirReunion(
            reunionId
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
        this.elementos.busqueda?.value || ""
      );


    const estado =
      String(
        this.elementos.filtroEstado?.value || ""
      );


    const modalidad =
      String(
        this.elementos.filtroModalidad?.value || ""
      );


    const periodo =
      String(
        this.elementos.filtroPeriodo?.value || ""
      );


    this.reunionesFiltradas =
      this.reuniones.filter(
        reunion => {

          const coincideBusqueda =
            this.coincideBusqueda(
              reunion,
              busqueda
            );


          const coincideEstado =
            !estado ||
            String(reunion.estado || "") ===
              estado;


          const coincideModalidad =
            !modalidad ||
            String(reunion.modalidad || "") ===
              modalidad;


          const coincidePeriodo =
            this.coincidePeriodo(
              reunion,
              periodo
            );


          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideModalidad &&
            coincidePeriodo
          );

        }
      );


    this.ordenarReuniones();

    this.actualizarResumen();

    this.renderizar();

  },


  coincideBusqueda(
    reunion,
    busqueda
  ) {

    if (!busqueda) {

      return true;

    }


    const textoReunion =
      this.normalizarTexto(
        [
          reunion.institucionNombre,
          reunion.institucion,
          reunion.asunto,
          reunion.titulo,
          reunion.referente,
          reunion.responsable,
          reunion.ubicacion,
          reunion.localidad,
          reunion.modalidad,
          reunion.observaciones
        ]
          .filter(Boolean)
          .join(" ")
      );


    return textoReunion.includes(
      busqueda
    );

  },


  coincidePeriodo(
    reunion,
    periodo
  ) {

    if (!periodo) {

      return true;

    }


    const fechaReunion =
      this.obtenerFechaReunion(
        reunion
      );


    if (!fechaReunion) {

      return false;

    }


    const hoy =
      new Date();


    hoy.setHours(
      0,
      0,
      0,
      0
    );


    const fechaComparacion =
      new Date(
        fechaReunion
      );


    fechaComparacion.setHours(
      0,
      0,
      0,
      0
    );


    if (periodo === "hoy") {

      return (
        fechaComparacion.getTime() ===
        hoy.getTime()
      );

    }


    if (periodo === "proximas") {

      return (
        fechaComparacion.getTime() >=
        hoy.getTime()
      );

    }


    if (periodo === "pasadas") {

      return (
        fechaComparacion.getTime() <
        hoy.getTime()
      );

    }


    return true;

  },


  limpiarFiltros() {

    if (this.elementos.busqueda) {

      this.elementos.busqueda.value =
        "";

    }


    if (this.elementos.filtroEstado) {

      this.elementos.filtroEstado.value =
        "";

    }


    if (this.elementos.filtroModalidad) {

      this.elementos.filtroModalidad.value =
        "";

    }


    if (this.elementos.filtroPeriodo) {

      this.elementos.filtroPeriodo.value =
        "";

    }


    this.aplicarFiltros();

  },


  ordenarReuniones() {

    this.reunionesFiltradas.sort(
      (reunionA, reunionB) => {

        const fechaA =
          this.obtenerFechaReunion(
            reunionA
          );


        const fechaB =
          this.obtenerFechaReunion(
            reunionB
          );


        if (!fechaA && !fechaB) {

          return 0;

        }


        if (!fechaA) {

          return 1;

        }


        if (!fechaB) {

          return -1;

        }


        return (
          fechaA.getTime() -
          fechaB.getTime()
        );

      }
    );

  },
  /* =======================================================
     RESUMEN
  ======================================================= */

  actualizarResumen() {

    const total =
      this.reuniones.length;


    const hoy =
      new Date();


    hoy.setHours(
      0,
      0,
      0,
      0
    );


    const totalProximas =
      this.reuniones.filter(
        reunion => {

          const fecha =
            this.obtenerFechaReunion(
              reunion
            );


          if (!fecha) {

            return false;

          }


          const fechaComparacion =
            new Date(
              fecha
            );


          fechaComparacion.setHours(
            0,
            0,
            0,
            0
          );


          return (
            fechaComparacion.getTime() >=
              hoy.getTime() &&
            String(reunion.estado || "") !==
              "cancelada" &&
            String(reunion.estado || "") !==
              "completada"
          );

        }
      ).length;


    const totalCompletadas =
      this.reuniones.filter(
        reunion =>
          String(reunion.estado || "") ===
          "completada"
      ).length;


    const totalSeguimiento =
      this.reuniones.filter(
        reunion =>
          Boolean(
            reunion.requiereSeguimiento
          ) ||
          String(
            reunion.seguimientoEstado || ""
          ) === "pendiente"
      ).length;


    if (this.elementos.total) {

      this.elementos.total.textContent =
        String(total);

    }


    if (this.elementos.totalProximas) {

      this.elementos.totalProximas.textContent =
        String(totalProximas);

    }


    if (this.elementos.totalCompletadas) {

      this.elementos.totalCompletadas.textContent =
        String(totalCompletadas);

    }


    if (this.elementos.totalSeguimiento) {

      this.elementos.totalSeguimiento.textContent =
        String(totalSeguimiento);

    }

  },


  /* =======================================================
     RENDERIZADO
  ======================================================= */

  renderizar() {

    const total =
      this.reuniones.length;


    const totalFiltradas =
      this.reunionesFiltradas.length;


    const hayFiltros =
      this.hayFiltrosActivos();


    if (this.elementos.lista) {

      this.elementos.lista.innerHTML =
        "";

    }


    if (total === 0) {

      this.mostrarEstadoVacio();

      this.actualizarTextoCantidad(
        0,
        false
      );

      return;

    }


    if (
      hayFiltros &&
      totalFiltradas === 0
    ) {

      this.mostrarSinResultados();

      this.actualizarTextoCantidad(
        0,
        true
      );

      return;

    }


    this.ocultarEstadosEspeciales();


    if (this.elementos.lista) {

      this.reunionesFiltradas.forEach(
        reunion => {

          const tarjeta =
            this.crearTarjetaReunion(
              reunion
            );


          this.elementos.lista.insertAdjacentHTML(
            "beforeend",
            tarjeta
          );

        }
      );

    }


    this.actualizarTextoCantidad(
      totalFiltradas,
      hayFiltros
    );

  },


  crearTarjetaReunion(
    reunion
  ) {

    const reunionId =
      this.escaparHTML(
        reunion.id || ""
      );


    const asunto =
      this.escaparHTML(
        reunion.asunto ||
        reunion.titulo ||
        "Reunión institucional"
      );


    const institucion =
      this.escaparHTML(
        reunion.institucionNombre ||
        reunion.institucion ||
        "Institución sin especificar"
      );


    const referente =
      this.escaparHTML(
        reunion.referente ||
        "Sin referente informado"
      );


    const modalidad =
      this.obtenerEtiquetaModalidad(
        reunion.modalidad
      );


    const ubicacion =
      this.escaparHTML(
        reunion.ubicacion ||
        reunion.enlace ||
        reunion.localidad ||
        "Sin ubicación informada"
      );


    const horario =
      this.escaparHTML(
        reunion.hora ||
        reunion.horario ||
        "Sin horario"
      );


    const estado =
      String(
        reunion.estado ||
        "programada"
      );


    const estadoTexto =
      this.obtenerEtiquetaEstado(
        estado
      );


    const fecha =
      this.obtenerFechaReunion(
        reunion
      );


    const datosFecha =
      this.obtenerDatosFecha(
        fecha
      );


    const seguimiento =
      this.obtenerSeguimiento(
        reunion
      );


    const etiquetas =
      this.crearEtiquetas(
        reunion
      );


    return `
      <article
        class="reunion-item"
        data-reunion-id="${reunionId}"
        tabindex="0"
        role="link"
        aria-label="Abrir reunión ${asunto}"
      >

        <div class="reunion-item-cabecera">

          <div class="reunion-item-identidad">

            <div class="reunion-item-fecha">

              <strong>
                ${datosFecha.dia}
              </strong>

              <span>
                ${datosFecha.mes}
              </span>

            </div>


            <div class="reunion-item-titulos">

              <h4>
                ${asunto}
              </h4>

              <p>
                ${institucion}
              </p>

            </div>

          </div>


          <span
            class="reunion-item-estado estado-${this.escaparHTML(estado)}"
          >
            ${estadoTexto}
          </span>

        </div>


        <div class="reunion-item-cuerpo">

          <div class="reunion-item-dato">

            <span>
              Horario
            </span>

            <strong>
              ${horario}
            </strong>

          </div>


          <div class="reunion-item-dato">

            <span>
              Modalidad
            </span>

            <strong>
              ${modalidad}
            </strong>

          </div>


          <div class="reunion-item-dato">

            <span>
              Referente
            </span>

            <p>
              ${referente}
            </p>

          </div>


          <div class="reunion-item-dato">

            <span>
              Ubicación o acceso
            </span>

            <p>
              ${ubicacion}
            </p>

          </div>


          ${etiquetas}

        </div>


        <div class="reunion-item-pie">

          <span
            class="reunion-item-seguimiento ${seguimiento.clase}"
          >
            ${seguimiento.texto}
          </span>

          <span class="reunion-item-enlace">
            Ver reunión
          </span>

        </div>

      </article>
    `;

  },


  crearEtiquetas(
    reunion
  ) {

    const etiquetas = [];


    if (reunion.tipo) {

      etiquetas.push(
        this.obtenerEtiquetaTipo(
          reunion.tipo
        )
      );

    }


    if (reunion.responsable) {

      etiquetas.push(
        `Responsable: ${reunion.responsable}`
      );

    }


    if (reunion.proyectoNombre) {

      etiquetas.push(
        reunion.proyectoNombre
      );

    }


    if (etiquetas.length === 0) {

      return "";

    }


    const contenido =
      etiquetas
        .map(
          etiqueta => `
            <span class="reunion-item-etiqueta">
              ${this.escaparHTML(etiqueta)}
            </span>
          `
        )
        .join("");


    return `
      <div class="reunion-item-dato es-completo">

        <span>
          Referencias
        </span>

        <div class="reunion-item-etiquetas">
          ${contenido}
        </div>

      </div>
    `;

  },


  /* =======================================================
     ESTADOS DE LA INTERFAZ
  ======================================================= */

  mostrarEstadoVacio() {

    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        false;

    }


    if (this.elementos.sinResultados) {

      this.elementos.sinResultados.hidden =
        true;

    }


    if (this.elementos.lista) {

      this.elementos.lista.hidden =
        true;

    }

  },


  mostrarSinResultados() {

    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        true;

    }


    if (this.elementos.sinResultados) {

      this.elementos.sinResultados.hidden =
        false;

    }


    if (this.elementos.lista) {

      this.elementos.lista.hidden =
        true;

    }

  },


  ocultarEstadosEspeciales() {

    if (this.elementos.estadoVacio) {

      this.elementos.estadoVacio.hidden =
        true;

    }


    if (this.elementos.sinResultados) {

      this.elementos.sinResultados.hidden =
        true;

    }


    if (this.elementos.lista) {

      this.elementos.lista.hidden =
        false;

    }

  },


  actualizarTextoCantidad(
    cantidad,
    hayFiltros
  ) {

    if (!this.elementos.textoCantidad) {

      return;

    }


    if (this.reuniones.length === 0) {

      this.elementos.textoCantidad.textContent =
        "No hay reuniones registradas.";

      return;

    }


    if (cantidad === 0) {

      this.elementos.textoCantidad.textContent =
        hayFiltros
          ? "No hay reuniones que coincidan con los filtros."
          : "No hay reuniones disponibles.";

      return;

    }


    if (cantidad === 1) {

      this.elementos.textoCantidad.textContent =
        hayFiltros
          ? "Se encontró 1 reunión."
          : "Hay 1 reunión registrada.";

      return;

    }


    this.elementos.textoCantidad.textContent =
      hayFiltros
        ? `Se encontraron ${cantidad} reuniones.`
        : `Hay ${cantidad} reuniones registradas.`;

  },


  hayFiltrosActivos() {

    return Boolean(

      this.elementos.busqueda?.value ||

      this.elementos.filtroEstado?.value ||

      this.elementos.filtroModalidad?.value ||

      this.elementos.filtroPeriodo?.value

    );

  },

    /* =======================================================
     APERTURA DE FICHA
  ======================================================= */

  abrirReunion(
    reunionId
  ) {

    if (!reunionId) {

      return;

    }


    const pagina =
      FALCO_COMUNIDAD_REUNIONES_CONFIG
        .paginaDetalle;


    window.location.href =
      `${pagina}?id=${encodeURIComponent(reunionId)}`;

  },


  /* =======================================================
     FECHAS
  ======================================================= */

  obtenerFechaReunion(
    reunion
  ) {

    const valor =
      reunion.fecha ||
      reunion.fechaReunion ||
      reunion.inicio ||
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


    if (
      typeof valor === "object" &&
      typeof valor.toDate === "function"
    ) {

      const fecha =
        valor.toDate();


      return Number.isNaN(
        fecha.getTime()
      )
        ? null
        : fecha;

    }


    const texto =
      String(valor).trim();


    if (!texto) {

      return null;

    }


    const partesFecha =
      texto.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );


    if (partesFecha) {

      const fechaLocal =
        new Date(
          Number(partesFecha[1]),
          Number(partesFecha[2]) - 1,
          Number(partesFecha[3])
        );


      return Number.isNaN(
        fechaLocal.getTime()
      )
        ? null
        : fechaLocal;

    }


    const fecha =
      new Date(
        texto
      );


    return Number.isNaN(
      fecha.getTime()
    )
      ? null
      : fecha;

  },


  obtenerDatosFecha(
    fecha
  ) {

    if (!fecha) {

      return {

        dia:
          "--",

        mes:
          "Sin fecha"

      };

    }


    const dia =
      String(
        fecha.getDate()
      )
        .padStart(
          2,
          "0"
        );


    const mes =
      fecha
        .toLocaleDateString(
          "es-AR",
          {
            month:
              "short"
          }
        )
        .replace(
          ".",
          ""
        )
        .toUpperCase();


    return {

      dia,

      mes

    };

  },


  /* =======================================================
     ETIQUETAS
  ======================================================= */

  obtenerEtiquetaEstado(
    estado
  ) {

    const etiquetas = {

      programada:
        "Programada",

      confirmada:
        "Confirmada",

      completada:
        "Completada",

      cancelada:
        "Cancelada",

      reprogramada:
        "Reprogramada"

    };


    return (
      etiquetas[estado] ||
      this.capitalizarTexto(
        estado
      ) ||
      "Programada"
    );

  },


  obtenerEtiquetaModalidad(
    modalidad
  ) {

    const etiquetas = {

      virtual:
        "Virtual",

      presencial:
        "Presencial",

      telefonica:
        "Telefónica",

      mixta:
        "Mixta"

    };


    return this.escaparHTML(

      etiquetas[modalidad] ||

      this.capitalizarTexto(
        modalidad
      ) ||

      "Sin modalidad"

    );

  },


  obtenerEtiquetaTipo(
    tipo
  ) {

    const etiquetas = {

      inicial:
        "Reunión inicial",

      seguimiento:
        "Seguimiento",

      presentacion:
        "Presentación institucional",

      propuesta:
        "Presentación de propuesta",

      coordinacion:
        "Coordinación",

      cierre:
        "Cierre",

      otro:
        "Otro tipo"

    };


    return (

      etiquetas[tipo] ||

      this.capitalizarTexto(
        tipo
      ) ||

      "Reunión institucional"

    );

  },


  obtenerSeguimiento(
    reunion
  ) {

    const estado =
      String(
        reunion.seguimientoEstado || ""
      );


    if (
      estado === "completo" ||
      estado === "completado"
    ) {

      return {

        clase:
          "es-completo",

        texto:
          "Seguimiento completado"

      };

    }


    if (
      reunion.requiereSeguimiento ||
      estado === "pendiente"
    ) {

      return {

        clase:
          "es-pendiente",

        texto:
          "Requiere seguimiento"

      };

    }


    return {

      clase:
        "",

      texto:
        "Sin seguimiento pendiente"

    };

  },


  /* =======================================================
     MENSAJES
  ======================================================= */

  mostrarMensaje(
    texto,
    tipo = ""
  ) {

    if (!this.elementos.mensaje) {

      return;

    }


    this.elementos.mensaje.textContent =
      texto;


    this.elementos.mensaje.classList.remove(
      "es-exito",
      "es-error"
    );


    if (tipo === "exito") {

      this.elementos.mensaje.classList.add(
        "es-exito"
      );

    }


    if (tipo === "error") {

      this.elementos.mensaje.classList.add(
        "es-error"
      );

    }


    this.elementos.mensaje.hidden =
      false;

  },


  ocultarMensaje() {

    if (!this.elementos.mensaje) {

      return;

    }


    this.elementos.mensaje.hidden =
      true;


    this.elementos.mensaje.textContent =
      "";


    this.elementos.mensaje.classList.remove(
      "es-exito",
      "es-error"
    );

  },


  /* =======================================================
     UTILIDADES
  ======================================================= */

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


  capitalizarTexto(
    valor
  ) {

    const texto =
      String(
        valor || ""
      )
        .replace(
          /[-_]+/g,
          " "
        )
        .trim();


    if (!texto) {

      return "";

    }


    return (
      texto.charAt(0).toUpperCase() +
      texto.slice(1)
    );

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

    FALCOComunidadReuniones.init();

  }
);
