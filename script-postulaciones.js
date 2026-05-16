import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaPostulaciones");
const estado = document.getElementById("estadoPostulaciones");
const detalle = document.getElementById("detallePostulacion");
const detalleContenido = document.getElementById("detallePostulacionContenido");

const buscarPostulante = document.getElementById("buscarPostulante");
const filtroEstado = document.getElementById("filtroEstado");

let postulaciones = [];

async function cargarPostulaciones() {
  try {
    const q = query(
      collection(db, "postulaciones"),
      orderBy("creadoEn", "desc")
    );

    const snapshot = await getDocs(q);

    postulaciones = [];

    snapshot.forEach(doc => {
      postulaciones.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderPostulaciones();

  } catch (error) {
    console.error(error);
    estado.textContent = "No se pudieron cargar las postulaciones.";
  }
}

function formatearFecha(timestamp) {
  if (!timestamp || !timestamp.toDate) return "—";

  return timestamp.toDate().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function badgeEstado(valor) {
  const estado = (valor || "pendiente").toLowerCase();

  let clase = "badge-medio";

  if (estado === "pendiente") clase = "badge-medio";
  if (estado === "contactado") clase = "badge-bajo";
  if (estado === "descartado") clase = "badge-alto";

  return `<span class="badge-nivel ${clase}">${estado}</span>`;
}

function obtenerPostulacionesFiltradas() {
  const texto = buscarPostulante.value.toLowerCase().trim();
  const estadoSeleccionado = filtroEstado.value.toLowerCase();

  return postulaciones.filter(p => {
    const nombre = (p.nombre || "").toLowerCase();
    const profesion = (p.profesion || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const estadoPost = (p.estado || "").toLowerCase();

    const coincideTexto =
      !texto ||
      nombre.includes(texto) ||
      profesion.includes(texto) ||
      email.includes(texto);

    const coincideEstado =
      !estadoSeleccionado ||
      estadoPost === estadoSeleccionado;

    return coincideTexto && coincideEstado;
  });
}

function renderPostulaciones() {
  tabla.innerHTML = "";

  const filtradas = obtenerPostulacionesFiltradas();

  estado.textContent = `Postulaciones encontradas: ${filtradas.length}`;

  if (filtradas.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="7">No hay postulaciones para los filtros seleccionados.</td>
      </tr>
    `;
    return;
  }

  filtradas.forEach(p => {
    const indexOriginal = postulaciones.findIndex(item => item.id === p.id);

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(p.creadoEn)}</td>
      <td>${p.nombre || "—"}</td>
      <td>${p.profesion || "—"}</td>
      <td>${p.email || "—"}</td>
      <td>${p.telefono || "—"}</td>
      <td>${badgeEstado(p.estado)}</td>
      <td>
        <button onclick="verPostulacion(${indexOriginal})">Ver</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

window.verPostulacion = function(index) {
  const p = postulaciones[index];

  detalle.style.display = "block";

  detalleContenido.innerHTML = `
    <div class="detalle-grid">
      <p><strong>Nombre:</strong> ${p.nombre || "—"}</p>
      <p><strong>Profesión:</strong> ${p.profesion || "—"}</p>
      <p><strong>Email:</strong> ${p.email || "—"}</p>
      <p><strong>Teléfono:</strong> ${p.telefono || "—"}</p>
      <p><strong>Estado:</strong> ${p.estado || "pendiente"}</p>
      <p><strong>Fecha:</strong> ${formatearFecha(p.creadoEn)}</p>
    </div>

    <h3>Antecedentes / Mensaje</h3>
    <p>${p.mensaje || "—"}</p>
  `;

  detalle.scrollIntoView({ behavior: "smooth" });
};

window.limpiarFiltrosPostulaciones = function() {
  buscarPostulante.value = "";
  filtroEstado.value = "";
  renderPostulaciones();
};

buscarPostulante.addEventListener("input", renderPostulaciones);
filtroEstado.addEventListener("change", renderPostulaciones);

cargarPostulaciones();