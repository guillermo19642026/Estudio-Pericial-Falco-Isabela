/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 07 — SALUD MENTAL ADOLESCENTE
   Archivo: modulo-07.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-07",

  courseId: "escuela-padres",

  number: 7,

  title: "Salud mental adolescente",

  subtitle:
    "Acompañar, observar y pedir ayuda cuando sea necesario.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * DURACIÓN DE LAS NARRACIONES
   *
   * Parte 01: 00:35 = 35 s
   * Parte 02: 02:08 = 128 s
   * Parte 03: 01:51 = 111 s
   * Parte 04: 01:21 = 81 s
   * Parte 05: 01:21 = 81 s
   *
   * Total: 07:16 = 436 s
   */

  duration: 436,

  language: "es-AR",

  version: "1.1.0",


  /* =======================================================
     ARCHIVOS DEL MÓDULO
  ======================================================= */

  media: {

    narrations: [

      {
        id: "parte-01",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07-parte-01.mp3",
        start: 0
      },

      {
        id: "parte-02",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07-parte-02.mp3",
        start: 35
      },

      {
        id: "parte-03",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07-parte-03.mp3",
        start: 163
      },

      {
        id: "parte-04",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07-parte-04.mp3",
        start: 274
      },

      {
        id: "parte-05",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-07-parte-05.mp3",
        start: 355
      }

    ],

    music:
      "./THEME/audio/music/falco-learning-base.mp3"

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
       ESCENA 01 — BIENVENIDA
       00:00 → 00:35
    ------------------------------------------------------ */

    {

      id: "escena-01",

      type: "opening",

      start: 0,

      end: 35,

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
          "Bienvenidos al Módulo 7",

        subtitle:
          "Salud mental adolescente",

        supportingText:
          "Observar, escuchar, estar disponibles y pedir ayuda cuando sea necesario."

      },

      animation: {

        title: "fade-up",

        subtitle: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 02 — UNA ETAPA DE CAMBIOS
       00:35 → 01:02
    ------------------------------------------------------ */

    {

      id: "escena-02",

      type: "statement",

      start: 35,

      end: 62,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "La adolescencia es una etapa de grandes transformaciones.",

        secondaryText:
          "Cambian las emociones, los vínculos, la manera de pensar y también la forma de relacionarse con el mundo."

      },

      emphasis: [

        "transformaciones",

        "emociones",

        "vínculos"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — QUÉ ENTENDEMOS POR SALUD MENTAL
       01:02 → 01:36
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "concept-list",

      start: 62,

      end: 96,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Salud mental",

        title:
          "No significa vivir sin dificultades.",

        items: [

          {
            text:
              "Reconocer y expresar emociones.",
            icon:
              "heart"
          },

          {
            text:
              "Afrontar situaciones difíciles.",
            icon:
              "shield"
          },

          {
            text:
              "Mantener vínculos significativos.",
            icon:
              "users"
          },

          {
            text:
              "Adaptarse a los cambios.",
            icon:
              "refresh-cw"
          },

          {
            text:
              "Pedir ayuda cuando resulte necesario.",
            icon:
              "hand-helping"
          }

        ]

      },

      animation: {

        title: "fade-up",

        items: "stagger-up",

        stagger: 420

      }

    },


    /* -----------------------------------------------------
       ESCENA 04 — CUÁNDO PRESTAR MAYOR ATENCIÓN
       01:36 → 02:43
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "quote",

      start: 96,

      end: 163,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "No todo malestar significa que exista un problema de salud mental.",

        continuation:
          "Cuando se vuelve intenso, persiste en el tiempo o interfiere significativamente con la vida cotidiana, puede ser necesario prestar mayor atención."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 05 — FACTORES PROTECTORES
       02:43 → 03:20
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "tools",

      start: 163,

      end: 200,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Factores protectores",

        title:
          "Hay recursos que pueden fortalecerse todos los días.",

        tools: [

          {

            number:
              "01",

            title:
              "Vínculos",

            text:
              "Familia, amistades y adultos significativos disponibles."

          },

          {

            number:
              "02",

            title:
              "Hábitos",

            text:
              "Sueño, alimentación, movimiento y espacios de recreación."

          },

          {

            number:
              "03",

            title:
              "Recursos emocionales",

            text:
              "Expresar emociones, resolver problemas y pedir ayuda."

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
       ESCENA 06 — FACTORES DE RIESGO
       03:20 → 03:57
    ------------------------------------------------------ */

    {

      id: "escena-06",

      type: "concept-list",

      start: 200,

      end: 237,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "ambient",

        variant: "navy",

        particles: true

      },

      content: {

        eyebrow:
          "Factores de riesgo",

        title:
          "Algunas situaciones pueden aumentar la vulnerabilidad emocional.",

        items: [

          {
            text:
              "Aislamiento persistente.",
            icon:
              "user-round-x"
          },

          {
            text:
              "Violencia o maltrato.",
            icon:
              "triangle-alert"
          },

          {
            text:
              "Acoso escolar o digital.",
            icon:
              "messages-square"
          },

          {
            text:
              "Experiencias traumáticas o pérdidas significativas.",
            icon:
              "cloud-rain"
          },

          {
            text:
              "Consumo problemático o conflictos familiares severos.",
            icon:
              "shield-alert"
          }

        ]

      },

      animation: {

        title: "fade-up",

        items: "stagger-up",

        stagger: 400

      }

    },


    /* -----------------------------------------------------
       ESCENA 07 — RIESGO NO SIGNIFICA DESTINO
       03:57 → 04:34
    ------------------------------------------------------ */

    {

      id: "escena-07",

      type: "statement",

      start: 237,

      end: 274,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Riesgo no significa destino.",

        secondaryText:
          "Identificar una situación de vulnerabilidad permite comprender mejor lo que ocurre y acompañar de manera temprana."

      },

      emphasis: [

        "Riesgo",

        "acompañar"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 400

      }

    },


    /* -----------------------------------------------------
       ESCENA 08 — SEÑALES DE ALERTA
       04:34 → 05:02
    ------------------------------------------------------ */

    {

      id: "escena-08",

      type: "concept-list",

      start: 274,

      end: 302,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Señales de alerta",

        title:
          "Algunos cambios merecen una mirada más atenta.",

        items: [

          {
            text:
              "Cambios intensos y persistentes del estado de ánimo.",
            icon:
              "activity"
          },

          {
            text:
              "Aislamiento progresivo.",
            icon:
              "user-round-minus"
          },

          {
            text:
              "Pérdida de interés.",
            icon:
              "circle-minus"
          },

          {
            text:
              "Alteraciones importantes del sueño o del apetito.",
            icon:
              "moon"
          },

          {
            text:
              "Desesperanza o conductas de riesgo.",
            icon:
              "triangle-alert"
          }

        ]

      },

      animation: {

        title: "fade-up",

        items: "stagger-up",

        stagger: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 09 — ANSIEDAD Y DEPRESIÓN
       05:02 → 05:55
    ------------------------------------------------------ */

    {

      id: "escena-09",

      type: "comparison",

      start: 302,

      end: 355,

      transitionIn: "fade",

      transitionOut: "particles",

      background: {

        type: "ambient",

        variant: "navy",

        particles: true

      },

      content: {

        eyebrow:
          "Ansiedad y depresión",

        title:
          "Importan la intensidad, la duración y la repercusión.",

        left: {

          label:
            "Ansiedad",

          items: [

            "Preocupación excesiva.",

            "Inquietud o tensión.",

            "Dificultad para relajarse.",

            "Necesidad intensa de controlar."

          ]

        },

        right: {

          label:
            "Manifestaciones depresivas",

          items: [

            "Tristeza persistente.",

            "Irritabilidad marcada.",

            "Pérdida de interés.",

            "Baja autoestima o desesperanza."

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
       ESCENA 10 — AUTOLESIONES
       05:55 → 06:17
    ------------------------------------------------------ */

    {

      id: "escena-10",

      type: "quote",

      start: 355,

      end: 377,

      transitionIn: "particles",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "Toda manifestación de sufrimiento merece ser escuchada.",

        continuation:
          "Las autolesiones no deben minimizarse ni interpretarse simplemente como una búsqueda de atención."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 11 — EXPRESIONES DE DESESPERANZA
       06:17 → 06:35
    ------------------------------------------------------ */

    {

      id: "escena-11",

      type: "statement",

      start: 377,

      end: 395,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "deep-blue",

        particles: true

      },

      content: {

        text:
          "Hay expresiones que siempre deben ser tomadas en serio.",

        secondaryText:
          "Escuchar, permanecer presentes y buscar ayuda profesional cuando exista riesgo."

      },

      emphasis: [

        "tomadas en serio",

        "ayuda"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 12 — CONSUMO PROBLEMÁTICO
       06:35 → 06:53
    ------------------------------------------------------ */

    {

      id: "escena-12",

      type: "statement",

      start: 395,

      end: 413,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "No todo consumo implica necesariamente una adicción.",

        secondaryText:
          "Los cambios bruscos, el deterioro cotidiano, los ocultamientos o los conflictos reiterados merecen atención."

      },

      emphasis: [

        "atención"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 13 — ACOMPAÑAR
       06:53 → 07:08
    ------------------------------------------------------ */

    {

      id: "escena-13",

      type: "tools",

      start: 413,

      end: 428,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Acompañar",

        title:
          "No necesitamos tener todas las respuestas.",

        tools: [

          {

            number:
              "01",

            title:
              "Escuchar",

            text:
              "Sin juzgar ni apresurarse a resolver."

          },

          {

            number:
              "02",

            title:
              "Validar",

            text:
              "Reconocer el sufrimiento sin minimizarlo."

          },

          {

            number:
              "03",

            title:
              "Pedir ayuda",

            text:
              "Consultar cuando la situación lo requiere."

          }

        ]

      },

      animation: {

        title: "fade-up",

        tools: "stagger-up",

        stagger: 450

      }

    },


    /* -----------------------------------------------------
       ESCENA 14 — CIERRE
       07:08 → 07:16
    ------------------------------------------------------ */

    {

      id: "escena-14",

      type: "closing",

      start: 428,

      end: 436,

      transitionIn: "fade",

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
          "Lo que te pasa me importa.",

        text:
          "La escucha, la presencia y la posibilidad de pedir ayuda pueden convertirse en recursos fundamentales de cuidado.",

        nextModule: {

          label:
            "Próximo encuentro",

          title:
            "Proyecto de vida y cierre"

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
      label:
        "Bienvenida"
    },

    {
      time: 35,
      label:
        "Una etapa de cambios"
    },

    {
      time: 62,
      label:
        "Qué es la salud mental"
    },

    {
      time: 96,
      label:
        "Cuándo prestar atención"
    },

    {
      time: 163,
      label:
        "Factores protectores"
    },

    {
      time: 200,
      label:
        "Factores de riesgo"
    },

    {
      time: 237,
      label:
        "Riesgo no significa destino"
    },

    {
      time: 274,
      label:
        "Señales de alerta"
    },

    {
      time: 302,
      label:
        "Ansiedad y depresión"
    },

    {
      time: 355,
      label:
        "Autolesiones"
    },

    {
      time: 377,
      label:
        "Expresiones de desesperanza"
    },

    {
      time: 395,
      label:
        "Consumo problemático"
    },

    {
      time: 413,
      label:
        "Cómo acompañar"
    },

    {
      time: 428,
      label:
        "Cierre"
    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 8,

    category:
      "Orientación familiar",

    audience: [

      "Madres",

      "Padres",

      "Referentes adultos",

      "Cuidadores"

    ],

    keywords: [

      "salud mental",

      "adolescencia",

      "factores protectores",

      "factores de riesgo",

      "señales de alerta",

      "ansiedad",

      "depresión",

      "autolesiones",

      "conducta suicida",

      "consumo problemático",

      "acompañamiento",

      "prevención"

    ]

  }

});