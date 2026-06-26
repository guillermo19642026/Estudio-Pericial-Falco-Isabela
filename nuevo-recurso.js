import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("📝 Nuevo Recurso cargado");

const btnGuardar =
  document.getElementById("btnGuardarRecurso");

const mensaje =
  document.getElementById("mensajeRecurso");

btnGuardar?.addEventListener("click", guardarRecurso);

async function guardarRecurso() {

  try {

    const recurso = {

      titulo:
        document.getElementById("recursoTitulo").value.trim(),

      descripcion:
        document.getElementById("recursoDescripcion").value.trim(),

      modulo:
        document.getElementById("recursoModulo").value,

      tipoContenido:
        document.getElementById("recursoTipoContenido").value,

      fuero:
        document.getElementById("recursoFuero").value.trim(),

      tipoEscrito:
        document.getElementById("recursoTipoEscrito").value.trim(),

        categoria:
  document.getElementById("recursoFuero").value.trim(),

subcategoria:
  document.getElementById("recursoTipoEscrito").value.trim(),

autor:
  "Lic. Isabela Falco",

tipo:
  "pdf",

icono:
  "📄",

fechaActualizacion:
  "Junio 2026",

rolesPermitidos:
  ["biblioteca", "profesional", "perito", "admin"],

destacado:
  false,

      urlPdf:
        document.getElementById("recursoUrlPdf").value.trim(),

      urlWord:
        document.getElementById("recursoUrlWord").value.trim(),

      urlVideo:
        document.getElementById("recursoUrlVideo").value.trim(),

      palabrasClave:
        document.getElementById("recursoTags")
          .value
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),

      activo: true,

      creadoEn: serverTimestamp()

    };


if (!recurso.titulo || !recurso.descripcion || !recurso.modulo || !recurso.tipoContenido) {
  mensaje.textContent = "⚠️ Completá título, descripción, módulo y tipo de contenido.";
  return;
}


    await addDoc(
      collection(db, "contenidos"),
      recurso
    );

    mensaje.textContent =
      "✅ Recurso guardado correctamente.";

    console.log(recurso);

  }

  catch(error){

    console.error(error);

    mensaje.textContent =
      "❌ Error al guardar.";

  }

}