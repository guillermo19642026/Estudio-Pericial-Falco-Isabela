/* =========================================================
   AION BRIDGE™ v3.5
   Sistema FALCO®
   Corpus bridge + detail watcher
========================================================= */

(function () {
  class AionBridge {
    constructor(engine) {
      this.engine = engine;
      this.lastNodeTitle = null;
      this.lastNodeAt = 0;
      this.lastDetailText = "";
      this.lastDetailAt = 0;
    }

    init() {
      this.bindCorpusRoom();
      this.bindCorpusNodes();
      this.bindSearchInputs();
      this.observeCorpusList();
      this.observeCorpusDetail();
    }

    bindCorpusRoom() {
      const enterBtn = document.getElementById("enterCorpusRoom");
      const closeBtn = document.getElementById("closeCorpusRoom");

      if (enterBtn) {
        enterBtn.addEventListener("click", () => {
          this.engine.run("corpus");
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.engine.run("reset");
        });
      }
    }

    bindCorpusNodes() {
      document.addEventListener("click", (event) => {
        const node = this.findCorpusNode(event.target);
        if (!node) return;

        const title = this.extractNodeTitle(node);

        if (this.isDuplicateNode(title)) return;

        this.lastNodeTitle = title;
        this.lastNodeAt = Date.now();

        this.engine.run("document", {
          title
        });
      });
    }

    isDuplicateNode(title) {
      const now = Date.now();

      return (
        this.lastNodeTitle === title &&
        now - this.lastNodeAt < 900
      );
    }

    findCorpusNode(target) {
      if (!target) return null;

      return target.closest(
        `
        .corpus-node,
        .corpus-node-card,
        .corpus-node-item,
        .corpus-card,
        .corpus-resource,
        .corpus-result,
        .corpus-list-item,
        [data-corpus-node],
        [data-node-id],
        [data-resource-id]
        `
      );
    }

    extractNodeTitle(node) {
      if (!node) return "Unidad del Corpus FALCO®";

      return (
        node.dataset.title ||
        node.dataset.corpusTitle ||
        node.dataset.name ||
        node.querySelector("[data-title]")?.dataset.title ||
        node.querySelector("h1")?.textContent?.trim() ||
        node.querySelector("h2")?.textContent?.trim() ||
        node.querySelector("h3")?.textContent?.trim() ||
        node.querySelector("strong")?.textContent?.trim() ||
        node.querySelector(".title")?.textContent?.trim() ||
        node.querySelector(".corpus-title")?.textContent?.trim() ||
        node.textContent.trim().slice(0, 80) ||
        "Unidad del Corpus FALCO®"
      );
    }

    bindSearchInputs() {
      const possibleSearchInputs = document.querySelectorAll(
        `
        input[type="search"],
        input[data-aion-search],
        input[id*="search"],
        input[class*="search"],
        input[id*="buscar"],
        input[class*="buscar"]
        `
      );

      possibleSearchInputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
          if (event.key !== "Enter") return;

          const query = input.value.trim();
          if (!query) return;

          this.engine.run("search", {
            query,
            delay: 1300
          });
        });
      });

      const possibleSearchButtons = document.querySelectorAll(
        `
        button[data-aion-search],
        button[id*="search"],
        button[class*="search"],
        button[id*="buscar"],
        button[class*="buscar"]
        `
      );

      possibleSearchButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const input =
            document.querySelector("input[data-aion-search]") ||
            document.querySelector('input[type="search"]') ||
            document.querySelector('input[id*="search"]') ||
            document.querySelector('input[id*="buscar"]');

          const query = input?.value?.trim() || "búsqueda institucional";

          this.engine.run("search", {
            query,
            delay: 1300
          });
        });
      });
    }

    observeCorpusList() {
      const list = document.getElementById("corpusNodeList");

      if (!list || !window.MutationObserver) return;

      const observer = new MutationObserver(() => {
        this.engine.pulse({
          wave: true,
          state: "violet",
          behavior: "guiding"
        });
      });

      observer.observe(list, {
        childList: true,
        subtree: true
      });
    }

    observeCorpusDetail() {
      const detail = document.getElementById("corpusDetail");

      if (!detail || !window.MutationObserver) return;

      const observer = new MutationObserver(() => {
        const title =
          detail.querySelector("h1")?.textContent?.trim() ||
          detail.querySelector("h2")?.textContent?.trim() ||
          detail.querySelector("h3")?.textContent?.trim() ||
          detail.querySelector("strong")?.textContent?.trim() ||
          detail.textContent.trim().slice(0, 80) ||
          "Detalle del Corpus FALCO®";

        if (this.isDuplicateDetail(title)) return;

        this.lastDetailText = title;
        this.lastDetailAt = Date.now();

        this.engine.emit("document:opened", {
          title
        });
      });

      observer.observe(detail, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    isDuplicateDetail(title) {
      const now = Date.now();

      return (
        this.lastDetailText === title &&
        now - this.lastDetailAt < 1200
      );
    }
  }

  window.AionBridge = AionBridge;
})();