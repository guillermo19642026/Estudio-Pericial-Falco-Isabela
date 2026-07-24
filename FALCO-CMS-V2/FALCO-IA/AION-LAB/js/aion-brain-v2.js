/* =========================================================
   AION Brain™ v2.0
   Sistema FALCO®

   Responsabilidad:
   - Orquestar módulos.
   - Procesar una consulta.
   - Normalizar el contexto.
   - Guardar memoria.
   - Devolver un único objeto.

   Este módulo:
   - No genera respuestas.
   - No modifica Conversation Engine™.
   - No reemplaza AION Brain Engine™ v1.3.
   - No contiene reglas de intención.
========================================================= */

const AIONBrainV2 = {

  version: "2.0",

  state: {
    ready: false,
    lastContext: null,
    lastError: null,
    processedCount: 0
  },


  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  init() {

    const modules = this.checkModules();

    this.state.ready = modules.ready;

    if (!modules.ready) {

      this.state.lastError = {
        type: "missing_modules",
        modules: modules.missing
      };

      console.warn(
        "AION Brain™ v2.0 no pudo iniciar. Faltan módulos:",
        modules.missing
      );

      return {
        success: false,
        ready: false,
        missing: modules.missing
      };
    }

    this.state.lastError = null;

    return {
      success: true,
      ready: true,
      version: this.version
    };
  },


  /* =====================================================
     PROCESAMIENTO PRINCIPAL
  ===================================================== */

  process(input = {}) {

    if (!this.state.ready) {

      const initialization =
        this.init();

      if (!initialization.success) {

        return {
          success: false,
          error: "AION Brain™ v2.0 no está listo.",
          details: initialization
        };
      }
    }

    try {

      const normalizedInput =
        this.normalizeInput(input);

      const analyzedContext =
        window.AIONConversationContextEngine.analyze({
          question:
            normalizedInput.question,

          answerKey:
            normalizedInput.answerKey,

          source:
            normalizedInput.source,

          metadata:
            normalizedInput.metadata
        });

     const normalizedContext =
  window.AIONContextSchema.normalize(
    analyzedContext
  );

/*
 * Resuelve continuidad conversacional
 * antes de guardar el contexto actual.
 */
const resolutionResult =
  window.AIONContextResolutionEngine.resolve(
    normalizedContext
  );

if (!resolutionResult.success) {

  this.state.lastError = {
    type: "resolution_error",
    details: resolutionResult
  };

  return {
    success: false,
    error:
      "No se pudo resolver el contexto conversacional.",
    details:
      resolutionResult
  };
}

const resolvedContext =
  resolutionResult.resolution.context;

const enrichedContext =
  window.AIONMemoryContextEngine.enrich(
    resolvedContext
  );

const validation =
  window.AIONContextSchema.validate(
    enrichedContext
  );

      if (!validation.valid) {

        this.state.lastError = {
          type: "invalid_context",
          errors: validation.errors
        };

        return {
          success: false,
          error: "El contexto generado no es válido.",
          validation
        };
      }

      const memoryResult =
        window.AIONMemoryContextEngine.remember(
          enrichedContext
        );

      if (!memoryResult.success) {

        this.state.lastError = {
          type: "memory_error",
          error: memoryResult.error
        };

        return {
          success: false,
          error: "No se pudo guardar el contexto.",
          details: memoryResult
        };
      }

      this.state.lastContext =
        enrichedContext;

      this.state.lastError =
        null;

      this.state.processedCount += 1;

     return {
  success: true,

  brain: {
    name: "AION Brain™",
    version: this.version
  },

  context:
    enrichedContext,

  resolution: {
    dependent:
      resolutionResult
        .resolution
        .dependent,

    inherited:
      resolutionResult
        .resolution
        .inherited,

    originalTopic:
      resolutionResult
        .resolution
        .originalTopic,

    previousTopic:
      resolutionResult
        .resolution
        .previousTopic,

    resolvedTopic:
      resolutionResult
        .resolution
        .resolvedTopic,

    reason:
      resolutionResult
        .resolution
        .reason
  },

  memory:
    window.AIONMemoryContextEngine
      .getConversationContext()
};
    } catch (error) {

      this.state.lastError = {
        type: "processing_error",
        message: error.message
      };

      console.error(
        "AION Brain™ v2.0 Processing Error:",
        error
      );

      return {
        success: false,
        error: error.message
      };
    }
  },


  /* =====================================================
     NORMALIZACIÓN DE ENTRADA
  ===================================================== */

  normalizeInput(input = {}) {

    if (typeof input === "string") {

      return {
        question: input,
        answerKey: "general",
        source: "free_text",
        metadata: {}
      };
    }

    return {
      question:
        input.question ||
        input.query ||
        "",

      answerKey:
        input.answerKey ||
        input.topic ||
        "general",

      source:
        input.source ||
        "free_text",

      metadata:
        this.isPlainObject(input.metadata)
          ? input.metadata
          : {}
    };
  },


  /* =====================================================
     CONTROL DE MÓDULOS
  ===================================================== */

  checkModules() {

    const required = {

  AIONConversationContextEngine:
    window.AIONConversationContextEngine,

  AIONContextSchema:
    window.AIONContextSchema,

  AIONMemoryContextEngine:
    window.AIONMemoryContextEngine,

  AIONContextResolutionEngine:
    window.AIONContextResolutionEngine

};

    const missing =
      Object.entries(required)
        .filter(([, module]) => !module)
        .map(([name]) => name);

    return {
      ready: missing.length === 0,
      missing
    };
  },


  /* =====================================================
     ESTADO
  ===================================================== */

  getState() {

    return {
      engine: "AION Brain™",
      version: this.version,
      ready: this.state.ready,
      processedCount:
        this.state.processedCount,
      lastContext:
        this.state.lastContext
          ? { ...this.state.lastContext }
          : null,
      lastError:
        this.state.lastError
          ? { ...this.state.lastError }
          : null
    };
  },


  getLastContext() {

    return this.state.lastContext
      ? { ...this.state.lastContext }
      : null;
  },


  /* =====================================================
     REINICIO
  ===================================================== */

  reset() {

    window.AIONMemoryContextEngine.clear();

    this.state = {
      ready: false,
      lastContext: null,
      lastError: null,
      processedCount: 0
    };

    return this.init();
  },


  /* =====================================================
     UTILIDADES
  ===================================================== */

  isPlainObject(value) {

    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

};


window.AIONBrainV2 =
  AIONBrainV2;


AIONBrainV2.init();


console.log(
  "AION Brain™ v2.0 Ready"
);