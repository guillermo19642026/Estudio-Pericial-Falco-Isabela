/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   CARGADOR DINÁMICO DE CONTENIDOS
   Archivo: falco-lx-content-loader.js
========================================================= */

"use strict";


window.FALCO_LX_CONTENT_LOADER = (() => {

  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  const DEFAULT_COURSE =
    "escuela-padres";

  const DEFAULT_MODULE =
    1;

  const CORE_SCRIPTS = [

    "./CORE/js/falco-lx-utils.js",

    "./CORE/js/falco-lx-audio.js",

    "./CORE/js/falco-lx-timeline.js",

    "./CORE/js/falco-lx-animation.js",

    "./CORE/js/falco-lx-renderer.js",

    "./CORE/js/falco-lx-player.js",

    "./CORE/js/falco-lx-engine.js"

  ];


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    initialized: false,

    loading: false,

    ready: false,

    courseSlug: DEFAULT_COURSE,

    moduleNumber: DEFAULT_MODULE,

    coursePath: "",

    modulePath: "",

    loadedScripts: [],

    error: null

  };


  /* =======================================================
     LEER PARÁMETROS DE LA URL
  ======================================================= */

  function getRouteParameters() {

    const parameters =
      new URLSearchParams(
        window.location.search
      );

    const courseParameter =
      parameters.get("curso");

    const moduleParameter =
      parameters.get("modulo");


    const courseSlug =
      normalizeCourseSlug(
        courseParameter ||
        DEFAULT_COURSE
      );


    const moduleNumber =
      normalizeModuleNumber(
        moduleParameter ||
        DEFAULT_MODULE
      );


    return {

      courseSlug,

      moduleNumber

    };

  }


  /* =======================================================
     NORMALIZAR CURSO
  ======================================================= */

  function normalizeCourseSlug(value) {

    const normalized =
      String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");


    return normalized ||
      DEFAULT_COURSE;

  }


  /* =======================================================
     NORMALIZAR MÓDULO
  ======================================================= */

  function normalizeModuleNumber(value) {

    const numericValue =
      Number.parseInt(
        value,
        10
      );


    if (
      !Number.isInteger(
        numericValue
      ) ||
      numericValue < 1
    ) {

      return DEFAULT_MODULE;

    }


    return numericValue;

  }


  /* =======================================================
     FORMATEAR NÚMERO
  ======================================================= */

  function formatModuleNumber(
    moduleNumber
  ) {

    return String(
      moduleNumber
    ).padStart(
      2,
      "0"
    );

  }


  /* =======================================================
     CONSTRUIR RUTAS
  ======================================================= */

  function buildContentPaths(
    courseSlug,
    moduleNumber
  ) {

    const courseBasePath =
      `./CONTENT/cursos/${courseSlug}`;


    return {

      coursePath:
        `${courseBasePath}/curso.js`,

      modulePath:
        `${courseBasePath}/data/modulo-${formatModuleNumber(
          moduleNumber
        )}.js`

    };

  }


  /* =======================================================
     CARGAR UN SCRIPT
  ======================================================= */

  function loadScript(
    source,
    options = {}
  ) {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (!source) {

          reject(
            new Error(
              "Se intentó cargar un archivo sin ruta."
            )
          );

          return;

        }


        const existingScript =
          document.querySelector(
            `script[data-flx-source="${source}"]`
          );


        if (existingScript) {

          if (
            existingScript.dataset
              .flxLoaded === "true"
          ) {

            resolve(
              existingScript
            );

            return;

          }


          existingScript.addEventListener(
            "load",
            () => {
              resolve(
                existingScript
              );
            },
            {
              once: true
            }
          );


          existingScript.addEventListener(
            "error",
            () => {

              reject(
                new Error(
                  `No se pudo cargar ${source}.`
                )
              );

            },
            {
              once: true
            }
          );


          return;

        }


        const script =
          document.createElement(
            "script"
          );


        script.src =
          source;

        script.async =
          false;

        script.defer =
          false;

        script.dataset.flxSource =
          source;


        if (options.type) {

          script.type =
            options.type;

        }


        script.addEventListener(
          "load",
          () => {

            script.dataset.flxLoaded =
              "true";

            state.loadedScripts.push(
              source
            );

            resolve(
              script
            );

          },
          {
            once: true
          }
        );


        script.addEventListener(
          "error",
          () => {

            script.remove();

            reject(
              new Error(
                `No se encontró o no se pudo cargar el archivo: ${source}`
              )
            );

          },
          {
            once: true
          }
        );


        document.body.appendChild(
          script
        );

      }
    );

  }


  /* =======================================================
     CARGAR SCRIPTS EN ORDEN
  ======================================================= */

  async function loadSequentially(
    sources
  ) {

    for (
      const source of sources
    ) {

      await loadScript(
        source
      );

    }

  }


  /* =======================================================
     VALIDAR CONTENIDO CARGADO
  ======================================================= */

  function validateLoadedContent() {

    if (
      !window.FALCO_LX_COURSE
    ) {

      throw new Error(
        "El archivo del curso se cargó, pero no definió FALCO_LX_COURSE."
      );

    }


    if (
      !window.FALCO_LX_MODULE
    ) {

      throw new Error(
        "El archivo del módulo se cargó, pero no definió FALCO_LX_MODULE."
      );

    }


    const courseId =
      String(
        window.FALCO_LX_COURSE.id ||
        ""
      )
        .trim()
        .toLowerCase();


    const moduleCourseId =
      String(
        window.FALCO_LX_MODULE
          .courseId ||
        ""
      )
        .trim()
        .toLowerCase();


    if (
      moduleCourseId &&
      courseId &&
      moduleCourseId !==
        courseId
    ) {

      throw new Error(
        "El módulo seleccionado no pertenece al curso cargado."
      );

    }

  }


  /* =======================================================
     MOSTRAR ERROR
  ======================================================= */

  function showLoaderError(
    error
  ) {

    const loadingElement =
      document.getElementById(
        "flxLoading"
      );

    const errorElement =
      document.getElementById(
        "flxError"
      );

    const errorMessage =
      document.getElementById(
        "flxErrorMessage"
      );


    if (loadingElement) {

      loadingElement.classList.add(
        "is-hidden"
      );

    }


    if (errorMessage) {

      errorMessage.textContent =
        error?.message ||
        "No fue posible cargar el contenido solicitado.";

    }


    if (errorElement) {

      errorElement.hidden =
        false;

    }


    console.error(
      "FALCO-LX Content Loader:",
      error
    );

  }


  /* =======================================================
     PUBLICAR RUTA ACTIVA
  ======================================================= */

  function publishActiveRoute() {

    window.FALCO_LX_ROUTE =
      Object.freeze({

        course:
          state.courseSlug,

        module:
          state.moduleNumber,

        coursePath:
          state.coursePath,

        modulePath:
          state.modulePath

      });

  }


  /* =======================================================
     CARGAR CONTENIDO
  ======================================================= */

  async function loadContent() {

    const route =
      getRouteParameters();


    state.courseSlug =
      route.courseSlug;

    state.moduleNumber =
      route.moduleNumber;


    const paths =
      buildContentPaths(
        state.courseSlug,
        state.moduleNumber
      );


    state.coursePath =
      paths.coursePath;

    state.modulePath =
      paths.modulePath;


    publishActiveRoute();


    await loadScript(
      state.coursePath
    );


    await loadScript(
      state.modulePath
    );


    validateLoadedContent();

  }


  /* =======================================================
     CARGAR NÚCLEO
  ======================================================= */

  async function loadCore() {

    await loadSequentially(
      CORE_SCRIPTS
    );

  }


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  async function initialize() {

    if (
      state.initialized ||
      state.loading
    ) {

      return;

    }


    state.loading =
      true;

    state.error =
      null;


    try {

      await loadContent();

      await loadCore();


      state.ready =
        true;

      state.initialized =
        true;


      window.dispatchEvent(
        new CustomEvent(
          "falco-lx:content-ready",
          {
            detail: {
              course:
                state.courseSlug,

              module:
                state.moduleNumber,

              courseData:
                window.FALCO_LX_COURSE,

              moduleData:
                window.FALCO_LX_MODULE
            }
          }
        )
      );


      console.info(
        "FALCO-LX Content Loader™ Ready",
        {
          course:
            state.courseSlug,

          module:
            state.moduleNumber
        }
      );

    } catch (error) {

      state.error =
        error;

      state.ready =
        false;

      showLoaderError(
        error
      );

    } finally {

      state.loading =
        false;

    }

  }


  /* =======================================================
     CONSULTAR ESTADO
  ======================================================= */

  function getState() {

    return {

      initialized:
        state.initialized,

      loading:
        state.loading,

      ready:
        state.ready,

      courseSlug:
        state.courseSlug,

      moduleNumber:
        state.moduleNumber,

      coursePath:
        state.coursePath,

      modulePath:
        state.modulePath,

      loadedScripts: [
        ...state.loadedScripts
      ],

      error:
        state.error
          ? state.error.message
          : null

    };

  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    initialize,

    getState,

    getRouteParameters,

    buildContentPaths

  });

})();


/* =========================================================
   INICIO AUTOMÁTICO DEL CARGADOR
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      window
        .FALCO_LX_CONTENT_LOADER
        .initialize();

    },
    {
      once: true
    }
  );

} else {

  window
    .FALCO_LX_CONTENT_LOADER
    .initialize();

}