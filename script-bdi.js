const NUM_ITEMS = 21;
const STORAGE_KEY = "beck_depresion_guardado";

const preguntas = [
  [
    "No me siento triste.",
    "Me siento triste.",
    "Me siento triste todo el tiempo y no puedo librarme de ello.",
    "Me siento tan triste o desdichado que no puedo soportarlo."
  ],
  [
    "No estoy particularmente desanimado con respecto al futuro.",
    "Me siento desanimado con respecto al futuro.",
    "Siento que no puedo esperar nada del futuro.",
    "Siento que el futuro es irremediable y que las cosas no pueden mejorar."
  ],
  [
    "No me siento fracasado.",
    "Siento que he fracasado más que la persona normal.",
    "Cuando miro hacia el pasado lo único que puedo ver en mi vida es un montón de fracasos.",
    "Siento que como persona soy un fracaso completo."
  ],
  [
    "Sigo obteniendo tanto placer de las cosas como antes.",
    "No disfruto de las cosas como solía hacerlo.",
    "Ya nada me satisface realmente.",
    "Todo me aburre o me desagrada."
  ],
  [
    "No siento ninguna culpa particular.",
    "Me siento culpable buena parte del tiempo.",
    "Me siento bastante culpable la mayor parte del tiempo.",
    "Me siento culpable todo el tiempo."
  ],
  [
    "No siento que esté siendo castigado.",
    "Siento que puedo estar siendo castigado.",
    "Espero ser castigado.",
    "Siento que estoy siendo castigado."
  ],
  [
    "No me siento decepcionado en mí mismo.",
    "Estoy decepcionado conmigo.",
    "Estoy harto de mí mismo.",
    "Me odio a mí mismo."
  ],
  [
    "No me siento peor que otros.",
    "Me critico por mis debilidades o errores.",
    "Me culpo todo el tiempo por mis faltas.",
    "Me culpo por todas las cosas malas que suceden."
  ],
  [
    "No tengo ninguna idea de matarme.",
    "Tengo ideas de matarme, pero no las llevo a cabo.",
    "Me gustaría matarme.",
    "Me mataría si tuviera la oportunidad."
  ],
  [
    "No lloro más de lo habitual.",
    "Lloro más que antes.",
    "Ahora lloro todo el tiempo.",
    "Antes era capaz de llorar, pero ahora no puedo llorar nunca aunque quisiera."
  ],
  [
    "No me irrito más ahora que antes.",
    "Me enojo o irrito más fácilmente ahora que antes.",
    "Me siento irritado todo el tiempo.",
    "No me irrito para nada con las cosas que solían irritarme."
  ],
  [
    "No he perdido interés en otras personas.",
    "Estoy menos interesado en otras personas de lo que solía estar.",
    "He perdido la mayor parte de mi interés en los demás.",
    "He perdido todo interés en los demás."
  ],
  [
    "Tomo decisiones como siempre.",
    "Dejo de tomar decisiones más frecuentemente que antes.",
    "Tengo mayor dificultad que antes en tomar decisiones.",
    "Ya no puedo tomar ninguna decisión."
  ],
  [
    "No creo que me vea peor que antes.",
    "Me preocupa que esté pareciendo avejentado/a o inatractivo/a.",
    "Siento que hay cambios permanentes en mi apariencia que me hacen parecer inatractivo/a.",
    "Creo que me veo horrible."
  ],
  [
    "Puedo trabajar tan bien como antes.",
    "Me cuesta un mayor esfuerzo empezar a hacer algo.",
    "Tengo que hacer un gran esfuerzo para hacer cualquier cosa.",
    "No puedo hacer ningún tipo de trabajo."
  ],
  [
    "Puedo dormir tan bien como antes.",
    "No duermo tan bien como antes.",
    "Me despierto 1 ó 2 horas más temprano de lo habitual y me cuesta volver a dormir.",
    "Me despierto varias horas más temprano de lo habitual y no puedo volver a dormirme."
  ],
  [
    "No me canso más de lo habitual.",
    "Me canso más fácilmente de lo que solía cansarme.",
    "Me canso al hacer cualquier cosa.",
    "Estoy demasiado cansado para hacer cualquier cosa."
  ],
  [
    "Mi apetito no ha variado.",
    "Mi apetito no es tan bueno como antes.",
    "Mi apetito es mucho peor que antes.",
    "Ya no tengo nada de apetito."
  ],
  [
    "Últimamente no he perdido mucho peso, si es que perdí algo.",
    "He perdido más de 2 kilos.",
    "He perdido más de 4 kilos.",
    "He perdido más de 6 kilos."
  ],
  [
    "No estoy más preocupado por mi salud de lo habitual.",
    "Estoy preocupado por problemas físicos tales como malestares y dolores de estómago o constipación.",
    "Estoy muy preocupado por problemas físicos y es difícil pensar en otra cosa.",
    "Estoy tan preocupado por mis problemas físicos que no puedo pensar en nada más."
  ],
  [
    "No he notado cambio reciente de mi interés por el sexo.",
    "Estoy menos interesado por el sexo de lo que solía estar.",
    "Estoy mucho menos interesado por el sexo ahora.",
    "He perdido por completo mi interés por el sexo."
  ]
];

function crearFormulario() {
  const cont = document.getElementById("items");
  cont.innerHTML = "";

  preguntas.forEach((opcionesItem, i) => {
    const n = i + 1;

    const row = document.createElement("div");
    row.className = "item-row bdi-item";

    row.innerHTML = `
      <div class="item-number">#${n}</div>
      <div class="item-text">
        ${opcionesItem.map((texto, valor) => `
          <label class="bdi-option">
            <input type="radio" name="item_${n}" value="${valor}">
            <span><strong>${valor}</strong> - ${texto}</span>
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

function nivelBDI(puntaje) {
  if (puntaje <= 13) return "Mínima";
  if (puntaje <= 19) return "Leve";
  if (puntaje <= 28) return "Moderada";
  return "Severa";
}

function claseNivel(puntaje) {
  if (puntaje <= 13) return "gravedad-baja";
  if (puntaje <= 19) return "gravedad-media";
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
  const nivel = nivelBDI(total);

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

  if (faltan === 0 && !sessionStorage.getItem("pdf_generado_bdi")) {
    sessionStorage.setItem("pdf_generado_bdi", "true");

    setTimeout(() => {
      generarInformePDF();
    }, 500);
  }
}

function generarInterpretacion(total, nivel) {
  const contenedor = document.getElementById("interpretacionClinica");
  if (!contenedor) return;

  let texto = "";

  if (total <= 13) {
    texto = "El puntaje obtenido se ubica en un rango orientativo mínimo de sintomatología depresiva.";
  } else if (total <= 19) {
    texto = "El puntaje obtenido se ubica en un rango orientativo leve de sintomatología depresiva.";
  } else if (total <= 28) {
    texto = "El puntaje obtenido se ubica en un rango orientativo moderado de sintomatología depresiva.";
  } else {
    texto = "El puntaje obtenido se ubica en un rango orientativo severo de sintomatología depresiva.";
  }

  const item9 = valorItem(9);

  contenedor.innerHTML = `
    <p>
      El puntaje total obtenido es <strong>${total}</strong>, correspondiente a un nivel
      orientativo de depresión <strong>${nivel}</strong>.
    </p>

    <p>${texto}</p>

    ${total >= 20 ? `
      <div class="alerta-clinica">
        Atención: el puntaje se ubica en un rango que requiere profundizar la evaluación clínica.
      </div>
    ` : ""}

    ${item9 !== null && item9 > 0 ? `
      <div class="alerta-clinica">
        Atención clínica: el ítem 9 presenta respuesta positiva relacionada con ideas de muerte o autoagresión.
        Se recomienda evaluación de riesgo inmediata por un profesional habilitado.
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
  sessionStorage.removeItem("pdf_generado_bdi");
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
  enlace.download = "beck_depresion.csv";
  enlace.click();

  URL.revokeObjectURL(url);
}

function generarInformePDF() {
  const informe = document.getElementById("informeClinico");

  if (informe) {
    informe.innerHTML = `
      <h2>Informe clínico orientativo</h2>
      <p><strong>Instrumento:</strong> Inventario de Depresión de Beck</p>
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