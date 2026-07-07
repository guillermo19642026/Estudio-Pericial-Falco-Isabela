/* =========================================================
   AION OBSERVER™ v4.0
   Sistema FALCO®
   Observación contextual del ecosistema
========================================================= */

(function () {
  class AionObserver {
    constructor(engine) {
      this.engine = engine;
      this.observer = null;

      this.lastSignature = "";
      this.lastObservedAt = 0;
      this.cooldown = 1800;
    }

    init() {
      this.observeBody();
      this.observeInitialContext();
    }

    observeInitialContext() {
      const context = this.engine.currentContext || "default";

      if (context === "corpus") {
        this.engine.pulse({
          wave: true,
          state: "violet",
          behavior: "guiding"
        });
      }
    }

    observeBody() {
      if (!window.MutationObserver || !document.body) return;

      this.observer = new MutationObserver((mutations) => {
        const relevant = this.filterRelevantMutations(mutations);

        if (!relevant) return;

        const signature = this.createSignature();

        if (this.isDuplicate(signature)) return;

        this.lastSignature = signature;
        this.lastObservedAt = Date.now();

        this.reactToPageChange();
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "data-state", "data-status", "aria-expanded"]
      });
    }

    filterRelevantMutations(mutations = []) {
      return mutations.some((mutation) => {
        const target = mutation.target;

        if (!target || target.closest?.(".aion-engine")) {
          return false;
        }

        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          return true;
        }

        if (mutation.type === "attributes") {
          return true;
        }

        return false;
      });
    }

    createSignature() {
      const corpusRoom = document.getElementById("iaCorpusRoom");
      const awakening = document.getElementById("corpusAwakening");
      const detail = document.getElementById("corpusDetail");
      const list = document.getElementById("corpusNodeList");

      return JSON.stringify({
        corpusRoom: corpusRoom?.className || "",
        awakening: awakening?.className || "",
        detail: detail?.textContent?.trim()?.slice(0, 80) || "",
        listCount: list?.children?.length || 0
      });
    }

    isDuplicate(signature) {
      const now = Date.now();

      return (
        signature === this.lastSignature &&
        now - this.lastObservedAt < this.cooldown
      );
    }

    reactToPageChange() {
      const corpusRoom = document.getElementById("iaCorpusRoom");
      const detail = document.getElementById("corpusDetail");

      if (corpusRoom && corpusRoom.classList.contains("active")) {
        this.engine.pulse({
          wave: true,
          state: "violet",
          behavior: "guiding"
        });

        return;
      }

      if (detail && detail.textContent.trim().length > 120) {
        this.engine.pulse({
          wave: false,
          state: "gold",
          behavior: "guiding"
        });

        return;
      }

      this.engine.pulse({
        wave: false,
        behavior: "guiding"
      });
    }

    disconnect() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  window.AionObserver = AionObserver;
})();