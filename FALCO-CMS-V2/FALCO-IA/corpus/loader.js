/* =========================
   FALCO CORPUS LOADER™
========================= */

window.FalcoCorpusLoader = {
  data: null,

  async load(path = "data/corpus-demo.json") {
    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error("No se pudo cargar el Corpus FALCO®");
      }

      this.data = await response.json();

      console.log("Corpus FALCO® cargado:", this.data);

      return this.data;

    } catch (error) {
      console.error("Error en FalcoCorpusLoader:", error);

      return {
        corpus: "Corpus FALCO®",
        version: "fallback",
        estado: "emergencia",
        nodos: []
      };
    }
  },

  getNodes() {
    if (!this.data || !this.data.nodos) {
      return [];
    }

    return this.data.nodos;
  }
};