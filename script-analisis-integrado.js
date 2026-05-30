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

      <br>

      <button onclick="window.print()">
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