import { db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaResultadosAdmin");
const estado = document.getElementById("estadoCargaAdmin");
const detalle = document.getElementById("detalleResultado");
const detalleContenido = document.getElementById("detalleContenido");

const buscarPaciente = document.getElementById("buscarPaciente");
const filtroTest = document.getElementById("filtroTest");

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

function obtenerResultadosFiltrados() {
  const texto = buscarPaciente.value.toLowerCase().trim();
  const test = filtroTest.value.toLowerCase();

  return resultados.filter(r => {
    const nombre = (r.nombre || "").toLowerCase();
    const nombreTest = (r.test || "").toLowerCase();

    const coincidePaciente = !texto || nombre.includes(texto);
    const coincideTest = !test || nombreTest.includes(test.toLowerCase());

    return coincidePaciente && coincideTest;
  });
}

function renderTabla() {
  tabla.innerHTML = "";

  const filtrados = obtenerResultadosFiltrados();

  estado.textContent = `Resultados encontrados: ${filtrados.length}`;

  if (filtrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="7">No hay resultados para los filtros seleccionados.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach((r) => {
    const indexOriginal = resultados.findIndex(item => item.id === r.id);

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(r.creadoEn)}</td>
      <td>${r.nombre || "Sin nombre"}</td>
      <td>${r.test || "—"}</td>
      <td>${r.puntajeTotal ?? r.total ?? "—"}</td>
      <td>${r.nivel || "—"}</td>
<td>
  <button onclick="generarPDF(${indexOriginal})">
    PDF
  </button>
</td>

<td>
  <button onclick="verDetalle(${indexOriginal})">
    Ver
  </button>
</td>

<td>
  <button onclick="eliminarEvaluacion('${r.id}')">
    Eliminar
  </button>
</td>
    `;

    tabla.appendChild(fila);
  });
}

window.verDetalle = function(index) {
  const r = resultados[index];

  detalle.style.display = "block";

  detalleContenido.innerHTML = `
    <div class="detalle-grid">
      <p><strong>Paciente:</strong> ${r.nombre || "—"}</p>
      <p><strong>Edad:</strong> ${r.edad || "—"}</p>
      <p><strong>Sexo:</strong> ${r.sexo || "—"}</p>
      <p><strong>Fecha del test:</strong> ${r.fecha || "—"}</p>
      <p><strong>Guardado:</strong> ${formatearFecha(r.creadoEn)}</p>
      <p><strong>Usuario:</strong> ${r.usuarioEmail || "—"}</p>
      <p><strong>Test:</strong> ${r.test || "—"}</p>
      <p><strong>Puntaje:</strong> ${r.puntajeTotal ?? r.total ?? "—"}</p>
      <p><strong>Nivel:</strong> ${r.nivel || "—"}</p>
      ${r.gsi ? `<p><strong>GSI:</strong> ${r.gsi}</p>` : ""}
      ${r.pst ? `<p><strong>PST:</strong> ${r.pst}</p>` : ""}
      ${r.psdi ? `<p><strong>PSDI:</strong> ${r.psdi}</p>` : ""}
    </div>

    <h3>Observaciones</h3>
    <p>${r.observaciones || "—"}</p>

   <h3>Respuestas</h3>

<table style="width:100%; border-collapse:collapse; margin-top:10px;">
  <thead>
    <tr>
      <th style="border:1px solid #ccc;padding:6px;">Ítem</th>
      <th style="border:1px solid #ccc;padding:6px;">Pregunta</th>
      <th style="border:1px solid #ccc;padding:6px;">Respuesta</th>
    </tr>
  </thead>

  <tbody>

    ${(r.respuestas || []).map(resp => `

      <tr>

        <td style="border:1px solid #ccc;padding:6px;text-align:center;">
          ${resp.item || "—"}
        </td>

        <td style="border:1px solid #ccc;padding:6px;">
          ${resp.pregunta || "—"}
        </td>

        <td style="border:1px solid #ccc;padding:6px;">
          ${resp.descripcion || resp.respuesta || "—"}
        </td>

      </tr>

    `).join("")}

  </tbody>

</table>
  `;

  detalle.scrollIntoView({ behavior: "smooth" });
};

window.generarPDF = function(index) {
  const r = resultados[index];


const dimensionesHTML = r.dimensiones
  ? `
    <hr>
    <h2>Dimensiones SCL</h2>

    <table style="width:100%; border-collapse:collapse; margin-top:10px;">
      <thead>
        <tr>
          <th style="border:1px solid #ccc; padding:6px;">Escala</th>
          <th style="border:1px solid #ccc; padding:6px;">Ítems</th>
          <th style="border:1px solid #ccc; padding:6px;">Suma</th>
          <th style="border:1px solid #ccc; padding:6px;">Promedio</th>
          <th style="border:1px solid #ccc; padding:6px;">Interpretación</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(r.dimensiones)
  .filter(([nombre, d]) => Number(d.items) > 0)
  .map(([nombre, d]) => {
          const esAlto = d.interpretacion === "ALTO";

          return `
            <tr>
              <td style="border:1px solid #ccc; padding:6px;">${nombre}</td>
              <td style="border:1px solid #ccc; padding:6px;">${d.items}</td>
              <td style="border:1px solid #ccc; padding:6px;">${d.suma}</td>
              <td style="border:1px solid #ccc; padding:6px;">${d.promedio}</td>
              <td style="
                border:1px solid #ccc;
                padding:6px;
                color:${esAlto ? "red" : "#333"};
                font-weight:${esAlto ? "bold" : "normal"};
              ">
                ${d.interpretacion}
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `
  : "";


  const contenido = `
    <h1>Resultado de evaluación psicológica</h1>

    <p><strong>Paciente:</strong> ${r.nombre || "—"}</p>
    <p><strong>Edad:</strong> ${r.edad || "—"}</p>
    <p><strong>Sexo:</strong> ${r.sexo || "—"}</p>
    <p><strong>Fecha del test:</strong> ${r.fecha || "—"}</p>
    <p><strong>Guardado:</strong> ${formatearFecha(r.creadoEn)}</p>
    <p><strong>Usuario:</strong> ${r.usuarioEmail || "—"}</p>

    <hr>

    <h2>Datos del test</h2>
    <p><strong>Test:</strong> ${r.test || "—"}</p>
    <p><strong>Puntaje:</strong> ${r.puntajeTotal ?? r.total ?? "—"}</p>
    <p><strong>Nivel:</strong> ${r.nivel || "—"}</p>

    ${r.gsi ? `<p><strong>GSI:</strong> ${r.gsi}</p>` : ""}
    ${r.pst ? `<p><strong>PST:</strong> ${r.pst}</p>` : ""}
    ${r.psdi ? `<p><strong>PSDI:</strong> ${r.psdi}</p>` : ""}

${dimensionesHTML}

<hr>


    <h2>Respuestas</h2>

<table style="width:100%; border-collapse:collapse;">

  <thead>
    <tr>
      <th style="border:1px solid #ccc;padding:6px;">Ítem</th>
      <th style="border:1px solid #ccc;padding:6px;">Pregunta</th>
      <th style="border:1px solid #ccc;padding:6px;">Respuesta</th>
    </tr>
  </thead>

  <tbody>

    ${(r.respuestas || []).map(resp => `

      <tr>

        <td style="border:1px solid #ccc;padding:6px;text-align:center;">
          ${resp.item || "—"}
        </td>

        <td style="border:1px solid #ccc;padding:6px;">
          ${resp.pregunta || "—"}
        </td>

        <td style="border:1px solid #ccc;padding:6px;">
          ${resp.descripcion || resp.respuesta || "—"}
        </td>

      </tr>

    `).join("")}

  </tbody>

</table>
  `;

  const ventana = window.open("", "_blank");

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Resultado ${r.nombre || ""}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #222;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
        }

        h2 {
          margin-top: 25px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }

        p {
          font-size: 14px;
          line-height: 1.5;
        }

        pre {
          background: #f5f5f5;
          padding: 15px;
          white-space: pre-wrap;
          font-size: 12px;
        }

        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      ${contenido}

      <br>
      <button onclick="window.print()">Guardar / Imprimir PDF</button>
    </body>
    </html>
  `);

  ventana.document.close();
};





window.eliminarEvaluacion = async function(id) {

  if (!confirm("¿Eliminar esta evaluación?")) return;

  try {

    await deleteDoc(
      doc(db, "resultados_tests", id)
    );

    await cargarResultados();

  } catch (error) {

    console.error(error);

    alert("No se pudo eliminar la evaluación.");
  }
};









window.limpiarFiltros = function() {
  buscarPaciente.value = "";
  filtroTest.value = "";
  renderTabla();
};

buscarPaciente.addEventListener("input", renderTabla);
filtroTest.addEventListener("change", renderTabla);

cargarResultados();