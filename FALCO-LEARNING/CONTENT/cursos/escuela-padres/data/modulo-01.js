/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 01 — COMPRENDER LA ADOLESCENCIA
   Archivo: modulo-01.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-01",

  courseId: "escuela-padres",

  number: 1,

  title: "Comprender la adolescencia",

  subtitle:
    "Cambios, desafíos y nuevas necesidades.",

  eyebrow:
    "Escuela para Padres FALCO®",

  duration: 225,

  language: "es-AR",

  version: "1.0.0",


  /* =======================================================
     ARCHIVOS DEL MÓDULO
  ======================================================= */

 media: {

  narrations: [

    {
      id: "parte-01",
      source:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-01-parte-01.mp3",
      start: 0
    },

    {
      id: "parte-02",
      source:
        "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-01-parte-02.mp3",
      start: 173.8
    }

  ],

  music:
    "./THEME/audio/music/falco-learning-base.mp3",

  imageDirectory:
    "./CONTENT/cursos/escuela-padres/imagenes/modulo-01/",

  poster:
    "./CONTENT/cursos/escuela-padres/imagenes/modulo-01/portada.jpg"

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
          "Módulo 1",

        subtitle:
          "Comprender la adolescencia",

        supportingText:
          "Cambios, desafíos y nuevas necesidades."

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

      end: 32,

      transitionIn: "light",

      transitionOut: "fade",

      background: {
        type: "ambient",
        variant: "soft-gold",
        particles: true
      },

      content: {

        text:
          "La adolescencia no es solamente una etapa de cambios.",

        secondaryText:
          "Es un proceso profundo de transformación."

      },

      emphasis: [
        "adolescencia",
        "transformación"
      ],

      animation: {
        text: "words-reveal",
        secondaryText: "fade-up",
        delay: 300
      }
    },


    /* -----------------------------------------------------
       ESCENA 03 — CAMBIOS
    ------------------------------------------------------ */

    {
      id: "escena-03",

      type: "concept-list",

      start: 32,

      end: 54,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {
        type: "gradient",
        variant: "institutional"
      },

      content: {

        eyebrow:
          "Una etapa de reorganización",

        title:
          "Todo empieza a cambiar.",

        items: [
          {
            text: "El cuerpo.",
            icon: "activity"
          },
          {
            text: "La manera de pensar.",
            icon: "brain"
          },
          {
            text: "Los vínculos.",
            icon: "users-round"
          },
          {
            text: "La forma de verse a sí mismos.",
            icon: "scan-face"
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
       ESCENA 04 — IMAGEN PRINCIPAL
    ------------------------------------------------------ */

    {
      id: "escena-04",

      type: "image-focus",

      start: 54,

      end: 76,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {
        type: "image",
        source:
       "./CONTENT/cursos/escuela-padres/imagenes/modulo-01/adolescente-reflexivo.jpg",
        overlay: 0.62,
        fit: "cover",
        position: "center"
      },

      content: {

        eyebrow:
          "Construcción de identidad",

        title:
          "Necesitan descubrir quiénes son.",

        text:
          "La búsqueda de autonomía, pertenencia e identidad forma parte del crecimiento."

      },

      animation: {
        image: "ken-burns",
        title: "fade-up",
        text: "fade-up"
      }
    },


    /* -----------------------------------------------------
       ESCENA 05 — MIRADA ADULTA
    ------------------------------------------------------ */

    {
      id: "escena-05",

      type: "comparison",

      start: 76,

      end: 100,

      transitionIn: "fade",

      transitionOut: "particles",

      background: {
        type: "ambient",
        variant: "navy"
      },

      content: {

        eyebrow:
          "Dos formas de interpretar",

        title:
          "Lo que parece desafío puede ser una necesidad.",

        left: {
          label: "Lo que observamos",
          items: [
            "Se distancia.",
            "Discute.",
            "Cuestiona.",
            "Busca privacidad."
          ]
        },

        right: {
          label: "Lo que puede estar necesitando",
          items: [
            "Construir autonomía.",
            "Ser escuchado.",
            "Explorar sus propias ideas.",
            "Definir un espacio personal."
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

      start: 100,

      end: 118,

      transitionIn: "particles",

      transitionOut: "light",

      background: {
        type: "ambient",
        variant: "gold-focus",
        particles: true
      },

      content: {

        quote:
          "Acompañar no significa controlar cada paso.",

        continuation:
          "Significa permanecer disponibles mientras aprenden a caminar por sí mismos."

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

      start: 118,

      end: 148,

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
          "Tres actitudes que pueden transformar el vínculo.",

        tools: [
          {
            number: "01",
            title: "Escuchar antes de responder",
            text:
              "No toda conversación necesita una solución inmediata."
          },
          {
            number: "02",
            title: "Validar sin dejar de orientar",
            text:
              "Comprender una emoción no significa aceptar cualquier conducta."
          },
          {
            number: "03",
            title: "Sostener una presencia confiable",
            text:
              "La disponibilidad adulta brinda seguridad incluso cuando aparece distancia."
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

      start: 148,

      end: 168,

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
          "Comprender cambia la forma de acompañar.",

        points: [
          "La adolescencia implica una transformación integral.",
          "La búsqueda de autonomía forma parte del crecimiento.",
          "Los límites y la escucha pueden convivir.",
          "La presencia adulta continúa siendo fundamental."
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

      start: 168,

      end: 225,

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
          "Acompañar también es aprender.",

        text:
          "Cada nueva mirada puede abrir una forma diferente de encontrarse.",

        nextModule: {
          label: "Próximo encuentro",
          title: "Comunicación familiar"
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
      time: 14,
      label: "Comprender la etapa"
    },

    {
      time: 32,
      label: "Los cambios"
    },

    {
      time: 54,
      label: "Construcción de identidad"
    },

    {
      time: 76,
      label: "La mirada adulta"
    },

    {
      time: 118,
      label: "Herramientas prácticas"
    },

    {
      time: 148,
      label: "Síntesis"
    },

    {
      time: 168,
      label: "Cierre"
    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 3,

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
      "crianza",
      "autonomía",
      "identidad",
      "acompañamiento"
    ]

  }

});