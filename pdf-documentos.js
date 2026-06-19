window.generarPDFDocumento = function (docu) {

  const ventana = window.open("", "_blank");

  let tipo = "";

  if (docu.tipo === "consentimiento_informado") {
    tipo = "Consentimiento informado de pericia psicológica";
  } else if (docu.tipo === "constancia_tratamiento") {
    tipo = "Constancia de tratamiento";
  } else if (docu.tipo === "ficha_integral_periciado") {
    tipo = "Ficha integral del periciado";
  } else {
    tipo = "Documento pericial";
  }

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



} else if (docu.tipo === "ficha_integral_periciado") {

  contenido = `
    <h2>Ficha integral del periciado</h2>

    <h2>Datos personales</h2>
    <p><strong>Nombre:</strong> ${docu.nombre || "—"}</p>
    <p><strong>DNI:</strong> ${docu.dni || "—"}</p>
    <p><strong>CUIL/CUIT:</strong> ${docu.cuil || "—"}</p>
    <p><strong>Fecha de nacimiento:</strong> ${docu.fechaNacimiento || "—"}</p>
    <p><strong>Lugar de nacimiento:</strong> ${docu.lugarNacimiento || "—"}</p>
    <p><strong>Edad:</strong> ${docu.edad || "—"}</p>
    <p><strong>Estado civil:</strong> ${docu.estadoCivil || "—"}</p>
    <p><strong>Domicilio:</strong> ${docu.domicilio || "—"}</p>
    <p><strong>Teléfono:</strong> ${docu.telefono || "—"}</p>
    <p><strong>Email:</strong> ${docu.email || "—"}</p>

    <h2>Datos judiciales y administrativos</h2>
    <p><strong>Carátula:</strong> ${docu.caratula || "—"}</p>
    <p><strong>Expediente:</strong> ${docu.expediente || "—"}</p>
    <p><strong>Juzgado / Tribunal:</strong> ${docu.juzgado || "—"}</p>
    <p><strong>Demandado:</strong> ${docu.demandado || "—"}</p>
    <p><strong>Abogado:</strong> ${docu.abogado || "—"}</p>
    <p><strong>Teléfono abogado:</strong> ${docu.telefonoAbogado || "—"}</p>
    <p><strong>Email abogado:</strong> ${docu.emailAbogado || "—"}</p>
    <p><strong>Motivo de demanda:</strong> ${docu.motivoDemanda || "—"}</p>
    <p><strong>Relato de hechos:</strong> ${docu.relatoHechos || "—"}</p>
    <p><strong>Consecuencia principal:</strong> ${docu.consecuenciaPrincipal || "—"}</p>
    <p><strong>Juicios previos:</strong> ${docu.juiciosPrevios || "—"}</p>
    <p><strong>Otros reclamos:</strong> ${docu.otrosReclamos || "—"}</p>

    <h2>Grupo familiar y conviviente</h2>
    <p><strong>Convivencia:</strong> ${docu.convivencia || "—"}</p>
    <p><strong>Tiene hijos:</strong> ${docu.tieneHijos || "—"}</p>
    <p><strong>Cantidad de hijos:</strong> ${docu.cantidadHijos || "—"}</p>
    <p><strong>Hijos:</strong> ${docu.hijos || "—"}</p>
    <p><strong>Tiene hermanos:</strong> ${docu.tieneHermanos || "—"}</p>
    <p><strong>Cantidad de hermanos:</strong> ${docu.cantidadHermanos || "—"}</p>
    <p><strong>Hermanos:</strong> ${docu.hermanos || "—"}</p>
    <p><strong>Padres:</strong> ${docu.padres || "—"}</p>
    <p><strong>Abuelos:</strong> ${docu.abuelos || "—"}</p>

    <h2>Familia extendida</h2>
    <p><strong>Tíos, primos y otros familiares:</strong> ${docu.tiosPrimos || "—"}</p>
    <p><strong>Familia política:</strong> ${docu.familiaPolitica || "—"}</p>
    <p><strong>Personas significativas:</strong> ${docu.personasSignificativas || "—"}</p>

    <h2>Estudios y formación</h2>
    <p><strong>Nivel educativo:</strong> ${docu.nivelEstudios || "—"}</p>
    <p><strong>Estudios:</strong> ${docu.estudios || "—"}</p>

    <h2>Áreas de funcionamiento</h2>
    <p><strong>Área social:</strong> ${docu.areaSocial || "—"}</p>
    <p><strong>Área recreativa:</strong> ${docu.areaRecreativa || "—"}</p>
    <p><strong>Área laboral:</strong> ${docu.areaLaboral || "—"}</p>
    <p><strong>Situación laboral actual:</strong> ${docu.situacionLaboralActual || "—"}</p>
    <p><strong>Tratamiento por el hecho reclamado:</strong> ${docu.tratamientoPorHecho || "—"}</p>

    <h2>Antecedentes relacionados con el hecho</h2>
    <p><strong>Operaciones relacionadas con el hecho:</strong> ${docu.operacionesHecho || "—"}</p>
    <p><strong>Tratamiento clínico:</strong> ${docu.tratamientoClinico || "—"}</p>
    <p><strong>Tratamiento psicológico por el hecho:</strong> ${docu.tratamientoPsicologicoHecho || "—"}</p>
    <p><strong>Tratamiento psiquiátrico por el hecho:</strong> ${docu.tratamientoPsiquiatricoHecho || "—"}</p>
    <p><strong>Tratamiento traumatológico:</strong> ${docu.tratamientoTraumatologico || "—"}</p>
    <p><strong>Tratamiento médico actual por el hecho:</strong> ${docu.tratamientoActualHecho || "—"}</p>
    <p><strong>Consumo habitual de alcohol:</strong> ${docu.consumoAlcohol || "—"}</p>
    <p><strong>Antecedentes de consumo de sustancias psicoactivas:</strong> ${docu.consumoDrogas || "—"}</p>
    <p><strong>Detalle de tratamientos:</strong> ${docu.detalleTratamientos || "—"}</p>

    <h2>Antecedentes de salud y tratamientos</h2>
    <p><strong>Tratamientos psicológicos previos o actuales:</strong> ${docu.tratamientoPsicologico || "—"}</p>
    <p><strong>Tratamientos psiquiátricos previos o actuales:</strong> ${docu.tratamientoPsiquiatrico || "—"}</p>
    <p><strong>Medicación actual:</strong> ${docu.medicacion || "—"}</p>
    <p><strong>Antecedentes médicos relevantes:</strong> ${docu.antecedentesMedicos || "—"}</p>
    <p><strong>CUD:</strong> ${docu.cud || "—"}</p>

    <h2>Historia personal relevante</h2>
    <p>${docu.historiaPersonal || "—"}</p>

    <h2>Observaciones finales</h2>
    <p>${docu.observaciones || "—"}</p>
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