/* =========================================================
   BIBLIOTECA FALCO®
   CATÁLOGO DEPURADO DE ESCRITOS
   57 contenidos únicos provenientes de 300 archivos
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function rango(
  desde,
  hasta
) {

  return Array.from(
    {
      length:
        hasta - desde + 1
    },

    (
      _,
      index
    ) =>
      desde + index
  );

}


function tituloVisible(
  titulo
) {

  let texto =
    String(titulo)
      .toLocaleLowerCase("es-AR");


  texto =
    texto.charAt(0).toLocaleUpperCase("es-AR")
    +
    texto.slice(1);


  /*
    Restauramos siglas.
  */

  texto =
    texto.replaceAll(
      "Nnya",
      "NNyA"
    );


  return texto;

}



/* =========================================================
   DEFINICIÓN DE LOS 57 CONTENIDOS ÚNICOS

   Formato:
   [
     numero principal,
     titulo real,
     archivo PDF,
     fuero,
     subcategoria,
     tipo de escrito,
     tags,
     numeros de origen
   ]
========================================================= */

const catalogoBase = [

  [
    1,
    "INFORME PSICOLÓGICO GENERAL",
    "001_INFORME_PSICOLÓGICO_GENERAL.pdf",
    "General",
    "Informes psicológicos",
    "Informe psicológico",
    "escritos, informe psicológico, evaluación psicológica, psicología forense",
    rango(1, 100)
  ],


  [
    101,
    "EVALUACIÓN DE DAÑO PSÍQUICO",
    "101_EVALUACIÓN_DE_DAÑO_PSÍQUICO.pdf",
    "Civil",
    "Daño psíquico",
    "Evaluación de daño psíquico",
    "daño psíquico, civil, incapacidad psicológica, evaluación forense",
    rango(101, 115)
  ],


  [
    116,
    "INFORME DE CAPACIDAD PARENTAL",
    "116_INFORME_DE_CAPACIDAD_PARENTAL.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [116]
  ],


  [
    117,
    "INFORME DE HABILIDADES PARENTALES",
    "117_INFORME_DE_HABILIDADES_PARENTALES.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [117]
  ],


  [
    118,
    "INFORME DE COMPETENCIAS PARENTALES",
    "118_INFORME_DE_COMPETENCIAS_PARENTALES.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [118]
  ],


  [
    119,
    "INFORME DE COPARENTALIDAD",
    "119_INFORME_DE_COPARENTALIDAD.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [119]
  ],


  [
    120,
    "INFORME DE OBSTRUCCIÓN VINCULAR",
    "120_INFORME_DE_OBSTRUCCIÓN_VINCULAR.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [120]
  ],


  [
    121,
    "EVALUACIÓN PARA CUIDADO PERSONAL",
    "121_EVALUACIÓN_PARA_CUIDADO_PERSONAL.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [121]
  ],


  [
    122,
    "EVALUACIÓN PARA RÉGIMEN DE COMUNICACIÓN",
    "122_EVALUACIÓN_PARA_RÉGIMEN_DE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [122]
  ],


  [
    123,
    "EVALUACIÓN PARA CAMBIO DE CENTRO DE VIDA",
    "123_EVALUACIÓN_PARA_CAMBIO_DE_CENTRO_DE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [123]
  ],


  [
    124,
    "EVALUACIÓN DE FAMILIA ENSAMBLADA",
    "124_EVALUACIÓN_DE_FAMILIA_ENSAMBLADA.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [124]
  ],


  [
    125,
    "EVALUACIÓN DE ABUELOS CUIDADORES",
    "125_EVALUACIÓN_DE_ABUELOS_CUIDADORES.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [125]
  ],


  [
    126,
    "EVALUACIÓN DE REFERENTES AFECTIVOS",
    "126_EVALUACIÓN_DE_REFERENTES_AFECTIVOS.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [126]
  ],


  [
    127,
    "EVALUACIÓN PARA RÉGIMEN DE COMUNICACIÓN AMPLIADO",
    "127_EVALUACIÓN_PARA_RÉGIMEN_DE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [127]
  ],


  [
    128,
    "EVALUACIÓN PARA SUSPENSIÓN DEL RÉGIMEN DE COMUNICACIÓN",
    "128_EVALUACIÓN_PARA_SUSPENSIÓN_DEL_RÉGIMEN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [128]
  ],


  [
    129,
    "EVALUACIÓN DE FAMILIA ENSAMBLADA EN CRISIS",
    "129_EVALUACIÓN_DE_FAMILIA_ENSAMBLADA_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [129]
  ],


  [
    130,
    "EVALUACIÓN DE ABUELOS EN ROL DE CUIDADORES SUSTITUTOS",
    "130_EVALUACIÓN_DE_ABUELOS_EN_ROL_DE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [130]
  ],


  [
    131,
    "EVALUACIÓN DE PARENTALIDAD EN CONTEXTOS DE ALTA CONFLICTIVIDAD",
    "131_EVALUACIÓN_DE_PARENTALIDAD_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [131]
  ],


  [
    132,
    "EVALUACIÓN DE INTERFERENCIA EN EL VÍNCULO PARENTAL",
    "132_EVALUACIÓN_DE_INTERFERENCIA_EN_EL.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [132]
  ],


  [
    133,
    "EVALUACIÓN DE OBSTRUCCIÓN DEL RÉGIMEN DE COMUNICACIÓN",
    "133_EVALUACIÓN_DE_OBSTRUCCIÓN_DEL_RÉGIMEN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [133]
  ],


  [
    134,
    "INFORME DE INDICADORES DE ALIENACIÓN PARENTAL",
    "134_INFORME_DE_INDICADORES_DE_ALIENACIÓN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, parentalidad, vínculo, evaluación forense",
    [134]
  ],


  [
    135,
    "EVALUACIÓN DE DAÑO PSICOLÓGICO EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "135_EVALUACIÓN_DE_DAÑO_PSICOLÓGICO_EN_NIÑOS,.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de familia",
    "familia, NNyA, daño psicológico, evaluación forense",
    [135]
  ],


  [
    136,
    "EVALUACIÓN DE RIESGO EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "136_EVALUACIÓN_DE_RIESGO_EN_NIÑOS,_NIÑAS_Y.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de riesgo",
    "familia, NNyA, riesgo, evaluación forense",
    [136]
  ],


  [
    137,
    "EVALUACIÓN DE VULNERABILIDAD PSICOSOCIAL EN NNYA",
    "137_EVALUACIÓN_DE_VULNERABILIDAD.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación psicosocial",
    "familia, NNyA, vulnerabilidad psicosocial, evaluación forense",
    [137]
  ],


  [
    138,
    "INFORME DE FACTORES PROTECTORES EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "138_INFORME_DE_FACTORES_PROTECTORES_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de factores protectores",
    "familia, NNyA, factores protectores, evaluación psicológica",
    [138]
  ],


  [
    139,
    "EVALUACIÓN DE RESILIENCIA EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "139_EVALUACIÓN_DE_RESILIENCIA_EN_NIÑOS,_NIÑAS.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de resiliencia",
    "familia, NNyA, resiliencia, evaluación psicológica",
    [139]
  ],


  [
    140,
    "EVALUACIÓN DE AJUSTE EMOCIONAL EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "140_EVALUACIÓN_DE_AJUSTE_EMOCIONAL_EN_NIÑOS,.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación emocional",
    "familia, NNyA, ajuste emocional, evaluación psicológica",
    [140]
  ],


  [
    141,
    "EVALUACIÓN DE TRASTORNOS DEL VÍNCULO EN NNYA",
    "141_EVALUACIÓN_DE_TRASTORNOS_DEL_VÍNCULO_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación vincular",
    "familia, NNyA, vínculo, evaluación psicológica",
    [141]
  ],


  [
    142,
    "EVALUACIÓN DE APEGO EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "142_EVALUACIÓN_DE_APEGO_EN_NIÑOS,_NIÑAS_Y.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de apego",
    "familia, NNyA, apego, vínculo, evaluación psicológica",
    [142]
  ],


  [
    143,
    "EVALUACIÓN DE VÍNCULO PRIMARIO Y SECUNDARIO EN NNYA",
    "143_EVALUACIÓN_DE_VÍNCULO_PRIMARIO_Y.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación vincular",
    "familia, NNyA, vínculo primario, vínculo secundario",
    [143]
  ],


  [
    144,
    "EVALUACIÓN DE DINÁMICA FAMILIAR SISTÉMICA EN NNYA",
    "144_EVALUACIÓN_DE_DINÁMICA_FAMILIAR_SISTÉMICA.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación familiar",
    "familia, NNyA, dinámica familiar, evaluación sistémica",
    [144]
  ],


  [
    145,
    "EVALUACIÓN DE CONFLICTO INTERPARENTAL CRÓNICO EN NNYA",
    "145_EVALUACIÓN_DE_CONFLICTO_INTERPARENTAL.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación familiar",
    "familia, NNyA, conflicto interparental, evaluación psicológica",
    [145]
  ],


  [
    146,
    "EVALUACIÓN DE ESTRÉS CRÓNICO EN NNYA POR CONFLICTO FAMILIAR",
    "146_EVALUACIÓN_DE_ESTRÉS_CRÓNICO_EN_NNYA.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación emocional",
    "familia, NNyA, estrés crónico, conflicto familiar",
    [146]
  ],


  [
    147,
    "EVALUACIÓN DE AFECTACIÓN EMOCIONAL POR CONFLICTO DE LEALTADES",
    "147_EVALUACIÓN_DE_AFECTACIÓN_EMOCIONAL_POR.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación emocional",
    "familia, NNyA, conflicto de lealtades, afectación emocional",
    [147]
  ],


  [
    148,
    "EVALUACIÓN DE ADAPTACIÓN ESCOLAR EN CONTEXTOS DE CONFLICTO FAMILIAR",
    "148_EVALUACIÓN_DE_ADAPTACIÓN_ESCOLAR_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de adaptación",
    "familia, NNyA, adaptación escolar, conflicto familiar",
    [148]
  ],


  [
    149,
    "EVALUACIÓN DE CONDUCTA EXTERNALIZANTE EN NNYA",
    "149_EVALUACIÓN_DE_CONDUCTA_EXTERNALIZANTE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación conductual",
    "familia, NNyA, conducta externalizante, evaluación psicológica",
    [149]
  ],


  [
    150,
    "EVALUACIÓN DE CONDUCTA INTERNALIZANTE EN NNYA",
    "150_EVALUACIÓN_DE_CONDUCTA_INTERNALIZANTE.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación conductual",
    "familia, NNyA, conducta internalizante, evaluación psicológica",
    [150]
  ],


  [
    151,
    "EVALUACIÓN DE REGULACIÓN EMOCIONAL EN NNYA",
    "151_EVALUACIÓN_DE_REGULACIÓN_EMOCIONAL_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación emocional",
    "familia, NNyA, regulación emocional, evaluación psicológica",
    [151]
  ],


  [
    152,
    "EVALUACIÓN DE CONTROL DE IMPULSOS EN NNYA",
    "152_EVALUACIÓN_DE_CONTROL_DE_IMPULSOS_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación conductual",
    "familia, NNyA, control de impulsos, evaluación psicológica",
    [152]
  ],


  [
    153,
    "EVALUACIÓN DE CONDUCTA OPOSICIONISTA EN NNYA",
    "153_EVALUACIÓN_DE_CONDUCTA_OPOSICIONISTA_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación conductual",
    "familia, NNyA, conducta oposicionista, evaluación psicológica",
    [153]
  ],


  [
    154,
    "EVALUACIÓN DE ADAPTACIÓN CONDUCTUAL ESCOLAR EN CONTEXTOS FAMILIARES COMPLEJOS",
    "154_EVALUACIÓN_DE_ADAPTACIÓN_CONDUCTUAL.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación de adaptación",
    "familia, NNyA, adaptación conductual, ámbito escolar",
    [154]
  ],


  [
    155,
    "EVALUACIÓN DE AJUSTE SOCIOEMOCIONAL EN NIÑOS, NIÑAS Y ADOLESCENTES",
    "155_EVALUACIÓN_DE_AJUSTE_SOCIOEMOCIONAL_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación socioemocional",
    "familia, NNyA, ajuste socioemocional, evaluación psicológica",
    [155]
  ],


  [
    156,
    "EVALUACIÓN DE FUNCIONAMIENTO FAMILIAR GLOBAL EN NNYA",
    "156_EVALUACIÓN_DE_FUNCIONAMIENTO_FAMILIAR.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación familiar",
    "familia, NNyA, funcionamiento familiar, evaluación psicológica",
    [156]
  ],


  [
    157,
    "EVALUACIÓN DE RECURSOS FAMILIARES Y REDES DE APOYO",
    "157_EVALUACIÓN_DE_RECURSOS_FAMILIARES_Y.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación familiar",
    "familia, recursos familiares, redes de apoyo, evaluación psicológica",
    [157]
  ],


  [
    158,
    "EVALUACIÓN DE CAPACIDAD DE CONTENCIÓN FAMILIAR",
    "158_EVALUACIÓN_DE_CAPACIDAD_DE_CONTENCIÓN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación familiar",
    "familia, contención familiar, parentalidad, evaluación psicológica",
    [158]
  ],


  [
    159,
    "EVALUACIÓN DE COMPETENCIAS PARENTALES AVANZADAS",
    "159_EVALUACIÓN_DE_COMPETENCIAS_PARENTALES.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación parental",
    "familia, competencias parentales, parentalidad, evaluación forense",
    [159]
  ],


  [
    160,
    "EVALUACIÓN INTEGRAL DE PARENTALIDAD EN CONTEXTOS COMPLEJOS",
    "160_EVALUACIÓN_INTEGRAL_DE_PARENTALIDAD_EN.pdf",
    "Familia",
    "Familia y NNyA",
    "Evaluación parental",
    "familia, parentalidad, contextos complejos, evaluación forense",
    [160]
  ],


  [
    161,
    "EVALUACIÓN AVANZADA DE DAÑO PSÍQUICO",
    "161_EVALUACIÓN_AVANZADA_DE_DAÑO_PSÍQUICO.pdf",
    "Civil",
    "Daño psíquico avanzado",
    "Evaluación de daño psíquico",
    "daño psíquico, civil, evaluación forense, incapacidad psicológica",
    rango(161, 174)
  ],


  [
    175,
    "PERICIA DE CREDIBILIDAD DEL RELATO",
    "175_PERICIA_DE_CREDIBILIDAD_DEL_RELATO.pdf",
    "Forense",
    "Credibilidad del relato",
    "Evaluación de credibilidad",
    "credibilidad, relato, evaluación forense, pericia psicológica",
    rango(175, 188)
  ],


  [
    189,
    "ANÁLISIS DE SIMULACIÓN Y DISIMULACIÓN",
    "189_ANÁLISIS_DE_SIMULACIÓN_Y_DISIMULACIÓN.pdf",
    "Forense",
    "Simulación y disimulación",
    "Evaluación de simulación",
    "simulación, disimulación, validez, evaluación forense",
    rango(189, 202)
  ],


  [
    203,
    "EVALUACIÓN DE TRAUMA COMPLEJO",
    "203_EVALUACIÓN_DE_TRAUMA_COMPLEJO.pdf",
    "Forense",
    "Trauma complejo",
    "Evaluación de trauma",
    "trauma complejo, evaluación psicológica, psicología forense",
    rango(203, 216)
  ],


  [
    217,
    "PERFIL PSICOLÓGICO FORENSE AVANZADO",
    "217_PERFIL_PSICOLÓGICO_FORENSE_AVANZADO.pdf",
    "Forense",
    "Perfil psicológico forense",
    "Perfil psicológico",
    "perfil psicológico, personalidad, evaluación forense, pericia",
    rango(217, 230)
  ],


  [
    231,
    "EVALUACIÓN DE RIESGO PSICOSOCIAL",
    "231_EVALUACIÓN_DE_RIESGO_PSICOSOCIAL.pdf",
    "Forense",
    "Riesgo psicosocial",
    "Evaluación de riesgo",
    "riesgo psicosocial, evaluación de riesgo, psicología forense",
    rango(231, 244)
  ],


  [
    245,
    "ANÁLISIS DE VIOLENCIA INTRAFAMILIAR",
    "245_ANÁLISIS_DE_VIOLENCIA_INTRAFAMILIAR.pdf",
    "Familia",
    "Violencia intrafamiliar",
    "Evaluación de violencia",
    "violencia intrafamiliar, familia, riesgo, evaluación psicológica",
    rango(245, 258)
  ],


  [
    259,
    "EVALUACIÓN DE FUNCIONAMIENTO PARENTAL CRÍTICO",
    "259_EVALUACIÓN_DE_FUNCIONAMIENTO_PARENTAL.pdf",
    "Familia",
    "Funcionamiento parental",
    "Evaluación parental",
    "parentalidad, capacidad parental, familia, evaluación forense",
    rango(259, 272)
  ],


  [
    273,
    "EVALUACIÓN DE VÍNCULO Y APEGO",
    "273_EVALUACIÓN_DE_VÍNCULO_Y_APEGO.pdf",
    "Familia",
    "Vínculo y apego",
    "Evaluación vincular",
    "vínculo, apego, familia, evaluación psicológica",
    rango(273, 286)
  ],


  [
    287,
    "EVALUACIÓN DE AJUSTE EMOCIONAL Y CONDUCTUAL",
    "287_EVALUACIÓN_DE_AJUSTE_EMOCIONAL_Y.pdf",
    "Forense",
    "Ajuste emocional y conductual",
    "Evaluación emocional",
    "ajuste emocional, conducta, evaluación psicológica, psicología forense",
    rango(287, 300)
  ]

];



/* =========================================================
   CONVERSIÓN AL FORMATO DE BIBLIOTECA
========================================================= */

export const escritosBiblioteca =

  catalogoBase.map(

    item => {

      const [

        numero,
        titulo,
        archivo,
        fuero,
        subcategoria,
        tipoEscrito,
        tags,
        numerosOrigen

      ] = item;


      const numeroTexto =
        String(numero)
          .padStart(
            3,
            "0"
          );


      return {

        id:
          `biblioteca-escrito-${numeroTexto}`,

        numero,

        codigo:
          `ESC-${numeroTexto}`,

        titulo:
          tituloVisible(
            titulo
          ),

        tituloOriginal:
          titulo,

        archivo,

        fuero,

        subcategoria,

        tipoEscrito,

        tags,

        numerosOrigen,

        cantidadOriginales:
          numerosOrigen.length

      };

    }

  );



/* =========================================================
   INFORMACIÓN DE DEPURACIÓN
========================================================= */

export const resumenBiblioteca = {

  totalArchivosOriginales:
    300,

  totalEscritosUnicos:
    escritosBiblioteca.length,

  totalDuplicadosOmitidos:
    300 - escritosBiblioteca.length

};



/* =========================================================
   MAPA DE DUPLICADOS
========================================================= */

export const duplicadosBiblioteca =

  escritosBiblioteca

    .filter(
      item =>
        item.numerosOrigen.length > 1
    )

    .map(
      item => ({

        principal:
          item.numero,

        duplicados:
          item.numerosOrigen.slice(1)

      })
    );


console.log(
  "📚 Catálogo Biblioteca FALCO®:",
  resumenBiblioteca
);