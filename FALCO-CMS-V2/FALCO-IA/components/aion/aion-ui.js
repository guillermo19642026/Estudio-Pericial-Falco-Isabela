/* =========================
   AION UI ENGINE®
========================= */

const AionUI = {
  panel: null,
  typingTimer: null,

  init() {
    this.panel = document.createElement("div");
    this.panel.className = "aion-message-panel";

    this.panel.innerHTML = `
      <strong>AION</strong>
      <p id="aionMessageText"></p>
    `;

    document.body.appendChild(this.panel);
  },

  show(text = "¿En qué puedo ayudarlo?") {
    const message = document.getElementById("aionMessageText");

    if (!message) return;

    clearInterval(this.typingTimer);

    message.textContent = "";
    this.panel.classList.add("active");

    let index = 0;

    this.typingTimer = setInterval(() => {
      message.textContent += text.charAt(index);
      index++;

      if (index >= text.length) {
        clearInterval(this.typingTimer);
      }
    }, 38);
  },


context(page) {

    const messages = {

        home: "Bienvenido al Sistema FALCO®.",

        corpus: "Está ingresando al Corpus FALCO®. Aquí se organiza el conocimiento institucional.",

        biblioteca: "Bienvenido a la Biblioteca FALCO®. Puede explorar doctrina y recursos.",

        profesional: "Centro Profesional listo para trabajar.",

        experiencia: "Iniciando recorrido cinematográfico.",

        ia: "FALCO IA® está disponible para asistirlo."

    };

    this.show(messages[page] || "¿En qué puedo ayudarlo?");

},


  hide() {
    clearInterval(this.typingTimer);

    if (this.panel) {
      this.panel.classList.remove("active");
    }
  }
};