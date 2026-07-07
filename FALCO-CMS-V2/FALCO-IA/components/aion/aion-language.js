/* =========================================================
   AION LANGUAGE™ v6.0
   Sistema FALCO®
   Lenguaje contextual institucional
========================================================= */

(function () {
  class AionLanguage {
    constructor(engine) {
      this.engine = engine;
    }

    searchResult(payload = {}) {
      const query = payload.query || "la consulta realizada";
      const count = payload.count || payload.resultsCount || null;
      const area = payload.area || payload.context || null;

      if (count && area) {
        return `Encontré ${count} recursos relacionados con ${query} en el área de ${area}.`;
      }

      if (count) {
        return `Encontré ${count} recursos relacionados con ${query}.`;
      }

      return `Encontré recursos relacionados con ${query} para revisar.`;
    }

    documentOpened(payload = {}) {
      const title = payload.title || "el documento seleccionado";
      return `Documento abierto: ${title}.`;
    }

    warning(payload = {}) {
      return payload.message || "Hay información contextual relevante.";
    }
  }

  window.AionLanguage = AionLanguage;
})();