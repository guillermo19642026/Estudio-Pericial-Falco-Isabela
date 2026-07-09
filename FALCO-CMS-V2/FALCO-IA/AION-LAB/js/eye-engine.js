/* =========================================================
   AION Eye Engine™ v1.1
   Mirada viva: observa, no persigue
========================================================= */

class EyeEngine {
  constructor(being, presence = null) {
    this.being = being;
    this.presence = presence;

    this.eyeX = 0;
    this.eyeY = 0;

    this.targetX = 0;
    this.targetY = 0;

    this.sensitivity = 1;

    this.lastFollowAt = 0;
    this.followDelay = 90;
  }

  setSensitivity(value = 1) {
    this.sensitivity = Number(value);
  }

  lookAtPoint(x, y) {
    if (!this.being) return;

    const rect = this.being.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;

    this.targetX = this.clamp(dx * 0.022 * this.sensitivity, -10, 10);
    this.targetY = this.clamp(dy * 0.022 * this.sensitivity, -7, 7);
  }

  followMouse(event) {
    const now = Date.now();

    if (now - this.lastFollowAt < this.followDelay) return;

    this.lastFollowAt = now;

    if (!this.being) return;

    const mood = this.presence ? this.presence.getMood() : null;
    const attention = mood ? mood.attention : .4;

    if (attention < .18 && Math.random() > .35) return;

    this.lookAtPoint(event.clientX, event.clientY);
  }

  center() {
    this.targetX = 0;
    this.targetY = 0;
  }

  microLook() {
    this.targetX = this.randomFloat(-3, 3);
    this.targetY = this.randomFloat(-2, 2);
  }

  glance(direction = "center") {
    const positions = {
      center: [0, 0],
      up: [0, -5],
      down: [0, 5],
      left: [-6, 0],
      right: [6, 0],
      upperLeft: [-5, -4],
      upperRight: [5, -4],
      lowerLeft: [-4, 4],
      lowerRight: [4, 4]
    };

    const selected = positions[direction] || positions.center;

    this.targetX = selected[0];
    this.targetY = selected[1];
  }

  animate() {
    if (!this.being) return;

    const mood = this.presence ? this.presence.getMood() : null;
    const attention = mood ? mood.attention : .4;
    const calm = mood ? mood.calm : .8;

    const speed = this.clamp(
      0.045 + attention * 0.055 - calm * 0.018,
      0.035,
      0.12
    );

    this.eyeX += (this.targetX - this.eyeX) * speed;
    this.eyeY += (this.targetY - this.eyeY) * speed;

    this.being.style.setProperty("--eye-x", `${this.eyeX}px`);
    this.being.style.setProperty("--eye-y", `${this.eyeY}px`);

    requestAnimationFrame(() => this.animate());
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
}

window.EyeEngine = EyeEngine;