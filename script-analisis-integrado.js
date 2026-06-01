import { auth, db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";




onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const params = new URLSearchParams(window.location.search);


  if (params.get("auto") !== "informe") return;

  const buscador = document.querySelector(".card");

if (buscador) {
  buscador.style.display = "none";
}



  const q = query(
    collection(db, "resultados_tests"),
    where("usuarioEmail", "==", user.email)
  );

  const snapshot = await getDocs(q);

  const resultados = [];

  snapshot.forEach(doc => {
    resultados.push(doc.data());
  });

  mostrarResultados(resultados);

  setTimeout(() => {

  const cantidad =
    resultados.filter(r => r.test).length;

  if (cantidad >= 3) {
    window.generarAnalisis();
  }

}, 300);
});




window.buscarPaciente = async function () {

  const dni = document
    .getElementById("buscarDni")
    .value
    .trim();

  if (!dni) {
    alert("Ingrese DNI");
    return;
  }

  const snapshot = await getDocs(
    collection(db, "resultados_tests")
  );

  const resultados = [];

  snapshot.forEach(doc => {

    const data = doc.data();

    if ((data.dni || "") === dni) {
      resultados.push(data);
    }

  });

  mostrarResultados(resultados);
};

function mostrarResultados(resultados){

  const contenedor =
    document.getElementById("resultadoBusqueda");

  if(resultados.length === 0){

    contenedor.innerHTML = `
      <div class="tarjeta-integrada">
        No se encontraron evaluaciones.
      </div>
    `;

    return;
  }

  const scl =
    resultados.find(r =>
      (r.test || "").includes("SCL") ||
      (r.test || "").includes("BSI")
    );

  const bdi =
    resultados.find(r =>
      (r.test || "").includes("BDI")
    );

  const bai =
    resultados.find(r =>
      (r.test || "").includes("BAI")
    );

  const desesperanza =
    resultados.find(r =>
      (r.test || "").includes("Desesperanza")
    );

  const cantidad =
    [scl,bdi,bai,desesperanza]
      .filter(Boolean)
      .length;

  contenedor.innerHTML = `

<div class="tarjeta-integrada">

<h2>${resultados[0].nombre}</h2>

<p>DNI: ${resultados[0].dni}</p>

<p class="${scl ? 'estado-ok' : 'estado-falta'}">
SCL / BSI ${scl ? '✓' : '✗'}
</p>

<p class="${bdi ? 'estado-ok' : 'estado-falta'}">
BDI ${bdi ? '✓' : '✗'}
</p>

<p class="${bai ? 'estado-ok' : 'estado-falta'}">
BAI ${bai ? '✓' : '✗'}
</p>

<p class="${desesperanza ? 'estado-ok' : 'estado-falta'}">
Desesperanza ${desesperanza ? '✓' : '✗'}
</p>

<p>
Tests disponibles:
<strong>${cantidad} / 4</strong>
</p>

${
cantidad >= 3
?
`
<button onclick="generarAnalisis()">
Generar análisis integrado
</button>
`
:
`
<p style="color:red">
Se requieren al menos 3 tests.
</p>
`
}

</div>

`;

window.resultadosPaciente = {
  scl,
  bdi,
  bai,
  desesperanza,
  datos: resultados[0]
};

}







window.generarAnalisis = function () {
  const { scl, bdi, bai, desesperanza, datos } = window.resultadosPaciente;

  const cantidad = [scl, bdi, bai, desesperanza].filter(Boolean).length;

  const informe = document.getElementById("informeIntegrado");

 informe.innerHTML = `
  <section class="card informe-profesional">

    <div class="encabezado-informe">

      <h2>
        Informe Integrado de Evaluación Psicométrica
      </h2>

      <p class="fecha-emision">
        Fecha de emisión:
        ${new Date().toLocaleDateString("es-AR")}
      </p>

    </div>

    <div class="datos-evaluado">

      <p><strong>Nombre:</strong> ${datos.nombre || "—"}</p>

      <p><strong>DNI:</strong> ${datos.dni || "—"}</p>

      <p><strong>Edad:</strong> ${datos.edad || "—"}</p>

      <p><strong>Sexo:</strong> ${datos.sexo || "—"}</p>

    </div>



<hr>

<h3>Resumen ejecutivo</h3>

${generarResumenEjecutivo(scl, bdi, bai, desesperanza, cantidad)}




 <hr>

      <h3>Resultados por instrumento</h3>

<table class="tabla-resumen">

<tr>
  <th>Instrumento</th>
  <th>Resultado</th>
</tr>

${scl ? `
<tr>
  <td>SCL / BSI</td>
  <td>IGS ${scl.gsi || "—"}</td>
</tr>
` : ""}

${bdi ? `
<tr>
  <td>BDI</td>
  <td>${bdi.nivel || "—"}</td>
</tr>
` : ""}

${bai ? `
<tr>
  <td>BAI</td>
  <td>${bai.nivel || "—"}</td>
</tr>
` : ""}

${desesperanza ? `
<tr>
  <td>Desesperanza</td>
  <td>${desesperanza.nivel || "—"}</td>
</tr>
` : ""}

</table>



<hr>

<h3>Nivel global de afectación emocional</h3>

${generarNivelGlobal(scl, bdi, bai, desesperanza)}

<hr>

<h3>Perfil emocional integrado</h3>

${generarPerfilEmocionalIntegrado(scl, bdi, bai, desesperanza)}

<hr>

<h3>Factores de vulnerabilidad</h3>

${generarFactoresVulnerabilidad(scl, bdi, bai, desesperanza)}

<hr>

<h3>Factores protectores</h3>

${generarFactoresProtectores(scl, bdi, bai, desesperanza)}

<hr>

<h3>Recomendaciones orientativas</h3>

${generarRecomendacionesOrientativas(scl, bdi, bai, desesperanza)}



<hr>

<h3>Conclusión orientativa</h3>

${generarConclusionIntegrada(
  scl,
  bdi,
  bai,
  desesperanza
)}





 <hr>

<h3>Alertas clínicas orientativas</h3>

${generarAlertasClinicas(
  scl,
  bdi,
  bai,
  desesperanza
)}


<hr>

<h3>Interpretación clínica integrada</h3>

${generarInterpretacionInteligente(
  scl,
  bdi,
  bai,
  desesperanza
)}

<hr>

<h3>Tabla de dimensiones SCL / BSI</h3>

${generarTablaDimensionesSCL(scl)}

<hr>

<h3>Lectura por dimensiones SCL / BSI</h3>

${generarLecturaDimensionesSCL(scl)}

<hr>

<h3>Perfil gráfico integrado</h3>

${generarPerfilGrafico(
  scl,
  bdi,
  bai,
  desesperanza
)}

${generarRadarIntegrado(
  scl,
  bdi,
  bai,
  desesperanza
)}

<br>

<button onclick="imprimirInformeIntegrado()">
  Imprimir / guardar PDF
</button>


</section>
`;


  informe.scrollIntoView({ behavior: "smooth" });
};


function esElevado(nivel){
  return ["Moderada", "Grave", "Severa", "Moderado", "Severo"].includes(nivel);
}

function generarResumenEjecutivo(scl, bdi, bai, desesperanza, cantidad){

  return `
    <div class="bloque-informe-destacado">
      <p>
        Se integran los resultados obtenidos a partir de
        <strong>${cantidad}</strong> instrumento/s psicométrico/s administrado/s.
        El presente informe tiene carácter orientativo y busca aportar una
        lectura preliminar del estado emocional actual del evaluado.
      </p>

      <ul>
        ${scl ? `<li><strong>SCL / BSI:</strong> IGS ${scl.gsi || "—"} · PST ${scl.pst || "—"} · PSDI ${scl.psdi || "—"}</li>` : ""}
        ${bdi ? `<li><strong>BDI:</strong> ${bdi.puntajeTotal || "—"} puntos · ${bdi.nivel || "—"}</li>` : ""}
        ${bai ? `<li><strong>BAI:</strong> ${bai.puntajeTotal || "—"} puntos · ${bai.nivel || "—"}</li>` : ""}
        ${desesperanza ? `<li><strong>Desesperanza:</strong> ${desesperanza.puntajeTotal || "—"} puntos · ${desesperanza.nivel || "—"}</li>` : ""}
      </ul>
    </div>
  `;
}






function generarNivelGlobal(scl, bdi, bai, desesperanza){

  let puntos = 0;

  if (scl && Number(scl.gsi) >= 1.50) puntos++;
  if (bdi && esElevado(bdi.nivel)) puntos++;
  if (bai && esElevado(bai.nivel)) puntos++;
  if (desesperanza && esElevado(desesperanza.nivel)) puntos++;

  let nivel = "Bajo";
  let descripcion = "";

  if (puntos === 0) {
    descripcion =
      "Los instrumentos administrados no evidencian indicadores globales de afectación emocional clínicamente significativa.";
  }

  if (puntos === 1) {
    nivel = "Moderado";

    descripcion =
      "Se identifica un área con indicadores clínicamente relevantes, sugiriendo la conveniencia de ampliar la exploración profesional.";

    if (bdi && esElevado(bdi.nivel)) {
      descripcion +=
        " En el presente caso, dicha clasificación se encuentra determinada principalmente por la presencia de indicadores depresivos de intensidad moderada o superior.";
    }

    if (bai && esElevado(bai.nivel)) {
      descripcion +=
        " La clasificación global se vincula principalmente con indicadores de ansiedad clínicamente relevantes.";
    }
  }

  if (puntos >= 2) {
    nivel = "Elevado";

    descripcion =
      "Se observa convergencia entre múltiples indicadores de malestar emocional, configurando un perfil que requiere especial consideración clínica y profesional.";
  }

  return `
    <div style="
      padding:20px;
      border-radius:12px;
      background:#faf8f3;
      border-left:5px solid #c9a96e;
      margin:10px 0 20px;
    ">
      <h4 style="margin-top:0;">
        Nivel global: ${nivel}
      </h4>

      <p style="margin-bottom:0;">
        ${descripcion}
      </p>
    </div>
  `;
}



function generarPerfilEmocionalIntegrado(scl, bdi, bai, desesperanza){

  const ansiedad = bai && esElevado(bai.nivel);
  const depresion = bdi && esElevado(bdi.nivel);
  const desesperanzaAlta = desesperanza && esElevado(desesperanza.nivel);
  const malestar = scl && Number(scl.gsi) >= 1.50;

  let perfil = "Perfil emocional sin elevaciones clínicas predominantes.";

  if (ansiedad && depresion) {
    perfil = "Perfil ansioso-depresivo con indicadores de malestar emocional significativo.";
  } else if (ansiedad) {
    perfil = "Perfil con predominio de sintomatología ansiosa.";
  } else if (depresion) {
    perfil = "Perfil con predominio de indicadores afectivos depresivos.";
  } else if (desesperanzaAlta) {
    perfil = "Perfil con presencia de expectativas negativas respecto del futuro.";
  } else if (malestar) {
    perfil = "Perfil caracterizado por malestar psicológico general aumentado.";
  }

  return `
    <p>
      ${perfil} La lectura integrada permite observar la forma en que los
      distintos indicadores psicométricos se organizan dentro de una experiencia
      subjetiva global, debiendo interpretarse siempre en relación con la historia
      personal, el contexto actual y los recursos adaptativos del evaluado.
    </p>
  `;
}

function generarFactoresVulnerabilidad(scl, bdi, bai, desesperanza){

  let items = [];

  if (bai && esElevado(bai.nivel)) {
    items.push("Indicadores ansiosos de intensidad clínicamente relevante.");
  }

  if (bdi && esElevado(bdi.nivel)) {
    items.push("Indicadores depresivos o afectivos elevados.");
  }

  if (desesperanza && esElevado(desesperanza.nivel)) {
    items.push("Expectativas negativas respecto del futuro.");
  }

  if (scl && Number(scl.gsi) >= 1.50) {
    items.push("Malestar psicológico general aumentado.");
  }

  if (items.length === 0) {
    items.push("No se identifican factores de vulnerabilidad significativos a partir de los instrumentos administrados.");
  }

  return `
    <ul>
      ${items.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}

function generarFactoresProtectores(scl, bdi, bai, desesperanza){

  let items = [];

  if (!bai || !esElevado(bai.nivel)) {
    items.push("No se observan indicadores ansiosos elevados en el instrumento administrado.");
  }

  if (!bdi || !esElevado(bdi.nivel)) {
    items.push("No se observan indicadores depresivos elevados o severos.");
  }

  if (!desesperanza || !esElevado(desesperanza.nivel)) {
    items.push("No se identifican indicadores marcados de desesperanza.");
  }

  if (!scl || Number(scl.gsi) < 1.50) {
    items.push("El índice global de malestar no se presenta elevado en términos orientativos.");
  }

  return `
    <ul>
      ${items.map(i => `<li>${i}</li>`).join("")}
    </ul>
  `;
}

function generarRecomendacionesOrientativas(scl, bdi, bai, desesperanza){

  let recomendaciones = [];

  if (bai && esElevado(bai.nivel)) {
    recomendaciones.push("Profundizar la evaluación de sintomatología ansiosa, recursos de afrontamiento y niveles actuales de estrés.");
  }

  if (bdi && esElevado(bdi.nivel)) {
    recomendaciones.push("Ampliar la exploración del estado de ánimo, motivación, energía psíquica y funcionamiento cotidiano.");
  }

  if (desesperanza && esElevado(desesperanza.nivel)) {
    recomendaciones.push("Valorar clínicamente expectativas futuras, percepción de alternativas y presencia de ideación negativa persistente.");
  }

  if (scl && Number(scl.gsi) >= 1.50) {
    recomendaciones.push("Considerar una entrevista psicológica integral para contextualizar el malestar subjetivo registrado.");
  }

  if (recomendaciones.length === 0) {
    recomendaciones.push("No se desprende de los instrumentos una recomendación de intervención urgente; no obstante, los resultados deben ser contextualizados profesionalmente.");
  }

  return `
    <ul>
      ${recomendaciones.map(r => `<li>${r}</li>`).join("")}
    </ul>
  `;
}




function generarConclusionIntegrada(
  scl,
  bdi,
  bai,
  desesperanza
){

  let texto =
    "La integración de los resultados obtenidos permite identificar el perfil emocional predominante observado al momento de la evaluación.";

  if (bdi && esElevado(bdi.nivel)) {
    texto +=
      " Se destacan indicadores afectivos compatibles con sintomatología depresiva clínicamente relevante.";
  }

  if (bai && esElevado(bai.nivel)) {
    texto +=
      " Asimismo, se observan manifestaciones compatibles con incremento de ansiedad subjetiva.";
  }

  if (desesperanza && esElevado(desesperanza.nivel)) {
    texto +=
      " También se registran expectativas negativas respecto del futuro y disminución de la percepción de alternativas de resolución.";
  }

  if (
    (!bdi || !esElevado(bdi.nivel)) &&
    (!bai || !esElevado(bai.nivel)) &&
    (!desesperanza || !esElevado(desesperanza.nivel))
  ) {
    texto +=
      " No se observan indicadores clínicamente significativos de afectación emocional global en los instrumentos administrados.";
  }

  texto +=
    " Los resultados deben interpretarse dentro de una evaluación psicológica integral y no constituyen por sí mismos un diagnóstico clínico o pericial.";

  return `<p>${texto}</p>`;
}



function generarTextoIntegrado(scl, bdi, bai, desesperanza) {
  let texto = "";

  if (scl) {
    texto += `
      <p>
        En el instrumento SCL/BSI se observa un Índice Global de Severidad de
        <strong>${scl.gsi || "—"}</strong>, con <strong>${scl.pst || "—"}</strong>
        síntomas positivos y un PSDI de <strong>${scl.psdi || "—"}</strong>.
      </p>
    `;
  }

  if (bdi) {
    texto += `
      <p>
        En el BDI se registra un puntaje de <strong>${bdi.puntajeTotal || "—"}</strong>,
        correspondiente a un nivel <strong>${bdi.nivel || "—"}</strong>.
      </p>
    `;
  }

  if (bai) {
    texto += `
      <p>
        En el BAI se registra un puntaje de <strong>${bai.puntajeTotal || "—"}</strong>,
        correspondiente a un nivel <strong>${bai.nivel || "—"}</strong>.
      </p>
    `;
  }

  if (desesperanza) {
    texto += `
      <p>
        En la Escala de Desesperanza se registra un puntaje de
        <strong>${desesperanza.puntajeTotal || "—"}</strong>, correspondiente a un nivel
        <strong>${desesperanza.nivel || "—"}</strong>.
      </p>
    `;
  }

  texto += `
    <p>
      La convergencia o divergencia entre los instrumentos deberá valorarse clínicamente,
      especialmente en relación con sintomatología ansiosa, depresiva, malestar subjetivo
      general, ideación negativa y expectativas respecto del futuro.
    </p>
  `;

  return texto;
}



function generarInterpretacionInteligente(scl, bdi, bai, desesperanza) {

  let texto = "";

  const ansiedadAlta =
    bai &&
    ["Moderada", "Grave", "Severa"].includes(bai.nivel);

  const depresionAlta =
    bdi &&
    ["Moderada", "Grave", "Severa"].includes(bdi.nivel);

  const desesperanzaAlta =
    desesperanza &&
    ["Moderada", "Grave", "Severa", "Moderado", "Severo"].includes(desesperanza.nivel);

  const malestarAlto =
    scl &&
    scl.gsi &&
    Number(scl.gsi) >= 1.50;

  texto += `
    <p>
      La integración de los instrumentos administrados permite realizar una aproximación orientativa al estado emocional actual del evaluado, considerando la convergencia de los distintos indicadores psicométricos obtenidos.
    </p>
  `;

  if (ansiedadAlta) {
    texto += `
      <p>
        Se observan indicadores compatibles con elevados niveles de ansiedad, caracterizados por preocupación persistente, incremento de la tensión psicológica, hipervigilancia y dificultades para alcanzar estados adecuados de relajación emocional. Estos resultados suelen asociarse a situaciones de estrés significativo o exigencias percibidas como difíciles de afrontar.
      </p>
    `;
  }

  if (depresionAlta) {
    texto += `
      <p>
        Los resultados sugieren la presencia de indicadores afectivos compatibles con sintomatología depresiva clínicamente relevante. Entre las manifestaciones habitualmente asociadas a este perfil pueden encontrarse disminución del interés, desmotivación, sentimientos de insatisfacción, pesimismo y reducción de la energía psicológica disponible para afrontar las demandas cotidianas.
      </p>
    `;
  }

  if (desesperanzaAlta) {
    texto += `
      <p>
        Asimismo, se registran indicadores vinculados a expectativas negativas respecto del futuro, percepción limitada de alternativas de resolución y disminución de la confianza en cambios favorables de la situación actual. Estos aspectos constituyen variables de especial interés dentro de la evaluación psicológica integral.
      </p>
    `;
  }

  if (malestarAlto) {
    texto += `
      <p>
        El nivel global de malestar psicológico registrado en el SCL/BSI resulta elevado, sugiriendo una afectación subjetiva significativa que trasciende áreas específicas y se expresa como una experiencia general de sufrimiento emocional.
      </p>
    `;
  }

  const positivos = [
    ansiedadAlta,
    depresionAlta,
    desesperanzaAlta
  ].filter(Boolean).length;

  if (positivos >= 2) {
    texto += `
      <p>
        Los distintos instrumentos administrados presentan una adecuada consistencia interna y convergencia clínica, observándose coincidencias entre las áreas evaluadas. Esta convergencia fortalece la confiabilidad interpretativa de los resultados obtenidos.
      </p>
    `;
  }

  if (positivos === 0 && !malestarAlto) {
    texto += `
      <p>
        Los instrumentos administrados no evidencian indicadores clínicamente significativos de malestar emocional al momento de la evaluación, observándose un perfil global compatible con parámetros esperables dentro de la población general.
      </p>
    `;
  }

  texto += `
    <p>
      Los hallazgos expuestos deben interpretarse conjuntamente con entrevistas clínicas, antecedentes personales, contexto vital y demás elementos de valoración profesional. Los resultados psicométricos constituyen herramientas complementarias y no reemplazan una evaluación psicológica integral.
    </p>
  `;

  texto += `
    <p style="
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid rgba(201,168,106,.20);
      font-size:.92rem;
      color:#bdbdbd;
    ">
      El presente informe posee carácter exclusivamente orientativo y ha sido generado mediante integración automatizada de resultados psicométricos. No constituye diagnóstico psicológico, psiquiátrico ni pericial, y debe ser interpretado por profesional competente dentro de una evaluación integral.
    </p>
  `;

  return texto;
}




function generarAlertasClinicas(scl, bdi, bai, desesperanza) {
  let alertas = "";

  const riesgoBDI =
    bdi?.respuestas?.find(r => r.item === 9 && Number(r.respuesta) > 0);

  const riesgoSCL =
    scl?.respuestas?.find(r =>
      r.pregunta?.toLowerCase().includes("quitarme la vida") &&
      Number(r.respuesta) > 0
    );

  if (riesgoBDI || riesgoSCL) {
    alertas += `
      <div style="border:2px solid #dc2626; background:#fee2e2; padding:12px; border-radius:8px; margin-bottom:10px;">
        ⚠ Se registran respuestas vinculadas a ideación de muerte o autolesión. Requiere valoración clínica específica.
      </div>
    `;
  }

  if (bdi && ["Moderada", "Grave", "Severa"].includes(bdi.nivel)) {
    alertas += `
      <div style="border:1px solid #f59e0b; background:#fef3c7; padding:12px; border-radius:8px; margin-bottom:10px;">
        ⚠ Indicadores depresivos clínicamente relevantes.
      </div>
    `;
  }

  if (bai && ["Moderada", "Grave", "Severa"].includes(bai.nivel)) {
    alertas += `
      <div style="border:1px solid #f59e0b; background:#fef3c7; padding:12px; border-radius:8px; margin-bottom:10px;">
        ⚠ Indicadores ansiosos clínicamente relevantes.
      </div>
    `;
  }

  if (desesperanza && ["Moderado", "Moderada", "Severo", "Severa"].includes(desesperanza.nivel)) {
    alertas += `
      <div style="border:1px solid #f59e0b; background:#fef3c7; padding:12px; border-radius:8px; margin-bottom:10px;">
        ⚠ Elevación en indicadores de desesperanza.
      </div>
    `;
  }

  return alertas || `<p>No se detectan alertas automáticas relevantes con los instrumentos disponibles.</p>`;
}


function generarLecturaDimensionesSCL(scl) {

  if (!scl || !scl.dimensiones) {
    return `
      <p>
        No se dispone de información dimensional suficiente para realizar una interpretación orientativa.
      </p>
    `;
  }

  const dimensiones = Object.entries(scl.dimensiones)
    .filter(([_, d]) => Number(d.items) > 0)
    .sort((a, b) => Number(b[1].promedio) - Number(a[1].promedio));

  if (dimensiones.length === 0) {
    return `
      <p>
        No se dispone de dimensiones válidas para realizar la interpretación.
      </p>
    `;
  }

  const elevadas = dimensiones.filter(
    ([_, d]) => Number(d.promedio) >= 2
  );

  if (elevadas.length === 0) {

    const primera = dimensiones[0];
    const segunda = dimensiones[1];
    const tercera = dimensiones[2];

    return `
      <p>
        Las dimensiones disponibles presentan valores dentro de rangos no elevados desde el punto de vista orientativo.
      </p>

      <p>
        Se observa predominio relativo de la dimensión
        <strong>${primera[0]}</strong>
        (${Number(primera[1].promedio).toFixed(2)})

        ${segunda ? `, seguida por <strong>${segunda[0]}</strong> (${Number(segunda[1].promedio).toFixed(2)})` : ""}

        ${tercera ? ` y <strong>${tercera[0]}</strong> (${Number(tercera[1].promedio).toFixed(2)})` : ""},

        sin alcanzar niveles considerados clínicamente significativos según los criterios automáticos de interpretación utilizados por el sistema.
      </p>

      <p>
        La configuración observada no evidencia un patrón de elevación sintomática específico, sugiriendo un perfil dimensional globalmente conservado dentro de las áreas evaluadas.
      </p>
    `;
  }

  const nombres = elevadas.map(([n]) => n);

  return `
    <p>
      Se observan elevaciones relativas en las dimensiones:
      <strong>${nombres.join(", ")}</strong>.
    </p>

    <p>
      La distribución de los resultados sugiere la presencia de áreas específicas de malestar psicológico que merecen ser consideradas dentro de una evaluación clínica integral.
    </p>

    <p>
      La interpretación definitiva de dichas elevaciones debe realizarse conjuntamente con la entrevista psicológica, antecedentes relevantes y demás elementos de valoración profesional.
    </p>
  `;
}




function generarTablaDimensionesSCL(scl){

  if(!scl || !scl.dimensiones){
    return "<p>No hay dimensiones disponibles.</p>";
  }

  let filas = "";

Object.entries(scl.dimensiones)
  .filter(([nombre, d]) => Number(d.items) > 0)
  .forEach(([nombre,d]) => {

  filas += `
    <tr>

      <td style="padding:8px; border:1px solid #ddd;">
        ${nombre}
      </td>

      <td style="padding:8px; border:1px solid #ddd;">
        ${d.promedio ?? "-"}
      </td>

      <td style="padding:8px; border:1px solid #ddd;">
        ${d.interpretacion ?? "-"}
      </td>

    </tr>
  `;

});



  return `
    <table style="
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
">
      <thead>
        <tr>
          <th style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">
  Dimensión
</th>

<th style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">
  Promedio
</th>

<th style="padding:8px; border:1px solid #ddd; background:#f5f5f5;">
  Interpretación
</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
  `;
}


function generarPerfilGrafico(scl, bdi, bai, desesperanza){

  const ansiedad = Math.round((bai?.puntajeTotal || 0) / 63 * 100);
  const depresion = Math.round((bdi?.puntajeTotal || 0) / 63 * 100);
  const desesperanzaValor = Math.round((desesperanza?.puntajeTotal || 0) / 20 * 100);
  const malestar = Math.round((Number(scl?.gsi || 0)) * 40);

  function barra(nombre, valor){

    return `
      <div style="margin-bottom:15px;">

        <div style="
          display:flex;
          justify-content:space-between;
          margin-bottom:4px;
          font-weight:600;
        ">
          <span>${nombre}</span>
          <span>${valor}%</span>
        </div>

        <div style="
          background:#e5e7eb;
          border-radius:8px;
          overflow:hidden;
          height:20px;
        ">

          <div style="
            width:${Math.min(valor,100)}%;
            height:100%;
            background:linear-gradient(
              90deg,
              #c9a96e,
              #8b6b35
            );
          ">
          </div>

        </div>

      </div>
    `;
  }

  return `

    <div style="
      max-width:700px;
      margin-top:15px;
    ">

      ${barra("Ansiedad", ansiedad)}

      ${barra("Depresión", depresion)}

      ${barra("Desesperanza", desesperanzaValor)}

      ${barra("Malestar Global", malestar)}

    </div>

  `;
}


function generarRadarIntegrado(scl, bdi, bai, desesperanza){

  const ansiedad = Math.round((bai?.puntajeTotal || 0) / 63 * 100);
  const depresion = Math.round((bdi?.puntajeTotal || 0) / 63 * 100);
  const desesperanzaValor = Math.round((desesperanza?.puntajeTotal || 0) / 20 * 100);
  const malestar = Math.min(Math.round((Number(scl?.gsi || 0)) * 40), 100);

  return `
    <div style="
      margin-top:20px;
      padding:18px;
      border:1px solid #ddd;
      border-radius:12px;
      background:#fafafa;
    ">

      <h4 style="margin-top:0;">Radar clínico orientativo</h4>

      <div style="
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:14px;
      ">

        <div><strong>Ansiedad:</strong> ${ansiedad}%</div>
        <div><strong>Depresión:</strong> ${depresion}%</div>
        <div><strong>Desesperanza:</strong> ${desesperanzaValor}%</div>
        <div><strong>Malestar global:</strong> ${malestar}%</div>

      </div>

      <p style="font-size:12px; color:#666;">
  Fecha de emisión:
  ${new Date().toLocaleDateString("es-AR")}
</p>

    </div>
  `;
}


window.imprimirInformeIntegrado = function () {

  const informe =
    document.getElementById("informeIntegrado");

  if (!informe) {
    alert("No se encontró el informe.");
    return;
  }

  const ventana =
    window.open("", "_blank");


ventana.document.write(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Informe Integrado</title>

<style>
  body{
    font-family: Arial, sans-serif;
    padding: 35px;
    color: #222;
    line-height: 1.5;
  }

  .encabezado{
    text-align: center;
    border-bottom: 2px solid #c9a96e;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  .encabezado h1{
    margin: 0;
    font-size: 22px;
    letter-spacing: 1px;
  }

  .encabezado p{
    margin: 6px 0 0;
    font-size: 14px;
    color: #555;
  }

  h2{
    text-align: center;
    margin-top: 10px;
  }

  h3{
    margin-top: 24px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }

  table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
  }

  th,td{
    border:1px solid #ddd;
    padding:8px;
    font-size: 13px;
  }

  th{
    background:#f5f5f5;
  }

  .pie{
    margin-top: 40px;
    border-top: 1px solid #ccc;
    padding-top: 15px;
    font-size: 12px;
    color: #555;
    text-align: center;
  }

  button{
    display:none;
  }
</style>
</head>

<body>

  <div class="encabezado">
  <h1>ESTUDIO PERICIAL PSICOLÓGICO</h1>

  <p>
    Informe Integrado de Evaluación Psicométrica
  </p>

  <p>
    Fecha de emisión:
    ${new Date().toLocaleDateString("es-AR")}
  </p>
</div>

  ${informe.innerHTML}

  <div class="pie">
    Informe generado automáticamente por el sistema institucional de evaluaciones psicométricas.
    <br>
    Los resultados deben ser interpretados por profesional competente dentro de una evaluación integral.
  </div>

</body>
</html>
`);



  ventana.document.close();

  setTimeout(() => {
    ventana.print();
  }, 500);

};
