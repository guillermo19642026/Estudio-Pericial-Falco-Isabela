/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 05 — ADOLESCENCIA Y MUNDO DIGITAL
   Archivo: modulo-05.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-05",

  courseId: "escuela-padres",

  number: 5,

  title: "Adolescencia y mundo digital",

  subtitle:
    "Acompañar, cuidar y construir criterio en la vida digital.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * DURACIÓN REAL DE LAS NARRACIONES
   *
   * Parte 01: 50.88 s
   * Parte 02: 47.78 s
   * Parte 03: 144.88 s
   * Parte 04: 125.54 s
   *
   * Total: 369.08 s
   * Aproximadamente 06:09
   */

  duration: 369.08,

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
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-05-parte-01.mp3",
        start: 0
      },

      {
        id: "parte-02",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-05-parte-02.mp3",
        start: 50.88
      },

      {
        id: "parte-03",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-05-parte-03.mp3",
        start: 98.66
      },

      {
        id: "parte-04",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-05-parte-04.mp3",
        start: 243.54
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
       00:00 → 00:13
    ------------------------------------------------------ */

    {

      id: "escena-01",

      type: "opening",

      start: 0,

      end: 13.29,

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
          "Módulo 5",

        subtitle:
          "Adolescencia y mundo digital",

        supportingText:
          "Acompañar, cuidar y construir criterio en la vida digital."

      },

      animation: {

        title: "fade-up",

        subtitle: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 02 — CRECER EN LA ERA DIGITAL
       00:13 → 00:32
    ------------------------------------------------------ */

    {

      id: "escena-02",

      type: "statement",

      start: 13.29,

      end: 31.60,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Para los adolescentes, lo digital forma parte de la vida cotidiana.",

        secondaryText:
          "Es un espacio de comunicación, aprendizaje, expresión, entretenimiento y pertenencia."

      },

      emphasis: [

        "digital",

        "pertenencia"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 300

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — TECNOLOGÍA Y VÍNCULO FAMILIAR
       00:32 → 01:10
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "concept-list",

      start: 31.60,

      end: 69.95,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Tecnología y vínculo familiar",

        title:
          "La tecnología puede acercar o alejar.",

        items: [

          {

            text:
              "Compartir intereses y aprendizajes.",

            icon:
              "book-open"

          },

          {

            text:
              "Mantener vínculos y conversaciones.",

            icon:
              "messages-square"

          },

          {

            text:
              "Evitar que cada integrante quede aislado en su pantalla.",

            icon:
              "users"

          },

          {

            text:
              "Recuperar momentos cotidianos de encuentro.",

            icon:
              "heart-handshake"

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
       ESCENA 04 — BENEFICIOS DEL MUNDO DIGITAL
       01:10 → 01:39
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "tools",

      start: 69.95,

      end: 98.66,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Una mirada equilibrada",

        title:
          "El mundo digital también ofrece oportunidades.",

        tools: [

          {

            number:
              "01",

            title:
              "Aprender",

            text:
              "Acceder a información, estudiar y explorar nuevos intereses."

          },

          {

            number:
              "02",

            title:
              "Crear",

            text:
              "Expresarse, desarrollar habilidades y producir contenidos."

          },

          {

            number:
              "03",

            title:
              "Conectar",

            text:
              "Mantener vínculos, compartir intereses y participar en comunidades."

          }

        ]

      },

      animation: {

        title: "fade-up",

        tools: "stagger-up",

        stagger: 600

      }

    },


    /* -----------------------------------------------------
       ESCENA 05 — RIESGOS Y DESAFÍOS
       01:39 → 02:26
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "comparison",

      start: 98.66,

      end: 145.79,

      transitionIn: "light",

      transitionOut: "particles",

      background: {

        type: "ambient",

        variant: "navy",

        particles: true

      },

      content: {

        eyebrow:
          "Cuidado digital",

        title:
          "El mundo digital ofrece oportunidades y también desafíos.",

        left: {

          label:
            "Oportunidades",

          items: [

            "Aprendizaje.",

            "Creatividad.",

            "Comunicación.",

            "Participación."

          ]

        },

        right: {

          label:
            "Riesgos",

          items: [

            "Uso excesivo.",

            "Exposición inadecuada.",

            "Pérdida de privacidad.",

            "Contacto con desconocidos."

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
       ESCENA 06 — REDES SOCIALES Y AUTOESTIMA
       02:26 → 03:06
    ------------------------------------------------------ */

    {

      id: "escena-06",

      type: "quote",

      start: 145.79,

      end: 186.00,

      transitionIn: "particles",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "La aprobación virtual no define el valor personal.",

        continuation:
          "Las imágenes idealizadas y la comparación constante pueden influir en la forma en que el adolescente se percibe."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 07 — SITUACIONES DE RIESGO
       03:06 → 04:04
    ------------------------------------------------------ */

    {

      id: "escena-07",

      type: "tools",

      start: 186.00,

      end: 243.54,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Prevenir sin generar miedo",

        title:
          "Frente a situaciones digitales de riesgo, lo primero es proteger.",

        tools: [

          {

            number:
              "01",

            title:
              "Informar",

            text:
              "Conversar sobre privacidad, exposición, contactos desconocidos y cuidado de la información personal."

          },

          {

            number:
              "02",

            title:
              "Escuchar",

            text:
              "El adolescente necesita saber que puede pedir ayuda sin temor a ser humillado o castigado."

          },

          {

            number:
              "03",

            title:
              "Acompañar",

            text:
              "Frente a una situación de riesgo, escuchar y proteger antes de juzgar."

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
       ESCENA 08 — ACOMPAÑAR SIN INVADIR
       04:04 → 04:47
    ------------------------------------------------------ */

    {

      id: "escena-08",

      type: "statement",

      start: 243.54,

      end: 286.98,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Acompañar no significa vigilar permanentemente.",

        secondaryText:
          "Conversar antes de revisar, preguntar antes de acusar y escuchar antes de reaccionar favorece la confianza."

      },

      emphasis: [

        "acompañar",

        "confianza"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 09 — ACUERDOS Y AUTONOMÍA DIGITAL
       04:47 → 05:40
    ------------------------------------------------------ */

    {

      id: "escena-09",

      type: "summary",

      start: 286.98,

      end: 340.38,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "deep-blue",

        particles: true

      },

      content: {

        eyebrow:
          "Autonomía digital progresiva",

        title:
          "El objetivo no es controlar cada paso, sino formar criterio.",

        points: [

          "Construir acuerdos claros y revisables.",

          "Cuidar los momentos libres de pantallas.",

          "Aprender a proteger la privacidad.",

          "Pensar antes de publicar o compartir.",

          "Reconocer cuándo es necesario pedir ayuda.",

          "Los adultos también educamos con nuestro ejemplo."

        ]

      },

      animation: {

        title: "fade-up",

        points: "stagger-fade",

        stagger: 400

      }

    },


    /* -----------------------------------------------------
       ESCENA 10 — CIERRE
       05:40 → 06:09
    ------------------------------------------------------ */

    {

      id: "escena-10",

      type: "closing",

      start: 340.38,

      end: 369.08,

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
          "La tecnología cambia. El vínculo permanece.",

        text:
          "La presencia, el diálogo, los acuerdos y la confianza siguen siendo las principales herramientas para acompañar la vida digital adolescente.",

        nextModule: {

          label:
            "Próximo encuentro",

          title:
            "Límites saludables"

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

      time: 13.29,

      label:
        "Crecer en la era digital"

    },

    {

      time: 31.60,

      label:
        "Tecnología y vínculo"

    },

    {

      time: 69.95,

      label:
        "Beneficios"

    },

    {

      time: 98.66,

      label:
        "Riesgos y desafíos"

    },

    {

      time: 145.79,

      label:
        "Redes y autoestima"

    },

    {

      time: 186.00,

      label:
        "Cuidado digital"

    },

    {

      time: 243.54,

      label:
        "Acompañar sin invadir"

    },

    {

      time: 286.98,

      label:
        "Acuerdos y autonomía"

    },

    {

      time: 340.38,

      label:
        "Cierre"

    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 7,

    category:
      "Orientación familiar",

    audience: [

      "Madres",

      "Padres",

      "Referentes adultos",

      "Cuidadores"

    ],

    keywords: [

      "adolescencia",

      "mundo digital",

      "tecnología",

      "redes sociales",

      "autoestima",

      "grooming",

      "ciberacoso",

      "privacidad",

      "pantallas",

      "acuerdos digitales",

      "autonomía digital"

    ]

  }

});