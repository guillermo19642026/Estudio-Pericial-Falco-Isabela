import {
  auth,
  db
} from "../../../firebase-config.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


console.log(
  "📥 Mesa de Entrada · Asistencia Profesional FALCO® Ready"
);


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


/* =========================================================
   ELEMENTOS
========================================================= */

const solicitudesBody =
  document.getElementById(
    "solicitudesBody"
  );

const estadoCarga =
  document.getElementById(
    "estadoCarga"
  );

const sinSolicitudes =
  document.getElementById(
    "sinSolicitudes"
  );

const buscadorSolicitudes =
  document.getElementById(
    "buscadorSolicitudes"
  );

const filtroEstado =
  document.getElementById(
    "filtroEstado"
  );

const actualizarSolicitudes =
  document.getElementById(
    "actualizarSolicitudes"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );


/* KPIS */

const kpiNuevas =
  document.getElementById(
    "kpiNuevas"
  );

const kpiRevision =
  document.getElementById(
    "kpiRevision"
  );

const kpiPresupuestadas =
  document.getElementById(
    "kpiPresupuestadas"
  );

const kpiElaboracion =
  document.getElementById(
    "kpiElaboracion"
  );

const kpiFinalizadas =
  document.getElementById(
    "kpiFinalizadas"
  );

  const kpiArchivadas =
  document.getElementById(
    "kpiArchivadas"
  );


/* MODAL */

const solicitudModal =
  document.getElementById(
    "solicitudModal"
  );

const modalBackdrop =
  document.getElementById(
    "modalBackdrop"
  );

const cerrarModal =
  document.getElementById(
    "cerrarModal"
  );

const modalReferencia =
  document.getElementById(
    "modalReferencia"
  );

const modalContenido =
  document.getElementById(
    "modalContenido"
  );

const modalEstado =
  document.getElementById(
    "modalEstado"
  );

const modalPrioridad =
  document.getElementById(
    "modalPrioridad"
  );

const modalPresupuesto =
  document.getElementById(
    "modalPresupuesto"
  );

const modalPagoEstado =
  document.getElementById(
    "modalPagoEstado"
  );

const modalObservaciones =
  document.getElementById(
    "modalObservaciones"
  );

const guardarGestion =
  document.getElementById(
    "guardarGestion"
  );

const archivarSolicitud =
  document.getElementById(
    "archivarSolicitud"
  );

const eliminarSolicitud =
  document.getElementById(
    "eliminarSolicitud"
  );


const estadoGuardado =
  document.getElementById(
    "estadoGuardado"
  );


/* =========================================================
   ESTADO
========================================================= */

let solicitudes =
  [];

let solicitudActivaId =
  null;


/* =========================================================
   UTILIDADES
========================================================= */

function escaparHTML(
  valor
) {

  return String(
    valor ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function normalizar(
  valor = ""
) {

  return String(
    valor
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}


function nombreEstado(
  estado
) {

  const mapa = {

    nueva:
      "Nueva",

    en_revision:
      "En revisión",

    presupuestada:
      "Presupuestada",

    aceptada:
      "Aceptada",

    en_elaboracion:
      "En elaboración",

    finalizada:
  "Finalizada",

rechazada:
  "Rechazada",

archivada:
  "Archivada"

  };


  return mapa[estado] ||
    estado ||
    "Sin estado";

}


function formatearFecha(
  valor
) {

  if (
    !valor
  ) {
    return "—";
  }


  try {

    let fecha;


    if (
      typeof valor.toDate ===
      "function"
    ) {

      fecha =
        valor.toDate();

    }

    else {

      fecha =
        new Date(
          valor
        );

    }


    return fecha.toLocaleDateString(
      "es-AR",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    );

  }

  catch {

    return "—";

  }

}


function formatearVencimiento(
  valor
) {

  if (
    !valor
  ) {
    return "—";
  }


  try {

    const partes =
      valor.split("-");


    if (
      partes.length !== 3
    ) {
      return valor;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

  }

  catch {

    return valor;

  }

}


/* =========================================================
   CARGAR SOLICITUDES
========================================================= */

async function cargarSolicitudes() {

  if (
    estadoCarga
  ) {

    estadoCarga.hidden =
      false;

    estadoCarga.textContent =
      "Cargando solicitudes...";

  }


  try {

    const consulta =
      query(
        collection(
          db,
          "asistencia_profesional"
        ),
        orderBy(
          "creadoEn",
          "desc"
        )
      );


    const snapshot =
      await getDocs(
        consulta
      );


    solicitudes =
      snapshot.docs.map(
        (documento) => ({

          id:
            documento.id,

          ...documento.data()

        })
      );


    console.log(
      `📥 ${solicitudes.length} solicitudes cargadas`
    );


    actualizarKpis();

    renderSolicitudes();


    if (
      estadoCarga
    ) {

      estadoCarga.hidden =
        true;

    }

  }

  catch (
    error
  ) {

    console.error(
      "❌ Error cargando solicitudes:",
      error
    );


    if (
      estadoCarga
    ) {

      estadoCarga.hidden =
        false;

      estadoCarga.textContent =
        "No se pudieron cargar las solicitudes.";

    }

  }

}


/* =========================================================
   KPIS
========================================================= */

function contarEstado(
  estado
) {

  return solicitudes.filter(
    (item) =>

      (
        item.estado ||
        item.gestion?.estado
      ) === estado

  ).length;

}


function actualizarKpis() {

  if (
    kpiNuevas
  ) {

    kpiNuevas.textContent =
      contarEstado(
        "nueva"
      );

  }


  if (
    kpiRevision
  ) {

    kpiRevision.textContent =
      contarEstado(
        "en_revision"
      );

  }


  if (
    kpiPresupuestadas
  ) {

    kpiPresupuestadas.textContent =
      contarEstado(
        "presupuestada"
      );

  }


  if (
    kpiElaboracion
  ) {

    kpiElaboracion.textContent =
      contarEstado(
        "en_elaboracion"
      );

  }


 if (
  kpiFinalizadas
) {

  kpiFinalizadas.textContent =
    contarEstado(
      "finalizada"
    );

}


if (
  kpiArchivadas
) {

  kpiArchivadas.textContent =
    contarEstado(
      "archivada"
    );

}

}

/* =========================================================
   ARCHIVAR SOLICITUD
========================================================= */

archivarSolicitud?.addEventListener(
  "click",
  async () => {

    if (!solicitudActivaId) {
      return;
    }

    const item =
      solicitudes.find(
        (solicitud) =>
          solicitud.id === solicitudActivaId
      );

    const referencia =
      item?.referencia ||
      "esta solicitud";

    const confirmar =
      window.confirm(
        `¿Desea archivar ${referencia}?\n\nLa solicitud no será eliminada y podrá consultarse posteriormente desde el filtro "Archivada".`
      );

    if (!confirmar) {
      return;
    }

    archivarSolicitud.disabled =
      true;

    if (estadoGuardado) {
      estadoGuardado.textContent =
        "Archivando solicitud...";
    }

    try {

      const documentoRef =
        doc(
          db,
          "asistencia_profesional",
          solicitudActivaId
        );

      await updateDoc(
        documentoRef,
        {
          estado:
            "archivada",

          "gestion.estado":
            "archivada",

          actualizadoEn:
            serverTimestamp()
        }
      );

      const indice =
        solicitudes.findIndex(
          (solicitud) =>
            solicitud.id ===
            solicitudActivaId
        );

      if (indice !== -1) {

        solicitudes[indice] = {
          ...solicitudes[indice],

          estado:
            "archivada",

          gestion: {
            ...solicitudes[indice].gestion,
            estado:
              "archivada"
          }
        };

      }

      actualizarKpis();
      renderSolicitudes();
      cerrarFicha();

      console.log(
        "📦 Solicitud archivada:",
        referencia
      );

    }

    catch (error) {

      console.error(
        "❌ Error archivando solicitud:",
        error
      );

      if (estadoGuardado) {
        estadoGuardado.textContent =
          "No se pudo archivar la solicitud.";
      }

    }

    finally {

      archivarSolicitud.disabled =
        false;

    }

  }
);


/* =========================================================
   ELIMINAR SOLICITUD
========================================================= */

eliminarSolicitud?.addEventListener(
  "click",
  async () => {

    if (!solicitudActivaId) {
      return;
    }

    const item =
      solicitudes.find(
        (solicitud) =>
          solicitud.id === solicitudActivaId
      );

    const referencia =
      item?.referencia ||
      "esta solicitud";

    const confirmar =
      window.confirm(
        `ATENCIÓN\n\n¿Desea eliminar definitivamente ${referencia}?\n\nEsta acción eliminará el registro de Firestore y no podrá deshacerse.`
      );

    if (!confirmar) {
      return;
    }

    const confirmarDefinitivo =
      window.confirm(
        "Confirmación final: ¿Eliminar definitivamente la solicitud?"
      );

    if (!confirmarDefinitivo) {
      return;
    }

    eliminarSolicitud.disabled =
      true;

    if (estadoGuardado) {
      estadoGuardado.textContent =
        "Eliminando solicitud...";
    }

    try {

      const documentoRef =
        doc(
          db,
          "asistencia_profesional",
          solicitudActivaId
        );

      await deleteDoc(
        documentoRef
      );

      solicitudes =
        solicitudes.filter(
          (solicitud) =>
            solicitud.id !==
            solicitudActivaId
        );

      actualizarKpis();
      renderSolicitudes();
      cerrarFicha();

      console.log(
        "🗑 Solicitud eliminada:",
        referencia
      );

    }

    catch (error) {

      console.error(
        "❌ Error eliminando solicitud:",
        error
      );

      if (estadoGuardado) {
        estadoGuardado.textContent =
          "No se pudo eliminar la solicitud.";
      }

    }

    finally {

      eliminarSolicitud.disabled =
        false;

    }

  }
);



/* =========================================================
   FILTROS
========================================================= */

function obtenerSolicitudesFiltradas() {

  const texto =
    normalizar(
      buscadorSolicitudes?.value ||
      ""
    );


  const estado =
    filtroEstado?.value ||
    "";


  return solicitudes.filter(
    (item) => {

      const indice =
        normalizar(`
          ${item.referencia || ""}
          ${item.solicitante?.nombreCompleto || ""}
          ${item.solicitante?.email || ""}
          ${item.solicitante?.telefono || ""}
          ${item.tipoAsistenciaNombre || ""}
          ${item.caso?.expediente || ""}
          ${item.caso?.jurisdiccion || ""}
        `);


      const coincideTexto =
        !texto ||
        indice.includes(
          texto
        );


      const estadoActual =
        item.estado ||
        item.gestion?.estado ||
        "nueva";


      const coincideEstado =
  estado
    ? estadoActual === estado
    : estadoActual !== "archivada";


      return (
        coincideTexto &&
        coincideEstado
      );

    }
  );

}


/* =========================================================
   RENDER TABLA
========================================================= */

function renderSolicitudes() {

  if (
    !solicitudesBody
  ) {
    return;
  }


  const lista =
    obtenerSolicitudesFiltradas();


  solicitudesBody.innerHTML =
    lista.map(
      (item) => {

        const estadoActual =
          item.estado ||
          item.gestion?.estado ||
          "nueva";


        const archivos =
          Array.isArray(
            item.archivos
          )
            ? item.archivos.length
            : 0;


        return `
          <tr>

            <td>
              <strong>
                ${escaparHTML(
                  item.referencia ||
                  "Sin referencia"
                )}
              </strong>
            </td>

            <td>
              ${escaparHTML(
                formatearFecha(
                  item.creadoEn
                )
              )}
            </td>

            <td>

              <strong>
                ${escaparHTML(
                  item.solicitante?.nombreCompleto ||
                  "—"
                )}
              </strong>

              <small>
                ${escaparHTML(
                  item.solicitante?.profesion ||
                  ""
                )}
              </small>

            </td>

            <td>
              ${escaparHTML(
                item.tipoAsistenciaNombre ||
                item.tipoAsistencia ||
                "—"
              )}
            </td>

            <td>
              ${escaparHTML(
                item.caso?.expediente ||
                "—"
              )}
            </td>

            <td>
              ${escaparHTML(
                formatearVencimiento(
                  item.caso?.vencimiento
                )
              )}
            </td>

            <td>
              ${archivos}
            </td>

            <td>

              <span
                class="falco-admin-estado"
                data-estado="${escaparHTML(
                  estadoActual
                )}"
              >
                ${escaparHTML(
                  nombreEstado(
                    estadoActual
                  )
                )}
              </span>

            </td>

            <td>

              <button
                type="button"
                class="falco-admin-btn falco-admin-btn--small"
                data-abrir-solicitud="${escaparHTML(
                  item.id
                )}"
              >
                Abrir
              </button>

            </td>

          </tr>
        `;

      }
    )
    .join("");


  if (
    sinSolicitudes
  ) {

    sinSolicitudes.hidden =
      lista.length !== 0;

  }

}


/* =========================================================
   CONTENIDO DE FICHA
========================================================= */

function crearDocumentosHTML(
  archivos
) {

  if (
    !Array.isArray(
      archivos
    ) ||
    !archivos.length
  ) {

    return `
      <p>
        Sin documentación adjunta.
      </p>
    `;

  }


  return `
    <div class="falco-admin-documentos">

      ${archivos.map(
        (archivo) => `
          <a
            href="${escaparHTML(
              archivo.url ||
              archivo.secureUrl ||
              "#"
            )}"
            target="_blank"
            rel="noopener noreferrer"
          >

            <strong>
              ${escaparHTML(
                archivo.nombre ||
                "Documento"
              )}
            </strong>

            <span>
              Abrir documento →
            </span>

          </a>
        `
      ).join("")}

    </div>
  `;

}


function crearInformacionTecnicaHTML(
  item
) {

  const tipo =
    item.tipoAsistencia ||
    "";

  if (
    tipo === "impugnacion" ||
    tipo === "explicaciones" ||
    tipo === "ampliacion" ||
    tipo === "observaciones"
  ) {

    return `








      <section class="falco-admin-ficha-seccion">

        <h3>
          Información técnica
        </h3>

        <p>
          <strong>Cuestionamientos</strong>
          ${escaparHTML(
            item.judicial?.cuestionamientos ||
            "—"
          )}
        </p>

        <p>
          <strong>Respuesta previa / observaciones</strong>
          ${escaparHTML(
            item.judicial?.respuestaPrevia ||
            "—"
          )}
        </p>

      </section>
    `;

  }


  if (
    tipo === "dictamen" ||
    tipo === "revision"
  ) {

    return `
      <section class="falco-admin-ficha-seccion">

        <h3>
          Información técnica
        </h3>

        <p>
          <strong>Puntos de pericia</strong>
          ${escaparHTML(
            item.dictamen?.puntosPericia ||
            "—"
          )}
        </p>

        <p>
          <strong>Entrevistas realizadas</strong>
          ${escaparHTML(
            item.dictamen?.entrevistasRealizadas ||
            "—"
          )}
        </p>

        <p>
          <strong>Técnicas administradas</strong>
          ${escaparHTML(
            item.dictamen?.tecnicasAdministradas ||
            "—"
          )}
        </p>

        <p>
          <strong>Conclusiones profesionales</strong>
          ${escaparHTML(
            item.dictamen?.conclusionesProfesional ||
            "—"
          )}
        </p>

      </section>
    `;

  }


  if (
    tipo === "tests"
  ) {

    return `
      <section class="falco-admin-ficha-seccion">

        <h3>
          Información técnica
        </h3>

        <p>
          <strong>Edad de la persona evaluada</strong>
          ${escaparHTML(
            item.tests?.edadEvaluado ||
            "—"
          )}
        </p>

        <p>
          <strong>Contexto de evaluación</strong>
          ${escaparHTML(
            item.tests?.contextoEvaluacion ||
            "—"
          )}
        </p>

        <p>
          <strong>Tests administrados</strong>
          ${escaparHTML(
            item.tests?.testsAplicados ||
            "—"
          )}
        </p>

        <p>
          <strong>Objetivo de evaluación</strong>
          ${escaparHTML(
            item.tests?.objetivoEvaluacion ||
            "—"
          )}
        </p>

        <p>
          <strong>Antecedentes</strong>
          ${escaparHTML(
            item.tests?.antecedentesEvaluacion ||
            "—"
          )}
        </p>

      </section>
    `;

  }


  if (
    tipo === "otro"
  ) {

    return `
      <section class="falco-admin-ficha-seccion">

        <h3>
          Requerimiento
        </h3>

        <p>
          ${escaparHTML(
            item.otro?.requerimiento ||
            "—"
          )}
        </p>

      </section>
    `;

  }


  return "";

}


function abrirFicha(
  id
) {

  const item =
    solicitudes.find(
      (solicitud) =>
        solicitud.id === id
    );


  if (
    !item
  ) {
    return;
  }


  solicitudActivaId =
    id;


  if (
    modalReferencia
  ) {

    modalReferencia.textContent =
      item.referencia ||
      "Solicitud";

  }


  if (
    modalContenido
  ) {

    modalContenido.innerHTML =
      `
        <section class="falco-admin-ficha-seccion">

          <h3>
            Solicitante
          </h3>

          <p>
            <strong>Nombre</strong>
            ${escaparHTML(
              item.solicitante?.nombreCompleto ||
              "—"
            )}
          </p>

          <p>
            <strong>Profesión</strong>
            ${escaparHTML(
              item.solicitante?.profesion ||
              "—"
            )}
          </p>

          <p>
            <strong>Matrícula</strong>
            ${escaparHTML(
              item.solicitante?.matricula ||
              "—"
            )}
          </p>

          <p>
            <strong>WhatsApp</strong>
            ${escaparHTML(
              item.solicitante?.telefono ||
              "—"
            )}
          </p>

          <p>
            <strong>Email</strong>
            ${escaparHTML(
              item.solicitante?.email ||
              "—"
            )}
          </p>

          <p>
            <strong>Localidad</strong>
            ${escaparHTML(
              item.solicitante?.localidad ||
              "—"
            )}
          </p>

        </section>


        <section class="falco-admin-ficha-seccion">

          <h3>
            Solicitud
          </h3>

          <p>
            <strong>Tipo</strong>
            ${escaparHTML(
              item.tipoAsistenciaNombre ||
              "—"
            )}
          </p>

          <p>
            <strong>Fecha</strong>
            ${escaparHTML(
              formatearFecha(
                item.creadoEn
              )
            )}
          </p>

          <p>
            <strong>Canal de entrega</strong>
            ${escaparHTML(
              item.canalEntregaNombre ||
              "—"
            )}
          </p>

        </section>


        <section class="falco-admin-ficha-seccion">

          <h3>
            Caso
          </h3>

          <p>
            <strong>Fuero</strong>
            ${escaparHTML(
              item.caso?.fuero ||
              "—"
            )}
          </p>

          <p>
            <strong>Jurisdicción</strong>
            ${escaparHTML(
              item.caso?.jurisdiccion ||
              "—"
            )}
          </p>

          <p>
            <strong>Expediente</strong>
            ${escaparHTML(
              item.caso?.expediente ||
              "—"
            )}
          </p>

          <p>
            <strong>Vencimiento</strong>
            ${escaparHTML(
              formatearVencimiento(
                item.caso?.vencimiento
              )
            )}
          </p>

          <p>
            <strong>Descripción</strong>
            ${escaparHTML(
              item.caso?.descripcion ||
              "—"
            )}
          </p>

        </section>


        ${crearInformacionTecnicaHTML(
          item
        )}


        <section class="falco-admin-ficha-seccion">

          <h3>
            Documentación
          </h3>

          ${crearDocumentosHTML(
            item.archivos
          )}

        </section>
      `;

  }


  const gestion =
    item.gestion ||
    {};


  if (
    modalEstado
  ) {

    modalEstado.value =
      item.estado ||
      gestion.estado ||
      "nueva";

  }


  if (
    modalPrioridad
  ) {

    modalPrioridad.value =
      item.prioridad ||
      gestion.prioridad ||
      "normal";

  }


  if (
    modalPresupuesto
  ) {

    modalPresupuesto.value =
      gestion.presupuesto ??
      "";

  }


  if (
    modalPagoEstado
  ) {

    modalPagoEstado.value =
      gestion.pagoEstado ||
      "pendiente";

  }


  if (
    modalObservaciones
  ) {

    modalObservaciones.value =
      gestion.observacionesInternas ||
      "";

  }


  if (
    estadoGuardado
  ) {

    estadoGuardado.textContent =
      "";

  }


  if (
    solicitudModal
  ) {

    solicitudModal.hidden =
      false;

    solicitudModal.style.display =
      "flex";

  }

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarFicha() {

  if (
    solicitudModal
  ) {

    solicitudModal.hidden =
      true;

    solicitudModal.style.display =
      "none";

  }


  solicitudActivaId =
    null;

}


cerrarModal?.addEventListener(
  "click",
  cerrarFicha
);


modalBackdrop?.addEventListener(
  "click",
  cerrarFicha
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      cerrarFicha();

    }

  }
);


/* =========================================================
   ABRIR DESDE TABLA
========================================================= */

solicitudesBody?.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        "[data-abrir-solicitud]"
      );


    if (
      !boton
    ) {
      return;
    }


    abrirFicha(
      boton.dataset.abrirSolicitud
    );

  }
);


/* =========================================================
   GUARDAR GESTIÓN
========================================================= */

guardarGestion?.addEventListener(
  "click",
  async () => {

    if (
      !solicitudActivaId
    ) {
      return;
    }


    const estado =
      modalEstado?.value ||
      "nueva";


    const prioridad =
      modalPrioridad?.value ||
      "normal";


    const presupuestoTexto =
      modalPresupuesto?.value ||
      "";


    const presupuesto =
      presupuestoTexto === ""
        ? null
        : Number(
            presupuestoTexto
          );


    const pagoEstado =
      modalPagoEstado?.value ||
      "pendiente";


    const observacionesInternas =
      modalObservaciones?.value.trim() ||
      "";


    if (
      estadoGuardado
    ) {

      estadoGuardado.textContent =
        "Guardando...";

    }


    if (
      guardarGestion
    ) {

      guardarGestion.disabled =
        true;

    }


    try {

      const referenciaDocumento =
        doc(
          db,
          "asistencia_profesional",
          solicitudActivaId
        );


      await updateDoc(
        referenciaDocumento,
        {

          estado:
            estado,

          prioridad:
            prioridad,

          "gestion.estado":
            estado,

          "gestion.prioridad":
            prioridad,

          "gestion.presupuesto":
            presupuesto,

          "gestion.pagoEstado":
            pagoEstado,

          "gestion.observacionesInternas":
            observacionesInternas,

          actualizadoEn:
            serverTimestamp()

        }
      );


      const indice =
        solicitudes.findIndex(
          (item) =>
            item.id ===
            solicitudActivaId
        );


      if (
        indice !== -1
      ) {

        solicitudes[indice] = {

          ...solicitudes[indice],

          estado:
            estado,

          prioridad:
            prioridad,

          gestion: {

            ...solicitudes[indice].gestion,

            estado:
              estado,

            prioridad:
              prioridad,

            presupuesto:
              presupuesto,

            pagoEstado:
              pagoEstado,

            observacionesInternas:
              observacionesInternas

          }

        };

      }


      actualizarKpis();

      renderSolicitudes();


      if (
        estadoGuardado
      ) {

        estadoGuardado.textContent =
          "Cambios guardados correctamente.";

      }

    }

    catch (
      error
    ) {

      console.error(
        "❌ Error guardando gestión:",
        error
      );


      if (
        estadoGuardado
      ) {

        estadoGuardado.textContent =
          "No se pudieron guardar los cambios.";

      }

    }

    finally {

      if (
        guardarGestion
      ) {

        guardarGestion.disabled =
          false;

      }

    }

  }
);


/* =========================================================
   FILTROS
========================================================= */

buscadorSolicitudes?.addEventListener(
  "input",
  renderSolicitudes
);


filtroEstado?.addEventListener(
  "change",
  renderSolicitudes
);


actualizarSolicitudes?.addEventListener(
  "click",
  cargarSolicitudes
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn?.addEventListener(
  "click",
  async () => {

    try {

      await signOut(
        auth
      );


      window.location.href =
        "../ecosistema-falco.html#acceso";

    }

    catch (
      error
    ) {

      console.error(
        "❌ Error cerrando sesión:",
        error
      );

    }

  }
);


/* =========================================================
   AUTENTICACIÓN ADMIN
========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (
      !user
    ) {

      window.location.href =
        "../ecosistema-falco.html#acceso";

      return;

    }


    if (
      user.email !==
      ADMIN_EMAIL
    ) {

      console.warn(
        "⛔ Acceso administrativo denegado:",
        user.email
      );


      window.location.href =
        "centro-operaciones.html";

      return;

    }


    console.log(
      "✅ Administrador autorizado:",
      user.email
    );


    await cargarSolicitudes();

  }
);