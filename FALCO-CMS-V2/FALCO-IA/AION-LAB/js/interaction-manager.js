/* =========================================================
   AION Interaction Manager™ v1.0
   Decide cuándo AION puede intervenir
========================================================= */

class InteractionManager {
  constructor({ minDelay = 8000, cooldown = 45000 } = {}) {
    this.minDelay = minDelay;
    this.cooldown = cooldown;

    this.startedAt = Date.now();
    this.lastMessageAt = 0;
    this.lastReason = null;
  }

  canSpeak(reason = "general") {
    const now = Date.now();

    if (now - this.startedAt < this.minDelay) {
      return false;
    }

    if (now - this.lastMessageAt < this.cooldown) {
      return false;
    }

   if (this.lastReason === reason && reason !== "user-click") {
  return false;
}

    this.lastReason = reason;
    this.lastMessageAt = now;

    return true;
  }

  reset() {
    this.lastMessageAt = 0;
    this.lastReason = null;
  }
}

window.InteractionManager = InteractionManager;