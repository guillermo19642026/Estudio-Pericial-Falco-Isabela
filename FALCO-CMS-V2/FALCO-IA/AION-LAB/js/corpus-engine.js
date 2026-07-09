/* =========================================================
   Corpus Engine™ v1.1
   Respuestas desde Knowledge / Corpus FALCO®
========================================================= */

class CorpusEngine {

  constructor() {
    this.knowledge = null;
  }

  async init() {
    if (window.KnowledgeEngine) {
      this.knowledge = new KnowledgeEngine();
    }
  }

  async answer(question) {
    const page = this.knowledge
      ? await this.knowledge.getCurrentPageKnowledge()
      : null;

    const answer =
      page?.answers?.[question] ||
      "Puedo orientarte sobre este punto desde el enfoque técnico del Sistema FALCO®.";

    return {
      question,
      page,
      answer,
      source: page?.title || "Sistema FALCO®"
    };
  }
}

window.CorpusEngine = CorpusEngine;