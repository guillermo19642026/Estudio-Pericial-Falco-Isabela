/* =========================================================
   AION Knowledge Search™ v1.0
   Busca conocimiento por intención y palabras clave
========================================================= */

class KnowledgeSearch {
  constructor() {
    this.knowledge = null;
  }

  setKnowledge(knowledge) {
    this.knowledge = knowledge || {};
  }

  search(query = "") {
    const text = this.normalize(query);

    if (!text) {
      return this.getDefault();
    }

    const suggestions = this.knowledge?.suggestions || [];
    let bestMatch = null;
    let bestScore = 0;

    suggestions.forEach((item) => {
      const searchableText = this.normalize(
        [
          item.label,
          item.response,
          item.action,
          item.url
        ].join(" ")
      );

      const score = this.score(text, searchableText);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && bestScore > 0) {
      return bestMatch;
    }

    return this.getDefault();
  }

  score(query, target) {
    const words = query
      .split(" ")
      .filter((word) => word.length > 2);

    let score = 0;

    words.forEach((word) => {
      if (target.includes(word)) {
        score++;
      }
    });

    return score;
  }

  getDefault() {
    return {
      label: "Orientación general",
      response:
        this.knowledge?.greeting ||
        "Puedo orientarte dentro del Sistema FALCO® según lo que necesites.",
      action: "Ver accesos rápidos",
      url: "#accesos-rapidos"
    };
  }

  normalize(value = "") {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
}

window.KnowledgeSearch = KnowledgeSearch;