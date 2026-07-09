/* =========================================================
   AION Conversation Engine™ v1.3
   Conversación guiada desde Corpus Engine
========================================================= */

const AIONConversation = {
  container: null,
  card: null,

  knowledge: null,
  corpus: null,
  data: null,
  responseEngine: null,

  init() {
    this.container = document.querySelector(".aion-float");
    if (!this.container) return;

    this.knowledge = window.KnowledgeEngine
      ? new KnowledgeEngine()
      : null;


this.responseEngine =
    window.ResponseEngine
        ? new ResponseEngine()
        : null;


    this.corpus = window.CorpusEngine
      ? new CorpusEngine()
      : null;

    if (this.corpus) {
      this.corpus.init();
    }

    this.createCard();
    this.bindOpen();
    this.loadKnowledge();
  },

  async loadKnowledge() {
    if (!this.knowledge) return;

    this.data = await this.knowledge.getCurrentPageKnowledge();
    this.renderHome();
  },

  createCard() {
    this.card = document.createElement("div");
    this.card.className = "aion-conversation-card";

    this.card.innerHTML = `
      <button class="aion-conversation-close" type="button">×</button>
      <div class="aion-conversation-kicker">AION</div>
      <h3>AION</h3>
      <p>¿En qué puedo ayudarte?</p>
      <div class="aion-conversation-options"></div>
    `;

    this.container.appendChild(this.card);

    const closeBtn = this.card.querySelector(".aion-conversation-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.hide();
      });
    }
  },

  renderHome() {
    if (!this.card) return;

    const title = this.data?.title || "Sistema FALCO®";
    const greeting = this.data?.greeting || "Estoy disponible para orientarte.";
    const suggestions = this.data?.suggestions || [];

    const titleEl = this.card.querySelector("h3");
    const textEl = this.card.querySelector("p");
    const optionsEl = this.card.querySelector(".aion-conversation-options");

    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = greeting;

    if (optionsEl) {
      optionsEl.innerHTML = "";

      suggestions.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item;

        button.addEventListener("click", (event) => {
          event.stopPropagation();
          this.respond(item);
        });

        optionsEl.appendChild(button);
      });
    }
  },

  async respond(question) {
    const titleEl = this.card.querySelector("h3");
    const textEl = this.card.querySelector("p");
    const optionsEl = this.card.querySelector(".aion-conversation-options");

    if (titleEl) titleEl.textContent = question;

    if (textEl) {
      textEl.textContent = "Consultando el Corpus FALCO®...";
    }

    if (window.AionFloat) {
      AionFloat.setState("thinking");
    }

    let response = null;

    if (this.corpus) {
      response = await this.corpus.answer(question);
    }

    await new Promise(resolve => setTimeout(resolve, 900));

    const view = this.responseEngine
  ? this.responseEngine.format(response)
  : response;

if (titleEl) {
  titleEl.textContent = question;
}

if (textEl) {
  textEl.textContent =
    view?.text ||
    response?.answer ||
    "Puedo orientarte sobre este punto desde el enfoque técnico del Sistema FALCO®.";
}

    if (optionsEl) {
      optionsEl.innerHTML = "";

      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.textContent = "Volver";
      backBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.renderHome();
      });

      optionsEl.appendChild(backBtn);
    }

    if (window.AionFloat) {
      AionFloat.setState("speaking");
      setTimeout(() => AionFloat.setState("idle"), 1800);
    }
  },

  bindOpen() {
    const being = this.container.querySelector(".aion-float-being");
    if (!being) return;

    being.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.show();
    });
  },

  show() {
    if (!this.card) return;

    this.card.classList.add("is-visible");

    if (window.AionFloat) {
      AionFloat.setState("speaking");
      setTimeout(() => AionFloat.setState("idle"), 1800);
    }
  },

  hide() {
    if (!this.card) return;
    this.card.classList.remove("is-visible");
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => AIONConversation.init(), 700);
  });
} else {
  setTimeout(() => AIONConversation.init(), 700);
}