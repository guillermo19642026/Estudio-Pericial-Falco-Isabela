/* =========================================================
   AION ACTION CATALOG™ v6.6
   Sistema FALCO®
   Fuente de verdad para acciones institucionales
========================================================= */

(function () {
  const AionActionCatalog = {
    groups: {
      documents: [
        "open-document",
        "open-resource",
        "open-model",
        "open-report"
      ],

      library: [
        "open-library",
        "open-category",
        "open-bibliography"
      ],

      education: [
        "open-course",
        "open-module",
        "complete-module"
      ],

      search: [
        "start-search",
        "finish-search",
        "no-results"
      ],

      system: [
        "system-ready",
        "login-success",
        "logout",
        "role-detected",
        "show-warning",
        "show-error"
      ],

      professional: [
        "open-professional-area",
        "open-tool",
        "open-test",
        "open-template"
      ]
    },

    actions: {
      "open-document": {
        title: "Documento abierto",
        message: "Recurso institucional en lectura.",
        state: "gold",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-resource": {
        title: "Recurso FALCO®",
        message: "Recurso institucional disponible.",
        state: "gold",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-model": {
        title: "Modelo abierto",
        message: "Modelo profesional disponible para revisión.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-report": {
        title: "Informe abierto",
        message: "Informe técnico disponible para lectura.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-library": {
        title: "Biblioteca FALCO®",
        message: "Accediendo a recursos profesionales.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-category": {
        title: "Categoría abierta",
        message: "Categoría profesional seleccionada.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-bibliography": {
        title: "Bibliografía",
        message: "Bibliografía técnica disponible.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-course": {
        title: "Escuela FALCO®",
        message: "Módulo formativo abierto.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-module": {
        title: "Módulo abierto",
        message: "Contenido formativo disponible.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "complete-module": {
        title: "Módulo completado",
        message: "Avance registrado correctamente.",
        state: "gold",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "start-search": {
        title: "AION procesa",
        message: "Analizando información del Sistema FALCO®.",
        state: "blue",
        behavior: "thinking",
        wave: true,
        voice: false,
        workflow: "search"
      },

      "finish-search": {
        title: "Búsqueda finalizada",
        message: "Se encontraron resultados disponibles para revisión.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: true
      },

      "no-results": {
        title: "Sin resultados",
        message: "No se encontraron recursos relacionados con la consulta.",
        state: "white",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "system-ready": {
        title: "Sistema FALCO®",
        message: "AION se encuentra activo y disponible.",
        state: "gold",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "login-success": {
        title: "Acceso autorizado",
        message: "Ingreso al sistema confirmado.",
        state: "green",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "logout": {
        title: "Sesión cerrada",
        message: "La sesión fue finalizada correctamente.",
        state: "white",
        behavior: "idle",
        wave: false,
        voice: false
      },

      "role-detected": {
        title: "Perfil reconocido",
        message: "AION adaptó la experiencia al rol del usuario.",
        state: "gold",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "show-warning": {
        title: "Atención",
        message: "Hay información contextual relevante.",
        state: "violet",
        behavior: "warning",
        wave: true,
        voice: true
      },

      "show-error": {
        title: "Error del sistema",
        message: "No fue posible completar la operación solicitada.",
        state: "violet",
        behavior: "warning",
        wave: true,
        voice: true
      },

      "open-professional-area": {
        title: "Centro Profesional",
        message: "Área profesional activa.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-tool": {
        title: "Herramienta profesional",
        message: "Herramienta técnica seleccionada.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-test": {
        title: "Instrumento psicométrico",
        message: "Instrumento disponible para evaluación.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      },

      "open-template": {
        title: "Plantilla profesional",
        message: "Plantilla disponible para revisión.",
        state: "blue",
        behavior: "guiding",
        wave: true,
        voice: false
      }
    },

    get(actionName) {
      return this.actions[actionName] || null;
    }
  };

  window.AionActionCatalog = AionActionCatalog;
})();