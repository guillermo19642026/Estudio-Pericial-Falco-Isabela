/* =========================================================
   AION Animation Engine™ v1.1
   Respiración, brillo, halo y memoria de mood
========================================================= */

class AnimationEngine {
  constructor({ being, presence, memory = null }) {
    this.being = being;
    this.presence = presence;
    this.memory = memory;
    this.timer = null;
  }

  init() {
    this.start();
  }

  start() {
    clearInterval(this.timer);

    this.timer = window.setInterval(() => {
      this.update();
    }, 120);
  }

update() {
  if (!this.being || !this.presence) return;

  const mood = this.presence.getMood();

  if (this.memory) {
    this.memory.rememberMood(mood);
  }

  const glow = 1 + mood.attention * 0.18 + mood.curiosity * 0.08;

  const scale =
    1 +
    (mood.presence || 0.8) * 0.025 +
    mood.calm * 0.01;

  const haloOpacity =
    0.35 +
    mood.attention * 0.25 +
    mood.curiosity * 0.15;

  this.being.style.setProperty("--glow-strength", glow.toFixed(2));
  this.being.style.setProperty("--aion-scale", scale.toFixed(3));
  this.being.style.setProperty("--halo-opacity", haloOpacity.toFixed(3));

  if (mood.thinking) {
    this.setMotion("6.4s", "26s");
    return;
  }

  if (mood.speaking) {
    this.setMotion("2.7s", "10s");
    return;
  }

  if (mood.warning) {
    this.setMotion("1.8s", "7s");
    return;
  }

  if (mood.sleeping) {
    this.setMotion("7.6s", "34s");
    return;
  }
}

  setMotion(breathSpeed, haloSpeed) {
    this.being.style.setProperty("--breath-speed", breathSpeed);
    this.being.style.setProperty("--halo-speed", haloSpeed);
  }

  stop() {
    clearInterval(this.timer);
  }
}

window.AnimationEngine = AnimationEngine;