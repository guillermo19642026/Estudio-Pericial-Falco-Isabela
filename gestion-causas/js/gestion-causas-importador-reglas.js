(() => {
  "use strict";

  const normalizeText = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[_\-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();


const cleanImportedName = (value = "") =>
  String(value)
    .replace(/\u0005/g, "Ñ")
    .replace(/\u0007/g, "º")
    .replace(/\u00a0/g, " ")
    .replace(/α/g, "Ó")
    .replace(/Π/g, "Ó")
    .replace(/�/g, "")
    .replace(/\s+/g, " ")
    .trim();


  const getFileExtension = (fileName = "") => {
    const cleanName = String(fileName).split("/").pop() || "";
    const lastDot = cleanName.lastIndexOf(".");

    if (lastDot <= 0) {
      return "";
    }

    return cleanName.slice(lastDot + 1).toLowerCase();
  };

  const getFileNameWithoutExtension = (fileName = "") => {
    const cleanName = String(fileName).split("/").pop() || "";
    const lastDot = cleanName.lastIndexOf(".");

    if (lastDot <= 0) {
      return cleanName;
    }

    return cleanName.slice(0, lastDot);
  };

  const isTemporaryFile = (fileName = "") => {
    const cleanName =
      String(fileName).split("/").pop() || "";

    return (
      cleanName.startsWith("~$") ||
      cleanName.startsWith(".~lock.") ||
      cleanName.endsWith("#") ||
      cleanName === ".DS_Store" ||
      cleanName.toLowerCase() === "thumbs.db"
    );
  };

  const isHiddenPath = (path = "") =>
    String(path)
      .split("/")
      .some(
        (segment) =>
          segment.startsWith(".") &&
          segment !== "." &&
          segment !== ".."
      );

  const documentRules = [
    {
      category: "caratula",
      label: "Carátula",
      priority: 100,
      patterns: [
        /\bcaratula\b/,
        /\bcarátula\b/,
        /\bdatos de la causa\b/
      ]
    },


{
  category: "abogado-actora",
  label: "Abogado de la parte actora",
  priority: 99,
  patterns: [
    /\babogado parte actora\b/,
    /\babogada parte actora\b/,
    /\bletrado parte actora\b/,
    /\bletrada parte actora\b/
  ]
},

{
  category: "abogado-demandada",
  label: "Abogado de la parte demandada",
  priority: 98,
  patterns: [
    /\babogado parte demandada\b/,
    /\babogada parte demandada\b/,
    /\bletrado parte demandada\b/,
    /\bletrada parte demandada\b/
  ]
},



    {
      category: "demanda",
      label: "Demanda",
      priority: 95,
      patterns: [
        /\bdemanda\b/,
        /\bescrito de demanda\b/,
        /\binicia demanda\b/,
        /\bpromueve demanda\b/
      ]
    },

    {
      category: "contestacion-demanda",
      label: "Contestación de demanda",
      priority: 96,
      patterns: [
        /\bcontesta demanda\b/,
        /\bconteste demanda\b/,
        /\bcontestacion de demanda\b/,
        /\bcontestación de demanda\b/,
        /\bresponde demanda\b/
      ]
    },

    {
      category: "aceptacion-cargo",
      label: "Aceptación del cargo",
      priority: 93,
      patterns: [
  /\baceptacion del cargo\b/,
  /\baceptación del cargo\b/,
  /\baceptacio del cargo\b/,
  /\baceptaci[oó]n?\s*del?\s*cargo\b/,
  /\bacepta cargo\b/,
  /\baceptacion cargo\b/,
  /\baceptaci[oó]del cargo\b/
]
    },

    {
      category: "designacion",
      label: "Designación",
      priority: 92,
      patterns: [
        /\bdesignacion\b/,
        /\bdesignación\b/,
        /\bdesigna perito\b/,
        /\bauto de designacion\b/
      ]
    },

    {
      category: "anticipo-gastos",
      label: "Anticipo de gastos",
      priority: 91,
      patterns: [
        /\badelanto de gastos\b/,
        /\banticipo de gastos\b/,
        /\bsolicita anticipo\b/,
        /\bdeposito anticipo\b/,
        /\bdepósito anticipo\b/
      ]
    },

    {
      category: "carta-pago",
      label: "Carta de pago",
      priority: 90,
      patterns: [
        /\bcarta de pago\b/,
        /\brecibo de pago\b/,
        /\bconstancia de pago\b/
      ]
    },

    {
      category: "honorarios",
      label: "Honorarios",
      priority: 89,
      patterns: [
        /\bhonorarios\b/,
        /\bregulacion\b/,
        /\bregulación\b/,
        /\bregula honorarios\b/,
        /\bapelacion honorarios\b/,
        /\bapelación honorarios\b/
      ]
    },

    {
      category: "pericia",
      label: "Pericia psicológica",
      priority: 88,
      patterns: [
        /\bpericia psicologica\b/,
        /\bpericia psicológica\b/,
        /\bdictamen pericial\b/,
        /\binforme pericial\b/,
        /\bpericia\b/
      ]
    },

    {
      category: "impugnacion",
      label: "Impugnación",
      priority: 87,
      patterns: [
        /\bimpugnacion\b/,
        /\bimpugnación\b/,
        /\bimpugna pericia\b/,
        /\bobserva pericia\b/
      ]
    },

    {
      category: "contestacion-impugnacion",
      label: "Contestación de impugnación",
      priority: 86,
      patterns: [
        /\bcontesta impugnacion\b/,
        /\bcontesta impugnación\b/,
        /\bcontestacion de impugnacion\b/,
        /\bresponde impugnacion\b/,
        /\bcontesta traslado\b/
      ]
    },

    {
      category: "explicaciones",
      label: "Pedido o contestación de explicaciones",
      priority: 85,
      patterns: [
        /\bsolicita explicaciones\b/,
        /\bpedido de explicaciones\b/,
        /\bcontesta explicaciones\b/,
        /\bresponde explicaciones\b/,
        /\baclaraciones\b/
      ]
    },

    {
      category: "traslado",
      label: "Traslado",
      priority: 84,
      patterns: [
        /\btraslado\b/,
        /\bse corre traslado\b/,
        /\bcontesta traslado\b/
      ]
    },

{
  category: "apertura-prueba",
  label: "Apertura a prueba",
  priority: 84,
  patterns: [
    /\bauto de apertura a prueba\b/,
    /\bauto apertura a prueba\b/,
    /\bapertura a prueba\b/
  ]
},


    {
      category: "providencia",
      label: "Providencia",
      priority: 83,
      patterns: [
        /\bprovidencia\b/,
        /\bproveido\b/,
        /\bproveído\b/,
        /\bresolucion\b/,
        /\bresolución\b/
      ]
    },

    {
      category: "audiencia",
      label: "Audiencia",
      priority: 82,
      patterns: [
        /\baudiencia\b/,
        /\bfija audiencia\b/,
        /\bfecha de audiencia\b/
      ]
    },

   {
  category: "fecha-entrevista",
  label: "Fecha de entrevista",
  priority: 81,
  patterns: [
    /\bfija fecha\b/,
    /\bnueva fecha\b/,
    /\bfecha entrevista\b/,
    /\bentrevista psicologica\b/,
    /\bentrevista psicológica\b/,
    /\bturno pericial\b/,
    /\b\d+\s*(?:da|ra|º|°)\s+entrevista\b/,
    /\basistencia\b/,
    /\bausente\b/,
    /\bcambio de fecha\b/
  ]
},

    {
      category: "prorroga",
      label: "Prórroga",
      priority: 80,
      patterns: [
        /\bprorroga\b/,
        /\bprórroga\b/,
        /\bsolicita prorroga\b/
      ]
    },

    {
      category: "cedula",
      label: "Cédula",
      priority: 79,
      patterns: [
        /\bcedula\b/,
        /\bcédula\b/,
        /\bnotificacion\b/,
        /\bnotificación\b/
      ]
    },

    {
      category: "oficio",
      label: "Oficio",
      priority: 78,
      patterns: [
        /\boficio\b/,
        /\blibramiento de oficio\b/,
        /\boficios\b/
      ]
    },

    {
      category: "sentencia",
      label: "Sentencia",
      priority: 77,
      patterns: [
        /\bsentencia\b/,
        /\bfallo\b/,
        /\bresuelve\b/
      ]
    },

    {
      category: "consentimiento",
      label: "Consentimiento informado",
      priority: 76,
      patterns: [
        /\bconsentimiento\b/,
        /\bconsentimiento informado\b/
      ]
    },

    {
      category: "ficha-periciado",
      label: "Ficha del periciado",
      priority: 75,
      patterns: [
        /\bficha periciado\b/,
        /\bficha integral\b/,
        /\bdatos personales\b/
      ]
    },

    {
      category: "constancia-tratamiento",
      label: "Constancia de tratamiento",
      priority: 74,
      patterns: [
        /\bconstancia tratamiento\b/,
        /\bconstancia de tratamiento\b/,
        /\btratamiento psicologico\b/,
        /\btratamiento psicológico\b/,
        /\btratamiento psiquiatrico\b/
      ]
    },

    {
      category: "documento-identidad",
      label: "Documento de identidad",
      priority: 73,
      patterns: [
        /\bdni\b/,
        /\bdocumento identidad\b/,
        /\bdocumento de identidad\b/
      ]
    },

    {
      category: "test-bender",
      label: "Test de Bender",
      priority: 72,
      patterns: [
        /\bbender\b/
      ]
    },

    {
      category: "test-pbll",
      label: "PBLL",
      priority: 71,
      patterns: [
        /\bpbll\b/,
        /\bpersona bajo la lluvia\b/
      ]
    },

    {
      category: "test-htp",
      label: "HTP",
      priority: 70,
      patterns: [
        /\bhtp\b/,
        /\bcasa arbol persona\b/,
        /\bcasa árbol persona\b/
      ]
    },

    {
      category: "test-scl90",
      label: "SCL-90 / BSI",
      priority: 69,
      patterns: [
        /\bscl ?90\b/,
        /\bscl-90\b/,
        /\bbsi\b/
      ]
    },

    {
      category: "test-bdi",
      label: "BDI",
      priority: 68,
      patterns: [
        /\bbdi\b/,
        /\bbeck depresion\b/,
        /\bbeck depresión\b/
      ]
    },

    {
      category: "test-bai",
      label: "BAI",
      priority: 67,
      patterns: [
        /\bbai\b/,
        /\bbeck ansiedad\b/
      ]
    },

    {
      category: "test-desesperanza",
      label: "Escala de desesperanza",
      priority: 66,
      patterns: [
        /\bdesesperanza\b/,
        /\bescala de desesperanza\b/
      ]
    },

    {
      category: "historia-clinica",
      label: "Historia clínica",
      priority: 65,
      patterns: [
        /\bhistoria clinica\b/,
        /\bhistoria clínica\b/,
        /\bhc medica\b/,
        /\bhc médica\b/
      ]
    },

    {
      category: "comprobante",
      label: "Comprobante",
      priority: 64,
      patterns: [
        /\bcomprobante\b/,
        /\btransferencia\b/,
        /\bdeposito\b/,
        /\bdepósito\b/,
        /\bfactura\b/
      ]
    },

    {
      category: "imagen-whatsapp",
      label: "Imagen de WhatsApp",
      priority: 63,
      patterns: [
        /\bwhatsapp image\b/,
        /\bimg-\d+/,
        /\bwa\d+\b/
      ]
    }
  ];

  const extensionCategories = {
    pdf: {
      type: "document",
      label: "PDF"
    },

    odt: {
      type: "document",
      label: "OpenDocument"
    },

    doc: {
      type: "document",
      label: "Word"
    },

    docx: {
      type: "document",
      label: "Word"
    },

    rtf: {
      type: "document",
      label: "RTF"
    },

    txt: {
      type: "document",
      label: "Texto"
    },

    ods: {
      type: "spreadsheet",
      label: "Planilla"
    },

    xls: {
      type: "spreadsheet",
      label: "Excel"
    },

    xlsx: {
      type: "spreadsheet",
      label: "Excel"
    },

    csv: {
      type: "spreadsheet",
      label: "CSV"
    },

    jpg: {
      type: "image",
      label: "Imagen"
    },

    jpeg: {
      type: "image",
      label: "Imagen"
    },

    png: {
      type: "image",
      label: "Imagen"
    },

    webp: {
      type: "image",
      label: "Imagen"
    },

    gif: {
      type: "image",
      label: "Imagen"
    }
  };

  const folderRules = [
    {
      type: "periciado",
      patterns: [
        /\bpericiado\b/,
        /\bevaluado\b/,
        /\bactor\b/,
        /\bdemandado\b/
      ]
    },

    {
      type: "tests",
      patterns: [
        /\btest\b/,
        /\btests\b/,
        /\btecnicas\b/,
        /\btécnicas\b/,
        /\bpsicodiagnostico\b/,
        /\bpsicodiagnóstico\b/
      ]
    },

    {
      type: "documentacion",
      patterns: [
        /\bdocumentacion\b/,
        /\bdocumentación\b/,
        /\barchivos\b/,
        /\badjuntos\b/
      ]
    },

    {
      type: "pericia",
      patterns: [
        /\bpericia\b/,
        /\binforme\b/,
        /\bdictamen\b/
      ]
    }
  ];

  const classifyDocument = (fileName = "", fullPath = "") => {
    const cleanName =
      String(fileName).split("/").pop() || "";

    const normalizedName = normalizeText(
      getFileNameWithoutExtension(cleanName)
    );

    const normalizedPath = normalizeText(fullPath);
    const searchableText =
      `${normalizedName} ${normalizedPath}`.trim();

    const extension = getFileExtension(cleanName);

    const matchedRule = [...documentRules]
      .sort((a, b) => b.priority - a.priority)
      .find((rule) =>
        rule.patterns.some((pattern) =>
          pattern.test(searchableText)
        )
      );

    const extensionInfo =
      extensionCategories[extension] || {
        type: "unknown",
        label: extension
          ? extension.toUpperCase()
          : "Sin extensión"
      };

    if (matchedRule) {
      return {
        category: matchedRule.category,
        categoryLabel: matchedRule.label,
        fileType: extensionInfo.type,
        fileTypeLabel: extensionInfo.label,
        extension,
        confidence: "high",
        requiresReview: false
      };
    }

    if (extensionInfo.type === "image") {
      return {
        category: "imagen-adjunta",
        categoryLabel: "Imagen adjunta",
        fileType: extensionInfo.type,
        fileTypeLabel: extensionInfo.label,
        extension,
        confidence: "medium",
        requiresReview: true
      };
    }

    if (
      extensionInfo.type === "document" ||
      extensionInfo.type === "spreadsheet"
    ) {
      return {
        category: "otros-documentos",
        categoryLabel: "Otros documentos",
        fileType: extensionInfo.type,
        fileTypeLabel: extensionInfo.label,
        extension,
        confidence: "low",
        requiresReview: true
      };
    }

    return {
      category: "archivo-no-clasificado",
      categoryLabel: "Archivo no clasificado",
      fileType: extensionInfo.type,
      fileTypeLabel: extensionInfo.label,
      extension,
      confidence: "low",
      requiresReview: true
    };
  };

  const classifyFolder = (folderName = "") => {
    const normalized = normalizeText(folderName);

    const matchedRule = folderRules.find((rule) =>
      rule.patterns.some((pattern) =>
        pattern.test(normalized)
      )
    );

    return matchedRule?.type || "subcarpeta";
  };

  const detectDepartment = (
    rootFolderName = "",
    fileName = "",
    content = ""
  ) => {
    const normalized = normalizeText(
      `${rootFolderName} ${fileName} ${content}`
    );

    if (
      normalized.includes("la matanza") ||
      /\blm-\d+/i.test(normalized)
    ) {
      return {
        value: "la-matanza",
        label: "La Matanza",
        confidence: "high"
      };
    }

    if (
      normalized.includes("moron") ||
      /\bmo-\d+/i.test(normalized)
    ) {
      return {
        value: "moron",
        label: "Morón",
        confidence: "high"
      };
    }

    return {
      value: "",
      label: "Sin detectar",
      confidence: "low"
    };
  };




const detectCaseNumber = (value = "") => {
  const text = String(value);

  const patterns = [
    /\b(?:MO|LM)[-\s]\d{1,8}[-/]\d{4}\b/i,

    /\b(?:MO|LM)[-\s]?\d{1,8}[-/]\d{4}\b/i,

    /\bexp(?:ediente)?\.?\s*(?:nro|n°|nº)?\.?\s*((?:MO|LM)?[-\s]?\d{1,8}[-/]\d{4})\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (!match) {
      continue;
    }

    const result = match[1] || match[0];

    return String(result)
      .toUpperCase()
      .replace(/^EXP(?:EDIENTE)?\.?\s*(?:NRO|N°|Nº)?\.?\s*/i, "")
      .replace(/\s+/g, "")
      .replace("/", "-");
  }

  return "";
};

  const detectYear = (value = "") => {
    const caseNumber = detectCaseNumber(value);

    const caseYear =
      caseNumber.match(/[-/](\d{2,4})$/);

    if (caseYear) {
      const rawYear = caseYear[1];

      if (rawYear.length === 2) {
        return Number(rawYear) > 50
          ? `19${rawYear}`
          : `20${rawYear}`;
      }

      return rawYear;
    }

    const match = String(value).match(
      /\b(19|20)\d{2}\b/
    );

    return match?.[0] || "";
  };

  const detectCourtType = (value = "") => {
    const normalized = normalizeText(value);

 if (
  normalized.includes("tribunal de trabajo") ||
  normalized.includes("tribunal del trabajo") ||
  normalized.includes("del trabajo nº") ||
  normalized.includes("del trabajo n°") ||
  normalized.includes("del trabajo nro") ||
  /\bdel trabajo\s+n?[º°]?\s*\d+/i.test(normalized) ||
  normalized.includes("laboral") ||
  normalized.includes("art")
) {
  return "Laboral";
}

    if (
      normalized.includes("civil y comercial") ||
      normalized.includes("danos y perjuicios") ||
      normalized.includes("daños y perjuicios")
    ) {
      return "Civil";
    }

    if (
      normalized.includes("familia") ||
      normalized.includes("juzgado de familia")
    ) {
      return "Familia";
    }

    if (
      normalized.includes("penal") ||
      normalized.includes("garantias") ||
      normalized.includes("garantías")
    ) {
      return "Penal";
    }

    return "";
  };

  const detectCaseStatus = (documents = []) => {
    const categories = new Set(
      documents.map((document) => document.category)
    );

    if (categories.has("carta-pago")) {
      return "Honorarios cobrados";
    }

    if (categories.has("sentencia")) {
      return "Finalizada";
    }

    if (
      categories.has("contestacion-impugnacion") ||
      categories.has("explicaciones")
    ) {
      return "En explicaciones";
    }

    if (categories.has("impugnacion")) {
      return "En impugnación";
    }

    if (categories.has("pericia")) {
      return "Pericia presentada";
    }

    if (categories.has("fecha-entrevista")) {
      return "Entrevista programada";
    }

    if (categories.has("aceptacion-cargo")) {
      return "Cargo aceptado";
    }

    if (categories.has("designacion")) {
      return "Designada";
    }

    return "Importada";
  };

  const detectNextStep = (documents = []) => {
    const sortedDocuments = [...documents].reverse();

    const lastRelevantDocument = sortedDocuments.find(
      (document) =>
        [
          "impugnacion",
          "traslado",
          "explicaciones",
          "fecha-entrevista",
          "designacion",
          "aceptacion-cargo",
          "anticipo-gastos"
        ].includes(document.category)
    );

    if (!lastRelevantDocument) {
      return "Revisar documentación importada";
    }

    const steps = {
      impugnacion: "Revisar y contestar impugnación",
      traslado: "Controlar vencimiento del traslado",
      explicaciones: "Revisar pedido de explicaciones",
      "fecha-entrevista": "Realizar entrevista psicológica",
      designacion: "Aceptar el cargo",
      "aceptacion-cargo": "Gestionar anticipo de gastos",
      "anticipo-gastos": "Coordinar evaluación"
    };

    return (
      steps[lastRelevantDocument.category] ||
      "Revisar documentación importada"
    );
  };

  const detectPossiblePericiadoFolder = (
    folderName = "",
    depth = 0
  ) => {
    const cleanName = String(folderName).trim();
    const normalized = normalizeText(cleanName);

    if (!cleanName || depth < 2) {
      return false;
    }

    const excludedNames = [
      "documentos",
      "documentacion",
      "pericia",
      "pericias",
      "tests",
      "tecnicas",
      "imagenes",
      "fotos",
      "pdf",
      "word",
      "otros",
      "adjuntos",
      "actuaciones",
      "escritos"
    ];

    if (
      excludedNames.some(
        (excluded) => normalized === excluded
      )
    ) {
      return false;
    }

    const words = cleanName
      .replace(/[0-9]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const looksLikePersonName =
      words.length >= 2 &&
      words.length <= 6 &&
      words.every(
        (word) =>
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'.-]+$/.test(word)
      );

    return looksLikePersonName;
  };

  const buildInternalCode = ({
    department = "",
    year = "",
    index = 1
  } = {}) => {
    const departmentCode =
      department === "la-matanza"
        ? "LM"
        : department === "moron"
          ? "MO"
          : "OT";

    const safeYear =
      year || new Date().getFullYear();

    const sequence = String(index).padStart(4, "0");

    return `FALCO-${departmentCode}-${safeYear}-${sequence}`;
  };

  const createDocumentRecord = ({
    fileName = "",
    fullPath = "",
    size = 0,
    compressedSize = 0,
    modifiedAt = null
  } = {}) => {
    const classification =
      classifyDocument(fileName, fullPath);

    return {
      id:
        window.crypto?.randomUUID?.() ||
        `documento-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      nombre: fileName,
      nombreBase:
        getFileNameWithoutExtension(fileName),

      rutaOriginal: fullPath,

      extension:
        classification.extension,

      categoria:
        classification.category,

      categoriaNombre:
        classification.categoryLabel,

      tipoArchivo:
        classification.fileType,

      tipoArchivoNombre:
        classification.fileTypeLabel,

      confianza:
        classification.confidence,

      requiereRevision:
        classification.requiresReview,

      tamanio: Number(size || 0),

      tamanioComprimido:
        Number(compressedSize || 0),

      fechaArchivo:
        modifiedAt
          ? new Date(modifiedAt).toISOString()
          : "",

      estado: "referenciado",

      origen: "importacion-masiva",

      fechaImportacion:
        new Date().toISOString()
    };
  };

window.GestionCausasImportadorReglas = {
  normalizeText,
  cleanImportedName,
  getFileExtension,
  getFileNameWithoutExtension,
  isTemporaryFile,
  isHiddenPath,

  classifyDocument,
  classifyFolder,

  detectDepartment,
  detectCaseNumber,
  detectYear,
  detectCourtType,
  detectCaseStatus,
  detectNextStep,
  detectPossiblePericiadoFolder,

  buildInternalCode,
  createDocumentRecord,

  documentRules,
  extensionCategories,
  folderRules
};



  console.log(
    "Gestión de Causas FALCO® Reglas de Importación Ready"
  );
})();