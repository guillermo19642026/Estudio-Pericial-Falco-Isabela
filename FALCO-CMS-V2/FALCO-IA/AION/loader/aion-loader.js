/* =========================================================
   AION Module Loader™ v1.0
   Sistema FALCO®

   FUNCIÓN GENERAL
   ---------------------------------------------------------
   Centraliza la carga de todos los módulos que componen AION.

   Este archivo permite que cada página del Sistema FALCO®
   incorpore AION mediante una única etiqueta <script>.

   RESPONSABILIDADES
   ---------------------------------------------------------
   - Mantener el orden correcto de carga.
   - Evitar scripts duplicados.
   - Cargar cada módulo de manera secuencial.
   - Detectar errores de carga.
   - Informar el avance en la consola.
   - Preparar la arquitectura para distintos contextos:
     Biblioteca, Home, Admisión, Área Profesional, etc.

   IMPORTANTE
   ---------------------------------------------------------
   Los módulos se cargan uno después del otro porque algunos
   dependen de que otros ya se encuentren disponibles.

   VERSIÓN
   ---------------------------------------------------------
   AION Module Loader™ v1.0
========================================================= */

const AIONModuleLoader = {

  /* =======================================================
     1. CONFIGURACIÓN GENERAL DEL LOADER
  ======================================================= */

  version: "1.0",

  initialized: false,

  loading: false,

  loadedModules: [],

  failedModules: [],


  /* =======================================================
     2. RUTA BASE DE AION

     Las rutas se conservan exactamente como funcionan
     actualmente dentro de Biblioteca FALCO®.
  ======================================================= */

  basePath:
    "FALCO-CMS-V2/FALCO-IA/AION-LAB/js/",


  
  /* =======================================================
     3. OBTENCIÓN DEL INVENTARIO DESDE AION REGISTRY™

     El Registry es ahora la fuente central de módulos.

     En esta primera integración, el Loader carga solamente
     los módulos:

     - habilitados;
     - obligatorios;
     - ordenados según la propiedad order.

     Los módulos opcionales permanecen registrados, pero no
     son cargados automáticamente.
  ======================================================= */

  getModules() {

    if (
      !window.AIONRegistry ||
      typeof window.AIONRegistry.getModules !== "function"
    ) {

      throw new Error(
        "AION Module Loader™ no encontró AION Registry™."
      );

    }


   return window.AIONRegistry
  .getModulesByContext(this.pageContext)
  .filter(module =>
    module.enabled === true &&
    module.required === true
  )
      .sort(
        (a, b) =>
          a.order - b.order
      )
      .map(module => {

        if (module.source !== "aion-lab") {

          throw new Error(
            `Fuente no reconocida: ${module.source} en ${module.id}.`
          );

        }


        return {

          id:
            module.id,

          name:
            module.name,

          file:
            module.file,

          description:
            module.description,

          version:
            module.version,

          group:
            module.group,

          dependencies:
            [...module.dependencies],

          contexts:
            [...module.contexts],

          required:
            module.required

        };

      });

  },



 /* =======================================================
   4. DETECCIÓN DEL CONTEXTO DE PÁGINA

   Lee el atributo data-aion-context del <body>.
======================================================= */

getPageContext() {

  const body =
    document.body;

  if (!body) {

    return "general";

  }

  const declaredContext =
    body.dataset.aionContext;

  if (
    typeof declaredContext !== "string" ||
    declaredContext.trim() === ""
  ) {

    return "general";

  }

  return declaredContext
    .trim()
    .toLowerCase();

},




  /* =======================================================
     4. INICIALIZACIÓN GENERAL
  ======================================================= */

  async init() {

    if (this.initialized) {

      console.warn(
        "AION Module Loader™ ya fue inicializado."
      );

      return {
        success: true,
        alreadyInitialized: true
      };

    }


    if (this.loading) {

      console.warn(
        "AION Module Loader™ ya está cargando módulos."
      );

      return {
        success: false,
        loading: true
      };

    }


   this.loading = true;

this.pageContext =
  this.getPageContext();

console.log(
  `AION Module Loader™ v${this.version} iniciando...`
);

console.log(
  `AION Module Loader™ Context: ${this.pageContext}`
);


    try {

      await this.loadAllModules();

      this.initialized = true;
      this.loading = false;

      console.log(
        "AION Module Loader™ v1.0 Ready"
      );


      window.dispatchEvent(
        new CustomEvent(
          "aion:modules-ready",
          {
            detail: {
              version: this.version,
              loadedModules:
                [...this.loadedModules]
            }
          }
        )
      );


      return {
        success: true,
        loadedModules:
          [...this.loadedModules]
      };

    } catch (error) {

      this.loading = false;

      console.error(
        "AION Module Loader™ no pudo completar la carga:",
        error
      );


      window.dispatchEvent(
        new CustomEvent(
          "aion:modules-error",
          {
            detail: {
              error,
              failedModules:
                [...this.failedModules]
            }
          }
        )
      );


      return {
        success: false,
        error,
        failedModules:
          [...this.failedModules]
      };

    }

  },


  /* =======================================================
     5. CARGA SECUENCIAL DE TODOS LOS MÓDULOS

     Se utiliza await para garantizar que un módulo termine
     de cargar antes de comenzar con el siguiente.
  ======================================================= */

  async loadAllModules() {

    const modules =
      this.getModules();

    for (const module of modules) {

      await this.loadModule(module);

    }

  },


  /* =======================================================
     6. CARGA INDIVIDUAL DE UN MÓDULO
  ======================================================= */

  loadModule(module) {

    return new Promise(
      (resolve, reject) => {

        const source =
          this.basePath + module.file;


        /*
         * Evita volver a cargar un script que ya exista
         * dentro del documento.
         */

        const existingScript =
          Array.from(
            document.scripts
          ).find(script => {

            const scriptSource =
              script.getAttribute("src");

            if (!scriptSource) {

              return false;

            }

            return (
              scriptSource === source ||
              script.src.endsWith(source)
            );

          });


        if (existingScript) {

          console.warn(
            `${module.name} ya estaba incluido.`
          );

          this.loadedModules.push({
            name: module.name,
            file: module.file,
            reused: true
          });

          resolve({
            success: true,
            reused: true,
            module
          });

          return;

        }


        /*
         * Crea dinámicamente la etiqueta <script>.
         */

        const script =
          document.createElement("script");


        script.src =
          source;


        script.async =
          false;


        script.dataset.aionModule =
          module.name;


        /*
         * Se ejecuta cuando el archivo fue cargado
         * correctamente por el navegador.
         */

        script.onload =
          () => {

            this.loadedModules.push({
              name: module.name,
              file: module.file,
              reused: false
            });

            console.log(
              `✔ ${module.name}`
            );

            resolve({
              success: true,
              reused: false,
              module
            });

          };


        /*
         * Se ejecuta cuando el navegador no encuentra
         * el archivo o no puede cargarlo.
         */

        script.onerror =
          error => {

            const failure = {
              name: module.name,
              file: module.file,
              source,
              error
            };

            this.failedModules.push(
              failure
            );

            console.error(
              `✖ No se pudo cargar ${module.name}`,
              source
            );

            reject(
              new Error(
                `No se pudo cargar ${module.name}`
              )
            );

          };


        document.body.appendChild(
          script
        );

      }
    );

  },


  /* =======================================================
     7. ESTADO DEL LOADER

     Permite consultar desde la consola qué módulos fueron
     cargados y si ocurrió algún error.
  ======================================================= */

 getState() {

  return {

    version:
      this.version,

    initialized:
      this.initialized,

    loading:
      this.loading,

    pageContext:
      this.pageContext,

    totalModules:
      this.getModules().length,

    loadedCount:
      this.loadedModules.length,

    failedCount:
      this.failedModules.length,

    loadedModules:
      [...this.loadedModules],

    failedModules:
      [...this.failedModules]

  };

}

};


/* =========================================================
   8. EXPOSICIÓN GLOBAL

   Permite utilizar el Loader desde la consola o desde otros
   módulos mediante window.AIONModuleLoader.
========================================================= */

window.AIONModuleLoader =
  AIONModuleLoader;


/* =========================================================
   9. INICIALIZACIÓN AUTOMÁTICA

   Como el archivo se coloca al final del <body>, el documento
   ya se encuentra disponible y puede comenzar la carga.
========================================================= */

AIONModuleLoader.init();