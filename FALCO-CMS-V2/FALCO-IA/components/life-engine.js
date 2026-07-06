/* =========================
   FALCO LIFE ENGINE®
========================= */

const FalcoLifeEngine = {

    init() {

        const knowledgeNodes = document.querySelectorAll(".ia-knowledge-cloud span");

        const modules = document.querySelectorAll(".ia-orbit span");

        const titles = document.querySelectorAll(
            ".ia-title-block h1, .ia-system-map h2, .ia-final h2"
        );

        const finalButton = document.querySelector(".ia-enter-btn");

        knowledgeNodes.forEach((node, index) => {
            node.classList.add("life-breath");
            node.style.animationDelay = `${index * 0.18}s`;
        });

        modules.forEach((module, index) => {
            module.classList.add("life-breath");
            module.style.animationDelay = `${index * 0.25}s`;
        });

        titles.forEach((title) => {
            title.classList.add("life-glow");
        });

        if (finalButton) {
            finalButton.classList.add("life-float");
        }
    }

};