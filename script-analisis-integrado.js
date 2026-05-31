import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
    <section class="card">

      <h2>Informe integrado</h2>

      <p><strong>Paciente:</strong> ${datos.nombre || "—"}</p>
      <p><strong>DNI:</strong> ${datos.dni || "—"}</p>
      <p><strong>Edad:</strong> ${datos.edad || "—"}</p>
      <p><strong>Sexo:</strong> ${datos.sexo || "—"}</p>

      <hr>

      <h3>Instrumentos disponibles</h3>

      <ul>
        ${scl ? `<li>SCL / BSI: IGS ${scl.gsi || "—"} | PST ${scl.pst || "—"} | PSDI ${scl.psdi || "—"}</li>` : ""}
        ${bdi ? `<li>BDI: ${bdi.puntajeTotal || "—"} puntos | ${bdi.nivel || "—"}</li>` : ""}
        ${bai ? `<li>BAI: ${bai.puntajeTotal || "—"} puntos | ${bai.nivel || "—"}</li>` : ""}
        ${desesperanza ? `<li>Desesperanza: ${desesperanza.puntajeTotal || "—"} puntos | ${desesperanza.nivel || "—"}</li>` : ""}
      </ul>

      <hr>

      <h3>Síntesis clínica orientativa</h3>

      <p>
        Se realiza una lectura integrada de los instrumentos psicométricos disponibles.
        ${
          cantidad === 4
          ? "El análisis cuenta con la totalidad de los cuatro instrumentos previstos."
          : "El análisis se realiza con tres instrumentos disponibles, por lo que debe considerarse parcial."
        }
      </p>

      <p>
        Los resultados deben interpretarse dentro de una evaluación clínica y/o pericial integral,
        considerando entrevista, antecedentes, documentación obrante y criterio profesional.
      </p>

      <hr>

      <h3>Lectura integrada automática</h3>

${generarTextoIntegrado(scl, bdi, bai, desesperanza)}


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

<h3>Perfil Integrado</h3>

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

<hr>

<h3>Lectura por dimensiones SCL / BSI</h3>

${generarLecturaDimensionesSCL(scl)}



<br>

      <button onclick="imprimirInformeIntegrado()">
  Imprimir / guardar PDF
</button>

    </section>
  `;

  informe.scrollIntoView({ behavior: "smooth" });
};

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

  if (
    bai &&
    ["Moderada", "Grave", "Severa"].includes(bai.nivel)
  ) {
    texto += `
      <p>
        Se observan indicadores compatibles con sintomatología ansiosa
        clínicamente significativa según el Inventario de Ansiedad de Beck.
      </p>
    `;
  }

  if (
    bdi &&
    ["Moderada", "Grave", "Severa"].includes(bdi.nivel)
  ) {
    texto += `
      <p>
        Los resultados sugieren la presencia de indicadores depresivos
        clínicamente relevantes al momento de la evaluación.
      </p>
    `;
  }

  if (
    desesperanza &&
    ["Moderada", "Grave", "Severa"].includes(desesperanza.nivel)
  ) {
    texto += `
      <p>
        Se observan expectativas negativas respecto del futuro y una
        visión pesimista de la propia situación vital.
      </p>
    `;
  }

  if (scl && scl.gsi && Number(scl.gsi) >= 1.50) {
    texto += `
      <p>
        El nivel global de malestar psicológico registrado en el SCL/BSI
        resulta elevado y sugiere afectación subjetiva significativa.
      </p>
    `;
  }

  const positivos = [
    bdi && ["Moderada","Grave","Severa"].includes(bdi.nivel),
    bai && ["Moderada","Grave","Severa"].includes(bai.nivel),
    desesperanza && ["Moderada","Grave","Severa"].includes(desesperanza.nivel)
  ].filter(Boolean).length;

  if (positivos >= 2) {
    texto += `
      <p>
        Los instrumentos administrados muestran una adecuada convergencia
        psicométrica, observándose consistencia entre las distintas áreas evaluadas.
      </p>
    `;
  }

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
    return `<p>No se dispone de dimensiones SCL / BSI para integrar.</p>`;
  }

  const dimensiones = Object.entries(scl.dimensiones)
    .filter(([nombre, d]) => Number(d.items) > 0);

  const altas = dimensiones.filter(([nombre, d]) =>
    (d.interpretacion || "").toUpperCase() === "ALTO"
  );

  const elevadasPorPromedio = dimensiones.filter(([nombre, d]) =>
    Number(d.promedio) >= 2.5
  );

  let texto = "";

  if (altas.length > 0) {
    texto += `
      <p>
        En el perfil SCL / BSI se observan elevaciones clínicamente relevantes en:
        <strong>${altas.map(([nombre]) => nombre).join(", ")}</strong>.
      </p>
    `;
  }

  if (elevadasPorPromedio.length > 0) {
  texto += `
    <p>
      La intensidad sintomática predominante se concentra en:
      <strong>${elevadasPorPromedio.map(([nombre]) => nombre).join(", ")}</strong>.
    </p>
  `;
}

  const nombresAltas = altas.map(([nombre]) => nombre.toLowerCase());

  if (
    nombresAltas.includes("ansiedad") &&
    nombresAltas.includes("depresión")
  ) {
    texto += `
      <p>
        La presencia conjunta de elevaciones en ansiedad y depresión sugiere
        un patrón de malestar emocional mixto.
      </p>
    `;
  }

  if (nombresAltas.includes("somatización")) {
    texto += `
      <p>
        Se observan indicadores de somatización, compatibles con la expresión
        corporal del malestar psicológico.
      </p>
    `;
  }

  return texto || `<p>No se detectan elevaciones significativas en las dimensiones disponibles.</p>`;
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

      <p style="font-size:13px; margin-top:14px;">
        Este perfil resume visualmente la intensidad relativa de los indicadores
        principales obtenidos en los instrumentos administrados.
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
