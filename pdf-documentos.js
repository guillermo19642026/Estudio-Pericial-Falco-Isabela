window.generarPDFDocumento = function (docu) {

  const ventana = window.open("", "_blank");

  const tipo =
    docu.tipo === "consentimiento_informado"
      ? "Consentimiento informado de pericia psicológica"
      : "Constancia de tratamiento";

  let contenido = "";

  if (docu.tipo === "consentimiento_informado") {

    contenido = `
      <h2>Consentimiento informado de pericia psicológica</h2>

      <p>
        Sr./Sra. <strong>${docu.nombre || "—"}</strong>,
        DNI <strong>${docu.dni || "—"}</strong>, manifiesta haber sido informado/a
        por la Lic. Isabela Falco acerca de las características generales,
        alcances, modalidad, finalidad y condiciones de la pericia psicológica.
      </p>

      <p>
        Declara haber comprendido la información recibida y haber tenido
        oportunidad de formular las preguntas que consideró necesarias.
      </p>

      <p>
        En consecuencia, presta consentimiento para la realización de la
        pericia psicológica, autorizando a la profesional interviniente
        a llevar adelante las tareas propias de la evaluación.
      </p>

      <p><strong>Ordenado por:</strong> ${docu.ordenadoPor || "—"}</p>
      <p><strong>Aceptación:</strong> ${docu.aceptado ? "Sí" : "No"}</p>
    `;

  } else {

    contenido = `
      <h2>Constancia de tratamiento</h2>

      <p>
        Sr./Sra. <strong>${docu.nombre || "—"}</strong>,
        DNI <strong>${docu.dni || "—"}</strong>, declara bajo juramento
        la siguiente información:
      </p>

      <p><strong>¿Se encuentra en tratamiento?</strong> ${docu.enTratamiento || "—"}</p>
      <p><strong>Tipo de tratamiento:</strong> ${docu.tipoTratamiento || "—"}</p>
      <p><strong>Medicación psiquiátrica:</strong> ${docu.medicacion || "—"}</p>
      <p><strong>Profesional tratante:</strong> ${docu.profesional || "—"}</p>
      <p><strong>Observaciones:</strong> ${docu.observaciones || "—"}</p>
      <p><strong>Declaración jurada:</strong> ${docu.declaracionJurada ? "Sí" : "No"}</p>
    `;
  }

  ventana.document.write(`
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>${tipo}</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #111;
          line-height: 1.6;
        }

        .encabezado {
          border-bottom: 2px solid #c9a86a;
          margin-bottom: 30px;
          padding-bottom: 16px;
        }

        h1 {
          font-size: 22px;
          margin-bottom: 4px;
        }

        h2 {
          font-size: 18px;
          margin-top: 26px;
        }

        .datos {
          margin: 24px 0;
          padding: 16px;
          border: 1px solid #ddd;
          background: #f8f8f8;
        }

        .firma {
          margin-top: 60px;
        }

        .linea {
          border-top: 1px solid #111;
          width: 260px;
          margin-top: 40px;
        }

        .nota {
          margin-top: 30px;
          font-size: 12px;
          color: #555;
        }

        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>

    <body>

      <button onclick="window.print()">Imprimir / guardar PDF</button>

      <div class="encabezado">
        <h1>Lic. Isabela Falco</h1>
        <div>Pericias Psicológicas Forenses</div>
      </div>

      <h1>${tipo}</h1>

      <div class="datos">
        <p><strong>Nombre:</strong> ${docu.nombre || "—"}</p>
        <p><strong>DNI:</strong> ${docu.dni || "—"}</p>
        <p><strong>Fecha:</strong> ${docu.fecha || "—"}</p>
        <p><strong>Firma / aclaración:</strong> ${docu.firma || "—"}</p>
        <p><strong>Foto DNI:</strong> ${docu.fotoDniNombre || docu.fotoDni || "—"}</p>
      </div>

      ${contenido}

      <div class="firma">
        <div class="linea"></div>
        <p>Firma / aclaración: ${docu.firma || "—"}</p>
        <p>DNI: ${docu.dni || "—"}</p>
      </div>

      <p class="nota">
        Documento generado digitalmente desde la plataforma institucional.
      </p>

    </body>
    </html>
  `);

  ventana.document.close();
};