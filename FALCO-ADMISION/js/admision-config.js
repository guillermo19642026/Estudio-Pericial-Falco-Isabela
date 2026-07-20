/* =========================================================
   FALCO Admisión™
   Configuration System v0.1
   Identidad, rutas, textos y parámetros generales
========================================================= */

const FalcoAdmisionConfig = {

  /* =======================================================
     IDENTIDAD
  ======================================================= */

  identity: {
    name: "FALCO Admisión™",
    shortName: "Admisión",
    version: "0.1.0",
    institution: "Estudio Pericial Psicológico",
    professional: "Lic. en Psicología Isabela Falco",
    assistant: "AION",
    project: "Sistema FALCO®"
  },

  /* =======================================================
     ENTORNO
  ======================================================= */

  environment: {
    mode: "development",
    debug: true,
    language: "es-AR",
    timezone: "America/Argentina/Buenos_Aires"
  },

  /* =======================================================
     RUTAS
  ======================================================= */

routes: {
    home: "index.html",
    admission: "perfil.html",
    confirmation: "confirmacion.html",

    admin: {
      login: "admin/login.html",
      dashboard: "admin/dashboard.html",
      detail: "admin/detalle-admision.html"
    },

    data: {
      persons: "data/preguntas-personas.json",
      professionals: "data/preguntas-profesionales.json",
      aionMessages: "data/mensajes-aion.json"
    }
  },

  /* =======================================================
     TIPOS DE INGRESO
  ======================================================= */

  audience: {
    person: {
      id: "persona",
      label: "Consulta personal o judicial",
      shortLabel: "Soy una persona",
      description:
        "Necesito orientación por una situación personal, familiar o judicial."
    },

    professional: {
      id: "profesional",
      label: "Consulta profesional",
      shortLabel: "Soy profesional",
      description:
        "Necesito supervisión, corrección de informes o asesoramiento profesional."
    }
  },

  /* =======================================================
     CATEGORÍAS PARA PERSONAS
  ======================================================= */

  personCategories: [
    {
      id: "pericia_psicologica",
      label: "Pericia psicológica",
      description:
        "Necesito una evaluación psicológica para presentar en una causa judicial."
    },
    {
      id: "perito_de_parte",
      label: "Perito de parte",
      description:
        "Necesito acompañamiento profesional en una pericia psicológica oficial."
    },
    {
      id: "danio_psiquico",
      label: "Daño psíquico",
      description:
        "Necesito evaluar las consecuencias psicológicas de un hecho."
    },
    {
      id: "informe_judicial",
      label: "Informe para presentar en un juzgado",
      description:
        "Necesito un informe psicológico vinculado con una situación judicial."
    },
    {
      id: "revinculacion",
      label: "Revinculación familiar",
      description:
        "La consulta está relacionada con el vínculo entre padres, madres e hijos."
    },
    {
      id: "cif",
      label: "Evaluación para el CIF",
      description:
        "Tengo que presentarme ante el Cuerpo Interdisciplinario Forense."
    },
    {
      id: "impugnacion",
      label: "Revisión o impugnación de un informe",
      description:
        "Necesito analizar un informe psicológico realizado por otro profesional."
    },
    {
      id: "orientacion_general",
      label: "No sé exactamente qué necesito",
      description:
        "Quiero explicar mi situación para que el Estudio pueda orientarme."
    }
  ],

  /* =======================================================
     CATEGORÍAS PARA PROFESIONALES
  ======================================================= */

  professionalCategories: [
    {
      id: "supervision_pericial",
      label: "Supervisión pericial",
      description:
        "Necesito supervisar una evaluación o una pericia psicológica."
    },
    {
      id: "correccion_informe",
      label: "Corrección de informe",
      description:
        "Necesito revisar, corregir o mejorar un informe profesional."
    },
    {
      id: "confeccion_escrito",
      label: "Asistencia con un escrito",
      description:
        "Necesito orientación para responder puntos periciales o presentar un escrito."
    },
    {
      id: "seguimiento_causa",
      label: "Seguimiento integral de una causa",
      description:
        "Necesito acompañamiento durante distintas etapas del trabajo pericial."
    },
    {
      id: "formacion",
      label: "Formación profesional",
      description:
        "Quiero consultar por talleres, cursos o entrenamiento pericial."
    },
    {
      id: "consulta_profesional",
      label: "Otra consulta profesional",
      description:
        "Necesito explicar una situación que no aparece en las opciones anteriores."
    }
  ],

  /* =======================================================
     ESTADOS DE UNA ADMISIÓN
  ======================================================= */

  admissionStatus: {
    draft: {
      id: "borrador",
      label: "Admisión iniciada"
    },

    inProgress: {
      id: "en_proceso",
      label: "Admisión en proceso"
    },

    completed: {
      id: "completada",
      label: "Admisión completada"
    },

    submitted: {
      id: "enviada",
      label: "Admisión enviada"
    },

    reviewed: {
      id: "revisada",
      label: "Admisión revisada"
    },

    contacted: {
      id: "contactada",
      label: "Persona contactada"
    },

    archived: {
      id: "archivada",
      label: "Admisión archivada"
    }
  },

  /* =======================================================
     CONFIGURACIÓN DE ENTREVISTA
  ======================================================= */

  interview: {
    oneQuestionAtATime: true,
    allowBackNavigation: true,
    allowRestart: true,
    saveLocally: true,
    autoSave: true,
    autoSaveDelay: 500,
    showProgress: true,
    requestBudgetInformation: false,
    requireAcceptanceBeforeSubmit: true
  },

  /* =======================================================
     CLAVES DE ALMACENAMIENTO LOCAL
  ======================================================= */

  storage: {
    session: "falco_admision_session",
    state: "falco_admision_state",
    answers: "falco_admision_answers",
    progress: "falco_admision_progress",
    completed: "falco_admision_completed"
  },

  /* =======================================================
     TEXTOS GENERALES
  ======================================================= */

  texts: {
    reception: {
      eyebrow: "Recepción digital del Estudio",

      title: "Contanos qué está ocurriendo.",

      highlightedTitle:
        "Vamos a organizar la información necesaria para orientarte.",

      description:
        "Este recorrido permite que el Estudio conozca tu situación antes del primer contacto profesional. No necesitás conocimientos legales ni psicológicos.",

      primaryAction: "Iniciar admisión",

      privacy:
        "La información será recibida y revisada exclusivamente por el Estudio."
    },

    assurances: [
      {
        title: "Es simple",
        description:
          "Vas a avanzar paso a paso, con una sola pregunta por vez."
      },
      {
        title: "No necesitás saber términos técnicos",
        description:
          "Las preguntas están formuladas de manera clara y cotidiana."
      },
      {
        title: "No estás contratando un servicio todavía",
        description:
          "Primero necesitamos conocer el motivo de tu consulta."
      }
    ],

    aion: {
      reception:
        "Voy a acompañarte durante este recorrido. Elegí las opciones que mejor describan tu situación.",

      start:
        "Comencemos. Primero necesito saber qué tipo de orientación estás buscando.",

      saved:
        "La información quedó guardada en este dispositivo.",

      restored:
        "Encontré una admisión que habías comenzado anteriormente.",

      validation:
        "Necesito que completes esta respuesta antes de continuar.",

      completed:
        "El recorrido está completo. Ahora podés revisar la información antes de enviarla.",

      submitted:
        "La admisión fue enviada correctamente al Estudio."
    },

    actions: {
      start: "Comenzar",
      continue: "Continuar",
      back: "Volver",
      next: "Siguiente",
      save: "Guardar",
      review: "Revisar información",
      submit: "Enviar al Estudio",
      restart: "Reiniciar admisión",
      finish: "Finalizar",
      close: "Cerrar"
    },

    validation: {
      required: "Esta respuesta es necesaria para continuar.",
      email: "Ingresá una dirección de correo válida.",
      phone: "Ingresá un número de teléfono válido.",
      minimumLength:
        "La respuesta necesita un poco más de información.",
      maximumLength:
        "La respuesta supera la extensión permitida.",
      generic:
        "Revisá la información ingresada antes de continuar."
    },

    confirmation: {
      title: "Tu admisión fue recibida.",
      description:
        "El Estudio revisará la información para determinar cómo continuar y se comunicará utilizando los datos proporcionados.",
      important:
        "El envío de esta admisión no implica todavía la aceptación del caso ni la contratación de un servicio."
    }
  },

  /* =======================================================
     LÍMITES DE CAMPOS
  ======================================================= */

  limits: {
    shortText: {
      min: 2,
      max: 120
    },

    mediumText: {
      min: 5,
      max: 500
    },

    longText: {
      min: 15,
      max: 3000
    },

    files: {
      maximumCount: 10,
      maximumSizeMB: 10
    }
  },

  /* =======================================================
     DOCUMENTOS ADMITIDOS
  ======================================================= */

  documents: {
    acceptedExtensions: [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".doc",
      ".docx"
    ],

    acceptedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
  },

  /* =======================================================
     UTILIDADES
  ======================================================= */

  getAudience(type) {
    return this.audience[type] || null;
  },

  getPersonCategory(categoryId) {
    return (
      this.personCategories.find(
        category => category.id === categoryId
      ) || null
    );
  },

  getProfessionalCategory(categoryId) {
    return (
      this.professionalCategories.find(
        category => category.id === categoryId
      ) || null
    );
  },

  getCategory(audienceType, categoryId) {
    if (audienceType === this.audience.person.id) {
      return this.getPersonCategory(categoryId);
    }

    if (audienceType === this.audience.professional.id) {
      return this.getProfessionalCategory(categoryId);
    }

    return null;
  },

  getRoute(routeName) {
    return this.routes[routeName] || null;
  },

  log(message, data = null) {
    if (!this.environment.debug) return;

    if (data !== null) {
      console.log(
        `[${this.identity.name}] ${message}`,
        data
      );

      return;
    }

    console.log(
      `[${this.identity.name}] ${message}`
    );
  }
};

/* =========================================================
   EXPORTACIÓN GLOBAL
========================================================= */

window.FalcoAdmisionConfig = FalcoAdmisionConfig;

FalcoAdmisionConfig.log(
  `${FalcoAdmisionConfig.identity.name} Configuration v${FalcoAdmisionConfig.identity.version} Ready`
);