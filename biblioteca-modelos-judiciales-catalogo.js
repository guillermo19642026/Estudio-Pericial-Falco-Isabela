/* =========================================================
   BIBLIOTECA FALCO®
   CATÁLOGO DE MODELOS JUDICIALES Y PROCESALES

   111 modelos
   Ruta física:
   pdf/biblioteca/modelos-judiciales/
========================================================= */


/* =========================================================
   ARCHIVOS REALES DISPONIBLES
========================================================= */

const archivosModelosJudiciales = [

  "01_Aceptacion_Cargo_Perito_Psicologo.pdf",
  "02_Constitucion_Domicilio_Electronico.pdf",
  "03_Constitucion_Domicilio_Procesal.pdf",
  "04_Solicitud_Vinculacion_Expediente_Digital.pdf",
  "05_Solicitud_Acceso_Expediente.pdf",
  "06_Solicitud_Prestamo_Expediente.pdf",
  "07_Excusacion_Cargo_Perito_Psicologo.pdf",
  "08_Renuncia_Cargo_Perito_Psicologo.pdf",
  "09_Solicitud_Aclaracion_Puntos_Pericia.pdf",
  "10_Solicitud_Ampliacion_Puntos_Periciales.pdf",

  "11_Solicitud_Anticipo_Gastos_Pericia.pdf",
  "12_Solicitud_Provision_Fondos.pdf",
  "13_Solicitud_Documentacion_Medica.pdf",
  "14_Solicitud_Historia_Clinica.pdf",
  "15_Solicitud_Antecedentes_Psiquiatricos.pdf",
  "16_Solicitud_Antecedentes_Psicologicos.pdf",
  "17_Solicitud_Documentacion_Laboral.pdf",
  "18_Solicitud_Documentacion_Previsional.pdf",
  "19_Solicitud_Documentacion_Escolar.pdf",
  "20_Solicitud_Documentacion_Complementaria.pdf",

  "21_Fijacion_Entrevistas_Periciales.pdf",
  "22_Notificacion_Entrevista_Presencial.pdf",
  "23_Notificacion_Entrevista_Virtual.pdf",
  "24_Citacion_Actor_Entrevista_Pericial.pdf",
  "25_Citacion_Demandado_Entrevista_Pericial.pdf",
  "26_Citacion_Progenitores_Entrevista_Pericial.pdf",
  "27_Citacion_Menor_Acompanante_Entrevista_Pericial.pdf",
  "28_Reprogramacion_Entrevista_Pericial.pdf",
  "29_Nueva_Fecha_Evaluacion_Psicologica.pdf",
  "30_Citacion_Segunda_Vez_Entrevista_Pericial.pdf",

  "31_Acta_Incomparecencia_Actor.pdf",
  "32_Acta_Incomparecencia_Demandado.pdf",
  "33_Acta_Incomparecencia_Ambas_Partes.pdf",
  "34_Informe_Ausencia_Injustificada.pdf",
  "35_Solicitud_Nueva_Citacion.pdf",
  "36_Solicitud_Intimacion_Para_Concurrir.pdf",
  "37_Solicitud_Suspension_Pericia.pdf",
  "38_Informe_Imposibilidad_Evaluacion.pdf",
  "39_Solicitud_Cierre_Falta_Comparecencia.pdf",
  "40_Solicitud_Resolucion_Incomparecencia.pdf",

  "41_Presentacion_Informe_Pericial_Psicologico.pdf",
  "42_Ampliacion_Informe_Pericial.pdf",
  "43_Aclaracion_Informe_Pericial.pdf",
  "44_Ratificacion_Informe_Pericial.pdf",
  "45_Contestacion_Observaciones.pdf",
  "46_Contestacion_Impugnacion_Pericial.pdf",
  "47_Respuesta_Pedido_Explicaciones.pdf",
  "48_Informe_Complementario.pdf",
  "49_Contestacion_Observaciones_Reiteradas.pdf",
  "50_Solicitud_Cierre_Etapa_Pericial.pdf",

  "51_Solicitud_Regulacion_Honorarios.pdf",
  "52_Solicitud_Regulacion_Provisoria_Honorarios.pdf",
  "53_Solicitud_Regulacion_Complementaria_Honorarios.pdf",
  "54_Aceptacion_Regulacion_Honorarios.pdf",
  "55_Solicitud_Actualizacion_Honorarios.pdf",
  "56_Solicitud_Intimacion_Pago_Honorarios.pdf",
  "57_Solicitud_Embargo_Honorarios.pdf",
  "58_Solicitud_Ejecucion_Honorarios.pdf",
  "59_Liquidacion_Honorarios.pdf",
  "60_Solicitud_Transferencia_Honorarios.pdf",

  "61_Solicitud_Libramiento_Oficio.pdf",
  "62_Solicitud_Reiteracion_Oficio.pdf",
  "63_Solicitud_Pronto_Diligenciamiento_Oficio.pdf",
  "64_Solicitud_Informe_Institucion_Medica.pdf",
  "65_Solicitud_Informe_Institucion_Educativa.pdf",
  "66_Solicitud_Informe_Empleador.pdf",
  "68_Solicitud_Informe_Organismo_Publico.pdf",
  "69_Solicitud_Remision_Documentacion.pdf",
  "70_Agregacion_Documentacion_Recibida.pdf",

  "71_Solicitud_Entrevista_NNyA.pdf",
  "72_Solicitud_Entrevista_Grupo_Familiar.pdf",

  "77_Solicitud_Intervencion_Interdisciplinaria.pdf",
  "78_Solicitud_Participacion_Equipo_Tecnico.pdf",
  "79_Informe_Necesidad_Proteccion_Derechos.pdf",
  "80_Comunicacion_Situacion_Riesgo_Detectada.pdf",
  "81_Indicadores_Violencia_Familiar.pdf",
  "83_Indicadores_Violencia_Genero.pdf",
  "84_Comunicacion_Presunto_Maltrato_Infantil.pdf",
  "85_Comunicacion_Presunto_Abuso_Sexual_Infantil.pdf",
  "86_Solicitud_Medidas_Proteccion_Urgentes.pdf",
  "87_Informe_Revictimizacion.pdf",
  "88_Suspension_Entrevistas_Por_Riesgo.pdf",
  "89_Necesidad_Abordaje_Terapeutico_Urgente.pdf",
  "90_Comunicacion_Riesgo_Autolesivo_Suicida.pdf",

  "91_Contestacion_Impugnacion_Pericial.pdf",
  "92_Contestacion_Pedido_Explicaciones.pdf",
  "93_Aclaracion_Espontanea_Informe_Pericial.pdf",
  "94_Ampliacion_Pericia_Psicologica.pdf",
  "95_Rectificacion_Error_Material.pdf",
  "96_Informe_Complementario.pdf",
  "97_Ratificacion_Pericia_Presentada.pdf",
  "98_Solicitud_Cierre_Actuacion_Pericial.pdf",
  "99_Cumplimiento_Integro_Labor_Pericial.pdf",
  "100_Presentacion_Final_Archivo_Actuacion_Pericial.pdf",

  "101_Pericia_Psicologica_Accidente_Transito.pdf",
  "102_Pericia_Psicologica_Mala_Praxis_Medica.pdf",
  "103_Pericia_Psicologica_Responsabilidad_Profesional.pdf",
  "104_Evaluacion_Dano_Psiquico_Sobreviniente.pdf",
  "105_Determinacion_Incapacidad_Psiquica.pdf",
  "106_Cuantificacion_Incapacidad_Psiquica.pdf",
  "107_Estimacion_Tratamiento_Psicologico_Futuro.pdf",
  "108_Informe_Nexo_Causal_Psicologico.pdf",
  "109_Informe_Concausas_Psicologicas.pdf",
  "110_Evaluacion_Secuelas_Psicologicas_Permanentes.pdf",
  "111_Informe_Simulacion.pdf",
  "112_Informe_Sobresimulacion.pdf",
  "113_Informe_Disimulacion.pdf",
  "114_Agravacion_Dano_Preexistente.pdf",
  "115_Contestacion_Impugnacion_Dano_Psiquico.pdf",
  "116_Informe_Capacidad_Parental.pdf",
  "117_Informe_Habilidades_Parentales.pdf"

];



/* =========================================================
   NÚMERO DESDE NOMBRE DEL ARCHIVO
========================================================= */

function obtenerNumero(
  archivo
) {

  const coincidencia =
    archivo.match(
      /^(\d+)_/
    );


  return coincidencia
    ? Number(
        coincidencia[1]
      )
    : 0;

}



/* =========================================================
   TÍTULO BASE
========================================================= */

function tituloDesdeArchivo(
  archivo
) {

  let titulo =
    archivo
      .replace(
        /^\d+_/,
        ""
      )
      .replace(
        /\.pdf$/i,
        ""
      )
      .replaceAll(
        "_",
        " "
      );


  /* =======================================================
     CORRECCIONES ORTOGRÁFICAS FRECUENTES
  ======================================================= */

  const reemplazos = [

    ["Aceptacion", "Aceptación"],
    ["Constitucion", "Constitución"],
    ["Electronico", "Electrónico"],
    ["Vinculacion", "Vinculación"],
    ["Excusacion", "Excusación"],
    ["Psicologo", "Psicólogo"],
    ["Aclaracion", "Aclaración"],
    ["Ampliacion", "Ampliación"],
    ["Provision", "Provisión"],
    ["Documentacion", "Documentación"],
    ["Medica", "Médica"],
    ["Clinica", "Clínica"],
    ["Psiquiatricos", "Psiquiátricos"],
    ["Psicologicos", "Psicológicos"],
    ["Psicologica", "Psicológica"],
    ["Citacion", "Citación"],
    ["Fijacion", "Fijación"],
    ["Notificacion", "Notificación"],
    ["Reprogramacion", "Reprogramación"],
    ["Evaluacion", "Evaluación"],
    ["Incomparecencia", "Incomparecencia"],
    ["Intimacion", "Intimación"],
    ["Suspension", "Suspensión"],
    ["Resolucion", "Resolución"],
    ["Presentacion", "Presentación"],
    ["Ratificacion", "Ratificación"],
    ["Contestacion", "Contestación"],
    ["Explicaciones", "Explicaciones"],
    ["Regulacion", "Regulación"],
    ["Actualizacion", "Actualización"],
    ["Ejecucion", "Ejecución"],
    ["Liquidacion", "Liquidación"],
    ["Transferencia", "Transferencia"],
    ["Reiteracion", "Reiteración"],
    ["Institucion", "Institución"],
    ["Remision", "Remisión"],
    ["Agregacion", "Agregación"],
    ["Intervencion", "Intervención"],
    ["Participacion", "Participación"],
    ["Tecnico", "Técnico"],
    ["Proteccion", "Protección"],
    ["Comunicacion", "Comunicación"],
    ["Situacion", "Situación"],
    ["Genero", "Género"],
    ["Revictimizacion", "Revictimización"],
    ["Abordaje", "Abordaje"],
    ["Terapeutico", "Terapéutico"],
    ["Autolesivo", "Autolesivo"],
    ["Rectificacion", "Rectificación"],
    ["Integro", "Íntegro"],
    ["Actuacion", "Actuación"],
    ["Transito", "Tránsito"],
    ["Dano", "Daño"],
    ["Psiquico", "Psíquico"],
    ["Psiquica", "Psíquica"],
    ["Cuantificacion", "Cuantificación"],
    ["Estimacion", "Estimación"],
    ["Concausas", "Concausas"],
    ["Simulacion", "Simulación"],
    ["Sobresimulacion", "Sobresimulación"],
    ["Disimulacion", "Disimulación"],
    ["Agravacion", "Agravación"]

  ];


  reemplazos.forEach(
    (
      [
        original,
        corregido
      ]
    ) => {

      titulo =
        titulo.replaceAll(
          original,
          corregido
        );

    }
  );


  return titulo;

}



/* =========================================================
   ÁREA PRINCIPAL POR NÚMERO
========================================================= */

function obtenerArea(
  numero
) {

  if (
    numero <= 10
  ) {

    return "Cargo, expediente y puntos de pericia";

  }


  if (
    numero <= 20
  ) {

    return "Gastos y documentación";

  }


  if (
    numero <= 30
  ) {

    return "Entrevistas y citaciones";

  }


  if (
    numero <= 40
  ) {

    return "Incomparecencias e incidencias";

  }


  if (
    numero <= 50
  ) {

    return "Dictamen, impugnaciones y explicaciones";

  }


  if (
    numero <= 60
  ) {

    return "Honorarios";

  }


  if (
    numero <= 70
  ) {

    return "Oficios y documentación";

  }


  if (
    numero <= 90
  ) {

    return "Familia, NNyA, violencia y riesgo";

  }


  if (
    numero <= 100
  ) {

    return "Actuaciones posteriores y cierre pericial";

  }


  return "Pericias especializadas";

}



/* =========================================================
   FUEROS APLICABLES
========================================================= */

function obtenerFueros(
  numero,
  titulo
) {

  const texto =
    titulo.toLowerCase();


  /* =======================================================
     FAMILIA / NNyA
  ======================================================= */

  if (
    (
      numero >= 71 &&
      numero <= 90
    )

    ||

    numero === 116

    ||

    numero === 117
  ) {

    return [
      "Familia"
    ];

  }


  /* =======================================================
     MODELOS ESPECÍFICAMENTE CIVILES
  ======================================================= */

  if (
    texto.includes(
      "accidente tránsito"
    )

    ||

    texto.includes(
      "mala praxis"
    )

    ||

    texto.includes(
      "responsabilidad profesional"
    )
  ) {

    return [
      "Civil"
    ];

  }


  /* =======================================================
     DAÑO PSÍQUICO / INCAPACIDAD / NEXO /
     SIMULACIÓN
     UTILIZABLES EN CIVIL Y LABORAL
  ======================================================= */

  if (
    texto.includes(
      "daño psíquico"
    )

    ||

    texto.includes(
      "incapacidad psíquica"
    )

    ||

    texto.includes(
      "tratamiento psicológico"
    )

    ||

    texto.includes(
      "nexo causal"
    )

    ||

    texto.includes(
      "concausas"
    )

    ||

    texto.includes(
      "secuelas psicológicas"
    )

    ||

    texto.includes(
      "simulación"
    )

    ||

    texto.includes(
      "sobresimulación"
    )

    ||

    texto.includes(
      "disimulación"
    )

    ||

    texto.includes(
      "agravación daño"
    )

    ||

    texto.includes(
      "impugnación daño psíquico"
    )
  ) {

    return [
      "Civil",
      "Laboral"
    ];

  }


  /* =======================================================
     DOCUMENTACIÓN ESPECÍFICAMENTE LABORAL
  ======================================================= */

  if (
    texto.includes(
      "documentación laboral"
    )

    ||

    texto.includes(
      "empleador"
    )
  ) {

    return [
      "Laboral",
      "Civil"
    ];

  }


  /* =======================================================
     MODELOS PROCESALES GENERALES
     APLICABLES A CIVIL Y LABORAL
  ======================================================= */

  return [
    "Civil",
    "Laboral"
  ];

}



/* =========================================================
   TIPO DE ESCRITO
========================================================= */

function obtenerTipoEscrito(
  titulo
) {

  const texto =
    titulo.toLowerCase();


  if (
    texto.includes(
      "aceptación cargo"
    )
  ) {

    return "Aceptación de cargo";

  }


  if (
    texto.includes(
      "excusación"
    )
  ) {

    return "Excusación";

  }


  if (
    texto.includes(
      "renuncia cargo"
    )
  ) {

    return "Renuncia al cargo";

  }


  if (
    texto.includes(
      "anticipo gastos"
    )

    ||

    texto.includes(
      "provisión fondos"
    )
  ) {

    return "Anticipo de gastos";

  }


  if (
    texto.includes(
      "puntos pericia"
    )

    ||

    texto.includes(
      "puntos periciales"
    )
  ) {

    return "Puntos de pericia";

  }


  if (
    texto.includes(
      "entrevista"
    )

    ||

    texto.includes(
      "citación"
    )

    ||

    texto.includes(
      "nueva fecha"
    )
  ) {

    return "Entrevistas y citaciones";

  }


  if (
    texto.includes(
      "incomparecencia"
    )

    ||

    texto.includes(
      "ausencia injustificada"
    )

    ||

    texto.includes(
      "falta comparecencia"
    )
  ) {

    return "Incomparecencia";

  }


  if (
    texto.includes(
      "impugnación"
    )
  ) {

    return "Impugnaciones";

  }


  if (
    texto.includes(
      "pedido explicaciones"
    )

    ||

    texto.includes(
      "explicaciones"
    )
  ) {

    return "Explicaciones";

  }


  if (
    texto.includes(
      "ratificación"
    )
  ) {

    return "Ratificación";

  }


  if (
    texto.includes(
      "ampliación"
    )
  ) {

    return "Ampliación";

  }


  if (
    texto.includes(
      "aclaración"
    )
  ) {

    return "Aclaración";

  }


  if (
    texto.includes(
      "observaciones"
    )
  ) {

    return "Contestación de observaciones";

  }


  if (
    texto.includes(
      "informe complementario"
    )
  ) {

    return "Informe complementario";

  }


  if (
    texto.includes(
      "honorarios"
    )
  ) {

    return "Honorarios";

  }


  if (
    texto.includes(
      "oficio"
    )
  ) {

    return "Oficios";

  }


  if (
    texto.includes(
      "documentación"
    )

    ||

    texto.includes(
      "historia clínica"
    )

    ||

    texto.includes(
      "antecedentes"
    )
  ) {

    return "Documentación";

  }


  if (
    texto.includes(
      "violencia"
    )

    ||

    texto.includes(
      "riesgo"
    )

    ||

    texto.includes(
      "maltrato"
    )

    ||

    texto.includes(
      "abuso sexual"
    )

    ||

    texto.includes(
      "revictimización"
    )
  ) {

    return "Riesgo y protección";

  }


  if (
    texto.includes(
      "daño psíquico"
    )

    ||

    texto.includes(
      "incapacidad"
    )

    ||

    texto.includes(
      "nexo causal"
    )

    ||

    texto.includes(
      "concausas"
    )

    ||

    texto.includes(
      "secuelas"
    )
  ) {

    return "Daño psíquico";

  }


  if (
    texto.includes(
      "simulación"
    )

    ||

    texto.includes(
      "sobresimulación"
    )

    ||

    texto.includes(
      "disimulación"
    )
  ) {

    return "Simulación y validez";

  }


  if (
    texto.includes(
      "capacidad parental"
    )

    ||

    texto.includes(
      "habilidades parentales"
    )
  ) {

    return "Parentalidad";

  }


  if (
    texto.includes(
      "pericia psicológica"
    )

    ||

    texto.includes(
      "informe pericial"
    )
  ) {

    return "Pericia psicológica";

  }


  return "Presentación judicial";

}



/* =========================================================
   TAGS AUTOMÁTICOS
========================================================= */

function crearTags(
  area,
  tipo,
  fueros,
  titulo
) {

  const tags =
    new Set();


  tags.add(
    "escritos"
  );


  tags.add(
    "modelos judiciales"
  );


  tags.add(
    "perito psicólogo"
  );


  tags.add(
    area.toLowerCase()
  );


  tags.add(
    tipo.toLowerCase()
  );


  /* =======================================================
     AGREGAR TODOS LOS FUEROS
  ======================================================= */

  if (
    Array.isArray(
      fueros
    )
  ) {

    fueros.forEach(
      fuero => {

        tags.add(
          fuero.toLowerCase()
        );

      }
    );

  }


  /* =======================================================
     PALABRAS IMPORTANTES DEL TÍTULO
  ======================================================= */

  const palabras =
    titulo
      .toLowerCase()
      .split(/\s+/)
      .filter(
        palabra =>
          palabra.length >= 5
      );


  palabras
    .slice(
      0,
      5
    )
    .forEach(
      palabra => {

        tags.add(
          palabra
        );

      }
    );


  return Array
    .from(
      tags
    )
    .join(
      ", "
    );

}



/* =========================================================
   DESCRIPCIÓN
========================================================= */

function crearDescripcion(
  titulo,
  area
) {

  return (
    `${titulo}. Modelo orientativo perteneciente a la colección ` +
    `"${area}" de Biblioteca FALCO®, destinado a la práctica ` +
    `profesional y pericial.`
  );

}



/* =========================================================
   CONSTRUCCIÓN DEL CATÁLOGO
========================================================= */

export const modelosJudicialesBiblioteca =

  archivosModelosJudiciales.map(
    archivo => {

      const numero =
        obtenerNumero(
          archivo
        );


      const numeroTexto =
        String(
          numero
        )
          .padStart(
            3,
            "0"
          );


      const titulo =
        tituloDesdeArchivo(
          archivo
        );


      const area =
        obtenerArea(
          numero
        );


     const fueros =
  obtenerFueros(
    numero,
    titulo
  );


const fuero =
  fueros.join(
    " · "
  );


      const tipoEscrito =
        obtenerTipoEscrito(
          titulo
        );


      return {

        id:
          `biblioteca-modelo-${numeroTexto}`,

        numero,

        codigo:
          `MOD-${numeroTexto}`,

        titulo,

        archivo,

        modulo:
          "biblioteca",

        activo:
          true,

        tipoContenido:
          "escrito",

        tipo:
          "pdf",

        icono:
          "📄",

        categoria:
          "Escritos profesionales",

        coleccion:
          "Modelos judiciales y procesales",

        subcategoria:
          area,

        area,

        fuero,

fueros,

tipoEscrito,

        descripcion:
          crearDescripcion(
            titulo,
            area
          ),

        autor:
          "Estudio Pericial Psicológico FALCO®",

        fechaActualizacion:
          "2026",

       tags:
  crearTags(
    area,
    tipoEscrito,
    fueros,
    titulo
  ),

        rolesPermitidos: [

          "admin",

          "biblioteca",

          "perito",

          "profesional"

        ],

        urlPdf:
          `pdf/biblioteca/modelos-judiciales/${archivo}`

      };

    }

  );



/* =========================================================
   ORDEN NUMÉRICO
========================================================= */

modelosJudicialesBiblioteca.sort(
  (
    a,
    b
  ) =>
    a.numero - b.numero
);



/* =========================================================
   RESUMEN
========================================================= */

export const resumenModelosJudiciales = {

  total:
    modelosJudicialesBiblioteca.length,

  coleccion:
    "Modelos judiciales y procesales",

  categorias: {

    cargoExpediente:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero <= 10
        )
        .length,

    gastosDocumentacion:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 11 &&
            item.numero <= 20
        )
        .length,

    entrevistas:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 21 &&
            item.numero <= 30
        )
        .length,

    incomparecencias:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 31 &&
            item.numero <= 40
        )
        .length,

    dictamen:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 41 &&
            item.numero <= 50
        )
        .length,

    honorarios:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 51 &&
            item.numero <= 60
        )
        .length,

    oficios:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 61 &&
            item.numero <= 70
        )
        .length,

    familia:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 71 &&
            item.numero <= 90
        )
        .length,

    cierrePericial:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 91 &&
            item.numero <= 100
        )
        .length,

    especializados:
      modelosJudicialesBiblioteca
        .filter(
          item =>
            item.numero >= 101
        )
        .length

  }

};



/* =========================================================
   CONTROL DE INTEGRIDAD
========================================================= */

if (
  modelosJudicialesBiblioteca.length !==
  111
) {

  console.warn(

    "⚠️ Biblioteca FALCO®: se esperaban 111 modelos y se encontraron:",

    modelosJudicialesBiblioteca.length

  );

}
else {

  console.log(

    "✅ Biblioteca FALCO® · 111 modelos judiciales preparados"

  );

}


console.table(
  modelosJudicialesBiblioteca.map(
    item => ({

      codigo:
        item.codigo,

      titulo:
        item.titulo,

      area:
        item.area,

      fuero:
        item.fuero,

      tipo:
        item.tipoEscrito

    })
  )
);