/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   ESCUELA PARA PADRES FALCO®
   MÓDULO 08 — PROYECTO DE VIDA Y CIERRE
   Archivo: modulo-08.js
========================================================= */

"use strict";


window.FALCO_LX_MODULE = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MÓDULO
  ======================================================= */

  id: "modulo-08",

  courseId: "escuela-padres",

  number: 8,

  title: "Proyecto de vida y cierre",

  subtitle:
    "Acompañar el futuro con confianza, presencia y esperanza.",

  eyebrow:
    "Escuela para Padres FALCO®",

  /*
   * DURACIÓN DE LAS NARRACIONES
   *
   * Parte 01: 02:18 = 138 s
   * Parte 02: 02:45 = 165 s
   * Parte 03: 02:45 = 165 s
   * Parte 04: 02:31 = 151 s
   * Parte 05: 02:37 = 157 s
   *
   * Total: 12:56 = 776 s
   */

  duration: 776,

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
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08-parte-01.mp3",
        start: 0
      },

      {
        id: "parte-02",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08-parte-02.mp3",
        start: 138
      },

      {
        id: "parte-03",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08-parte-03.mp3",
        start: 303
      },

      {
        id: "parte-04",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08-parte-04.mp3",
        start: 468
      },

      {
        id: "parte-05",
        source:
          "./CONTENT/cursos/escuela-padres/audio/narraciones/modulo-08-parte-05.mp3",
        start: 619
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

    fadeOutDuration: 5000,

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
          "Bienvenidos al Módulo 8",

        subtitle:
          "Proyecto de vida y cierre",

        supportingText:
          "Hoy miramos hacia adelante y también recuperamos el camino recorrido."

      },

      animation: {

        title: "fade-up",

        subtitle: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 02 — MIRAR HACIA EL FUTURO
       00:35 → 01:20
    ------------------------------------------------------ */

    {

      id: "escena-02",

      type: "statement",

      start: 35,

      end: 80,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "La adolescencia también es una etapa de descubrimientos, decisiones y construcción de identidad.",

        secondaryText:
          "¿Quién soy? ¿Qué me interesa? ¿Qué quiero hacer? ¿Qué lugar quiero ocupar en el mundo?"

      },

      emphasis: [

        "descubrimientos",

        "decisiones",

        "identidad"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 03 — QUÉ ES UN PROYECTO DE VIDA
       01:20 → 02:18
    ------------------------------------------------------ */

    {

      id: "escena-03",

      type: "concept-list",

      start: 80,

      end: 138,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Proyecto de vida",

        title:
          "No es un camino rígido. Es una construcción que puede transformarse.",

        items: [

          {
            text:
              "Imaginar posibilidades.",
            icon:
              "sparkles"
          },

          {
            text:
              "Reconocer fortalezas.",
            icon:
              "star"
          },

          {
            text:
              "Identificar desafíos.",
            icon:
              "mountain"
          },

          {
            text:
              "Establecer objetivos posibles.",
            icon:
              "target"
          },

          {
            text:
              "Adaptarse cuando las circunstancias cambian.",
            icon:
              "refresh-cw"
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
       ESCENA 04 — ACOMPAÑAR SIN IMPONER
       02:18 → 03:10
    ------------------------------------------------------ */

    {

      id: "escena-04",

      type: "comparison",

      start: 138,

      end: 190,

      transitionIn: "camera",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "navy",

        particles: true

      },

      content: {

        eyebrow:
          "El rol de las familias",

        title:
          "Acompañar no significa decidir por ellos.",

        left: {

          label:
            "Lo que puede dificultar",

          items: [

            "Exigir definiciones inmediatas.",

            "Elegir el camino por el adolescente.",

            "Comparar con otras personas.",

            "Convertir el error en fracaso."

          ]

        },

        right: {

          label:
            "Lo que puede favorecer",

          items: [

            "Escuchar sin imponer.",

            "Ofrecer información.",

            "Promover experiencias diversas.",

            "Transmitir confianza."

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
       ESCENA 05 — FORTALEZAS PERSONALES
       03:10 → 04:08
    ------------------------------------------------------ */

    {

      id: "escena-05",

      type: "tools",

      start: 190,

      end: 248,

      transitionIn: "fade",

      transitionOut: "light",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Descubrir recursos propios",

        title:
          "Reconocer fortalezas ayuda a construir el propio camino.",

        tools: [

          {

            number:
              "01",

            title:
              "Intereses",

            text:
              "¿Qué cosas disfruto hacer?"

          },

          {

            number:
              "02",

            title:
              "Capacidades",

            text:
              "¿Qué cosas hago bien?"

          },

          {

            number:
              "03",

            title:
              "Experiencias",

            text:
              "¿Qué dificultades pude superar?"

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
       ESCENA 06 — CONFIAR
       04:08 → 05:03
    ------------------------------------------------------ */

    {

      id: "escena-06",

      type: "quote",

      start: 248,

      end: 303,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "A veces nuestros hijos necesitan escuchar de nosotros aquello que todavía no pueden reconocer en sí mismos.",

        continuation:
          "Confío en vos. Podés tomarte tiempo. Podemos pensar juntos las opciones."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 07 — DECIDIR TAMBIÉN ES EQUIVOCARSE
       05:03 → 05:56
    ------------------------------------------------------ */

    {

      id: "escena-07",

      type: "statement",

      start: 303,

      end: 356,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "Equivocarse no significa fracasar.",

        secondaryText:
          "Los errores también pueden convertirse en oportunidades para revisar, aprender y encontrar nuevas alternativas."

      },

      emphasis: [

        "Equivocarse",

        "aprender"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 08 — APRENDER DEL ERROR
       05:56 → 06:48
    ------------------------------------------------------ */

    {

      id: "escena-08",

      type: "tools",

      start: 356,

      end: 408,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Transformar el error",

        title:
          "No podemos evitar todos los tropiezos. Podemos ayudar a aprender de ellos.",

        tools: [

          {

            number:
              "01",

            title:
              "Revisar",

            text:
              "¿Qué aprendiste de esta experiencia?"

          },

          {

            number:
              "02",

            title:
              "Pensar",

            text:
              "¿Qué podrías hacer diferente la próxima vez?"

          },

          {

            number:
              "03",

            title:
              "Explorar",

            text:
              "¿Qué alternativa podrías probar ahora?"

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
       ESCENA 09 — ESPERANZA
       06:48 → 07:48
    ------------------------------------------------------ */

    {

      id: "escena-09",

      type: "quote",

      start: 408,

      end: 468,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "La esperanza no significa negar las dificultades.",

        continuation:
          "Significa reconocer que existen recursos, alternativas y oportunidades para seguir avanzando."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 10 — REDES DE APOYO
       07:48 → 08:40
    ------------------------------------------------------ */

    {

      id: "escena-10",

      type: "concept-list",

      start: 468,

      end: 520,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Nadie construye su camino completamente solo",

        title:
          "Las redes saludables también forman parte del proyecto de vida.",

        items: [

          {
            text:
              "Familia.",
            icon:
              "home"
          },

          {
            text:
              "Amistades.",
            icon:
              "users"
          },

          {
            text:
              "Docentes y referentes.",
            icon:
              "graduation-cap"
          },

          {
            text:
              "Comunidad.",
            icon:
              "network"
          },

          {
            text:
              "Profesionales cuando sean necesarios.",
            icon:
              "hand-helping"
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
       ESCENA 11 — EL RECORRIDO DE LOS OCHO ENCUENTROS
       08:40 → 09:34
    ------------------------------------------------------ */

    {

      id: "escena-11",

      type: "summary",

      start: 520,

      end: 574,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "deep-blue",

        particles: true

      },

      content: {

        eyebrow:
          "El camino recorrido",

        title:
          "Durante ocho encuentros fuimos construyendo una mirada sobre la adolescencia.",

        points: [

          "Comprender los cambios de esta etapa.",

          "Fortalecer la comunicación.",

          "Acompañar emociones e identidad.",

          "Reflexionar sobre tecnología y redes.",

          "Construir límites saludables.",

          "Cuidar la salud mental.",

          "Acompañar proyectos con sentido y esperanza."

        ]

      },

      animation: {

        title: "fade-up",

        points: "stagger-fade",

        stagger: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 12 — PRESENCIA FAMILIAR
       09:34 → 10:19
    ------------------------------------------------------ */

    {

      id: "escena-12",

      type: "statement",

      start: 574,

      end: 619,

      transitionIn: "light",

      transitionOut: "fade",

      background: {

        type: "ambient",

        variant: "soft-gold",

        particles: true

      },

      content: {

        text:
          "No existe una única manera correcta de criar.",

        secondaryText:
          "Existen familias que intentan, se equivocan, vuelven a conversar y continúan ofreciendo presencia, escucha y acompañamiento."

      },

      emphasis: [

        "presencia",

        "escucha",

        "acompañamiento"

      ],

      animation: {

        text: "words-reveal",

        secondaryText: "fade-up",

        delay: 350

      }

    },


    /* -----------------------------------------------------
       ESCENA 13 — MENSAJE A LAS FAMILIAS
       10:19 → 11:15
    ------------------------------------------------------ */

    {

      id: "escena-13",

      type: "concept-list",

      start: 619,

      end: 675,

      transitionIn: "fade",

      transitionOut: "camera",

      background: {

        type: "gradient",

        variant: "institutional",

        particles: true

      },

      content: {

        eyebrow:
          "Queridas familias",

        title:
          "Los adolescentes no necesitan adultos perfectos.",

        items: [

          {
            text:
              "Necesitan adultos presentes.",
            icon:
              "heart-handshake"
          },

          {
            text:
              "Adultos que escuchen.",
            icon:
              "ear"
          },

          {
            text:
              "Adultos capaces de poner límites desde el afecto.",
            icon:
              "shield"
          },

          {
            text:
              "Adultos que reconozcan sus errores.",
            icon:
              "refresh-cw"
          },

          {
            text:
              "Adultos que vuelvan a intentarlo.",
            icon:
              "sparkles"
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
       ESCENA 14 — UNA MIRADA FALCO®
       11:15 → 12:16
    ------------------------------------------------------ */

    {

      id: "escena-14",

      type: "quote",

      start: 675,

      end: 736,

      transitionIn: "camera",

      transitionOut: "light",

      background: {

        type: "ambient",

        variant: "gold-focus",

        particles: true

      },

      content: {

        quote:
          "Educar también implica aprender a soltar progresivamente.",

        continuation:
          "Nuestros hijos necesitan saber que creemos en ellos y que seguiremos disponibles aun cuando el camino elegido sea diferente del que imaginamos."

      },

      animation: {

        quote: "words-reveal",

        continuation: "fade-up",

        delay: 500

      }

    },


    /* -----------------------------------------------------
       ESCENA 15 — DESPEDIDA FINAL
       12:16 → 12:56
    ------------------------------------------------------ */

    {

      id: "escena-15",

      type: "closing",

      start: 736,

      end: 776,

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
          "Acompañar hoy, fortalecer siempre, transformar el mañana.",

        text:
          "Cada conversación, cada límite sostenido con afecto, cada oportunidad para escuchar y cada gesto de confianza contribuyen a construir vínculos más saludables.",

        completion: {

          label:
            "Recorrido completado",

          title:
            "Aprendiendo a ser Padres de un Adolescente®",

          text:
            "Gracias por haber compartido estos ocho encuentros."

        }

      },

      animation: {

        title: "fade-up",

        text: "fade-up",

        completion: "fade-up"

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
        "Mirar hacia el futuro"
    },

    {
      time: 80,
      label:
        "Proyecto de vida"
    },

    {
      time: 138,
      label:
        "Acompañar sin imponer"
    },

    {
      time: 190,
      label:
        "Fortalezas personales"
    },

    {
      time: 248,
      label:
        "Confiar"
    },

    {
      time: 303,
      label:
        "Decidir y equivocarse"
    },

    {
      time: 356,
      label:
        "Aprender del error"
    },

    {
      time: 408,
      label:
        "Esperanza"
    },

    {
      time: 468,
      label:
        "Redes de apoyo"
    },

    {
      time: 520,
      label:
        "El recorrido compartido"
    },

    {
      time: 574,
      label:
        "Presencia familiar"
    },

    {
      time: 619,
      label:
        "Mensaje a las familias"
    },

    {
      time: 675,
      label:
        "Una Mirada FALCO®"
    },

    {
      time: 736,
      label:
        "Despedida"
    }

  ],


  /* =======================================================
     METADATOS
  ======================================================= */

  metadata: {

    estimatedMinutes: 13,

    category:
      "Orientación familiar",

    audience: [

      "Madres",

      "Padres",

      "Referentes adultos",

      "Cuidadores"

    ],

    keywords: [

      "proyecto de vida",

      "adolescencia",

      "autonomía",

      "decisiones",

      "fortalezas",

      "esperanza",

      "redes de apoyo",

      "familia",

      "futuro",

      "acompañamiento",

      "cierre"

    ]

  }

});