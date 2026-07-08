/* =========================================================
   AION Identity Engine™ v1.0
   Identidad institucional de AION
========================================================= */

class IdentityEngine {
  constructor(contextEngine = null) {
    this.contextEngine = contextEngine;

    this.identity = {
      name: "AION",
      fullName: "AION Engine™",
      version: "1.0",
      project: "Living Presence Engine™",
      owner: "Sistema FALCO®",
      role: "Institutional Cognitive Presence",
      language: "es-AR",
      status: "experimental",
      signature: "AION™ · Sistema FALCO®"
    };
  }

  get() {
    const contextProfile = this.contextEngine
      ? this.contextEngine.getProfile()
      : null;

    return {
      ...this.identity,
      context: this.contextEngine?.context || "lab",
      contextProfile
    };
  }

  getName() {
    return this.identity.name;
  }

  getSignature() {
    return this.identity.signature;
  }

  setStatus(status = "experimental") {
    this.identity.status = status;
  }
}

window.IdentityEngine = IdentityEngine;