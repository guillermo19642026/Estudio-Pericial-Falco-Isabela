/* =========================================================
   AION Response Planner™ v1.0
   Planificación de estrategia de respuesta
========================================================= */

const AIONResponsePlanner = {

  version: "1.0",

  state: {
    initialized: false,
    plansGenerated: 0,
    lastPlan: null,
    lastError: null
  },

  /* =====================================================
     INICIALIZACIÓN
  ===================================================== */

  init() {

    this.state.initialized = true;

    console.log(
      "AION Response Planner™ v1.0 Ready"
    );
  },

/* =====================================================
   PLANIFICACIÓN
===================================================== */

plan(context = {}) {

  try {

    const strategy =
      this.chooseStrategy(context);

    const confidence =
      this.calculateConfidence(
        context,
        strategy
      );

    const responsePlan =
      this.buildPlan(
        context,
        strategy,
        confidence
      );

    this.state.lastPlan =
      responsePlan;

    this.state.lastError =
      null;

    this.state.plansGenerated += 1;

    return {
      success: true,
      plan: responsePlan
    };

  } catch (error) {

    this.state.lastError = {
      type: "planning_error",
      message: error.message
    };

    return {
      success: false,
      error: error.message
    };
  }
},

  /* =====================================================
     ESTRATEGIA
  ===================================================== */

 chooseStrategy(context = {}) {

  const dependent =
    context.dependent === true;

  const inherited =
    context.inherited === true;

  const topic =
    context.topic || "general";

  if (
    dependent &&
    inherited &&
    topic !== "general"
  ) {

    return "continue_topic";
  }

  if (
    !dependent &&
    topic !== "general"
  ) {

    return "direct_topic";
  }

  return "default";
},

  /* =====================================================
     CONFIANZA
  ===================================================== */

calculateConfidence(
  context = {},
  strategy = "default"
) {

  if (
    strategy === "continue_topic" &&
    context.dependent === true &&
    context.inherited === true
  ) {

    return 0.98;
  }

  if (
    strategy === "direct_topic" &&
    context.topic &&
    context.topic !== "general"
  ) {

    return 0.95;
  }

  return 0.60;
},

  /* =====================================================
     CONSTRUCCIÓN DEL PLAN
  ===================================================== */

buildPlan(
  context = {},
  strategy = "default",
  confidence = 1
) {

  return {
    context,
    strategy,
    confidence
  };
},

  /* =====================================================
     ESTADO
  ===================================================== */

  getState() {

    return structuredClone(this.state);
  },

  /* =====================================================
     RESET
  ===================================================== */

  reset() {

    this.state.plansGenerated = 0;
    this.state.lastPlan = null;
    this.state.lastError = null;
  }

};

window.AIONResponsePlanner =
  AIONResponsePlanner;

AIONResponsePlanner.init();