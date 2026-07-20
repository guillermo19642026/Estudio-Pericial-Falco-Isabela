/* =========================================================
   FALCO Admisiones™
   Detalle administrativo
========================================================= */

import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const estadoCarga =
  document.getElementById("estadoCarga");

const contenidoAdmision =
  document.getElementById("contenidoAdmision");

const errorAdmision =
  document.getElementById("errorAdmision");

const errorAdmisionTexto =
  document.getElementById("errorAdmisionTexto");

const detalleReferencia =
  document.getElementById("detalleReferencia");

const estadoAdmisionBadge =
  document.getElementById("estadoAdmisionBadge");

const datoReferencia =
  document.getElementById("datoReferencia");

const datoFecha =
  document.getElementById("datoFecha");

const datoPerfil =
  document.getElementById("datoPerfil");

const datoEstado =
  document.getElementById("datoEstado");

const datoNombre =
  document.getElementById("datoNombre");

const datoEmail =
  document.getElementById("datoEmail");

const datoTelefono =
  document.getElementById("datoTelefono");

const datoTipoUsuario =
  document.getElementById("datoTipoUsuario");

const respuestasAdmision =
  document.getElementById("respuestasAdmision");

const documentosAdmision =
  document.getElementById("documentosAdmision");

const cantidadDocumentos =
  document.getElementById("cantidadDocumentos");

const selectorEstadoAdmision =
  document.getElementById("selectorEstadoAdmision");

const observacionesInternas =
  document.getElementById("observacionesInternas");


const workflowAdmision =
  document.getElementById("workflowAdmision");


const btnGuardarSeguimiento =
  document.getElementById("btnGuardarSeguimiento");

const mensajeGuardado =
  document.getElementById("mensajeGuardado");

const historialAdmision =
  document.getElementById("historialAdmision");


const btnEnviarEmail =
  document.getElementById("btnEnviarEmail");

const btnContactarWhatsApp =
  document.getElementById("btnContactarWhatsApp");

  const btnCrearTurno =
  document.getElementById("btnCrearTurno");

const btnCrearPericiado =
  document.getElementById("btnCrearPericiado");

const btnCrearExpediente =
  document.getElementById("btnCrearExpediente");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const COLECCION_ADMISIONES = "admisiones";

const CAMPOS_TECNICOS = new Set([
  "id",

  "creadoEn",
  "actualizadoEn",
  "enviadoEn",
  "finalizadoEn",
  "sincronizadoEn",

  "createdAt",
  "updatedAt",

  "revision",
  "estado",
  "origen",
  "canal",

  "version",
  "versionFormulario",
  "version_formulario",
  "cuestionario",
  "preguntasVisibles",
  "preguntas_visibles",

  "cantidadDocumentos",
  "cantidad_documentos",

  "documentos",
  "archivos",
  "adjuntos",
  "documentacion",
  "documentosAdjuntos",
  "uploads",

  "tipoUsuario",
  "tipo_usuario",

  "nombreProfesional",
  "nombre_profesional",

  "email",
  "correo",
  "correoElectronico",
  "correo_electronico",

  "telefono",
  "celular",
  "whatsapp",

  "perfilProfesional",
  "perfil_profesional"
]);


/* =========================================================
   ESTADO
========================================================= */

let admisionId = "";
let admisionActual = null;


/* =========================================================
   UTILIDADES
========================================================= */

function textoSeguro(valor, reemplazo = "—") {

  const texto =
    String(valor ?? "").trim();

  return texto || reemplazo;

}


function escaparHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function normalizarTexto(valor) {

  return String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}


function normalizarEstadoAdmision(valor) {

  const estado = String(valor || "completada")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_")
    .replaceAll("-", "_");

  const equivalencias = {
    completada: "nueva",
    enviada: "nueva",
    nuevo: "nueva",
    nueva: "nueva",

    revision: "en_revision",
    en_revision: "en_revision",

    contactada: "contactado",
    contactado: "contactado",

    turno_pendiente: "turno_pendiente",

    aceptada: "aceptada",
    rechazada: "rechazada",
    cerrada: "cerrada"
  };

  return equivalencias[estado] || estado;
}




function normalizarEstado(valor) {

  return normalizarEstadoAdmision(valor);

}


function convertirFecha(valor) {

  if (!valor) return null;

  if (typeof valor?.toDate === "function") {
    return valor.toDate();
  }

  if (typeof valor?.seconds === "number") {
    return new Date(valor.seconds * 1000);
  }

  if (valor instanceof Date) {
    return valor;
  }

  const fecha =
    new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? null
    : fecha;

}


function formatearFecha(valor) {

  const fecha =
    convertirFecha(valor);

  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      dateStyle: "long",
      timeStyle: "short"
    }
  ).format(fecha);

}


function convertirEtiqueta(clave) {

  return String(clave || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /^./,
      letra => letra.toUpperCase()
    );

}


function esObjetoPlano(valor) {

  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor) &&
    typeof valor?.toDate !== "function"
  );

}


function esURL(valor) {

  if (typeof valor !== "string") {
    return false;
  }

  return (
    valor.startsWith("https://") ||
    valor.startsWith("http://")
  );

}


/* =========================================================
   DATOS PRINCIPALES
========================================================= */


function obtenerNombre(data) {

  const nombreDirecto = buscarDatoEnObjeto(
    data,
    [
      "nombrecompleto",
      "nombreyapellido",
      "nombreapellido",
      "nombreprofesional",
      "nombrepersona",
      "nombre"
    ]
  );

  const apellidoDirecto = buscarDatoEnObjeto(
    data,
    [
      "apellido",
      "apellidos"
    ]
  );

  if (nombreDirecto && apellidoDirecto) {
    return `${nombreDirecto} ${apellidoDirecto}`.trim();
  }

  if (nombreDirecto) {
  return textoSeguro(nombreDirecto);
}


return "Sin identificar";
}


function buscarDatoEnObjeto(
  objeto,
  clavesBuscadas,
  profundidad = 0
) {

  if (
    profundidad > 5 ||
    objeto === null ||
    typeof objeto !== "object"
  ) {
    return "";
  }

  for (const [clave, valor] of Object.entries(objeto)) {

    const claveNormalizada =
      normalizarTexto(clave)
        .replaceAll("_", "")
        .replaceAll("-", "")
        .replaceAll(" ", "");

    if (
      clavesBuscadas.includes(claveNormalizada) &&
      typeof valor !== "object" &&
      textoSeguro(valor, "")
    ) {
      return valor;
    }

  }

  for (const valor of Object.values(objeto)) {

    if (
      valor &&
      typeof valor === "object"
    ) {

      const encontrado =
        buscarDatoEnObjeto(
          valor,
          clavesBuscadas,
          profundidad + 1
        );

      if (encontrado) {
        return encontrado;
      }

    }

  }

  return "";

}


function obtenerEmail(data) {

  return textoSeguro(
    buscarDatoEnObjeto(
      data,
      [
        "email",
        "correo",
        "correoelectronico",
        "mail"
      ]
    ),
    ""
  );

}


function obtenerTelefono(data) {

  return textoSeguro(
    buscarDatoEnObjeto(
      data,
      [
        "telefono",
        "celular",
        "whatsapp",
        "telefonocelular",
        "numero"
      ]
    ),
    ""
  );

}


function obtenerPerfil(data) {

  const perfil =
    data.perfil ||
    data.tipoPerfil ||
    data.tipoUsuario ||
    data.tipoConsulta ||
    data.categoria ||
    "";

  if (esObjetoPlano(perfil)) {

    return textoSeguro(
      perfil.nombre ||
      perfil.label ||
      perfil.valor ||
      perfil.tipo
    );

  }

  return textoSeguro(perfil);

}


function obtenerFecha(data) {

  return (
    data.enviadoEn ||
    data.finalizadoEn ||
    data.creadoEn ||
    data.createdAt ||
    data.fechaCreacion ||
    data.fecha ||
    null
  );

}


/* =========================================================
   ESTADOS
========================================================= */

function textoEstado(estado) {

  const etiquetas = {
    completada: "Nueva",
    nueva: "Nueva",
    enviada: "Nueva",
    revision: "En revisión",
    en_revision: "En revisión",
    contactado: "Contactado",
    turno_pendiente: "Turno pendiente",
    aceptada: "Aceptada",
    rechazada: "Rechazada",
    cerrada: "Cerrada"
  };

  return (
    etiquetas[estado] ||
    convertirEtiqueta(estado)
  );

}


function claseEstado(estado) {

  return `estado-${estado.replaceAll("_", "-")}`;

}


/* =========================================================
   DOCUMENTOS
========================================================= */

function obtenerDocumentos(data) {

  const posibles = [
    data.documentos,
    data.archivos,
    data.adjuntos,
    data.documentacion,
    data.documentosAdjuntos,
    data.uploads
  ];

  for (const valor of posibles) {

    if (Array.isArray(valor)) {
      return valor;
    }

    if (esObjetoPlano(valor)) {
      return Object.values(valor);
    }

  }

  return [];

}


function obtenerURLDocumento(documento) {

  if (typeof documento === "string") {
    return esURL(documento) ? documento : "";
  }

  if (!documento) return "";

  return (
    documento.secure_url ||
    documento.secureUrl ||
    documento.url ||
    documento.downloadURL ||
    documento.enlace ||
    documento.link ||
    ""
  );

}


function obtenerNombreDocumento(documento, indice) {

  if (typeof documento === "string") {
    return `Documento ${indice + 1}`;
  }

  const nombre = textoSeguro(
    documento.original_filename ||
    documento.originalFilename ||
    documento.nombreOriginal ||
    documento.nombre ||
    documento.filename ||
    documento.archivo ||
    "",
    ""
  );

  if (nombre && !nombre.includes("/")) {
    return nombre;
  }

  const formato =
    documento.format ||
    documento.extension ||
    "";

  return formato
    ? `Documento ${indice + 1}.${formato}`
    : `Documento ${indice + 1}`;
}


function renderizarDocumentos(documentos) {

  cantidadDocumentos.textContent =
    documentos.length === 1
      ? "1 archivo"
      : `${documentos.length} archivos`;

  if (!documentos.length) {

    documentosAdmision.innerHTML = `
      <p class="admision-vacio">
        No se adjuntó documentación.
      </p>
    `;

    return;

  }

  documentosAdmision.innerHTML =
    documentos
      .map((documento, indice) => {

        const nombre =
          obtenerNombreDocumento(
            documento,
            indice
          );

        const url =
          obtenerURLDocumento(documento);

        const tipo =
  typeof documento === "object"
    ? (
        documento.mimeType ||
        documento.mime_type ||
        documento.tipoArchivo ||
        documento.resource_type ||
        documento.format ||
        "Archivo"
      )
    : "Archivo";

        return `
          <article class="admision-documento-card">

            <strong>
              📄 ${escaparHTML(nombre)}
            </strong>

            <span>
              ${escaparHTML(tipo)}
            </span>

            ${
              url
                ? `
                  <a
                    href="${escaparHTML(url)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    Abrir documento →
                  </a>
                `
                : `
                  <span>
                    Enlace no disponible
                  </span>
                `
            }

          </article>
        `;

      })
      .join("");

}


/* =========================================================
   RESPUESTAS
========================================================= */

function traducirValorFormulario(valor) {

  const traducciones = {

    /* Respuestas generales */

    si: "Sí",
    no: "No",
    no_se: "No sabe / No definido",
    indistinto: "Indistinto",

    /* Provincias y jurisdicciones */

    buenos_aires: "Buenos Aires",
    ciudad_autonoma_buenos_aires:
      "Ciudad Autónoma de Buenos Aires",
    caba: "CABA",

    /* Perfiles */

    psicologo: "Psicólogo/a",
    profesional: "Profesional",
    particular: "Particular",
    abogado: "Abogado/a",
    estudio_juridico: "Estudio jurídico",

    /* Experiencia */

    sin_experiencia:
      "Sin experiencia pericial",
    experiencia_inicial:
      "Experiencia pericial inicial",
    con_experiencia:
      "Con experiencia pericial",

    /* Tipo de consulta */

    supervision:
      "Supervisión pericial",
    orientacion:
      "Orientación profesional",
    revision_informe:
      "Revisión de informe",
    confeccion_informe:
      "Confección de informe",

    /* Modalidad */

    videollamada:
      "Videollamada",
    presencial:
      "Presencial",
    entrevista_orientacion:
      "Entrevista de orientación",

    /* Contacto */

    whatsapp:
      "WhatsApp",
    email:
      "Correo electrónico",
    llamada:
      "Llamada telefónica",

    /* Estado del trabajo */

    consulta_previa:
      "Consulta previa al inicio",
    en_proceso:
      "Trabajo en proceso",
    finalizado:
      "Trabajo finalizado",

    /* Ámbitos */

    civil:
      "Civil",
    laboral:
      "Laboral",
    penal:
      "Penal",
    familia:
      "Familia",

    /* Rol */

    perito_oficio:
      "Perito de oficio",
    perito_parte:
      "Perito de parte",
    consultor_tecnico:
      "Consultor/a técnico/a",

    /* Material */

    sin_material:
      "Sin material disponible",
    informe:
      "Informe",
    expediente:
      "Expediente",
    entrevistas:
      "Entrevistas",
    protocolos:
      "Protocolos de evaluación",

    /* Revisión */

    estructura:
      "Estructura del informe",
    contenido:
      "Contenido técnico",
    redaccion:
      "Redacción",
    completa:
      "Revisión integral",

    /* Técnicas */

    entrevista_clinica:
      "Entrevista clínica",
    psicodiagnostico:
      "Psicodiagnóstico",
    tecnicas_proyectivas:
      "Técnicas proyectivas",
    tecnicas_psicometricas:
      "Técnicas psicométricas",

    /* Origen */

    google:
      "Google",
    recomendacion:
      "Recomendación",
    redes_sociales:
      "Redes sociales",
    sitio_web:
      "Sitio web"
  };

  const clave =
    normalizarTexto(valor)
      .replaceAll(" ", "_")
      .replaceAll("-", "_");

  return traducciones[clave] || convertirEtiqueta(valor);
}




function formatearValor(valor) {

  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return "—";
  }

  if (typeof valor === "boolean") {
    return valor ? "Sí" : "No";
  }

  if (Array.isArray(valor)) {

    if (!valor.length) {
      return "—";
    }

    return `
      <ul class="admision-lista-valores">
        ${valor.map(item => `
          <li>${escaparHTML(
            traducirValorFormulario(item)
          )}</li>
        `).join("")}
      </ul>
    `;

  }

  if (
    typeof valor?.toDate === "function" ||
    typeof valor?.seconds === "number"
  ) {
    return escaparHTML(formatearFecha(valor));
  }

  if (esURL(valor)) {

    return `
      <a
        href="${escaparHTML(valor)}"
        target="_blank"
        rel="noopener noreferrer">
        Abrir enlace →
      </a>
    `;

  }

 if (typeof valor === "string") {

  const texto = valor.trim();

  const pareceCodigo =
    !texto.includes(" ") ||
    texto.includes("_");

  if (pareceCodigo) {

    return escaparHTML(
      traducirValorFormulario(texto)
    );

  }

  return escaparHTML(texto);

}

  return escaparHTML(String(valor));

}





function crearItemRespuesta(clave, valor) {

  return `
    <article class="admision-respuesta-item">

      <span>
        ${escaparHTML(convertirEtiqueta(clave))}
      </span>

      <div>
        ${formatearValor(valor)}
      </div>

    </article>
  `;

}


function crearGrupoRespuestas(
  titulo,
  objeto
) {

  const items = [];

  for (const [clave, valor] of Object.entries(objeto)) {

   if (
  CAMPOS_TECNICOS.has(clave) ||
  CAMPOS_TECNICOS.has(
    clave.replace(
      /_([a-z])/g,
      (_, letra) => letra.toUpperCase()
    )
  )
) {
  continue;
}

    if (esObjetoPlano(valor)) {
      continue;
    }

    items.push(
      crearItemRespuesta(clave, valor)
    );

  }

  if (!items.length) return "";

  return `
    <section class="admision-grupo">

      <h3 class="admision-grupo-titulo">
        ${escaparHTML(convertirEtiqueta(titulo))}
      </h3>

      <div class="admision-grupo-contenido">
        ${items.join("")}
      </div>

    </section>
  `;

}


function recorrerGrupos(
  objeto,
  ruta = "Información general",
  grupos = []
) {

  const valoresSimples = {};

  for (const [clave, valor] of Object.entries(objeto)) {

   if (
  CAMPOS_TECNICOS.has(clave) ||
  CAMPOS_TECNICOS.has(
    clave.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase())
  )
) {
  continue;
}

    if (esObjetoPlano(valor)) {

      recorrerGrupos(
        valor,
        convertirEtiqueta(clave),
        grupos
      );

      continue;
    }

    valoresSimples[clave] = valor;

  }

  if (Object.keys(valoresSimples).length) {

    grupos.push({
      titulo: ruta,
      datos: valoresSimples
    });

  }

  return grupos;

}


function renderizarRespuestas(data) {

  const grupos =
    recorrerGrupos(data);

  const contenido =
    grupos
      .map(grupo =>
        crearGrupoRespuestas(
          grupo.titulo,
          grupo.datos
        )
      )
      .filter(Boolean)
      .join("");

  respuestasAdmision.innerHTML =
    contenido ||
    `
      <p class="admision-vacio">
        No se encontraron respuestas visibles.
      </p>
    `;

}


/* =========================================================
   CONTACTO
========================================================= */

function configurarContacto(email, telefono, referencia) {

  if (email) {

    btnEnviarEmail.hidden = false;

    btnEnviarEmail.href =
      `mailto:${encodeURIComponent(email)}` +
      `?subject=${encodeURIComponent(
        `FALCO Admisión™ — ${referencia}`
      )}`;

  } else {

    btnEnviarEmail.hidden = true;

  }


  const numero =
    String(telefono || "")
      .replace(/\D/g, "");

  if (numero) {

    btnContactarWhatsApp.hidden = false;

    const mensaje =
      [
        "Hola.",
        "",
        "Nos comunicamos desde el Estudio Pericial Psicológico FALCO®",
        `en relación con su admisión ${referencia}.`
      ].join("\n");

    btnContactarWhatsApp.href =
      `https://wa.me/${numero}` +
      `?text=${encodeURIComponent(mensaje)}`;

  } else {

    btnContactarWhatsApp.hidden = true;

  }

}



/* =========================================================
   FALCO WORKFLOW™
========================================================= */

function actualizarWorkflowAdmision() {

  if (!workflowAdmision || !admisionActual) return;

  const etapas = [
    "nueva",
    "en_revision",
    "contactado",
    "entrevista",
    "aceptada"
  ];

  let estadoActual =
    normalizarEstadoAdmision(admisionActual.estado);

  /*
    Compatibilidad con posibles nombres anteriores
    o variantes guardadas en Firestore.
  */

  const equivalencias = {
    nueva: "nueva",
    pendiente: "nueva",

    en_revision: "en_revision",
    revision: "en_revision",
    en_revisión: "en_revision",

    contactado: "contactado",
    contactada: "contactado",
    contacto_realizado: "contactado",

    entrevista: "entrevista",
entrevista_coordinada: "entrevista",
turno_creado: "entrevista",
turno_pendiente: "entrevista",

    aceptada: "aceptada",
    aceptado: "aceptada",
    aprobada: "aceptada",
    aprobado: "aceptada"
  };

  estadoActual =
    equivalencias[estadoActual] || estadoActual;

  let indiceActual = etapas.indexOf(estadoActual);

  /*
    Si aparece un estado todavía no contemplado,
    se mantiene visible la primera etapa.
  */

  if (indiceActual === -1) {
    indiceActual = 0;
  }

  const elementosEtapa =
    workflowAdmision.querySelectorAll(".workflow-etapa");

  const conectores =
    workflowAdmision.querySelectorAll(".workflow-conector");

  elementosEtapa.forEach((elemento, indice) => {

    elemento.classList.remove(
      "completada",
      "actual"
    );

    const indicador =
      elemento.querySelector(".workflow-indicador");

    if (indicador) {
      indicador.textContent = String(indice + 1);
    }

    if (indice < indiceActual) {
      elemento.classList.add("completada");
    }

    if (indice === indiceActual) {
      elemento.classList.add("actual");
    }

  });

  conectores.forEach((conector, indice) => {

    conector.classList.remove("completado");

    if (indice < indiceActual) {
      conector.classList.add("completado");
    }

  });

}






/* =========================================================
   ACCIONES DEL ECOSISTEMA
========================================================= */

function actualizarAccionesEcosistema(estado) {

  const estadoNormalizado =
    normalizarEstadoAdmision(estado);

  const estadosConTurnoDisponible = [
    "contactado",
    "turno_pendiente",
    "aceptada"
  ];

  const estadosConPericiadoDisponible = [
    "aceptada"
  ];

  const estadosConExpedienteDisponible = [
    "aceptada"
  ];


  const turnoDisponible =
    estadosConTurnoDisponible.includes(
      estadoNormalizado
    );

  const periciadoDisponible =
    estadosConPericiadoDisponible.includes(
      estadoNormalizado
    );

  const expedienteDisponible =
    estadosConExpedienteDisponible.includes(
      estadoNormalizado
    );


  btnCrearTurno.disabled =
    !turnoDisponible;

  btnCrearPericiado.disabled =
    !periciadoDisponible;

  btnCrearExpediente.disabled =
    !expedienteDisponible;


  const textoTurno =
    btnCrearTurno.querySelector("small");

  const textoPericiado =
    btnCrearPericiado.querySelector("small");

  const textoExpediente =
    btnCrearExpediente.querySelector("small");


  if (textoTurno) {

    textoTurno.textContent =
      turnoDisponible
        ? "Disponible"
        : "Disponible al contactar";

  }


  if (textoPericiado) {

    textoPericiado.textContent =
      periciadoDisponible
        ? "Disponible"
        : "Disponible al aceptar";

  }


  if (textoExpediente) {

    textoExpediente.textContent =
      expedienteDisponible
        ? "Disponible"
        : "Disponible al aceptar";

  }

}



/* =========================================================
   CREAR TURNO DESDE ADMISIÓN
========================================================= */

function abrirCreacionTurno() {

  if (!admisionActual || !admisionId) {
    return;
  }

  const estado =
    normalizarEstadoAdmision(
      admisionActual.estado
    );

  const estadosPermitidos = [
    "contactado",
    "turno_pendiente",
    "aceptada"
  ];

  if (!estadosPermitidos.includes(estado)) {

    console.warn(
      "La admisión todavía no está habilitada para crear un turno."
    );

    return;
  }

  const referencia =
    textoSeguro(
      admisionActual.id ||
      admisionActual.referencia ||
      admisionId,
      admisionId
    );

 const nombreDetectado =
  obtenerNombre(admisionActual);

const nombreVisible =
  textoSeguro(
    datoNombre?.textContent,
    ""
  );

const nombre =
  nombreDetectado !== "Sin identificar"
    ? nombreDetectado
    : (
        nombreVisible &&
        nombreVisible !== "Sin identificar" &&
        nombreVisible !== "—"
          ? nombreVisible
          : ""
      );

  const email =
    obtenerEmail(admisionActual);

  const telefono =
    obtenerTelefono(admisionActual);

  const parametros =
    new URLSearchParams();

  parametros.set(
    "admisionId",
    admisionId
  );

  parametros.set(
    "referencia",
    referencia
  );

  if (nombre && nombre !== "Sin identificar") {
    parametros.set("nombre", nombre);
  }

  if (email) {
    parametros.set("email", email);
  }

  if (telefono) {
    parametros.set("telefono", telefono);
  }

  window.location.href =
    `turno-nuevo.html?${parametros.toString()}`;

}





/* =========================================================
   HISTORIAL
========================================================= */

function renderizarHistorial(historial = []) {

  if (!historialAdmision) {
    return;
  }

  if (
    !Array.isArray(historial) ||
    !historial.length
  ) {

    historialAdmision.innerHTML = `
      <p class="admision-vacio">
        Todavía no se registraron movimientos.
      </p>
    `;

    return;

  }

  const movimientosOrdenados =
    [...historial].sort((a, b) => {

      const fechaA =
        convertirFecha(a?.fecha)?.getTime() || 0;

      const fechaB =
        convertirFecha(b?.fecha)?.getTime() || 0;

      return fechaB - fechaA;

    });

  historialAdmision.innerHTML =
    movimientosOrdenados
      .map(movimiento => {

        const estadoAnterior =
          movimiento.estadoAnterior
            ? textoEstado(
                normalizarEstadoAdmision(
                  movimiento.estadoAnterior
                )
              )
            : "";

        const estadoNuevo =
          movimiento.estadoNuevo
            ? textoEstado(
                normalizarEstadoAdmision(
                  movimiento.estadoNuevo
                )
              )
            : "";

        const usuario =
          textoSeguro(
            movimiento.usuarioNombre ||
            movimiento.usuarioEmail,
            "Usuario administrador"
          );

        const observacion =
          textoSeguro(
            movimiento.observacion,
            ""
          );

        return `
          <article class="admision-historial-item">

            <div class="admision-historial-fecha">
              ${escaparHTML(
                formatearFecha(movimiento.fecha)
              )}
            </div>

            <div class="admision-historial-contenido">

              <strong>
                ${
                  estadoAnterior &&
                  estadoAnterior !== estadoNuevo
                    ? `${escaparHTML(estadoAnterior)} → ${escaparHTML(estadoNuevo)}`
                    : `Actualización: ${escaparHTML(estadoNuevo || "Seguimiento")}`
                }
              </strong>

              <span>
                Realizado por ${escaparHTML(usuario)}
              </span>

              ${
                observacion
                  ? `
                    <p>
                      ${escaparHTML(observacion)}
                    </p>
                  `
                  : ""
              }

            </div>

          </article>
        `;

      })
      .join("");

}



/* =========================================================
   RENDER
========================================================= */

function renderizarAdmision(data) {

  admisionActual = data;

  const referencia =
    textoSeguro(
      data.id ||
      data.referencia ||
      admisionId
    );

  const estado =
    normalizarEstado(data.estado);

  const nombre =
    obtenerNombre(data);

  const email =
    obtenerEmail(data);

  const telefono =
    obtenerTelefono(data);

  const perfil =
    obtenerPerfil(data);

  const tipoUsuario =
    textoSeguro(
      data.tipoUsuario ||
      data.tipo ||
      perfil
    );

  const fecha =
    obtenerFecha(data);

  const documentos =
    obtenerDocumentos(data);


  detalleReferencia.textContent =
    referencia;

  datoReferencia.textContent =
    referencia;

  datoFecha.textContent =
    formatearFecha(fecha);

  datoPerfil.textContent =
    perfil;

  datoEstado.textContent =
    textoEstado(estado);

  datoNombre.textContent =
    nombre;

  datoEmail.textContent =
    email || "No informado";

  datoTelefono.textContent =
    telefono || "No informado";

  datoTipoUsuario.textContent =
    tipoUsuario;


  estadoAdmisionBadge.textContent =
    textoEstado(estado);

  estadoAdmisionBadge.className =
    `admision-estado ${claseEstado(estado)}`;


  selectorEstadoAdmision.value =
    selectorEstadoAdmision.querySelector(
      `option[value="${estado}"]`
    )
      ? estado
      : "completada";


  observacionesInternas.value =
    data.revision?.observaciones ||
    data.observacionesInternas ||
    "";


  configurarContacto(
    email,
    telefono,
    referencia
  );

  renderizarDocumentos(documentos);
  renderizarRespuestas(data);

  actualizarAccionesEcosistema(estado);

  actualizarWorkflowAdmision();

renderizarHistorial(
  data.historial || []
);



  estadoCarga.hidden = true;
  errorAdmision.hidden = true;
  contenidoAdmision.hidden = false;

}


/* =========================================================
   AUTORIZACIÓN
========================================================= */

async function esAdministrador(user) {

  if (!user) return false;

  const usuarioRef =
    doc(db, "usuarios", user.uid);

  const usuarioSnap =
    await getDoc(usuarioRef);

  if (!usuarioSnap.exists()) {
    return false;
  }

  const rol =
    normalizarTexto(
      usuarioSnap.data().rol
    );

  const email =
    normalizarTexto(user.email);

  return (
    rol === "admin" ||
    rol === "administrador" ||
    email ===
      "estudiopericialpsicologico@gmail.com"
  );

}


/* =========================================================
   CARGA
========================================================= */

async function cargarAdmision() {

  const referencia =
    doc(
      db,
      COLECCION_ADMISIONES,
      admisionId
    );

  const snapshot =
    await getDoc(referencia);

  if (!snapshot.exists()) {

    throw new Error(
      "La admisión solicitada no existe."
    );

  }

  renderizarAdmision({
    id: snapshot.id,
    ...snapshot.data()
  });

}


/* =========================================================
   GUARDADO
========================================================= */

async function guardarSeguimiento() {

  if (!admisionId || !admisionActual) {
    return;
  }

  btnGuardarSeguimiento.disabled = true;
  btnGuardarSeguimiento.textContent =
    "Guardando...";

  mensajeGuardado.textContent = "";

  try {

    const nuevoEstado =
      selectorEstadoAdmision.value;

    const observaciones =
      observacionesInternas.value.trim();

const estadoAnterior =
  normalizarEstadoAdmision(
    admisionActual.estado || "completada"
  );

const fechaMovimiento =
  Timestamp.now();

const movimientoHistorial = {
  tipo: "seguimiento_actualizado",

  estadoAnterior,

  estadoNuevo: nuevoEstado,

  observacion: observaciones,

  fecha: fechaMovimiento,

  usuarioEmail:
    auth.currentUser?.email || "",

  usuarioUID:
    auth.currentUser?.uid || "",

  usuarioNombre:
    auth.currentUser?.displayName || ""
};


    const referencia =
      doc(
        db,
        COLECCION_ADMISIONES,
        admisionId
      );

   await updateDoc(
  referencia,
  {
    estado: nuevoEstado,

    revision: {
      ...(admisionActual.revision || {}),

      estado:
        nuevoEstado === "completada"
          ? "sin_revisar"
          : nuevoEstado,

      revisado:
        nuevoEstado !== "completada",

      observaciones,

      actualizadoEn:
        serverTimestamp(),

      revisadoPor:
        auth.currentUser?.email || "",

      revisadoPorUID:
        auth.currentUser?.uid || "",

      revisadoPorNombre:
        auth.currentUser?.displayName || ""
    },

    actualizadoEn:
      serverTimestamp(),

    estadoActualizadoEn:
      serverTimestamp(),

    estadoActualizadoPor:
      auth.currentUser?.email || "",

    estadoActualizadoPorUID:
      auth.currentUser?.uid || "",


      historial:
  arrayUnion(movimientoHistorial)
  }
);

    admisionActual.estado =
      nuevoEstado;

    admisionActual.revision = {
      ...(admisionActual.revision || {}),
      estado:
        nuevoEstado === "completada"
          ? "sin_revisar"
          : nuevoEstado,
      revisado:
        nuevoEstado !== "completada",
      observaciones
    };


admisionActual.historial = [
  ...(admisionActual.historial || []),
  movimientoHistorial
];

renderizarHistorial(
  admisionActual.historial
);



    datoEstado.textContent =
      textoEstado(nuevoEstado);

    estadoAdmisionBadge.textContent =
      textoEstado(nuevoEstado);

    estadoAdmisionBadge.className =
      `admision-estado ${claseEstado(nuevoEstado)}`;

actualizarAccionesEcosistema(
  nuevoEstado
);


actualizarWorkflowAdmision();


    mensajeGuardado.textContent =
      "Cambios guardados correctamente.";

    console.log(
      "FALCO Admisión™ actualizada:",
      admisionId
    );

  } catch (error) {

    console.error(
      "Error al guardar seguimiento:",
      error
    );

    mensajeGuardado.textContent =
      "No se pudieron guardar los cambios.";

  } finally {

    btnGuardarSeguimiento.disabled = false;
    btnGuardarSeguimiento.textContent =
      "Guardar cambios";

  }

}


/* =========================================================
   ERROR
========================================================= */

function mostrarError(error) {

  console.error(
    "Error al abrir admisión:",
    error
  );

  estadoCarga.hidden = true;
  contenidoAdmision.hidden = true;
  errorAdmision.hidden = false;

  errorAdmisionTexto.textContent =
    error?.message ||
    "La solicitud no pudo ser recuperada.";

}


/* =========================================================
   EVENTOS
========================================================= */

btnGuardarSeguimiento.addEventListener(
  "click",
  guardarSeguimiento
);


btnCrearTurno.addEventListener(
  "click",
  abrirCreacionTurno
);


/* =========================================================
   INICIO
========================================================= */

const parametros =
  new URLSearchParams(
    window.location.search
  );

admisionId =
  parametros.get("id") || "";


if (!admisionId) {

  mostrarError(
    new Error(
      "No se recibió el identificador de la admisión."
    )
  );

} else {

  onAuthStateChanged(
    auth,
    async user => {

      if (!user) {

        window.location.href =
          "login.html";

        return;

      }

      try {

        const autorizado =
          await esAdministrador(user);

        if (!autorizado) {

          throw new Error(
            "No tiene permisos para consultar esta admisión."
          );

        }

        await cargarAdmision();

      } catch (error) {

        mostrarError(error);

      }

    }
  );

}


/* =========================================================
   RESPUESTAS DEL ESTUDIO
========================================================= */

const selectorRespuesta =
    document.getElementById("selectorRespuestaRapida");

const textoRespuesta =
    document.getElementById("textoRespuestaRapida");

const btnPrepararWhatsApp =
    document.getElementById("btnPrepararWhatsApp");

if (selectorRespuesta && textoRespuesta && btnPrepararWhatsApp) {

    selectorRespuesta.addEventListener("change", () => {

        textoRespuesta.value =
            generarRespuesta(selectorRespuesta.value);

    });

    btnPrepararWhatsApp.addEventListener("click", () => {

        const telefono =
            document.getElementById("datoTelefono")?.textContent.trim();

        if (!telefono || telefono === "—") {

            alert("La admisión no posee un teléfono registrado.");

            return;

        }

        const mensaje =
            textoRespuesta.value;

        if (!mensaje) {

            alert("Seleccione primero un tipo de respuesta.");

            return;

        }

        const numero =
            telefono.replace(/\D/g, "");

        window.open(
            `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );

    });

}

function generarRespuesta(tipo) {

    switch (tipo) {

        case "entrevista":

            return `Hola.

Muchas gracias por comunicarse con el Estudio Pericial Psicológico FALCO®.

Hemos recibido su consulta.

En todos los casos aconsejamos realizar una entrevista inicial para conocer las características de la situación planteada y poder orientarlo adecuadamente.

El valor actual de la entrevista inicial es de $80.000.

Quedamos atentos a su respuesta.

Saludos cordiales.

Estudio Pericial Psicológico FALCO®`;

        case "supervision":

            return `Hola.

Muchas gracias por comunicarse con el Estudio Pericial Psicológico FALCO®.

El servicio de supervisión profesional tiene una duración aproximada de una hora y media.

El valor actual es de $80.000.

Antes de comenzar, aconsejamos realizar una entrevista inicial para conocer sus necesidades y planificar el trabajo.

Quedamos atentos a su respuesta.

Saludos cordiales.

Estudio Pericial Psicológico FALCO®`;

        case "psicodiagnostico":

            return `Hola.

Muchas gracias por comunicarse con el Estudio Pericial Psicológico FALCO®.

El valor de los psicodiagnósticos parte desde $500.000, dependiendo del tipo de evaluación solicitada.

Previamente aconsejamos realizar una entrevista inicial, cuyo valor actual es de $80.000.

Quedamos atentos a su respuesta.

Saludos cordiales.

Estudio Pericial Psicológico FALCO®`;

        default:

            return "";

    }

}