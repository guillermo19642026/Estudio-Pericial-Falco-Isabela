/* =========================================================
   BIBLIOTECA FALCO®
   CATÁLOGO DE TÉCNICAS E INSTRUMENTOS
   Versión 2026

   IMPORTANTE:
   Las fichas contienen exclusivamente información
   técnica, metodológica y profesional.

   No se reproducen:
   - ítems
   - protocolos
   - estímulos protegidos
   - claves de corrección
   - tablas
   - baremos
   - algoritmos propietarios
========================================================= */


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const AUTOR_BIBLIOTECA =
  "Biblioteca FALCO® · Estudio Pericial Psicológico FALCO®";


const ROLES_PROFESIONALES = [
  "admin",
  "biblioteca",
  "perito",
  "profesional"
];



/* =========================================================
   GENERADOR DE FICHA
========================================================= */

function crearFichaInstrumento({

  id,

  codigo,

  titulo,

  sigla = "",

  nombreCompleto = "",

  autores = "",

  categoriaTecnica = "",

  tipoInstrumento = "",

  area = "",

  poblacion = "",

  modalidad = "",

  tiempo = "",

  cantidadItems = "",

  finalidad = "",

  queEvalua = "",

  administracionDetalle = "",

  modalidadRespuesta = "",

  correccion = "",

  analisis = "",

  interpretacion = "",

  usoForense = "",

  validez = "",

  limitaciones = "",

  integracionPericial = "",

  erroresFrecuentes = "",

  ejemploIntegracion = "",

  bibliografia = "",

  fuenteOficial = "",

  materialProtegido = true,

  reproduccionItems =
    "No autorizada en Biblioteca FALCO®",

  accesoMaterial =
    "Consultar condiciones oficiales de utilización",

  tipoAcceso =
    "Uso profesional",

  usoProfesional =
    "Interpretación profesional requerida"

}) {

  return {

    id,

    codigo,

    modulo:
      "biblioteca",

    activo:
      true,

    tipoContenido:
      "instrumento",

    tipo:
      "ficha técnica",

    icono:
      "Ψ",

    categoria:
      "Técnicas e instrumentos",

    subcategoria:
      categoriaTecnica,

    titulo,

    sigla,

    nombreCompleto:
      nombreCompleto ||
      titulo,

    autores,

    tipoInstrumento,

    area,

    poblacion,

    modalidad,

    administracionResumen:
      modalidad,

    tiempo,

    cantidadItems,

    descripcion:
      `Ficha técnica profesional de ${titulo}. Información metodológica, criterios de utilización, análisis, interpretación y aplicación dentro del contexto psicológico y forense.`,

    descripcionCorta:
      `Información técnica y profesional sobre ${titulo}.`,

    finalidad,

    queEvalua,

    administracionDetalle,

    modalidadRespuesta,

    correccion,

    analisis,

    interpretacion,

    usoForense,

    validez,

    limitaciones,

    integracionPericial,

    erroresFrecuentes,

    ejemploIntegracion,

    bibliografia,

    fuenteOficial,

    materialProtegido,

    reproduccionItems,

    accesoMaterial,

    tipoAcceso,

    usoProfesional,

    autor:
      AUTOR_BIBLIOTECA,

    fechaActualizacion:
      "Agosto 2026",

    rolesPermitidos:
      ROLES_PROFESIONALES,

    tags: [
      "técnicas",
      "instrumentos",
      titulo,
      sigla,
      categoriaTecnica,
      area,
      "evaluación psicológica",
      "psicología forense"
    ]
      .filter(Boolean)
      .join(", ")

  };

}



/* =========================================================
   TEXTOS BASE REUTILIZABLES
========================================================= */

const TEXTO_INTEGRACION =

  `Los resultados deben integrarse con entrevista, antecedentes,
  documentación, observación profesional y demás técnicas
  administradas. Ningún resultado aislado constituye por sí mismo
  una conclusión diagnóstica o pericial.`;


const TEXTO_FORENSE =

  `En evaluación psicológica forense constituye una fuente
  complementaria de información. Su utilización debe responder
  a una hipótesis de trabajo y a los puntos de pericia, considerando
  convergencias y divergencias con otras fuentes disponibles.`;


const TEXTO_LIMITACIONES =

  `La interpretación depende de las condiciones de administración,
  características de la persona evaluada, contexto, objetivos de
  evaluación y propiedades específicas del instrumento. No debe
  utilizarse fuera de sus condiciones técnicas de aplicación.`;


const TEXTO_ERROR =

  `<ul>
    <li>Interpretar resultados de manera automática.</li>
    <li>Utilizar un instrumento como única fuente de evidencia.</li>
    <li>Confundir indicadores psicológicos con diagnóstico o incapacidad.</li>
    <li>Inferir causalidad exclusivamente a partir de puntajes.</li>
    <li>Aplicar procedimientos de corrección o baremos no correspondientes.</li>
  </ul>`;




/* =========================================================
   CATÁLOGO
========================================================= */

export const instrumentosBiblioteca = [

  /* =======================================================
     01 · SCL-90-R
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-scl90-r",

    codigo:
      "TEC-001",

    titulo:
      "SCL-90-R",

    sigla:
      "SCL-90-R",

    nombreCompleto:
      "Symptom Checklist-90-Revised",

    autores:
      "Leonard R. Derogatis, PhD",

    categoriaTecnica:
      "Inventarios de síntomas",

    tipoInstrumento:
      "Inventario de síntomas · Autoinforme",

    area:
      "Sintomatología psicológica",

    poblacion:
      "Personas de 13 años en adelante, según la documentación oficial del instrumento.",

    modalidad:
      "Autoinforme · Administración individual",

    tiempo:
      "Aproximadamente 12 a 15 minutos",

    cantidadItems:
      "90",

    finalidad:
      `
        <p>
          Explorar de manera amplia la presencia y magnitud
          de síntomas psicológicos informados por la persona
          evaluada.
        </p>

        <p>
          Puede utilizarse como herramienta de evaluación
          inicial y para observar cambios sintomáticos,
          siempre dentro de un proceso profesional más amplio.
        </p>
      `,

    queEvalua:
      `
        <p>
          Proporciona información sobre un amplio rango
          de manifestaciones de malestar psicológico.
        </p>

        <p>
          Su perfil describe sintomatología autopercibida.
          Los resultados no constituyen por sí mismos
          diagnóstico psicológico, daño psíquico,
          incapacidad ni relación causal.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La administración debe efectuarse conforme
          a las instrucciones, materiales y condiciones
          previstas para la versión utilizada.
        </p>

        <p>
          Deben controlarse comprensión de consignas,
          condiciones ambientales y pertinencia de la
          aplicación para los objetivos de evaluación.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Utiliza una escala graduada de respuesta.
          Biblioteca FALCO® no reproduce los ítems
          ni las alternativas textuales de respuesta.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección debe efectuarse mediante
          los procedimientos autorizados correspondientes
          a la versión administrada.
        </p>

        <p>
          No se publican claves, hojas de respuesta,
          algoritmos, tablas, baremos ni perfiles
          protegidos.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis considera el perfil sintomático
          obtenido, su consistencia con la entrevista,
          antecedentes, contexto de evaluación y demás
          técnicas administradas.
        </p>
      `,

    interpretacion:
      `
        <p>
          Una elevación expresa mayor presencia o intensidad
          relativa de síntomas informados dentro del marco
          normativo correspondiente.
        </p>

        <p>
          La interpretación debe ser contextualizada
          y nunca automática.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          Por tratarse de un autoinforme, no debe utilizarse
          aisladamente para establecer credibilidad,
          simulación, incapacidad o nexo causal.
        </p>
      `,

    validez:
      `
        <p>
          Su utilización responsable requiere consultar
          el manual vigente, las normas correspondientes
          y la evidencia psicométrica aplicable a la
          población y contexto evaluados.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>

        <p>
          Los resultados pueden estar influidos por
          estilo de respuesta, comprensión, motivación,
          contexto y estado emocional.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los resultados obtenidos se consideran
          indicadores complementarios de sintomatología
          autopercibida y se integran con entrevista,
          antecedentes y restantes técnicas administradas,
          sin efectuar inferencias periciales a partir
          del instrumento de manera aislada.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Derogatis, L. R. · Symptom Checklist-90-Revised.
          </li>

          <li>
            Manual y documentación técnica vigente
            del instrumento.
          </li>

          <li>
            Pearson Assessments · SCL-90-R.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/store/en/usd/p/100000645.html"

  }),



  /* =======================================================
     02 · BSI
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-bsi",

    codigo:
      "TEC-002",

    titulo:
      "BSI",

    sigla:
      "BSI",

    nombreCompleto:
      "Brief Symptom Inventory",

    autores:
      "Leonard R. Derogatis, PhD",

    categoriaTecnica:
      "Inventarios de síntomas",

    tipoInstrumento:
      "Inventario breve de síntomas · Autoinforme",

    area:
      "Sintomatología psicológica",

    poblacion:
      "Personas de 13 años en adelante, según la documentación oficial del instrumento.",

    modalidad:
      "Autoinforme · Administración individual",

    tiempo:
      "Aproximadamente 8 a 10 minutos",

    cantidadItems:
      "53",

    finalidad:
      `
        <p>
          Obtener una apreciación breve y multidimensional
          de sintomatología psicológica informada por
          la persona evaluada.
        </p>
      `,

    queEvalua:
      `
        <p>
          Explora diferentes manifestaciones de
          malestar psicológico mediante una forma
          más breve que el SCL-90-R.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe administrarse conforme a las instrucciones
          correspondientes a la versión oficial utilizada,
          dentro de condiciones que garanticen comprensión
          y adecuada respuesta.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Utiliza una escala graduada de respuesta.
          No se reproducen ítems ni formularios.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección se realiza mediante los métodos
          y materiales autorizados para el instrumento.
        </p>
      `,

    analisis:
      `
        <p>
          El perfil obtenido debe analizarse considerando
          intensidad relativa de síntomas, contexto,
          historia del evaluado y convergencia con otras
          fuentes de información.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los resultados expresan características del
          malestar psicológico informado y requieren
          interpretación profesional contextualizada.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          No constituye por sí solo evidencia suficiente
          para determinar daño psíquico, incapacidad,
          simulación o causalidad.
        </p>
      `,

    validez:
      `
        <p>
          La interpretación debe apoyarse en la
          documentación técnica y normativa aplicable
          a la versión utilizada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          El perfil sintomático se describe como una
          fuente complementaria y se contrasta con
          entrevista, antecedentes y demás hallazgos
          de la evaluación.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Derogatis, L. R. · Brief Symptom Inventory.
          </li>

          <li>
            Documentación técnica vigente del instrumento.
          </li>

          <li>
            Pearson Assessments · BSI.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Brief-Symptom-Inventory/p/100000450"

  }),



  /* =======================================================
     03 · BDI-II
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-bdi-ii",

    codigo:
      "TEC-003",

    titulo:
      "Inventario de Depresión de Beck-II",

    sigla:
      "BDI-II",

    nombreCompleto:
      "Beck Depression Inventory-II",

    autores:
      "Aaron T. Beck y colaboradores",

    categoriaTecnica:
      "Depresión y estado de ánimo",

    tipoInstrumento:
      "Inventario de autoinforme",

    area:
      "Sintomatología depresiva",

    poblacion:
      "Adolescentes y adultos, conforme a la versión y normas utilizadas.",

    modalidad:
      "Autoinforme · Puede requerir administración asistida",

    tiempo:
      "Administración breve; aproximadamente 5 minutos según documentación oficial.",

    cantidadItems:
      "21",

    finalidad:
      `
        <p>
          Evaluar la intensidad de síntomas depresivos
          informados por la persona evaluada.
        </p>
      `,

    queEvalua:
      `
        <p>
          Explora manifestaciones cognitivas, afectivas
          y somáticas asociadas con sintomatología
          depresiva.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Se administra siguiendo las instrucciones
          correspondientes a la versión utilizada.
          Debe verificarse comprensión adecuada y
          condiciones suficientes de respuesta.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Instrumento estructurado de autoinforme.
          Biblioteca FALCO® no reproduce sus reactivos
          ni opciones de respuesta.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección e interpretación se realiza
          conforme al manual y procedimientos autorizados.
        </p>
      `,

    analisis:
      `
        <p>
          El resultado debe analizarse junto con
          entrevista clínica o forense, funcionamiento
          actual, antecedentes y evolución temporal.
        </p>
      `,

    interpretacion:
      `
        <p>
          El resultado representa intensidad de
          sintomatología depresiva autoinformada.
          No equivale automáticamente a un diagnóstico
          ni determina incapacidad psicológica.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          En daño psíquico puede contribuir a describir
          sintomatología depresiva, pero no establece
          por sí solo novedad, causalidad, cronicidad
          ni incapacidad.
        </p>
      `,

    validez:
      `
        <p>
          Debe utilizarse una versión válida para
          la población examinada y consultar sus
          correspondientes normas y documentación
          psicométrica.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>

        <p>
          Al ser autoinformado, requiere consideración
          del estilo de respuesta y del contexto de
          evaluación.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          La intensidad de sintomatología depresiva
          informada se interpreta conjuntamente con
          entrevista, evolución, repercusión funcional
          y restantes indicadores de la evaluación.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Beck, A. T. y colaboradores ·
            Beck Depression Inventory-II.
          </li>

          <li>
            Manual técnico correspondiente a la
            adaptación utilizada.
          </li>

          <li>
            Pearson Assessments · BDI-II.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Beck-Depression-Inventory/p/100000159"

  }),



  /* =======================================================
     04 · BAI
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-bai",

    codigo:
      "TEC-004",

    titulo:
      "Inventario de Ansiedad de Beck",

    sigla:
      "BAI",

    nombreCompleto:
      "Beck Anxiety Inventory",

    autores:
      "Aaron T. Beck, MD",

    categoriaTecnica:
      "Ansiedad",

    tipoInstrumento:
      "Inventario de autoinforme",

    area:
      "Sintomatología ansiosa",

    poblacion:
      "Personas de 17 a 80 años según la documentación oficial de la versión original.",

    modalidad:
      "Autoinforme o administración verbal por profesional capacitado",

    tiempo:
      "Aproximadamente 5 a 10 minutos",

    cantidadItems:
      "21",

    finalidad:
      `
        <p>
          Explorar y estimar la severidad de síntomas
          de ansiedad informados por la persona evaluada.
        </p>
      `,

    queEvalua:
      `
        <p>
          Considera diferentes manifestaciones
          subjetivas y somáticas asociadas a ansiedad.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La aplicación debe realizarse de acuerdo
          con las instrucciones correspondientes
          a la versión utilizada.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Escala estructurada de autoinforme.
          Sus ítems y alternativas de respuesta
          no se reproducen en Biblioteca FALCO®.
        </p>
      `,

    correccion:
      `
        <p>
          Se corrige e interpreta mediante los
          procedimientos autorizados y los criterios
          correspondientes a la versión aplicada.
        </p>
      `,

    analisis:
      `
        <p>
          El resultado debe analizarse considerando
          la entrevista, contexto, síntomas físicos,
          antecedentes médicos y demás información
          psicológica disponible.
        </p>
      `,

    interpretacion:
      `
        <p>
          Permite estimar intensidad de sintomatología
          ansiosa autoinformada. No constituye de manera
          aislada un diagnóstico.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          Resulta útil para describir sintomatología
          ansiosa, pero no permite establecer por sí
          mismo causalidad jurídica ni incapacidad.
        </p>
      `,

    validez:
      `
        <p>
          Debe utilizarse conforme a su manual,
          versión lingüística y población normativa
          correspondiente.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los indicadores de ansiedad se integran
          con manifestaciones observadas durante la
          entrevista, antecedentes, evolución y
          funcionamiento cotidiano.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Beck, A. T. · Beck Anxiety Inventory.
          </li>

          <li>
            Manual técnico correspondiente a la
            versión administrada.
          </li>

          <li>
            Pearson Assessments · BAI.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Beck-Anxiety-Inventory/p/100000251"

  }),



  /* =======================================================
     05 · ESCALA DE DESESPERANZA DE BECK
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-bhs",

    codigo:
      "TEC-005",

    titulo:
      "Escala de Desesperanza de Beck",

    sigla:
      "BHS",

    nombreCompleto:
      "Beck Hopelessness Scale",

    autores:
      "Aaron T. Beck, MD",

    categoriaTecnica:
      "Desesperanza y riesgo",

    tipoInstrumento:
      "Escala de autoinforme",

    area:
      "Actitudes y expectativas respecto del futuro",

    poblacion:
      "Personas de 17 a 80 años como rango recomendado en la documentación oficial.",

    modalidad:
      "Autoinforme o administración verbal por profesional capacitado",

    tiempo:
      "Aproximadamente 5 a 10 minutos",

    cantidadItems:
      "20",

    finalidad:
      `
        <p>
          Evaluar actitudes negativas y expectativas
          pesimistas respecto del futuro.
        </p>

        <p>
          Puede aportar información relevante dentro
          de una valoración clínica integral del riesgo,
          pero nunca reemplaza una evaluación profesional
          específica.
        </p>
      `,

    queEvalua:
      `
        <p>
          Explora componentes relacionados con
          expectativas sobre el futuro, motivación
          y esperanza/desesperanza autopercibida.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe administrarse conforme a las instrucciones
          oficiales y dentro de un contexto que permita
          intervenir clínicamente cuando los resultados
          o la entrevista indiquen riesgo.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Escala estructurada de respuesta dicotómica.
          No se reproducen los enunciados originales.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección debe seguir los procedimientos
          oficiales correspondientes a la versión
          utilizada.
        </p>
      `,

    analisis:
      `
        <p>
          El resultado debe analizarse junto con
          entrevista clínica, antecedentes, ideación,
          planificación, factores protectores y demás
          variables relevantes para la valoración
          profesional.
        </p>
      `,

    interpretacion:
      `
        <p>
          La presencia de desesperanza constituye
          un indicador clínicamente relevante,
          pero el puntaje no debe equipararse por sí
          solo a una determinación de riesgo suicida.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          En contexto forense debe evitarse convertir
          un puntaje aislado en una afirmación concluyente
          sobre riesgo, intencionalidad o causalidad.
        </p>
      `,

    validez:
      `
        <p>
          La utilización debe apoyarse en el manual
          correspondiente y en la evidencia disponible
          para la población evaluada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>

        <p>
          La valoración de riesgo requiere siempre
          evaluación clínica directa y contextual.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los indicadores vinculados con desesperanza
          se describen como parte de la evaluación
          emocional general y se contrastan con
          entrevista, antecedentes y factores de riesgo
          y protección identificados.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Beck, A. T. · Beck Hopelessness Scale.
          </li>

          <li>
            Manual técnico correspondiente a la
            versión administrada.
          </li>

          <li>
            Pearson Assessments · BHS.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Beck-Hopelessness-Scale/p/100000105"

  }),



  /* =======================================================
     06 · BENDER-GESTALT II
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-bender",

    codigo:
      "TEC-006",

    titulo:
      "Bender-Gestalt II",

    sigla:
      "Bender-Gestalt II",

    nombreCompleto:
      "Bender Visual-Motor Gestalt Test · Second Edition",

    autores:
      "Lauretta Bender · revisión posterior de Scott L. Decker y Gary G. Brannigan",

    categoriaTecnica:
      "Visomotricidad y neuropsicología",

    tipoInstrumento:
      "Prueba de integración visomotora",

    area:
      "Percepción e integración visomotora",

    poblacion:
      "Niños y adultos; la segunda edición oficial dispone de normas desde los 4 años hasta adultos mayores.",

    modalidad:
      "Administración individual",

    tiempo:
      "Sin límite temporal rígido en la segunda edición",

    cantidadItems:
      "Consultar versión utilizada",

    finalidad:
      `
        <p>
          Explorar el funcionamiento de la integración
          perceptivo-motora y aportar información sobre
          el desarrollo y desempeño visomotor.
        </p>
      `,

    queEvalua:
      `
        <p>
          Permite observar aspectos relacionados con
          percepción visual, coordinación visomotora,
          organización de la respuesta gráfica y,
          según la versión, otros componentes
          complementarios.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La administración utiliza materiales
          específicos de la prueba y debe realizarse
          conforme al manual de la versión empleada.
        </p>

        <p>
          Biblioteca FALCO® no reproduce las figuras
          o estímulos del instrumento.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          La persona produce respuestas gráficas
          frente a los estímulos previstos por el
          instrumento.
        </p>
      `,

    correccion:
      `
        <p>
          Deben utilizarse exclusivamente criterios
          de corrección correspondientes al sistema
          y edición elegidos.
        </p>
      `,

    analisis:
      `
        <p>
          Se consideran características de ejecución,
          calidad de integración visomotora,
          comportamiento durante la tarea y demás
          variables contempladas por el sistema
          técnico utilizado.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los hallazgos deben interpretarse teniendo
          en cuenta edad, antecedentes, condiciones
          perceptivo-motoras, contexto y restantes
          resultados de la batería.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          No corresponde inferir personalidad,
          organicidad, daño psíquico o simulación
          exclusivamente a partir de indicadores
          gráficos aislados.
        </p>
      `,

    validez:
      `
        <p>
          La evidencia y normas dependen de la
          edición y sistema de puntuación utilizado.
          Debe identificarse claramente la versión
          administrada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>
            Utilizar criterios interpretativos de una
            edición diferente de la administrada.
          </li>

          <li>
            Inferir organicidad exclusivamente por
            errores gráficos.
          </li>

          <li>
            Ignorar variables motoras, visuales,
            educativas o contextuales.
          </li>

          <li>
            Sobreinterpretar indicadores aislados.
          </li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          El desempeño visomotor se describe considerando
          el comportamiento observado durante la tarea
          y se integra con los restantes datos cognitivos,
          clínicos y periciales.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Bender, L. · trabajos originales sobre
            organización visomotora.
          </li>

          <li>
            Bender Visual-Motor Gestalt Test ·
            documentación técnica de la edición utilizada.
          </li>

          <li>
            Pearson Assessments · Bender-Gestalt II.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/store/en/usd/p/100000190.html"

  }),



  /* =======================================================
     07 · HTP
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-htp",

    codigo:
      "TEC-007",

    titulo:
      "HTP · Casa-Árbol-Persona",

    sigla:
      "HTP",

    nombreCompleto:
      "House-Tree-Person",

    autores:
      "Técnica gráfica asociada históricamente a John N. Buck y desarrollos posteriores",

    categoriaTecnica:
      "Técnicas gráficas",

    tipoInstrumento:
      "Técnica gráfica de exploración psicológica",

    area:
      "Exploración cualitativa de producciones gráficas",

    poblacion:
      "Su pertinencia depende de edad, desarrollo, condiciones de evaluación y marco técnico utilizado.",

    modalidad:
      "Administración individual",

    tiempo:
      "Variable según modalidad y procedimiento utilizado",

    cantidadItems:
      "Producciones gráficas según procedimiento técnico",

    finalidad:
      `
        <p>
          Obtener material gráfico susceptible de
          análisis cualitativo dentro de una evaluación
          psicológica integral.
        </p>

        <p>
          Su valor depende fundamentalmente de la
          integración con entrevista, antecedentes,
          observación y otras técnicas.
        </p>
      `,

    queEvalua:
      `
        <p>
          No debe conceptualizarse como una medición
          directa y objetiva de rasgos específicos.
          Permite formular hipótesis clínicas a partir
          de la producción gráfica y del contexto
          de administración.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe seguirse un procedimiento técnico
          definido y documentarse el comportamiento
          de la persona durante la tarea.
        </p>

        <p>
          Biblioteca FALCO® no reproduce protocolos,
          consignas textuales ni sistemas interpretativos
          protegidos.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Producción gráfica realizada por la persona
          evaluada bajo condiciones de administración
          profesional.
        </p>
      `,

    correccion:
      `
        <p>
          No debe aplicarse una lectura mecánica basada
          en equivalencias rígidas entre un rasgo gráfico
          y una característica psicológica.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis puede considerar organización
          general, modalidad de ejecución, secuencia,
          características formales y verbalizaciones,
          siempre dentro del marco conceptual adoptado.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los indicadores poseen carácter hipotético
          y requieren convergencia con información
          proveniente de otras fuentes.
        </p>
      `,

    usoForense:
      `
        <p>
          En evaluación forense puede utilizarse
          exclusivamente como técnica complementaria.
        </p>

        <p>
          No resulta metodológicamente adecuado atribuir
          diagnóstico, simulación, credibilidad,
          incapacidad o causalidad a partir de signos
          gráficos aislados.
        </p>
      `,

    validez:
      `
        <p>
          Su utilización debe explicitar el marco
          teórico, procedimiento empleado y carácter
          cualitativo de las inferencias efectuadas.
        </p>
      `,

    limitaciones:
      `
        <p>
          La producción puede estar influida por
          edad, habilidad gráfica, escolaridad,
          variables culturales, motivación,
          ansiedad situacional y condiciones motoras.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>
            Interpretar un signo gráfico de manera aislada.
          </li>

          <li>
            Aplicar diccionarios rígidos de significados.
          </li>

          <li>
            Presentar hipótesis proyectivas como hechos.
          </li>

          <li>
            Utilizar la técnica como prueba exclusiva
            de diagnóstico o incapacidad.
          </li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          Las características observadas en las
          producciones gráficas se consideran hipótesis
          exploratorias que adquieren significado
          únicamente al ser contrastadas con entrevista
          y demás resultados de la evaluación.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Buck, J. N. · desarrollos históricos
            de la técnica House-Tree-Person.
          </li>

          <li>
            Bibliografía técnica y metodológica
            correspondiente al sistema utilizado.
          </li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      true

  }),



  /* =======================================================
     08 · PERSONA BAJO LA LLUVIA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-pbll",

    codigo:
      "TEC-008",

    titulo:
      "Persona Bajo la Lluvia",

    sigla:
      "PBLL",

    nombreCompleto:
      "Técnica gráfica Persona Bajo la Lluvia",

    autores:
      "Técnica gráfica difundida mediante diversos desarrollos y sistemas interpretativos",

    categoriaTecnica:
      "Técnicas gráficas",

    tipoInstrumento:
      "Técnica gráfica de exploración psicológica",

    area:
      "Exploración cualitativa",

    poblacion:
      "Aplicación dependiente del contexto, objetivo y criterio profesional.",

    modalidad:
      "Administración individual",

    tiempo:
      "Variable",

    cantidadItems:
      "Producción gráfica",

    finalidad:
      `
        <p>
          Obtener una producción gráfica susceptible
          de análisis cualitativo dentro de una
          evaluación psicológica integral.
        </p>
      `,

    queEvalua:
      `
        <p>
          No constituye una medición psicométrica
          directa de una variable específica.
        </p>

        <p>
          Puede ser utilizada para generar hipótesis
          exploratorias acerca de modalidades de
          afrontamiento y recursos psicológicos,
          según el marco técnico adoptado.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La administración debe realizarse bajo
          condiciones profesionales controladas
          y siguiendo el procedimiento técnico
          seleccionado por el evaluador.
        </p>

        <p>
          Biblioteca FALCO® no reproduce consignas,
          protocolos ni sistemas interpretativos
          comerciales.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Producción gráfica obtenida durante
          una administración individual.
        </p>
      `,

    correccion:
      `
        <p>
          El análisis no debe reducirse a equivalencias
          automáticas entre elementos gráficos y
          características psicológicas.
        </p>
      `,

    analisis:
      `
        <p>
          Puede considerarse la organización global
          de la producción, características formales,
          conducta durante la tarea y asociaciones
          relevantes, de acuerdo con el sistema
          profesional adoptado.
        </p>
      `,

    interpretacion:
      `
        <p>
          Toda inferencia obtenida posee valor
          hipotético y debe contrastarse con otras
          fuentes de información.
        </p>
      `,

    usoForense:
      `
        <p>
          En el ámbito forense solo corresponde
          emplearla como técnica complementaria.
        </p>

        <p>
          No permite establecer aisladamente
          daño psíquico, simulación, credibilidad,
          causalidad ni porcentaje de incapacidad.
        </p>
      `,

    validez:
      `
        <p>
          La utilización debe explicitar su naturaleza
          cualitativa y el marco metodológico bajo el
          cual se interpretan las producciones.
        </p>
      `,

    limitaciones:
      `
        <p>
          La producción gráfica puede estar condicionada
          por habilidad para el dibujo, variables
          educativas, culturales, motoras, motivacionales
          y situacionales.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>
            Interpretar signos gráficos de forma mecánica.
          </li>

          <li>
            Utilizar indicadores aislados como prueba
            de patología.
          </li>

          <li>
            Confundir hipótesis cualitativas con
            resultados psicométricos.
          </li>

          <li>
            Fundamentar una conclusión pericial
            únicamente en esta técnica.
          </li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          Las características de la producción
          se consideran información exploratoria
          y se integran exclusivamente cuando presentan
          convergencia con entrevista, antecedentes
          y otras técnicas de la batería.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Bibliografía técnica sobre técnicas
            gráficas y métodos proyectivos.
          </li>

          <li>
            Publicaciones específicas correspondientes
            al sistema interpretativo efectivamente
            utilizado por el profesional.
          </li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      true

  }),

    /* =======================================================
     09 · ENTREVISTA PSICOLÓGICA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-entrevista-psicologica",

    codigo:
      "TEC-009",

    titulo:
      "Entrevista psicológica",

    sigla:
      "EP",

    nombreCompleto:
      "Entrevista psicológica profesional",

    autores:
      "Procedimiento profesional de evaluación psicológica",

    categoriaTecnica:
      "Entrevistas",

    tipoInstrumento:
      "Técnica de evaluación psicológica",

    area:
      "Evaluación integral",

    poblacion:
      "Niños, adolescentes y adultos según finalidad, contexto y competencias del profesional.",

    modalidad:
      "Individual · Presencial o remota cuando resulte técnicamente pertinente",

    tiempo:
      "Variable según objetivo de evaluación",

    cantidadItems:
      "No corresponde",

    finalidad:
      `
        <p>
          Obtener información relevante sobre historia,
          funcionamiento actual, antecedentes, motivo
          de evaluación y contexto de la persona entrevistada.
        </p>
      `,

    queEvalua:
      `
        <p>
          Permite explorar diferentes áreas psicológicas,
          comportamentales, vinculares y contextuales
          de acuerdo con los objetivos de evaluación.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Puede adoptar formatos estructurados,
          semiestructurados o abiertos.
        </p>

        <p>
          El profesional debe definir previamente
          objetivos, áreas relevantes y condiciones
          de registro de la información.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Intercambio verbal y observacional entre
          profesional y persona evaluada.
        </p>
      `,

    correccion:
      `
        <p>
          No posee una corrección psicométrica única.
          El análisis depende del método de entrevista
          y marco profesional utilizado.
        </p>
      `,

    analisis:
      `
        <p>
          Se consideran contenido verbal, coherencia
          narrativa, antecedentes, comportamiento
          observado y relación con las demás fuentes
          de información.
        </p>
      `,

    interpretacion:
      `
        <p>
          Las inferencias deben surgir del conjunto
          de información obtenida y no de respuestas
          aisladas.
        </p>
      `,

    usoForense:
      `
        <p>
          En el ámbito forense constituye una fuente
          central de información, pero debe desarrollarse
          bajo un encuadre diferente del terapéutico.
        </p>

        <p>
          Deben explicitarse objetivos, límites de
          confidencialidad, rol profesional y finalidad
          judicial de la evaluación.
        </p>
      `,

    validez:
      `
        <p>
          La calidad de la información depende de
          la metodología utilizada, experiencia del
          entrevistador, calidad del registro y
          triangulación con otras fuentes.
        </p>
      `,

    limitaciones:
      `
        <p>
          Puede estar afectada por memoria, motivación,
          comprensión, deseabilidad social, contexto
          y características de la interacción.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Confundir entrevista clínica con entrevista forense.</li>
          <li>Realizar preguntas sugestivas o innecesariamente inductivas.</li>
          <li>No registrar contradicciones o cambios relevantes.</li>
          <li>Tomar el relato como prueba objetiva de los hechos.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          La información obtenida durante la entrevista
          se contrasta con antecedentes, documentación,
          conducta observada y demás técnicas administradas.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Bibliografía especializada en entrevista
            y evaluación psicológica.
          </li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false,

    reproduccionItems:
      "No corresponde"

  }),



  /* =======================================================
     10 · ENTREVISTA CLÍNICA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-entrevista-clinica",

    codigo:
      "TEC-010",

    titulo:
      "Entrevista clínica",

    sigla:
      "EC",

    nombreCompleto:
      "Entrevista clínica psicológica",

    autores:
      "Procedimiento profesional de evaluación clínica",

    categoriaTecnica:
      "Entrevistas",

    tipoInstrumento:
      "Técnica clínica de evaluación",

    area:
      "Funcionamiento psicológico y psicopatología",

    poblacion:
      "Según edad, motivo de consulta y contexto clínico.",

    modalidad:
      "Individual · Semiestructurada o abierta",

    tiempo:
      "Variable",

    cantidadItems:
      "No corresponde",

    finalidad:
      `
        <p>
          Explorar síntomas, antecedentes, funcionamiento
          psicológico, evolución y necesidades clínicas.
        </p>
      `,

    queEvalua:
      `
        <p>
          Permite obtener información acerca de
          funcionamiento emocional, cognitivo,
          conductual, interpersonal y contextual.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          El profesional organiza la entrevista según
          el motivo de evaluación y las hipótesis clínicas
          relevantes.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Interacción verbal complementada por observación
          clínica y registro profesional.
        </p>
      `,

    correccion:
      `
        <p>
          No posee una clave única de corrección.
          La información se organiza e interpreta
          conforme al método clínico utilizado.
        </p>
      `,

    analisis:
      `
        <p>
          Se consideran síntomas, evolución,
          antecedentes personales y familiares,
          funcionamiento cotidiano y consistencia
          de la información obtenida.
        </p>
      `,

    interpretacion:
      `
        <p>
          Debe evitarse transformar impresiones
          clínicas aisladas en afirmaciones concluyentes.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede formar parte de una evaluación forense,
          pero debe adecuarse el encuadre y diferenciar
          claramente objetivos clínicos de objetivos
          periciales.
        </p>
      `,

    validez:
      `
        <p>
          La utilidad depende de la calidad de la
          entrevista y de su integración con otras
          fuentes de evaluación.
        </p>
      `,

    limitaciones:
      `
        <p>
          La información autorreferida puede estar
          influida por memoria, motivación, contexto
          y estilo de presentación.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Confundir hipótesis con diagnóstico confirmado.</li>
          <li>No explorar diagnósticos diferenciales.</li>
          <li>Ignorar antecedentes médicos o psiquiátricos.</li>
          <li>No contrastar información relevante.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          Los hallazgos clínicos se integran con
          antecedentes y técnicas complementarias
          para formular conclusiones fundamentadas.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Bibliografía profesional sobre entrevista
            clínica y psicodiagnóstico.
          </li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false,

    reproduccionItems:
      "No corresponde"

  }),



  /* =======================================================
     11 · ENTREVISTA PSICOLÓGICA FORENSE
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-entrevista-forense",

    codigo:
      "TEC-011",

    titulo:
      "Entrevista psicológica forense",

    sigla:
      "EPF",

    nombreCompleto:
      "Entrevista psicológica en contexto forense",

    autores:
      "Procedimiento profesional especializado",

    categoriaTecnica:
      "Evaluación forense",

    tipoInstrumento:
      "Técnica forense de evaluación",

    area:
      "Psicología jurídica y forense",

    poblacion:
      "Según objeto pericial, fuero y población evaluada.",

    modalidad:
      "Individual · Encuadre forense",

    tiempo:
      "Variable según complejidad y puntos de pericia",

    cantidadItems:
      "No corresponde",

    finalidad:
      `
        <p>
          Obtener información psicológica pertinente
          para responder preguntas específicas formuladas
          dentro de un proceso judicial.
        </p>
      `,

    queEvalua:
      `
        <p>
          Explora antecedentes, estado psicológico,
          funcionamiento previo y posterior, repercusión,
          evolución y variables relevantes para las
          hipótesis periciales.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe explicarse el rol del profesional,
          finalidad judicial, ausencia de vínculo
          terapéutico y límites de confidencialidad.
        </p>

        <p>
          La entrevista debe orientarse a los puntos
          periciales y evitar indagaciones irrelevantes.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Relato verbal, observación conductual y
          exploración dirigida de hipótesis alternativas.
        </p>
      `,

    correccion:
      `
        <p>
          No posee puntuación única. Requiere análisis
          profesional estructurado y contraste de fuentes.
        </p>
      `,

    analisis:
      `
        <p>
          Se consideran consistencia interna,
          congruencia temporal, antecedentes,
          información documental, hipótesis alternativas
          y resultados de otras técnicas.
        </p>
      `,

    interpretacion:
      `
        <p>
          El relato del evaluado constituye una fuente
          de información y no una constatación objetiva
          de los hechos jurídicamente controvertidos.
        </p>
      `,

    usoForense:
      `
        <p>
          Es una herramienta central de la evaluación
          pericial psicológica y debe utilizarse dentro
          de un enfoque multimétodo y multifuente.
        </p>
      `,

    validez:
      `
        <p>
          La calidad de las inferencias aumenta cuando
          existe triangulación con documentación,
          antecedentes y técnicas independientes.
        </p>
      `,

    limitaciones:
      `
        <p>
          La memoria, incentivos externos, litigio,
          expectativas indemnizatorias y otras variables
          contextuales pueden afectar la información
          aportada.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Adoptar una función terapéutica.</li>
          <li>Dar por probados hechos basándose únicamente en el relato.</li>
          <li>No explorar antecedentes o hipótesis alternativas.</li>
          <li>Emitir conclusiones jurídicas en lugar de psicológicas.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          El relato pericial se analiza en función de
          su coherencia con antecedentes, documentación,
          observación y resultados de otras técnicas.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Bibliografía especializada en evaluación
            psicológica forense.
          </li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false,

    reproduccionItems:
      "No corresponde"

  }),



  /* =======================================================
     12 · MMPI-2
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-mmpi-2",

    codigo:
      "TEC-012",

    titulo:
      "MMPI-2",

    sigla:
      "MMPI-2",

    nombreCompleto:
      "Minnesota Multiphasic Personality Inventory-2",

    autores:
      "James N. Butcher, John R. Graham, Yossef S. Ben-Porath, Auke Tellegen, W. Grant Dahlstrom y colaboradores",

    categoriaTecnica:
      "Personalidad y psicopatología",

    tipoInstrumento:
      "Inventario objetivo de personalidad",

    area:
      "Personalidad · Psicopatología · Validez de respuesta",

    poblacion:
      "Adultos de 18 años en adelante.",

    modalidad:
      "Autoinforme · Papel o sistemas autorizados",

    tiempo:
      "Variable según modalidad y características del evaluado",

    cantidadItems:
      "567",

    finalidad:
      `
        <p>
          Evaluar de manera amplia características
          de personalidad, sintomatología psicológica
          y patrones de respuesta relevantes para
          la evaluación clínica.
        </p>
      `,

    queEvalua:
      `
        <p>
          Proporciona información sobre múltiples áreas
          de funcionamiento psicológico e incluye
          indicadores destinados a valorar la calidad
          e interpretabilidad del protocolo.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Requiere utilización de materiales oficiales
          y cumplimiento de las condiciones previstas
          en el manual.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado de autoinforme.
          Biblioteca FALCO® no reproduce reactivos
          ni opciones textuales.
        </p>
      `,

    correccion:
      `
        <p>
          Deben utilizarse procedimientos autorizados,
          normas correspondientes y sistemas de
          interpretación compatibles con la versión.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis debe comenzar por la evaluación
          de la interpretabilidad y estilo de respuesta
          antes de considerar las escalas clínicas.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los perfiles requieren interpretación
          especializada y contextualización clínica
          o forense.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede aportar información relevante en
          evaluación forense cuando forma parte de
          una batería multimétodo y se analizan
          cuidadosamente los indicadores de validez.
        </p>
      `,

    validez:
      `
        <p>
          Posee amplia tradición de investigación.
          La interpretación debe basarse en el manual
          y evidencia correspondiente a la versión
          y población utilizadas.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          La interpretación del perfil se efectúa
          únicamente luego de analizar la calidad
          del protocolo y se integra con entrevista,
          antecedentes y demás fuentes.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Manual técnico vigente del MMPI-2.</li>
          <li>Pearson Assessments · MMPI-2.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/store/usd/p/100000461.html"

  }),



  /* =======================================================
     13 · MMPI-2-RF
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-mmpi-2-rf",

    codigo:
      "TEC-013",

    titulo:
      "MMPI-2-RF",

    sigla:
      "MMPI-2-RF",

    nombreCompleto:
      "Minnesota Multiphasic Personality Inventory-2 Restructured Form",

    autores:
      "Yossef S. Ben-Porath y Auke Tellegen",

    categoriaTecnica:
      "Personalidad y psicopatología",

    tipoInstrumento:
      "Inventario objetivo de personalidad",

    area:
      "Psicopatología · Personalidad · Validez de respuesta",

    poblacion:
      "Adultos de 18 años en adelante.",

    modalidad:
      "Autoinforme · Papel o plataformas autorizadas",

    tiempo:
      "Aproximadamente 35 a 50 minutos",

    cantidadItems:
      "338",

    finalidad:
      `
        <p>
          Evaluar manifestaciones relevantes de
          disfunción psicológica mediante una versión
          reestructurada y más breve del MMPI-2.
        </p>
      `,

    queEvalua:
      `
        <p>
          Examina diferentes dominios de psicopatología,
          funcionamiento psicológico y calidad del
          patrón de respuesta.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Se administra mediante materiales y sistemas
          autorizados por el editor.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado de autoinforme.
          Los ítems no se reproducen.
        </p>
      `,

    correccion:
      `
        <p>
          La puntuación e interpretación deben realizarse
          mediante procedimientos correspondientes a
          la versión RF.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis debe comenzar por los indicadores
          de validez del protocolo y continuar con
          la lectura integrada de los distintos dominios.
        </p>
      `,

    interpretacion:
      `
        <p>
          Las elevaciones requieren análisis profesional
          y no deben traducirse mecánicamente a diagnósticos.
        </p>
      `,

    usoForense:
      `
        <p>
          La documentación oficial contempla expresamente
          aplicaciones forenses. Su interpretación
          debe considerar el contexto litigioso y la
          posibilidad de estilos de respuesta atípicos.
        </p>
      `,

    validez:
      `
        <p>
          Cuenta con un amplio cuerpo de investigación
          y escalas empíricamente desarrolladas.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          La interpretación se realiza una vez
          determinada la validez del protocolo
          y se contrasta con entrevista, historia
          clínica y demás resultados.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Manual técnico vigente del MMPI-2-RF.</li>
          <li>Pearson Assessments · MMPI-2-RF.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Minnesota-Multiphasic-Personality-Inventory-2-Restructured-Form/p/100000631"

  }),



  /* =======================================================
     14 · PAI
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-pai",

    codigo:
      "TEC-014",

    titulo:
      "PAI",

    sigla:
      "PAI",

    nombreCompleto:
      "Personality Assessment Inventory",

    autores:
      "Leslie C. Morey, PhD",

    categoriaTecnica:
      "Personalidad y psicopatología",

    tipoInstrumento:
      "Inventario objetivo de personalidad",

    area:
      "Psicopatología · Personalidad",

    poblacion:
      "Adultos.",

    modalidad:
      "Autoinforme · Papel o administración digital autorizada",

    tiempo:
      "Aproximadamente 25 a 55 minutos",

    cantidadItems:
      "344",

    finalidad:
      `
        <p>
          Realizar una evaluación amplia de
          psicopatología y funcionamiento de personalidad
          en población adulta.
        </p>
      `,

    queEvalua:
      `
        <p>
          Proporciona información clínica relevante
          para evaluación diagnóstica, planificación
          y análisis de diferentes áreas de funcionamiento.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe utilizarse material oficial y seguirse
          las instrucciones correspondientes a la
          versión aplicada.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado de autoinforme.
          Biblioteca FALCO® no reproduce sus reactivos.
        </p>
      `,

    correccion:
      `
        <p>
          Deben emplearse los procedimientos de
          puntuación correspondientes a la versión
          y adaptación utilizadas.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis incluye la consideración previa
          de la calidad del protocolo y posteriormente
          la integración de las distintas escalas.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los resultados deben contextualizarse y
          contrastarse con datos clínicos y forenses
          independientes.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede ser útil en contextos forenses,
          especialmente cuando interesa una evaluación
          estructurada de psicopatología y estilo
          de respuesta.
        </p>
      `,

    validez:
      `
        <p>
          Su utilización debe basarse en los manuales,
          normas y evidencia correspondientes a la
          adaptación utilizada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los resultados se interpretan después de
          evaluar la calidad del protocolo y se
          articulan con entrevista y antecedentes.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Morey, L. C. · Personality Assessment Inventory.</li>
          <li>PAR · documentación técnica del PAI.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.parinc.com/products/pai"

  }),



  /* =======================================================
     15 · MCMI-IV
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-mcmi-iv",

    codigo:
      "TEC-015",

    titulo:
      "MCMI-IV",

    sigla:
      "MCMI-IV",

    nombreCompleto:
      "Millon Clinical Multiaxial Inventory-IV",

    autores:
      "Theodore Millon, Seth Grossman y Carrie Millon",

    categoriaTecnica:
      "Personalidad y psicopatología",

    tipoInstrumento:
      "Inventario clínico de personalidad",

    area:
      "Patrones de personalidad · Síndromes clínicos",

    poblacion:
      "Adultos de 18 años en adelante dentro de contextos clínicos apropiados.",

    modalidad:
      "Autoinforme · Sistemas autorizados",

    tiempo:
      "Aproximadamente 25 a 30 minutos",

    cantidadItems:
      "195",

    finalidad:
      `
        <p>
          Explorar patrones de personalidad y
          síndromes clínicos en población adulta
          dentro de contextos de evaluación adecuados.
        </p>
      `,

    queEvalua:
      `
        <p>
          Proporciona información sobre dinámica
          de personalidad y manifestaciones clínicas
          relevantes para evaluación profesional.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe respetarse el tipo de población para
          la cual fue diseñado y utilizarse materiales
          oficiales.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado de autoinforme.
          No se reproducen reactivos.
        </p>
      `,

    correccion:
      `
        <p>
          Se corrige mediante sistemas y procedimientos
          autorizados por el editor.
        </p>
      `,

    analisis:
      `
        <p>
          El perfil debe interpretarse considerando
          los indicadores de validez, características
          clínicas del evaluado y población normativa
          correspondiente.
        </p>
      `,

    interpretacion:
      `
        <p>
          Las elevaciones no equivalen automáticamente
          a diagnósticos categóricos y deben interpretarse
          en conjunto con otras fuentes.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede utilizarse en contextos forenses,
          aunque debe prestarse especial atención
          a la adecuación entre la población normativa
          clínica y las características del evaluado.
        </p>
      `,

    validez:
      `
        <p>
          La documentación oficial utiliza una
          muestra normativa clínica adulta.
        </p>
      `,

    limitaciones:
      `
        <p>
          No debe aplicarse indiscriminadamente a
          población general cuando las condiciones
          de interpretación no sean compatibles
          con sus normas.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los patrones obtenidos se interpretan
          teniendo en cuenta la pertinencia normativa,
          antecedentes clínicos y resultados de la
          batería completa.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Millon, T. y colaboradores · MCMI-IV.</li>
          <li>Pearson Assessments · documentación técnica MCMI-IV.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/store/en/usd/p/100001362.html"

  }),



  /* =======================================================
     16 · STAI
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-stai",

    codigo:
      "TEC-016",

    titulo:
      "STAI",

    sigla:
      "STAI",

    nombreCompleto:
      "State-Trait Anxiety Inventory",

    autores:
      "Charles D. Spielberger y colaboradores",

    categoriaTecnica:
      "Ansiedad",

    tipoInstrumento:
      "Inventario de autoinforme",

    area:
      "Ansiedad estado · Ansiedad rasgo",

    poblacion:
      "Adultos para la versión STAI-AD.",

    modalidad:
      "Autoinforme",

    tiempo:
      "Administración breve según condiciones de evaluación",

    cantidadItems:
      "40",

    finalidad:
      `
        <p>
          Diferenciar entre ansiedad como estado
          transitorio y ansiedad como característica
          relativamente estable.
        </p>
      `,

    queEvalua:
      `
        <p>
          Evalúa dos componentes diferenciados:
          ansiedad-estado y ansiedad-rasgo.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe utilizarse una versión autorizada y
          respetarse las instrucciones y condiciones
          de licencia correspondientes.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado con escalas graduadas.
          Biblioteca FALCO® no reproduce sus ítems.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección debe realizarse conforme
          al manual y sistema autorizado.
        </p>
      `,

    analisis:
      `
        <p>
          Deben analizarse diferenciadamente los
          componentes estado y rasgo, considerando
          el contexto específico de administración.
        </p>
      `,

    interpretacion:
      `
        <p>
          La ansiedad-estado puede variar según la
          situación inmediata, mientras que la dimensión
          rasgo refleja una tendencia más estable.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede aportar información complementaria
          sobre ansiedad situacional y disposicional,
          pero no establece por sí mismo daño psíquico,
          causalidad ni incapacidad.
        </p>
      `,

    validez:
      `
        <p>
          La utilización debe apoyarse en la versión
          autorizada y normas pertinentes a la población.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los indicadores de ansiedad se interpretan
          diferenciando el componente situacional
          del disposicional y se contrastan con
          entrevista y otras técnicas.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Spielberger, C. D. y colaboradores ·
            State-Trait Anxiety Inventory.
          </li>

          <li>
            Mind Garden · STAI for Adults.
          </li>
        </ul>
      `,

    fuenteOficial:
      "https://www.mindgarden.com/145-state-trait-anxiety-inventory-for-adults"

  }),

    /* =======================================================
     17 · STAXI-2
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-staxi-2",

    codigo:
      "TEC-017",

    titulo:
      "STAXI-2",

    sigla:
      "STAXI-2",

    nombreCompleto:
      "State-Trait Anger Expression Inventory-2",

    autores:
      "Charles D. Spielberger y colaboradores",

    categoriaTecnica:
      "Ira y expresión emocional",

    tipoInstrumento:
      "Inventario de autoinforme",

    area:
      "Ira estado · Ira rasgo · Expresión y control",

    poblacion:
      "Adolescentes y adultos según versión y adaptación utilizada.",

    modalidad:
      "Autoinforme",

    tiempo:
      "Administración breve",

    cantidadItems:
      "Consultar versión utilizada",

    finalidad:
      `
        <p>
          Evaluar diferentes componentes relacionados
          con la experiencia, expresión y control
          de la ira.
        </p>
      `,

    queEvalua:
      `
        <p>
          Permite diferenciar aspectos situacionales
          y disposicionales de la ira, así como
          modalidades de expresión y regulación.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe administrarse conforme a las instrucciones
          y normas de la versión autorizada utilizada.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Inventario estructurado de autoinforme.
          Biblioteca FALCO® no reproduce sus ítems
          ni alternativas textuales.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección debe efectuarse utilizando
          los procedimientos oficiales correspondientes
          a la versión aplicada.
        </p>
      `,

    analisis:
      `
        <p>
          Deben considerarse diferenciadamente
          experiencia, expresión, control y contexto
          situacional de la ira.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los resultados describen tendencias
          relacionadas con ira y regulación emocional
          y requieren interpretación profesional.
        </p>
      `,

    usoForense:
      `
        <p>
          ${TEXTO_FORENSE}
        </p>

        <p>
          No permite establecer por sí solo
          peligrosidad, violencia futura,
          responsabilidad ni capacidad jurídica.
        </p>
      `,

    validez:
      `
        <p>
          Debe utilizarse una adaptación válida
          para la población examinada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      TEXTO_ERROR,

    ejemploIntegracion:
      `
        <p>
          Los indicadores vinculados con la expresión
          y control de la ira se analizan junto con
          entrevista, antecedentes conductuales y
          demás datos de la evaluación.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>
            Spielberger, C. D. y colaboradores · STAXI-2.
          </li>
          <li>
            Manual técnico correspondiente a la
            adaptación utilizada.
          </li>
        </ul>
      `,

    fuenteOficial:
      ""

  }),



  /* =======================================================
     18 · WAIS-5
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-wais-5",

    codigo:
      "TEC-018",

    titulo:
      "WAIS-5",

    sigla:
      "WAIS-5",

    nombreCompleto:
      "Wechsler Adult Intelligence Scale · Fifth Edition",

    autores:
      "David Wechsler · desarrollos y revisiones posteriores",

    categoriaTecnica:
      "Inteligencia y cognición",

    tipoInstrumento:
      "Escala individual de capacidad cognitiva",

    area:
      "Funcionamiento cognitivo",

    poblacion:
      "Personas de 16:0 a 90:11 años en la edición estadounidense vigente.",

    modalidad:
      "Administración individual · Papel o plataforma digital autorizada",

    tiempo:
      "Aproximadamente 45 minutos para FSIQ de 7 subtests o 60 minutos para los 10 subtests primarios.",

    cantidadItems:
      "Organizado en subtests",

    finalidad:
      `
        <p>
          Evaluar de manera amplia el funcionamiento
          cognitivo de adolescentes mayores y adultos.
        </p>
      `,

    queEvalua:
      `
        <p>
          Permite obtener información sobre distintas
          áreas del funcionamiento intelectual y
          elaborar perfiles cognitivos.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Requiere administración individual,
          materiales oficiales y cumplimiento
          de reglas específicas de inicio,
          discontinuación y puntuación.
        </p>

        <p>
          Biblioteca FALCO® no reproduce estímulos,
          reactivos ni materiales de administración.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Incluye diferentes modalidades de respuesta
          según cada subtest.
        </p>
      `,

    correccion:
      `
        <p>
          La corrección debe realizarse conforme
          al manual y normas de la edición utilizada.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis considera desempeño global,
          índices, subtests, dispersión interna,
          antecedentes y motivo de evaluación.
        </p>
      `,

    interpretacion:
      `
        <p>
          Los puntajes deben interpretarse considerando
          edad, historia educativa, condiciones de
          administración y características individuales.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede aportar información relevante acerca
          de capacidad cognitiva y funcionamiento
          intelectual cuando tales variables resultan
          pertinentes para los puntos periciales.
        </p>

        <p>
          No determina por sí sola capacidad jurídica,
          imputabilidad ni incapacidad psicológica.
        </p>
      `,

    validez:
      `
        <p>
          Debe utilizarse la edición, adaptación y
          normas apropiadas para la población examinada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Interpretar únicamente el puntaje global.</li>
          <li>Ignorar diferencias significativas entre índices.</li>
          <li>Utilizar normas inadecuadas para la población.</li>
          <li>No considerar factores educativos, culturales o neurológicos.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          El perfil cognitivo se describe considerando
          el rendimiento global y las diferencias
          internas relevantes, integrándolo con
          antecedentes y restantes hallazgos.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Wechsler Adult Intelligence Scale · Fifth Edition.</li>
          <li>Pearson Assessments · WAIS-5.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Cognition-%26-Neuro/Wechsler-Adult-Intelligence-Scale-%7C-Fifth-Edition/p/P100071002"

  }),



  /* =======================================================
     19 · WISC-V
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-wisc-v",

    codigo:
      "TEC-019",

    titulo:
      "WISC-V",

    sigla:
      "WISC-V",

    nombreCompleto:
      "Wechsler Intelligence Scale for Children · Fifth Edition",

    autores:
      "David Wechsler · desarrollos y revisiones posteriores",

    categoriaTecnica:
      "Inteligencia y cognición",

    tipoInstrumento:
      "Escala individual de capacidad cognitiva",

    area:
      "Funcionamiento cognitivo infantil y adolescente",

    poblacion:
      "Niños y adolescentes de 6:0 a 16:11 años.",

    modalidad:
      "Administración individual · Papel o digital",

    tiempo:
      "Aproximadamente 60 minutos para los subtests centrales.",

    cantidadItems:
      "Organizado en subtests",

    finalidad:
      `
        <p>
          Evaluar el funcionamiento cognitivo general
          y diferentes dominios intelectuales en
          niños y adolescentes.
        </p>
      `,

    queEvalua:
      `
        <p>
          Proporciona índices y medidas vinculadas
          con diferentes componentes de la capacidad
          cognitiva.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Requiere administración individual por
          profesional capacitado y utilización de
          materiales oficiales.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Incluye tareas verbales, manipulativas
          y gráficas según cada subtest.
        </p>
      `,

    correccion:
      `
        <p>
          Se corrige mediante procedimientos y normas
          correspondientes a la edición utilizada.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis considera funcionamiento global,
          índices específicos, subtests y perfil
          intraindividual.
        </p>
      `,

    interpretacion:
      `
        <p>
          Debe contextualizarse según edad,
          escolaridad, desarrollo, antecedentes
          y finalidad de la evaluación.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede aportar información cognitiva en
          evaluaciones de NNyA cuando sea pertinente
          para el objeto pericial.
        </p>
      `,

    validez:
      `
        <p>
          Deben respetarse las normas correspondientes
          a la versión lingüística y población evaluada.
        </p>
      `,

    limitaciones:
      `
        <p>
          ${TEXTO_LIMITACIONES}
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Reducir el resultado a un único CI.</li>
          <li>Ignorar historia escolar y del desarrollo.</li>
          <li>Utilizar baremos no pertinentes.</li>
          <li>Interpretar diferencias menores como alteraciones clínicas.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          El perfil cognitivo se integra con historia
          evolutiva, escolaridad, entrevista y demás
          fuentes de evaluación disponibles.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Wechsler Intelligence Scale for Children · Fifth Edition.</li>
          <li>Pearson Assessments · WISC-V.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/store/en/usd/p/100000771.html"

  }),



  /* =======================================================
     20 · RAVEN'S 2
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-ravens-2",

    codigo:
      "TEC-020",

    titulo:
      "Raven’s 2",

    sigla:
      "Raven’s 2",

    nombreCompleto:
      "Matrices Progresivas de Raven · Segunda Edición",

    autores:
      "John C. Raven y desarrollos posteriores",

    categoriaTecnica:
      "Inteligencia y razonamiento",

    tipoInstrumento:
      "Prueba no verbal de razonamiento",

    area:
      "Capacidad intelectual no verbal · Razonamiento",

    poblacion:
      "4:0 a 69:11 años en la versión española de Raven’s 2.",

    modalidad:
      "Administración manual u online autorizada",

    tiempo:
      "Aproximadamente 30 a 45 minutos",

    cantidadItems:
      "Consultar forma y modalidad utilizada",

    finalidad:
      `
        <p>
          Evaluar capacidad de razonamiento no verbal
          mediante resolución de problemas visuales.
        </p>
      `,

    queEvalua:
      `
        <p>
          Explora procesos relacionados con razonamiento
          abstracto y capacidad para identificar relaciones
          y patrones.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Debe utilizarse la versión oficial adecuada
          y seguirse las instrucciones correspondientes.
        </p>

        <p>
          Biblioteca FALCO® no reproduce matrices
          ni estímulos visuales protegidos.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Selección de alternativas frente a
          problemas visuales estructurados.
        </p>
      `,

    correccion:
      `
        <p>
          La puntuación debe realizarse conforme
          al sistema y normas autorizados.
        </p>
      `,

    analisis:
      `
        <p>
          El resultado debe considerarse en relación
          con edad, condiciones de administración
          y demás información cognitiva disponible.
        </p>
      `,

    interpretacion:
      `
        <p>
          Proporciona una estimación de capacidad
          de razonamiento no verbal dentro del marco
          normativo correspondiente.
        </p>
      `,

    usoForense:
      `
        <p>
          Puede aportar información cognitiva
          complementaria cuando se requiere una
          evaluación con menor carga verbal.
        </p>
      `,

    validez:
      `
        <p>
          La interpretación debe basarse en las
          normas correspondientes a la edición
          y población utilizadas.
        </p>
      `,

    limitaciones:
      `
        <p>
          No constituye una evaluación completa
          del funcionamiento intelectual.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Equiparar el resultado con una evaluación intelectual completa.</li>
          <li>Aplicar baremos inapropiados.</li>
          <li>Ignorar condiciones visuales o neurológicas.</li>
          <li>Sobreinterpretar diferencias pequeñas.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          El desempeño en razonamiento no verbal
          se considera junto con antecedentes,
          escolaridad y restantes indicadores cognitivos.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Raven, J. C. · Matrices Progresivas.</li>
          <li>Pearson Assessments · Raven’s 2.</li>
        </ul>
      `,

    fuenteOficial:
      "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Cognition-%26-Neuro/Raven%E2%80%99s-2%2C-Matrices-progresivas-de-Raven-%7C-Segunda-Edici%C3%B3n%2C-Spain-Version-/p/P100072002"

  }),



  /* =======================================================
     21 · EVALUACIÓN DE SÍNTOMAS DE TRAUMA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-trauma",

    codigo:
      "TEC-021",

    titulo:
      "Evaluación de síntomas relacionados con trauma",

    sigla:
      "TRAUMA",

    nombreCompleto:
      "Evaluación psicológica de sintomatología relacionada con experiencias traumáticas",

    autores:
      "Categoría técnica · Diversos instrumentos disponibles",

    categoriaTecnica:
      "Trauma y estrés",

    tipoInstrumento:
      "Familia de escalas e inventarios",

    area:
      "Trauma · Estrés postraumático · Reacciones postraumáticas",

    poblacion:
      "Depende del instrumento específico seleccionado.",

    modalidad:
      "Autoinforme, entrevista estructurada o combinación multimétodo",

    tiempo:
      "Variable según instrumento",

    cantidadItems:
      "Variable",

    finalidad:
      `
        <p>
          Explorar manifestaciones psicológicas
          asociadas con experiencias potencialmente
          traumáticas y su repercusión actual.
        </p>
      `,

    queEvalua:
      `
        <p>
          Puede incluir síntomas intrusivos,
          evitación, activación, alteraciones emocionales,
          cognitivas y funcionales, según el instrumento.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La selección debe realizarse en función
          de edad, objetivo de evaluación, contexto
          y evidencia disponible.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Depende de la técnica específica utilizada.
        </p>
      `,

    correccion:
      `
        <p>
          Cada instrumento posee procedimientos
          propios de corrección y normas.
        </p>
      `,

    analisis:
      `
        <p>
          Debe analizarse la relación temporal,
          antecedentes, exposición, evolución,
          funcionamiento previo y posterior
          e hipótesis alternativas.
        </p>
      `,

    interpretacion:
      `
        <p>
          La presencia de síntomas compatibles
          con trauma no demuestra por sí misma
          la ocurrencia de un hecho específico.
        </p>
      `,

    usoForense:
      `
        <p>
          En evaluación pericial debe distinguirse
          entre sintomatología, diagnóstico,
          causalidad psicológica y acreditación
          jurídica de los hechos.
        </p>
      `,

    validez:
      `
        <p>
          Debe seleccionarse un instrumento
          con respaldo suficiente para la población
          y finalidad de evaluación.
        </p>
      `,

    limitaciones:
      `
        <p>
          Síntomas semejantes pueden observarse
          en diferentes cuadros y contextos.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Inferir el hecho traumático a partir del síntoma.</li>
          <li>Confundir compatibilidad con causalidad.</li>
          <li>No evaluar antecedentes traumáticos previos.</li>
          <li>Ignorar diagnósticos diferenciales.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          La sintomatología vinculada con trauma
          se analiza en relación con cronología,
          antecedentes, repercusión funcional
          y restantes hallazgos.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Bibliografía especializada en trauma y evaluación psicológica.</li>
          <li>Manual del instrumento específico utilizado.</li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false

  }),



  /* =======================================================
     22 · EVALUACIÓN DE RIESGO SUICIDA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-riesgo-suicida",

    codigo:
      "TEC-022",

    titulo:
      "Evaluación psicológica de riesgo suicida",

    sigla:
      "RIESGO",

    nombreCompleto:
      "Evaluación integral de riesgo autolesivo y suicida",

    autores:
      "Procedimiento clínico profesional · Puede incorporar escalas específicas",

    categoriaTecnica:
      "Riesgo y seguridad",

    tipoInstrumento:
      "Evaluación multimétodo",

    area:
      "Riesgo suicida · Conducta autolesiva",

    poblacion:
      "Niños, adolescentes o adultos según contexto y herramienta seleccionada.",

    modalidad:
      "Entrevista clínica + instrumentos complementarios cuando corresponda",

    tiempo:
      "Variable según nivel de riesgo y contexto",

    cantidadItems:
      "No corresponde como técnica única",

    finalidad:
      `
        <p>
          Identificar factores actuales y antecedentes
          relevantes para valorar riesgo autolesivo
          o suicida y definir medidas profesionales
          de seguridad.
        </p>
      `,

    queEvalua:
      `
        <p>
          Puede explorar ideación, intención,
          planificación, antecedentes, acceso a medios,
          factores precipitantes y factores protectores.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          La evaluación requiere entrevista directa
          y análisis clínico contextual. Las escalas
          pueden complementar, pero no reemplazar,
          el juicio profesional.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Entrevista y, cuando corresponda,
          instrumentos estructurados autorizados.
        </p>
      `,

    correccion:
      `
        <p>
          No existe un puntaje único capaz de
          determinar por sí mismo el riesgo.
        </p>
      `,

    analisis:
      `
        <p>
          Debe considerarse la combinación dinámica
          de factores de riesgo, protección,
          antecedentes y situación actual.
        </p>
      `,

    interpretacion:
      `
        <p>
          La valoración debe actualizarse ante
          cambios significativos y no puede reducirse
          a una clasificación mecánica.
        </p>
      `,

    usoForense:
      `
        <p>
          En contexto forense deben diferenciarse
          claramente evaluación de riesgo,
          diagnóstico y cuestiones jurídicas.
        </p>
      `,

    validez:
      `
        <p>
          Las herramientas complementarias deben
          utilizarse conforme a evidencia y población
          para las que fueron desarrolladas.
        </p>
      `,

    limitaciones:
      `
        <p>
          La predicción individual de conductas
          futuras presenta límites importantes
          y requiere cautela profesional.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Usar una escala como único criterio de riesgo.</li>
          <li>No evaluar acceso a medios o antecedentes.</li>
          <li>No considerar factores protectores.</li>
          <li>Confundir ausencia de ideación declarada con ausencia de riesgo.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          La valoración se formula considerando
          información clínica actual, antecedentes,
          factores de riesgo, factores protectores
          y contexto inmediato.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Guías clínicas vigentes sobre evaluación del riesgo suicida.</li>
          <li>Manual de las escalas específicas empleadas.</li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false,

    reproduccionItems:
      "No corresponde como técnica única"

  }),



  /* =======================================================
     23 · SIMULACIÓN Y VALIDEZ DE RESPUESTA
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-validez-respuesta",

    codigo:
      "TEC-023",

    titulo:
      "Evaluación de simulación y validez de respuesta",

    sigla:
      "EVR",

    nombreCompleto:
      "Evaluación multimétodo de validez de síntomas y desempeño",

    autores:
      "Área metodológica forense · Diversos instrumentos específicos",

    categoriaTecnica:
      "Evaluación forense",

    tipoInstrumento:
      "Estrategia multimétodo",

    area:
      "Validez de síntomas · Validez de desempeño · Estilo de respuesta",

    poblacion:
      "Según instrumento y contexto específico.",

    modalidad:
      "Entrevista + indicadores de validez + pruebas específicas cuando corresponda",

    tiempo:
      "Variable",

    cantidadItems:
      "No corresponde como instrumento único",

    finalidad:
      `
        <p>
          Evaluar la calidad e interpretabilidad
          de la información obtenida y explorar
          posibles estilos de respuesta atípicos.
        </p>
      `,

    queEvalua:
      `
        <p>
          Puede incluir consistencia de respuesta,
          presentación de síntomas, desempeño,
          discrepancias entre fuentes y otros
          indicadores técnicamente pertinentes.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Deben seleccionarse métodos apropiados
          a la hipótesis específica y evitar la
          utilización de un único indicador.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          Depende de las herramientas seleccionadas.
        </p>
      `,

    correccion:
      `
        <p>
          Cada prueba específica posee criterios
          propios y debe utilizarse conforme
          a su manual y evidencia disponible.
        </p>
      `,

    analisis:
      `
        <p>
          El análisis debe ser convergente,
          considerando múltiples indicadores
          y fuentes independientes.
        </p>
      `,

    interpretacion:
      `
        <p>
          Un indicador atípico no permite por sí
          solo concluir simulación deliberada.
        </p>
      `,

    usoForense:
      `
        <p>
          Esta evaluación adquiere especial relevancia
          cuando existen incentivos externos o cuando
          la validez de los resultados constituye
          una cuestión metodológica importante.
        </p>
      `,

    validez:
      `
        <p>
          Deben utilizarse procedimientos respaldados
          empíricamente y adecuados al constructo
          evaluado.
        </p>
      `,

    limitaciones:
      `
        <p>
          La interpretación requiere distinguir
          simulación, sobresimulación, disimulación,
          dificultades cognitivas, psicopatología
          severa y otras explicaciones alternativas.
        </p>
      `,

    integracionPericial:
      `
        <p>
          ${TEXTO_INTEGRACION}
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Concluir simulación a partir de un único indicador.</li>
          <li>Confundir inconsistencia con intención de engaño.</li>
          <li>No explorar explicaciones alternativas.</li>
          <li>Utilizar pruebas sin respaldo para ese propósito.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          La validez de la información se analiza
          a partir de convergencias y discrepancias
          entre entrevista, conducta observada,
          documentación y resultados de distintas
          técnicas.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Bibliografía especializada en evaluación forense y validez de respuesta.</li>
          <li>Manuales de los instrumentos específicos empleados.</li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false

  }),



  /* =======================================================
     24 · EVALUACIÓN DE DAÑO PSÍQUICO
  ======================================================= */

  crearFichaInstrumento({

    id:
      "biblioteca-instrumento-dano-psiquico",

    codigo:
      "TEC-024",

    titulo:
      "Evaluación psicológica de daño psíquico",

    sigla:
      "DP",

    nombreCompleto:
      "Evaluación pericial psicológica de daño psíquico",

    autores:
      "Procedimiento pericial multimétodo",

    categoriaTecnica:
      "Evaluación forense",

    tipoInstrumento:
      "Proceso de evaluación pericial",

    area:
      "Daño psíquico · Incapacidad · Nexo causal",

    poblacion:
      "Personas evaluadas en contextos judiciales según objeto pericial.",

    modalidad:
      "Entrevista forense + batería psicológica + antecedentes + documentación",

    tiempo:
      "Variable según complejidad del caso",

    cantidadItems:
      "No corresponde",

    finalidad:
      `
        <p>
          Determinar si existen alteraciones
          psicológicas clínicamente significativas
          susceptibles de ser consideradas dentro
          del concepto pericial de daño psíquico.
        </p>
      `,

    queEvalua:
      `
        <p>
          Examina estado psicológico, funcionamiento
          previo y actual, evolución, repercusión,
          antecedentes, causalidad, concausas y
          eventual persistencia de secuelas.
        </p>
      `,

    administracionDetalle:
      `
        <p>
          Requiere una evaluación multimétodo,
          selección fundada de técnicas y análisis
          de antecedentes y documentación relevante.
        </p>
      `,

    modalidadRespuesta:
      `
        <p>
          No constituye un test único.
          Integra múltiples técnicas y fuentes.
        </p>
      `,

    correccion:
      `
        <p>
          Cada instrumento utilizado se corrige
          conforme a sus procedimientos específicos.
          La conclusión pericial surge de la integración.
        </p>
      `,

    analisis:
      `
        <p>
          Deben considerarse existencia de síndrome
          psicológico, novedad, relación temporal
          y causal, evolución, repercusión funcional,
          antecedentes y posibles concausas.
        </p>
      `,

    interpretacion:
      `
        <p>
          La presencia de síntomas no equivale
          automáticamente a daño psíquico ni a
          incapacidad resarcible.
        </p>
      `,

    usoForense:
      `
        <p>
          Constituye una evaluación específicamente
          vinculada con preguntas periciales acerca
          de secuelas psicológicas, nexo causal,
          incapacidad y necesidad de tratamiento.
        </p>
      `,

    validez:
      `
        <p>
          La solidez de las conclusiones depende
          de metodología explícita, convergencia
          de fuentes y adecuada fundamentación.
        </p>
      `,

    limitaciones:
      `
        <p>
          Deben diferenciarse sufrimiento,
          reacción emocional esperable,
          trastorno psicológico, daño psíquico
          e incapacidad.
        </p>
      `,

    integracionPericial:
      `
        <p>
          La conclusión debe considerar entrevista,
          antecedentes, documentación, batería
          administrada, evolución y repercusión
          en las distintas áreas vitales.
        </p>
      `,

    erroresFrecuentes:
      `
        <ul>
          <li>Equiparar síntomas con daño psíquico.</li>
          <li>Asignar incapacidad a partir de un único test.</li>
          <li>No analizar personalidad previa y antecedentes.</li>
          <li>No fundamentar nexo causal o concausalidad.</li>
          <li>Confundir diagnóstico clínico con incapacidad pericial.</li>
        </ul>
      `,

    ejemploIntegracion:
      `
        <p>
          La existencia de daño psíquico se analiza
          considerando la presencia de una alteración
          psicológica coherente, su relación con el
          hecho investigado, antecedentes relevantes,
          evolución y repercusión funcional.
        </p>
      `,

    bibliografia:
      `
        <ul>
          <li>Bibliografía especializada en psicología forense y daño psíquico.</li>
          <li>Doctrina y baremos aplicables según jurisdicción y fuero.</li>
        </ul>
      `,

    fuenteOficial:
      "",

    materialProtegido:
      false,

    reproduccionItems:
      "No corresponde"

  })

];
