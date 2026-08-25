
/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 04 — LÍMITES Y NORMAS EN LA ADOLESCENCIA
   Archivo: modulo-04.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-04",

  courseId: "escuela-padres",

  number: 4,

  title: "Límites y normas en la adolescencia",

  subtitle:
    "Acompañar con firmeza, claridad y respeto.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * Duración real aproximada de las cuatro narraciones:
   * Parte 01: 48.48 s
   * Parte 02: 44.90 s
   * Parte 03: 75.47 s
   * Parte 04: 95.35 s
   *
   * Total: 264.20 s
   */

  duration: 264.2,

  language: "es-AR",

  version: "1.2.0",


  /* =======================================================
     ARCHIVOS DEL MÓDULO
  ======================================================= */

  media: {

    narrations: [

      {
        id: "parte-01",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-04-parte-01.mp3",
        start: 0
      },

      {
        id: "parte-02",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-04-parte-02.mp3",
        start: 48.48
      },

      {
        id: "parte-03",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-04-parte-03.mp3",
        start: 93.38
      },

      {
        id: "parte-04",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-04-parte-04.mp3",
        start: 168.85
      }

    ],

    music:
      "./THEME/audio/music/falco-learning-base.mp3",

    imageDirectory:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-04/",

    poster:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-04/portada.jpg"

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

      end: 12.28,

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
          "Módulo 4",

        subtitle:
          "Límites y normas en la adolescencia",

        supportingText:
          "Acompañar con firmeza, claridad y respeto."

      },

      animation: {

        title: "fade-up",

        subtitle: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 02 — SENTIDO DE LOS LÍMITES
    ------------------------------------------------------ */

    {

      id: "escena-02",

      type: "statement",

      start: 12.28,

      end: 34.15,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Poner límites no significa controlar cada decisión.",

        secondaryText:
          "Significa ofrecer un marco que brinde seguridad, orientación y previsibilidad."

      },

      emphasis: [

        "límites",

        "seguridad"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — QUÉ NECESITAN LOS ADOLESCENTES
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "concept-list",

      start: 34.15,

      end: 72.34,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional"

      },

      content: {

        eyebrow:
          "Un marco que acompaña",

        title:
          "Los adolescentes necesitan autonomía, pero también referencias claras.",

        items: [

          {

            text:
              "Saber qué se espera de ellos.",

            icon:
              "compass"

          },

          {

            text:
              "Conocer las consecuencias de sus decisiones.",

            icon:
              "route"

          },

          {

            text:
              "Sentir que las reglas tienen un fundamento.",

            icon:
              "scale"

          },

          {

            text:
              "Encontrar adultos coherentes y disponibles.",

            icon:
              "users"

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
       ESCENA 04 — AUTORIDAD Y AUTORITARISMO
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "comparison",

      start: 72.34,

      end: 109.52,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "navy"

      },

      content: {

        eyebrow:
          "No es lo mismo",

        title:
          "La autoridad orienta. El autoritarismo impone.",

        left: {

          label:
            "Autoritarismo",

          items: [

            "Ordena sin explicar.",

            "Descalifica o amenaza.",

            "Exige obediencia inmediata.",

            "Reduce el espacio de diálogo."

          ]

        },

        right: {

          label:
            "Autoridad saludable",

          items: [

            "Explica con claridad.",

            "Escucha sin perder el rol adulto.",

            "Sostiene consecuencias proporcionales.",

            "Mantiene criterios consistentes."

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
       ESCENA 05 — COHERENCIA
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "quote",

      start: 109.52,

      end: 133.15,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "Un límite pierde fuerza cuando cambia según el enojo del adulto.",

        continuation:
          "La coherencia genera previsibilidad y ayuda a construir confianza."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 06 — CÓMO FORMULAR UNA NORMA
    ------------------------------------------------------ */

    {

      id: "escena-06",

      type: "tools",

      start: 133.15,

      end: 168.85,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional"

      },

      content: {

        eyebrow:
          "Una norma clara",

        title:
          "Tres claves para establecer límites que puedan sostenerse.",

        tools: [

          {

            number:
              "01",

            title:
              "Ser concreto",

            text:
              "La norma debe indicar con claridad qué se espera y en qué situación."

          },

          {

            number:
              "02",

            title:
              "Explicar el motivo",

            text:
              "Comprender el sentido de una regla facilita su aceptación."

          },

          {

            number:
              "03",

            title:
              "Definir consecuencias",

            text:
              "Las consecuencias deben ser conocidas, posibles y proporcionales."

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
       ESCENA 07 — NEGOCIAR SIN CEDER EL ROL
    ------------------------------------------------------ */

    {

      id: "escena-07",

      type: "image-focus",

      start: 168.85,

      end: 207.15,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "image",

        source:
          "./CONTENT/cursos/escuela-padres/imagenes/modulo-04/acuerdo-familiar.jpg",

        overlay: 0.64,

        fit: "cover",

        position: "center"

      },

      content: {

        eyebrow:
          "Flexibilidad con criterio",

        title:
          "Escuchar una propuesta no significa perder autoridad.",

        text:
          "Algunas normas pueden revisarse a medida que aumenta la responsabilidad. Otras deben mantenerse porque protegen la salud, la seguridad o el bienestar familiar."

      },

      animation: {

        image: "ken-burns",

        title: "fade-up",

        text: "fade-up"

      }

    },


    /* -----------------------------------------------------
       ESCENA 08 — SÍNTESIS
    ------------------------------------------------------ */

    {

      id: "escena-08",

      type: "summary",

      start: 207.15,

      end: 237.58,

      transitionIn: "camera",

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
          "Los límites también son una forma de cuidado.",

        points: [

          "Las normas necesitan claridad y coherencia.",

          "El diálogo no elimina el rol adulto.",

          "Las consecuencias deben guardar relación con la conducta.",

          "La autonomía se construye de manera progresiva."

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

      start: 237.58,

      end: 264.2,

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
          "Acompañar también implica sostener.",

        text:
          "Una presencia adulta firme, respetuosa y previsible ofrece al adolescente un marco desde el cual explorar su autonomía con mayor seguridad.",

        nextModule: {

          label:
            "Próximo encuentro",

          title:
            "Autonomía y responsabilidad"

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
        "Presentación"

    },

    {

      time: 12.28,

      label:
        "El sentido de los límites"

    },

    {

      time: 34.15,

      label:
        "Autonomía y referencias"

    },

    {

      time: 72.34,

      label:
        "Autoridad saludable"

    },

    {

      time: 109.52,

      label:
        "Coherencia"

    },

    {

      time: 133.15,

      label:
        "Cómo establecer una norma"

    },

    {

      time: 168.85,

      label:
        "Negociar con criterio"

    },

    {

      time: 207.15,

      label:
        "Síntesis"

    },

    {

      time: 237.58,

      label:
        "Cierre"

    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 5,

    category:
      "Orientación familiar",

    audience: [

      "Madres",

      "Padres",

      "Referentes adultos",

      "Cuidadores"

    ],

    keywords: [

      "límites",

      "normas",

      "adolescencia",

      "autoridad",

      "autonomía",

      "responsabilidad",

      "familia"

    ]

  }

});
