/* =========================================================
   AION Knowledge Engine™ v1.0
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

    return "general";
  }

  async getCurrentPageKnowledge() {
    const slug = this.detectSlug();

    if (this.cache[slug]) {
      return this.cache[slug];
    }

    try {
      const response = await fetch(
        `FALCO-CMS-V2/FALCO-IA/AION-LAB/knowledge/${slug}.json`
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
      greeting: "Estoy disponible si necesitás orientación.",
      description: "",
      suggestions: [],
      related: []
    };
  }
}

window.KnowledgeEngine = KnowledgeEngine;