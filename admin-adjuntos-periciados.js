import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaAdjuntos");

async function cargarAdjuntos() {
  try {
    const snap = await getDocs(collection(db, "documentos_periciados"));

    tabla.innerHTML = "";

    let encontrados = 0;

    snap.forEach(docSnap => {
      const data = docSnap.data();

      const tieneAdjuntos =
        data.dniFrente?.url ||
        data.dniDorso?.url ||
        (data.certificados && data.certificados.length > 0);

      if (!tieneAdjuntos) return;

      encontrados++;

      const fecha = data.fechaCargaAdjuntos
        ? new Date(data.fechaCargaAdjuntos).toLocaleString("es-AR")
        : "-";

      const completo =
        data.dniFrente?.url && data.dniDorso?.url
          ? "Completo"
          : "Incompleto";

      const certificadosHtml = data.certificados?.length
        ? data.certificados.map((c, i) => `
            <a href="${c.url}" target="_blank">Certificado ${i + 1}</a>
          `).join("<br>")
        : "-";

      tabla.innerHTML += `
        <tr>
          <td>${fecha}</td>
          <td>${data.usuarioEmail || "-"}</td>
          <td>${completo}</td>
          <td>${data.dniFrente?.url ? `<a href="${data.dniFrente.url}" target="_blank">👁 Ver</a>` : "-"}</td>
          <td>${data.dniDorso?.url ? `<a href="${data.dniDorso.url}" target="_blank">👁 Ver</a>` : "-"}</td>
          <td>${certificadosHtml}</td>
          <td>
            <button onclick="guardarLinks('${docSnap.id}')">
              💾 Guardar
            </button>
          </td>
          <td>
            <button onclick="eliminarAdjunto('${docSnap.id}')">
              🗑 Eliminar
            </button>
          </td>
        </tr>
      `;
    });

    if (encontrados === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="8">No existen adjuntos cargados.</td>
        </tr>
      `;
    }

  } catch (error) {
    console.error(error);
    tabla.innerHTML = `
      <tr>
        <td colspan="8">Error al cargar documentos.</td>
      </tr>
    `;
  }
}

window.eliminarAdjunto = async function(id) {
  const confirma = confirm("¿Eliminar este registro de adjuntos?");
  if (!confirma) return;

  await deleteDoc(doc(db, "documentos_periciados", id));
  alert("Registro eliminado.");
  cargarAdjuntos();
};

window.guardarLinks = function(id) {
  alert("Para guardar los archivos, abrí cada documento y descargalo desde Cloudinary.");
};

cargarAdjuntos();