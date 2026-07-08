/* =========================================================
   AION Eye Engine™ v1.0
   Mirada viva, inercia y seguimiento
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

    this.targetX = this.clamp(dx * 0.028 * this.sensitivity, -12, 12);
    this.targetY = this.clamp(dy * 0.028 * this.sensitivity, -8, 8);
  }

  followMouse(event) {
    if (!this.being) return;

    const rect = this.being.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;

    this.targetX = this.clamp(dx * 0.025 * this.sensitivity, -10, 10);
    this.targetY = this.clamp(dy * 0.025 * this.sensitivity, -7, 7);
  }

  center() {
    this.targetX = 0;
    this.targetY = 0;
  }

  microLook() {
    this.targetX = this.random(-3, 3);
    this.targetY = this.random(-2, 2);
  }

  animate() {
    if (!this.being) return;

    const mood = this.presence ? this.presence.getMood() : null;
    const attentionBoost = mood ? 0.08 + mood.attention * 0.04 : 0.08;

    this.eyeX += (this.targetX - this.eyeX) * attentionBoost;
    this.eyeY += (this.targetY - this.eyeY) * attentionBoost;

    this.being.style.setProperty("--eye-x", `${this.eyeX}px`);
    this.being.style.setProperty("--eye-y", `${this.eyeY}px`);

    requestAnimationFrame(() => this.animate());
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

window.EyeEngine = EyeEngine;