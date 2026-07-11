/* =========================================================
   AION Knowledge Engine™ v2.3
   Base contextual mediante AION Router™
========================================================= */

window.KnowledgeEngine = class KnowledgeEngine {
  constructor() {
    this.cache = {};

    this.router = window.AIONRouter
      ? new window.AIONRouter()
      : null;
  }

  getSlug() {
    if (!this.router) {
      console.warn(
        "AION Router™ no está disponible."
      );

      return "general";
    }

    const context =
      this.router.getContext();

    return context?.knowledge || "general";
  }

  async getCurrentPageKnowledge() {
    const slug = this.getSlug();

    if (this.cache[slug]) {
      return this.cache[slug];
    }

    try {
      const response = await fetch(
        `/FALCO-CMS-V2/FALCO-IA/AION-LAB/knowledge/${slug}.json`
      );

      if (!response.ok) {
        console.warn(
          `No se pudo cargar ${slug}.json. Estado: ${response.status}`
        );

        return this.getFallback(slug);
      }

      const data =
        await response.json();

      this.cache[slug] = data;

      return data;

    } catch (error) {
      console.warn(
        `AION Knowledge™ fallback para ${slug}:`,
        error
      );

      return this.getFallback(slug);
    }
  }

  getFallback(slug = "general") {
    return {
      slug,
      title: "Sistema FALCO®",
      greeting:
        "Estoy disponible para orientarte.",
      description: "",
      suggestions: [],
      answers: {},
      related: []
    };
  }
};