/* =========================================================
   AION Context Schema™ v1.0
   Sistema FALCO®

   Responsabilidad:
   - Definir la estructura estándar del contexto.
   - Validar objetos de contexto.
   - Normalizar campos faltantes.

   Este módulo:
   - No interpreta consultas.
   - No genera respuestas.
   - No modifica Conversation Engine™.
   - No guarda memoria.
========================================================= */

const AIONContextSchema = {

  version: "1.0",

  create(data = {}) {

    return {

      id:
        data.id ||
        this.generateId(),

      engine:
        data.engine ||
        "AION Brain™",

      version:
        data.version ||
        this.version,

      question:
        data.question ||
        "",

      normalizedQuestion:
        data.normalizedQuestion ||
        "",

      answerKey:
        data.answerKey ||
        "general",

      topic:
        data.topic ||
        data.answerKey ||
        "general",

      intent:
        data.intent ||
        "consulta_general",

      entities:
        Array.isArray(data.entities)
          ? data.entities
          : [],

      confidence:
        this.normalizeConfidence(
          data.confidence
        ),

      source:
        data.source ||
        "unknown",

      environment:
        data.environment ||
        null,

      metadata:
        this.isPlainObject(data.metadata)
          ? data.metadata
          : {},

      diagnostics:
        this.isPlainObject(data.diagnostics)
          ? data.diagnostics
          : {},

      memory:
        this.isPlainObject(data.memory)
          ? data.memory
          : {},

      route:
        this.isPlainObject(data.route)
          ? data.route
          : {},

      plan:
        this.isPlainObject(data.plan)
          ? data.plan
          : {},

      response:
        this.isPlainObject(data.response)
          ? data.response
          : {},

      timestamp:
        data.timestamp ||
        new Date().toISOString()

    };
  },


  validate(context = {}) {

    const errors = [];

    if (!this.isPlainObject(context)) {
      return {
        valid: false,
        errors: [
          "El contexto debe ser un objeto."
        ]
      };
    }

    if (
      typeof context.question !== "string"
    ) {
      errors.push(
        "question debe ser un texto."
      );
    }

    if (
      typeof context.answerKey !== "string"
    ) {
      errors.push(
        "answerKey debe ser un texto."
      );
    }

    if (
      typeof context.topic !== "string"
    ) {
      errors.push(
        "topic debe ser un texto."
      );
    }

    if (
      typeof context.intent !== "string"
    ) {
      errors.push(
        "intent debe ser un texto."
      );
    }

    if (
      !Array.isArray(context.entities)
    ) {
      errors.push(
        "entities debe ser un array."
      );
    }

    if (
      typeof context.confidence !== "number"
    ) {
      errors.push(
        "confidence debe ser numérico."
      );
    }

    if (
      context.confidence < 0 ||
      context.confidence > 1
    ) {
      errors.push(
        "confidence debe estar entre 0 y 1."
      );
    }

    if (
      typeof context.source !== "string"
    ) {
      errors.push(
        "source debe ser un texto."
      );
    }

    if (
      typeof context.timestamp !== "string"
    ) {
      errors.push(
        "timestamp debe ser un texto."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },


  normalize(context = {}) {

    return this.create(context);
  },


  normalizeConfidence(value) {

    const confidence =
      Number(value);

    if (
      Number.isNaN(confidence)
    ) {
      return 0;
    }

    return Number(
      Math.max(
        0,
        Math.min(confidence, 1)
      ).toFixed(2)
    );
  },


  generateId() {

    const timestamp =
      Date.now().toString(36);

    const random =
      Math.random()
        .toString(36)
        .slice(2, 8);

    return `CTX-${timestamp}-${random}`
      .toUpperCase();
  },


  isPlainObject(value) {

    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );
  }

};


window.AIONContextSchema =
  AIONContextSchema;


console.log(
  "AION Context Schema™ v1.0 Ready"
);