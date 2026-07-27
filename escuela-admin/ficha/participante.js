/* =========================================================
   SISTEMA FALCO®
   ESCUELA PARA PADRES
   FICHA ADMINISTRATIVA DEL PARTICIPANTE

   Archivo:
   escuela-admin/ficha/participante.js

   Versión:
   FALCO Participante Admin™ v1.0

   ETAPA ACTUAL:
   - Estado interno
   - Carga demostrativa
   - Renderizado completo
   - Administración local
   - Preparación para Firebase
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

import {
  obtenerPorId,
  actualizar,
  eliminar
} from "../shared/firebase/participantes.js";



const CONFIG = {

  totalEncuentros: 8,

  listadoUrl:
    "../participantes/participantes.html",

  altaUrl:
    "../alta/alta-participante.html",

 

  estadosPermitidos: [
    "activo",
    "pendiente",
    "inactivo",
    "finalizado"
  ]

};


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

const state = {

  ready: false,

  cargando: false,

  guardando: false,

  participanteId: null,

  participante: null,

  datosOriginales: null,

  cambiosSinGuardar: false

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const dom = {

  estado:
    document.querySelector(
      "#estadoParticipante"
    ),

  progreso:
    document.querySelector(
      "#progresoParticipante"
    ),

  encuentroActual:
    document.querySelector(
      "#encuentroActual"
    ),

  certificadosEmitidos:
    document.querySelector(
      "#certificadosEmitidos"
    ),

  datos:
    document.querySelector(
      "#participanteDatos"
    ),

  historial:
    document.querySelector(
      "#participanteHistorial"
    ),

  encuentros:
    document.querySelector(
      "#participanteEncuentros"
    ),

  videos:
    document.querySelector(
      "#participanteVideos"
    ),

  material:
    document.querySelector(
      "#participanteMaterial"
    ),

  encuestas:
    document.querySelector(
      "#participanteEncuestas"
    ),

  certificados:
    document.querySelector(
      "#participanteCertificados"
    ),


  estadoGuardado:
    document.querySelector(
      "#estadoGuardado"
    ),

  estadoGuardadoTexto:
    document.querySelector(
      "#estadoGuardadoTexto"
    ),

  participanteAvatar:
    document.querySelector(
      "#participanteAvatar"
    ),

  participanteNombreCabecera:
    document.querySelector(
      "#participanteNombreCabecera"
    ),

  participanteEstadoCabecera:
    document.querySelector(
      "#participanteEstadoCabecera"
    ),

  participanteDescripcionCabecera:
    document.querySelector(
      "#participanteDescripcionCabecera"
    ),

  participanteDniCabecera:
    document.querySelector(
      "#participanteDniCabecera"
    ),

  participanteCorreoCabecera:
    document.querySelector(
      "#participanteCorreoCabecera"
    ),

  participanteAltaCabecera:
    document.querySelector(
      "#participanteAltaCabecera"
    ),

  participanteProgresoCabecera:
    document.querySelector(
      "#participanteProgresoCabecera"
    ),

  participanteEncuentrosCabecera:
    document.querySelector(
      "#participanteEncuentrosCabecera"
    ),

  participanteBarraProgreso:
    document.querySelector(
      "#participanteBarraProgreso"
    ),

  participanteBarraProgresoValor:
    document.querySelector(
      "#participanteBarraProgresoValor"
    ),

  btnGuardarSuperior:
    document.querySelector(
      "#btnGuardarSuperior"
    ),

  btnAccesoRapido:
    document.querySelector(
      "#btnAccesoRapido"
    ),

  btnAlternarAcceso:
    document.querySelector(
      "#btnAlternarAcceso"
    ),

  btnRegistrarActividad:
    document.querySelector(
      "#btnRegistrarActividad"
    ),




  btnGuardar:
    document.querySelector(
      "#btnGuardar"
    ),

  btnEliminar:
    document.querySelector(
      "#btnEliminar"
    ),

  btnEditar:
    document.querySelector(
      ".participante-acciones-superiores .admin-boton-principal"
    )

};



/* =========================================================
   INICIALIZACIÓN
========================================================= */


function init() {

  if (state.ready) {
    return;
  }

  state.ready = true;

  state.participanteId =
    obtenerParticipanteId();

  registrarEventos();

  cargarParticipante();

  console.log(
    "FALCO Participante Admin™ v1.0 Ready"
  );

}


/* =========================================================
   OBTENER ID DESDE LA URL
========================================================= */

function obtenerParticipanteId() {

  const parametros =
    new URLSearchParams(
      window.location.search
    );

  return (
    parametros.get("id") ||
    parametros.get("uid") ||
    null
  );

}


/* =========================================================
   CARGAR PARTICIPANTE
========================================================= */

async function cargarParticipante() {

  if (state.cargando) {
    return;
  }

  state.cargando = true;

  mostrarCargaGeneral();

  try {

    if (!state.participanteId) {

      throw new Error(
        "No se recibió el ID del participante."
      );

    }

    const participante =
      await obtenerPorId(
        state.participanteId
      );

    if (!participante) {

      throw new Error(
        "El participante no existe."
      );

    }

    normalizarParticipante(
      participante
    );

    state.participante =
      participante;

    state.datosOriginales =
      clonarObjeto(
        participante
      );

    state.cambiosSinGuardar =
      false;

    renderizarFicha();

    actualizarEstadoGuardado();

  } catch (error) {

    console.error(
      "Error al cargar participante:",
      error
    );

    mostrarErrorGeneral(
      error.message ||
      "No fue posible cargar la ficha del participante."
    );

  } finally {

    state.cargando = false;

  }

}


/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizarParticipante(
  participante
) {

  participante.nombreCompleto =
    participante.nombreCompleto ||
    [
      participante.nombre,
      participante.apellido
    ]
      .filter(Boolean)
      .join(" ");

  participante.estado =
    participante.estado ||
    "pendiente";

  participante.fechaAlta =
    participante.fechaAlta ||
    convertirTimestampAFecha(
      participante.creado
    );

  participante.tipoParticipante =
    participante.tipoParticipante ||
    "";

  participante.modalidad =
    participante.modalidad ||
    "";

  participante.usuarioAcceso =
    participante.usuarioAcceso ||
    participante.correo ||
    "";

  participante.accesoHabilitado =
    typeof participante.accesoHabilitado === "boolean"
      ? participante.accesoHabilitado
      : false;

  participante.recorridoPreparado =
    typeof participante.recorridoPreparado === "boolean"
      ? participante.recorridoPreparado
      : false;

  participante.observaciones =
    participante.observaciones ||
    "";

  participante.encuentros =
    normalizarEncuentros(
      participante.encuentros
    );

  participante.videos =
    Array.isArray(
      participante.videos
    )
      ? participante.videos
      : [];

  participante.materiales =
    Array.isArray(
      participante.materiales
    )
      ? participante.materiales
      : [];

  participante.encuestas =
    Array.isArray(
      participante.encuestas
    )
      ? participante.encuestas
      : [];

  participante.certificados =
    normalizarCertificados(
      participante
    );

  participante.historial =
    Array.isArray(
      participante.historial
    )
      ? participante.historial
      : [];

}


function normalizarEncuentros(
  encuentros
) {

  const titulos = [
    "Comprender la adolescencia",
    "Cambios emocionales y conductuales",
    "Comunicación familiar",
    "Límites y acompañamiento",
    "Conflictos familiares",
    "Autonomía y responsabilidad",
    "Prevención y factores de riesgo",
    "Integración y cierre"
  ];

  if (Array.isArray(encuentros)) {
    return encuentros;
  }

  return Array.from(
    {
      length: CONFIG.totalEncuentros
    },
    (_, indice) => {

      const numero =
        indice + 1;

      const datos =
        encuentros?.[numero] ||
        encuentros?.[String(numero)] ||
        {};

      return {

        numero,

        titulo:
          titulos[indice],

        habilitado:
          Boolean(
            datos.habilitado ??
            numero === 1
          ),

        completado:
          Boolean(
            datos.completado
          ),

        fechaCompletado:
          datos.fechaCompletado ||
          datos.fecha ||
          null

      };

    }
  );

}


function normalizarCertificados(
  participante
) {

  if (
    Array.isArray(
      participante.certificados
    )
  ) {
    return participante.certificados;
  }

  if (
    participante.certificado?.emitido
  ) {

    return [
      {
        id:
          "certificado-principal",

        titulo:
          "Certificado de participación",

        codigo:
          participante.certificado.codigo ||
          "FALCO-ESC",

        fechaEmision:
          participante.certificado.fecha ||
          null,

        url:
          participante.certificado.url ||
          null,

        estado:
          "emitido"
      }
    ];

  }

  return [];

}


function convertirTimestampAFecha(
  timestamp
) {

  if (!timestamp) {
    return null;
  }

  let fecha = null;

  if (
    typeof timestamp.toDate === "function"
  ) {

    fecha =
      timestamp.toDate();

  } else if (
    typeof timestamp.seconds === "number"
  ) {

    fecha =
      new Date(
        timestamp.seconds * 1000
      );

  } else {

    fecha =
      new Date(timestamp);

  }

  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {
    return null;
  }

  const anio =
    fecha.getFullYear();

  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      fecha.getDate()
    ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;

}





/* =========================================================
   RENDERIZADO GENERAL
========================================================= */

function renderizarFicha() {

  renderizarCabeceraPremium();

  renderizarResumen();

  renderizarDatos();

  renderizarHistorial();

  renderizarEncuentros();

  renderizarVideos();

  renderizarMaterial();

  renderizarEncuestas();

  renderizarCertificados();

  configurarEnlaceEdicion();

}


/* =========================================================
   CABECERA PREMIUM
========================================================= */

function renderizarCabeceraPremium() {

  if (!state.participante) {
    return;
  }

  const participante =
    state.participante;

  const completados =
    participante.encuentros.filter(
      encuentro =>
        encuentro.completado
    ).length;

  const progreso =
    calcularProgreso(
      completados
    );

  const iniciales =
    obtenerIniciales(
      participante.nombreCompleto
    );

  escribirTexto(
    dom.participanteAvatar,
    iniciales
  );

  escribirTexto(
    dom.participanteNombreCabecera,
    participante.nombreCompleto
  );

  escribirTexto(
    dom.participanteEstadoCabecera,
    capitalizar(
      participante.estado
    )
  );

  escribirTexto(
    dom.participanteDescripcionCabecera,
    crearDescripcionParticipante(
      participante
    )
  );

  escribirTexto(
    dom.participanteDniCabecera,
    participante.dni ||
    "Sin informar"
  );

  escribirTexto(
    dom.participanteCorreoCabecera,
    participante.correo ||
    "Sin informar"
  );

  escribirTexto(
    dom.participanteAltaCabecera,
    formatearFecha(
      participante.fechaAlta
    )
  );

  escribirTexto(
    dom.participanteProgresoCabecera,
    `${progreso}%`
  );

  escribirTexto(
    dom.participanteEncuentrosCabecera,
    `${completados} de ${CONFIG.totalEncuentros} encuentros completados`
  );

  if (
    dom.participanteBarraProgreso
  ) {

    dom.participanteBarraProgreso
      .setAttribute(
        "aria-valuenow",
        String(progreso)
      );

  }

  if (
    dom.participanteBarraProgresoValor
  ) {

    dom.participanteBarraProgresoValor
      .style.width =
        `${progreso}%`;

  }

  configurarBadgeEstado(
    participante.estado
  );

  actualizarBotonesAcceso();

}


function obtenerIniciales(
  nombreCompleto
) {

  const partes =
    String(nombreCompleto || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (!partes.length) {
    return "PF";
  }

  if (partes.length === 1) {

    return partes[0]
      .slice(0, 2)
      .toUpperCase();

  }

  return (
    partes[0].charAt(0) +
    partes[partes.length - 1].charAt(0)
  ).toUpperCase();

}


function crearDescripcionParticipante(
  participante
) {

  const partes = [];

  if (
    participante.tipoParticipante
  ) {

    partes.push(
      capitalizar(
        participante.tipoParticipante
      )
    );

  }

  if (
    participante.modalidad
  ) {

    partes.push(
      capitalizar(
        participante.modalidad
      )
    );

  }

  partes.push(
    participante.accesoHabilitado
      ? "Acceso habilitado"
      : "Acceso deshabilitado"
  );

  return partes.join(" · ");

}


function configurarBadgeEstado(
  estado
) {

  if (
    !dom.participanteEstadoCabecera
  ) {
    return;
  }

  dom.participanteEstadoCabecera
    .className =
      "participante-badge";

  const estadoNormalizado =
    normalizarClase(
      estado
    );

  dom.participanteEstadoCabecera
    .classList.add(
      `participante-badge-${estadoNormalizado}`
    );

}


function actualizarBotonesAcceso() {

  if (!state.participante) {
    return;
  }

  const habilitado =
    state.participante
      .accesoHabilitado;

  if (dom.btnAlternarAcceso) {

    dom.btnAlternarAcceso
      .textContent =
        habilitado
          ? "Deshabilitar acceso"
          : "Habilitar acceso";

  }

  if (dom.btnAccesoRapido) {

    dom.btnAccesoRapido
      .textContent =
        habilitado
          ? "Administrar acceso"
          : "Habilitar acceso";

  }

}




/* =========================================================
   RESUMEN
========================================================= */

function renderizarResumen() {

  const participante =
    state.participante;

  const completados =
    participante.encuentros
      .filter(
        encuentro =>
          encuentro.completado
      )
      .length;

  const progreso =
    calcularProgreso(
      completados
    );

  const encuentroActual =
    calcularEncuentroActual();

  escribirTexto(
    dom.estado,
    capitalizar(
      participante.estado
    )
  );

  escribirTexto(
    dom.progreso,
    `${progreso}%`
  );

  escribirTexto(
    dom.encuentroActual,
    String(encuentroActual)
  );

  escribirTexto(
    dom.certificadosEmitidos,
    String(
      participante.certificados.length
    )
  );

}


/* =========================================================
   DATOS GENERALES
========================================================= */

function renderizarDatos() {

  if (!dom.datos) {
    return;
  }

  const participante =
    state.participante;

  const accesoTexto =
    participante.accesoHabilitado
      ? "Habilitado"
      : "Deshabilitado";

  const recorridoTexto =
    participante.recorridoPreparado
      ? "Preparado"
      : "Pendiente";

  dom.datos.innerHTML = `

    <div class="participante-datos-premium">

      <!-- ==================================================
           DATOS PERSONALES
      =================================================== -->

      <section class="participante-bloque-premium">

        <div class="participante-bloque-cabecera">

          <div>

            <span class="participante-bloque-etiqueta">
              Información personal
            </span>

            <h3>
              Datos del participante
            </h3>

          </div>

          <button
            id="btnEditarInformacion"
            class="participante-editar-informacion"
            type="button"
          >
            Editar información
          </button>

        </div>

        <div class="participante-datos-grid">

          ${crearDato(
            "Nombre completo",
            participante.nombreCompleto
          )}

          ${crearDato(
            "DNI",
            participante.dni
          )}

          ${crearDato(
            "Correo electrónico",
            participante.correo
          )}

          ${crearDato(
            "Teléfono",
            participante.telefono
          )}

          ${crearDato(
            "Fecha de nacimiento",
            formatearFecha(
              participante.fechaNacimiento
            )
          )}

          ${crearDato(
            "Fecha de alta",
            formatearFecha(
              participante.fechaAlta
            )
          )}

          ${crearDato(
            "Tipo de participante",
            capitalizar(
              participante.tipoParticipante
            )
          )}

          ${crearDato(
            "Modalidad",
            capitalizar(
              participante.modalidad
            )
          )}

          ${crearDato(
            "Usuario de acceso",
            participante.usuarioAcceso
          )}

        </div>

      </section>


      <!-- ==================================================
           ESTADO DEL PARTICIPANTE
      =================================================== -->

      <section class="participante-bloque-premium">

        <div class="participante-bloque-cabecera">

          <div>

            <span class="participante-bloque-etiqueta">
              Administración
            </span>

            <h3>
              Estado del participante
            </h3>

          </div>

        </div>

        <div class="participante-estados-grid">

          <article class="participante-estado-card">

            <div class="participante-estado-icono">
              ●
            </div>

            <div>

              <span>
                Estado administrativo
              </span>

              <strong>
                ${capitalizar(
                  participante.estado
                )}
              </strong>

            </div>

          </article>


          <article class="participante-estado-card">

            <div class="participante-estado-icono">
              ↗
            </div>

            <div>

              <span>
                Acceso a la plataforma
              </span>

              <strong
                class="${
                  participante.accesoHabilitado
                    ? "participante-valor-activo"
                    : "participante-valor-inactivo"
                }"
              >
                ${accesoTexto}
              </strong>

            </div>

          </article>


          <article class="participante-estado-card">

            <div class="participante-estado-icono">
              ✓
            </div>

            <div>

              <span>
                Recorrido formativo
              </span>

              <strong
                class="${
                  participante.recorridoPreparado
                    ? "participante-valor-activo"
                    : "participante-valor-pendiente"
                }"
              >
                ${recorridoTexto}
              </strong>

            </div>

          </article>

        </div>

      </section>


      <!-- ==================================================
           OBSERVACIONES
      =================================================== -->

      <section class="participante-bloque-premium">

        <div class="participante-bloque-cabecera">

          <div>

            <span class="participante-bloque-etiqueta">
              Seguimiento
            </span>

            <h3>
              Observaciones administrativas
            </h3>

          </div>

        </div>

        <div class="participante-observacion-premium">

          <div class="participante-observacion-icono">
            ✦
          </div>

          <p>
            ${escaparHtml(
              participante.observaciones ||
              "No existen observaciones administrativas registradas."
            )}
          </p>

        </div>

      </section>


      <!-- ==================================================
           PANEL DE EDICIÓN
      =================================================== -->

      <section
        id="participantePanelEdicion"
        class="participante-panel-edicion"
        hidden
      >

        <div class="participante-panel-edicion-cabecera">

          <div>

            <span class="participante-bloque-etiqueta">
              Modo edición
            </span>

            <h3>
              Administrar participante
            </h3>

            <p>
              Modificá el estado, el acceso y las observaciones.
            </p>

          </div>

          <button
            id="btnCerrarEdicion"
            class="participante-cerrar-edicion"
            type="button"
            aria-label="Cerrar edición"
          >
            ×
          </button>

        </div>

        <div class="participante-administracion">

          <div class="participante-control">

            <label for="fichaEstado">
              Estado administrativo
            </label>

            <select id="fichaEstado">

              ${CONFIG.estadosPermitidos
                .map(estado => `

                  <option
                    value="${estado}"
                    ${
                      participante.estado === estado
                        ? "selected"
                        : ""
                    }
                  >
                    ${capitalizar(estado)}
                  </option>

                `)
                .join("")}

            </select>

          </div>


          <div class="participante-opciones-edicion">

            <label class="participante-check-premium">

              <input
                id="fichaAccesoHabilitado"
                type="checkbox"
                ${
                  participante.accesoHabilitado
                    ? "checked"
                    : ""
                }
              >

              <span class="participante-check-control">
              </span>

              <span class="participante-check-contenido">

                <strong>
                  Acceso a la plataforma
                </strong>

                <small>
                  Permite que el participante ingrese al programa.
                </small>

              </span>

            </label>


            <label class="participante-check-premium">

              <input
                id="fichaRecorridoPreparado"
                type="checkbox"
                ${
                  participante.recorridoPreparado
                    ? "checked"
                    : ""
                }
              >

              <span class="participante-check-control">
              </span>

              <span class="participante-check-contenido">

                <strong>
                  Recorrido formativo preparado
                </strong>

                <small>
                  Indica que los encuentros fueron configurados.
                </small>

              </span>

            </label>

          </div>


          <div class="participante-control participante-control-completo">

            <label for="fichaObservaciones">
              Observaciones administrativas
            </label>

            <textarea
              id="fichaObservaciones"
              rows="5"
              placeholder="Escribí una observación administrativa…"
            >${escaparHtml(
              participante.observaciones || ""
            )}</textarea>

          </div>


          <div class="participante-panel-edicion-acciones">

            <button
              id="btnCancelarEdicion"
              class="admin-boton admin-boton-secundario"
              type="button"
            >
              Cancelar
            </button>

            <button
              id="btnGuardarEdicion"
              class="admin-boton admin-boton-principal"
              type="button"
            >
              Guardar cambios
            </button>

          </div>

        </div>

      </section>

    </div>

  `;

  registrarEventosInformacion();

}


/* =========================================================
   EVENTOS DE INFORMACIÓN PREMIUM
========================================================= */

function registrarEventosInformacion() {

  document
    .querySelector(
      "#btnEditarInformacion"
    )
    ?.addEventListener(
      "click",
      abrirEdicionInformacion
    );

  document
    .querySelector(
      "#btnCerrarEdicion"
    )
    ?.addEventListener(
      "click",
      cerrarEdicionInformacion
    );

  document
    .querySelector(
      "#btnCancelarEdicion"
    )
    ?.addEventListener(
      "click",
      cancelarEdicionInformacion
    );

  document
    .querySelector(
      "#btnGuardarEdicion"
    )
    ?.addEventListener(
      "click",
      guardarCambios
    );

  document
    .querySelector("#fichaEstado")
    ?.addEventListener(
      "change",
      manejarCambiosDatos
    );

  document
    .querySelector(
      "#fichaAccesoHabilitado"
    )
    ?.addEventListener(
      "change",
      manejarCambiosDatos
    );

  document
    .querySelector(
      "#fichaRecorridoPreparado"
    )
    ?.addEventListener(
      "change",
      manejarCambiosDatos
    );

  document
    .querySelector(
      "#fichaObservaciones"
    )
    ?.addEventListener(
      "input",
      manejarCambiosDatos
    );

}


function abrirEdicionInformacion() {

  const panel =
    document.querySelector(
      "#participantePanelEdicion"
    );

  if (!panel) {
    return;
  }

  panel.hidden =
    false;

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


function cerrarEdicionInformacion() {

  const panel =
    document.querySelector(
      "#participantePanelEdicion"
    );

  if (!panel) {
    return;
  }

  panel.hidden =
    true;

}


function cancelarEdicionInformacion() {

  if (!state.datosOriginales) {
    cerrarEdicionInformacion();
    return;
  }

  state.participante =
    clonarObjeto(
      state.datosOriginales
    );

  state.cambiosSinGuardar =
    false;

  renderizarFicha();

  actualizarEstadoGuardado();

}


/* =========================================================
   HISTORIAL
========================================================= */

function renderizarHistorial() {

  if (!dom.historial) {
    return;
  }

  const historial =
    [...state.participante.historial]
      .sort(
        (a, b) =>
          new Date(b.fecha) -
          new Date(a.fecha)
      );

  if (!historial.length) {

    dom.historial.innerHTML =
      crearEstadoVacio(
        "Sin actividad registrada",
        "Todavía no existen movimientos en el historial."
      );

    return;

  }

  dom.historial.innerHTML = `

    <div class="participante-timeline">

      ${historial
        .map(item => `

          <article class="participante-timeline-item">

            <div class="participante-timeline-marca">
            </div>

            <div class="participante-timeline-contenido">

              <div class="participante-timeline-fecha">
                ${formatearFechaHora(
                  item.fecha
                )}
              </div>

              <h3>
                ${escaparHtml(
                  item.titulo
                )}
              </h3>

              <p>
                ${escaparHtml(
                  item.detalle
                )}
              </p>

            </div>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   ENCUENTROS
========================================================= */

function renderizarEncuentros() {

  if (!dom.encuentros) {
    return;
  }

  const encuentros =
    state.participante.encuentros;

  if (!encuentros.length) {

    dom.encuentros.innerHTML =
      crearEstadoVacio(
        "Sin encuentros asignados",
        "El participante todavía no tiene un recorrido configurado."
      );

    return;

  }

  dom.encuentros.innerHTML = `

    <div class="participante-encuentros-grid">

      ${encuentros
        .map(encuentro => {

          const estado =
            obtenerEstadoEncuentro(
              encuentro
            );

          return `

            <article
              class="participante-encuentro participante-encuentro-${estado}"
            >

              <div class="participante-encuentro-cabecera">

                <span>
                  Encuentro ${encuentro.numero}
                </span>

                <strong>
                  ${obtenerEtiquetaEncuentro(
                    estado
                  )}
                </strong>

              </div>

              <h3>
                ${escaparHtml(
                  encuentro.titulo
                )}
              </h3>

              <p>
                ${
                  encuentro.completado
                    ? `Completado el ${formatearFecha(
                        encuentro.fechaCompletado
                      )}.`
                    : encuentro.habilitado
                      ? "Disponible para el participante."
                      : "El acceso todavía no está habilitado."
                }
              </p>

              <div class="participante-encuentro-acciones">

                <label class="participante-check">

                  <input
                    type="checkbox"
                    data-encuentro-habilitado="${encuentro.numero}"
                    ${
                      encuentro.habilitado
                        ? "checked"
                        : ""
                    }
                  >

                  <span>
                    Habilitado
                  </span>

                </label>

                <label class="participante-check">

                  <input
                    type="checkbox"
                    data-encuentro-completado="${encuentro.numero}"
                    ${
                      encuentro.completado
                        ? "checked"
                        : ""
                    }
                  >

                  <span>
                    Completado
                  </span>

                </label>

              </div>

            </article>

          `;

        })
        .join("")}

    </div>

  `;

  dom.encuentros
    .querySelectorAll(
      "[data-encuentro-habilitado]"
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        manejarCambioEncuentro
      );

    });

  dom.encuentros
    .querySelectorAll(
      "[data-encuentro-completado]"
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        manejarCambioEncuentro
      );

    });

}


/* =========================================================
   VIDEOS
========================================================= */

function renderizarVideos() {

  if (!dom.videos) {
    return;
  }

  const videos =
    state.participante.videos;

  if (!videos.length) {

    dom.videos.innerHTML =
      crearEstadoVacio(
        "Sin videos registrados",
        "Todavía no se registraron visualizaciones."
      );

    return;

  }

  dom.videos.innerHTML = `

    <div class="participante-registros-lista">

      ${videos
        .map(video => `

          <article class="participante-registro">

            <div>

              <span class="participante-registro-meta">
                Encuentro ${video.encuentro}
              </span>

              <h3>
                ${escaparHtml(
                  video.titulo
                )}
              </h3>

              <p>
                ${
                  video.visto
                    ? `Visto el ${formatearFecha(
                        video.fechaVisualizacion
                      )}.`
                    : "Visualización pendiente."
                }
              </p>

            </div>

            <span
              class="participante-estado participante-estado-${
                video.visto
                  ? "completado"
                  : "pendiente"
              }"
            >
              ${
                video.visto
                  ? "Visto"
                  : "Pendiente"
              }
            </span>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   MATERIAL
========================================================= */

function renderizarMaterial() {

  if (!dom.material) {
    return;
  }

  const materiales =
    state.participante.materiales;

  if (!materiales.length) {

    dom.material.innerHTML =
      crearEstadoVacio(
        "Sin descargas registradas",
        "Todavía no existe actividad sobre los materiales."
      );

    return;

  }

  dom.material.innerHTML = `

    <div class="participante-registros-lista">

      ${materiales
        .map(material => `

          <article class="participante-registro">

            <div>

              <span class="participante-registro-meta">
                ${escaparHtml(material.tipo)}
                · Encuentro ${material.encuentro}
              </span>

              <h3>
                ${escaparHtml(
                  material.titulo
                )}
              </h3>

              <p>
                ${
                  material.descargado
                    ? `Descargado el ${formatearFecha(
                        material.fechaDescarga
                      )}.`
                    : "Descarga pendiente."
                }
              </p>

            </div>

            <span
              class="participante-estado participante-estado-${
                material.descargado
                  ? "completado"
                  : "pendiente"
              }"
            >
              ${
                material.descargado
                  ? "Descargado"
                  : "Pendiente"
              }
            </span>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   ENCUESTAS
========================================================= */

function renderizarEncuestas() {

  if (!dom.encuestas) {
    return;
  }

  const encuestas =
    state.participante.encuestas;

  if (!encuestas.length) {

    dom.encuestas.innerHTML =
      crearEstadoVacio(
        "Sin encuestas asignadas",
        "Todavía no existen evaluaciones para este participante."
      );

    return;

  }

  dom.encuestas.innerHTML = `

    <div class="participante-registros-lista">

      ${encuestas
        .map(encuesta => `

          <article class="participante-registro">

            <div>

              <span class="participante-registro-meta">
                Evaluación
              </span>

              <h3>
                ${escaparHtml(
                  encuesta.titulo
                )}
              </h3>

              <p>
                ${
                  encuesta.fecha
                    ? `Registrada el ${formatearFecha(
                        encuesta.fecha
                      )}.`
                    : "Sin fecha de realización."
                }
              </p>

            </div>

            <span
              class="participante-estado participante-estado-${
                normalizarClase(
                  encuesta.estado
                )
              }"
            >
              ${capitalizar(
                encuesta.estado
              )}
            </span>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   CERTIFICADOS
========================================================= */

function renderizarCertificados() {

  if (!dom.certificados) {
    return;
  }

  const certificados =
    state.participante.certificados;

  if (!certificados.length) {

    dom.certificados.innerHTML = `

      <div class="participante-vacio">

        <h3>
          Sin certificados emitidos
        </h3>

        <p>
          El certificado podrá emitirse cuando el participante
          complete el programa y las evaluaciones requeridas.
        </p>

        <button
          id="btnGenerarCertificado"
          class="admin-boton admin-boton-secundario"
          type="button"
        >
          Generar certificado de prueba
        </button>

      </div>

    `;

    document
      .querySelector(
        "#btnGenerarCertificado"
      )
      ?.addEventListener(
        "click",
        generarCertificadoTemporal
      );

    return;

  }

  dom.certificados.innerHTML = `

    <div class="participante-registros-lista">

      ${certificados
        .map(certificado => `

          <article class="participante-registro">

            <div>

              <span class="participante-registro-meta">
                ${escaparHtml(
                  certificado.codigo
                )}
              </span>

              <h3>
                ${escaparHtml(
                  certificado.titulo
                )}
              </h3>

              <p>
                Emitido el ${formatearFecha(
                  certificado.fechaEmision
                )}.
              </p>

            </div>

            <span class="participante-estado participante-estado-completado">
              Emitido
            </span>

          </article>

        `)
        .join("")}

    </div>

  `;

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  dom.btnGuardar?.addEventListener(
    "click",
    guardarCambios
  );


  dom.btnGuardarSuperior
    ?.addEventListener(
      "click",
      guardarCambios
    );

  dom.btnAccesoRapido
    ?.addEventListener(
      "click",
      irAAdministrarAcceso
    );

  dom.btnAlternarAcceso
    ?.addEventListener(
      "click",
      alternarAcceso
    );

  dom.btnRegistrarActividad
    ?.addEventListener(
      "click",
      registrarActividadManual
    );


  dom.btnEliminar?.addEventListener(
    "click",
    solicitarEliminacion
  );

  window.addEventListener(
    "beforeunload",
    protegerSalida
  );

}




/* =========================================================
   ACCIONES RÁPIDAS
========================================================= */

function irAAdministrarAcceso() {

  document
    .querySelector(
      "#fichaAccesoHabilitado"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

}


function alternarAcceso() {

  if (!state.participante) {
    return;
  }

  state.participante.accesoHabilitado =
    !state.participante.accesoHabilitado;

  state.cambiosSinGuardar =
    true;

  registrarHistorial(
    "administracion",
    state.participante.accesoHabilitado
      ? "Acceso habilitado"
      : "Acceso deshabilitado",
    state.participante.accesoHabilitado
      ? "La administración habilitó el acceso a la plataforma."
      : "La administración deshabilitó el acceso a la plataforma."
  );

  actualizarEstadoGuardado();

  renderizarCabeceraPremium();

  renderizarDatos();

  renderizarHistorial();

  mostrarNotificacion(
    state.participante.accesoHabilitado
      ? "El acceso fue habilitado. Guardá los cambios para confirmarlo."
      : "El acceso fue deshabilitado. Guardá los cambios para confirmarlo."
  );

}


function registrarActividadManual() {

  const detalle =
    window.prompt(
      "Escribí la actividad que querés registrar:"
    );

  if (
    !detalle ||
    !detalle.trim()
  ) {
    return;
  }

  registrarHistorial(
    "administracion",
    "Actividad administrativa",
    detalle.trim()
  );

  state.cambiosSinGuardar =
    true;

  actualizarEstadoGuardado();

  renderizarHistorial();

  mostrarNotificacion(
    "La actividad fue incorporada al historial. Guardá los cambios."
  );

}




/* =========================================================
   CAMBIOS EN DATOS GENERALES
========================================================= */

function manejarCambiosDatos() {

  if (!state.participante) {
    return;
  }

  const estado =
    document.querySelector(
      "#fichaEstado"
    );

  const acceso =
    document.querySelector(
      "#fichaAccesoHabilitado"
    );

  const recorrido =
    document.querySelector(
      "#fichaRecorridoPreparado"
    );

  const observaciones =
    document.querySelector(
      "#fichaObservaciones"
    );

  state.participante.estado =
    estado?.value ||
    state.participante.estado;

  state.participante.accesoHabilitado =
    Boolean(
      acceso?.checked
    );

  state.participante.recorridoPreparado =
    Boolean(
      recorrido?.checked
    );

  state.participante.observaciones =
    observaciones?.value.trim() || "";

  state.cambiosSinGuardar =
    true;

  actualizarEstadoGuardado();

  renderizarCabeceraPremium();

  renderizarResumen();

}


/* =========================================================
   CAMBIOS EN ENCUENTROS
========================================================= */

function manejarCambioEncuentro(event) {

  const input =
    event.currentTarget;

  const numero =
    Number(
      input.dataset.encuentroHabilitado ||
      input.dataset.encuentroCompletado
    );

  const encuentro =
    state.participante.encuentros
      .find(
        item =>
          item.numero === numero
      );

  if (!encuentro) {
    return;
  }

  if (
    input.dataset.encuentroHabilitado
  ) {

    encuentro.habilitado =
      input.checked;

    if (!input.checked) {

      encuentro.completado =
        false;

      encuentro.fechaCompletado =
        null;

    }

  }

  if (
    input.dataset.encuentroCompletado
  ) {

    encuentro.completado =
      input.checked;

    if (input.checked) {

      encuentro.habilitado =
        true;

      encuentro.fechaCompletado =
        encuentro.fechaCompletado ||
        obtenerFechaActual();

    } else {

      encuentro.fechaCompletado =
        null;

    }

  }

  state.cambiosSinGuardar =
    true;

  actualizarEstadoGuardado();

  renderizarCabeceraPremium();

  renderizarResumen();

  renderizarEncuentros();

}


/* =========================================================
   GUARDAR CAMBIOS
========================================================= */

async function guardarCambios() {

  if (
    state.guardando ||
    !state.participante
  ) {
    return;
  }

  state.guardando = true;

  cambiarEstadoBotonGuardar(
    true
  );

  try {

    registrarHistorial(
      "administracion",
      "Cambios administrativos guardados",
      "Se actualizaron los datos de la ficha del participante."
    );

    const {
      id,
      creado,
      actualizado,
      ...datosParaGuardar
    } = state.participante;

    await actualizar(
      state.participanteId,
      datosParaGuardar
    );

    state.datosOriginales =
      clonarObjeto(
        state.participante
      );

    state.cambiosSinGuardar =
      false;

    actualizarEstadoGuardado();

    renderizarFicha();

    mostrarNotificacion(
      "Los cambios fueron guardados correctamente."
    );

    console.log(
      "FALCO Participante Admin™: cambios guardados en Firestore",
      state.participanteId
    );

  } catch (error) {

    console.error(
      "Error al guardar participante:",
      error
    );

    mostrarNotificacion(
      "No fue posible guardar los cambios.",
      "error"
    );

  } finally {

    state.guardando = false;

    cambiarEstadoBotonGuardar(
      false
    );

  }

}


/* =========================================================
   CERTIFICADO TEMPORAL
========================================================= */

function generarCertificadoTemporal() {

  const certificado = {

    id:
      `cert-${Date.now()}`,

    titulo:
      "Certificado de participación",

    codigo:
      generarCodigoCertificado(),

    fechaEmision:
      obtenerFechaActual(),

    estado:
      "emitido"

  };

  state.participante.certificados
    .push(certificado);

  registrarHistorial(
    "certificado",
    "Certificado generado",
    "Se emitió un certificado administrativo de prueba."
  );

  state.cambiosSinGuardar =
    true;

  renderizarResumen();

  renderizarCertificados();

  renderizarHistorial();

}


/* =========================================================
   ELIMINAR PARTICIPANTE
========================================================= */

function solicitarEliminacion() {

  if (!state.participante) {
    return;
  }

  const nombre =
    state.participante
      .nombreCompleto;

  const confirmar =
    window.confirm(
      `¿Deseás eliminar a ${nombre}? Esta acción no podrá deshacerse.`
    );

  if (!confirmar) {
    return;
  }

  eliminarParticipante();

}






async function eliminarParticipante() {

  try {

    await eliminar(
      state.participanteId
    );

    state.cambiosSinGuardar = false;

    mostrarNotificacion(
      "Participante eliminado correctamente."
    );

    setTimeout(() => {

      window.location.href =
        CONFIG.listadoUrl;

    }, 600);

  } catch (error) {

    console.error(
      "Error al eliminar participante:",
      error
    );

    mostrarNotificacion(
      "No fue posible eliminar al participante.",
      "error"
    );

  }

}


/* =========================================================
   HISTORIAL
========================================================= */

function registrarHistorial(
  tipo,
  titulo,
  detalle
) {

  state.participante.historial
    .unshift({

      fecha:
        new Date().toISOString(),

      tipo,

      titulo,

      detalle

    });

}


/* =========================================================
   ENLACE DE EDICIÓN
========================================================= */

function configurarEnlaceEdicion() {

  if (!dom.btnEditar) {
    return;
  }

  dom.btnEditar.href =
    `${CONFIG.altaUrl}?id=${encodeURIComponent(
      state.participanteId
    )}&modo=editar`;

}


/* =========================================================
   ESTADOS GENERALES
========================================================= */

function mostrarCargaGeneral() {

  const mensaje = `

    <div class="participante-vacio">

      <h3>
        Cargando participante…
      </h3>

      <p>
        Estamos preparando la información de la ficha.
      </p>

    </div>

  `;

  [
    dom.datos,
    dom.historial,
    dom.encuentros,
    dom.videos,
    dom.material,
    dom.encuestas,
    dom.certificados
  ]
    .filter(Boolean)
    .forEach(contenedor => {

      contenedor.innerHTML =
        mensaje;

    });

}


function mostrarErrorGeneral(mensaje) {

  if (!dom.datos) {
    return;
  }

  dom.datos.innerHTML =
    crearEstadoVacio(
      "No fue posible cargar la ficha",
      mensaje
    );

}


/* =========================================================
   NOTIFICACIÓN
========================================================= */

function mostrarNotificacion(
  mensaje,
  tipo = "exito"
) {

  document
    .querySelector(
      ".participante-notificacion"
    )
    ?.remove();

  const notificacion =
    document.createElement("div");

  notificacion.className =
    `participante-notificacion participante-notificacion-${tipo}`;

  notificacion.setAttribute(
    "role",
    tipo === "error"
      ? "alert"
      : "status"
  );

  notificacion.textContent =
    mensaje;

  document.body.appendChild(
    notificacion
  );

  requestAnimationFrame(() => {

    notificacion.classList.add(
      "participante-notificacion-visible"
    );

  });

  window.setTimeout(() => {

    notificacion.classList.remove(
      "participante-notificacion-visible"
    );

    window.setTimeout(
      () => notificacion.remove(),
      250
    );

  }, 3000);

}


/* =========================================================
   UTILIDADES DE RENDERIZADO
========================================================= */

function crearDato(
  etiqueta,
  valor
) {

  return `

    <div class="participante-dato">

      <span>
        ${escaparHtml(etiqueta)}
      </span>

      <strong>
        ${escaparHtml(
          valor || "Sin informar"
        )}
      </strong>

    </div>

  `;

}


function crearDatoEstadoAcceso(
  habilitado
) {

  return `

    <div class="participante-dato">

      <span>
        Acceso
      </span>

      <strong>
        ${
          habilitado
            ? "Habilitado"
            : "Deshabilitado"
        }
      </strong>

    </div>

  `;

}


function crearEstadoVacio(
  titulo,
  descripcion
) {

  return `

    <div class="participante-vacio">

      <h3>
        ${escaparHtml(titulo)}
      </h3>

      <p>
        ${escaparHtml(descripcion)}
      </p>

    </div>

  `;

}


/* =========================================================
   CÁLCULOS
========================================================= */

function calcularProgreso(
  cantidadCompletados
) {

  return Math.round(
    (
      cantidadCompletados /
      CONFIG.totalEncuentros
    ) *
    100
  );

}


function calcularEncuentroActual() {

  const encuentros =
    state.participante.encuentros;

  const pendienteHabilitado =
    encuentros.find(
      encuentro =>
        encuentro.habilitado &&
        !encuentro.completado
    );

  if (pendienteHabilitado) {

    return pendienteHabilitado.numero;

  }

  const completados =
    encuentros
      .filter(
        encuentro =>
          encuentro.completado
      );

  if (!completados.length) {
    return 1;
  }

  const ultimo =
    completados[
      completados.length - 1
    ];

  return Math.min(
    ultimo.numero + 1,
    CONFIG.totalEncuentros
  );

}


function obtenerEstadoEncuentro(
  encuentro
) {

  if (encuentro.completado) {
    return "completado";
  }

  if (encuentro.habilitado) {
    return "disponible";
  }

  return "bloqueado";

}


function obtenerEtiquetaEncuentro(
  estado
) {

  const etiquetas = {

    completado:
      "Completado",

    disponible:
      "Disponible",

    bloqueado:
      "Bloqueado"

  };

  return etiquetas[estado] ||
    estado;

}


/* =========================================================
   BOTÓN GUARDAR
========================================================= */

function cambiarEstadoBotonGuardar(
  guardando
) {

  if (!dom.btnGuardar) {
    return;
  }

  dom.btnGuardar.disabled =
    guardando;

  dom.btnGuardar.textContent =
    guardando
      ? "Guardando…"
      : "Guardar cambios";

}


/* =========================================================
   ESTADO DE GUARDADO
========================================================= */

function actualizarEstadoGuardado() {

  if (
    !dom.estadoGuardado ||
    !dom.estadoGuardadoTexto
  ) {
    return;
  }

  dom.estadoGuardado
    .classList.remove(
      "participante-guardado-ok",
      "participante-guardado-cambios"
    );

  if (
    state.cambiosSinGuardar
  ) {

    dom.estadoGuardado
      .classList.add(
        "participante-guardado-cambios"
      );

    dom.estadoGuardadoTexto
      .textContent =
        "Hay cambios sin guardar";

    return;

  }

  dom.estadoGuardado
    .classList.add(
      "participante-guardado-ok"
    );

  dom.estadoGuardadoTexto
    .textContent =
      "Todos los cambios guardados";

}



/* =========================================================
   PROTECCIÓN DE SALIDA
========================================================= */

function protegerSalida(event) {

  if (!state.cambiosSinGuardar) {
    return;
  }

  event.preventDefault();

  event.returnValue =
    "";

}


/* =========================================================
   UTILIDADES GENERALES
========================================================= */

function escribirTexto(
  elemento,
  texto
) {

  if (!elemento) {
    return;
  }

  elemento.textContent =
    texto;

}


function capitalizar(valor) {

  const texto =
    String(valor || "")
      .trim();

  if (!texto) {
    return "Sin informar";
  }

  return (
    texto.charAt(0).toUpperCase() +
    texto.slice(1)
  );

}


function formatearFecha(fecha) {

  if (!fecha) {
    return "Sin registrar";
  }

  const fechaNormalizada =
    String(fecha).length === 10
      ? `${fecha}T12:00:00`
      : fecha;

  const objetoFecha =
    new Date(fechaNormalizada);

  if (
    Number.isNaN(
      objetoFecha.getTime()
    )
  ) {
    return fecha;
  }

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(objetoFecha);

}


function formatearFechaHora(fecha) {

  if (!fecha) {
    return "Sin registrar";
  }

  const objetoFecha =
    new Date(fecha);

  if (
    Number.isNaN(
      objetoFecha.getTime()
    )
  ) {
    return fecha;
  }

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(objetoFecha);

}


function obtenerFechaActual() {

  const fecha =
    new Date();

  const anio =
    fecha.getFullYear();

  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      fecha.getDate()
    ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;

}


function generarCodigoCertificado() {

  return `FALCO-ESC-${Date.now()
    .toString(36)
    .toUpperCase()}`;

}


function normalizarClase(valor) {

  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    );

}


function escaparHtml(valor) {

  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function clonarObjeto(objeto) {

  return JSON.parse(
    JSON.stringify(objeto)
  );

}



/* =========================================================
   INICIO
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}