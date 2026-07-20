/* =========================================================
   FALCO Admisión™
   Application Bootstrap v0.1
   Inicio general y control de módulos
========================================================= */

const FalcoAdmisionApp = {

  initialized: false,

  modules: {
    config: false,
    state: false,
    core: false
  },

  /* =======================================================
     INICIO
  ======================================================= */

  init() {
    if (this.initialized) {
      console.warn(
        "FALCO Admisión™ App ya se encuentra inicializada."
      );

      return;
    }

    try {
      this.showStartupLog();
      this.checkDependencies();
      this.initializeModules();
      this.bindGlobalEvents();

      this.initialized = true;

      document.documentElement.classList.add(
        "falco-admision-ready"
      );

      document.documentElement.classList.remove(
        "falco-admision-loading"
      );

      window.dispatchEvent(
        new CustomEvent(
          "falco-admision:app-ready",
          {
            detail: {
              version:
                window.FalcoAdmisionConfig
                  ?.identity
                  ?.version || "0.1.0",

              initializedAt:
                new Date().toISOString()
            }
          }
        )
      );

      console.log(
        "FALCO Admisión™ Application v0.1 Ready"
      );

    } catch (error) {
      this.handleInitializationError(error);
    }
  },

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  checkDependencies() {
    const missing = [];

    if (!window.FalcoAdmisionConfig) {
      missing.push(
        "FalcoAdmisionConfig"
      );
    } else {
      this.modules.config = true;
    }

    if (!window.FalcoAdmisionState) {
      missing.push(
        "FalcoAdmisionState"
      );
    } else {
      this.modules.state = true;
    }

    if (!window.FalcoAdmisionCore) {
      missing.push(
        "FalcoAdmisionCore"
      );
    } else {
      this.modules.core = true;
    }

    if (missing.length > 0) {
      throw new Error(
        `Faltan módulos requeridos: ${missing.join(", ")}`
      );
    }

    return true;
  },

  /* =======================================================
     INICIALIZACIÓN DE MÓDULOS
  ======================================================= */

  initializeModules() {
    window.FalcoAdmisionCore.init();
  },

  /* =======================================================
     EVENTOS GENERALES
  ======================================================= */

  bindGlobalEvents() {
    window.addEventListener(
      "error",
      event => {
        this.handleRuntimeError({
          message:
            event.message ||
            "Error general de ejecución",

          source:
            event.filename || null,

          line:
            event.lineno || null,

          column:
            event.colno || null,

          error:
            event.error || null
        });
      }
    );

    window.addEventListener(
      "unhandledrejection",
      event => {
        this.handleRuntimeError({
          message:
            "Promesa no controlada",

          error:
            event.reason || null
        });
      }
    );

    window.addEventListener(
      "online",
      () => {
        this.handleConnectionChange(true);
      }
    );

    window.addEventListener(
      "offline",
      () => {
        this.handleConnectionChange(false);
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          window.FalcoAdmisionState
            ?.saveNow?.();
        }
      }
    );

    window.addEventListener(
      "beforeunload",
      () => {
        window.FalcoAdmisionState
          ?.saveNow?.();
      }
    );
  },

  /* =======================================================
     CONEXIÓN
  ======================================================= */

  handleConnectionChange(isOnline) {
    document.documentElement.classList.toggle(
      "is-offline",
      !isOnline
    );

    window.dispatchEvent(
      new CustomEvent(
        "falco-admision:connection-change",
        {
          detail: {
            online: isOnline
          }
        }
      )
    );

    const message = isOnline
      ? "La conexión fue restablecida."
      : "No hay conexión. El progreso continuará guardándose en este dispositivo.";

    const aionMessage =
      document.querySelector(
        [
          "#aionMessage",
          "[data-aion-message]",
          ".aion-reception__message p"
        ].join(",")
      );

    if (aionMessage) {
      aionMessage.textContent =
        message;
    }

    window.FalcoAdmisionCore
      ?.setAionState?.(
        isOnline
          ? "attentive"
          : "thinking"
      );

    if (isOnline) {
      window.setTimeout(
        () => {
          window.FalcoAdmisionCore
            ?.setAionState?.("idle");
        },
        1800
      );
    }
  },

  /* =======================================================
     ERRORES
  ======================================================= */

  handleInitializationError(error) {
    console.error(
      "FALCO Admisión™ no pudo inicializarse:",
      error
    );

    document.documentElement.classList.add(
      "falco-admision-error"
    );

    document.documentElement.classList.remove(
      "falco-admision-loading"
    );

    this.renderFallbackError(
      "No fue posible iniciar correctamente la recepción digital."
    );
  },

  handleRuntimeError(errorData) {
    console.error(
      "FALCO Admisión™ Runtime Error:",
      errorData
    );

    window.dispatchEvent(
      new CustomEvent(
        "falco-admision:runtime-error",
        {
          detail: errorData
        }
      )
    );
  },

  renderFallbackError(message) {
    const main =
      document.querySelector(
        ".admision-main"
      );

    if (!main) {
      return;
    }

    const existing =
      document.querySelector(
        "#admisionFallbackError"
      );

    if (existing) {
      return;
    }

    const fallback =
      document.createElement("section");

    fallback.id =
      "admisionFallbackError";

    fallback.className =
      "admision-card admision-fallback-error";

    fallback.setAttribute(
      "role",
      "alert"
    );

    fallback.innerHTML = `
      <span class="admision-badge">
        Sistema de admisión
      </span>

      <h2>
        No pudimos cargar esta página correctamente.
      </h2>

      <p>
        ${this.escapeHtml(message)}
        Podés actualizar la página para volver a intentarlo.
      </p>

      <button
        class="admision-button admision-button--primary"
        type="button"
        data-action="reload-page"
      >
        Actualizar página
      </button>
    `;

    main.innerHTML = "";
    main.appendChild(fallback);

    fallback
      .querySelector(
        "[data-action='reload-page']"
      )
      ?.addEventListener(
        "click",
        () => {
          window.location.reload();
        }
      );
  },

  /* =======================================================
     INFORMACIÓN DE INICIO
  ======================================================= */

  showStartupLog() {
    const identity =
      window.FalcoAdmisionConfig
        ?.identity;

    console.groupCollapsed(
      "%cFALCO Admisión™",
      [
        "color: #d4af37",
        "font-size: 15px",
        "font-weight: 700"
      ].join(";")
    );

    console.log(
      "Producto:",
      identity?.name ||
      "FALCO Admisión™"
    );

    console.log(
      "Versión:",
      identity?.version ||
      "0.1.0"
    );

    console.log(
      "Institución:",
      identity?.institution ||
      "Estudio Pericial Psicológico"
    );

    console.log(
      "Asistente:",
      identity?.assistant ||
      "AION"
    );

    console.groupEnd();
  },

  /* =======================================================
     DIAGNÓSTICO
  ======================================================= */

  getStatus() {
    return {
      initialized:
        this.initialized,

      modules: {
        ...this.modules
      },

      state:
        window.FalcoAdmisionState
          ?.getState?.() || null,

      connection:
        navigator.onLine,

      path:
        window.location.pathname,

      timestamp:
        new Date().toISOString()
    };
  },

  /* =======================================================
     UTILIDADES
  ======================================================= */

  escapeHtml(value) {
    const element =
      document.createElement("div");

    element.textContent =
      String(value ?? "");

    return element.innerHTML;
  }
};

/* =========================================================
   EXPORTACIÓN
========================================================= */

window.FalcoAdmisionApp =
  FalcoAdmisionApp;

/* =========================================================
   ARRANQUE AUTOMÁTICO
========================================================= */

document.documentElement.classList.add(
  "falco-admision-loading"
);

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      FalcoAdmisionApp.init();
    },
    {
      once: true
    }
  );

} else {
  FalcoAdmisionApp.init();
}