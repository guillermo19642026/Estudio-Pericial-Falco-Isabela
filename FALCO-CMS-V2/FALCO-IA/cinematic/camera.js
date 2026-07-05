/* =========================
   FALCO CAMERA ENGINE™
========================= */

window.FalcoCamera = {
  root: null,

  init(selector) {
    this.root = document.querySelector(selector);
  },

  moveTo(sceneIndex) {
    if (!this.root) return;

    this.root.classList.remove(
      "camera-scene-0",
      "camera-scene-1",
      "camera-scene-2",
      "camera-scene-3",
      "camera-scene-4"
    );

    this.root.classList.add(`camera-scene-${sceneIndex}`);
  }
};