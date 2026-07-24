/* =========================================================
   AION Brain Bridge™ v1.0
   Sistema FALCO®

   Responsabilidad:
   - Conectar consultas externas con AION Brain™ v2.0.
   - Mantener desacoplado Conversation Engine™.
   - Permitir pruebas antes de la integración definitiva.

   Este módulo:
   - No genera respuestas.
   - No modifica la interfaz.
   - No reemplaza AION Brain Engine™ v1.3.
========================================================= */

const AIONBrainBridge = {

  version: "1.0",

  state: {
    ready: false,
    lastInput: null,
    lastResult: null,
    lastError: null,
    forwardedCount: 0
  },


  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  init() {

    if (!window.AIONBrainV2) {

      this.state.ready = false;

      this.state.lastError = {
        type: "missing_brain",
        message: "AION Brain™ v2.0 no está disponible."
      };

      console.warn(
        "AION Brain Bridge™ v1.0 no pudo iniciar."
      );

      return {
        success: false,
        ready: false
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
     ENVÍO AL BRAIN
  ===================================================== */

  forward(input = {}) {

    if (!this.state.ready) {

      const initialization =
        this.init();

      if (!initialization.success) {

        return {
          success: false,
          error:
            "AION Brain Bridge™ no está listo."
        };
      }
    }

    try {

      const normalizedInput =
        this.normalizeInput(input);

      if (!normalizedInput.question) {

        this.state.lastError = {
          type: "empty_question",
          message:
            "No se recibió una consulta válida."
        };

        return {
          success: false,
          error:
            "La consulta está vacía."
        };
      }

      const result =
        window.AIONBrainV2.process(
          normalizedInput
        );

      this.state.lastInput = {
        ...normalizedInput
      };

      this.state.lastResult =
        result;

      if (!result.success) {

        this.state.lastError = {
          type: "brain_error",
          details: result
        };

        return result;
      }

      this.state.forwardedCount += 1;
      this.state.lastError = null;

      return {
        success: true,

        bridge: {
          name: "AION Brain Bridge™",
          version: this.version
        },

        result
      };

    } catch (error) {

      this.state.lastError = {
        type: "bridge_error",
        message: error.message
      };

      console.error(
        "AION Brain Bridge™ Error:",
        error
      );

      return {
        success: false,
        error: error.message
      };
    }
  },


  /* =====================================================
     NORMALIZACIÓN
  ===================================================== */

  normalizeInput(input = {}) {

    if (typeof input === "string") {

      return {
        question: input.trim(),
        answerKey: "general",
        source: "bridge",
        metadata: {
          bridgeVersion: this.version
        }
      };
    }

    return {
      question:
        String(
          input.question ||
          input.query ||
          ""
        ).trim(),

      answerKey:
        input.answerKey ||
        input.topic ||
        "general",

      source:
        input.source ||
        "bridge",

      metadata: {
        ...(
          input.metadata &&
          typeof input.metadata === "object"
            ? input.metadata
            : {}
        ),

        bridgeVersion:
          this.version
      }
    };
  },


  /* =====================================================
     ESTADO
  ===================================================== */

  getState() {

    return {
      engine:
        "AION Brain Bridge™",

      version:
        this.version,

      ready:
        this.state.ready,

      forwardedCount:
        this.state.forwardedCount,

      lastInput:
        this.state.lastInput
          ? { ...this.state.lastInput }
          : null,

      lastResult:
        this.state.lastResult,

      lastError:
        this.state.lastError
          ? { ...this.state.lastError }
          : null
    };
  },


  /* =====================================================
     REINICIO
  ===================================================== */

  reset() {

    this.state = {
      ready: false,
      lastInput: null,
      lastResult: null,
      lastError: null,
      forwardedCount: 0
    };

    return this.init();
  }

};


window.AIONBrainBridge =
  AIONBrainBridge;


AIONBrainBridge.init();


console.log(
  "AION Brain Bridge™ v1.0 Ready"
);