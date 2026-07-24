/* =========================================================
   AION Context Resolution Engine™ v1.0
   Sistema FALCO®

   Responsabilidad:
   - Resolver consultas dependientes del contexto anterior.
   - Detectar continuidad conversacional.
   - Heredar tema e información cuando corresponda.
   - Devolver un nuevo contexto sin modificar el original.

   Este módulo:
   - No genera respuestas.
   - No modifica la interfaz.
   - No guarda memoria.
   - No reemplaza Intent Engine™.
========================================================= */

const AIONContextResolutionEngine = {

  version: "1.0",

  state: {
    ready: false,
    resolvedCount: 0,
    inheritedCount: 0,
    lastResolution: null,
    lastError: null
  },


  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  init() {

    const missing = [];

    if (!window.AIONMemoryContextEngine) {
      missing.push(
        "AIONMemoryContextEngine"
      );
    }

    if (!window.AIONContextSchema) {
      missing.push(
        "AIONContextSchema"
      );
    }

    if (missing.length) {

      this.state.ready = false;

      this.state.lastError = {
        type: "missing_modules",
        modules: missing
      };

      console.warn(
        "AION Context Resolution Engine™ v1.0 no pudo iniciar.",
        missing
      );

      return {
        success: false,
        ready: false,
        missing
      };
    }

    this.state.ready = true;
    this.state.lastError = null;

    return {
      success: true,
      ready: true,
      version: this.version
    };
  },


  /* =====================================================
     RESOLUCIÓN PRINCIPAL
  ===================================================== */

  resolve(context = null) {

    if (!this.state.ready) {

      const initialization =
        this.init();

      if (!initialization.success) {
        return {
          success: false,
          error:
            "Context Resolution Engine™ no está listo."
        };
      }
    }

    try {

      if (
        !context ||
        typeof context !== "object"
      ) {
        return {
          success: false,
          error:
            "No se recibió un contexto válido."
        };
      }

      const memoryState =
        window.AIONMemoryContextEngine
          .getState();

      const previousContext =
        this.findPreviousContext(
          context,
          memoryState
        );

      const resolution =
        this.buildResolution(
          context,
          previousContext
        );

      this.state.resolvedCount += 1;

      if (resolution.inherited) {
        this.state.inheritedCount += 1;
      }

      this.state.lastResolution =
        resolution;

      this.state.lastError =
        null;

      return {
        success: true,
        resolution
      };

    } catch (error) {

      this.state.lastError = {
        type: "resolution_error",
        message: error.message
      };

      console.error(
        "AION Context Resolution Engine™ Error:",
        error
      );

      return {
        success: false,
        error: error.message
      };
    }
  },


  /* =====================================================
     CONSTRUCCIÓN DE LA RESOLUCIÓN
  ===================================================== */

  buildResolution(
    currentContext,
    previousContext
  ) {

    const current =
      this.clone(currentContext);

    const previous =
      previousContext
        ? this.clone(previousContext)
        : null;

    const question =
      String(
        current.question ||
        ""
      ).trim();

    const currentTopic =
      this.normalizeValue(
        current.topic ||
        current.answerKey
      );

    const previousTopic =
      this.normalizeValue(
        previous?.topic ||
        previous?.answerKey
      );

    const dependency =
      this.detectDependency(
        question,
        current
      );

    const currentIsGeneric =
      this.isGenericTopic(
        currentTopic
      );

    const canInherit =
      Boolean(
        previous &&
        previousTopic &&
        dependency.isDependent &&
        currentIsGeneric
      );

    const resolvedContext = {
      ...current
    };

    if (canInherit) {

      resolvedContext.topic =
        previousTopic;

      if (
        !resolvedContext.answerKey ||
        this.isGenericTopic(
          resolvedContext.answerKey
        )
      ) {
        resolvedContext.answerKey =
          previous.answerKey ||
          previousTopic;
      }

      resolvedContext.entities =
        this.mergeEntities(
          previous.entities,
          current.entities
        );
    }

    resolvedContext.metadata = {
      ...(
        current.metadata &&
        typeof current.metadata === "object"
          ? current.metadata
          : {}
      ),

      contextResolution: {
        engine:
          "AION Context Resolution Engine™",

        version:
          this.version,

        dependent:
          dependency.isDependent,

        inherited:
          canInherit,

        inheritedFromTopic:
          canInherit
            ? previousTopic
            : null,

        originalTopic:
          currentTopic ||
          null,

        resolvedTopic:
          this.normalizeValue(
            resolvedContext.topic ||
            resolvedContext.answerKey
          ) || null,

        reason:
          canInherit
            ? dependency.reason
            : (
                dependency.isDependent
                  ? "No había un contexto anterior utilizable."
                  : "La consulta es independiente."
              )
      }
    };

    return {
      engine:
        "AION Context Resolution Engine™",

      version:
        this.version,

      dependent:
        dependency.isDependent,

      inherited:
        canInherit,

      reason:
        canInherit
          ? dependency.reason
          : (
              dependency.isDependent
                ? "dependency_without_inheritance"
                : "independent_query"
            ),

      originalTopic:
        currentTopic ||
        null,

      previousTopic:
        previousTopic ||
        null,

      resolvedTopic:
        this.normalizeValue(
          resolvedContext.topic ||
          resolvedContext.answerKey
        ) || null,

      context:
        resolvedContext
    };
  },


  /* =====================================================
     DETECCIÓN DE DEPENDENCIA
  ===================================================== */

  detectDependency(
    question,
    context = {}
  ) {

    const normalized =
      this.normalizeText(question);

    if (!normalized) {
      return {
        isDependent: false,
        reason: "empty_question"
      };
    }

    const explicitContinuityPatterns = [
      /^y\b/,
      /^e\b/,
      /^tambien\b/,
      /^ademas\b/,
      /^entonces\b/,
      /^en ese caso\b/,
      /^en ese sentido\b/,
      /^respecto de eso\b/,
      /^sobre eso\b/,
      /^con eso\b/,
      /^para eso\b/,
      /^por eso\b/,
      /^cuanto demora\b/,
      /^cuanto tarda\b/,
      /^cuanto cuesta\b/,
      /^que necesito\b/,
      /^que documentacion\b/,
      /^como seria\b/,
      /^donde seria\b/,
      /^cuando seria\b/
    ];

    const hasContinuityExpression =
      explicitContinuityPatterns.some(
        (pattern) =>
          pattern.test(normalized)
      );

    const tokens =
      normalized
        .split(" ")
        .filter(Boolean);

    const isShortQuestion =
      tokens.length <= 7;

    const genericTopic =
      this.isGenericTopic(
        context.topic ||
        context.answerKey
      );

    if (hasContinuityExpression) {
      return {
        isDependent: true,
        reason:
          "continuity_expression"
      };
    }

    if (
      isShortQuestion &&
      genericTopic
    ) {
      return {
        isDependent: true,
        reason:
          "short_generic_query"
      };
    }

    return {
      isDependent: false,
      reason:
        "independent_query"
    };
  },


  /* =====================================================
     MEMORIA
  ===================================================== */

  findPreviousContext(
    currentContext,
    memoryState
  ) {

    if (!memoryState) {
      return null;
    }

    const currentTimestamp =
      currentContext?.timestamp ||
      null;

    const memoryCurrent =
      memoryState.current ||
      null;

    const memoryPrevious =
      memoryState.previous ||
      null;

    /*
     * Si el contexto recibido ya es el current
     * guardado en memoria, usamos previous.
     */
    if (
      memoryCurrent &&
      currentTimestamp &&
      memoryCurrent.timestamp ===
        currentTimestamp
    ) {
      return memoryPrevious;
    }

    /*
     * Si todavía no fue guardado,
     * el current de memoria representa
     * el contexto anterior.
     */
    return (
      memoryCurrent ||
      memoryPrevious ||
      null
    );
  },


  /* =====================================================
     UTILIDADES
  ===================================================== */

  isGenericTopic(value) {

    const normalized =
      this.normalizeValue(value);

    return (
      !normalized ||
      normalized === "general" ||
      normalized === "desconocido" ||
      normalized === "unknown" ||
      normalized === "consulta" ||
      normalized === "orientacion"
    );
  },


  mergeEntities(
    previousEntities,
    currentEntities
  ) {

    const previous =
      Array.isArray(previousEntities)
        ? previousEntities
        : [];

    const current =
      Array.isArray(currentEntities)
        ? currentEntities
        : [];

    const combined = [
      ...previous,
      ...current
    ];

    const seen =
      new Set();

    return combined.filter(
      (entity) => {

        const key =
          typeof entity === "string"
            ? entity
            : JSON.stringify(entity);

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      }
    );
  },


  normalizeText(value) {

    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[¿?¡!.,;:®™"'()]/g,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();
  },


  normalizeValue(value) {

    return this.normalizeText(value)
      .replace(/\s+/g, "_");
  },


  clone(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return value;
    }

    return JSON.parse(
      JSON.stringify(value)
    );
  },


  /* =====================================================
     ESTADO
  ===================================================== */

  getState() {

    return {
      engine:
        "AION Context Resolution Engine™",

      version:
        this.version,

      ready:
        this.state.ready,

      resolvedCount:
        this.state.resolvedCount,

      inheritedCount:
        this.state.inheritedCount,

      lastResolution:
        this.state.lastResolution
          ? this.clone(
              this.state.lastResolution
            )
          : null,

      lastError:
        this.state.lastError
          ? this.clone(
              this.state.lastError
            )
          : null
    };
  },


  reset() {

    this.state = {
      ready: false,
      resolvedCount: 0,
      inheritedCount: 0,
      lastResolution: null,
      lastError: null
    };

    return this.init();
  }

};


window.AIONContextResolutionEngine =
  AIONContextResolutionEngine;


AIONContextResolutionEngine.init();


console.log(
  "AION Context Resolution Engine™ v1.0 Ready"
);