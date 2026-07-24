/* =========================================================
   AION Context Engine™ v1.0
   Sistema FALCO®

   Responsabilidad:
   - Recibir una consulta ya clasificada.
   - Interpretar su intención específica.
   - Extraer entidades relevantes.
   - Construir un objeto de contexto.

   Este módulo:
   - No genera respuestas.
   - No modifica Conversation Engine™.
   - No consulta bases de datos.
   - No guarda memoria.
========================================================= */

const AIONConversationContextEngine = {

  version: "1.0",

  /* =====================================================
     API PRINCIPAL
  ===================================================== */

  analyze(input = {}) {

    const question = this.normalizeText(
      input.question || input.query || ""
    );

    const answerKey = this.normalizeKey(
      input.answerKey || input.topic || "general"
    );

    const source = input.source || "free_text";

    const intentResult = this.detectIntent(
      question,
      answerKey
    );

    const entities = this.extractEntities(question);

    const confidence = this.calculateConfidence({
      question,
      answerKey,
      intentResult,
      entities
    });

    return this.buildContext({
      originalQuestion:
        input.question || input.query || "",

      normalizedQuestion: question,

      answerKey,

      topic: answerKey,

      intent: intentResult.intent,

      intentMatches: intentResult.matches,

      entities,

      confidence,

      source,

      metadata: input.metadata || {}
    });
  },


  /* =====================================================
     DETECCIÓN DE INTENCIÓN
  ===================================================== */

  detectIntent(question, topic) {

    const rules = this.getIntentRules(topic);

    let bestIntent = "consulta_general";
    let bestMatches = [];

    rules.forEach(rule => {

      const matches = rule.keywords.filter(keyword =>
        question.includes(
          this.normalizeText(keyword)
        )
      );

      if (matches.length > bestMatches.length) {
        bestIntent = rule.intent;
        bestMatches = matches;
      }

    });

    return {
      intent: bestIntent,
      matches: bestMatches
    };
  },


  /* =====================================================
     REGLAS DE INTENCIÓN POR TEMA
  ===================================================== */

  getIntentRules(topic) {

    const rules = {

      ubicacion: [
        {
          intent: "consulta_sucursal",
          keywords: [
            "oficina",
            "oficinas",
            "sede",
            "sucursal",
            "local"
          ]
        },
        {
          intent: "consulta_cobertura_geografica",
          keywords: [
            "atienden en",
            "trabajan en",
            "cobertura",
            "zona",
            "provincia",
            "localidad",
            "ciudad"
          ]
        },
        {
          intent: "consulta_modalidad_virtual",
          keywords: [
            "virtual",
            "online",
            "videollamada",
            "zoom",
            "meet",
            "distancia"
          ]
        },
        {
          intent: "consulta_direccion",
          keywords: [
            "direccion",
            "domicilio",
            "donde queda",
            "como llegar"
          ]
        }
      ],

      honorarios: [
        {
          intent: "consulta_arancel",
          keywords: [
            "cuanto cuesta",
            "precio",
            "valor",
            "arancel",
            "costo",
            "honorarios"
          ]
        },
        {
          intent: "consulta_forma_pago",
          keywords: [
            "forma de pago",
            "medios de pago",
            "transferencia",
            "efectivo",
            "tarjeta",
            "cuotas"
          ]
        },
        {
          intent: "consulta_presupuesto",
          keywords: [
            "presupuesto",
            "cotizacion",
            "cotizar"
          ]
        }
      ],

      profesionales: [
        {
          intent: "identificacion_profesional",
          keywords: [
            "soy abogado",
            "soy abogada",
            "soy psicologo",
            "soy psicologa",
            "soy profesional",
            "estudio juridico"
          ]
        },
        {
          intent: "consulta_supervision",
          keywords: [
            "supervision",
            "supervisar",
            "corregir informe",
            "revisar informe"
          ]
        },
        {
          intent: "consulta_formacion",
          keywords: [
            "formacion",
            "curso",
            "capacitacion",
            "aprender",
            "estudiante"
          ]
        },
        {
          intent: "consulta_colaboracion",
          keywords: [
            "trabajar con ustedes",
            "colaborar",
            "incorporarme",
            "postulacion",
            "postularme"
          ]
        }
      ],

      documentacion: [
        {
          intent: "consulta_documentacion_requerida",
          keywords: [
            "que documentacion",
            "que documentos",
            "que necesito presentar",
            "que tengo que enviar",
            "requisitos"
          ]
        },
        {
          intent: "consulta_adjuntar_documentacion",
          keywords: [
            "adjuntar",
            "subir archivo",
            "subir documento",
            "cargar documento",
            "enviar archivo"
          ]
        },
        {
          intent: "problema_documentacion",
          keywords: [
            "no puedo adjuntar",
            "no puedo subir",
            "error",
            "fallo",
            "no carga"
          ]
        }
      ],

      pericia: [
        {
          intent: "consulta_pericia_psicologica",
          keywords: [
            "pericia psicologica",
            "evaluacion pericial",
            "evaluacion psicologica"
          ]
        },
        {
          intent: "consulta_perito_de_parte",
          keywords: [
            "perito de parte",
            "perito particular",
            "acompañar pericia"
          ]
        },
        {
          intent: "consulta_informe_pericial",
          keywords: [
            "informe pericial",
            "informe psicologico",
            "dictamen"
          ]
        },
        {
          intent: "consulta_impugnacion",
          keywords: [
            "impugnacion",
            "impugnar",
            "observaciones al informe"
          ]
        }
      ],

      turnos: [
        {
          intent: "consulta_disponibilidad",
          keywords: [
            "disponibilidad",
            "fecha disponible",
            "fecha mas cercana",
            "cuando pueden",
            "cuando atienden"
          ]
        },
        {
          intent: "solicitud_turno",
          keywords: [
            "sacar turno",
            "pedir turno",
            "reservar",
            "agendar",
            "entrevista"
          ]
        },
        {
          intent: "reprogramacion_turno",
          keywords: [
            "reprogramar",
            "cambiar turno",
            "cancelar turno"
          ]
        }
      ],

      general: [
        {
          intent: "solicitud_orientacion",
          keywords: [
            "necesito orientacion",
            "no se que necesito",
            "pueden ayudarme",
            "quiero consultar"
          ]
        },
        {
          intent: "saludo",
          keywords: [
            "hola",
            "buen dia",
            "buenas tardes",
            "buenas noches"
          ]
        },
        {
          intent: "agradecimiento",
          keywords: [
            "gracias",
            "muchas gracias"
          ]
        }
      ]

    };

    return rules[topic] || rules.general;
  },


  /* =====================================================
     EXTRACCIÓN DE ENTIDADES
  ===================================================== */

  extractEntities(question) {

    const entities = [];

    const catalog = {

      location: [
        "buenos aires",
        "capital federal",
        "caba",
        "cordoba",
        "rosario",
        "mendoza",
        "san martin",
        "moron",
        "ituzaingo",
        "ramos mejia",
        "la matanza",
        "escobar",
        "pilar",
        "zona norte",
        "zona oeste",
        "zona sur"
      ],

      legalArea: [
        "civil",
        "laboral",
        "penal",
        "familia",
        "violencia de genero",
        "daños y perjuicios",
        "accidente laboral"
      ],

      profession: [
        "abogado",
        "abogada",
        "psicologo",
        "psicologa",
        "perito",
        "estudiante",
        "profesional"
      ],

      service: [
        "pericia psicologica",
        "daño psiquico",
        "informe pericial",
        "perito de parte",
        "impugnacion",
        "psicodiagnostico",
        "supervision",
        "entrevista",
        "tratamiento"
      ],

      modality: [
        "virtual",
        "online",
        "presencial",
        "zoom",
        "meet",
        "videollamada"
      ],

      document: [
        "dni",
        "expediente",
        "demanda",
        "historia clinica",
        "documentacion",
        "informe",
        "sentencia"
      ]

    };

    Object.entries(catalog).forEach(
      ([type, values]) => {

        values.forEach(value => {

          if (
            question.includes(
              this.normalizeText(value)
            )
          ) {

            entities.push({
              type,
              value
            });

          }

        });

      }
    );

    return this.removeDuplicateEntities(entities);
  },


  /* =====================================================
     CÁLCULO DE CONFIANZA
  ===================================================== */

  calculateConfidence({
    question,
    answerKey,
    intentResult,
    entities
  }) {

    let confidence = 0.45;

    if (
      answerKey &&
      answerKey !== "general"
    ) {
      confidence += 0.20;
    }

    if (
      intentResult.intent !== "consulta_general"
    ) {
      confidence += 0.15;
    }

    if (
      intentResult.matches.length > 0
    ) {
      confidence += Math.min(
        intentResult.matches.length * 0.05,
        0.10
      );
    }

    if (entities.length > 0) {
      confidence += 0.05;
    }

    if (question.length >= 10) {
      confidence += 0.05;
    }

    return Number(
      Math.min(confidence, 0.99).toFixed(2)
    );
  },


  /* =====================================================
     CONSTRUCCIÓN DEL CONTEXTO
  ===================================================== */

  buildContext(data) {

    return {

     engine: "AION Conversation Context Engine™",

      version: this.version,

      question: data.originalQuestion,

      normalizedQuestion:
        data.normalizedQuestion,

      answerKey: data.answerKey,

      topic: data.topic,

      intent: data.intent,

      entities: data.entities,

      confidence: data.confidence,

      source: data.source,

      metadata: data.metadata,

      diagnostics: {
        intentMatches: data.intentMatches,
        hasEntities: data.entities.length > 0
      },

      timestamp: new Date().toISOString()

    };
  },


  /* =====================================================
     UTILIDADES
  ===================================================== */

  normalizeText(text = "") {

    return String(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!.,;:()"]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },


  normalizeKey(key = "general") {

    return this.normalizeText(key)
      .replace(/\s+/g, "_") || "general";
  },


  removeDuplicateEntities(entities) {

    const seen = new Set();

    return entities.filter(entity => {

      const identifier =
        `${entity.type}:${entity.value}`;

      if (seen.has(identifier)) {
        return false;
      }

      seen.add(identifier);

      return true;
    });
  }

};


/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.AIONConversationContextEngine =
  AIONConversationContextEngine;


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

console.log(
  "AION Conversation Context Engine™ v1.0 Ready"
);