import { db } from "./firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaDocumentos");
const estado = document.getElementById("estadoDocumentos");
const buscar = document.getElementById("buscarDocumento");
const filtroTipo = document.getElementById("filtroTipoDocumento");

let documentos = [];

function formatearFecha(timestamp) {
  if (!timestamp || !timestamp.toDate) return "—";

  return timestamp.toDate().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function nombreTipo(tipo) {
  if (tipo === "consentimiento_informado") return "Consentimiento informado";
  if (tipo === "constancia_tratamiento") return "Constancia de tratamiento";
  return tipo || "—";
}

function datosExtra(docu) {
  if (docu.tipo === "consentimiento_informado") {
    return `
      <strong>Ordenado por:</strong> ${docu.ordenadoPor || "—"}<br>
      <strong>Aceptado:</strong> ${docu.aceptado ? "Sí" : "No"}
    `;
  }

  if (docu.tipo === "constancia_tratamiento") {
    return `
      <strong>Tratamiento:</strong> ${docu.enTratamiento || "—"}<br>
      <strong>Tipo:</strong> ${docu.tipoTratamiento || "—"}<br>
      <strong>Medicación:</strong> ${docu.medicacion || "—"}<br>
      <strong>Profesional:</strong> ${docu.profesional || "—"}<br>
      <strong>Constancia:</strong>
      ${
        docu.constancia
          ? `<a href="${docu.constancia}" target="_blank">Abrir</a>`
          : "—"
      }<br>
      <strong>Observaciones:</strong> ${docu.observaciones || "—"}
    `;
  }

  return "—";
}

function filtrarDocumentos() {
  const texto = buscar.value.toLowerCase().trim();
  const tipo = filtroTipo.value;

  return documentos.filter(docu => {
    const coincideTipo = !tipo || docu.tipo === tipo;

    const contenido = `
      ${docu.nombre || ""}
      ${docu.dni || ""}
      ${docu.tipo || ""}
      ${docu.firma || ""}
      ${docu.usuarioEmail || ""}
    `.toLowerCase();

    const coincideTexto = !texto || contenido.includes(texto);

    return coincideTipo && coincideTexto;
  });
}

function renderDocumentos() {
  tabla.innerHTML = "";

  const filtrados = filtrarDocumentos();

  estado.textContent = `Documentos encontrados: ${filtrados.length}`;

  if (filtrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="10">No hay documentos para mostrar.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(docu => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(docu.creadoEn)}</td>
      <td>${nombreTipo(docu.tipo)}</td>
      <td>${docu.nombre || "—"}</td>
      <td>${docu.dni || "—"}</td>
      <td>${docu.firma || "—"}</td>




      <td>${docu.fotoDni
      ? `<a href="${docu.fotoDni}" target="_blank">Abrir DNI</a>`
      : docu.fotoDniNombre || "—"}</td>

<td>${datosExtra(docu)}</td>

<td>
  <button onclick='generarPDFDocumento(${JSON.stringify(docu)})'>
    Ver PDF
  </button>
</td>



<td>
  <button onclick="eliminarDocumento('${docu.id}')">
    Eliminar
  </button>
</td>
    `;

    tabla.appendChild(fila);
  });
}

window.eliminarDocumento = async function(id) {
  if (!confirm("¿Eliminar este documento?")) return;

  try {
    await deleteDoc(doc(db, "documentos_periciados", id));
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el documento.");
  }
};

window.limpiarFiltrosDocumentos = function() {
  buscar.value = "";
  filtroTipo.value = "";
  renderDocumentos();
};

buscar.addEventListener("input", renderDocumentos);
filtroTipo.addEventListener("change", renderDocumentos);

const q = query(
  collection(db, "documentos_periciados"),
  orderBy("creadoEn", "desc")
);

onSnapshot(q, (snapshot) => {
  documentos = [];

  snapshot.forEach(docSnap => {
    documentos.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  renderDocumentos();
});