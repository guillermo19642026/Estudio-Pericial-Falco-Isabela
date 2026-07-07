/* =========================
   AION VOICE ENGINE®
========================= */

const AionVoice = {
  message: "",

  say(text = "", mode = "speaking") {
    this.message = text;

    if (mode === "thinking") {
      AionCore.thinking();
    }

    if (mode === "success") {
      AionCore.success();
    }

    if (mode === "creating") {
      AionCore.creating();
    }

    if (mode === "speaking") {
      AionCore.speaking();
    }

    AionRenderer.speak(1.1);

    console.log("AION:", text);
  },

  clear() {
    this.message = "";
    AionCore.idle();
  }
};