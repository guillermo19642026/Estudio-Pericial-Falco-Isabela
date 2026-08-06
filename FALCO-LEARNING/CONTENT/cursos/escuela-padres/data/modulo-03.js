/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 03 — EMOCIONES Y AUTOESTIMA
   Archivo: modulo-03.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-03",

  courseId: "escuela-padres",

  number: 3,

  title: "Emociones y autoestima",

  subtitle:
  "Comprender, validar y fortalecer.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * Duración provisoria.
   * La ajustaremos exactamente después de generar la voz.
   */

  duration: 106,

  language: "es-AR",

  version: "1.0.0",


  /* =======================================================
     ARCHIVOS DEL MÓDULO
  ======================================================= */

  media: {

    /*
     * Las narraciones se cargarán después de generar
     * los archivos de voz definitivos.
     */

    narrations: [

  {
    id: "parte-01",
    source:
      "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-03-parte-01.mp3",
    start: 0
  },

  {
    id: "parte-02",
    source:
      "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-03-parte-02.mp3",
    start: 54.2
  }

],

    music:
      "./THEME/audio/music/falco-learning-base.mp3",

    imageDirectory:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-03/",

    poster:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-03/portada.jpg"

  },


  /* =======================================================
     CONFIGURACIÓN AUDIOVISUAL
  ======================================================= */

  audiovisual: {

    startMuted: true,

    musicVolume: 0.16,

    voiceVolume: 1,

    fadeInDuration: 2500,

    fadeOutDuration: 4000,

    showParticles: true,

    showProgress: true,

    showSceneIndicator: true,

    allowSeeking: true

  },


  /* =======================================================
     ESCENAS
  ======================================================= */

  scenes: [

    /* -----------------------------------------------------
   ESCENA 01 — APERTURA
------------------------------------------------------ */

{

  id: "escena-01",

  type: "opening",

  start: 0,

  end: 10,

  transitionIn: "fade",

  transitionOut: "light",

  background: {

    type: "ambient",

    variant: "deep-blue",

    particles: true

  },

  content: {

    eyebrow:
      "Escuela para Padres FALCO®",

    title:
      "Módulo 3",

    subtitle:
      "Emociones y autoestima",

    supportingText:
      "Comprender, validar y fortalecer."

  },

  animation: {

    title: "fade-up",

    subtitle: "fade-up",

    delay: 350

  }

},


/* -----------------------------------------------------
   ESCENA 02 — FRASE DE APERTURA
------------------------------------------------------ */

{

  id: "escena-02",

  type: "statement",

  start: 10,

  end: 22,

  transitionIn: "light",

  transitionOut: "fade",

  background: {

    type: "ambient",

    variant: "soft-gold",

    particles: true

  },

  content: {

    text:
      "Las emociones no son un problema.",

    secondaryText:
      "Son información sobre aquello que estamos viviendo."

  },

  emphasis: [

    "emociones",

    "información"

  ],

  animation: {

    text: "words-reveal",

    secondaryText: "fade-up",

    delay: 300

  }

},


/* -----------------------------------------------------
   ESCENA 03 — FUNCIÓN DE LAS EMOCIONES
------------------------------------------------------ */

{

  id: "escena-03",

  type: "concept-list",

  start: 22,

  end: 36,

  transitionIn: "fade",

  transitionOut: "camera",

  background: {

    type: "gradient",

    variant: "institutional"

  },

  content: {

    eyebrow:
      "Comprender lo que sentimos",

    title:
      "Todas las emociones cumplen una función.",

    items: [

      {

        text:
          "Nos alertan frente a situaciones importantes.",

        icon:
          "bell-ring"

      },

      {

        text:
          "Nos ayudan a adaptarnos.",

        icon:
          "refresh-cw"

      },

      {

        text:
          "Facilitan la comunicación.",

        icon:
          "messages-square"

      },

      {

        text:
          "Orientan nuestras decisiones.",

        icon:
          "compass"

      }

    ]

  },

  animation: {

    title: "fade-up",

    items: "stagger-up",

    stagger: 450

  }

},

    /* -----------------------------------------------------
   ESCENA 04 — ACOMPAÑAMIENTO EMOCIONAL
------------------------------------------------------ */

{

  id: "escena-04",

  type: "image-focus",

  start: 36,

  end: 54,

  transitionIn: "camera",

  transitionOut: "fade",

  background: {

    type: "image",

    source:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-03/acompanamiento.jpg",

    overlay: 0.64,

    fit: "cover",

    position: "center"

  },

  content: {

    eyebrow:
      "Presencia adulta",

    title:
      "Las emociones necesitan comprensión, no descalificación.",

    text:
      "Acompañar implica ayudar a reconocer, nombrar y expresar lo que sienten de una manera saludable."

  },

  animation: {

    image: "ken-burns",

    title: "fade-up",

    text: "fade-up"

  }

},


/* -----------------------------------------------------
   ESCENA 05 — VALIDAR O INVALIDAR
------------------------------------------------------ */

{

  id: "escena-05",

  type: "comparison",

  start: 54,

  end: 68,

  transitionIn: "fade",

  transitionOut: "particles",

  background: {

    type: "ambient",

    variant: "navy"

  },

  content: {

    eyebrow:
      "Dos formas de responder",

    title:
      "Las palabras adultas pueden cerrar o abrir el diálogo.",

    left: {

      label:
        "Lo que dificulta",

      items: [

        "No es para tanto.",

        "Dejá de exagerar.",

        "No tenés motivos para sentirte así.",

        "A tu edad yo no hacía drama."

      ]

    },

    right: {

      label:
        "Lo que ayuda",

      items: [

        "Entiendo que esto fue importante para vos.",

        "Tiene sentido que te sientas así.",

        "Gracias por contármelo.",

        "Estoy acá para ayudarte."

      ]

    }

  },

  animation: {

    title: "fade-up",

    left: "slide-left",

    right: "slide-right"

  }

},


/* -----------------------------------------------------
   ESCENA 06 — FRASE CENTRAL
------------------------------------------------------ */

{

  id: "escena-06",

  type: "quote",

  start: 68,

  end: 80,

  transitionIn: "particles",

  transitionOut: "light",

  background: {

    type: "ambient",

    variant: "gold-focus",

    particles: true

  },

  content: {

    quote:
      "Validar una emoción no significa aprobar cualquier conducta.",

    continuation:
      "Significa reconocer lo que el otro siente antes de orientar o poner un límite."

  },

  animation: {

    quote: "words-reveal",

    continuation: "fade-up",

    delay: 500

  }

},

/* -----------------------------------------------------
   ESCENA 07 — HERRAMIENTAS PRÁCTICAS
------------------------------------------------------ */

{

  id: "escena-07",

  type: "tools",

  start: 80,

  end: 92,

  transitionIn: "light",

  transitionOut: "fade",

  background: {

    type: "gradient",

    variant: "institutional"

  },

  content: {

    eyebrow:
      "Herramientas para acompañar",

    title:
      "Tres actitudes que fortalecen la autoestima.",

    tools: [

      {

        number:
          "01",

        title:
          "Reconocer fortalezas",

        text:
          "Ayudar a descubrir recursos propios favorece una mirada más segura de sí mismos."

      },

      {

        number:
          "02",

        title:
          "Valorar el esfuerzo",

        text:
          "Reconocer el proceso sostiene la motivación incluso cuando el resultado no es perfecto."

      },

      {

        number:
          "03",

        title:
          "Acompañar los errores",

        text:
          "Equivocarse forma parte del aprendizaje y no define el valor personal."

      }

    ]

  },

  animation: {

    title: "fade-up",

    tools: "stagger-up",

    stagger: 650

  }

},


/* -----------------------------------------------------
   ESCENA 08 — SÍNTESIS
------------------------------------------------------ */

{

  id: "escena-08",

  type: "summary",

  start: 92,

  end: 100,

  transitionIn: "fade",

  transitionOut: "light",

  background: {

    type: "ambient",

    variant: "deep-blue",

    particles: true

  },

  content: {

    eyebrow:
      "Para recordar",

    title:
      "La autoestima se construye en el vínculo.",

    points: [

      "Todas las emociones aportan información.",

      "Regular no significa reprimir.",

      "Validar fortalece la confianza.",

      "Los adolescentes necesitan sentirse vistos, escuchados y valorados."

    ]

  },

  animation: {

    title: "fade-up",

    points: "stagger-fade",

    stagger: 400

  }

},


/* -----------------------------------------------------
   ESCENA 09 — CIERRE
------------------------------------------------------ */

{

  id: "escena-09",

  type: "closing",

  start: 100,

  end: 106,

  transitionIn: "light",

  transitionOut: "fade",

  background: {

    type: "ambient",

    variant: "closing",

    particles: true

  },

  content: {

    eyebrow:
      "Escuela para Padres FALCO®",

    title:
      "Acompañar también es fortalecer.",

    text:
      "La autoestima no se construye desde la perfección, sino desde la experiencia de sentirse valioso aun cuando aparecen errores o dificultades.",

    nextModule: {

      label:
        "Próximo encuentro",

      title:
        "Límites saludables y autonomía"

    }

  },

  animation: {

    title: "fade-up",

    text: "fade-up",

    nextModule: "fade-up"

  }

}

],


/* =======================================================
   CAPÍTULOS DE LA LÍNEA DE TIEMPO
======================================================= */

chapters: [

  {
    time: 0,
    label: "Presentación"
  },

  {
    time: 10,
    label: "El valor de las emociones"
  },

  {
    time: 22,
    label: "Comprender lo que sentimos"
  },

  {
    time: 36,
    label: "Acompañamiento emocional"
  },

  {
    time: 54,
    label: "Validación emocional"
  },

  {
    time: 68,
    label: "Comprender antes de orientar"
  },

  {
    time: 80,
    label: "Fortalecer la autoestima"
  },

  {
    time: 92,
    label: "Síntesis"
  },

  {
    time: 100,
    label: "Cierre"
  }

],


/* =======================================================
   METADATOS
======================================================= */

metadata: {

  estimatedMinutes: 4,

  category:
    "Orientación familiar",

  audience: [

    "Madres",

    "Padres",

    "Referentes adultos",

    "Cuidadores"

  ],

  keywords: [

    "emociones",

    "autoestima",

    "validación emocional",

    "regulación emocional",

    "adolescencia",

    "acompañamiento familiar"

  ]

}

});