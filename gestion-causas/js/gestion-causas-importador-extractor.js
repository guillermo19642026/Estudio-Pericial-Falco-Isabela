(() => {
  "use strict";

  const rules =
    window.GestionCausasImportadorReglas;

  const normalize = (value = "") =>
    rules?.normalizeText?.(value) ||
    String(value).toLowerCase().trim();

  const cleanValue = (value = "") =>
    String(value)
      .replace(/\s+/g, " ")
      .replace(/^[\s:;,\-–—]+/, "")
      .replace(/[\s:;,\-–—]+$/, "")
      .trim();

  const firstMatch = (
    text = "",
    patterns = []
  ) => {
    for (const pattern of patterns) {
      const match = String(text).match(pattern);

      if (!match) {
        continue;
      }

      return cleanValue(
        match[1] || match[0] || ""
      );
    }

    return "";
  };

  const extractEmails = (text = "") => {
    const matches =
      String(text).match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
      ) || [];

    return [...new Set(matches.map(
      (email) => email.toLowerCase()
    ))];
  };

const extractPhones = (text = "") => {
  const source = String(text);

  const labeledMatches = [
    ...source.matchAll(
      /(?:tel[eé]fono|tel\.?|celular|cel\.?|whatsapp|contacto)\s*:?\s*(?:\+?54[\s-]*)?(?:0?11[\s-]*)?(?:15[\s-]*)?(\d{4}[\s-]\d{4}|\d{8})/gi
    )
  ];

  const phones = labeledMatches
    .map((match) =>
      String(match[1] || "")
        .replace(/\D/g, "")
    )
    .filter((digits) =>
      digits.length === 8
    )
    .map(
      (digits) =>
        `${digits.slice(0, 4)}-${digits.slice(4)}`
    );

  return [...new Set(phones)];
};



  const extractCuitDni = (text = "") => {
    const matches =
      String(text).match(
        /\b(?:\d{2}-\d{8}-\d|\d{7,8})\b/g
      ) || [];

    return [...new Set(matches)];
  };

  const extractCaseNumber = (text = "") =>
    rules?.detectCaseNumber?.(text) || "";

  const extractCourtType = (text = "") =>
    rules?.detectCourtType?.(text) || "";

  const extractCourt = (text = "") =>
    firstMatch(text, [
      /(?:juzgado|tribunal)\s+(?:de\s+)?(?:primera\s+instancia\s+)?(?:en\s+lo\s+)?([^\n]{4,120})/i,
      /(?:juzgado|tribunal)\s+n[°º]?\s*([0-9]{1,3})/i,
      /(?:organismo|órgano)\s*:\s*([^\n]{3,120})/i
    ]);

  const extractCourtNumber = (text = "") =>
    firstMatch(text, [
      /(?:juzgado|tribunal)\s+n[°º]?\s*([0-9]{1,3})/i,
      /n[°º]\s*([0-9]{1,3})/i
    ]);

  const extractSecretary = (text = "") =>
    firstMatch(text, [
      /secretar[ií]a\s+n[°º]?\s*([0-9A-Z]+)/i,
      /secretar[ií]a\s*:\s*([^\n]{2,80})/i
    ]);

  const extractProcessType = (text = "") =>
    firstMatch(text, [
      /s\/\s*([^\n]{4,150})/i,
      /tipo\s+de\s+proceso\s*:\s*([^\n]{4,150})/i,
      /materia\s*:\s*([^\n]{4,150})/i
    ]);

  const extractFullCaseTitle = (text = "") => {
    const lines = String(text)
      .split(/\r?\n/)
      .map(cleanValue)
      .filter(Boolean);

    const candidates = lines.filter(
      (line) =>
        /\bc\/\b/i.test(line) ||
        /\bcontra\b/i.test(line)
    );

    const best = candidates.find(
      (line) =>
        line.length >= 20 &&
        line.length <= 300
    );

    return best || "";
  };

  const splitPartiesFromTitle = (
    caseTitle = ""
  ) => {
    const title = cleanValue(caseTitle);

    const match = title.match(
      /^(.+?)\s+(?:c\/|contra)\s+(.+?)(?:\s+s\/|\s+sobre\s+|$)/i
    );

    if (!match) {
      return {
        actor: "",
        demandado: ""
      };
    }

    return {
      actor: cleanValue(match[1]),
      demandado: cleanValue(match[2])
    };
  };

  const extractPersonName = (
    text = "",
    role = ""
  ) => {
    const rolePattern = role
      ? role.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
      : "";

    const patterns = rolePattern
      ? [
          new RegExp(
            `${rolePattern}\\s*:?\\s*([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ,'.\\s-]{4,120})`,
            "i"
          ),
          new RegExp(
            `letrad[oa]\\s+(?:apoderad[oa]|patrocinante)?\\s*(?:de\\s+la\\s+)?${rolePattern}\\s*:?\\s*([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ,'.\\s-]{4,120})`,
            "i"
          )
        ]
      : [];

    return firstMatch(text, patterns);
  };

const extractLawyer = (
  text = "",
  side = ""
) => {
  const normalizedText = normalize(text);

  let sideLabel = "";

  if (side === "actora") {
    sideLabel = "parte actora";
  }

  if (side === "demandada") {
    sideLabel = "parte demandada";
  }

 const rawName = firstMatch(text, [
  /*
   * Nombre escrito antes de:
   * ", Abogado", ", Abogada", matrícula, CUIT,
   * domicilio, teléfono o correo.
   */
  /(?:dr\.?|dra\.?|doctor|doctora)\s+([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ,'.\s-]{4,120}?)(?=\s*,?\s*(?:abogad[oa]|t[°ºo]\s*|matr[ií]cula|cuit|domicilio|tel[eé]fono|celular|email|correo)|[\n\r]|$)/i,

  /*
   * Ejemplo:
   * FEDERICO MARTIN FIORDA, Abogado, Tº...
   */
  /([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})\s*,\s*abogad[oa]\b/i,

  /*
   * Ejemplo:
   * Abogado FEDERICO MARTIN FIORDA
   */
  /abogad[oa]\s+([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})(?=\s*,|\s+t[°ºo]|\s+matr[ií]cula|[\n\r]|$)/i,

  sideLabel
    ? new RegExp(
        `${sideLabel}\\s*:?\\s*([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})(?=\\s*,|\\s+t[°ºo]|\\s+matr[ií]cula|[\\n\\r]|$)`,
        "i"
      )
    : /$a/
]);

  const invalidNames = [
    "y otro",
    "y otros",
    "otro",
    "otros",
    "sin datos",
    "parte actora",
    "parte demandada"
  ];

  const normalizedRawName =
    normalize(rawName);

  const name =
    rawName &&
    !invalidNames.includes(
      normalizedRawName
    ) &&
    rawName.length >= 5
      ? cleanValue(rawName)
      : "";

  const matriculaCompleta =
    String(text).match(
      /t[°ºo]?\s*([IVXLCDM\d]+)\s*f[°ºo]?\s*([0-9]+)/i
    );

  const matricula =
    matriculaCompleta
      ? `Tº ${matriculaCompleta[1]} Fº ${matriculaCompleta[2]}`
      : firstMatch(text, [
          /matr[ií]cula\s*:\s*([^\n]{2,50})/i
        ]);

  const colegio = firstMatch(text, [
    /(?:cam|calm|casi|cpacf|colegio\s+de\s+abogados)\b[^\n]*/i
  ]);

  const emails = extractEmails(text);
  const phones = extractPhones(text);

const notificationEmail =
  emails.find((email) =>
    email.includes(
      "@notificaciones.scba.gov.ar"
    )
  ) || "";

const regularEmail =
  emails.find((email) =>
    !email.includes(
      "@notificaciones.scba.gov.ar"
    )
  ) || "";


 const companyRaw = firstMatch(text, [
  /(?:en\s+(?:mi\s+)?car[aá]cter\s+de\s+(?:letrad[oa]\s+)?apoderad[oa]\s+de)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i,

  /(?:en\s+representaci[oó]n\s+de|representa(?:ndo)?\s+a)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i,

  /(?:por\s+la\s+(?:parte\s+)?demandada|por\s+la\s+codemandada)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i,

  /(?:aseguradora|art|compa[ñn][ií]a|codemandada)\s*:\s*([^\n]{3,180})/i,

  /(?:letrad[oa]\s+apoderad[oa]\s+de)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i
]);



const cleanedCompanyRaw =
  cleanValue(
    String(companyRaw || "")
      .replace(
        /\s+(?:con\s+domicilio|constituyendo|domicilio|cuit|tel[eé]fono|correo|email).*$/i,
        ""
      )
  );

const normalizedCompany =
  normalize(cleanedCompanyRaw);

const invalidCompanyFragments = [
  "parte actora",
  "parte demandada",
  "la parte actora",
  "la parte demandada",
  "codemandada",
  "la codemandada",
  "y otro",
  "y otros",
  "sin datos",
  "no corresponde"
];

const companyIsInvalid =
  !cleanedCompanyRaw ||
  invalidCompanyFragments.some(
    (fragment) =>
      normalizedCompany ===
        normalize(fragment) ||
      normalizedCompany.includes(
        normalize(fragment)
      )
  );

const company =
  companyIsInvalid
    ? ""
    : cleanedCompanyRaw;

  const electronicAddress = firstMatch(text, [
    /domicilio\s+electr[oó]nico\s*:\s*([^\s\n]+@[^\s\n]+)/i
  ]);

  const legalStudio = firstMatch(text, [
    /estudio\s+jur[ií]dico\s*:\s*([^\n]{3,120})/i
  ]);

  return {
    parte: side,
    nombreCompleto: name,
    matricula,
    colegio,
    telefono: phones[0] || "",
    whatsapp: phones[1] || phones[0] || "",
   email:
  regularEmail,

domicilioElectronico:
  electronicAddress ||
  notificationEmail ||
  "",
    estudioJuridico: legalStudio,
    companiaRepresentada: company,
    observaciones:
      normalizedText.includes(
        "apoderado"
      )
        ? "Letrado/a apoderado/a"
        : normalizedText.includes(
              "patrocinante"
            )
          ? "Letrado/a patrocinante"
          : ""
  };
};

  const extractCompany = (text = "") =>
    firstMatch(text, [
      /(?:aseguradora|art|compa[ñn][ií]a|codemandada)\s*:\s*([^\n]{3,160})/i,
      /(?:en\s+representaci[oó]n\s+de|representa(?:ndo)?\s+a)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'-]{3,160})/i
    ]);

  const extractAmount = (text = "") => {
    const match = String(text).match(
      /\$\s*([\d.\s]+(?:,\d{1,2})?)/i
    );

    if (!match) {
      return 0;
    }

    const normalized = match[1]
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return Number(normalized) || 0;
  };

 const extractDate = (text = "") => {
  const value = String(text);

  const numericMatch = value.match(
    /\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/
  );

  if (numericMatch) {
    let [, day, month, year] =
      numericMatch;

    if (year.length === 2) {
      year =
        Number(year) > 50
          ? `19${year}`
          : `20${year}`;
    }

    return [
      year,
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0")
    ].join("-");
  }

  const monthNames = {
    enero: "01",
    febrero: "02",
    marzo: "03",
    abril: "04",
    mayo: "05",
    junio: "06",
    julio: "07",
    agosto: "08",
    septiembre: "09",
    setiembre: "09",
    octubre: "10",
    noviembre: "11",
    diciembre: "12"
  };

  const writtenMatch = value.match(
    /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})\b/i
  );

  if (!writtenMatch) {
    return "";
  }

  const [, day, monthName, year] =
    writtenMatch;

  return [
    year,
    monthNames[
      monthName.toLowerCase()
    ],
    String(day).padStart(2, "0")
  ].join("-");
};

  const extractCaseData = (
    text = ""
  ) => {
    const caseTitle =
      extractFullCaseTitle(text);

    const parties =
      splitPartiesFromTitle(caseTitle);

    return {
      expediente:
        extractCaseNumber(text),

      caratula:
        caseTitle,

      fuero:
        extractCourtType(text),

      organismo:
        extractCourt(text),

      juzgado:
        extractCourtNumber(text),

      secretaria:
        extractSecretary(text),

      tipoProceso:
        extractProcessType(text),

      actor:
        parties.actor,

      demandado:
        parties.demandado
    };
  };

  const extractFeeMovement = (
    text = "",
    document = {}
  ) => {
    const category =
      document.categoria || "";

    const typeMap = {
      "anticipo-gastos":
        "anticipo-solicitado",
      "carta-pago":
        "pago-total",
      honorarios:
        "regulacion"
    };

    return {
      id:
        window.crypto?.randomUUID?.() ||
        `honorario-extraido-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      fecha:
        extractDate(text),

      tipo:
        typeMap[category] || "otro",

      monto:
        extractAmount(text),

      estado:
        category === "carta-pago"
          ? "cobrado"
          : category === "honorarios"
            ? "regulado"
            : "pendiente",

      parteObligada:
        firstMatch(text, [
          /(?:a\s+cargo\s+de|parte\s+obligada|deber[aá]\s+abonar)\s*:\s*([^\n]{3,140})/i
        ]),

      porcentaje: 0,

      formaPago:
        normalize(text).includes(
          "transferencia"
        )
          ? "transferencia"
          : normalize(text).includes(
                "deposito judicial"
              )
            ? "deposito-judicial"
            : "",

      comprobante: "",

      aportes:
        normalize(text).includes("aporte")
          ? extractAmount(text)
          : 0,

      descripcion:
        document.categoriaNombre ||
        "Movimiento económico importado",

      observaciones:
        `Extraído automáticamente de ${document.nombre || "documento"}.`,

      fechaCreacion:
        new Date().toISOString()
    };
  };

  const extractAction = (
    text = "",
    document = {}
  ) => {
    const category =
      document.categoria || "";

    const actionTypes = {
      designacion: "Designación",
      "aceptacion-cargo":
        "Aceptación del cargo",
      "anticipo-gastos":
        "Anticipo de gastos",
      "fecha-entrevista":
        "Fecha de entrevista",
      prorroga: "Prórroga",
      impugnacion: "Impugnación",
      "contestacion-impugnacion":
        "Contestación de impugnación",
      explicaciones:
        "Pedido o contestación de explicaciones",
      traslado: "Traslado",
      providencia: "Providencia",
      audiencia: "Audiencia",
      sentencia: "Sentencia"
    };

    const title =
      actionTypes[category] ||
      document.categoriaNombre ||
      document.nombre ||
      "Actuación importada";

    return {
      id:
        window.crypto?.randomUUID?.() ||
        `actuacion-extraida-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      fecha:
        extractDate(text),

      tipo:
        category || "actuacion",

      titulo: title,

      descripcion:
        `Actuación detectada a partir del archivo ${document.nombre || ""}.`,

      vencimiento: "",

      estado:
        [
          "sentencia",
          "contestacion-impugnacion"
        ].includes(category)
          ? "cumplida"
          : "pendiente",

      parte: "",

      plazo: "",

      observaciones:
        "Registro creado automáticamente durante la importación masiva.",

      documentoId:
        document.id || "",

      fechaCreacion:
        new Date().toISOString()
    };
  };

  const mergeCaseData = (
    currentCase = {},
    extracted = {}
  ) => ({
    ...currentCase,

    expediente:
      currentCase.expediente ||
      extracted.expediente ||
      "",

    caratula:
      extracted.caratula ||
      currentCase.caratula ||
      "",

    fuero:
      currentCase.fuero ||
      extracted.fuero ||
      "",

    organismo:
      currentCase.organismo ||
      extracted.organismo ||
      "",

    juzgado:
      currentCase.juzgado ||
      extracted.juzgado ||
      "",

    secretaria:
      currentCase.secretaria ||
      extracted.secretaria ||
      "",

    tipoProceso:
      currentCase.tipoProceso ||
      extracted.tipoProceso ||
      "",

    actor:
      currentCase.actor ||
      extracted.actor ||
      "",

    demandado:
      currentCase.demandado ||
      extracted.demandado ||
      "",

    partes: {
      ...(currentCase.partes || {}),

      actora: {
        ...(currentCase.partes?.actora || {}),
        nombre:
          currentCase.partes?.actora?.nombre ||
          extracted.actor ||
          ""
      },

      demandada: {
        ...(currentCase.partes?.demandada || {}),
        nombre:
          currentCase.partes?.demandada?.nombre ||
          extracted.demandado ||
          ""
      }
    }
  });

  window.GestionCausasImportadorExtractor = {
    extractEmails,
    extractPhones,
    extractCuitDni,
    extractCaseNumber,
    extractCourtType,
    extractCourt,
    extractCourtNumber,
    extractSecretary,
    extractProcessType,
    extractFullCaseTitle,
    splitPartiesFromTitle,
    extractLawyer,
    extractCompany,
    extractAmount,
    extractDate,
    extractCaseData,
    extractFeeMovement,
    extractAction,
    mergeCaseData
  };

  console.log(
    "Gestión de Causas FALCO® Extractor Documental Ready"
  );
})();