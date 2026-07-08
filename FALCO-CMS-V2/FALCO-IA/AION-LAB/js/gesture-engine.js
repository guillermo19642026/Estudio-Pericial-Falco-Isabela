/* =========================================================
   AION Gesture Engine™ v1.0
   Guiños, parpadeos y gestos de confirmación
========================================================= */

class GestureEngine {
  constructor(being) {
    this.being = being;
  }

  blink() {
    if (!this.being) return;

    this.being.classList.add("is-blinking");

    setTimeout(() => {
      this.being.classList.remove("is-blinking");
    }, 160);
  }

  doubleBlink() {
    this.blink();

    setTimeout(() => {
      this.blink();
    }, 260);
  }

  wink() {
    if (!this.being) return;

    this.being.classList.add("is-winking");

    setTimeout(() => {
      this.being.classList.remove("is-winking");
    }, 420);
  }

  success() {
    if (!this.being) return;

    this.being.classList.add("success-flash");

    setTimeout(() => {
      this.being.classList.remove("success-flash");
      this.wink();
    }, 360);
  }

  attention() {
    if (!this.being) return;

    this.being.classList.add("is-attending");

    setTimeout(() => {
      this.being.classList.remove("is-attending");
    }, 420);
  }
}

window.GestureEngine = GestureEngine;