/* =========================================================
   AION Conversation Engine™ v1.5
   Conversación guiada desde Knowledge Engine + Corpus Engine
   + Respaldo contextual mediante AION Router™
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

    this.responseEngine = window.ResponseEngine
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
    /*
     * Primero conserva el funcionamiento actual:
     * intenta cargar mediante Knowledge Engine.
     */

    if (this.knowledge) {
      try {
        this.data =
          await this.knowledge.getCurrentPageKnowledge();
      } catch (error) {
        console.warn(
          "AION Conversation™: Knowledge Engine no pudo cargar.",
          error
        );
      }
    }

    /*
     * Respaldo seguro:
     * consulta el contexto real del Router.
     */

    const context = window.AIONRouter
      ? new AIONRouter().getContext()
      : null;

    const expectedSlug =
      context?.knowledge || "general";

    const loadedSlug =
      this.data?.slug || "general";

    /*
     * Solo interviene cuando:
     *
     * 1. El Router detectó una página específica.
     * 2. Knowledge Engine devolvió general o no devolvió datos.
     *
     * Las páginas que ya funcionan no se modifican.
     */

    if (
      expectedSlug !== "general" &&
      (
        !this.data ||
        loadedSlug === "general" ||
        loadedSlug !== expectedSlug
      )
    ) {
      const contextualData =
        await this.loadContextualKnowledge(expectedSlug);

      if (contextualData) {
        this.data = contextualData;
      }
    }

    /*
     * Respaldo final para evitar una tarjeta vacía.
     */

    if (!this.data) {
      this.data = {
        slug: expectedSlug,
        title:
          context?.title ||
          "Sistema FALCO®",
        greeting:
          context?.greeting ||
          "Estoy disponible para orientarte.",
        description: "",
        suggestions: [],
        answers: {}
      };
    }

    console.log(
      "AION Conversation™ Context:",
      {
        expected: expectedSlug,
        loaded: this.data?.slug
      }
    );

    this.renderHome();
  },

  async loadContextualKnowledge(slug) {
    try {
      const response = await fetch(
        `FALCO-CMS-V2/FALCO-IA/AION-LAB/knowledge/${slug}.json`
      );

      if (!response.ok) {
        console.warn(
          `AION Conversation™: no se encontró ${slug}.json. Estado ${response.status}.`
        );

        return null;
      }

      return await response.json();

    } catch (error) {
      console.warn(
        `AION Conversation™: no se pudo cargar ${slug}.json.`,
        error
      );

      return null;
    }
  },

  createCard() {
    this.card = document.createElement("div");
    this.card.className = "aion-conversation-card";

    this.card.innerHTML = `
      <button
        class="aion-conversation-close"
        type="button"
        aria-label="Cerrar conversación"
      >
        ×
      </button>

      <div class="aion-conversation-kicker">
        AION
      </div>

      <h3>AION</h3>

      <p>
        ¿En qué puedo ayudarte?
      </p>

      <div class="aion-conversation-options"></div>
    `;

    this.container.appendChild(this.card);

    const closeBtn =
      this.card.querySelector(
        ".aion-conversation-close"
      );

    if (closeBtn) {
      closeBtn.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.hide();
        }
      );
    }
  },

  renderHome() {
    if (!this.card) return;

    const title =
      this.data?.title ||
      "Sistema FALCO®";

    const greeting =
      this.data?.greeting ||
      "Estoy disponible para orientarte.";

    const suggestions =
      Array.isArray(this.data?.suggestions)
        ? this.data.suggestions
        : [];

    const titleEl =
      this.card.querySelector("h3");

    const textEl =
      this.card.querySelector("p");

    const optionsEl =
      this.card.querySelector(
        ".aion-conversation-options"
      );

    if (titleEl) {
      titleEl.textContent = title;
    }

    if (textEl) {
      textEl.textContent = greeting;
    }

    if (!optionsEl) return;

    optionsEl.innerHTML = "";

    suggestions.forEach((item) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.textContent =
        typeof item === "string"
          ? item
          : (
              item.label ||
              item.title ||
              "Consultar"
            );

      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.respond(item);
        }
      );

      optionsEl.appendChild(button);
    });
  },

  async respond(item) {
    if (!this.card) return;

    const titleEl =
      this.card.querySelector("h3");

    const textEl =
      this.card.querySelector("p");

    const optionsEl =
      this.card.querySelector(
        ".aion-conversation-options"
      );

    const isObject =
      typeof item === "object" &&
      item !== null;

    const question = isObject
      ? (
          item.label ||
          item.title ||
          "Orientación"
        )
      : item;

    if (titleEl) {
      titleEl.textContent = question;
    }

    if (window.AionFloat) {
      AionFloat.setState("thinking");
    }

    let finalText = "";

    if (isObject) {
      finalText =
        item.response ||
        this.data?.answers?.[question] ||
        "Puedo orientarte sobre este punto dentro del Sistema FALCO®.";

    } else {
      finalText =
        this.data?.answers?.[question];

      if (!finalText && this.corpus) {
        if (textEl) {
          textEl.textContent =
            "Consultando el Corpus FALCO®...";
        }

        try {
          const response =
            await this.corpus.answer(question);

          const view =
            this.responseEngine
              ? this.responseEngine.format(response)
              : response;

          finalText =
            view?.text ||
            response?.answer ||
            "Puedo orientarte sobre este punto desde el enfoque técnico del Sistema FALCO®.";

        } catch (error) {
          console.warn(
            "AION Conversation™: error al consultar el Corpus.",
            error
          );
        }
      }

      if (!finalText) {
        finalText =
          "Puedo orientarte sobre este punto dentro del Sistema FALCO®.";
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 350);
    });

    if (textEl) {
      textEl.textContent = finalText;
    }

    if (optionsEl) {
      optionsEl.innerHTML = "";

      if (isObject && item.url) {
        const actionBtn =
          document.createElement("button");

        actionBtn.type = "button";

        actionBtn.textContent =
          item.action ||
          "Ver información";

        actionBtn.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (item.url.startsWith("http")) {
              window.open(
                item.url,
                "_blank",
                "noopener,noreferrer"
              );
            } else {
              window.location.href =
                item.url;
            }
          }
        );

        optionsEl.appendChild(actionBtn);
      }

      if (isObject && item.whatsapp) {
        const whatsappBtn =
          document.createElement("button");

        whatsappBtn.type = "button";

        whatsappBtn.textContent =
          item.whatsappLabel ||
          "Consultar por WhatsApp";

        whatsappBtn.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopPropagation();

            window.open(
              item.whatsapp,
              "_blank",
              "noopener,noreferrer"
            );
          }
        );

        optionsEl.appendChild(
          whatsappBtn
        );
      }

      const backBtn =
        document.createElement("button");

      backBtn.type = "button";
      backBtn.textContent = "Volver";

      backBtn.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.renderHome();
        }
      );

      optionsEl.appendChild(backBtn);
    }

    if (window.AionFloat) {
      AionFloat.setState("speaking");

      setTimeout(() => {
        AionFloat.setState("idle");
      }, 1800);
    }
  },

  bindOpen() {
    const being =
      this.container.querySelector(
        ".aion-float-being"
      );

    if (!being) return;

    being.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.show();
      }
    );
  },

  show() {
    if (!this.card) return;

    this.card.classList.add(
      "is-visible"
    );

    if (window.AionFloat) {
      AionFloat.setState("speaking");

      setTimeout(() => {
        AionFloat.setState("idle");
      }, 1800);
    }
  },

  hide() {
    if (!this.card) return;

    this.card.classList.remove(
      "is-visible"
    );
  }
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      setTimeout(
        () => AIONConversation.init(),
        700
      );
    }
  );
} else {
  setTimeout(
    () => AIONConversation.init(),
    700
  );
}