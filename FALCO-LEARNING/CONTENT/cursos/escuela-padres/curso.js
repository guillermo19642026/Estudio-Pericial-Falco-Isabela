/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   CURSO: ESCUELA PARA PADRES FALCO®
   Archivo: curso.js
========================================================= */

"use strict";


window.FALCO_LX_COURSE = Object.freeze({

  /* =======================================================
     IDENTIDAD GENERAL
  ======================================================= */

  id: "escuela-padres",

  slug: "escuela-padres",

  title: "Escuela para Padres FALCO®",

  subtitle:
    "Programa de orientación familiar para acompañar la crianza y la adolescencia.",

  institution: "Sistema FALCO®",

  author: "Lic. en Psicología Isabela Falco",

  language: "es-AR",

  version: "1.0.0",


  /* =======================================================
     PRESENTACIÓN
  ======================================================= */

  presentation: {

    eyebrow:
      "Programa de orientación familiar",

    headline:
      "Comprender, acompañar y crecer en familia.",

    description:
      "Una experiencia formativa organizada en ocho encuentros para acompañar a madres, padres y referentes adultos en los desafíos cotidianos de la crianza.",

    openingMessage:
      "Acompañar también es aprender a mirar de una manera nueva.",

    closingMessage:
      "Cada pequeño cambio en la forma de acompañar puede transformar profundamente un vínculo."

  },


  /* =======================================================
     ESTRUCTURA DEL CURSO
  ======================================================= */

  structure: {

    totalModules: 8,

    moduleLabelSingular: "Módulo",

    moduleLabelPlural: "Módulos",

    showModuleNumber: true,

    showModuleProgress: true,

    allowSequentialNavigation: true,

    allowFreeNavigation: false

  },


  /* =======================================================
     MÓDULOS
  ======================================================= */

  modules: [

    {
      id: "modulo-01",
      number: 1,
      title: "Comprender la adolescencia",
      subtitle:
        "Cambios, desafíos y nuevas necesidades.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-01.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-01.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-01/",
      enabled: true
    },

    {
      id: "modulo-02",
      number: 2,
      title: "Comunicación familiar",
      subtitle:
        "Escuchar, comprender y construir diálogo.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-02.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-02.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-02/",
      enabled: false
    },

    {
      id: "modulo-03",
      number: 3,
      title: "Límites que acompañan",
      subtitle:
        "Autoridad, cuidado y construcción de autonomía.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-03.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-03.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-03/",
      enabled: false
    },

    {
      id: "modulo-04",
      number: 4,
      title: "Autoestima e identidad",
      subtitle:
        "Acompañar la construcción de quiénes son.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-04.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-04.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-04/",
      enabled: false
    },

    {
      id: "modulo-05",
      number: 5,
      title: "Tecnología y vida cotidiana",
      subtitle:
        "Pantallas, redes y nuevos modos de vincularse.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-05.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-05.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-05/",
      enabled: false
    },

    {
      id: "modulo-06",
      number: 6,
      title: "Conflictos y emociones",
      subtitle:
        "Comprender lo que sucede detrás de cada reacción.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-06.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-06.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-06/",
      enabled: false
    },

    {
      id: "modulo-07",
      number: 7,
      title: "Vínculos y pertenencia",
      subtitle:
        "Familia, amistades y construcción del mundo propio.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-07.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-07/",
      enabled: false
    },

    {
      id: "modulo-08",
      number: 8,
      title: "Acompañar hacia la autonomía",
      subtitle:
        "Cuidar, confiar y aprender a soltar.",
      dataFile:
        "./CONTENT/cursos/escuela-padres/data/modulo-08.js",
      narration:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08.mp3",
      imageDirectory:
        "./CONTENT/cursos/escuela-padres/imagenes/modulo-08/",
      enabled: false
    }

  ],


  /* =======================================================
     IDENTIDAD SONORA
  ======================================================= */

  audio: {

    music:
      "./THEME/audio/music/falco-learning-base.mp3",

    openingEffect:
      "./THEME/audio/sfx/opening-light.mp3",

    transitionEffect:
      "./THEME/audio/sfx/soft-transition.mp3",

    closingEffect:
      "./THEME/audio/sfx/closing-light.mp3"

  },


  /* =======================================================
     IDENTIDAD VISUAL
  ======================================================= */

  visual: {

    theme: "falco-premium",

    logo:
      "./THEME/assets/logos/falco-learning-logo.svg",

    background:
      "./THEME/assets/backgrounds/falco-learning-background.jpg",

    defaultIllustration:
      "./THEME/assets/illustrations/falco-learning-default.png",

    showParticles: true,

    showAmbientLight: true,

    showInstitutionalLogo: true

  },


  /* =======================================================
     CIERRE DEL CURSO
  ======================================================= */

  completion: {

    showFinalMessage: true,

    finalMessage:
      "Gracias por formar parte de esta experiencia de aprendizaje.",

    showCertificateAccess: true,

    certificateLabel:
      "Acceder al certificado",

    showNextCourseSuggestion: false

  }

});