const NUM_ITEMS = 21;
const STORAGE_KEY = "beck_ansiedad_guardado";

const preguntas = [
  "Torpe o entumecido.",
  "Acalorado.",
  "Con temblor en las piernas.",
  "Incapaz de relajarse.",
  "Con temor a que ocurra lo peor.",
  "Mareado, o que se le va la cabeza.",
  "Con latidos del corazón fuertes y acelerados.",
  "Inestable.",
  "Atemorizado o asustado.",
  "Nervioso.",
  "Con sensación de bloqueo.",
  "Con temblores en las manos.",
  "Inquieto, inseguro.",
  "Con miedo a perder el control.",
  "Con sensación de ahogo.",
  "Con temor a morir.",
  "Con miedo.",
  "Con problemas digestivos.",
  "Con desvanecimientos.",
  "Con rubor facial.",
  "Con sudores, fríos o calientes."
];

const opciones = [
  { valor: 0, texto: "En absoluto" },
  { valor: 1, texto: "Levemente" },
  { valor: 2, texto: "Moderadamente" },
  { valor: 3, texto: "Severamente" }
];

function crearFormulario() {
  const cont = document.getElementById("items");
  cont.innerHTML = "";

  preguntas.forEach((texto, i) => {
    const n = i + 1;

    const row = document.createElement("div");
    row.className = "item-row";

    row.innerHTML = `
      <div class="item-number">#${n}</div>
      <div class="item-text">
        <strong>${texto}</strong>
        ${opciones.map(op => `
          <label class="option">
            <input type="radio" name="item_${n}" value="${op.valor}">
            <span><strong>${op.valor}</strong> - ${op.texto}</span>
          </label>
        `).join("")}
      </div>
    `;

    cont.appendChild(row);

    document.querySelectorAll(`input[name="item_${n}"]`).forEach(input => {
      input.addEventListener("change", calcular);
    });
  });
}

function valorItem(n) {
  const seleccionado = document.querySelector(`input[name="item_${n}"]:checked`);
  return seleccionado ? Number(seleccionado.value) : null;
}

function nivelBAI(puntaje) {
  if (puntaje <= 7) return "Mínima";
  if (puntaje <= 15) return "Leve";
  if (puntaje <= 25) return "Moderada";
  return "Severa";
}

function claseNivel(puntaje) {
  if (puntaje <= 7) return "gravedad-baja";
  if (puntaje <= 15) return "gravedad-media";
  return "gravedad-alta";
}

function calcular() {
  let total = 0;
  let cargadas = 0;

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const valor = valorItem(i);

    if (valor !== null) {
      total += valor;
      cargadas++;
    }
  }

  const faltan = NUM_ITEMS - cargadas;
  const nivel = nivelBAI(total);

  document.getElementById("estadoCarga").textContent =
    `Respuestas cargadas: ${cargadas}/${NUM_ITEMS}`;

  document.getElementById("estadoFaltantes").textContent =
    faltan === 0 ? "Carga completa" : `Faltan ${faltan}`;

  document.getElementById("estadoCarga").className =
    faltan === 0 ? "pill ok" : "pill warn";

  document.getElementById("estadoFaltantes").className =
    faltan === 0 ? "pill ok" : "pill bad";

  document.getElementById("puntajeTotal").textContent = total;
  document.getElementById("nivel").innerHTML =
    `<span class="${claseNivel(total)}">${nivel}</span>`;

  document.getElementById("cargadasTabla").textContent =
    `${cargadas}/${NUM_ITEMS}`;

  generarInterpretacion(total, nivel);
  guardarAutomatico();

  if (faltan === 0 && !sessionStorage.getItem("pdf_generado_bai")) {
    sessionStorage.setItem("pdf_generado_bai", "true");

    setTimeout(() => {
      generarInformePDF();
    }, 500);
  }
}

function generarInterpretacion(total, nivel) {
  const contenedor = document.getElementById("interpretacionClinica");
  if (!contenedor) return;

  let texto = "";

  if (total <= 7) {
    texto = "El puntaje obtenido se ubica en un rango orientativo mínimo de sintomatología ansiosa.";
  } else if (total <= 15) {
    texto = "El puntaje obtenido se ubica en un rango orientativo leve de sintomatología ansiosa.";
  } else if (total <= 25) {
    texto = "El puntaje obtenido se ubica en un rango orientativo moderado de sintomatología ansiosa.";
  } else {
    texto = "El puntaje obtenido se ubica en un rango orientativo severo de sintomatología ansiosa.";
  }

  contenedor.innerHTML = `
    <p>
      El puntaje total obtenido es <strong>${total}</strong>, correspondiente a un nivel
      orientativo de ansiedad <strong>${nivel}</strong>.
    </p>

    <p>${texto}</p>

    ${total >= 16 ? `
      <div class="alerta-clinica">
        Atención: el puntaje se ubica en un rango que requiere profundizar la evaluación clínica.
      </div>
    ` : ""}

    <div class="recomendacion-clinica">
      Esta interpretación es orientativa. No reemplaza entrevista clínica, juicio profesional,
      baremos oficiales ni evaluación de riesgo.
    </div>
  `;
}

function guardarAutomatico() {
  const datos = {
    nombre: document.getElementById("nombre").value,
    edad: document.getElementById("edad").value,
    sexo: document.getElementById("sexo").value,
    fecha: document.getElementById("fecha").value,
    observaciones: document.getElementById("observaciones").value,
    respuestas: {}
  };

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const seleccionado = document.querySelector(`input[name="item_${i}"]:checked`);
    datos.respuestas[i] = seleccionado ? seleccionado.value : "";
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function cargarAutomatico() {
  const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!datos) return;

  document.getElementById("nombre").value = datos.nombre || "";
  document.getElementById("edad").value = datos.edad || "";
  document.getElementById("sexo").value = datos.sexo || "";
  document.getElementById("fecha").value = datos.fecha || "";
  document.getElementById("observaciones").value = datos.observaciones || "";

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const valor = datos.respuestas?.[i];

    if (valor !== undefined && valor !== "") {
      const input = document.querySelector(`input[name="item_${i}"][value="${valor}"]`);
      if (input) input.checked = true;
    }
  }
}

function limpiarFormulario() {
  if (!confirm("¿Limpiar todas las respuestas y datos guardados?")) return;

  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("pdf_generado_bai");
  location.reload();
}

function exportarCSV() {
  let csv = "Item,Respuesta\n";

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const valor = valorItem(i);
    csv += `${i},${valor !== null ? valor : ""}\n`;
  }

  csv += `\nNombre,${document.getElementById("nombre").value}\n`;
  csv += `Edad,${document.getElementById("edad").value}\n`;
  csv += `Sexo,${document.getElementById("sexo").value}\n`;
  csv += `Fecha,${document.getElementById("fecha").value}\n`;
  csv += `Puntaje total,${document.getElementById("puntajeTotal").textContent}\n`;
  csv += `Nivel,${document.getElementById("nivel").textContent}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "beck_ansiedad.csv";
  enlace.click();

  URL.revokeObjectURL(url);
}

function generarInformePDF() {
  const informe = document.getElementById("informeClinico");

  if (informe) {
    informe.innerHTML = `
      <h2>Informe clínico orientativo</h2>
      <p><strong>Instrumento:</strong> Inventario de Ansiedad de Beck</p>
      <p><strong>Nombre:</strong> ${document.getElementById("nombre").value || "—"}</p>
      <p><strong>Edad:</strong> ${document.getElementById("edad").value || "—"}</p>
      <p><strong>Sexo:</strong> ${document.getElementById("sexo").value || "—"}</p>
      <p><strong>Fecha:</strong> ${document.getElementById("fecha").value || "—"}</p>

      <hr>

      <p><strong>Puntaje total:</strong> ${document.getElementById("puntajeTotal").textContent}</p>
      <p><strong>Nivel orientativo:</strong> ${document.getElementById("nivel").textContent}</p>

      <h3>Interpretación orientativa</h3>
      ${document.getElementById("interpretacionClinica").innerHTML}

      <h3>Observaciones</h3>
      <p>${document.getElementById("observaciones").value || "—"}</p>

      <p class="note">
        Informe generado automáticamente. No reemplaza entrevista clínica, baremos oficiales,
        evaluación de riesgo ni juicio profesional.
      </p>
    `;
  }

  window.print();
}

window.addEventListener("DOMContentLoaded", () => {
  crearFormulario();

  const fecha = document.getElementById("fecha");
  if (fecha && !fecha.value) {
    fecha.valueAsDate = new Date();
  }

  cargarAutomatico();
  calcular();

  ["nombre", "edad", "sexo", "fecha", "observaciones"].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener("input", guardarAutomatico);
      campo.addEventListener("change", guardarAutomatico);
    }
  });
});