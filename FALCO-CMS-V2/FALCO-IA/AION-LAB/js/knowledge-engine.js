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

  const load = async (name) => {

    try {

      const response = await fetch(
        `/FALCO-CMS-V2/FALCO-IA/AION-LAB/knowledge/${name}.json`
      );

      if (!response.ok) {
        return {};
      }

      return await response.json();

    } catch (error) {

      console.warn(
        `No se pudo cargar ${name}.json.`,
        error
      );

      return {};

    }

  };

  const general = await load("general");
  const faq = await load("faq");
  const page = await load(slug);



const data = {

  ...general,

  ...page,

  faq: [
    ...(general.faq || []),
    ...(faq.faq || []),
    ...(page.faq || [])
  ],

  answers: {
    ...(general.answers || {}),
    ...(page.answers || {})
  }

};


  this.cache[slug] = data;

  return data;

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