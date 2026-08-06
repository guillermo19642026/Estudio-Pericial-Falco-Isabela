/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 02 — COMUNICACIÓN EFECTIVA
   Archivo: modulo-02.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-02",

  courseId: "escuela-padres",

  number: 2,

  title: "Comunicación efectiva",

  subtitle:
    "Escuchar, comprender y construir confianza.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * Duración provisoria.
   * La ajustaremos exactamente después de generar la voz.
   */

  duration: 232,

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
      "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-02-parte-01.mp3",
    start: 0
  },

  {
    id: "parte-02",
    source:
      "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-02-parte-02.mp3",
    start: 109.5
  }

],

    music:
      "./THEME/audio/music/falco-learning-base.mp3",

    imageDirectory:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-02/",

    poster:
      "./CONTENT/cursos/escuela-padres/imagenes/modulo-02/portada.jpg"

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

      end: 14,

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
          "Módulo 2",

        subtitle:
          "Comunicación efectiva",

        supportingText:
          "Escuchar, comprender y construir confianza."

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

      start: 14,

      end: 34,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Durante la adolescencia también cambia la manera de comunicarse.",

        secondaryText:
          "El diálogo necesita nuevas formas de encuentro."

      },

      emphasis: [

        "comunicarse",

        "encuentro"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — CAMBIOS EN LA COMUNICACIÓN
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "concept-list",

      start: 34,

      end: 58,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional"

      },

      content: {

        eyebrow:
          "Una comunicación que evoluciona",

        title:
          "El vínculo permanece, aunque el diálogo cambie.",

        items: [

          {

            text:
              "Aparecen silencios y respuestas más breves.",

            icon:
              "message-circle"

          },

          {

            text:
              "Crece la necesidad de intimidad.",

            icon:
              "lock-keyhole"

          },

          {

            text:
              "Se cuestionan normas y decisiones.",

            icon:
              "messages-square"

          },

          {

            text:
              "La opinión de los pares cobra mayor importancia.",

            icon:
              "users-round"

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
       ESCENA 04 — ESCUCHAR DETRÁS DE LAS PALABRAS
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "image-focus",

      start: 58,

      end: 82,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {

        type: "image",

        source:
          "./CONTENT/cursos/escuela-padres/imagenes/modulo-02/conversacion-familiar.jpg",

        overlay: 0.64,

        fit: "cover",

        position: "center"

      },

      content: {

        eyebrow:
          "Comprender antes de responder",

        title:
          "Detrás de cada palabra también hay una emoción.",

        text:
          "Escuchar implica atender lo que se dice, lo que se siente y también aquello que cuesta expresar."

      },

      animation: {

        image: "ken-burns",

        title: "fade-up",

        text: "fade-up"

      }

    },


    /* -----------------------------------------------------
       ESCENA 05 — BARRERAS Y ALTERNATIVAS
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "comparison",

      start: 82,

      end: 110,

      transitionIn: "fade",

      transitionOut: "particles",

      background: {

        type: "ambient",

        variant: "navy"

      },

      content: {

        eyebrow:
          "Dos maneras de comunicarnos",

        title:
          "Algunas respuestas generan distancia. Otras abren diálogo.",

        left: {

          label:
            "Lo que dificulta",

          items: [

            "Interrumpir.",

            "Minimizar emociones.",

            "Etiquetar.",

            "Comparar."

          ]

        },

        right: {

          label:
            "Lo que favorece",

          items: [

            "Escuchar con atención.",

            "Validar lo que siente.",

            "Preguntar antes de suponer.",

            "Acompañar sin invadir."

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

      start: 110,

      end: 130,

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
          "Significa reconocer lo que el otro está sintiendo antes de orientar."

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

      start: 130,

      end: 166,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional"

      },

      content: {

        eyebrow:
          "Herramientas para el diálogo",

        title:
          "Tres actitudes que fortalecen la comunicación.",

        tools: [

          {

            number:
              "01",

            title:
              "Escuchar antes de responder",

            text:
              "No toda conversación necesita una solución inmediata."

          },

          {

            number:
              "02",

            title:
              "Preguntar con interés genuino",

            text:
              "Las preguntas abiertas permiten comprender mejor lo que está viviendo."

          },

          {

            number:
              "03",

            title:
              "Hablar con claridad y respeto",

            text:
              "Los límites pueden expresarse sin ironías, etiquetas ni desvalorizaciones."

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

      start: 166,

      end: 190,

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
          "La comunicación se construye en lo cotidiano.",

        points: [

          "Crear momentos compartidos favorece el diálogo.",

          "Reconocer los propios errores también enseña.",

          "Los conflictos pueden convertirse en oportunidades de aprendizaje.",

          "Escuchar fortalece la confianza y el vínculo familiar."

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

      start: 190,

      end: 232,

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
          "Escuchar también es una forma de amar.",

        text:
          "La disponibilidad emocional, el respeto y la coherencia ayudan a sostener el vínculo incluso en las conversaciones difíciles.",

        nextModule: {

          label:
            "Próximo encuentro",

          title:
            "Emociones y autoestima"

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

      time: 14,

      label:
        "La comunicación cambia"

    },

    {

      time: 34,

      label:
        "Nuevas formas de diálogo"

    },

    {

      time: 58,

      label:
        "Escuchar emociones"

    },

    {

      time: 82,

      label:
        "Barreras y alternativas"

    },

    {

      time: 110,

      label:
        "Validación emocional"

    },

    {

      time: 130,

      label:
        "Herramientas prácticas"

    },

    {

      time: 166,

      label:
        "Síntesis"

    },

    {

      time: 190,

      label:
        "Cierre"

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

      "comunicación",

      "escucha activa",

      "validación emocional",

      "adolescencia",

      "vínculo familiar"

    ]

  }

});