/* =========================================================
   AION BRIDGE™ v6.4
   Sistema FALCO®
   Bridge real para Sala del Corpus
========================================================= */

(function () {
  class AionBridge {
    constructor(engine) {
      this.engine = engine;
      this.lastTitle = "";
      this.lastAt = 0;
    }

    init() {
      this.bindCorpusRoom();
      this.bindCorpusCards();
      this.observeCorpusDetail();
    }

    bindCorpusRoom() {
      const enterBtn = document.getElementById("enterCorpusRoom");
      const closeBtn = document.getElementById("closeCorpusRoom");

      if (enterBtn) {
        enterBtn.addEventListener("click", () => {
          this.engine.action("system-ready", {
            title: "Corpus FALCO®",
            message: "Sala del Corpus FALCO® activa.",
            state: "violet"
          });
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.engine.run("reset");
        });
      }
    }

    bindCorpusCards() {
      document.addEventListener("click", (event) => {
        const card = event.target.closest(
          ".corpus-node, .corpus-node-card, .corpus-card, .corpus-resource, .corpus-list-item, [data-corpus-node], [data-node-id], [data-resource-id]"
        );

        if (!card) return;

        const title = this.getCardTitle(card);

        if (this.isDuplicate(title)) return;

        this.lastTitle = title;
        this.lastAt = Date.now();

        this.engine.action("open-document", {
          title
        });
      });
    }

    getCardTitle(card) {
      return (
        card.dataset.title ||
        card.dataset.corpusTitle ||
        card.dataset.name ||
        card.querySelector("h1")?.textContent?.trim() ||
        card.querySelector("h2")?.textContent?.trim() ||
        card.querySelector("h3")?.textContent?.trim() ||
        card.querySelector("strong")?.textContent?.trim() ||
        card.querySelector(".corpus-title")?.textContent?.trim() ||
        card.textContent.trim().slice(0, 80) ||
        "Unidad del Corpus FALCO®"
      );
    }

    isDuplicate(title) {
      return this.lastTitle === title && Date.now() - this.lastAt < 1000;
    }

    observeCorpusDetail() {
      const detail = document.getElementById("corpusDetail");

      if (!detail || !window.MutationObserver) return;

      const observer = new MutationObserver(() => {
        const title =
          detail.querySelector("h1")?.textContent?.trim() ||
          detail.querySelector("h2")?.textContent?.trim() ||
          detail.querySelector("h3")?.textContent?.trim() ||
          detail.querySelector("strong")?.textContent?.trim();

        if (!title) return;
        if (this.isDuplicate(title)) return;

        this.lastTitle = title;
        this.lastAt = Date.now();

        this.engine.action("open-document", {
          title
        });
      });

      observer.observe(detail, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  window.AionBridge = AionBridge;
})();