/* =========================================================
   AION Knowledge Engine™ v1.1
   Base de conocimiento contextual
========================================================= */

class KnowledgeEngine {
  constructor() {
    this.cache = {};
  }

  detectSlug() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("pericia-psicologica")) {
      return "pericia-psicologica";
    }

    if (path.includes("danio-psiquico") || path.includes("daño-psiquico")) {
      return "danio-psiquico";
    }

    if (path.includes("informe-pericial")) {
      return "informe-pericial";
    }

    if (path.includes("perito-psicologa-de-parte") || path.includes("perito-de-parte")) {
      return "perito-de-parte";
    }

    if (path.includes("impugnacion") || path.includes("impugnaciones")) {
      return "impugnaciones";
    }

    if (path.includes("honorarios") || path.includes("cuanto-cuesta")) {
      return "honorarios";
    }

    return "general";
  }

  async getCurrentPageKnowledge() {
    const slug = this.detectSlug();

    if (this.cache[slug]) {
      return this.cache[slug];
    }

    try {
      const response = await fetch(
        `/FALCO-CMS-V2/FALCO-IA/AION-LAB/knowledge/${slug}.json`
      );

      if (!response.ok) {
        return this.getFallback(slug);
      }

      const data = await response.json();
      this.cache[slug] = data;
      return data;

    } catch (error) {
      console.warn("AION Knowledge fallback:", error);
      return this.getFallback(slug);
    }
  }

  getFallback(slug = "general") {
    return {
      slug,
      title: "Sistema FALCO®",
      greeting: "Hola. Soy AION. Puedo ayudarte a orientarte dentro del Sistema FALCO®.",
      description: "",
      suggestions: [
        "¿Qué es una pericia psicológica?",
        "¿Qué es el daño psíquico?",
        "¿Cómo solicito una consulta?"
      ],
      related: []
    };
  }
}

window.KnowledgeEngine = KnowledgeEngine;