import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaMesa");
const estado = document.getElementById("estadoMesa");
const detalle = document.getElementById("detalleMesa");
const detalleContenido = document.getElementById("detalleMesaContenido");

const buscarMesa = document.getElementById("buscarMesa");
const filtroMesaEstado = document.getElementById("filtroMesaEstado");

let presentaciones = [];

async function cargarMesa() {
  try {
    const q = query(
      collection(db, "mesa_entrada"),
      orderBy("creadoEn", "desc")
    );

    const snapshot = await getDocs(q);

    presentaciones = [];

    snapshot.forEach(docSnap => {
      presentaciones.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderMesa();

  } catch (error) {
    console.error(error);
    estado.textContent = "No se pudieron cargar las presentaciones.";
  }
}

function formatearFecha(timestamp) {
  if (!timestamp || !timestamp.toDate) return "—";

  return timestamp.toDate().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function badgeMesa(valor) {
  const estado = (valor || "recibido").toLowerCase();

  let clase = "badge-medio";

  if (estado === "recibido") clase = "badge-medio";
  if (estado === "en revisión") clase = "badge-bajo";
  if (estado === "respondido") clase = "badge-bajo";
  if (estado === "archivado") clase = "badge-alto";

  return `<span class="badge-estado ${clase}">${estado}</span>`;
}

function obtenerMesaFiltrada() {
  const texto = buscarMesa.value.toLowerCase().trim();
  const estadoSeleccionado = filtroMesaEstado.value.toLowerCase();

  return presentaciones.filter(p => {
    const nombre = (p.nombre || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const caratula = (p.caratula || "").toLowerCase();
    const tipo = (p.tipo || "").toLowerCase();
    const estadoDoc = (p.estado || "").toLowerCase();

    const coincideTexto =
      !texto ||
      nombre.includes(texto) ||
      email.includes(texto) ||
      caratula.includes(texto) ||
      tipo.includes(texto);

    const coincideEstado =
      !estadoSeleccionado ||
      estadoDoc === estadoSeleccionado;

    return coincideTexto && coincideEstado;
  });
}

function renderMesa() {
  tabla.innerHTML = "";

  const filtradas = obtenerMesaFiltrada();

  estado.textContent = `Presentaciones encontradas: ${filtradas.length}`;

  if (filtradas.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="9">No hay presentaciones para los filtros seleccionados.</td>
      </tr>
    `;
    return;
  }

  filtradas.forEach(p => {
    const indexOriginal = presentaciones.findIndex(item => item.id === p.id);

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(p.creadoEn)}</td>
      <td>${p.tipo || "—"}</td>
      <td>${p.nombre || "—"}</td>
      <td>${p.email || "—"}</td>
      <td>${p.caratula || "—"}</td>
      <td>${badgeMesa(p.estado)}</td>
      <td>
        ${p.documentos ? `<a href="${p.documentos}" target="_blank">Abrir</a>` : "—"}
      </td>
      <td>
        <button onclick="verMesa(${indexOriginal})">Ver</button>
      </td>
      <td>
        <button onclick="eliminarMesa('${p.id}')">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

window.verMesa = function(index) {
  const p = presentaciones[index];

  detalle.style.display = "block";

  detalleContenido.innerHTML = `
    <div class="detalle-grid">
      <p><strong>Tipo:</strong> ${p.tipo || "—"}</p>
      <p><strong>Nombre:</strong> ${p.nombre || "—"}</p>
      <p><strong>Email:</strong> ${p.email || "—"}</p>
      <p><strong>Teléfono:</strong> ${p.telefono || "—"}</p>
      <p><strong>Carátula:</strong> ${p.caratula || "—"}</p>
      <p><strong>Estado:</strong> ${badgeMesa(p.estado)}</p>
      <p><strong>Fecha:</strong> ${formatearFecha(p.creadoEn)}</p>
      <p><strong>Documentos:</strong> ${p.documentos ? `<a href="${p.documentos}" target="_blank">Abrir documentación</a>` : "No adjuntado"}</p>
    </div>

    <h3>Detalle / Presentación</h3>
    <p>${p.mensaje || "—"}</p>

    <h3>Cambiar estado</h3>
    <div class="estado-actions">
      <button onclick="cambiarEstadoMesa('${p.id}', 'recibido')">Recibido</button>
      <button onclick="cambiarEstadoMesa('${p.id}', 'en revisión')">En revisión</button>
      <button onclick="cambiarEstadoMesa('${p.id}', 'respondido')">Respondido</button>
      <button onclick="cambiarEstadoMesa('${p.id}', 'archivado')">Archivado</button>
    </div>
  `;

  detalle.scrollIntoView({ behavior: "smooth" });
};

window.cambiarEstadoMesa = async function(id, nuevoEstado) {
  try {
    await updateDoc(doc(db, "mesa_entrada", id), {
      estado: nuevoEstado
    });

    await cargarMesa();
    detalle.style.display = "none";

  } catch (error) {
    console.error(error);
    alert("No se pudo cambiar el estado.");
  }
};

window.eliminarMesa = async function(id) {
  if (!confirm("¿Eliminar esta presentación?")) return;

  try {
    await deleteDoc(doc(db, "mesa_entrada", id));
    await cargarMesa();
    detalle.style.display = "none";

  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la presentación.");
  }
};

window.limpiarFiltrosMesa = function() {
  buscarMesa.value = "";
  filtroMesaEstado.value = "";
  renderMesa();
};

window.exportarMesaCSV = function() {
  const filas = obtenerMesaFiltrada();

  let csv = "Fecha,Tipo,Nombre,Email,Teléfono,Carátula,Estado,Documentos,Mensaje\n";

  filas.forEach(p => {
    csv += `"${formatearFecha(p.creadoEn)}","${p.tipo || ""}","${p.nombre || ""}","${p.email || ""}","${p.telefono || ""}","${p.caratula || ""}","${p.estado || "recibido"}","${p.documentos || ""}","${p.mensaje || ""}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "mesa_entrada.csv";
  enlace.click();

  URL.revokeObjectURL(url);
};

buscarMesa.addEventListener("input", renderMesa);
filtroMesaEstado.addEventListener("change", renderMesa);

cargarMesa();