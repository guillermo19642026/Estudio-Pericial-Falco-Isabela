const NUM_ITEMS = 20;
const STORAGE_KEY = "beck_desesperanza_guardado";

const preguntas = [
  "Espero el futuro con esperanza y entusiasmo",
  "Puedo darme por vencido, renunciar, ya que no puedo hacer mejor las cosas por mí mismo",
  "Cuando las cosas van mal me alivia saber que las cosas no pueden permanecer tiempo así",
  "No puedo imaginar cómo será mi vida dentro de 10 años",
  "Tengo bastante tiempo para llevar a cabo las cosas que quisiera poder hacer",
  "En el futuro espero poder conseguir lo que me pueda interesar",
  "Mi futuro me parece oscuro",
  "Espero más cosas buenas de la vida que lo que la gente suele conseguir por término medio",
  "No logro hacer que las cosas cambien y no existen razones para creer que pueda en el futuro",
  "Mis pasadas experiencias me han preparado bien para mi futuro",
  "Todo lo que puedo ver hacia adelante es más desagradable que agradable",
  "No espero conseguir lo que realmente deseo",
  "Cuando miro hacia el futuro, espero que seré más feliz de lo que soy ahora",
  "Las cosas no marchan como yo quisiera",
  "Tengo una gran confianza en el futuro",
  "Nunca consigo lo que deseo por lo que es absurdo desear cualquier cosa",
  "Es muy improbable que pueda lograr una satisfacción real en el futuro",
  "El futuro me parece vago e incierto",
  "Espero más bien épocas buenas que malas",
  "No merece la pena que intente conseguir algo que desee, porque probablemente no lo lograré"
];

const claveCorreccion = {
  1: "F",
  2: "V",
  3: "F",
  4: "V",
  5: "F",
  6: "F",
  7: "V",
  8: "F",
  9: "V",
  10: "F",
  11: "V",
  12: "V",
  13: "F",
  14: "V",
  15: "F",
  16: "V",
  17: "V",
  18: "V",
  19: "F",
  20: "V"
};

function crearFormulario() {
  const contenedor = document.getElementById("items");
  contenedor.innerHTML = "";

  preguntas.forEach((texto, idx) => {
    const n = idx + 1;

    const row = document.createElement("div");
    row.className = "item-row";

    row.innerHTML = `
      <div class="item-number">#${n}</div>
      <div class="item-text">${texto}</div>
      <select id="item_${n}">
        <option value="">Sin cargar</option>
        <option value="V">Verdadero</option>
        <option value="F">Falso</option>
      </select>
    `;

    contenedor.appendChild(row);
    document.getElementById(`item_${n}`).addEventListener("change", calcular);
  });
}

function valorItem(n) {
  const campo = document.getElementById(`item_${n}`);
  return campo ? campo.value : "";
}

function nivelDesesperanza(puntaje) {
  if (puntaje <= 3) return "Mínimo";
  if (puntaje <= 8) return "Leve";
  if (puntaje <= 14) return "Moderado";
  return "Severo";
}

function claseNivel(puntaje) {
  if (puntaje <= 3) return "gravedad-baja";
  if (puntaje <= 8) return "gravedad-media";
  return "gravedad-alta";
}

function calcular() {
  let cargadas = 0;
  let puntaje = 0;

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const valor = valorItem(i);

    if (valor !== "") {
      cargadas++;

      if (valor === claveCorreccion[i]) {
        puntaje++;
      }
    }
  }

  const faltan = NUM_ITEMS - cargadas;
  const nivel = nivelDesesperanza(puntaje);

  document.getElementById("estadoCarga").textContent =
    `Respuestas cargadas: ${cargadas}/${NUM_ITEMS}`;

  document.getElementById("estadoFaltantes").textContent =
    faltan === 0 ? "Carga completa" : `Faltan ${faltan}`;

  document.getElementById("estadoCarga").className =
    faltan === 0 ? "pill ok" : "pill warn";

  document.getElementById("estadoFaltantes").className =
    faltan === 0 ? "pill ok" : "pill bad";

  document.getElementById("puntajeTotal").textContent = puntaje;
  document.getElementById("nivel").innerHTML =
    `<span class="${claseNivel(puntaje)}">${nivel}</span>`;

  document.getElementById("cargadasTabla").textContent =
    `${cargadas}/${NUM_ITEMS}`;

  generarInterpretacion(puntaje, nivel);
  guardarAutomatico();

  if (faltan === 0 && !sessionStorage.getItem("pdf_generado_desesperanza")) {
    sessionStorage.setItem("pdf_generado_desesperanza", "true");

    setTimeout(() => {
      generarInformePDF();
    }, 500);
  }
}

function generarInterpretacion(puntaje, nivel) {
  const contenedor = document.getElementById("interpretacionClinica");
  if (!contenedor) return;

  let texto = "";

  if (puntaje <= 3) {
    texto = "El puntaje obtenido se ubica en un rango orientativo mínimo de desesperanza.";
  } else if (puntaje <= 8) {
    texto = "El puntaje obtenido se ubica en un rango orientativo leve de desesperanza.";
  } else if (puntaje <= 14) {
    texto = "El puntaje obtenido se ubica en un rango orientativo moderado de desesperanza.";
  } else {
    texto = "El puntaje obtenido se ubica en un rango orientativo severo de desesperanza.";
  }

  contenedor.innerHTML = `
    <p>
      El puntaje total obtenido es <strong>${puntaje}</strong>, correspondiente a un nivel
      orientativo de desesperanza <strong>${nivel}</strong>.
    </p>

    <p>${texto}</p>

    ${puntaje >= 9 ? `
      <div class="alerta-clinica">
        Atención: el puntaje se ubica en un rango que requiere profundizar la evaluación clínica,
        especialmente en relación con ideación suicida, estado de ánimo, desesperanza y factores de riesgo.
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
    datos.respuestas[i] = valorItem(i);
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
    const campo = document.getElementById(`item_${i}`);
    if (campo) campo.value = datos.respuestas?.[i] || "";
  }
}

function limpiarFormulario() {
  if (!confirm("¿Limpiar todas las respuestas y datos guardados?")) return;

  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("pdf_generado_desesperanza");
  location.reload();
}

function exportarCSV() {
  let csv = "Item,Respuesta,Puntua\n";

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const respuesta = valorItem(i);
    const puntua = respuesta === claveCorreccion[i] ? 1 : 0;
    csv += `${i},${respuesta},${respuesta ? puntua : ""}\n`;
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
  enlace.download = "beck_desesperanza.csv";
  enlace.click();

  URL.revokeObjectURL(url);
}

function generarInformePDF() {
  const informe = document.getElementById("informeClinico");

  if (informe) {
    informe.innerHTML = `
      <h2>Informe clínico orientativo</h2>
      <p><strong>Instrumento:</strong> Escala de Desesperanza de Beck</p>
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