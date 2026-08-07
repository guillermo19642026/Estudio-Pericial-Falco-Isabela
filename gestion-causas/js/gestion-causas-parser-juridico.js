(() => {
  "use strict";

  const rules =
    window.GestionCausasImportadorReglas;

  const normalize = (value = "") =>
    rules?.normalizeText?.(value) ||
    String(value).toLowerCase().trim();

  const clean = (value = "") =>
    String(value)
      .replace(/\s+/g, " ")
      .replace(/^[\s:;,\-–—]+/, "")
      .replace(/[\s:;,\-–—]+$/, "")
      .trim();

const getHeaderText = (
  text = "",
  maxLines = 80
) =>
  String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines)
    .join("\n");


  const unique = (values = []) =>
    [
      ...new Set(
        values
          .map((value) => clean(value))
          .filter(Boolean)
      )
    ];

  const extractEmails = (text = "") => {
    const emails =
      String(text).match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
      ) || [];

    return unique(
      emails.map((email) =>
        email.toLowerCase()
      )
    );
  };

  const splitEmails = (text = "") => {
    const emails =
      extractEmails(text);

    return {
      personales:
        emails.filter(
          (email) =>
            !email.includes(
              "@notificaciones.scba.gov.ar"
            )
        ),

      domiciliosElectronicos:
        emails.filter(
          (email) =>
            email.includes(
              "@notificaciones.scba.gov.ar"
            )
        )
    };
  };

  const extractPhones = (text = "") => {
    const source =
      String(text);

    const matches = [
      ...source.matchAll(
        /(?:tel[eé]fono|tel\.?|celular|cel\.?|whatsapp|contacto)\s*:?\s*(?:\+?54[\s-]*)?(?:0?11[\s-]*)?(?:15[\s-]*)?(\d{4}[\s-]\d{4}|\d{8})/gi
      )
    ];

    return unique(
      matches
        .map(
          (match) =>
            String(
              match[1] || ""
            ).replace(/\D/g, "")
        )
        .filter(
          (digits) =>
            digits.length === 8
        )
        .map(
          (digits) =>
            `${digits.slice(
              0,
              4
            )}-${digits.slice(4)}`
        )
    );
  };

  const extractDate = (text = "") => {
    const source =
      String(text);

    const numeric =
      source.match(
        /\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/
      );

    if (numeric) {
      let [, day, month, year] =
        numeric;

      if (year.length === 2) {
        year =
          Number(year) > 50
            ? `19${year}`
            : `20${year}`;
      }

      return `${year}-${String(
        month
      ).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
    }

    const months = {
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

    const written =
      source.match(
        /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})\b/i
      );

    if (!written) {
      return "";
    }

    const [, day, monthName, year] =
      written;

    return `${year}-${
      months[
        normalize(monthName)
      ]
    }-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const extractCaseNumber = (
    text = ""
  ) =>
    rules?.detectCaseNumber?.(
      text
    ) || "";



 const extractCaseTitle = (
  text = ""
) => {
  const header =
    getHeaderText(text, 60);

  const lines =
    header
      .split(/\r?\n/)
      .map(clean)
      .filter(Boolean);

  const candidates =
    lines.filter((line) => {
      if (
        line.length < 20 ||
        line.length > 280
      ) {
        return false;
      }

      if (
        !(
          /\bc\/\b/i.test(line) ||
          /\bcontra\b/i.test(line)
        )
      ) {
        return false;
      }

      if (
  /^(motivo|objeto|materia|tipo de proceso)\s*:/i.test(
    line
  )
) {
  return false;
}

      const normalized =
        normalize(line);

     const invalidFragments = [
  "doctrina",
  "precedente",
  "jurisprudencia",
  "suprema corte",
  "scba",
  "reparacion danos",
  "reparación daños",
  "tiene sustento",
  "accion deducida",
  "acción deducida",

  "motivo",
  "motivo:",
  "recurso contra",
  "accion laboral ordinaria",
  "acción laboral ordinaria",
  "comision medica",
  "comisión médica",
  "ley 15057"
];

      return !invalidFragments.some(
        (fragment) =>
          normalized.includes(
            normalize(fragment)
          )
      );
    });

  return candidates[0] || "";
};

  const splitParties = (
    caseTitle = ""
  ) => {
    const match =
      clean(caseTitle).match(
        /^(.+?)\s+(?:c\/|contra)\s+(.+?)(?:\s+s\/|\s+sobre\s+|$)/i
      );

    if (!match) {
      return {
        actor: "",
        demandado: ""
      };
    }

    return {
      actor:
        clean(match[1]),

      demandado:
        clean(match[2])
    };
  };

  const extractCourt = (
    text = ""
  ) => {
    const match =
      String(text).match(
        /(?:organismo|órgano)\s*:\s*([^\n]{3,150})/i
      ) ||
      String(text).match(
        /(?:juzgado|tribunal)\s+(?:de\s+)?(?:primera\s+instancia\s+)?(?:en\s+lo\s+)?([^\n]{4,150})/i
      );

    return clean(
      match?.[1] || ""
    );
  };

  const extractProcessType = (
    text = ""
  ) => {
    const match =
      String(text).match(
        /(?:tipo\s+de\s+proceso|materia)\s*:\s*([^\n]{4,180})/i
      ) ||
      String(text).match(
        /s\/\s*([^\n]{4,180})/i
      );

    return clean(
      match?.[1] || ""
    );
  };

  const extractRegistration = (
    text = ""
  ) => {
    const match =
      String(text).match(
        /t[°ºo]?\s*([IVXLCDM\d]+)\s*f[°ºo]?\s*([0-9]+)/i
      );

    return match
      ? `Tº ${match[1]} Fº ${match[2]}`
      : "";
  };


const extractLawyerName = (
  text = ""
) => {
  const header =
    getHeaderText(text, 100);

  const patterns = [
    /([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})\s*,\s*abogad[oa]\b/i,

    /abogad[oa]\s+([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})(?=\s*,|\s+t[°ºo]|\s+matr[ií]cula|[\n\r]|$)/i,

    /(?:dr\.?|dra\.?|doctor|doctora)\s+([A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+(?:\s+[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ'.-]+){1,5})/i
  ];

  for (const pattern of patterns) {
    const match =
      header.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const name =
      clean(match[1]);

    const invalid = [
      "y otro",
      "y otros",
      "parte actora",
      "parte demandada",
      "solamente en el momento del recurso",
      "actor",
      "demandado",
      "demandada",
      "apoderado",
      "apoderada",
      "patrocinante"
    ];

    const words =
      name
        .split(/\s+/)
        .filter(Boolean);

    if (
      words.length < 2 ||
      words.length > 6
    ) {
      continue;
    }

    if (
      invalid.includes(
        normalize(name)
      )
    ) {
      continue;
    }

    return name;
  }

  return "";
};

const extractCompany = (
  text = ""
) => {
  const header =
    getHeaderText(text, 120);

  const patterns = [
    /(?:en\s+(?:mi\s+)?car[aá]cter\s+de\s+(?:letrad[oa]\s+)?apoderad[oa]\s+de)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i,

    /(?:en\s+representaci[oó]n\s+de|representa(?:ndo)?\s+a)\s+["“]?([A-Z0-9ÁÉÍÓÚÜÑ .,&'()-]{3,180})/i,

    /(?:aseguradora|art|compa[ñn][ií]a|codemandada)\s*:\s*([^\n]{3,180})/i
  ];

  for (const pattern of patterns) {
    const match =
      header.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    const company =
      clean(
        match[1].replace(
          /\s+(?:con\s+domicilio|constituyendo|domicilio|cuit|tel[eé]fono|correo|email).*$/i,
          ""
        )
      );

    const normalized =
      normalize(company);

    const invalid = [
      "parte actora",
      "la parte actora",
      "parte demandada",
      "la parte demandada",
      "codemandada",
      "y otro",
      "y otros",
      "normalmente los juzgados",
      "solamente en el momento"
    ];

    if (
      company &&
      !invalid.some(
        (item) =>
          normalized.includes(
            normalize(item)
          )
      )
    ) {
      return company;
    }
  }

  return "";
};

  const parseLawyer = (
    text = "",
    side = ""
  ) => {
    const emails =
      splitEmails(text);

    const phones =
      extractPhones(text);

    return {
      parte:
        side,

      nombreCompleto:
        extractLawyerName(text),

      matricula:
        extractRegistration(text),

      telefono:
        phones[0] || "",

      whatsapp:
        phones[1] ||
        phones[0] ||
        "",

      email:
        emails.personales[0] ||
        "",

      domicilioElectronico:
        emails
          .domiciliosElectronicos[0] ||
        "",

      companiaRepresentada:
        extractCompany(text),

      observaciones:
        normalize(text).includes(
          "apoderado"
        )
          ? "Letrado/a apoderado/a"
          : normalize(text).includes(
                "patrocinante"
              )
            ? "Letrado/a patrocinante"
            : ""
    };
  };

  const parseCase = (
    text = ""
  ) => {
    const caratula =
      extractCaseTitle(text);

    const parties =
      splitParties(
        caratula
      );

    return {
      expediente:
        extractCaseNumber(text),

      caratula,

      fuero:
        rules?.detectCourtType?.(
          text
        ) || "",

      organismo:
        extractCourt(text),

      tipoProceso:
        extractProcessType(text),

      actor:
        parties.actor,

      demandado:
        parties.demandado
    };
  };

  const parseDocument = ({
    text = "",
    category = "",
    side = ""
  } = {}) => {
    const result = {
      categoria:
        category,

      fecha:
        extractDate(text),

      causa: {},

      abogado: null,

      compania: "",

      textoDisponible:
        Boolean(
          String(text).trim()
        )
    };

    if (
      category === "caratula" ||
      category === "demanda" ||
      category ===
        "contestacion-demanda"
    ) {
      result.causa =
        parseCase(text);
    }

    if (
      category ===
        "abogado-actora" ||
      category ===
        "abogado-demandada" ||
      category === "demanda" ||
      category ===
        "contestacion-demanda"
    ) {
      result.abogado =
        parseLawyer(
          text,
          side
        );

      result.compania =
        result.abogado
          ?.companiaRepresentada ||
        "";
    }

    return result;
  };

  window.GestionCausasParserJuridico = {
    extractEmails,
    splitEmails,
    extractPhones,
    extractDate,
    extractCaseNumber,
    extractCaseTitle,
    splitParties,
    extractCourt,
    extractProcessType,
    extractRegistration,
    extractLawyerName,
    extractCompany,
    parseLawyer,
    parseCase,
    parseDocument
  };

  console.log(
    "Gestión de Causas FALCO® Parser Jurídico Ready"
  );
})();