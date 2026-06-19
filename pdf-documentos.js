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

  function valor(v) {
    return v && String(v).trim() !== "" ? v : "—";
  }

  function campo(label, value) {
    return `
      <div class="campo">
        <div class="etiqueta">${label}</div>
        <div class="valor">${valor(value)}</div>
      </div>
    `;
  }

  function seccion(titulo, contenido) {
    return `
      <section class="seccion">
        <h2>${titulo}</h2>
        <div class="grid-datos">
          ${contenido}
        </div>
      </section>
    `;
  }

  let contenido = "";

  if (docu.tipo === "ficha_integral_periciado") {

    contenido = `
      ${seccion("Datos personales", `
        ${campo("Nombre", docu.nombre)}
        ${campo("DNI", docu.dni)}
        ${campo("CUIL/CUIT", docu.cuil)}
        ${campo("Fecha de nacimiento", docu.fechaNacimiento)}
        ${campo("Lugar de nacimiento", docu.lugarNacimiento)}
        ${campo("Edad", docu.edad)}
        ${campo("Estado civil", docu.estadoCivil)}
        ${campo("Domicilio", docu.domicilio)}
        ${campo("Teléfono", docu.telefono)}
        ${campo("Email", docu.email)}
      `)}

      ${seccion("Datos judiciales y administrativos", `
        ${campo("Carátula", docu.caratula)}
        ${campo("Expediente", docu.expediente)}
        ${campo("Juzgado / Tribunal", docu.juzgado)}
        ${campo("Demandado", docu.demandado)}
        ${campo("Abogado", docu.abogado)}
        ${campo("Teléfono abogado", docu.telefonoAbogado)}
        ${campo("Email abogado", docu.emailAbogado)}
        ${campo("Motivo de demanda", docu.motivoDemanda)}
        ${campo("Relato de hechos", docu.relatoHechos)}
        ${campo("Consecuencia principal", docu.consecuenciaPrincipal)}
        ${campo("Juicios previos", docu.juiciosPrevios)}
        ${campo("Otros reclamos", docu.otrosReclamos)}
      `)}

      ${seccion("Grupo familiar y conviviente", `
        ${campo("Convivencia", docu.convivencia)}
        ${campo("Tiene hijos", docu.tieneHijos)}
        ${campo("Cantidad de hijos", docu.cantidadHijos)}
        ${campo("Hijos", docu.hijos)}
        ${campo("Tiene hermanos", docu.tieneHermanos)}
        ${campo("Cantidad de hermanos", docu.cantidadHermanos)}
        ${campo("Hermanos", docu.hermanos)}
        ${campo("Padres", docu.padres)}
        ${campo("Abuelos", docu.abuelos)}
      `)}

      ${seccion("Familia extendida", `
        ${campo("Tíos, primos y otros familiares", docu.tiosPrimos)}
        ${campo("Familia política", docu.familiaPolitica)}
        ${campo("Personas significativas", docu.personasSignificativas)}
      `)}

      ${seccion("Estudios y formación", `
        ${campo("Nivel educativo", docu.nivelEstudios)}
        ${campo("Estudios", docu.estudios)}
      `)}

      ${seccion("Áreas de funcionamiento", `
        ${campo("Área social", docu.areaSocial)}
        ${campo("Área recreativa", docu.areaRecreativa)}
        ${campo("Área laboral", docu.areaLaboral)}
        ${campo("Situación laboral actual", docu.situacionLaboralActual)}
        ${campo("Tratamiento por el hecho reclamado", docu.tratamientoPorHecho)}
      `)}

      ${seccion("Antecedentes relacionados con el hecho", `
        ${campo("Operaciones relacionadas con el hecho", docu.operacionesHecho)}
        ${campo("Tratamiento clínico", docu.tratamientoClinico)}
        ${campo("Tratamiento psicológico por el hecho", docu.tratamientoPsicologicoHecho)}
        ${campo("Tratamiento psiquiátrico por el hecho", docu.tratamientoPsiquiatricoHecho)}
        ${campo("Tratamiento traumatológico", docu.tratamientoTraumatologico)}
        ${campo("Tratamiento médico actual por el hecho", docu.tratamientoActualHecho)}
        ${campo("Consumo habitual de alcohol", docu.consumoAlcohol)}
        ${campo("Antecedentes de consumo de sustancias psicoactivas", docu.consumoDrogas)}
        ${campo("Detalle de tratamientos", docu.detalleTratamientos)}
      `)}

      ${seccion("Antecedentes de salud y tratamientos", `
        ${campo("Tratamientos psicológicos previos o actuales", docu.tratamientoPsicologico)}
        ${campo("Tratamientos psiquiátricos previos o actuales", docu.tratamientoPsiquiatrico)}
        ${campo("Medicación actual", docu.medicacion)}
        ${campo("Antecedentes médicos relevantes", docu.antecedentesMedicos)}
        ${campo("CUD", docu.cud)}
      `)}

      ${seccion("Historia personal relevante", `
        ${campo("Acontecimientos importantes", docu.historiaPersonal)}
      `)}

      ${seccion("Observaciones finales", `
        ${campo("Información adicional", docu.observaciones)}
      `)}
    `;

  } else if (docu.tipo === "consentimiento_informado") {

    contenido = `
      ${seccion("Consentimiento informado", `
        ${campo("Nombre", docu.nombre)}
        ${campo("DNI", docu.dni)}
        ${campo("Ordenado por", docu.ordenadoPor)}
        ${campo("Aceptación", docu.aceptado ? "Sí" : "No")}
      `)}

      <p class="texto">
        Sr./Sra. <strong>${valor(docu.nombre)}</strong>, DNI <strong>${valor(docu.dni)}</strong>,
        manifiesta haber sido informado/a por la Lic. Isabela Falco acerca de las características
        generales, alcances, modalidad, finalidad y condiciones de la pericia psicológica.
      </p>

      <p class="texto">
        En consecuencia, presta consentimiento para la realización de la evaluación psicológica pericial.
      </p>
    `;

  } else {

    contenido = `
      ${seccion("Constancia de tratamiento", `
        ${campo("Nombre", docu.nombre)}
        ${campo("DNI", docu.dni)}
        ${campo("¿Se encuentra en tratamiento?", docu.enTratamiento)}
        ${campo("Tipo de tratamiento", docu.tipoTratamiento)}
        ${campo("Medicación psiquiátrica", docu.medicacion)}
        ${campo("Profesional tratante", docu.profesional)}
        ${campo("Observaciones", docu.observaciones)}
        ${campo("Declaración jurada", docu.declaracionJurada ? "Sí" : "No")}
      `)}
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
          margin: 0;
          padding: 42px;
          color: #1f2933;
          line-height: 1.55;
          background: #ffffff;
        }

        body::before {
          content: "FALCO®";
          position: fixed;
          top: 42%;
          left: 12%;
          font-size: 110px;
          font-weight: 700;
          color: rgba(201, 168, 106, 0.08);
          transform: rotate(-24deg);
          z-index: -1;
        }

        .print-btn {
          position: fixed;
          top: 18px;
          right: 18px;
          background: #b8934a;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .encabezado {
          border-bottom: 3px solid #c9a86a;
          padding-bottom: 18px;
          margin-bottom: 26px;
        }

        .marca {
          font-size: 24px;
          font-weight: 700;
          color: #1f2933;
          margin-bottom: 4px;
        }

        .submarca {
          color: #6b7280;
          font-size: 14px;
        }

        .titulo-doc {
          margin: 26px 0 18px;
          padding: 16px 18px;
          background: #f8f5ee;
          border-left: 5px solid #c9a86a;
          border-radius: 10px;
        }

        .titulo-doc h1 {
          margin: 0;
          font-size: 22px;
          color: #2f2f2f;
        }

        .resumen {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 20px;
          margin: 22px 0;
          padding: 16px 18px;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }

        .resumen p {
          margin: 0;
          font-size: 14px;
        }

        .seccion {
          margin: 22px 0;
          padding: 16px 18px;
          border: 1px solid #e6e0d2;
          border-radius: 12px;
          background: rgba(250, 250, 250, .92);
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .seccion h2 {
          margin: 0 0 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd3bd;
          color: #8b6a2b;
          font-size: 18px;
        }

        .grid-datos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
        }

        .campo {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .etiqueta {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .04em;
          color: #6b7280;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .valor {
          font-size: 14px;
          color: #1f2933;
          white-space: pre-wrap;
        }

        .texto {
          font-size: 15px;
          margin: 18px 0;
        }

        .nota {
          margin-top: 30px;
          padding-top: 14px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #555;
        }

        .firma-institucional {
          margin-top: 34px;
          font-size: 13px;
          color: #444;
        }

        @media print {
          .print-btn {
            display: none;
          }

          body {
            padding: 28px;
          }

          .seccion {
            break-inside: avoid;
          }
        }

        @media (max-width: 700px) {
          .grid-datos,
          .resumen {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>

    <body>

      <button class="print-btn" onclick="window.print()">Imprimir / guardar PDF</button>

      <div class="encabezado">
        <div class="marca">Lic. Isabela Falco</div>
        <div class="submarca">Pericias Psicológicas Forenses · Plataforma Institucional</div>
      </div>

      <div class="titulo-doc">
        <h1>${tipo}</h1>
      </div>

      <div class="resumen">
        <p><strong>Nombre:</strong> ${valor(docu.nombre)}</p>
        <p><strong>DNI:</strong> ${valor(docu.dni)}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString("es-AR")}</p>
      </div>

      ${contenido}

      <div class="firma-institucional">
        <strong>Documento generado digitalmente desde la plataforma institucional.</strong><br>
        Lic. Isabela Falco · Pericias Psicológicas Forenses
      </div>

      <p class="nota">
        Este documento reproduce la información cargada digitalmente por el usuario/periciado en la plataforma.
      </p>

    </body>
    </html>
  `);

  ventana.document.close();
};