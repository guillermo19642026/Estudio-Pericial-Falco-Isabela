/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   UTILIDADES GENERALES
   Archivo: falco-lx-utils.js
========================================================= */

"use strict";


window.FALCO_LX_UTILS = Object.freeze({

  /* =======================================================
     LIMITAR VALORES
  ======================================================= */

  clamp(value, min, max) {
    return Math.min(
      Math.max(value, min),
      max
    );
  },


  /* =======================================================
     FORMATEAR TIEMPO
  ======================================================= */

  formatTime(seconds) {

    const safeSeconds =
      Math.max(
        0,
        Math.floor(
          Number(seconds) || 0
        )
      );

    const minutes =
      Math.floor(
        safeSeconds / 60
      );

    const remainingSeconds =
      safeSeconds % 60;

    return [
      String(minutes).padStart(2, "0"),
      String(remainingSeconds).padStart(2, "0")
    ].join(":");

  },


  /* =======================================================
     OBTENER ELEMENTO
  ======================================================= */

  getElement(id) {

    if (!id) {
      return null;
    }

    return document.getElementById(id);

  },


  /* =======================================================
     CREAR ELEMENTO
  ======================================================= */

  createElement(
    tagName,
    className = "",
    textContent = ""
  ) {

    const element =
      document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (
      textContent !== undefined &&
      textContent !== null &&
      textContent !== ""
    ) {
      element.textContent =
        String(textContent);
    }

    return element;

  },


  /* =======================================================
     AGREGAR CLASES
  ======================================================= */

  addClasses(
    element,
    classes = []
  ) {

    if (!element) {
      return element;
    }

    const normalizedClasses =
      Array.isArray(classes)
        ? classes
        : [classes];

    normalizedClasses
      .filter(Boolean)
      .forEach((className) => {
        element.classList.add(className);
      });

    return element;

  },


  /* =======================================================
     CREAR ICONO LUCIDE
  ======================================================= */

  createIcon(
    iconName,
    className = ""
  ) {

    const icon =
      document.createElement("i");

    icon.setAttribute(
      "data-lucide",
      iconName || "circle"
    );

    if (className) {
      icon.className = className;
    }

    icon.setAttribute(
      "aria-hidden",
      "true"
    );

    return icon;

  },


  /* =======================================================
     ACTUALIZAR ICONOS
  ======================================================= */

  refreshIcons() {

    if (
      window.lucide &&
      typeof window.lucide.createIcons ===
        "function"
    ) {
      window.lucide.createIcons();
    }

  },


  /* =======================================================
     VALIDAR OBJETO
  ======================================================= */

  isObject(value) {

    return (
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    );

  },


  /* =======================================================
     VALIDAR ARREGLO
  ======================================================= */

  isArray(value) {

    return Array.isArray(value);

  },


  /* =======================================================
     VALIDAR TEXTO
  ======================================================= */

  hasText(value) {

    return (
      typeof value === "string" &&
      value.trim().length > 0
    );

  },


  /* =======================================================
     TEXTO SEGURO
  ======================================================= */

  safeText(
    value,
    fallback = ""
  ) {

    if (
      value === undefined ||
      value === null
    ) {
      return fallback;
    }

    return String(value);

  },


  /* =======================================================
     VALIDAR NÚMERO
  ======================================================= */

  isFiniteNumber(value) {

    return (
      typeof value === "number" &&
      Number.isFinite(value)
    );

  },


  /* =======================================================
     NÚMERO SEGURO
  ======================================================= */

  safeNumber(
    value,
    fallback = 0
  ) {

    const numericValue =
      Number(value);

    return Number.isFinite(numericValue)
      ? numericValue
      : fallback;

  },


  /* =======================================================
     ESCENA POR TIEMPO
  ======================================================= */

  getSceneByTime(
    scenes,
    time
  ) {

    if (
      !Array.isArray(scenes) ||
      !scenes.length
    ) {
      return null;
    }

    const safeTime =
      this.safeNumber(time, 0);

    return (
      scenes.find(
        (scene) =>
          safeTime >= scene.start &&
          safeTime < scene.end
      ) ||
      scenes[scenes.length - 1]
    );

  },


  /* =======================================================
     ÍNDICE DE ESCENA
  ======================================================= */

  getSceneIndex(
    scenes,
    sceneId
  ) {

    if (
      !Array.isArray(scenes) ||
      !sceneId
    ) {
      return -1;
    }

    return scenes.findIndex(
      (scene) =>
        scene.id === sceneId
    );

  },


  /* =======================================================
     TIEMPO LOCAL DE ESCENA
  ======================================================= */

  getLocalSceneTime(
    scene,
    globalTime
  ) {

    if (!scene) {
      return 0;
    }

    const start =
      this.safeNumber(
        scene.start,
        0
      );

    const end =
      this.safeNumber(
        scene.end,
        start
      );

    return this.clamp(
      this.safeNumber(
        globalTime,
        0
      ) - start,
      0,
      Math.max(
        0,
        end - start
      )
    );

  },


  /* =======================================================
     DURACIÓN TOTAL
  ======================================================= */

  getTotalDuration(
    moduleData
  ) {

    if (!moduleData) {
      return 0;
    }

    if (
      this.isFiniteNumber(
        moduleData.duration
      )
    ) {
      return moduleData.duration;
    }

    const scenes =
      Array.isArray(moduleData.scenes)
        ? moduleData.scenes
        : [];

    if (!scenes.length) {
      return 0;
    }

    return Math.max(
      ...scenes.map(
        (scene) =>
          this.safeNumber(
            scene.end,
            0
          )
      )
    );

  },


  /* =======================================================
     VALIDAR MÓDULO
  ======================================================= */

  validateModule(
    moduleData
  ) {

    const errors = [];

    if (
      !this.isObject(moduleData)
    ) {
      errors.push(
        "El módulo no contiene una estructura válida."
      );

      return {
        valid: false,
        errors
      };
    }

    if (
      !this.hasText(
        moduleData.id
      )
    ) {
      errors.push(
        "El módulo no tiene un identificador."
      );
    }

    if (
      !this.hasText(
        moduleData.title
      )
    ) {
      errors.push(
        "El módulo no tiene título."
      );
    }

    if (
      !Array.isArray(
        moduleData.scenes
      ) ||
      !moduleData.scenes.length
    ) {
      errors.push(
        "El módulo no contiene escenas."
      );
    }

    if (
      Array.isArray(
        moduleData.scenes
      )
    ) {

      moduleData.scenes.forEach(
        (scene, index) => {

          if (
            !this.hasText(
              scene.id
            )
          ) {
            errors.push(
              `La escena ${index + 1} no tiene identificador.`
            );
          }

          if (
            !this.isFiniteNumber(
              scene.start
            ) ||
            !this.isFiniteNumber(
              scene.end
            )
          ) {
            errors.push(
              `La escena ${index + 1} no tiene tiempos válidos.`
            );
          }

          if (
            this.isFiniteNumber(
              scene.start
            ) &&
            this.isFiniteNumber(
              scene.end
            ) &&
            scene.end <= scene.start
          ) {
            errors.push(
              `La escena ${index + 1} tiene una duración inválida.`
            );
          }

        }
      );

    }

    return {
      valid:
        errors.length === 0,
      errors
    };

  },


  /* =======================================================
     VALIDAR CURSO
  ======================================================= */

  validateCourse(
    courseData
  ) {

    const errors = [];

    if (
      !this.isObject(courseData)
    ) {
      errors.push(
        "El curso no contiene una estructura válida."
      );

      return {
        valid: false,
        errors
      };
    }

    if (
      !this.hasText(
        courseData.id
      )
    ) {
      errors.push(
        "El curso no tiene identificador."
      );
    }

    if (
      !this.hasText(
        courseData.title
      )
    ) {
      errors.push(
        "El curso no tiene título."
      );
    }

    if (
      !Array.isArray(
        courseData.modules
      ) ||
      !courseData.modules.length
    ) {
      errors.push(
        "El curso no contiene módulos."
      );
    }

    return {
      valid:
        errors.length === 0,
      errors
    };

  },


  /* =======================================================
     NORMALIZAR RUTA
  ======================================================= */

  normalizePath(path) {

    if (!this.hasText(path)) {
      return "";
    }

    return path
      .replace(/\\/g, "/")
      .replace(/\/{2,}/g, "/");

  },


  /* =======================================================
     ESPERAR
  ======================================================= */

  wait(milliseconds = 0) {

    return new Promise(
      (resolve) => {
        window.setTimeout(
          resolve,
          Math.max(
            0,
            Number(milliseconds) || 0
          )
        );
      }
    );

  },


  /* =======================================================
     REGISTRO DE DEPURACIÓN
  ======================================================= */

  debugLog(
    label,
    data = null
  ) {

    const config =
      window.FALCO_LX_CONFIG;

    if (
      !config?.debug?.enabled
    ) {
      return;
    }

    if (data === null) {
      console.info(
        `[FALCO-LX] ${label}`
      );

      return;
    }

    console.info(
      `[FALCO-LX] ${label}`,
      data
    );

  },


  /* =======================================================
     MOSTRAR ERROR
  ======================================================= */

  showError(
    message
  ) {

    const errorContainer =
      document.getElementById(
        "flxError"
      );

    const errorMessage =
      document.getElementById(
        "flxErrorMessage"
      );

    const loading =
      document.getElementById(
        "flxLoading"
      );

    if (loading) {
      loading.classList.add(
        "is-hidden"
      );
    }

    if (errorMessage) {
      errorMessage.textContent =
        this.safeText(
          message,
          "Ocurrió un error inesperado."
        );
    }

    if (errorContainer) {
      errorContainer.hidden = false;
    }

  },


  /* =======================================================
     OCULTAR CARGA
  ======================================================= */

  hideLoading() {

    const loading =
      document.getElementById(
        "flxLoading"
      );

    if (!loading) {
      return;
    }

    loading.classList.add(
      "is-hidden"
    );

  }

});