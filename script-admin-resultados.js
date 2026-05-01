import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaResultadosAdmin");
const estado = document.getElementById("estadoCargaAdmin");
const detalle = document.getElementById("detalleResultado");
const detalleContenido = document.getElementById("detalleContenido");

let resultados = [];

async function cargarResultados() {
  try {
    const q = query(
      collection(db, "resultados_tests"),
      orderBy("creadoEn", "desc")
    );

    const snapshot = await getDocs(q);

    resultados = [];

    snapshot.forEach(doc => {
      resultados.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderTabla();

  } catch (error) {
    console.error(error);
    estado.textContent = "No se pudieron cargar los resultados.";
  }
}

function formatearFecha(timestamp) {
  if (!timestamp || !timestamp.toDate) return "—";

  return timestamp.toDate().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function renderTabla() {
  tabla.innerHTML = "";

  if (resultados.length === 0) {
    estado.textContent = "No hay resultados guardados.";
    return;
  }

  estado.textContent = `Resultados encontrados: ${resultados.length}`;

  resultados.forEach((r, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(r.creadoEn)}</td>
      <td>${r.nombre || "Sin nombre"}</td>
      <td>${r.test || "—"}</td>
      <td>${r.puntajeTotal ?? r.total ?? "—"}</td>
      <td>${r.nivel || "—"}</td>
      <td>
        <button onclick="verDetalle(${index})">Ver</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

window.verDetalle = function(index) {
  const r = resultados[index];

  detalle.style.display = "block";

  detalleContenido.innerHTML = `
    <p><strong>Paciente:</strong> ${r.nombre || "—"}</p>
    <p><strong>Edad:</strong> ${r.edad || "—"}</p>
    <p><strong>Sexo:</strong> ${r.sexo || "—"}</p>
    <p><strong>Fecha del test:</strong> ${r.fecha || "—"}</p>
    <p><strong>Guardado:</strong> ${formatearFecha(r.creadoEn)}</p>
    <p><strong>Test:</strong> ${r.test || "—"}</p>
    <p><strong>Puntaje:</strong> ${r.puntajeTotal ?? r.total ?? "—"}</p>
    <p><strong>Nivel:</strong> ${r.nivel || "—"}</p>

    ${r.gsi ? `<p><strong>GSI:</strong> ${r.gsi}</p>` : ""}
    ${r.pst ? `<p><strong>PST:</strong> ${r.pst}</p>` : ""}
    ${r.psdi ? `<p><strong>PSDI:</strong> ${r.psdi}</p>` : ""}

    <h3>Observaciones</h3>
    <p>${r.observaciones || "—"}</p>

    <h3>Respuestas</h3>
    <pre>${JSON.stringify(r.respuestas || [], null, 2)}</pre>
  `;

  detalle.scrollIntoView({ behavior: "smooth" });
};

cargarResultados();