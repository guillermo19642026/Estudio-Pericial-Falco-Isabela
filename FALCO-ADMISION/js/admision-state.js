/* =========================================================
   FALCO Admisión™
   State System v0.1
   Estado central, persistencia local y control de sesión
========================================================= */

const FalcoAdmisionState = {

  /* =======================================================
     ESTADO INTERNO
  ======================================================= */

  data: {
    sessionId: null,

    createdAt: null,
    updatedAt: null,

    status: "borrador",

    audience: null,
    category: null,

    currentStep: 0,
    totalSteps: 0,

    currentQuestionId: null,

    answers: {},
    documents: [],

    completed: false,
    submitted: false,

    metadata: {
      version: null,
      language: null,
      userAgent: null,
      screen: null,
      source: "web"
    }
  },

  listeners: new Set(),

  saveTimer: null,

  initialized: false,

  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {
    if (this.initialized) {
      return this.getState();
    }

    const restored = this.restore();

    if (!restored) {
      this.createSession();
    }

    this.initialized = true;

    this.updateMetadata();

    this.emit("state:initialized", {
      restored
    });

    this.log(
      restored
        ? "Estado restaurado correctamente"
        : "Nueva sesión de admisión creada",
      this.getState()
    );

    return this.getState();
  },

  /* =======================================================
     NUEVA SESIÓN
  ======================================================= */

  createSession() {
    const now = new Date().toISOString();

    this.data = {
      sessionId: this.generateSessionId(),

      createdAt: now,
      updatedAt: now,

      status:
        window.FalcoAdmisionConfig
          ?.admissionStatus
          ?.draft
          ?.id || "borrador",

      audience: null,
      category: null,

      currentStep: 0,
      totalSteps: 0,

      currentQuestionId: null,

      answers: {},
      documents: [],

      completed: false,
      submitted: false,

      metadata: {
        version:
          window.FalcoAdmisionConfig
            ?.identity
            ?.version || "0.1.0",

        language:
          window.FalcoAdmisionConfig
            ?.environment
            ?.language || "es-AR",

        userAgent:
          navigator.userAgent || null,

        screen: {
          width:
            window.screen?.width || null,

          height:
            window.screen?.height || null
        },

        source: "web"
      }
    };

    this.saveNow();

    this.emit("session:created", {
      sessionId: this.data.sessionId
    });

    return this.getState();
  },

  /* =======================================================
     IDENTIFICADOR
  ======================================================= */

  generateSessionId() {
    const datePart =
      new Date()
        .toISOString()
        .replace(/\D/g, "")
        .slice(0, 14);

    const randomPart =
      Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase();

    return `ADM-${datePart}-${randomPart}`;
  },

  /* =======================================================
     LECTURA
  ======================================================= */

  getState() {
    return this.clone(this.data);
  },

  get(path, fallback = null) {
    if (!path) {
      return this.getState();
    }

    const value =
      path
        .split(".")
        .reduce(
          (current, key) =>
            current !== null &&
            current !== undefined
              ? current[key]
              : undefined,
          this.data
        );

    return value === undefined
      ? fallback
      : this.clone(value);
  },

  getSessionId() {
    return this.data.sessionId;
  },

  getAudience() {
    return this.data.audience;
  },

  getCategory() {
    return this.data.category;
  },

  getAnswers() {
    return this.clone(this.data.answers);
  },

  getAnswer(questionId, fallback = null) {
    if (!questionId) {
      return fallback;
    }

    const value =
      this.data.answers[questionId];

    return value === undefined
      ? fallback
      : this.clone(value);
  },

  getDocuments() {
    return this.clone(this.data.documents);
  },

  getProgress() {
    const current =
      Number(this.data.currentStep) || 0;

    const total =
      Number(this.data.totalSteps) || 0;

    const percentage =
      total > 0
        ? Math.min(
            100,
            Math.max(
              0,
              Math.round(
                (current / total) * 100
              )
            )
          )
        : 0;

    return {
      current,
      total,
      percentage
    };
  },

  hasStarted() {
    return Boolean(
      this.data.audience ||
      Object.keys(this.data.answers).length ||
      this.data.currentStep > 0
    );
  },

  hasAnswer(questionId) {
    return Object.prototype.hasOwnProperty.call(
      this.data.answers,
      questionId
    );
  },

  isCompleted() {
    return Boolean(this.data.completed);
  },

  isSubmitted() {
    return Boolean(this.data.submitted);
  },

  /* =======================================================
     ACTUALIZACIÓN GENERAL
  ======================================================= */

  set(path, value, options = {}) {
    if (!path || typeof path !== "string") {
      return false;
    }

    const keys = path.split(".");
    const lastKey = keys.pop();

    let target = this.data;

    keys.forEach(key => {
      if (
        !target[key] ||
        typeof target[key] !== "object" ||
        Array.isArray(target[key])
      ) {
        target[key] = {};
      }

      target = target[key];
    });

    target[lastKey] = this.clone(value);

    this.touch();

    if (options.save !== false) {
      this.scheduleSave();
    }

    if (options.emit !== false) {
      this.emit("state:change", {
        path,
        value: this.clone(value)
      });
    }

    return true;
  },

  patch(partialState, options = {}) {
    if (
      !partialState ||
      typeof partialState !== "object" ||
      Array.isArray(partialState)
    ) {
      return false;
    }

    this.data = this.deepMerge(
      this.data,
      partialState
    );

    this.touch();

    if (options.save !== false) {
      this.scheduleSave();
    }

    if (options.emit !== false) {
      this.emit("state:patch", {
        changes: this.clone(partialState)
      });
    }

    return true;
  },

  /* =======================================================
     AUDIENCIA Y CATEGORÍA
  ======================================================= */

  setAudience(audienceId) {
    const previousAudience =
      this.data.audience;

    this.data.audience =
      audienceId || null;

    if (
      previousAudience &&
      previousAudience !== audienceId
    ) {
      this.data.category = null;
      this.data.answers = {};
      this.data.currentStep = 0;
      this.data.currentQuestionId = null;
      this.data.completed = false;
    }

    this.data.status =
      window.FalcoAdmisionConfig
        ?.admissionStatus
        ?.inProgress
        ?.id || "en_proceso";

    this.touch();
    this.scheduleSave();

    this.emit("audience:change", {
      previous: previousAudience,
      current: this.data.audience
    });

    return this.data.audience;
  },

  setCategory(categoryId) {
    const previousCategory =
      this.data.category;

    this.data.category =
      categoryId || null;

    if (
      previousCategory &&
      previousCategory !== categoryId
    ) {
      this.data.answers = {};
      this.data.currentStep = 0;
      this.data.currentQuestionId = null;
      this.data.completed = false;
    }

    this.touch();
    this.scheduleSave();

    this.emit("category:change", {
      previous: previousCategory,
      current: this.data.category
    });

    return this.data.category;
  },

  /* =======================================================
     RESPUESTAS
  ======================================================= */

  setAnswer(questionId, value, metadata = {}) {
    if (!questionId) {
      return false;
    }

    this.data.answers[questionId] = {
      value: this.clone(value),

      answeredAt:
        new Date().toISOString(),

      type:
        metadata.type || null,

      label:
        metadata.label || null
    };

    this.touch();
    this.scheduleSave();

    this.emit("answer:set", {
      questionId,
      answer:
        this.clone(
          this.data.answers[questionId]
        )
    });

    return true;
  },

  updateAnswer(questionId, value) {
    if (!this.hasAnswer(questionId)) {
      return this.setAnswer(
        questionId,
        value
      );
    }

    this.data.answers[questionId].value =
      this.clone(value);

    this.data.answers[questionId].answeredAt =
      new Date().toISOString();

    this.touch();
    this.scheduleSave();

    this.emit("answer:update", {
      questionId,
      answer:
        this.clone(
          this.data.answers[questionId]
        )
    });

    return true;
  },

  removeAnswer(questionId) {
    if (!this.hasAnswer(questionId)) {
      return false;
    }

    delete this.data.answers[questionId];

    this.touch();
    this.scheduleSave();

    this.emit("answer:remove", {
      questionId
    });

    return true;
  },

  clearAnswers() {
    this.data.answers = {};

    this.touch();
    this.scheduleSave();

    this.emit("answers:cleared");

    return true;
  },

  /* =======================================================
     PROGRESO
  ======================================================= */

  setProgress(currentStep, totalSteps) {
    this.data.currentStep =
      Math.max(
        0,
        Number(currentStep) || 0
      );

    this.data.totalSteps =
      Math.max(
        0,
        Number(totalSteps) || 0
      );

    if (
      this.data.totalSteps > 0 &&
      this.data.currentStep >
        this.data.totalSteps
    ) {
      this.data.currentStep =
        this.data.totalSteps;
    }

    this.touch();
    this.scheduleSave();

    const progress =
      this.getProgress();

    this.emit(
      "progress:change",
      progress
    );

    return progress;
  },

  setCurrentQuestion(questionId) {
    this.data.currentQuestionId =
      questionId || null;

    this.touch();
    this.scheduleSave();

    this.emit("question:change", {
      questionId:
        this.data.currentQuestionId
    });

    return this.data.currentQuestionId;
  },

  nextStep() {
    const next =
      this.data.currentStep + 1;

    return this.setProgress(
      next,
      this.data.totalSteps
    );
  },

  previousStep() {
    const previous =
      Math.max(
        0,
        this.data.currentStep - 1
      );

    return this.setProgress(
      previous,
      this.data.totalSteps
    );
  },

  /* =======================================================
     DOCUMENTOS
  ======================================================= */

  addDocument(documentData) {
    if (
      !documentData ||
      typeof documentData !== "object"
    ) {
      return false;
    }

    const document = {
      id:
        documentData.id ||
        `DOC-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase()}`,

      name:
        documentData.name || "Documento",

      size:
        documentData.size || 0,

      type:
        documentData.type || null,

      status:
        documentData.status || "pendiente",

      localReference:
        documentData.localReference || null,

      remoteUrl:
        documentData.remoteUrl || null,

      addedAt:
        new Date().toISOString()
    };

    this.data.documents.push(document);

    this.touch();
    this.scheduleSave();

    this.emit("document:add", {
      document: this.clone(document)
    });

    return this.clone(document);
  },

  updateDocument(documentId, changes) {
    const index =
      this.data.documents.findIndex(
        document =>
          document.id === documentId
      );

    if (index === -1) {
      return false;
    }

    this.data.documents[index] = {
      ...this.data.documents[index],
      ...this.clone(changes)
    };

    this.touch();
    this.scheduleSave();

    this.emit("document:update", {
      document:
        this.clone(
          this.data.documents[index]
        )
    });

    return this.clone(
      this.data.documents[index]
    );
  },

  removeDocument(documentId) {
    const previousLength =
      this.data.documents.length;

    this.data.documents =
      this.data.documents.filter(
        document =>
          document.id !== documentId
      );

    if (
      previousLength ===
      this.data.documents.length
    ) {
      return false;
    }

    this.touch();
    this.scheduleSave();

    this.emit("document:remove", {
      documentId
    });

    return true;
  },

  clearDocuments() {
    this.data.documents = [];

    this.touch();
    this.scheduleSave();

    this.emit("documents:cleared");

    return true;
  },

  /* =======================================================
     FINALIZACIÓN
  ======================================================= */

  markCompleted() {
    this.data.completed = true;

    this.data.status =
      window.FalcoAdmisionConfig
        ?.admissionStatus
        ?.completed
        ?.id || "completada";

    if (this.data.totalSteps > 0) {
      this.data.currentStep =
        this.data.totalSteps;
    }

    this.touch();
    this.saveNow();

    this.emit("admission:completed", {
      sessionId: this.data.sessionId
    });

    return true;
  },

  markSubmitted(reference = null) {
    this.data.submitted = true;
    this.data.completed = true;

    this.data.status =
      window.FalcoAdmisionConfig
        ?.admissionStatus
        ?.submitted
        ?.id || "enviada";

    this.data.submission = {
      reference,
      submittedAt:
        new Date().toISOString()
    };

    this.touch();
    this.saveNow();

    this.emit("admission:submitted", {
      sessionId: this.data.sessionId,
      reference
    });

    return true;
  },

  /* =======================================================
     PERSISTENCIA
  ======================================================= */

  scheduleSave() {
    const autoSave =
      window.FalcoAdmisionConfig
        ?.interview
        ?.autoSave !== false;

    if (!autoSave) {
      return;
    }

    const delay =
      window.FalcoAdmisionConfig
        ?.interview
        ?.autoSaveDelay || 500;

    clearTimeout(this.saveTimer);

    this.saveTimer =
      setTimeout(
        () => this.saveNow(),
        delay
      );
  },

  saveNow() {
    clearTimeout(this.saveTimer);

    const key =
      this.getStorageKey();

    try {
      localStorage.setItem(
        key,
        JSON.stringify(this.data)
      );

      this.emit("state:saved", {
        sessionId: this.data.sessionId,
        savedAt:
          new Date().toISOString()
      });

      return true;

    } catch (error) {
      this.log(
        "No fue posible guardar el estado",
        error
      );

      this.emit("state:save-error", {
        error
      });

      return false;
    }
  },

  restore() {
    const key =
      this.getStorageKey();

    try {
      const raw =
        localStorage.getItem(key);

      if (!raw) {
        return false;
      }

      const parsed =
        JSON.parse(raw);

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !parsed.sessionId
      ) {
        return false;
      }

      this.data =
        this.deepMerge(
          this.data,
          parsed
        );

      this.emit("state:restored", {
        sessionId:
          this.data.sessionId
      });

      return true;

    } catch (error) {
      this.log(
        "No fue posible restaurar el estado",
        error
      );

      this.clearStorage();

      return false;
    }
  },

  clearStorage() {
    try {
      localStorage.removeItem(
        this.getStorageKey()
      );

      return true;

    } catch (error) {
      this.log(
        "No fue posible limpiar el almacenamiento",
        error
      );

      return false;
    }
  },

  reset() {
    const previousSessionId =
      this.data.sessionId;

    this.clearStorage();
    this.createSession();

    this.emit("state:reset", {
      previousSessionId,
      newSessionId:
        this.data.sessionId
    });

    return this.getState();
  },

  /* =======================================================
     METADATOS
  ======================================================= */

  updateMetadata() {
    this.data.metadata = {
      ...this.data.metadata,

      version:
        window.FalcoAdmisionConfig
          ?.identity
          ?.version ||
        this.data.metadata.version,

      language:
        window.FalcoAdmisionConfig
          ?.environment
          ?.language ||
        navigator.language ||
        "es-AR",

      userAgent:
        navigator.userAgent || null,

      screen: {
        width:
          window.screen?.width || null,

        height:
          window.screen?.height || null
      },

      viewport: {
        width:
          window.innerWidth || null,

        height:
          window.innerHeight || null
      }
    };

    this.touch();
  },

  touch() {
    this.data.updatedAt =
      new Date().toISOString();
  },

  /* =======================================================
     EVENTOS
  ======================================================= */

  subscribe(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }

    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  },

  emit(eventName, detail = {}) {
    const payload = {
      event: eventName,
      detail: this.clone(detail),
      state: this.getState()
    };

    this.listeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        this.log(
          "Error en listener de estado",
          error
        );
      }
    });

    window.dispatchEvent(
      new CustomEvent(
        `falco-admision:${eventName}`,
        {
          detail: payload
        }
      )
    );
  },

  /* =======================================================
     UTILIDADES
  ======================================================= */

  getStorageKey() {
    return (
      window.FalcoAdmisionConfig
        ?.storage
        ?.state ||
      "falco_admision_state"
    );
  },

  clone(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return value;
    }

    try {
      return structuredClone(value);

    } catch {
      return JSON.parse(
        JSON.stringify(value)
      );
    }
  },

  deepMerge(target, source) {
    const output = {
      ...target
    };

    Object.keys(source || {}).forEach(key => {
      const sourceValue =
        source[key];

      const targetValue =
        output[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        output[key] =
          this.deepMerge(
            targetValue &&
            typeof targetValue === "object" &&
            !Array.isArray(targetValue)
              ? targetValue
              : {},
            sourceValue
          );

        return;
      }

      output[key] =
        this.clone(sourceValue);
    });

    return output;
  },

  log(message, data = null) {
    if (
      window.FalcoAdmisionConfig
        ?.log
    ) {
      window.FalcoAdmisionConfig.log(
        message,
        data
      );

      return;
    }

    if (data !== null) {
      console.log(
        `[FALCO Admisión™ State] ${message}`,
        data
      );

      return;
    }

    console.log(
      `[FALCO Admisión™ State] ${message}`
    );
  }
};

/* =========================================================
   EXPORTACIÓN GLOBAL
========================================================= */

window.FalcoAdmisionState =
  FalcoAdmisionState;

console.log(
  "FALCO Admisión™ State System v0.1 Ready"
);