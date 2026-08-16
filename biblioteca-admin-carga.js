import {
  auth,
  db
} from "./firebase-config.js";


import {
  escritosBiblioteca,
  resumenBiblioteca
} from "./biblioteca-escritos-catalogo.js";


import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  doc,
  getDoc,
  setDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  modelosJudicialesBiblioteca,
  resumenModelosJudiciales
} from "./biblioteca-modelos-judiciales-catalogo.js";

import {
  instrumentosBiblioteca
} from "./biblioteca-instrumentos-catalogo.js";


import {
  modelosJudicialesAmpliacion,
  resumenModelosJudicialesAmpliacion
} from "./biblioteca-modelos-judiciales-ampliacion-catalogo.js";



console.log(
  "📚 Biblioteca FALCO® · Cargador administrativo"
);



/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAILS = [
  "estudiopericialpsicologico@gmail.com"
];



/* =========================================================
   ELEMENTOS DE INTERFAZ
========================================================= */

const adminEstado =
  document.getElementById(
    "adminEstado"
  );


const panelCarga =
  document.getElementById(
    "panelCarga"
  );


const cargarPruebaBtn =
  document.getElementById(
    "cargarPruebaBtn"
  );


const resultadoCarga =
  document.getElementById(
    "resultadoCarga"
  );


const cargar300Btn =
  document.getElementById(
    "cargar300Btn"
  );


const resultadoCarga300 =
  document.getElementById(
    "resultadoCarga300"
  );


  const cargarModelos111Btn =
  document.getElementById(
    "cargarModelos111Btn"
  );


const resultadoModelos111 =
  document.getElementById(
    "resultadoModelos111"
  );


  const cargarAmpliacion121Btn =
  document.getElementById(
    "cargarAmpliacion121Btn"
  );


const resultadoAmpliacion121 =
  document.getElementById(
    "resultadoAmpliacion121"
  );



  /* =========================================================
   TÉCNICAS E INSTRUMENTOS
========================================================= */

const cargarScl90Btn =
  document.getElementById(
    "cargarScl90Btn"
  );


const resultadoScl90 =
  document.getElementById(
    "resultadoScl90"
  );


  /* =========================================================
   CATÁLOGO DE TÉCNICAS E INSTRUMENTOS
========================================================= */

const cargarInstrumentosBtn =
  document.getElementById(
    "cargarInstrumentosBtn"
  );


const resultadoInstrumentos =
  document.getElementById(
    "resultadoInstrumentos"
  );



/* =========================================================
   URL BASE
========================================================= */

const BASE_PDF =
  "pdf/biblioteca/escritos/";



  /* =========================================================
   FICHA TÉCNICA · SCL-90-R
========================================================= */

const fichaScl90 = {

  id:
    "biblioteca-instrumento-scl90-r",


  codigo:
    "TEC-SCL90R",


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
    "Inventarios de síntomas",


  titulo:
    "SCL-90-R",


  sigla:
    "SCL-90-R",


  nombreCompleto:
    "Symptom Checklist-90-Revised",


  autorInstrumento:
    "Leonard R. Derogatis, PhD",


  descripcion:
    "Instrumento de autoinforme destinado a la evaluación amplia de síntomas psicológicos y malestar psicopatológico. Su utilización requiere interpretación profesional e integración con entrevista, antecedentes y demás fuentes de información disponibles.",


  finalidad:
    "Explorar la presencia y magnitud de síntomas psicológicos informados por la persona evaluada. Puede utilizarse como herramienta de evaluación inicial y para observar cambios sintomáticos a lo largo del tiempo, siempre dentro de un proceso de evaluación profesional.",


  queEvalua:
    "Proporciona información sobre un amplio rango de síntomas y manifestaciones de malestar psicológico. Sus resultados describen el perfil sintomático informado por la persona evaluada y no deben interpretarse de manera aislada como diagnóstico clínico o conclusión pericial.",


  tipoInstrumento:
    "Inventario de síntomas · Autoinforme",


  poblacion:
    "Personas de 13 años en adelante, de acuerdo con la información oficial del editor.",


  administracion:
    "La administración debe realizarse conforme a las instrucciones y condiciones establecidas en el manual y materiales oficiales. Puede administrarse mediante modalidades autorizadas por el editor, incluyendo formatos impresos y digitales.",


  tiempo:
    "Aproximadamente 12 a 15 minutos, según la información oficial del editor.",


  cantidadItems:
    90,


  modalidadRespuesta:
    "Escala de valoración de cinco puntos. Biblioteca FALCO® no reproduce los ítems ni las opciones textuales del instrumento.",


  correccion:
    "La corrección debe realizarse mediante procedimientos, materiales y sistemas autorizados. Biblioteca FALCO® no publica claves de corrección, hojas de respuesta, algoritmos propietarios, baremos ni tablas protegidas.",


  analisis:
    "El análisis profesional considera el patrón general de respuestas, la magnitud relativa de los indicadores obtenidos, la coherencia con la entrevista y los antecedentes, el contexto de evaluación y la convergencia o divergencia con otras técnicas utilizadas.",


  interpretacion:
    "Los resultados deben interpretarse de manera contextualizada. Un puntaje elevado expresa mayor presencia o intensidad de síntomas informados dentro del marco de referencia correspondiente, pero no constituye por sí mismo un diagnóstico ni acredita automáticamente daño psíquico, incapacidad, causalidad o simulación.",


  usoForense:
    "En evaluación psicológica forense puede utilizarse como una fuente complementaria de información sobre sintomatología autopercibida. Sus resultados deben integrarse con entrevista forense, antecedentes, documentación, observación clínica, otras técnicas y análisis de hipótesis alternativas. Por tratarse de un autoinforme, no debe utilizarse aisladamente para establecer credibilidad, simulación, incapacidad o nexo causal.",


  limitaciones:
    "La interpretación puede verse influida por comprensión de consignas, estilo de respuesta, contexto, estado emocional y motivación del evaluado. No sustituye la entrevista ni la integración profesional. La selección y utilización del instrumento deben ser pertinentes al objetivo específico de la evaluación.",


  validezEvidencia:
    "La utilización responsable exige consultar el manual vigente, las normas correspondientes a la población evaluada y la evidencia psicométrica aplicable al contexto en que se emplea el instrumento.",


  integracionPericial:
    "En un informe pericial los resultados pueden incorporarse describiendo los indicadores relevantes y su relación con el conjunto de datos obtenidos. Las conclusiones periciales deben surgir de la convergencia de múltiples fuentes y no de un resultado aislado.",


  erroresFrecuentes:
    [
      "Interpretar automáticamente un puntaje como diagnóstico.",
      "Utilizar el instrumento como única fuente de evidencia.",
      "Confundir sintomatología informada con incapacidad psicológica.",
      "Inferir causalidad únicamente a partir del perfil obtenido.",
      "Utilizarlo como prueba exclusiva para descartar o confirmar simulación.",
      "Aplicar baremos o procedimientos de corrección que no correspondan a la versión utilizada."
    ],


  ejemploIntegracion:
    "Los resultados del instrumento se consideran como indicadores complementarios de sintomatología autopercibida y se interpretan conjuntamente con la entrevista, los antecedentes disponibles, la observación profesional y las demás técnicas administradas. Su lectura no se realiza de manera aislada.",


  materialProtegido:
    true,


  reproduccionItems:
    "No autorizada en Biblioteca FALCO®. No se reproducen ítems, protocolos, hojas de respuesta, claves, baremos ni materiales protegidos.",


  servicioProfesional:
    true,


  servicioDescripcion:
    "El Estudio Pericial Psicológico FALCO® brinda servicios profesionales de selección, administración, análisis, interpretación e integración de instrumentos psicológicos cuando su utilización resulte pertinente para la finalidad de la evaluación.",


  bibliografia:
    [
      "Derogatis, L. R. SCL-90-R: Symptom Checklist-90-Revised.",
      "Manual y documentación técnica oficial vigente del instrumento.",
      "Pearson Assessments · Symptom Checklist-90-Revised."
    ],


  fuenteOficial:
    "https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Personality-%26-Biopsychosocial/Symptom-Checklist-90-Revised/p/100000645",


  autor:
    "Biblioteca FALCO® · Estudio Pericial Psicológico FALCO®",


  fechaActualizacion:
    "Agosto 2026",


  tags:
    "técnicas, instrumentos, SCL-90-R, SCL90, síntomas, psicopatología, evaluación psicológica, psicología forense, autoinforme, evaluación forense",


  rolesPermitidos: [
    "admin",
    "biblioteca",
    "perito",
    "profesional"
  ]

};



/* =========================================================
   LOTE DE PRUEBA
========================================================= */

const escritosPrueba = [

  {

    id:
      "biblioteca-escrito-001",

    numero:
      1,

    codigo:
      "ESC-001",

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

    subcategoria:
      "Informes psicológicos",

    fuero:
      "General",

    tipoEscrito:
      "Informe psicológico",

    titulo:
      "Informe Psicológico General",

    descripcion:
      "Modelo general de informe psicológico para consulta profesional dentro de Biblioteca FALCO®.",

    autor:
      "Estudio Pericial Psicológico FALCO®",

    fechaActualizacion:
      "2026",

    tags:
      "escritos, informe psicológico, evaluación psicológica, psicología forense",

    rolesPermitidos: [
      "admin",
      "biblioteca",
      "perito",
      "profesional"
    ],

    urlPdf:
      BASE_PDF +
      "001_INFORME_PSICOLÓGICO_GENERAL.pdf"

  },


  {

    id:
      "biblioteca-escrito-116",

    numero:
      116,

    codigo:
      "ESC-116",

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

    subcategoria:
      "Familia y NNyA",

    fuero:
      "Familia",

    tipoEscrito:
      "Capacidad parental",

    titulo:
      "Informe de Capacidad Parental",

    descripcion:
      "Modelo profesional orientado a la evaluación de capacidad parental dentro del ámbito judicial.",

    autor:
      "Estudio Pericial Psicológico FALCO®",

    fechaActualizacion:
      "2026",

    tags:
      "familia, capacidad parental, evaluación parental, psicología forense",

    rolesPermitidos: [
      "admin",
      "biblioteca",
      "perito",
      "profesional"
    ],

    urlPdf:
      BASE_PDF +
      "116_INFORME_DE_CAPACIDAD_PARENTAL.pdf"

  },


  {

    id:
      "biblioteca-escrito-161",

    numero:
      161,

    codigo:
      "ESC-161",

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

    subcategoria:
      "Daño psíquico avanzado",

    fuero:
      "Civil",

    tipoEscrito:
      "Evaluación de daño psíquico",

    titulo:
      "Evaluación Avanzada de Daño Psíquico",

    descripcion:
      "Modelo avanzado para la evaluación psicológica forense del daño psíquico y su repercusión funcional.",

    autor:
      "Estudio Pericial Psicológico FALCO®",

    fechaActualizacion:
      "2026",

    tags:
      "daño psíquico, civil, evaluación forense, incapacidad psicológica",

    rolesPermitidos: [
      "admin",
      "biblioteca",
      "perito",
      "profesional"
    ],

    urlPdf:
      BASE_PDF +
      "161_EVALUACIÓN_AVANZADA_DE_DAÑO_PSÍQUICO.pdf"

  }

];



/* =========================================================
   VERIFICACIÓN DE ADMINISTRADOR
========================================================= */

onAuthStateChanged(

  auth,

  async user => {


    if (
      !user
    ) {

      adminEstado.innerHTML = `
        ❌ No hay una sesión iniciada.
      `;

      return;

    }


    try {

      const ref =
        doc(
          db,
          "usuarios",
          user.uid
        );


      const snap =
        await getDoc(
          ref
        );


      const datosUsuario =
        snap.exists()
          ? snap.data()
          : {};


      const esAdmin =

        ADMIN_EMAILS.includes(
          user.email
        )

        ||

        datosUsuario.rol ===
          "admin";


      if (
        !esAdmin
      ) {

        adminEstado.innerHTML = `

          ⛔ Acceso restringido.

          Esta herramienta está habilitada
          únicamente para administración.

        `;

        return;

      }


      adminEstado.innerHTML = `

        ✅ Administrador verificado<br>

        <strong>
          ${user.email}
        </strong>

      `;


      panelCarga.hidden =
        false;


    } catch (
      error
    ) {

      console.error(
        error
      );


      adminEstado.innerHTML = `

        ❌ No se pudieron verificar
        los permisos del usuario.

      `;

    }

  }

);



/* =========================================================
   CARGAR LOTE DE PRUEBA
========================================================= */

async function cargarEscritosPrueba() {

  if (
    !cargarPruebaBtn
  ) {

    return;

  }


  cargarPruebaBtn.disabled =
    true;


  cargarPruebaBtn.textContent =
    "Cargando…";


  resultadoCarga.innerHTML =
    "";


  let cargados =
    0;


  let errores =
    0;


  for (
    const item
    of escritosPrueba
  ) {

    try {

      const {
        id,
        ...contenido
      } =
        item;


      await setDoc(

        doc(
          db,
          "contenidos",
          id
        ),

        contenido,

        {
          merge:
            true
        }

      );


      cargados++;


      resultadoCarga.innerHTML += `

        <div>

          ✅ ${item.codigo}
          ·
          ${item.titulo}

        </div>

      `;


    } catch (
      error
    ) {

      errores++;


      console.error(

        `Error cargando ${item.codigo}:`,

        error

      );


      resultadoCarga.innerHTML += `

        <div>

          ❌ ${item.codigo}
          ·
          Error al cargar

        </div>

      `;

    }

  }


  resultadoCarga.innerHTML += `

    <hr
      style="
        border: 0;
        border-top: 1px solid rgba(255,255,255,.08);
        margin: 20px 0;
      "
    >

    <strong>
      Carga finalizada.
    </strong>

    <br>

    ${cargados}
    documentos cargados.

    <br>

    ${errores}
    errores.

  `;


  cargarPruebaBtn.disabled =
    false;


  cargarPruebaBtn.textContent =
    "Volver a cargar lote de prueba";

}



/* =========================================================
   PREPARAR REGISTRO DEL CATÁLOGO
========================================================= */

function prepararEscritoFirestore(
  item
) {

  return {

    numero:
      item.numero,

    codigo:
      item.codigo,

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

    subcategoria:
      item.subcategoria,

    fuero:
      item.fuero,

    tipoEscrito:
      item.tipoEscrito,

    titulo:
      item.titulo,

    descripcion:
      `${item.titulo}. Recurso profesional perteneciente a la colección de escritos de Biblioteca FALCO®.`,

    autor:
      "Estudio Pericial Psicológico FALCO®",

    fechaActualizacion:
      "2026",

    tags:
      item.tags,

    numerosOrigen:
      item.numerosOrigen,

    cantidadOriginales:
      item.cantidadOriginales,

    rolesPermitidos: [
      "admin",
      "biblioteca",
      "perito",
      "profesional"
    ],

    urlPdf:
      `pdf/biblioteca/escritos/${item.archivo}`

  };

}



/* =========================================================
   CARGA DEPURADA DE 57 ESCRITOS
========================================================= */

async function cargarCatalogoDepurado() {

  if (
    !cargar300Btn
  ) {

    return;

  }


  const cantidad =
    escritosBiblioteca.length;


  const confirmar =
    window.confirm(

      `Se cargarán ${cantidad} escritos únicos en Firestore.

Los 300 archivos PDF originales permanecerán conservados.

La Biblioteca mostrará solamente los contenidos diferentes.

¿Continuar?`

    );


  if (
    !confirmar
  ) {

    return;

  }


  cargar300Btn.disabled =
    true;


  cargar300Btn.textContent =
    "Cargando catálogo depurado…";


  if (
    resultadoCarga300
  ) {

    resultadoCarga300.innerHTML = `

      Preparando
      <strong>${cantidad}</strong>
      escritos profesionales…

    `;

  }


  try {

    const batch =
      writeBatch(
        db
      );


    escritosBiblioteca.forEach(
      item => {

        const referencia =
          doc(
            db,
            "contenidos",
            item.id
          );


        const contenido =
          prepararEscritoFirestore(
            item
          );


        batch.set(

          referencia,

          contenido,

          {
            merge:
              true
          }

        );

      }

    );


    /*
      Registros del lote de prueba
      que ya no deben quedar visibles.

      188 pertenece al contenido principal 175.
      230 pertenece al contenido principal 217.
    */

    const registrosPruebaObsoletos = [

      "biblioteca-escrito-188",

      "biblioteca-escrito-230"

    ];


    registrosPruebaObsoletos.forEach(
      id => {

        batch.delete(

          doc(
            db,
            "contenidos",
            id
          )

        );

      }

    );


    await batch.commit();


    if (
      resultadoCarga300
    ) {

      resultadoCarga300.innerHTML = `

        <div
          style="
            padding: 20px;
            border: 1px solid rgba(214,177,100,.28);
            border-radius: 14px;
            background: rgba(214,177,100,.04);
          "
        >

          <strong
            style="
              color: var(--bf-gold-light);
              font-size: 18px;
            "
          >

            ✅ Catálogo cargado correctamente

          </strong>

          <br><br>

          <strong>
            ${cantidad}
          </strong>
          escritos únicos cargados en Firestore.

          <br>

          <strong>
            ${resumenBiblioteca.totalArchivosOriginales}
          </strong>
          archivos PDF originales conservados.

          <br>

          <strong>
            ${resumenBiblioteca.totalDuplicadosOmitidos}
          </strong>
          copias repetidas omitidas de la Biblioteca.

          <br><br>

          Los registros de prueba obsoletos
          fueron eliminados correctamente.

        </div>

      `;

    }


    cargar300Btn.textContent =
      "Catálogo depurado cargado";


  } catch (
    error
  ) {

    console.error(
      "❌ Error en carga del catálogo:",
      error
    );


    if (
      resultadoCarga300
    ) {

      resultadoCarga300.innerHTML = `

        ❌ No se pudo completar la carga.

        <br><br>

        ${
          error.message ||
          error
        }

      `;

    }


    cargar300Btn.disabled =
      false;


    cargar300Btn.textContent =
      "Volver a intentar";

  }

}


/* =========================================================
   CARGA DE 111 MODELOS JUDICIALES
========================================================= */

async function cargarModelosJudiciales() {

  if (
    !cargarModelos111Btn
  ) {
    return;
  }


  const cantidad =
    modelosJudicialesBiblioteca.length;


  const confirmar =
    window.confirm(

      `Se cargarán ${cantidad} modelos judiciales y procesales en Firestore.

Los archivos PDF ya se encuentran publicados en el repositorio.

¿Continuar?`

    );


  if (
    !confirmar
  ) {
    return;
  }


  cargarModelos111Btn.disabled =
    true;


  cargarModelos111Btn.textContent =
    "Cargando 111 modelos…";


  if (
    resultadoModelos111
  ) {

    resultadoModelos111.innerHTML = `

      Preparando
      <strong>${cantidad}</strong>
      modelos judiciales…

    `;

  }


  try {

    const batch =
      writeBatch(
        db
      );


    modelosJudicialesBiblioteca.forEach(
      item => {

        const {
          id,
          ...contenido
        } =
          item;


        const referencia =
          doc(
            db,
            "contenidos",
            id
          );


        batch.set(

          referencia,

          contenido,

          {
            merge:
              true
          }

        );

      }
    );


    await batch.commit();


    if (
      resultadoModelos111
    ) {

      resultadoModelos111.innerHTML = `

        <div
          style="
            padding: 20px;
            border: 1px solid rgba(214,177,100,.28);
            border-radius: 14px;
            background: rgba(214,177,100,.04);
          "
        >

          <strong
            style="
              color: var(--bf-gold-light);
              font-size: 18px;
            "
          >
            ✅ Modelos judiciales cargados correctamente
          </strong>

          <br><br>

          <strong>
            ${cantidad}
          </strong>
          modelos cargados en Firestore.

          <br>

          Colección:

          <strong>
            ${resumenModelosJudiciales.coleccion}
          </strong>

          <br><br>

          Los documentos ya pueden visualizarse
          desde Biblioteca FALCO®.

        </div>

      `;

    }


    cargarModelos111Btn.textContent =
      "111 modelos cargados";


  } catch (
    error
  ) {

    console.error(
      "❌ Error cargando modelos judiciales:",
      error
    );


    if (
      resultadoModelos111
    ) {

      resultadoModelos111.innerHTML = `

        ❌ No se pudo completar la carga.

        <br><br>

        ${
          error.message ||
          error
        }

      `;

    }


    cargarModelos111Btn.disabled =
      false;


    cargarModelos111Btn.textContent =
      "Volver a intentar";

  }

}


/* =========================================================
   CARGA FICHA SCL-90-R
========================================================= */

async function cargarFichaScl90() {

  if (
    !cargarScl90Btn
  ) {

    return;

  }


  const confirmar =
    window.confirm(

      `Se incorporará la ficha técnica del SCL-90-R a Biblioteca FALCO®.

No se publicarán ítems, protocolos, claves de corrección ni material protegido.

¿Continuar?`

    );


  if (
    !confirmar
  ) {

    return;

  }


  cargarScl90Btn.disabled =
    true;


  cargarScl90Btn.textContent =
    "Cargando ficha SCL-90-R…";


  if (
    resultadoScl90
  ) {

    resultadoScl90.innerHTML = `
      Preparando ficha técnica…
    `;

  }


  try {

    const {
      id,
      ...contenido
    } =
      fichaScl90;


    await setDoc(

      doc(
        db,
        "contenidos",
        id
      ),

      contenido,

      {
        merge:
          true
      }

    );


    if (
      resultadoScl90
    ) {

      resultadoScl90.innerHTML = `

        <div
          style="
            padding: 20px;
            border: 1px solid rgba(214,177,100,.28);
            border-radius: 14px;
            background: rgba(214,177,100,.04);
          "
        >

          <strong
            style="
              color: var(--bf-gold-light);
              font-size: 18px;
            "
          >
            ✅ Ficha SCL-90-R cargada correctamente
          </strong>

          <br><br>

          La ficha técnica fue incorporada a
          <strong>Biblioteca FALCO®</strong>.

          <br><br>

          No se incorporaron ítems,
          protocolos, claves, baremos
          ni material protegido.

        </div>

      `;

    }


    cargarScl90Btn.textContent =
      "Ficha SCL-90-R cargada";


  } catch (
    error
  ) {

    console.error(
      "❌ Error cargando ficha SCL-90-R:",
      error
    );


    if (
      resultadoScl90
    ) {

      resultadoScl90.innerHTML = `

        ❌ No se pudo cargar la ficha SCL-90-R.

        <br><br>

        ${
          error.message ||
          error
        }

      `;

    }


    cargarScl90Btn.disabled =
      false;


    cargarScl90Btn.textContent =
      "Volver a intentar";

  }

}


/* =========================================================
   CARGA MASIVA DE TÉCNICAS E INSTRUMENTOS
========================================================= */

async function cargarCatalogoInstrumentos() {

  if (
    !cargarInstrumentosBtn
  ) {

    return;

  }


  const cantidad =
    instrumentosBiblioteca.length;


  const confirmar =
    window.confirm(

      `Se cargarán ${cantidad} fichas técnicas en Biblioteca FALCO®.

Los registros existentes con el mismo ID serán actualizados.

No se publicarán ítems, protocolos, claves, baremos ni material protegido.

¿Continuar?`

    );


  if (
    !confirmar
  ) {

    return;

  }


  cargarInstrumentosBtn.disabled =
    true;


cargarInstrumentosBtn.textContent =
  `Actualizando ${cantidad} fichas…`;


  if (
    resultadoInstrumentos
  ) {

    resultadoInstrumentos.innerHTML = `

      Preparando
      <strong>${cantidad}</strong>
      fichas técnicas…

    `;

  }


  try {

    const batch =
      writeBatch(
        db
      );


    instrumentosBiblioteca.forEach(
      item => {

        const {
          id,
          ...contenido
        } =
          item;


        const referencia =
          doc(
            db,
            "contenidos",
            id
          );


        batch.set(

          referencia,

          contenido,

          {
            merge:
              true
          }

        );

      }
    );


    await batch.commit();


    if (
      resultadoInstrumentos
    ) {

      resultadoInstrumentos.innerHTML = `

        <div
          style="
            padding: 20px;
            border: 1px solid rgba(214,177,100,.28);
            border-radius: 14px;
            background: rgba(214,177,100,.04);
          "
        >

          <strong
            style="
              color: var(--bf-gold-light);
              font-size: 18px;
            "
          >
            ✅ Catálogo técnico cargado correctamente
          </strong>

          <br><br>

          <strong>
            ${cantidad}
          </strong>
          fichas técnicas actualizadas en Firestore.

          <br><br>

          Colección:

          <strong>
            Técnicas e instrumentos
          </strong>

          <br><br>

          Los contenidos ya pueden visualizarse
          desde Biblioteca FALCO®.

        </div>

      `;

    }


    cargarInstrumentosBtn.textContent =
  `${cantidad} fichas actualizadas`;


  } catch (
    error
  ) {

    console.error(
      "❌ Error cargando catálogo de instrumentos:",
      error
    );


    if (
      resultadoInstrumentos
    ) {

      resultadoInstrumentos.innerHTML = `

        ❌ No se pudo completar la carga.

        <br><br>

        ${
          error.message ||
          error
        }

      `;

    }


    cargarInstrumentosBtn.disabled =
      false;


    cargarInstrumentosBtn.textContent =
      "Volver a intentar";

  }

}


/* =========================================================
   CARGA AMPLIACIÓN 118–238
========================================================= */

async function cargarAmpliacionModelos() {

  if (
    !cargarAmpliacion121Btn
  ) {
    return;
  }


  const cantidad =
    modelosJudicialesAmpliacion.length;


  const confirmar =
    window.confirm(

      `Se cargarán ${cantidad} nuevos modelos judiciales en Firestore.

Rango: 118–238.

Los 111 modelos anteriores no serán modificados.

¿Continuar?`

    );


  if (
    !confirmar
  ) {
    return;
  }


  cargarAmpliacion121Btn.disabled =
    true;


  cargarAmpliacion121Btn.textContent =
    `Cargando ${cantidad} modelos…`;


  if (
    resultadoAmpliacion121
  ) {

    resultadoAmpliacion121.innerHTML = `

      Preparando
      <strong>${cantidad}</strong>
      nuevos modelos judiciales…

    `;

  }


  try {

    const batch =
      writeBatch(
        db
      );


    modelosJudicialesAmpliacion.forEach(
      item => {

        const {
          id,
          ...contenido
        } =
          item;


        const referencia =
          doc(
            db,
            "contenidos",
            id
          );


        batch.set(

          referencia,

          contenido,

          {
            merge:
              true
          }

        );

      }
    );


    await batch.commit();


    if (
      resultadoAmpliacion121
    ) {

      resultadoAmpliacion121.innerHTML = `

        <div
          style="
            padding: 20px;
            border: 1px solid rgba(214,177,100,.28);
            border-radius: 14px;
            background: rgba(214,177,100,.04);
          "
        >

          <strong
            style="
              color: var(--bf-gold-light);
              font-size: 18px;
            "
          >
            ✅ Ampliación cargada correctamente
          </strong>

          <br><br>

          <strong>
            ${cantidad}
          </strong>
          nuevos modelos cargados en Firestore.

          <br>

          Colección:

          <strong>
            ${resumenModelosJudicialesAmpliacion.coleccion}
          </strong>

          <br><br>

          Biblioteca FALCO® ya puede mostrar
          los modelos 118–238.

        </div>

      `;

    }


    cargarAmpliacion121Btn.textContent =
      `${cantidad} modelos cargados`;


  } catch (
    error
  ) {

    console.error(
      "❌ Error cargando ampliación de modelos:",
      error
    );


    if (
      resultadoAmpliacion121
    ) {

      resultadoAmpliacion121.innerHTML = `

        ❌ No se pudo completar la carga.

        <br><br>

        ${
          error.message ||
          error
        }

      `;

    }


    cargarAmpliacion121Btn.disabled =
      false;


    cargarAmpliacion121Btn.textContent =
      "Volver a intentar";

  }

}


/* =========================================================
   EVENTOS
========================================================= */

cargarPruebaBtn?.addEventListener(

  "click",

  cargarEscritosPrueba

);


cargar300Btn?.addEventListener(

  "click",

  cargarCatalogoDepurado

);


cargarModelos111Btn?.addEventListener(
  "click",
  cargarModelosJudiciales
);


cargarScl90Btn?.addEventListener(
  "click",
  cargarFichaScl90
);

cargarInstrumentosBtn?.addEventListener(
  "click",
  cargarCatalogoInstrumentos
);


cargarAmpliacion121Btn?.addEventListener(
  "click",
  cargarAmpliacionModelos
);