let NUM_ITEMS = 90;
const STORAGE_KEY = "scl90r_guardado";

let preguntas = [];

// ===== PREGUNTAS =====

const preguntas90 = [
"Dolores de cabeza",
"Nerviosismo",
"Pensamientos desagradables que no se iban de mi cabeza",
"Sensación de mareo o desmayo",
"Falta de interés en relaciones sexuales",
"Criticar a los demás",
"Sentir que otro puede controlar mis pensamientos",
"Sentir que otros son culpables de lo que me pasa",
"Tener dificultad para memorizar cosas",
"Estar preocupado/a por mi falta de ganas para hacer algo",
"Sentirme enojado/a, malhumorado/a",
"Dolores en el pecho",
"Miedo a los espacios abiertos o las calles",
"Sentirme con muy pocas energías",
"Pensar en quitarme la vida",
"Escuchar voces que otras personas no oyen",
"Temblores en mi cuerpo",
"Perder la confianza en la mayoría de las personas",
"No tener ganas de comer",
"Llorar por cualquier cosa",
"Sentirme incómodo/a con personas del otro sexo",
"Sentirme atrapado/a o encerrado/a",
"Asustarme de repente sin razón alguna",
"Explotar y no poder controlarme",
"Tener miedo a salir solo/a de mi casa",
"Sentirme culpable por cosas que ocurren",
"Dolores en la espalda",
"No poder terminar las cosas que empecé a hacer",
"Sentirme solo/a",
"Sentirme triste",
"Preocuparme demasiado por todo lo que pasa",
"No tener interés por nada",
"Tener miedos",
"Sentirme herido en mis sentimientos",
"Creer que la gente sabe qué estoy pensando",
"Sentir que no me comprenden",
"Sentir que no caigo bien a la gente, que no les gusto",
"Tener que hacer las cosas muy despacio para estar seguro/a de que están bien hechas",
"Mi corazón late muy fuerte, se acelera",
"Náuseas o dolor de estómago",
"Sentirme inferior a los demás",
"Calambres en manos, brazos o piernas",
"Sentir que me vigilan o que hablan de mí",
"Tener problemas para dormirme",
"Tener que controlar una o más veces lo que hago",
"Tener dificultades para tomar decisiones",
"Tener miedo de viajar en tren, ómnibus o subterráneos",
"Tener dificultades para respirar bien",
"Ataques de frío o de calor",
"Tener que evitar acercarme a algunos lugares o actividades porque me dan miedo",
"Sentir que mi mente queda en blanco",
"Hormigueos en alguna parte del cuerpo",
"Tener un nudo en la garganta",
"Perder las esperanzas en el futuro",
"Dificultades para concentrarme en lo que estoy haciendo",
"Sentir flojedad, debilidad, en partes de mi cuerpo",
"Sentirme muy nervioso/a, agitado/a",
"Sentir mis brazos y piernas muy pesados",
"Pensar que me estoy por morir",
"Comer demasiado",
"Sentirme incómodo/a cuando me miran o hablan de mí",
"Tener ideas, pensamientos que no son los míos",
"Necesitar golpear o lastimar a alguien",
"Despertarme muy temprano por la mañana sin necesidad",
"Repetir muchas veces algo que hago: contar, lavarme, tocar cosas",
"Dormir con problemas, muy inquieto/a",
"Necesitar romper o destrozar cosas",
"Tener ideas, pensamientos que los demás no entienden",
"Estar muy pendiente de lo que los demás puedan pensar de mí",
"Sentirme incómodo/a en lugares donde hay mucha gente",
"Sentir que todo me cuesta mucho esfuerzo",
"Tener ataques de mucho miedo o de pánico",
"Sentirme mal si estoy comiendo o bebiendo en público",
"Meterme muy seguido en discusiones",
"Ponerme nervioso/a cuando estoy solo/a",
"Sentir que los demás no me valoran como merezco",
"Sentirme solo/a aún estando con gente",
"Estar inquieto/a, no poder estar sentado/a sin moverme",
"Sentirme un/a inútil",
"Sentir que algo malo me va a pasar",
"Gritar o tirar cosas",
"Miedo a desmayarme en medio de la gente",
"Sentir que se aprovechan de mí si los dejo",
"Pensar cosas sobre el sexo que me molestan",
"Sentir que debo ser castigado/a por mis pecados",
"Tener imágenes y pensamientos que me dan miedo",
"Sentir que algo anda mal en mi cuerpo",
"Sentirme alejado/a de las demás personas",
"Sentirme culpable",
"Pensar que en mi cabeza hay algo que no funciona bien"
];

const preguntas53 = [
"Dolores de cabeza",
"Nerviosismo",
"Pensamientos desagradables que no se iban de mi cabeza",
"Sensación de mareo o desmayo",
"Criticar a los demás",
"Sentir que otros son culpables de lo que me pasa",
"Tener dificultad para memorizar cosas",
"Estar preocupado/a por mi falta de ganas para hacer algo",
"Sentirme enojado/a, malhumorado/a",
"Dolores en el pecho",
"Miedo a los espacios abiertos o las calles",
"Sentirme con muy pocas energías",
"Pensar en quitarme la vida",
"Temblores en mi cuerpo",
"Perder la confianza en la mayoría de las personas",
"Llorar por cualquier cosa",
"Sentirme incómodo/a con personas del otro sexo",
"Sentirme atrapado/a o encerrado/a",
"Asustarme de repente sin razón alguna",
"Explotar y no poder controlarme",
"Dolores en la espalda",
"No poder terminar las cosas que empecé a hacer",
"Sentirme solo/a",
"Sentirme triste",
"Preocuparme demasiado por todo lo que pasa",
"No tener interés por nada",
"Tener miedos",
"Sentirme herido en mis sentimientos",
"Sentir que no me comprenden",
"Sentir que no caigo bien a la gente, que no les gusto",
"Mi corazón late muy fuerte, se acelera",
"Náuseas o dolor de estómago",
"Sentirme inferior a los demás",
"Calambres en manos, brazos o piernas",
"Sentir que me vigilan o que hablan de mí",
"Tener problemas para dormirme",
"Tener que controlar una o más veces lo que hago",
"Tener dificultades para tomar decisiones",
"Tener miedo de viajar en tren, ómnibus o subterráneos",
"Tener dificultades para respirar bien",
"Tener que evitar acercarme a algunos lugares o actividades porque me dan miedo",
"Sentir que mi mente queda en blanco",
"Hormigueos en alguna parte del cuerpo",
"Perder las esperanzas en el futuro",
"Dificultades para concentrarme en lo que estoy haciendo",
"Sentirme muy nervioso/a, agitado/a",
"Sentir mis brazos y piernas muy pesados",
"Sentirme incómodo/a cuando me miran o hablan de mí",
"Tener ideas, pensamientos que no son los míos",
"Necesitar golpear o lastimar a alguien",
"Repetir muchas veces algo que hago: contar, lavarme, tocar cosas",
"Tener ideas, pensamientos que los demás no entienden",
"Sentirme incómodo/a en lugares donde hay mucha gente"
];

const preguntas18 = [
"Sensación de mareo o desmayo",
"Dolores en el pecho",
"Dolores en la espalda",
"Náuseas o dolor de estómago",
"Tener dificultades para respirar bien",
"Hormigueos en alguna parte del cuerpo",
"Sentirme con muy pocas energías",
"Pensar en quitarme la vida",
"Llorar por cualquier cosa",
"Sentirme solo/a",
"Sentirme triste",
"Perder las esperanzas en el futuro",
"Nerviosismo",
"Asustarme de repente sin razón alguna",
"Tener miedos",
"Mi corazón late muy fuerte, se acelera",
"Sentirme muy nervioso/a, agitado/a",
"Tener ataques de mucho miedo o de pánico"
];

// ===== DIMENSIONES SCL-90-R =====

const dimensiones90 = {
  "Somatización": [1,4,12,27,40,42,48,49,52,53,56,58],
  "Obsesión-compulsión": [3,9,10,28,38,45,46,51,55,65],
  "Sensibilidad interpersonal": [6,21,34,36,37,41,61,69,73],
  "Depresión": [5,14,15,20,22,26,29,30,31,32,54,71,79],
  "Ansiedad": [2,17,23,33,39,57,72,78,80,86],
  "Hostilidad": [11,24,63,67,74,81],
  "Ansiedad fóbica": [13,25,47,50,70,75,82],
  "Ideación paranoide": [8,18,43,68,76,83],
  "Psicoticismo": [7,16,35,62,77,84,85,87,88,90]
};

// Corrección importante:
// Para SCL-53 y SCL-18, las preguntas están renumeradas.
// Por eso se calcula la dimensión buscando el texto equivalente
// dentro de los ítems originales del SCL-90-R.

function obtenerDimensionItems(nombreEscala) {
  if (NUM_ITEMS === 90) return dimensiones90[nombreEscala];

  const itemsOriginales = dimensiones90[nombreEscala] || [];
  const textosOriginales = itemsOriginales.map(i => preguntas90[i - 1]);

  const itemsAdaptados = [];

  preguntas.forEach((texto, index) => {
    if (textosOriginales.includes(texto)) {
      itemsAdaptados.push(index + 1);
    }
  });

  return itemsAdaptados;
}

// ===== BAREMOS =====
// Valores cargados según el JS original del usuario.

const baremos = {
  masculino: {
    "Somatización": 1.25,
    "Obsesión-compulsión": 1.90,
    "Sensibilidad interpersonal": 1.56,
    "Depresión": 1.62,
    "Ansiedad": 1.60,
    "Hostilidad": 1.67,
    "Ansiedad fóbica": 1.86,
    "Ideación paranoide": 1.83,
    "Psicoticismo": 1.20
  },
  femenino: {
    "Somatización": 1.83,
    "Obsesión-compulsión": 2.10,
    "Sensibilidad interpersonal": 1.67,
    "Depresión": 2.00,
    "Ansiedad": 1.80,
    "Hostilidad": 1.67,
    "Ansiedad fóbica": 1.14,
    "Ideación paranoide": 2.00,
    "Psicoticismo": 1.10
  }
};

const opciones = [
  ["", "Sin cargar"],
  ["0", "0 - Nada"],
  ["1", "1 - Muy poco"],
  ["2", "2 - Poco"],
  ["3", "3 - Bastante"],
  ["4", "4 - Mucho"]
];

// ===== CAMBIO DE TEST =====

function cambiarTest() {
  const tipo = document.getElementById("tipoTest").value;

  if (tipo === "90") {
    NUM_ITEMS = 90;
    preguntas = preguntas90;
  }

  if (tipo === "53") {
    NUM_ITEMS = 53;
    preguntas = preguntas53;
  }

  if (tipo === "18") {
    NUM_ITEMS = 18;
    preguntas = preguntas18;
  }

  sessionStorage.removeItem("pdf_generado_scl");

  document.getElementById("items").innerHTML = "";
  crearFormulario();
  calcular();
  guardarAutomatico();
}

// ===== FORMULARIO =====

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
        ${opciones.map(op => `<option value="${op[0]}">${op[1]}</option>`).join("")}
      </select>
    `;

    contenedor.appendChild(row);

    const select = document.getElementById(`item_${n}`);
    if (select) {
      select.addEventListener("change", calcular);
    }
  });
}

function valorItem(n) {
  const campo = document.getElementById(`item_${n}`);
  if (!campo || campo.value === "") return null;
  return Number(campo.value);
}

// ===== GRAVEDAD / INTERPRETACIÓN =====

function claseGravedad(promedio) {
  if (promedio === null) return "";
  if (promedio < 1) return "gravedad-baja";
  if (promedio < 2.5) return "gravedad-media";
  return "gravedad-alta";
}

function textoGravedad(promedio) {
  if (promedio === null) return "—";
  if (promedio < 1) return "Baja";
  if (promedio < 2.5) return "Media";
  return "Alta";
}

function interpretarSexo(escala, promedio) {
  const sexo = document.getElementById("sexo").value.toLowerCase();

  if (!baremos[sexo] || promedio === null) return "";

  const corte = baremos[sexo][escala];

  if (!corte) return "";

  return promedio >= corte ? "ALTO" : "NORMAL";
}

// ===== CÁLCULO =====

function calcular() {
  let total = 0;
  let cargadas = 0;
  let positivas = 0;

  for (let i = 1; i <= NUM_ITEMS; i++) {
    const valor = valorItem(i);

    if (valor !== null) {
      cargadas++;
      total += valor;
      if (valor > 0) positivas++;
    }
  }

  const faltan = NUM_ITEMS - cargadas;
  const gsi = total / NUM_ITEMS;
  const psdi = positivas > 0 ? total / positivas : null;

  document.getElementById("estadoCarga").textContent =
    `Respuestas cargadas: ${cargadas}/${NUM_ITEMS}`;

  document.getElementById("estadoFaltantes").textContent =
    faltan === 0 ? "Carga completa" : `Faltan ${faltan}`;

  document.getElementById("total").textContent = total;
  document.getElementById("gsi").textContent = gsi.toFixed(2);
  document.getElementById("pst").textContent = positivas;
  document.getElementById("psdi").textContent =
    psdi !== null ? psdi.toFixed(2) : "—";

  renderResultados();
  guardarAutomatico();

  if (faltan === 0 && !sessionStorage.getItem("pdf_generado_scl")) {
    sessionStorage.setItem("pdf_generado_scl", "true");

    setTimeout(() => {
      generarInformePDF();
    }, 500);
  }
}

// ===== RESULTADOS + GRÁFICO =====

function dibujarGraficoPerfil(datosGrafico) {
  const canvas = document.getElementById("graficoPerfil");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const margenIzq = 44;
  const margenDer = 12;
  const margenSup = 20;
  const margenInf = 70;
  const areaAncho = width - margenIzq - margenDer;
  const areaAlto = height - margenSup - margenInf;

  ctx.font = "11px Arial";
  ctx.fillStyle = "#1f2937";
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = margenSup + areaAlto - (i / 4) * areaAlto;
    ctx.beginPath();
    ctx.moveTo(margenIzq, y);
    ctx.lineTo(width - margenDer, y);
    ctx.stroke();
    ctx.fillText(i.toString(), 14, y + 4);
  }

  if (!datosGrafico.length) return;

  const barraAncho = areaAncho / datosGrafico.length * 0.55;
  const espacio = areaAncho / datosGrafico.length;

  datosGrafico.forEach((dato, index) => {
    const valor = dato.promedio || 0;
    const x = margenIzq + index * espacio + (espacio - barraAncho) / 2;
    const altoBarra = (valor / 4) * areaAlto;
    const y = margenSup + areaAlto - altoBarra;

    if (valor < 1) ctx.fillStyle = "#16a34a";
    else if (valor < 2.5) ctx.fillStyle = "#f59e0b";
    else ctx.fillStyle = "#dc2626";

    ctx.fillRect(x, y, barraAncho, altoBarra);

    ctx.fillStyle = "#1f2937";
    ctx.font = "10px Arial";
    ctx.fillText(valor.toFixed(2), x - 2, y - 5);

    ctx.save();
    ctx.translate(x + barraAncho / 2, height - 10);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(dato.abrev, 0, 0);
    ctx.restore();
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "11px Arial";
  ctx.fillText("Promedio por escala (0 a 4)", margenIzq, 12);
}

function renderResultados() {
  const tabla = document.getElementById("tablaResultados");
  if (!tabla) return;

  tabla.innerHTML = "";

  const datosGrafico = [];
  const datosEscalas = [];

  Object.keys(dimensiones90).forEach(nombre => {
    const items = obtenerDimensionItems(nombre);

    let suma = 0;
    let respondidos = 0;

    const itemsValidos = items.length;

    items.forEach(item => {
      const valor = valorItem(item);
      if (valor !== null) {
        suma += valor;
        respondidos++;
      }
    });

    const promedio = respondidos > 0 && itemsValidos > 0 ? suma / itemsValidos : null;
    const promedioTexto = promedio !== null ? promedio.toFixed(2) : "—";
    const interpretacion = interpretarSexo(nombre, promedio);

    datosGrafico.push({
      escala: nombre,
      abrev: nombre.split(" ").map(p => p[0]).join("").slice(0, 4),
      promedio: promedio || 0
    });

    datosEscalas.push({
      nombre,
      suma,
      promedio,
      interpretacion
    });

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${nombre}</td>
      <td>${itemsValidos}</td>
      <td class="score">${suma}</td>
      <td class="score">
        <span class="${claseGravedad(promedio)}">
          ${promedioTexto}
          ${interpretacion ? " (" + interpretacion + ")" : ""}
        </span>
      </td>
    `;

    tabla.appendChild(fila);
  });

  dibujarGraficoPerfil(datosGrafico);

  const total = Number(document.getElementById("total").textContent) || 0;
  const pst = Number(document.getElementById("pst").textContent) || 0;
  const gsi = total / NUM_ITEMS;
  const psdi = pst > 0 ? total / pst : null;

  generarInterpretacionClinica(datosEscalas, gsi, pst, psdi);
}

// ===== INTERPRETACIÓN CLÍNICA ORIENTATIVA =====

function generarInterpretacionClinica(datosEscalas, gsi, pst, psdi) {
  const contenedor = document.getElementById("interpretacionClinica");
  if (!contenedor) return;

  const escalasAltas = datosEscalas.filter(e => e.interpretacion === "ALTO");
  const escalasMuyElevadas = datosEscalas.filter(e => e.promedio !== null && e.promedio >= 2.5);

  let html = "";

  html += `
    <p>
      El perfil obtenido muestra un Índice Global de Severidad de <strong>${gsi.toFixed(2)}</strong>,
      con <strong>${pst}</strong> síntomas positivos y un IMSP/PSDI de
      <strong>${psdi !== null ? psdi.toFixed(2) : "—"}</strong>.
      Estos valores deben interpretarse dentro de una evaluación clínica integral.
    </p>
  `;

  if (escalasAltas.length > 0) {
    html += `
      <p>
        Se observan elevaciones orientativas en:
        <strong>
          ${escalasAltas.slice(0, 5).map(e => e.nombre).join(", ")}
          ${escalasAltas.length > 5 ? " y otras áreas" : ""}
        </strong>.
      </p>
    `;
  } else {
    html += `
      <p>
        No se observan elevaciones clínicas automáticas según los puntos de referencia cargados.
      </p>
    `;
  }

  if (escalasMuyElevadas.length > 0) {
    html += `
      <div class="alerta-clinica">
        Atención: se registran puntajes de intensidad elevada en:
        ${escalasMuyElevadas.map(e => e.nombre).join(", ")}.
        Se recomienda profundizar la evaluación clínica.
      </div>
    `;
  }

  html += `
    <div class="recomendacion-clinica">
      Esta interpretación es orientativa. No reemplaza entrevista clínica, juicio profesional,
      baremos oficiales, antecedentes del paciente ni evaluación de riesgo.
    </div>
  `;

  contenedor.innerHTML = html;
}

// ===== GUARDADO =====

function guardarAutomatico() {
  const datos = {
    nombre: document.getElementById("nombre").value,
    edad: document.getElementById("edad").value,
    sexo: document.getElementById("sexo").value,
    fecha: document.getElementById("fecha").value,
    observaciones: document.getElementById("observaciones").value,
    tipo: document.getElementById("tipoTest")?.value || "90",
    respuestas: {}
  };

  for (let i = 1; i <= NUM_ITEMS; i++) {
    datos.respuestas[i] = document.getElementById(`item_${i}`)?.value || "";
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function cargarAutomatico() {
  const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!datos) return;

  if (datos.tipo && document.getElementById("tipoTest")) {
    document.getElementById("tipoTest").value = datos.tipo;

    if (datos.tipo === "90") {
      NUM_ITEMS = 90;
      preguntas = preguntas90;
    } else if (datos.tipo === "53") {
      NUM_ITEMS = 53;
      preguntas = preguntas53;
    } else if (datos.tipo === "18") {
      NUM_ITEMS = 18;
      preguntas = preguntas18;
    }

    crearFormulario();
  }

  document.getElementById("nombre").value = datos.nombre || "";
  document.getElementById("edad").value = datos.edad || "";
  document.getElementById("sexo").value = datos.sexo || "";
  document.getElementById("fecha").value = datos.fecha || "";
  document.getElementById("observaciones").value = datos.observaciones || "";

  for (let i = 1; i <= NUM_ITEMS; i++) {
    if (datos.respuestas?.[i] !== undefined) {
      const campo = document.getElementById(`item_${i}`);
      if (campo) campo.value = datos.respuestas[i];
    }
  }
}

// ===== LIMPIAR / CSV / PDF =====

function limpiarFormulario() {
  if (!confirm("¿Limpiar todas las respuestas y datos guardados?")) return;

  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("pdf_generado_scl");
  location.reload();
}

function generarInformePDF() {
  const informe = document.getElementById("informeClinico");

  if (informe) {
    informe.innerHTML = `
      <h2>Informe clínico</h2>
      <p><strong>Evaluación:</strong> ${document.getElementById("tipoTest")?.selectedOptions[0]?.text || "SCL-90-R"}</p>
      <p><strong>Nombre:</strong> ${document.getElementById("nombre").value || "—"}</p>
      <p><strong>Edad:</strong> ${document.getElementById("edad").value || "—"}</p>
      <p><strong>Sexo:</strong> ${document.getElementById("sexo").value || "—"}</p>
      <p><strong>Fecha:</strong> ${document.getElementById("fecha").value || "—"}</p>
      <hr>
      ${document.getElementById("interpretacionClinica")?.innerHTML || ""}
      <p class="note">
        Informe generado automáticamente. No reemplaza evaluación clínica integral,
        baremos oficiales ni juicio profesional.
      </p>
    `;
  }

  window.print();
}

function exportarCSV() {
  let csv = "Item,Respuesta\n";

  for (let i = 1; i <= NUM_ITEMS; i++) {
    csv += `${i},${document.getElementById(`item_${i}`)?.value || ""}\n`;
  }

  csv += `\nNombre,${document.getElementById("nombre").value}\n`;
  csv += `Edad,${document.getElementById("edad").value}\n`;
  csv += `Sexo,${document.getElementById("sexo").value}\n`;
  csv += `Fecha,${document.getElementById("fecha").value}\n`;
  csv += `GSI,${document.getElementById("gsi").textContent}\n`;
  csv += `PST,${document.getElementById("pst").textContent}\n`;
  csv += `PSDI,${document.getElementById("psdi").textContent}\n`;
  csv += `Suma total,${document.getElementById("total").textContent}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "scl_resultados.csv";
  enlace.click();

  URL.revokeObjectURL(url);
}

// ===== INIT =====

window.addEventListener("DOMContentLoaded", () => {
  preguntas = preguntas90;

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
      campo.addEventListener("input", () => {
        calcular();
        guardarAutomatico();
      });

      campo.addEventListener("change", () => {
        calcular();
        guardarAutomatico();
      });
    }
  });

  const tipoTest = document.getElementById("tipoTest");
  if (tipoTest) {
    tipoTest.addEventListener("change", cambiarTest);
  }
});