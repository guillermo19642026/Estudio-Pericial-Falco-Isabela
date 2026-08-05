/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   CONTROL DEL REPRODUCTOR
   Archivo: falco-lx-player.js
========================================================= */

"use strict";


window.FALCO_LX_PLAYER = (() => {

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  const utils =
    window.FALCO_LX_UTILS;

  const config =
    window.FALCO_LX_CONFIG;


  /* =======================================================
     ELEMENTOS DEL DOM
  ======================================================= */

  const app =
    document.getElementById(
      "falcoLXApp"
    );

  const stage =
    document.getElementById(
      "flxStage"
    );

  const playPauseButton =
    document.getElementById(
      "flxPlayPauseButton"
    );

  const restartButton =
    document.getElementById(
      "flxRestartButton"
    );

  const soundButton =
    document.getElementById(
      "flxSoundButton"
    );

  const fullscreenButton =
    document.getElementById(
      "flxFullscreenButton"
    );

  const previousSceneButton =
    document.getElementById(
      "flxPreviousSceneButton"
    );

  const nextSceneButton =
    document.getElementById(
      "flxNextSceneButton"
    );

  const timelineTrack =
    document.getElementById(
      "flxTimelineTrack"
    );

  const timelineProgress =
    document.getElementById(
      "flxTimelineProgress"
    );

  const timelineThumb =
    document.getElementById(
      "flxTimelineThumb"
    );

  const currentTimeElement =
    document.getElementById(
      "flxCurrentTime"
    );

  const totalTimeElement =
    document.getElementById(
      "flxTotalTime"
    );

  const currentSceneElement =
    document.getElementById(
      "flxCurrentScene"
    );

  const totalScenesElement =
    document.getElementById(
      "flxTotalScenes"
    );

  const moduleNumberElement =
    document.getElementById(
      "flxModuleNumber"
    );

  const moduleTotalElement =
    document.getElementById(
      "flxModuleTotal"
    );

  const courseNameElement =
    document.getElementById(
      "flxCourseName"
    );


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    initialized: false,

    playing: false,

    soundEnabled: false,

    currentTime: 0,

    duration: 0,

    currentSceneIndex: 0,

    totalScenes: 0,

    scenes: [],

    moduleData: null,

    courseData: null,

    handlers: {

      onPlay: null,

      onPause: null,

      onRestart: null,

      onSeek: null,

      onSoundToggle: null,

      onPreviousScene: null,

      onNextScene: null

    }

  };


  /* =======================================================
     ICONOS
  ======================================================= */

 function replaceButtonIcon(
  button,
  iconName
) {

  if (
    !button ||
    !iconName
  ) {
    return;
  }

  /*
   * No reconstruir el icono cuando ya es el correcto.
   * El reproductor actualiza su estado continuamente
   * y reemplazar el SVG durante un clic cancela el evento.
   */

  if (
    button.dataset.flxIcon ===
    iconName
  ) {
    return;
  }

  button.dataset.flxIcon =
    iconName;

  button.innerHTML = "";

  button.appendChild(
    utils.createIcon(
      iconName
    )
  );

  utils.refreshIcons();

}

  


  function updatePlayPauseIcon() {

    if (!playPauseButton) {
      return;
    }

    replaceButtonIcon(
      playPauseButton,
      state.playing
        ? "pause"
        : "play"
    );

    playPauseButton.setAttribute(
      "aria-label",
      state.playing
        ? "Pausar experiencia"
        : "Reproducir experiencia"
    );

    playPauseButton.setAttribute(
      "aria-pressed",
      String(state.playing)
    );

  }


  function updateSoundIcon() {

    if (!soundButton) {
      return;
    }

    replaceButtonIcon(
      soundButton,
      state.soundEnabled
        ? "volume-2"
        : "volume-x"
    );

    soundButton.setAttribute(
      "aria-label",
      state.soundEnabled
        ? "Desactivar sonido"
        : "Activar sonido"
    );

    soundButton.setAttribute(
      "aria-pressed",
      String(
        state.soundEnabled
      )
    );

  }


  function updateFullscreenIcon() {

    if (!fullscreenButton) {
      return;
    }

    const isFullscreen =
      Boolean(
        document.fullscreenElement
      );

    replaceButtonIcon(
      fullscreenButton,
      isFullscreen
        ? "minimize"
        : "maximize"
    );

    fullscreenButton.setAttribute(
      "aria-label",
      isFullscreen
        ? "Salir de pantalla completa"
        : "Ver en pantalla completa"
    );

  }


  /* =======================================================
     INFORMACIÓN DEL CURSO Y DEL MÓDULO
  ======================================================= */

  function updateCourseInformation() {

    if (
      courseNameElement &&
      state.courseData
    ) {

      courseNameElement.textContent =
        utils.safeText(
          state.courseData.title,
          "Experiencia formativa"
        );

    }


    if (
      moduleNumberElement &&
      state.moduleData
    ) {

      moduleNumberElement.textContent =
        String(
          utils.safeNumber(
            state.moduleData.number,
            1
          )
        ).padStart(2, "0");

    }


    const configuredModuleTotal =
      state.courseData?.structure
        ?.totalModules;


    if (moduleTotalElement) {

      moduleTotalElement.textContent =
        String(
          utils.safeNumber(
            configuredModuleTotal,
            state.courseData?.modules?.length ||
              1
          )
        ).padStart(2, "0");

    }

  }


  /* =======================================================
     TIEMPO Y PROGRESO
  ======================================================= */

  function updateTimeline() {

    const progress =
      state.duration > 0
        ? utils.clamp(
            state.currentTime /
              state.duration,
            0,
            1
          )
        : 0;

    const percentage =
      progress * 100;


    if (timelineProgress) {

      timelineProgress.style.width =
        `${percentage}%`;

    }


    if (timelineThumb) {

      timelineThumb.style.left =
        `${percentage}%`;

    }


    if (currentTimeElement) {

      currentTimeElement.textContent =
        utils.formatTime(
          state.currentTime
        );

    }


    if (totalTimeElement) {

      totalTimeElement.textContent =
        utils.formatTime(
          state.duration
        );

    }


    if (timelineTrack) {

      timelineTrack.setAttribute(
        "aria-valuemax",
        String(
          Math.floor(
            state.duration
          )
        )
      );

      timelineTrack.setAttribute(
        "aria-valuenow",
        String(
          Math.floor(
            state.currentTime
          )
        )
      );

      timelineTrack.setAttribute(
        "aria-valuetext",
        `${utils.formatTime(
          state.currentTime
        )} de ${utils.formatTime(
          state.duration
        )}`
      );

    }

  }


  /* =======================================================
     INDICADOR DE ESCENAS
  ======================================================= */

  function updateSceneIndicator() {

    if (currentSceneElement) {

      currentSceneElement.textContent =
        String(
          state.currentSceneIndex + 1
        ).padStart(2, "0");

    }


    if (totalScenesElement) {

      totalScenesElement.textContent =
        String(
          Math.max(
            1,
            state.totalScenes
          )
        ).padStart(2, "0");

    }


    if (previousSceneButton) {

      previousSceneButton.disabled =
        state.currentSceneIndex <= 0;

      previousSceneButton.setAttribute(
        "aria-disabled",
        String(
          state.currentSceneIndex <= 0
        )
      );

    }


    if (nextSceneButton) {

      nextSceneButton.disabled =
        state.currentSceneIndex >=
        state.totalScenes - 1;

      nextSceneButton.setAttribute(
        "aria-disabled",
        String(
          state.currentSceneIndex >=
          state.totalScenes - 1
        )
      );

    }

  }


  /* =======================================================
     EVENTOS DEL REPRODUCTOR
  ======================================================= */

  function emit(
    handlerName,
    payload = null
  ) {

    const handler =
      state.handlers[
        handlerName
      ];

    if (
      typeof handler ===
      "function"
    ) {

      handler(payload);

    }

  }


  function handlePlayPause() {

    if (state.playing) {

      emit("onPause");

    } else {

      emit("onPlay");

    }

  }


  function handleRestart() {

    emit("onRestart");

  }


  function handleSoundToggle() {

    emit(
      "onSoundToggle",
      !state.soundEnabled
    );

  }


  function handlePreviousScene() {

    if (
      state.currentSceneIndex <= 0
    ) {
      return;
    }

    emit(
      "onPreviousScene",
      state.currentSceneIndex - 1
    );

  }


  function handleNextScene() {

    if (
      state.currentSceneIndex >=
      state.totalScenes - 1
    ) {
      return;
    }

    emit(
      "onNextScene",
      state.currentSceneIndex + 1
    );

  }


  /* =======================================================
     LÍNEA DE TIEMPO
  ======================================================= */

  function getTimeFromPointerEvent(
    event
  ) {

    if (
      !timelineTrack ||
      state.duration <= 0
    ) {
      return 0;
    }

    const rect =
      timelineTrack
        .getBoundingClientRect();

    const position =
      utils.clamp(
        event.clientX - rect.left,
        0,
        rect.width
      );

    const progress =
      rect.width > 0
        ? position / rect.width
        : 0;

    return progress *
      state.duration;

  }


  function handleTimelineClick(
    event
  ) {

    const targetTime =
      getTimeFromPointerEvent(
        event
      );

    emit(
      "onSeek",
      targetTime
    );

  }


  function handleTimelineKeyboard(
    event
  ) {

    const allowedKeys = [
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown"
    ];


    if (
      !allowedKeys.includes(
        event.key
      )
    ) {
      return;
    }


    event.preventDefault();


    const seekStep =
      config?.playback?.seekStep ??
      5;


    if (
      event.key === "Home"
    ) {

      emit(
        "onSeek",
        0
      );

      return;

    }


    if (
      event.key === "End"
    ) {

      emit(
        "onSeek",
        state.duration
      );

      return;

    }


    if (
      event.key === "PageUp"
    ) {

      emit(
        "onSeek",
        utils.clamp(
          state.currentTime + 15,
          0,
          state.duration
        )
      );

      return;

    }


    if (
      event.key === "PageDown"
    ) {

      emit(
        "onSeek",
        utils.clamp(
          state.currentTime - 15,
          0,
          state.duration
        )
      );

      return;

    }


    const offset =
      event.key === "ArrowRight"
        ? seekStep
        : -seekStep;


    emit(
      "onSeek",
      utils.clamp(
        state.currentTime +
          offset,
        0,
        state.duration
      )
    );

  }


  /* =======================================================
     PANTALLA COMPLETA
  ======================================================= */

  async function toggleFullscreen() {

    if (!app) {
      return;
    }

    try {

      if (
        !document.fullscreenElement
      ) {

        await app.requestFullscreen?.();

      } else {

        await document.exitFullscreen?.();

      }

    } catch (error) {

      utils.debugLog(
        "No fue posible cambiar el modo de pantalla completa.",
        error
      );

    }

  }


  /* =======================================================
     TECLADO GLOBAL
  ======================================================= */

  function shouldIgnoreKeyboard(
    event
  ) {

    const target =
      event.target;

    if (!target) {
      return false;
    }

    return [
      "INPUT",
      "TEXTAREA",
      "SELECT"
    ].includes(
      target.tagName
    ) ||
    target.isContentEditable;

  }


  function handleGlobalKeyboard(
    event
  ) {

    if (
      !config?.player?.allowKeyboard ||
      shouldIgnoreKeyboard(event)
    ) {
      return;
    }


    if (
      event.code === "Space"
    ) {

      event.preventDefault();

      handlePlayPause();

      return;

    }


    if (
      event.key === "ArrowRight"
    ) {

      event.preventDefault();

      emit(
        "onSeek",
        utils.clamp(
          state.currentTime +
            (
              config?.playback
                ?.seekStep ?? 5
            ),
          0,
          state.duration
        )
      );

      return;

    }


    if (
      event.key === "ArrowLeft"
    ) {

      event.preventDefault();

      emit(
        "onSeek",
        utils.clamp(
          state.currentTime -
            (
              config?.playback
                ?.seekStep ?? 5
            ),
          0,
          state.duration
        )
      );

      return;

    }


    if (
      event.key.toLowerCase() ===
      "m"
    ) {

      event.preventDefault();

      handleSoundToggle();

      return;

    }


    if (
      event.key.toLowerCase() ===
      "r"
    ) {

      event.preventDefault();

      handleRestart();

      return;

    }


    if (
      event.key.toLowerCase() ===
      "f"
    ) {

      event.preventDefault();

      toggleFullscreen();

    }

  }


  /* =======================================================
     REGISTRO DE EVENTOS
  ======================================================= */

  function registerEvents() {

    playPauseButton
      ?.addEventListener(
        "click",
        handlePlayPause
      );


    restartButton
      ?.addEventListener(
        "click",
        handleRestart
      );


    soundButton
      ?.addEventListener(
        "click",
        handleSoundToggle
      );


    fullscreenButton
      ?.addEventListener(
        "click",
        toggleFullscreen
      );


    previousSceneButton
      ?.addEventListener(
        "click",
        handlePreviousScene
      );


    nextSceneButton
      ?.addEventListener(
        "click",
        handleNextScene
      );


    timelineTrack
      ?.addEventListener(
        "click",
        handleTimelineClick
      );


    timelineTrack
      ?.addEventListener(
        "keydown",
        handleTimelineKeyboard
      );


    document.addEventListener(
      "keydown",
      handleGlobalKeyboard
    );


    document.addEventListener(
      "fullscreenchange",
      updateFullscreenIcon
    );

  }


  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  function configure(options = {}) {

    state.moduleData =
      options.moduleData ||
      state.moduleData;

    state.courseData =
      options.courseData ||
      state.courseData;

    state.scenes =
      Array.isArray(
        options.scenes
      )
        ? options.scenes
        : state.scenes;

    state.totalScenes =
      state.scenes.length;


    if (
      utils.isFiniteNumber(
        options.duration
      )
    ) {

      state.duration =
        Math.max(
          0,
          options.duration
        );

    }


    const handlerNames = [
      "onPlay",
      "onPause",
      "onRestart",
      "onSeek",
      "onSoundToggle",
      "onPreviousScene",
      "onNextScene"
    ];


    handlerNames.forEach(
      (handlerName) => {

        if (
          typeof options[
            handlerName
          ] === "function"
        ) {

          state.handlers[
            handlerName
          ] =
            options[
              handlerName
            ];

        }

      }
    );


    updateCourseInformation();

    updateTimeline();

    updateSceneIndicator();

  }


  /* =======================================================
     ACTUALIZACIÓN DEL ESTADO
  ======================================================= */

  function update(options = {}) {

    if (
      utils.isFiniteNumber(
        options.currentTime
      )
    ) {

      state.currentTime =
        utils.clamp(
          options.currentTime,
          0,
          state.duration
        );

    }


    if (
      typeof options.playing ===
      "boolean"
    ) {

      state.playing =
        options.playing;

    }


    if (
      typeof options.soundEnabled ===
      "boolean"
    ) {

      state.soundEnabled =
        options.soundEnabled;

    }


    if (
      Number.isInteger(
        options.currentSceneIndex
      )
    ) {

      state.currentSceneIndex =
        utils.clamp(
          options.currentSceneIndex,
          0,
          Math.max(
            0,
            state.totalScenes - 1
          )
        );

    }


    updatePlayPauseIcon();

    updateSoundIcon();

    updateTimeline();

    updateSceneIndicator();

  }


  /* =======================================================
     FINALIZACIÓN
  ======================================================= */

  function setEndedState() {

    state.playing = false;

    state.currentTime =
      state.duration;

    update({
      playing: false,
      currentTime:
        state.duration
    });

  }


  /* =======================================================
     CONSULTAS
  ======================================================= */

  function getState() {

    return {

      initialized:
        state.initialized,

      playing:
        state.playing,

      soundEnabled:
        state.soundEnabled,

      currentTime:
        state.currentTime,

      duration:
        state.duration,

      currentSceneIndex:
        state.currentSceneIndex,

      totalScenes:
        state.totalScenes

    };

  }


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  function initialize() {

    if (state.initialized) {
      return;
    }

    registerEvents();

    updatePlayPauseIcon();

    updateSoundIcon();

    updateFullscreenIcon();

    updateTimeline();

    updateSceneIndicator();

    state.initialized = true;

  }


  /* =======================================================
     DESTRUIR
  ======================================================= */

  function destroy() {

    playPauseButton
      ?.removeEventListener(
        "click",
        handlePlayPause
      );


    restartButton
      ?.removeEventListener(
        "click",
        handleRestart
      );


    soundButton
      ?.removeEventListener(
        "click",
        handleSoundToggle
      );


    fullscreenButton
      ?.removeEventListener(
        "click",
        toggleFullscreen
      );


    previousSceneButton
      ?.removeEventListener(
        "click",
        handlePreviousScene
      );


    nextSceneButton
      ?.removeEventListener(
        "click",
        handleNextScene
      );


    timelineTrack
      ?.removeEventListener(
        "click",
        handleTimelineClick
      );


    timelineTrack
      ?.removeEventListener(
        "keydown",
        handleTimelineKeyboard
      );


    document.removeEventListener(
      "keydown",
      handleGlobalKeyboard
    );


    document.removeEventListener(
      "fullscreenchange",
      updateFullscreenIcon
    );


    state.initialized = false;

  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    initialize,

    configure,

    update,

    setEndedState,

    toggleFullscreen,

    getState,

    destroy

  });

})();