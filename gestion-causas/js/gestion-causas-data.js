(() => {
  "use strict";

  const STORAGE_KEY = "falco_gestion_causas";

  const causasIniciales = [
    {
      id: "causa-001",
      codigoInterno: "FALCO-LM-2022-001",
      expediente: "LM-20675-2022",
      caratula: "RIOS CAROLINA VIVIANA c/ IARAI S.A. s/ Despido",

      departamento: "la-matanza",
      departamentoNombre: "La Matanza",
      anio: "2022",

      fuero: "Laboral",
      organismo: "Tribunal de Trabajo",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Despido",

      estadoGeneral: "En impugnación",
      proximoPaso: "Contestar traslado",
      proximoVencimiento: "",
      activa: true,

      actor: "Carolina Viviana Ríos",
      demandado: "IARAI S.A.",

      partes: {
        actora: {
          nombre: "Carolina Viviana Ríos",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "IARAI S.A.",
          tipo: "empresa",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-001-actora",
          parte: "actora",
          nombreCompleto: "Abogado/a de la parte actora",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20287509651@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada: "",
          observaciones: ""
        },
        {
          id: "abogado-001-demandada",
          parte: "demandada",
          nombreCompleto: "Abogado/a de la parte demandada",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20311597834@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada: "IARAI S.A.",
          observaciones: ""
        }
      ],

      codemandadas: [],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "impugnada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-001",
          fecha: "2026-06-30",
          tipo: "Traslado",
          titulo: "Traslado de impugnación",
          descripcion:
            "Se confiere traslado de la impugnación a la pericia psicológica.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-06-30T12:00:00.000Z",
      fechaActualizacion: "2026-06-30T12:00:00.000Z"
    },

    {
      id: "causa-002",
      codigoInterno: "FALCO-MO-2023-001",
      expediente: "MO-45838-2023",
      caratula:
        "FERREYRA CRISTIAN MIGUEL c/ SWISS MEDICAL ART S.A. s/ Acción de Revisión CMJ Ley 15057",

      departamento: "moron",
      departamentoNombre: "Morón",
      anio: "2023",

      fuero: "Laboral",
      organismo: "Tribunal de Trabajo",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Acción de Revisión CMJ Ley 15057",

      estadoGeneral: "En explicaciones",
      proximoPaso: "Preparar contestación",
      proximoVencimiento: "",
      activa: true,

      actor: "Cristian Miguel Ferreyra",
      demandado: "SWISS MEDICAL ART S.A.",

      partes: {
        actora: {
          nombre: "Cristian Miguel Ferreyra",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "SWISS MEDICAL ART S.A.",
          tipo: "art",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-002-actora",
          parte: "actora",
          nombreCompleto: "Abogado/a de la parte actora",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico: "",
          estudioJuridico: "",
          companiaRepresentada: "",
          observaciones: ""
        },
        {
          id: "abogado-002-demandada",
          parte: "demandada",
          nombreCompleto: "Abogado/a de la parte demandada",
          matricula: "",
          colegio: "",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico: "",
          estudioJuridico: "",
          companiaRepresentada: "SWISS MEDICAL ART S.A.",
          observaciones: ""
        }
      ],

      codemandadas: [],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "presentada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-002",
          fecha: "2026-06-30",
          tipo: "Traslado",
          titulo: "Traslado de impugnación",
          descripcion:
            "Se confiere traslado de la impugnación a la pericia psicológica.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-06-30T12:00:00.000Z",
      fechaActualizacion: "2026-06-30T12:00:00.000Z"
    },

    {
      id: "causa-003",
      codigoInterno: "FALCO-MO-2014-001",
      expediente: "MO-34464-2014",
      caratula:
        "ARCE CACERES, CRISTIAN RAUL Y OTRO c/ NUÑEZ, HECTOR FABIO Y OTRO s/ Daños y Perjuicios",

      departamento: "moron",
      departamentoNombre: "Morón",
      anio: "2014",

      fuero: "Civil",
      organismo: "Juzgado Civil y Comercial",
      juzgado: "",
      secretaria: "",
      tipoProceso: "Daños y perjuicios",

      estadoGeneral: "En explicaciones",
      proximoPaso: "Responder observaciones",
      proximoVencimiento: "",
      activa: true,

      actor: "Cristian Raúl Arce Cáceres y otro",
      demandado: "Héctor Fabio Núñez y otro",

      partes: {
        actora: {
          nombre: "Cristian Raúl Arce Cáceres y otro",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        },

        demandada: {
          nombre: "Héctor Fabio Núñez y otro",
          tipo: "persona",
          documento: "",
          telefono: "",
          email: "",
          domicilio: ""
        }
      },

      abogados: [
        {
          id: "abogado-003-demandada",
          parte: "demandada",
          nombreCompleto: "Dr. Daniel Commisso",
          matricula: "Tº VIII Fº 183 CAM",
          colegio: "CAM",
          telefono: "",
          whatsapp: "",
          email: "",
          domicilioElectronico:
            "20207275469@notificaciones.scba.gov.ar",
          estudioJuridico: "",
          companiaRepresentada:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          observaciones: ""
        }
      ],

      codemandadas: [
        {
          id: "codemandada-003",
          nombre:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          tipo: "aseguradora",
          documento: "",
          telefono: "",
          email: "",
          domicilio: "",
          compania:
            "Seguros Bernardino Rivadavia Cooperativa Limitada",
          abogadoNombre: "Dr. Daniel Commisso",
          abogadoTelefono: "",
          abogadoEmail: "",
          observaciones: ""
        }
      ],

      seguimiento: {
        estadoAnticipo: "sin-solicitar",
        estadoEntrevista: "realizada",
        estadoPericia: "presentada",
        estadoHonorarios: "sin-regular"
      },

      observaciones: "",

      actuaciones: [
        {
          id: "actuacion-003",
          fecha: "2026-08-03",
          tipo: "Explicaciones",
          titulo: "Solicitud de explicaciones",
          descripcion:
            "La parte demandada solicita explicaciones al dictamen pericial.",
          estado: "pendiente"
        }
      ],

      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: "2026-08-03T12:00:00.000Z",
      fechaActualizacion: "2026-08-03T12:00:00.000Z"
    }
  ];

  const vencimientosIniciales = [
    {
      id: "vencimiento-001",
      dia: "06",
      mes: "AGO",
      titulo: "Contestar traslado",
      causa: "RIOS c/ IARAI S.A.",
      detalle: "Vence hoy",
      urgente: true
    },
    {
      id: "vencimiento-002",
      dia: "10",
      mes: "AGO",
      titulo: "Presentar explicación",
      causa: "ARCE CACERES c/ NUÑEZ",
      detalle: "Dentro de 4 días",
      urgente: false
    },
    {
      id: "vencimiento-003",
      dia: "13",
      mes: "AGO",
      titulo: "Entrevista psicológica",
      causa: "Causa laboral",
      detalle: "Modalidad virtual",
      urgente: false
    }
  ];

  const readStoredCases = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "No se pudieron leer las causas guardadas:",
        error
      );

      return [];
    }
  };

  const saveStoredCases = (causas) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(causas)
      );

      return true;
    } catch (error) {
      console.error(
        "No se pudieron guardar las causas:",
        error
      );

      return false;
    }
  };

  const mergeCases = () => {
    const storedCases = readStoredCases();
    const casesMap = new Map();

    causasIniciales.forEach((causa) => {
      casesMap.set(causa.id, causa);
    });

    storedCases.forEach((causa) => {
      casesMap.set(causa.id, causa);
    });

    return Array.from(casesMap.values());
  };

  const getCases = () => mergeCases();

  const getCaseById = (id) => {
    if (!id) {
      return null;
    }

    return getCases().find(
      (causa) => String(causa.id) === String(id)
    ) || null;
  };

  const addCase = (newCase) => {
    const storedCases = readStoredCases();

    storedCases.push(newCase);

    return saveStoredCases(storedCases);
  };

  const updateCase = (updatedCase) => {
    if (!updatedCase?.id) {
      return false;
    }

    const storedCases = readStoredCases();
    const storedIndex = storedCases.findIndex(
      (causa) => causa.id === updatedCase.id
    );

    const normalizedCase = {
      ...updatedCase,
      fechaActualizacion: new Date().toISOString()
    };

    if (storedIndex >= 0) {
      storedCases[storedIndex] = normalizedCase;
    } else {
      storedCases.push(normalizedCase);
    }

    return saveStoredCases(storedCases);
  };

  const deleteCase = (id) => {
    const storedCases = readStoredCases();

    const filteredCases = storedCases.filter(
      (causa) => causa.id !== id
    );

    return saveStoredCases(filteredCases);
  };

  window.GestionCausasData = {
    STORAGE_KEY,

    causasIniciales,
    vencimientos: vencimientosIniciales,

    getCases,
    getCaseById,
    addCase,
    updateCase,
    deleteCase,

    get causas() {
      return getCases();
    }
  };
})();