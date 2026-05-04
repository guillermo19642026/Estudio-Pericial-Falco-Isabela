window.generarPDFClinico = function (datos) {
  const informe = document.getElementById("informeClinico");

  if (!informe) {
    alert("No existe el contenedor informeClinico en el HTML.");
    return;
  }

  informe.innerHTML = `
    <div class="pdf-container">

      <div class="pdf-header">
        <h1>INFORME PSICOLÓGICO</h1>
        <p>Estudio Pericial Psicológico</p>
      </div>

      <hr>

      <h2>Datos del evaluado</h2>
      <p><strong>Nombre:</strong> ${datos.nombre || "—"}</p>
      <p><strong>Edad:</strong> ${datos.edad || "—"}</p>
      <p><strong>Sexo:</strong> ${datos.sexo || "—"}</p>
      <p><strong>Fecha:</strong> ${datos.fecha || "—"}</p>

      <hr>

      <h2>Instrumento administrado</h2>
      <p>${datos.test || "—"}</p>

      <hr>

      <h2>Resultados</h2>
      ${datos.resultadosHTML || ""}

      <hr>

      <h2>Interpretación orientativa</h2>
      ${datos.interpretacionHTML || "<p>—</p>"}

      <hr>

      <h2>Observaciones</h2>
      <p>${datos.observaciones || "—"}</p>

      <hr>

      <h2>Consideraciones</h2>
      <p>
        Los resultados obtenidos deben interpretarse dentro de una evaluación clínica integral.
        Este informe no reemplaza entrevista clínica, juicio profesional, antecedentes del evaluado,
        baremos oficiales ni evaluación de riesgo.
      </p>

      <div class="firma">
        <p>________________________________</p>
    
        <p>Lic. en Psicología</p>
      </div>

      <p class="nota">
        Informe generado automáticamente por sistema de evaluaciones psicométricas.
      </p>

    </div>
  `;

 informe.style.display = "block";
informe.classList.remove("print-only");

informe.insertAdjacentHTML("beforeend", `
  <div class="acciones-informe" style="margin-top:20px; text-align:center;">
    <button onclick="window.print()">
      Imprimir / guardar PDF
    </button>
  </div>
`);

informe.scrollIntoView({ behavior: "smooth" });
};