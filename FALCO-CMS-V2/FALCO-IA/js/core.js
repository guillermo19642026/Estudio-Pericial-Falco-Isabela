/* =========================
   FALCO CORE®
   Coordinador principal del Sistema FALCO IA®
========================= */

const FalcoCore = {
  version: "1.0.0",

  modules: {},

  register(name, module) {
    if (!name || !module) {
      console.warn("FalcoCore: módulo inválido", name);
      return;
    }

    this.modules[name] = module;
  },

  init() {
    console.log("FALCO Core® iniciado - versión", this.version);
  },

  start() {
    console.log("FALCO IA® en ejecución");
  }
};