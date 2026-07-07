/* =========================================================
   AION MEMORY™ v2.0
   Sistema FALCO®
   Memoria temporal de sesión
========================================================= */

class AionMemory {
  constructor() {
    this.key = "AION_SESSION_MEMORY";
  }

  read() {
    try {
      const stored = sessionStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  write(data = {}) {
    try {
      const current = this.read();

      const next = {
        ...current,
        ...data,
        updatedAt: new Date().toISOString()
      };

      sessionStorage.setItem(this.key, JSON.stringify(next));
    } catch (error) {
      return null;
    }
  }

  clear() {
    try {
      sessionStorage.removeItem(this.key);
    } catch (error) {
      return null;
    }
  }
}

window.AionMemory = AionMemory;