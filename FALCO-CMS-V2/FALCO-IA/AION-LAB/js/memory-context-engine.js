/* =========================================================
   AION Memory Context Engine™ v1.0
   Sistema FALCO®

   Responsabilidad:
   - Guardar contexto conversacional temporal.
   - Recuperar el contexto más reciente.
   - Mantener un historial limitado.
   - Detectar el tema previo de la conversación.

   Este módulo:
   - No genera respuestas.
   - No modifica Conversation Engine™.
   - No consulta Firestore.
   - No guarda datos personales permanentes.
========================================================= */

const AIONMemoryContextEngine = {

  version: "1.0",

  maxItems: 20,

  storageKey: "aion_memory_context_v1",

  memory: {
    sessionId: null,
    current: null,
    previous: null,
    history: []
  },


  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  init() {

    const restored = this.restore();

    if (!restored) {
      this.memory.sessionId =
        this.generateSessionId();
    }

    return this.getState();
  },


  /* =====================================================
     GUARDAR CONTEXTO
  ===================================================== */

  remember(context = {}) {

    if (!this.isPlainObject(context)) {
      return {
        success: false,
        error: "El contexto debe ser un objeto."
      };
    }

    const normalized =
      window.AIONContextSchema
        ? window.AIONContextSchema.normalize(context)
        : { ...context };

    if (this.memory.current) {
      this.memory.previous = {
        ...this.memory.current
      };
    }

    this.memory.current = {
      ...normalized,
      rememberedAt: new Date().toISOString()
    };

    this.memory.history.push({
      ...this.memory.current
    });

    this.trimHistory();

    this.persist();

    return {
      success: true,
      memory: this.getState()
    };
  },


  /* =====================================================
     RECUPERACIÓN
  ===================================================== */

  getCurrent() {

    return this.memory.current
      ? { ...this.memory.current }
      : null;
  },


  getPrevious() {

    return this.memory.previous
      ? { ...this.memory.previous }
      : null;
  },


  getHistory() {

    return this.memory.history.map(
      item => ({ ...item })
    );
  },


  getLastTopic() {

    return (
      this.memory.current?.topic ||
      this.memory.previous?.topic ||
      null
    );
  },


  getLastIntent() {

    return (
      this.memory.current?.intent ||
      this.memory.previous?.intent ||
      null
    );
  },


  /* =====================================================
     CONTEXTO CONVERSACIONAL
  ===================================================== */

  getConversationContext() {

    return {

      sessionId:
        this.memory.sessionId,

      currentTopic:
        this.memory.current?.topic || null,

      currentIntent:
        this.memory.current?.intent || null,

      previousTopic:
        this.memory.previous?.topic || null,

      previousIntent:
        this.memory.previous?.intent || null,

      historyLength:
        this.memory.history.length,

      hasMemory:
        this.memory.history.length > 0

    };
  },


  enrich(context = {}) {

    const conversation =
      this.getConversationContext();

    return {
      ...context,

      memory: {
        sessionId:
          conversation.sessionId,

        currentTopic:
          context.topic ||
          conversation.currentTopic,

        currentIntent:
          context.intent ||
          conversation.currentIntent,

        previousTopic:
          conversation.currentTopic,

        previousIntent:
          conversation.currentIntent,

        historyLength:
          conversation.historyLength,

        hasMemory:
          conversation.hasMemory
      }
    };
  },


  /* =====================================================
     BÚSQUEDA EN MEMORIA
  ===================================================== */

  findByTopic(topic = "") {

    const normalizedTopic =
      String(topic)
        .toLowerCase()
        .trim();

    return this.memory.history
      .filter(item =>
        String(item.topic)
          .toLowerCase()
          .trim() === normalizedTopic
      )
      .map(item => ({ ...item }));
  },


  findLastMeaningfulContext() {

    for (
      let index =
        this.memory.history.length - 1;

      index >= 0;

      index--
    ) {

      const item =
        this.memory.history[index];

      if (
        item.topic &&
        item.topic !== "general"
      ) {
        return { ...item };
      }

    }

    return null;
  },


  /* =====================================================
     PERSISTENCIA TEMPORAL
  ===================================================== */

  persist() {

    try {

      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify(this.memory)
      );

      return true;

    } catch (error) {

      console.warn(
        "AION Memory Context™ no pudo guardar la sesión:",
        error
      );

      return false;

    }
  },


  restore() {

    try {

      const stored =
        sessionStorage.getItem(
          this.storageKey
        );

      if (!stored) {
        return false;
      }

      const parsed =
        JSON.parse(stored);

      if (!this.isPlainObject(parsed)) {
        return false;
      }

      this.memory = {
        sessionId:
          parsed.sessionId ||
          this.generateSessionId(),

        current:
          parsed.current || null,

        previous:
          parsed.previous || null,

        history:
          Array.isArray(parsed.history)
            ? parsed.history
            : []
      };

      this.trimHistory();

      return true;

    } catch (error) {

      console.warn(
        "AION Memory Context™ no pudo restaurar la sesión:",
        error
      );

      return false;

    }
  },


  /* =====================================================
     LIMPIEZA
  ===================================================== */

  clear() {

    this.memory = {
      sessionId:
        this.generateSessionId(),

      current: null,

      previous: null,

      history: []
    };

    try {
      sessionStorage.removeItem(
        this.storageKey
      );
    } catch (error) {
      console.warn(
        "AION Memory Context™ no pudo limpiar la sesión:",
        error
      );
    }

    return this.getState();
  },


  trimHistory() {

    if (
      this.memory.history.length >
      this.maxItems
    ) {

      this.memory.history =
        this.memory.history.slice(
          -this.maxItems
        );

    }
  },


  /* =====================================================
     ESTADO
  ===================================================== */

  getState() {

    return {

      engine:
        "AION Memory Context Engine™",

      version:
        this.version,

      sessionId:
        this.memory.sessionId,

      current:
        this.getCurrent(),

      previous:
        this.getPrevious(),

      historyLength:
        this.memory.history.length

    };
  },


  /* =====================================================
     UTILIDADES
  ===================================================== */

  generateSessionId() {

    const timestamp =
      Date.now().toString(36);

    const random =
      Math.random()
        .toString(36)
        .slice(2, 8);

    return `AION-${timestamp}-${random}`
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


window.AIONMemoryContextEngine =
  AIONMemoryContextEngine;


AIONMemoryContextEngine.init();


console.log(
  "AION Memory Context Engine™ v1.0 Ready"
);