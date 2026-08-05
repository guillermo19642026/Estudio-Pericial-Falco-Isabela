/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR DE ANIMACIONES
   Archivo: falco-lx-animation.js
========================================================= */

"use strict";


window.FALCO_LX_ANIMATION = (() => {

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  const utils =
    window.FALCO_LX_UTILS;

  const config =
    window.FALCO_LX_CONFIG;


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    activeSceneId: null,

    timers: new Set(),

    reducedMotion:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

  };


  /* =======================================================
     TEMPORIZADORES
  ======================================================= */

  function registerTimer(timerId) {

    state.timers.add(timerId);

    return timerId;

  }


  function clearTimers() {

    state.timers.forEach(
      (timerId) => {
        window.clearTimeout(timerId);
      }
    );

    state.timers.clear();

  }


  /* =======================================================
     NORMALIZAR ANIMACIÓN
  ======================================================= */

  function normalizeAnimationName(
    animationName
  ) {

    const value =
      utils.safeText(
        animationName,
        config?.text?.defaultAnimation ||
          "fade-up"
      )
        .trim()
        .toLowerCase();

    const aliases = {

      fade:
        "fade-up",

      fadeup:
        "fade-up",

      "fade-in":
        "fade-up",

      slideleft:
        "slide-left",

      slideright:
        "slide-right",

      scale:
        "scale-in",

      zoom:
        "scale-in",

      words:
        "words-reveal",

      stagger:
        "stagger-up"

    };

    return aliases[value] || value;

  }


  /* =======================================================
     PREPARAR ELEMENTO
  ======================================================= */

  function prepareElement(
    element,
    animationName = "fade-up"
  ) {

    if (!element) {
      return;
    }

    const normalized =
      normalizeAnimationName(
        animationName
      );

    element.classList.add(
      "flx-animate"
    );

    element.classList.add(
      `flx-animation--${normalized}`
    );

    element.classList.remove(
      "is-visible"
    );

  }


  /* =======================================================
     MOSTRAR ELEMENTO
  ======================================================= */

  function showElement(
    element,
    delay = 0
  ) {

    if (!element) {
      return;
    }

    const safeDelay =
      state.reducedMotion
        ? 0
        : Math.max(
            0,
            utils.safeNumber(
              delay,
              0
            )
          );

    const timerId =
      window.setTimeout(
        () => {

          element.classList.add(
            "is-visible"
          );

          state.timers.delete(
            timerId
          );

        },
        safeDelay
      );

    registerTimer(timerId);

  }


  /* =======================================================
     OCULTAR ELEMENTO
  ======================================================= */

  function hideElement(element) {

    if (!element) {
      return;
    }

    element.classList.remove(
      "is-visible"
    );

  }


  /* =======================================================
     ANIMAR ELEMENTO INDIVIDUAL
  ======================================================= */

  function animateElement(
    element,
    options = {}
  ) {

    if (!element) {
      return;
    }

    const animation =
      normalizeAnimationName(
        options.animation
      );

    const delay =
      utils.safeNumber(
        options.delay,
        config?.text?.defaultDelay ?? 200
      );

    prepareElement(
      element,
      animation
    );

    showElement(
      element,
      delay
    );

  }


  /* =======================================================
     REVELADO POR PALABRAS
  ======================================================= */

  function prepareWords(element) {

    if (!element) {
      return [];
    }

    if (
      element.dataset.flxWordsReady ===
      "true"
    ) {

      return [
        ...element.querySelectorAll(
          ".flx-word"
        )
      ];

    }

    const text =
      element.textContent || "";

    const words =
      text
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    element.textContent = "";

    const fragment =
      document.createDocumentFragment();

    words.forEach((word) => {

      const span =
        document.createElement("span");

      span.className =
        "flx-word";

      span.textContent = word;

      fragment.appendChild(span);

      fragment.appendChild(
        document.createTextNode(" ")
      );

    });

    element.appendChild(fragment);

    element.dataset.flxWordsReady =
      "true";

    return [
      ...element.querySelectorAll(
        ".flx-word"
      )
    ];

  }


  function animateWords(
    element,
    options = {}
  ) {

    if (!element) {
      return;
    }

    const words =
      prepareWords(element);

    const delay =
      utils.safeNumber(
        options.delay,
        0
      );

    const stagger =
      utils.safeNumber(
        options.stagger,
        110
      );

    words.forEach(
      (word, index) => {

        word.classList.remove(
          "is-visible"
        );

        showElement(
          word,
          delay +
          index * stagger
        );

      }
    );

  }


  /* =======================================================
     ANIMACIÓN ESCALONADA
  ======================================================= */

  function animateStagger(
    elements,
    options = {}
  ) {

    const list =
      Array.from(
        elements || []
      );

    const animation =
      normalizeAnimationName(
        options.animation ||
        "fade-up"
      );

    const delay =
      utils.safeNumber(
        options.delay,
        0
      );

    const stagger =
      utils.safeNumber(
        options.stagger,
        350
      );

    list.forEach(
      (element, index) => {

        prepareElement(
          element,
          animation
        );

        showElement(
          element,
          delay +
          index * stagger
        );

      }
    );

  }


  /* =======================================================
     ANIMAR CONTENIDO SEGÚN ESCENA
  ======================================================= */

  function animateScene(
    sceneElement,
    sceneData
  ) {

    if (
      !sceneElement ||
      !sceneData
    ) {
      return;
    }

    clearTimers();

    state.activeSceneId =
      sceneData.id || null;

    const animation =
      sceneData.animation || {};

    const baseDelay =
      utils.safeNumber(
        animation.delay,
        config?.text?.defaultDelay ?? 200
      );


    const eyebrow =
      sceneElement.querySelector(
        ".flx-scene__eyebrow"
      );

    const title =
      sceneElement.querySelector(
        ".flx-scene__title"
      );

    const subtitle =
      sceneElement.querySelector(
        ".flx-scene__subtitle"
      );

    const text =
      sceneElement.querySelector(
        ".flx-scene__text"
      );

    const supporting =
      sceneElement.querySelector(
        ".flx-scene__supporting"
      );

    const quote =
      sceneElement.querySelector(
        ".flx-scene__quote"
      );

    const continuation =
      sceneElement.querySelector(
        ".flx-scene__continuation"
      );


    if (eyebrow) {

      animateElement(
        eyebrow,
        {
          animation:
            animation.eyebrow ||
            "fade-up",

          delay:
            baseDelay
        }
      );

    }


    if (title) {

      if (
        normalizeAnimationName(
          animation.title
        ) === "words-reveal"
      ) {

        animateWords(
          title,
          {
            delay:
              baseDelay + 120,

            stagger:
              animation.wordStagger || 110
          }
        );

      } else {

        animateElement(
          title,
          {
            animation:
              animation.title ||
              "fade-up",

            delay:
              baseDelay + 120
          }
        );

      }

    }


    if (subtitle) {

      animateElement(
        subtitle,
        {
          animation:
            animation.subtitle ||
            "fade-up",

          delay:
            baseDelay + 300
        }
      );

    }


    if (text) {

      if (
        normalizeAnimationName(
          animation.text
        ) === "words-reveal"
      ) {

        animateWords(
          text,
          {
            delay:
              baseDelay,

            stagger:
              animation.wordStagger || 105
          }
        );

      } else {

        animateElement(
          text,
          {
            animation:
              animation.text ||
              "fade-up",

            delay:
              baseDelay + 180
          }
        );

      }

    }


    if (supporting) {

      animateElement(
        supporting,
        {
          animation:
            animation.supportingText ||
            "fade-up",

          delay:
            baseDelay + 420
        }
      );

    }


    if (quote) {

      if (
        normalizeAnimationName(
          animation.quote
        ) === "words-reveal"
      ) {

        animateWords(
          quote,
          {
            delay:
              baseDelay,

            stagger:
              animation.wordStagger || 110
          }
        );

      } else {

        animateElement(
          quote,
          {
            animation:
              animation.quote ||
              "fade-up",

            delay:
              baseDelay
          }
        );

      }

    }


    if (continuation) {

      animateElement(
        continuation,
        {
          animation:
            animation.continuation ||
            "fade-up",

          delay:
            baseDelay + 650
        }
      );

    }


    const conceptItems =
      sceneElement.querySelectorAll(
        ".flx-concept-item"
      );

    if (conceptItems.length) {

      animateStagger(
        conceptItems,
        {
          animation:
            animation.items ||
            "fade-up",

          delay:
            baseDelay + 250,

          stagger:
            animation.stagger || 350
        }
      );

    }


    const comparisonColumns =
      sceneElement.querySelectorAll(
        ".flx-comparison__column"
      );

    if (comparisonColumns.length) {

      comparisonColumns.forEach(
        (column, index) => {

          animateElement(
            column,
            {
              animation:
                index === 0
                  ? animation.left ||
                    "slide-left"
                  : animation.right ||
                    "slide-right",

              delay:
                baseDelay +
                250 +
                index * 180
            }
          );

        }
      );

    }


    const tools =
      sceneElement.querySelectorAll(
        ".flx-tool"
      );

    if (tools.length) {

      animateStagger(
        tools,
        {
          animation:
            animation.tools ||
            "fade-up",

          delay:
            baseDelay + 200,

          stagger:
            animation.stagger || 450
        }
      );

    }


    const summaryPoints =
      sceneElement.querySelectorAll(
        ".flx-summary__point"
      );

    if (summaryPoints.length) {

      animateStagger(
        summaryPoints,
        {
          animation:
            animation.points ||
            "fade-up",

          delay:
            baseDelay + 220,

          stagger:
            animation.stagger || 320
        }
      );

    }


    const nextModule =
      sceneElement.querySelector(
        ".flx-next-module"
      );

    if (nextModule) {

      animateElement(
        nextModule,
        {
          animation:
            animation.nextModule ||
            "fade-up",

          delay:
            baseDelay + 650
        }
      );

    }

  }


  /* =======================================================
     REINICIAR ESCENA
  ======================================================= */

  function resetScene(
    sceneElement
  ) {

    if (!sceneElement) {
      return;
    }

    sceneElement
      .querySelectorAll(
        ".flx-animate, .flx-word"
      )
      .forEach((element) => {

        element.classList.remove(
          "is-visible"
        );

      });

  }


  /* =======================================================
     REINICIAR TODAS LAS ESCENAS
  ======================================================= */

  function resetAll(
    container
  ) {

    clearTimers();

    if (!container) {
      return;
    }

    container
      .querySelectorAll(
        ".flx-scene"
      )
      .forEach(resetScene);

    state.activeSceneId = null;

  }


  /* =======================================================
     TRANSICIÓN ENTRE ESCENAS
  ======================================================= */

  function playTransition(
    transitionElement,
    transitionName = "fade"
  ) {

    if (!transitionElement) {
      return;
    }

    const allowed =
      config?.transitions?.allowed || [];

    const normalized =
      allowed.includes(
        transitionName
      )
        ? transitionName
        : config?.transitions?.default ||
          "fade";

    transitionElement.dataset.transition =
      normalized;

    transitionElement.classList.remove(
      "is-active"
    );

    void transitionElement.offsetWidth;

    transitionElement.classList.add(
      "is-active"
    );

    const duration =
      utils.safeNumber(
        config?.scenes?.transitionDuration,
        800
      );

    const timerId =
      window.setTimeout(
        () => {

          transitionElement.classList.remove(
            "is-active"
          );

          state.timers.delete(
            timerId
          );

        },
        duration + 100
      );

    registerTimer(timerId);

  }


  /* =======================================================
     MOVIMIENTO REDUCIDO
  ======================================================= */

  function registerReducedMotion() {

    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const updatePreference =
      (event) => {

        state.reducedMotion =
          event.matches;

      };

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {

      mediaQuery.addEventListener(
        "change",
        updatePreference
      );

    } else {

      mediaQuery.addListener(
        updatePreference
      );

    }

  }


  /* =======================================================
     DESTRUIR
  ======================================================= */

  function destroy() {

    clearTimers();

    state.activeSceneId = null;

  }


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  registerReducedMotion();


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    prepareElement,

    animateElement,

    animateWords,

    animateStagger,

    animateScene,

    resetScene,

    resetAll,

    playTransition,

    destroy

  });

})();