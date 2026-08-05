/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR DE RENDERIZADO DE ESCENAS
   Archivo: falco-lx-renderer.js
========================================================= */

"use strict";


window.FALCO_LX_RENDERER = (() => {

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  const utils =
    window.FALCO_LX_UTILS;


  /* =======================================================
     ELEMENTOS DEL DOM
  ======================================================= */

  const scenesContainer =
    document.getElementById(
      "flxScenes"
    );

  const stage =
    document.getElementById(
      "flxStage"
    );

  const stageImage =
    document.querySelector(
      ".flx-stage__image"
    );

  const stageOverlay =
    document.querySelector(
      ".flx-stage__overlay"
    );


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    scenes: [],

    sceneElements: new Map(),

    activeSceneId: null,

    fallbackImageActive: false

  };


  /* =======================================================
     UTILIDADES INTERNAS
  ======================================================= */

  function appendTextElement(
    parent,
    tagName,
    className,
    value
  ) {

    if (
      !parent ||
      !utils.hasText(value)
    ) {
      return null;
    }

    const element =
      utils.createElement(
        tagName,
        className,
        value
      );

    parent.appendChild(element);

    return element;

  }


  function createContentWrapper() {

    return utils.createElement(
      "div",
      "flx-scene__content"
    );

  }


  function createEyebrow(
    parent,
    value
  ) {

    return appendTextElement(
      parent,
      "span",
      "flx-scene__eyebrow",
      value
    );

  }


  function createTitle(
    parent,
    value
  ) {

    return appendTextElement(
      parent,
      "h2",
      "flx-scene__title",
      value
    );

  }


  function createSubtitle(
    parent,
    value
  ) {

    return appendTextElement(
      parent,
      "p",
      "flx-scene__subtitle",
      value
    );

  }


  function createText(
    parent,
    value
  ) {

    return appendTextElement(
      parent,
      "p",
      "flx-scene__text",
      value
    );

  }


  function createSupportingText(
    parent,
    value
  ) {

    return appendTextElement(
      parent,
      "p",
      "flx-scene__supporting",
      value
    );

  }


  function createIconContainer(
    iconName
  ) {

    const wrapper =
      utils.createElement(
        "span",
        "flx-concept-item__icon"
      );

    wrapper.appendChild(
      utils.createIcon(
        iconName || "circle"
      )
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: APERTURA
  ======================================================= */

  function renderOpening(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    createSubtitle(
      wrapper,
      content.subtitle
    );

    createSupportingText(
      wrapper,
      content.supportingText
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: FRASE
  ======================================================= */

  function renderStatement(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    const text =
      appendTextElement(
        wrapper,
        "p",
        "flx-scene__text",
        content.text
      );

    if (text) {
      text.classList.add(
        "flx-scene__statement-text"
      );
    }

    appendTextElement(
      wrapper,
      "p",
      "flx-scene__secondary-text",
      content.secondaryText
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: LISTA DE CONCEPTOS
  ======================================================= */

  function renderConceptList(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    const list =
      utils.createElement(
        "div",
        "flx-concept-list"
      );

    const items =
      Array.isArray(content.items)
        ? content.items
        : [];

    items.forEach((item) => {

      const card =
        utils.createElement(
          "article",
          "flx-concept-item"
        );

      card.appendChild(
        createIconContainer(
          item.icon
        )
      );

      const text =
        utils.createElement(
          "span",
          "flx-concept-item__text",
          item.text
        );

      card.appendChild(text);

      list.appendChild(card);

    });

    wrapper.appendChild(list);

    return wrapper;

  }


  /* =======================================================
     ESCENA: IMAGEN PRINCIPAL
  ======================================================= */

  function renderImageFocus(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    createText(
      wrapper,
      content.text
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: COMPARACIÓN
  ======================================================= */

  function createComparisonColumn(
    data
  ) {

    const column =
      utils.createElement(
        "article",
        "flx-comparison__column"
      );

    appendTextElement(
      column,
      "div",
      "flx-comparison__label",
      data?.label
    );

    const list =
      utils.createElement(
        "ul",
        "flx-comparison__list"
      );

    const items =
      Array.isArray(data?.items)
        ? data.items
        : [];

    items.forEach((item) => {

      const listItem =
        utils.createElement(
          "li",
          "",
          item
        );

      list.appendChild(listItem);

    });

    column.appendChild(list);

    return column;

  }


  function renderComparison(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    const comparison =
      utils.createElement(
        "div",
        "flx-comparison"
      );

    comparison.appendChild(
      createComparisonColumn(
        content.left
      )
    );

    comparison.appendChild(
      createComparisonColumn(
        content.right
      )
    );

    wrapper.appendChild(
      comparison
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: CITA
  ======================================================= */

  function renderQuote(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    appendTextElement(
      wrapper,
      "blockquote",
      "flx-scene__quote",
      content.quote
    );

    appendTextElement(
      wrapper,
      "p",
      "flx-scene__continuation",
      content.continuation
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: HERRAMIENTAS
  ======================================================= */

  function renderTools(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    const toolsContainer =
      utils.createElement(
        "div",
        "flx-tools"
      );

    const tools =
      Array.isArray(content.tools)
        ? content.tools
        : [];

    tools.forEach((tool) => {

      const card =
        utils.createElement(
          "article",
          "flx-tool"
        );

      appendTextElement(
        card,
        "span",
        "flx-tool__number",
        tool.number
      );

      appendTextElement(
        card,
        "h3",
        "flx-tool__title",
        tool.title
      );

      appendTextElement(
        card,
        "p",
        "flx-tool__text",
        tool.text
      );

      toolsContainer.appendChild(
        card
      );

    });

    wrapper.appendChild(
      toolsContainer
    );

    return wrapper;

  }


  /* =======================================================
     ESCENA: SÍNTESIS
  ======================================================= */

  function renderSummary(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    const summary =
      utils.createElement(
        "div",
        "flx-summary"
      );

    const points =
      Array.isArray(content.points)
        ? content.points
        : [];

    points.forEach((point) => {

      const element =
        utils.createElement(
          "div",
          "flx-summary__point",
          point
        );

      summary.appendChild(element);

    });

    wrapper.appendChild(summary);

    return wrapper;

  }


  /* =======================================================
     ESCENA: CIERRE
  ======================================================= */

  function renderClosing(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    createText(
      wrapper,
      content.text
    );

    if (
      utils.isObject(
        content.nextModule
      )
    ) {

      const nextModule =
        utils.createElement(
          "div",
          "flx-next-module"
        );

      appendTextElement(
        nextModule,
        "small",
        "",
        content.nextModule.label
      );

      appendTextElement(
        nextModule,
        "strong",
        "",
        content.nextModule.title
      );

      wrapper.appendChild(
        nextModule
      );

    }

    return wrapper;

  }


  /* =======================================================
     ESCENA GENÉRICA
  ======================================================= */

  function renderGeneric(scene) {

    const content =
      scene.content || {};

    const wrapper =
      createContentWrapper();

    createEyebrow(
      wrapper,
      content.eyebrow
    );

    createTitle(
      wrapper,
      content.title
    );

    createSubtitle(
      wrapper,
      content.subtitle
    );

    createText(
      wrapper,
      content.text
    );

    createSupportingText(
      wrapper,
      content.supportingText
    );

    return wrapper;

  }


  /* =======================================================
     SELECCIONAR RENDERIZADOR
  ======================================================= */

  function renderSceneContent(scene) {

    const renderers = {

      opening:
        renderOpening,

      statement:
        renderStatement,

      "concept-list":
        renderConceptList,

      "image-focus":
        renderImageFocus,

      comparison:
        renderComparison,

      quote:
        renderQuote,

      tools:
        renderTools,

      summary:
        renderSummary,

      closing:
        renderClosing

    };

    const renderer =
      renderers[scene.type] ||
      renderGeneric;

    return renderer(scene);

  }


  /* =======================================================
     CREAR ESCENA
  ======================================================= */

  function createSceneElement(
    scene,
    index
  ) {

    const element =
      utils.createElement(
        "section",
        [
          "flx-scene",
          `flx-scene--${scene.type || "generic"}`
        ].join(" ")
      );

    element.id =
      `flx-${scene.id}`;

    element.dataset.sceneId =
      scene.id;

    element.dataset.sceneIndex =
      String(index);

    element.dataset.sceneStart =
      String(scene.start);

    element.dataset.sceneEnd =
      String(scene.end);

    element.setAttribute(
      "aria-hidden",
      "true"
    );

    const content =
      renderSceneContent(scene);

    if (content) {
      element.appendChild(content);
    }

    return element;

  }


  /* =======================================================
     RENDERIZAR MÓDULO COMPLETO
  ======================================================= */

  function renderModule(
    moduleData
  ) {

    if (
      !scenesContainer ||
      !moduleData
    ) {
      return [];
    }

    scenesContainer.innerHTML = "";

    state.scenes =
      Array.isArray(moduleData.scenes)
        ? moduleData.scenes
        : [];

    state.sceneElements.clear();

    const fragment =
      document.createDocumentFragment();

    state.scenes.forEach(
      (scene, index) => {

        const element =
          createSceneElement(
            scene,
            index
          );

        state.sceneElements.set(
          scene.id,
          element
        );

        fragment.appendChild(
          element
        );

      }
    );

    scenesContainer.appendChild(
      fragment
    );

    utils.refreshIcons();

    return [
      ...state.sceneElements.values()
    ];

  }


  /* =======================================================
     FONDO DE ESCENA
  ======================================================= */

  function resetStageImage() {

    if (!stageImage) {
      return;
    }

    stageImage.classList.remove(
      "is-visible"
    );

    stageImage.style.backgroundImage =
      "";

    state.fallbackImageActive =
      false;

  }


  function applyImageBackground(
    source,
    overlay = 0.62,
    position = "center",
    fit = "cover"
  ) {

    if (
      !stageImage ||
      !utils.hasText(source)
    ) {
      resetStageImage();
      return;
    }

    const image =
      new Image();

    image.onload = () => {

      stageImage.style.backgroundImage =
        `url("${source}")`;

      stageImage.style.backgroundPosition =
        position || "center";

      stageImage.style.backgroundSize =
        fit || "cover";

      requestAnimationFrame(() => {
        stageImage.classList.add(
          "is-visible"
        );
      });

      state.fallbackImageActive =
        false;

    };

    image.onerror = () => {

      resetStageImage();

      state.fallbackImageActive =
        true;

      utils.debugLog(
        "No se encontró la imagen de escena.",
        source
      );

    };

    image.src = source;

    if (stageOverlay) {
      stageOverlay.style.opacity =
        String(
          utils.clamp(
            utils.safeNumber(
              overlay,
              0.62
            ),
            0,
            1
          )
        );
    }

  }


  function applySceneBackground(
    scene
  ) {

    if (!stage || !scene) {
      return;
    }

    const background =
      scene.background || {};

    const variant =
      utils.safeText(
        background.variant,
        "deep-blue"
      );

    stage.dataset.backgroundVariant =
      variant;

    if (
      background.type === "image" &&
      utils.hasText(
        background.source
      )
    ) {

      applyImageBackground(
        background.source,
        background.overlay,
        background.position,
        background.fit
      );

      return;

    }

    resetStageImage();

    if (stageOverlay) {
      stageOverlay.style.opacity =
        "1";
    }

  }


  /* =======================================================
     ACTIVAR ESCENA
  ======================================================= */

  function activateScene(
    scene,
    options = {}
  ) {

    if (!scene) {
      return null;
    }

    const targetElement =
      state.sceneElements.get(
        scene.id
      );

    if (!targetElement) {
      return null;
    }

    if (
      state.activeSceneId ===
      scene.id &&
      !options.force
    ) {
      return targetElement;
    }

    state.sceneElements.forEach(
      (element, sceneId) => {

        const isActive =
          sceneId === scene.id;

        element.classList.toggle(
          "is-active",
          isActive
        );

        element.classList.remove(
          "is-leaving"
        );

        element.setAttribute(
          "aria-hidden",
          isActive
            ? "false"
            : "true"
        );

      }
    );

    state.activeSceneId =
      scene.id;

    applySceneBackground(scene);

    return targetElement;

  }


  /* =======================================================
     CONSULTAS
  ======================================================= */

  function getSceneElement(
    sceneId
  ) {

    return (
      state.sceneElements.get(
        sceneId
      ) || null
    );

  }


  function getActiveSceneId() {

    return state.activeSceneId;

  }


  function getRenderedScenes() {

    return [
      ...state.sceneElements.values()
    ];

  }


  /* =======================================================
     LIMPIEZA
  ======================================================= */

  function destroy() {

    if (scenesContainer) {
      scenesContainer.innerHTML = "";
    }

    state.scenes = [];

    state.sceneElements.clear();

    state.activeSceneId = null;

    resetStageImage();

  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    renderModule,

    activateScene,

    applySceneBackground,

    getSceneElement,

    getActiveSceneId,

    getRenderedScenes,

    destroy

  });

})();