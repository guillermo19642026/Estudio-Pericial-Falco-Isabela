/* =========================================================
   AION Registry™ v1.0
   Sistema FALCO®

   FUNCIÓN
   ---------------------------------------------------------
   Registro central de los módulos que integran AION.

   OBJETIVO
   ---------------------------------------------------------
   Separar el inventario de módulos de la lógica de carga.

   A partir de esta arquitectura:

   - AION Registry™ conoce qué módulos existen.
   - AION Module Loader™ decide cómo y cuándo cargarlos.

   RESPONSABILIDADES
   ---------------------------------------------------------
   - Registrar los módulos disponibles.
   - Definir su nombre, archivo, grupo y orden.
   - Declarar dependencias.
   - Identificar módulos obligatorios y opcionales.
   - Permitir búsquedas por ID o grupo.
   - Validar duplicados y datos incompletos.
   - Preparar la futura carga por contexto.
   - Mantener una única fuente de verdad.

   IMPORTANTE
   ---------------------------------------------------------
   En esta primera versión, el Registry no carga scripts.

   Tampoco modifica el funcionamiento actual del Loader.

   Primero se probará de forma independiente.
   Después se conectará con AION Module Loader™.

   VERSIÓN
   ---------------------------------------------------------
   AION Registry™ v1.0
========================================================= */


const AIONRegistry = {

  /* =======================================================
     1. IDENTIDAD
  ======================================================= */

  name: "AION Registry™",

  version: "1.0",

  system: "Sistema FALCO®",

  initialized: false,

  validationErrors: [],


  /* =======================================================
     2. GRUPOS DE MÓDULOS

     Los grupos permiten organizar la arquitectura y preparar
     futuras cargas selectivas según el contexto.
  ======================================================= */

  groups: {

    ROUTING: "routing",

    PRESENCE: "presence",

    CORE: "core",

    KNOWLEDGE: "knowledge",

    VOICE: "voice",

    CONTEXT: "context",

    BRAIN: "brain",

    CONVERSATION: "conversation",

    INTERFACE: "interface"

  },


  /* =======================================================
     3. INVENTARIO CENTRAL DE MÓDULOS

     El orden de esta lista reproduce exactamente la secuencia
     que actualmente utiliza AION Module Loader™ v1.0.

     No alterar el orden sin probar las dependencias.
  ======================================================= */

  modules: [

    /* ---------------------------------------------------
       ENRUTAMIENTO DEL CONOCIMIENTO
    --------------------------------------------------- */

    {
      order: 10,

      id: "knowledge-engine-router",

      name: "Knowledge Engine Router™",

      file: "knowledge-engine-router.js",

      source: "aion-lab",

      group: "routing",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Conecta el conocimiento específico de cada página con la plataforma AION."
    },


    /* ---------------------------------------------------
       PANEL DE INICIO
    --------------------------------------------------- */

    {
      order: 20,

      id: "launch-panel",

      name: "AION Launch Panel™",

      file: "launch-panel.js",

      source: "launch-panel",

      group: "interface",

      version: "1.0",

      required: false,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Gestiona el panel inicial de acceso e interacción con AION."
    },


    /* ---------------------------------------------------
       PRESENCIA Y COMPORTAMIENTO VISUAL
    --------------------------------------------------- */

    {
      order: 30,

      id: "presence-engine",

      name: "Presence Engine™",

      file: "presence-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Gestiona la presencia básica de AION en la interfaz."
    },

    {
      order: 40,

      id: "gesture-engine",

      name: "Gesture Engine™",

      file: "gesture-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["presence-engine"],

      description:
        "Controla gestos y movimientos expresivos de AION."
    },

    {
      order: 50,

      id: "eye-engine",

      name: "Eye Engine™",

      file: "eye-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["presence-engine"],

      description:
        "Gestiona la mirada y el movimiento ocular de AION."
    },

    {
      order: 60,

      id: "animation-engine",

      name: "Animation Engine™",

      file: "animation-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "presence-engine",
        "gesture-engine",
        "eye-engine"
      ],

      description:
        "Coordina las animaciones visuales generales."
    },

    {
      order: 70,

      id: "context-engine",

      name: "Context Engine™",

      file: "context-engine.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Proporciona contexto general a la presencia de AION."
    },

    {
      order: 80,

      id: "identity-engine",

      name: "Identity Engine™",

      file: "identity-engine.js",

      source: "aion-lab",

      group: "core",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Define la identidad, versión y perfil operativo de AION."
    },

    {
      order: 90,

      id: "memory-engine",

      name: "Memory Engine™",

      file: "memory-engine.js",

      source: "aion-lab",

      group: "core",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["identity-engine"],

      description:
        "Conserva estados básicos de interacción y presencia."
    },

    {
      order: 100,

      id: "brain-engine",

      name: "Brain Engine™",

      file: "brain-engine.js",

      source: "aion-lab",

      group: "brain",

      version: "1.3",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "identity-engine",
        "memory-engine",
        "context-engine"
      ],

      description:
        "Coordina la lógica cognitiva original de AION."
    },

    {
      order: 110,

      id: "perception-engine",

      name: "Perception Engine™",

      file: "perception-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["presence-engine"],

      description:
        "Procesa señales e interacciones percibidas por AION."
    },

    {
      order: 120,

      id: "action-engine",

      name: "Action Engine™",

      file: "action-engine.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "brain-engine",
        "perception-engine"
      ],

      description:
        "Transforma decisiones internas en acciones visibles."
    },

    {
      order: 130,

      id: "aion-observer",

      name: "AION Observer™",

      file: "aion-observer.js",

      source: "aion-lab",

      group: "core",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Observa y registra cambios relevantes de la plataforma."
    },

    {
      order: 140,

      id: "visual-cortex",

      name: "Visual Cortex™",

      file: "visual-cortex.js",

      source: "aion-lab",

      group: "presence",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "eye-engine",
        "animation-engine",
        "perception-engine"
      ],

      description:
        "Coordina el comportamiento visual y perceptivo de AION."
    },


    /* ---------------------------------------------------
       NÚCLEO Y CONFIGURACIÓN
    --------------------------------------------------- */

    {
      order: 150,

      id: "aion-core",

      name: "AION Core™",

      file: "aion-core.js",

      source: "aion-lab",

      group: "core",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "identity-engine",
        "memory-engine",
        "brain-engine"
      ],

      description:
        "Núcleo central que conecta los motores principales."
    },

    {
      order: 160,

      id: "aion-config",

      name: "AION Config™",

      file: "aion-config.js",

      source: "aion-lab",

      group: "core",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["aion-core"],

      description:
        "Centraliza la configuración general de AION."
    },

    {
      order: 170,

      id: "aion-site-map",

      name: "AION Site Map™",

      file: "aion-site-map.js",

      source: "aion-lab",

      group: "routing",

      version: "1.1",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["aion-config"],

      description:
        "Describe las páginas y rutas conocidas del Sistema FALCO®."
    },

    {
      order: 180,

      id: "aion-router",

      name: "AION Router™",

      file: "aion-router.js",

      source: "aion-lab",

      group: "routing",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "aion-config",
        "aion-site-map"
      ],

      description:
        "Gestiona navegación y rutas internas sugeridas por AION."
    },


    /* ---------------------------------------------------
       CONOCIMIENTO Y CORPUS
    --------------------------------------------------- */

    {
      order: 190,

      id: "knowledge-engine",

      name: "Knowledge Engine™",

      file: "knowledge-engine.js",

      source: "aion-lab",

      group: "knowledge",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "knowledge-engine-router",
        "aion-config"
      ],

      description:
        "Carga y entrega el conocimiento correspondiente a la página."
    },

    {
      order: 200,

      id: "knowledge-search",

      name: "Knowledge Search™",

      file: "knowledge-search.js",

      source: "aion-lab",

      group: "knowledge",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["knowledge-engine"],

      description:
        "Busca respuestas dentro del conocimiento disponible."
    },

    {
      order: 210,

      id: "interaction-manager",

      name: "Interaction Manager™",

      file: "interaction-manager.js",

      source: "aion-lab",

      group: "conversation",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "aion-core",
        "knowledge-engine"
      ],

      description:
        "Coordina eventos e interacciones entre el usuario y AION."
    },

    {
      order: 220,

      id: "aion-guide",

      name: "AION Guide™",

      file: "aion-guide.js",

      source: "aion-lab",

      group: "conversation",

      version: "2.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "interaction-manager",
        "knowledge-engine"
      ],

      description:
        "Ofrece orientación contextual dentro de la página."
    },

    {
      order: 230,

      id: "corpus-engine",

      name: "Corpus Engine™",

      file: "corpus-engine.js",

      source: "aion-lab",

      group: "knowledge",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "knowledge-engine",
        "knowledge-search"
      ],

      description:
        "Consulta el corpus de preguntas y respuestas de AION."
    },


    /* ---------------------------------------------------
       VOZ Y DIRECCIÓN DE PRESENCIA
    --------------------------------------------------- */

    {
      order: 240,

      id: "aion-voice",

      name: "AION Voice™",

      file: "aion-voice.js",

      source: "aion-lab",

      group: "voice",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Gestiona la voz y lectura oral de las respuestas."
    },

    {
      order: 250,

      id: "presence-director",

      name: "Presence Director™",

      file: "presence-director.js",

      source: "aion-lab",

      group: "presence",

      version: "2.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "presence-engine",
        "aion-core",
        "aion-voice"
      ],

      description:
        "Coordina los estados de presencia, atención y habla."
    },


    /* ---------------------------------------------------
       COMPRENSIÓN CONVERSACIONAL
    --------------------------------------------------- */

    {
      order: 260,

      id: "intent-engine",

      name: "Intent Engine™",

      file: "intent-engine.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [],

      description:
        "Detecta el tema y la intención de la consulta."
    },

    {
      order: 270,

      id: "conversation-context-engine",

      name: "Conversation Context Engine™",

      file: "conversation-context-engine.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["intent-engine"],

      description:
        "Analiza la relación entre el mensaje actual y los anteriores."
    },

    {
      order: 280,

      id: "aion-context-schema",

      name: "AION Context Schema™",

      file: "aion-context-schema.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "intent-engine",
        "conversation-context-engine"
      ],

      description:
        "Normaliza el contexto en una estructura común."
    },

    {
      order: 290,

      id: "memory-context-engine",

      name: "Memory Context Engine™",

      file: "memory-context-engine.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: ["aion-context-schema"],

      description:
        "Conserva el tema y la continuidad de la conversación."
    },

    {
      order: 300,

      id: "context-resolution-engine",

      name: "Context Resolution Engine™",

      file: "context-resolution-engine.js",

      source: "aion-lab",

      group: "context",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "aion-context-schema",
        "memory-context-engine"
      ],

      description:
        "Resuelve ambigüedades y hereda contexto cuando corresponde."
    },

    {
      order: 310,

      id: "response-planner-engine",

      name: "Response Planner™",

      file: "response-planner-engine.js",

      source: "aion-lab",

      group: "brain",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "intent-engine",
        "context-resolution-engine"
      ],

      description:
        "Selecciona la estrategia que deberá seguir la respuesta."
    },


    /* ---------------------------------------------------
       AION BRAIN™ v2.0
    --------------------------------------------------- */

    {
      order: 320,

      id: "aion-brain-v2",

      name: "AION Brain™ v2.0",

      file: "aion-brain-v2.js",

      source: "aion-lab",

      group: "brain",

      version: "2.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "intent-engine",
        "conversation-context-engine",
        "aion-context-schema",
        "memory-context-engine",
        "context-resolution-engine",
        "response-planner-engine"
      ],

      description:
        "Coordina el procesamiento cognitivo del nuevo sistema."
    },

    {
      order: 330,

      id: "aion-brain-bridge",

      name: "AION Brain Bridge™",

      file: "aion-brain-bridge.js",

      source: "aion-lab",

      group: "brain",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "brain-engine",
        "aion-brain-v2"
      ],

      description:
        "Conecta Brain™ v2.0 con el sistema conversacional estable."
    },


    /* ---------------------------------------------------
       CONVERSACIÓN E INTERFAZ FINAL
    --------------------------------------------------- */

    {
      order: 340,

      id: "conversation-engine",

      name: "Conversation Engine™",

      file: "conversation-engine.js",

      source: "aion-lab",

      group: "conversation",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "knowledge-engine",
        "corpus-engine",
        "intent-engine",
        "aion-brain-bridge"
      ],

      description:
        "Gestiona el diálogo visible entre el usuario y AION."
    },

    {
      order: 350,

      id: "aion-float",

      name: "AION Float™",

      file: "aion-float.js",

      source: "aion-lab",

      group: "interface",

      version: "1.0",

      required: true,

      enabled: true,

      contexts: ["all"],

      dependencies: [
        "aion-core",
        "presence-director",
        "conversation-engine"
      ],

      description:
        "Inicializa la interfaz flotante visible de AION."
    }

  ],


  /* =======================================================
     4. INICIALIZACIÓN DEL REGISTRY
  ======================================================= */

  init() {

    if (this.initialized) {

      console.warn(
        "AION Registry™ ya fue inicializado."
      );


      return {
        success: true,
        alreadyInitialized: true
      };

    }


    const validation =
      this.validate();


    if (!validation.valid) {

      console.error(
        "AION Registry™ contiene errores:",
        validation.errors
      );


      return {
        success: false,
        errors: validation.errors
      };

    }


    this.initialized =
      true;


    console.log(
      `AION Registry™ v${this.version} Ready`
    );


    console.log(
      `AION Registry™ registró ${this.modules.length} módulos`
    );


    window.dispatchEvent(
      new CustomEvent(
        "aion:registry-ready",
        {
          detail: {
            version:
              this.version,

            totalModules:
              this.modules.length
          }
        }
      )
    );


    return {
      success: true,
      totalModules: this.modules.length
    };

  },


  /* =======================================================
     5. OBTENER TODOS LOS MÓDULOS

     Devuelve una copia ordenada para impedir modificaciones
     accidentales del inventario original.
  ======================================================= */

  getModules() {

    return [...this.modules]
      .sort(
        (a, b) =>
          a.order - b.order
      )
      .map(
        module => ({
          ...module,

          contexts:
            [...module.contexts],

          dependencies:
            [...module.dependencies]
        })
      );

  },



  /* =======================================================
     6. OBTENER MÓDULOS POR CONTEXTO

     Devuelve únicamente los módulos compatibles con el
     contexto solicitado.

     También incluye los módulos marcados como "all",
     que representan módulos universales.
  ======================================================= */

  getModulesByContext(context) {

    if (
      typeof context !== "string" ||
      !context.trim()
    ) {

      context = "general";

    }


    const normalizedContext =
      context
        .trim()
        .toLowerCase();


    return this.getModules()
      .filter(module =>

        module.contexts.includes("all") ||

        module.contexts.includes(normalizedContext)

      );

  },





  /* =======================================================
     6. BUSCAR UN MÓDULO POR ID
  ======================================================= */

  getModuleById(moduleId) {

    if (
      typeof moduleId !== "string" ||
      !moduleId.trim()
    ) {

      return null;

    }


    const normalizedId =
      moduleId
        .trim()
        .toLowerCase();


    const module =
      this.modules.find(
        currentModule =>
          currentModule.id === normalizedId
      );


    if (!module) {

      return null;

    }


    return {
      ...module,

      contexts:
        [...module.contexts],

      dependencies:
        [...module.dependencies]
    };

  },


  /* =======================================================
     7. BUSCAR MÓDULOS POR GRUPO
  ======================================================= */

  getModulesByGroup(group) {

    if (
      typeof group !== "string" ||
      !group.trim()
    ) {

      return [];

    }


    const normalizedGroup =
      group
        .trim()
        .toLowerCase();


    return this.getModules()
      .filter(
        module =>
          module.group === normalizedGroup
      );

  },


  /* =======================================================
     8. OBTENER MÓDULOS ACTIVOS
  ======================================================= */

  getEnabledModules() {

    return this.getModules()
      .filter(
        module =>
          module.enabled === true
      );

  },


  /* =======================================================
     9. OBTENER MÓDULOS OBLIGATORIOS
  ======================================================= */

  getRequiredModules() {

    return this.getModules()
      .filter(
        module =>
          module.required === true
      );

  },


  /* =======================================================
     10. OBTENER MÓDULOS SEGÚN CONTEXTO

     En esta versión todos los módulos tienen el contexto
     "all", pero el método ya queda preparado para páginas
     específicas como:

     - biblioteca
     - admision
     - home
     - profesional
     - periciado
  ======================================================= */

  getModulesByContext(context) {

    if (
      typeof context !== "string" ||
      !context.trim()
    ) {

      return this.getEnabledModules();

    }


    const normalizedContext =
      context
        .trim()
        .toLowerCase();


    return this.getEnabledModules()
      .filter(
        module =>
          module.contexts.includes("all") ||
          module.contexts.includes(
            normalizedContext
          )
      );

  },


  /* =======================================================
     11. OBTENER DEPENDENCIAS DE UN MÓDULO
  ======================================================= */

  getDependencies(moduleId) {

    const module =
      this.getModuleById(
        moduleId
      );


    if (!module) {

      return [];

    }


    return [...module.dependencies];

  },


  /* =======================================================
     12. COMPROBAR EXISTENCIA DE UN MÓDULO
  ======================================================= */

  hasModule(moduleId) {

    return Boolean(
      this.getModuleById(
        moduleId
      )
    );

  },


  /* =======================================================
     13. VALIDACIÓN GENERAL

     Comprueba:

     - IDs duplicados.
     - órdenes duplicados.
     - propiedades obligatorias.
     - dependencias inexistentes.
     - grupos desconocidos.
  ======================================================= */

  validate() {

    const errors = [];

    const ids =
      new Set();

    const orders =
      new Set();

    const validGroups =
      new Set(
        Object.values(
          this.groups
        )
      );


    this.modules.forEach(
      (module, index) => {

        const position =
          index + 1;


        /* -----------------------------------------------
           CAMPOS OBLIGATORIOS
        ----------------------------------------------- */

        const requiredFields = [
          "order",
          "id",
          "name",
          "file",
          "source",
          "group",
          "version",
          "description"
        ];


        requiredFields.forEach(
          field => {

            const value =
              module[field];


            if (
              value === undefined ||
              value === null ||
              value === ""
            ) {

              errors.push(
                `Módulo ${position}: falta el campo "${field}".`
              );

            }

          }
        );


        /* -----------------------------------------------
           ID DUPLICADO
        ----------------------------------------------- */

        if (ids.has(module.id)) {

          errors.push(
            `ID duplicado: "${module.id}".`
          );

        } else {

          ids.add(module.id);

        }


        /* -----------------------------------------------
           ORDEN DUPLICADO
        ----------------------------------------------- */

        if (orders.has(module.order)) {

          errors.push(
            `Orden duplicado: ${module.order}.`
          );

        } else {

          orders.add(module.order);

        }


        /* -----------------------------------------------
           GRUPO VÁLIDO
        ----------------------------------------------- */

        if (
          module.group &&
          !validGroups.has(module.group)
        ) {

          errors.push(
            `Grupo desconocido en "${module.id}": "${module.group}".`
          );

        }


        /* -----------------------------------------------
           ARRAYS ESPERADOS
        ----------------------------------------------- */

        if (
          !Array.isArray(
            module.dependencies
          )
        ) {

          errors.push(
            `"${module.id}" debe declarar dependencies como array.`
          );

        }


        if (
          !Array.isArray(
            module.contexts
          )
        ) {

          errors.push(
            `"${module.id}" debe declarar contexts como array.`
          );

        }

      }
    );


    /* ---------------------------------------------------
       DEPENDENCIAS EXISTENTES
    --------------------------------------------------- */

    this.modules.forEach(
      module => {

        if (
          !Array.isArray(
            module.dependencies
          )
        ) {

          return;

        }


        module.dependencies.forEach(
          dependencyId => {

            if (!ids.has(dependencyId)) {

              errors.push(
                `Dependencia inexistente: "${module.id}" requiere "${dependencyId}".`
              );

            }

          }
        );

      }
    );


    this.validationErrors =
      [...errors];


    return {
      valid:
        errors.length === 0,

      errors:
        [...errors],

      totalModules:
        this.modules.length
    };

  },


  /* =======================================================
     14. RESUMEN DEL REGISTRY
  ======================================================= */

  getState() {

    const groups = {};


    Object.values(
      this.groups
    ).forEach(
      group => {

        groups[group] =
          this.modules.filter(
            module =>
              module.group === group
          ).length;

      }
    );


    return {

      name:
        this.name,

      version:
        this.version,

      system:
        this.system,

      initialized:
        this.initialized,

      totalModules:
        this.modules.length,

      enabledModules:
        this.modules.filter(
          module =>
            module.enabled === true
        ).length,

      requiredModules:
        this.modules.filter(
          module =>
            module.required === true
        ).length,

      optionalModules:
        this.modules.filter(
          module =>
            module.required === false
        ).length,

      groups,

      valid:
        this.validationErrors.length === 0,

      validationErrors:
        [...this.validationErrors]

    };

  }

};


/* =========================================================
   15. EXPOSICIÓN GLOBAL

   Permite acceder al Registry desde otros módulos y desde
   la consola del navegador.
========================================================= */

window.AIONRegistry =
  AIONRegistry;


/* =========================================================
   16. INICIALIZACIÓN AUTOMÁTICA
========================================================= */

AIONRegistry.init();