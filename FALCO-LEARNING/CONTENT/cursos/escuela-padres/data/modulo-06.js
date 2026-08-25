/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 06 — LÍMITES SALUDABLES
   Archivo: modulo-06.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-06",

  courseId: "escuela-padres",

  number: 6,

  title: "Límites saludables",

  subtitle:
    "Acompañar con firmeza, afecto y coherencia.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * DURACIÓN REAL DE LAS NARRACIONES
   *
   * Parte 01: 49.85 s
   * Parte 02: 46.90 s
   * Parte 03: 152.58 s
   * Parte 04: 237.90 s
   *
   * Total: 487.23 s
   * Aproximadamente 08:07
   */

  duration: 487.23,

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
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-06-parte-01.mp3",
        start: 0
      },

      {
        id: "parte-02",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-06-parte-02.mp3",
        start: 49.85
      },

      {
        id: "parte-03",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-06-parte-03.mp3",
        start: 96.75
      },

      {
        id: "parte-04",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-06-parte-04.mp3",
        start: 249.33
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
       ESCENA 01 — APERTURA
       00:00 → 00:14
    ------------------------------------------------------ */

    {

      id: "escena-01",

      type: "opening",

      start: 0,

      end: 13.80,

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
          "Módulo 6",

        subtitle:
          "Límites saludables",

        supportingText:
          "Acompañar con firmeza, afecto y coherencia."

      },

      animation: {

        title: "fade-up",

        subtitle: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 02 — FUNCIÓN DE LOS LÍMITES
       00:14 → 00:50
    ------------------------------------------------------ */

    {

      id: "escena-02",

      type: "statement",

      start: 13.80,

      end: 49.85,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Los límites no son obstáculos para crecer.",

        secondaryText:
          "Ofrecen orientación, protección y oportunidades para aprender a tomar decisiones responsables."

      },

      emphasis: [

        "límites",

        "protección",

        "responsables"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — LÍMITES Y AMOR
       00:50 → 01:17
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "quote",

      start: 49.85,

      end: 76.90,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "Poner límites también es una forma de cuidar.",

        continuation:
          "El afecto y la firmeza pueden convivir en una misma respuesta adulta."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 04 — AUTONOMÍA Y PRESENCIA ADULTA
       01:17 → 01:37
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "statement",

      start: 76.90,

      end: 96.75,

      transitionIn: "light",

      transitionOut: "camera",

      background: {

        type: "ambient",

        variant: "deep-blue",

        particles: true

      },

      content: {

        text:
          "Durante la adolescencia crece la necesidad de autonomía.",

        secondaryText:
          "El desafío adulto es encontrar equilibrio entre cuidado y libertad, firmeza y flexibilidad."

      },

      emphasis: [

        "autonomía",

        "equilibrio"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 05 — AUTORIDAD SALUDABLE
       01:37 → 02:20
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "comparison",

      start: 96.75,

      end: 140.20,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "navy",

        particles: true

      },

      content: {

        eyebrow:
          "El rol adulto",

        title:
          "Autoridad saludable no es autoritarismo.",

        left: {

          label:
            "Autoritarismo",

          items: [

            "Impone sin explicar.",

            "Utiliza miedo o castigo.",

            "Ofrece poco espacio de escucha.",

            "Busca obediencia inmediata."

          ]

        },

        right: {

          label:
            "Autoridad saludable",

          items: [

            "Escucha.",

            "Explica los motivos.",

            "Sostiene límites necesarios.",

            "Actúa con respeto y coherencia."

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
       ESCENA 06 — PERMISIVIDAD
       02:20 → 02:53
    ------------------------------------------------------ */

    {

      id: "escena-06",

      type: "statement",

      start: 140.20,

      end: 172.80,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Evitar todos los conflictos tampoco ayuda.",

        secondaryText:
          "La ausencia de límites claros puede generar inseguridad y dificultar el aprendizaje de la responsabilidad."

      },

      emphasis: [

        "límites claros",

        "responsabilidad"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 07 — CÓMO ESTABLECER LÍMITES
       02:53 → 03:34
    ------------------------------------------------------ */

    {

      id: "escena-07",

      type: "tools",

      start: 172.80,

      end: 214.10,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Herramientas concretas",

        title:
          "Un límite saludable necesita claridad y coherencia.",

        tools: [

          {

            number:
              "01",

            title:
              "Expresar con claridad",

            text:
              "Comunicar qué se espera evitando amenazas o descalificaciones."

          },

          {

            number:
              "02",

            title:
              "Explicar",

            text:
              "Ayudar a comprender el motivo de una norma cuando sea posible."

          },

          {

            number:
              "03",

            title:
              "Sostener",

            text:
              "Aplicar consecuencias relacionadas con la conducta sin responder impulsivamente."

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
       ESCENA 08 — COHERENCIA ADULTA
       03:34 → 04:09
    ------------------------------------------------------ */

    {

      id: "escena-08",

      type: "quote",

      start: 214.10,

      end: 249.33,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "Los adolescentes observan mucho más de lo que parece.",

        continuation:
          "La coherencia también implica reconocer errores, reparar y asumir responsablemente el lugar adulto."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 09 — CUESTIONAR LAS NORMAS
       04:09 → 04:57
    ------------------------------------------------------ */

    {

      id: "escena-09",

      type: "concept-list",

      start: 249.33,

      end: 297.00,

      transitionIn: "light",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Cuestionar también es crecer",

        title:
          "No todo cuestionamiento representa falta de respeto.",

        items: [

          {

            text:
              "Crece el pensamiento crítico.",

            icon:
              "brain"

          },

          {

            text:
              "Aumenta la necesidad de participar en las decisiones.",

            icon:
              "messages-square"

          },

          {

            text:
              "Se ensayan nuevas formas de independencia.",

            icon:
              "route"

          },

          {

            text:
              "Se construye una identidad propia.",

            icon:
              "fingerprint"

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
       ESCENA 10 — AUTONOMÍA PROGRESIVA
       04:57 → 05:46
    ------------------------------------------------------ */

    {

      id: "escena-10",

      type: "statement",

      start: 297.00,

      end: 345.75,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "deep-blue",

        particles: true

      },

      content: {

        text:
          "La autonomía no aparece de un día para el otro.",

        secondaryText:
          "Se construye gradualmente mediante experiencias, responsabilidades y decisiones acordes con la edad y la madurez."

      },

      emphasis: [

        "autonomía",

        "gradualmente"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 11 — ACUERDOS FAMILIARES
       05:46 → 06:36
    ------------------------------------------------------ */

    {

      id: "escena-11",

      type: "tools",

      start: 345.75,

      end: 396.20,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Construir acuerdos",

        title:
          "Algunas normas pueden conversarse. Otras necesitan mayor firmeza.",

        tools: [

          {

            number:
              "01",

            title:
              "Conversar",

            text:
              "Escuchar necesidades y puntos de vista."

          },

          {

            number:
              "02",

            title:
              "Acordar",

            text:
              "Definir expectativas y responsabilidades comprensibles."

          },

          {

            number:
              "03",

            title:
              "Revisar",

            text:
              "Modificar acuerdos cuando el crecimiento y las circunstancias lo permitan."

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
       ESCENA 12 — CUANDO UN ACUERDO NO SE CUMPLE
       06:36 → 07:10
    ------------------------------------------------------ */

    {

      id: "escena-12",

      type: "statement",

      start: 396.20,

      end: 430.15,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Cuando un acuerdo no se cumple, el enojo no tiene que decidir la respuesta.",

        secondaryText:
          "Podemos revisar qué ocurrió, sostener consecuencias relacionadas y pensar qué necesita modificarse."

      },

      emphasis: [

        "consecuencias",

        "modificarse"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 13 — SÍNTESIS
       07:10 → 07:44
    ------------------------------------------------------ */

    {

      id: "escena-13",

      type: "summary",

      start: 430.15,

      end: 464.35,

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
          "El objetivo final es favorecer una autonomía responsable.",

        points: [

          "Los límites también expresan cuidado.",

          "Autoridad no es autoritarismo.",

          "Escuchar no significa necesariamente ceder.",

          "La coherencia fortalece la confianza.",

          "La autonomía se construye progresivamente.",

          "Firmeza y afecto pueden convivir."

        ]

      },

      animation: {

        title: "fade-up",

        points: "stagger-fade",

        stagger: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 14 — CIERRE
       07:44 → 08:07
    ------------------------------------------------------ */

    {

      id: "escena-14",

      type: "closing",

      start: 464.35,

      end: 487.23,

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
          "Poner límites también es cuidar.",

        text:
          "Acompañar significa ofrecer una guía firme y afectuosa mientras el adolescente desarrolla criterios propios para cuidarse y tomar decisiones responsables.",

        nextModule: {

          label:
            "Próximo encuentro",

          title:
            "Salud mental adolescente"

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
      time: 13.80,
      label: "Función de los límites"
    },

    {
      time: 49.85,
      label: "Límites y cuidado"
    },

    {
      time: 76.90,
      label: "Autonomía y presencia"
    },

    {
      time: 96.75,
      label: "Autoridad saludable"
    },

    {
      time: 140.20,
      label: "Permisividad"
    },

    {
      time: 172.80,
      label: "Cómo establecer límites"
    },

    {
      time: 214.10,
      label: "Coherencia adulta"
    },

    {
      time: 249.33,
      label: "Cuestionar las normas"
    },

    {
      time: 297.00,
      label: "Autonomía progresiva"
    },

    {
      time: 345.75,
      label: "Acuerdos familiares"
    },

    {
      time: 396.20,
      label: "Incumplimiento de acuerdos"
    },

    {
      time: 430.15,
      label: "Síntesis"
    },

    {
      time: 464.35,
      label: "Cierre"
    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 9,

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

      "límites saludables",

      "adolescencia",

      "autoridad",

      "autoritarismo",

      "permisividad",

      "autonomía",

      "coherencia",

      "acuerdos familiares",

      "responsabilidad",

      "cuidado"

    ]

  }

});