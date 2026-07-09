/* =========================================================
   AION Presence Engine™ v1.2
   Estado interno vivo: rangos + fluctuación suave
========================================================= */

class PresenceEngine {

  constructor() {
    this.state = "idle";

    this.mood = {
      presence: .72,
      calm: 1,
      curiosity: .1,
      attention: .2,
      thinking: false,
      speaking: false,
      sleeping: false,
      warning: false
    };

    this.target = { ...this.mood };

    this.fluctuationTimer = null;
    this.startFluctuation();
  }

  setState(state) {
    this.state = state;
    this.applyStateMood(state);
  }

  getState() {
    return this.state;
  }

  getMood() {
    return structuredClone(this.mood);
  }

  setMood(property, value) {
    if (this.mood[property] === undefined) return;
    this.target[property] = typeof value === "number" ? this.clamp(value) : value;
  }

  setPresence(level = .72) {
    this.target.presence = this.clamp(level);
  }

  getPresence() {
    return this.mood.presence;
  }

  applyStateMood(state) {
    const ranges = {
      idle: {
        presence: [.64, .74],
        calm: [.86, 1],
        curiosity: [.08, .24],
        attention: [.16, .32]
      },

      listening: {
        presence: [.78, .88],
        calm: [.70, .86],
        curiosity: [.32, .54],
        attention: [.62, .84]
      },

      thinking: {
        presence: [.82, .92],
        calm: [.64, .82],
        curiosity: [.42, .68],
        attention: [.68, .88]
      },

      speaking: {
        presence: [.88, .98],
        calm: [.52, .72],
        curiosity: [.34, .56],
        attention: [.78, .96]
      },

      reading: {
        presence: [.70, .82],
        calm: [.78, .92],
        curiosity: [.22, .40],
        attention: [.58, .78]
      },

      warning: {
        presence: [.90, 1],
        calm: [.28, .46],
        curiosity: [.10, .28],
        attention: [.86, 1]
      },

      success: {
        presence: [.84, .96],
        calm: [.74, .92],
        curiosity: [.42, .66],
        attention: [.56, .78]
      },

      sleep: {
        presence: [.24, .42],
        calm: [.90, 1],
        curiosity: [0, .08],
        attention: [0, .14]
      }
    };

    const selected = ranges[state] || ranges.idle;

    Object.keys(selected).forEach(key => {
      this.target[key] = this.randomFloat(selected[key][0], selected[key][1]);
    });

    this.mood.thinking = state === "thinking";
    this.mood.speaking = state === "speaking";
    this.mood.sleeping = state === "sleep";
    this.mood.warning = state === "warning";
  }

  curiosity(level = .5) {
    this.target.curiosity = this.clamp(level + this.randomFloat(-.04, .04));
    this.target.attention = this.clamp(.45 + level * .5);
    this.target.presence = this.clamp(.62 + level * .28);
  }

  focus(level = 1) {
    this.target.attention = this.clamp(level + this.randomFloat(-.03, .03));
    this.target.presence = this.clamp(.60 + level * .32);
  }

  relax() {
    this.applyStateMood("idle");
  }

  think(active = true) {
    this.mood.thinking = active;
    if (active) this.applyStateMood("thinking");
  }

  speak(active = true) {
    this.mood.speaking = active;
    if (active) this.applyStateMood("speaking");
  }

  warning(active = true) {
    this.mood.warning = active;
    if (active) this.applyStateMood("warning");
  }

  sleep(active = true) {
    this.mood.sleeping = active;
    if (active) this.applyStateMood("sleep");
  }

  startFluctuation() {
    this.fluctuationTimer = window.setInterval(() => {
        this.homeostasis();
      Object.keys(this.target).forEach(key => {
        if (typeof this.mood[key] !== "number") return;

        const drift = this.randomFloat(-.012, .012);
        const desired = this.clamp(this.target[key] + drift);

        this.mood[key] += (desired - this.mood[key]) * .08;
        this.mood[key] = this.clamp(this.mood[key]);
      });
    }, 180);
  }

nudge(values = {}) {
  Object.keys(values).forEach(key => {
    if (typeof this.target[key] !== "number") return;

    this.target[key] = this.clamp(
      this.target[key] + values[key]
    );
  });
}

homeostasis() {
  const balance = {
    presence: .70,
    calm: .88,
    curiosity: .18,
    attention: .24
  };

  Object.keys(balance).forEach(key => {
    if (typeof this.target[key] !== "number") return;

    this.target[key] += (balance[key] - this.target[key]) * .018;
    this.target[key] = this.clamp(this.target[key]);
  });
}



  clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

}

window.PresenceEngine = PresenceEngine;