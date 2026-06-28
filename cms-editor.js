console.log("cms-editor.js cargado");

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { actualizarVistaPreviaRecurso } from "./cms-preview.js";
import { validarFormularioRecurso } from "./cms-validaciones.js";

let recursoEditandoId = null;

export function inicializarEditorCMS({
  db,
  getContenidos,
  cargarContenidos
}) {
  const btnGuardar = document.getElementById("btnGuardarRecurso");
  const mensaje = document.getElementById("mensajeRecurso");

  const camposFormularioRecurso = [
    "recursoTitulo",
    "recursoDescripcion",
    "recursoModulo",
    "recursoTipoContenido",
    "recursoFuero",
    "recursoTipoEscrito",
    "recursoUrlPdf",
    "recursoUrlWord",
    "recursoUrlVideo",
    "recursoTags",
    "recursoNivelAcceso"
  ];

  btnGuardar?.addEventListener("click", () => {
    guardarRecurso({ db, cargarContenidos });
  });

  camposFormularioRecurso.forEach(id => {
    document.getElementById(id)?.addEventListener("input", actualizarEstadoBotonGuardar);
    document.getElementById(id)?.addEventListener("change", actualizarEstadoBotonGuardar);
  });

  window.editarContenido = function(id) {
   editarContenido({
  id,
  getContenidos,
  btnGuardar,
  mensaje
});
  };

  actualizarEstadoBotonGuardar();
}

function actualizarEstadoBotonGuardar() {
  const btnGuardar = document.getElementById("btnGuardarRecurso");
  if (!btnGuardar) return;

  const titulo = document.getElementById("recursoTitulo")?.value.trim();
  const descripcion = document.getElementById("recursoDescripcion")?.value.trim();
  const modulo = document.getElementById("recursoModulo")?.value;
  const tipoContenido = document.getElementById("recursoTipoContenido")?.value;
  const fuero = document.getElementById("recursoFuero")?.value.trim();

  const urlPdf = document.getElementById("recursoUrlPdf")?.value.trim();
  const urlWord = document.getElementById("recursoUrlWord")?.value.trim();
  const urlVideo = document.getElementById("recursoUrlVideo")?.value.trim();

  const tags = document.getElementById("recursoTags")?.value.trim();
  const nivelAcceso = document.getElementById("recursoNivelAcceso")?.value;

  const archivoOk = Boolean(urlPdf || urlWord || urlVideo);

  const formularioCompleto =
    Boolean(titulo) &&
    Boolean(descripcion) &&
    Boolean(modulo) &&
    Boolean(tipoContenido) &&
    Boolean(fuero) &&
    archivoOk &&
    Boolean(tags) &&
    Boolean(nivelAcceso);

  btnGuardar.disabled = !formularioCompleto;

  actualizarVistaPreviaRecurso();
}

async function guardarRecurso({ db, cargarContenidos }) {
  const btnGuardar = document.getElementById("btnGuardarRecurso");
  const mensaje = document.getElementById("mensajeRecurso");

  try {
    const recurso = {
      titulo: document.getElementById("recursoTitulo").value.trim(),
      descripcion: document.getElementById("recursoDescripcion").value.trim(),
      modulo: document.getElementById("recursoModulo").value,
      tipoContenido: document.getElementById("recursoTipoContenido").value,
      fuero: document.getElementById("recursoFuero").value.trim(),
      tipoEscrito: document.getElementById("recursoTipoEscrito").value.trim(),

      categoria: document.getElementById("recursoFuero").value.trim(),
      subcategoria: document.getElementById("recursoTipoEscrito").value.trim(),
      autor: "Lic. Isabela Falco",

      tipo: document.getElementById("recursoTipo")?.value || "pdf",
      icono: document.getElementById("recursoIcono")?.value || "documento",

      fechaActualizacion: "Junio 2026",

      nivelAcceso:
        document.getElementById("recursoNivelAcceso")?.value || "biblioteca",

      destacado:
        document.getElementById("recursoDestacado")?.value === "true",

      activo:
        document.getElementById("recursoActivo")?.value === "true",

      urlPdf: document.getElementById("recursoUrlPdf").value.trim(),
      urlWord: document.getElementById("recursoUrlWord").value.trim(),
      urlVideo: document.getElementById("recursoUrlVideo").value.trim(),

      tags: document.getElementById("recursoTags").value.trim(),

      palabrasClave: document
        .getElementById("recursoTags")
        .value
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),

      rolesPermitidos: ["biblioteca", "profesional", "perito", "admin"],

      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp()
    };

    const validacion = validarFormularioRecurso(recurso);

    if (!validacion.ok) {
      mensaje.textContent = validacion.mensaje;

      document.getElementById("nuevo-recurso")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (validacion.campo) {
        validacion.campo.focus();
        validacion.campo.classList.add("input-error");

        setTimeout(() => {
          validacion.campo.classList.remove("input-error");
        }, 1800);
      }

      return;
    }

    if (recursoEditandoId) {
      await updateDoc(doc(db, "contenidos", recursoEditandoId), {
        ...recurso,
        actualizadoEn: serverTimestamp()
      });

      mensaje.textContent = "Recurso actualizado correctamente.";
      recursoEditandoId = null;
      btnGuardar.textContent = "Guardar recurso";

    } else {
      await addDoc(collection(db, "contenidos"), recurso);
      mensaje.textContent = "Recurso guardado correctamente.";
    }

    limpiarFormulario();

    await cargarContenidos();

  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al guardar el recurso.";
  }
}

function editarContenido({
  id,
  getContenidos,
  btnGuardar,
  mensaje
}) {
  const recurso = getContenidos().find(item => item.id === id);

  if (!recurso) {
    alert("No se encontró el recurso.");
    return;
  }

  recursoEditandoId = id;

  const inputTitulo = document.querySelector('input[id="recursoTitulo"]');
  const inputDescripcion = document.querySelector('textarea[id="recursoDescripcion"]');

  if (!inputTitulo || !inputDescripcion) {
    alert("No se encontraron los campos del formulario.");
    return;
  }

  inputTitulo.value = recurso.titulo || "";
  inputDescripcion.value = recurso.descripcion || "";

  document.getElementById("recursoModulo").value =
    recurso.modulo || "escritos";

  document.getElementById("recursoTipoContenido").value =
    recurso.tipoContenido || "escrito";

  document.getElementById("recursoFuero").value = recurso.fuero || "";
  document.getElementById("recursoTipoEscrito").value = recurso.tipoEscrito || "";

  document.getElementById("recursoUrlPdf").value = recurso.urlPdf || "";
  document.getElementById("recursoUrlWord").value = recurso.urlWord || "";
  document.getElementById("recursoUrlVideo").value = recurso.urlVideo || "";

  document.getElementById("recursoTags").value =
    Array.isArray(recurso.palabrasClave)
      ? recurso.palabrasClave.join(", ")
      : recurso.tags || "";

  document.getElementById("recursoActivo").value =
    recurso.activo ? "true" : "false";

  document.getElementById("recursoDestacado").value =
    recurso.destacado ? "true" : "false";

  document.getElementById("recursoNivelAcceso").value =
    recurso.nivelAcceso || "biblioteca";

  btnGuardar.textContent = "Guardar cambios";
  mensaje.textContent = "Editando recurso existente.";

  actualizarEstadoBotonGuardar();

  document.getElementById("recursoTitulo").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function limpiarFormulario() {
  document.getElementById("recursoTitulo").value = "";
  document.getElementById("recursoDescripcion").value = "";
  document.getElementById("recursoModulo").value = "";
  document.getElementById("recursoTipoContenido").value = "";
  document.getElementById("recursoFuero").value = "";
  document.getElementById("recursoTipoEscrito").value = "";
  document.getElementById("recursoUrlPdf").value = "";
  document.getElementById("recursoUrlWord").value = "";
  document.getElementById("recursoUrlVideo").value = "";
  document.getElementById("recursoTags").value = "";

  document.getElementById("recursoActivo").value = "true";
  document.getElementById("recursoDestacado").value = "false";
  document.getElementById("recursoNivelAcceso").value = "biblioteca";

  recursoEditandoId = null;

  const btnGuardar = document.getElementById("btnGuardarRecurso");
  const mensaje = document.getElementById("mensajeRecurso");

  btnGuardar.textContent = "Guardar recurso";
  mensaje.textContent = "";

  actualizarEstadoBotonGuardar();
}