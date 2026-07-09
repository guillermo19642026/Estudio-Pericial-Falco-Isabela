/* =========================================================
   Visual Cortex™ v0.1
   Traduce estados internos en expresión visual
   No decide. No piensa. Solo expresa.
========================================================= */

class VisualCortex {

  constructor(being) {
    this.being = being;
  }

  render(mood = {}) {
    if (!this.being) return;

    const presence = this.clamp(mood.presence ?? 0.72);
    const calm = this.clamp(mood.calm ?? 1);
    const curiosity = this.clamp(mood.curiosity ?? 0.2);
    const attention = this.clamp(mood.attention ?? 0.2);

    this.being.style.setProperty("--mood-presence", presence);
    this.being.style.setProperty("--mood-calm", calm);
    this.being.style.setProperty("--mood-curiosity", curiosity);
    this.being.style.setProperty("--mood-attention", attention);

    this.being.style.setProperty(
      "--visual-breath",
      `${this.map(calm, 0, 1, 3.2, 7.4).toFixed(2)}s`
    );

    this.being.style.setProperty(
      "--visual-glow",
      this.map(presence, 0, 1, .72, 1.38).toFixed(2)
    );

    this.being.style.setProperty(
      "--visual-focus",
      this.map(attention, 0, 1, .85, 1.28).toFixed(2)
    );


    this.being.style.setProperty(
  "--visual-field",
  this.map(presence, 0, 1, .94, 1.08).toFixed(3)
);

this.being.style.setProperty(
  "--visual-field-opacity",
  this.map(curiosity, 0, 1, .10, .36).toFixed(3)
);

this.being.style.setProperty(
  "--visual-sensor-scale",
  this.map(attention, 0, 1, .98, 1.04).toFixed(3)
);

this.being.style.setProperty(
  "--visual-field",
  this.map(presence, 0, 1, .94, 1.08).toFixed(3)
);

this.being.style.setProperty(
  "--visual-field-opacity",
  this.map(curiosity, 0, 1, .10, .36).toFixed(3)
);

this.being.style.setProperty(
  "--visual-sensor-scale",
  this.map(attention, 0, 1, .98, 1.04).toFixed(3)
);


  }

  clamp(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
  }

  map(value, inMin, inMax, outMin, outMax) {
    const v = this.clamp((value - inMin) / (inMax - inMin));
    return outMin + (outMax - outMin) * v;
  }
}

window.VisualCortex = VisualCortex;