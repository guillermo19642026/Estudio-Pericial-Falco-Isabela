/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR DE LÍNEA DE TIEMPO
   Archivo: falco-lx-timeline.js
========================================================= */

"use strict";


window.FALCO_LX_TIMELINE = (() => {

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

    currentTime: 0,

    duration: 0,

    playing: false,

    playbackRate:
      config?.playback?.playbackRate ?? 1,

    lastFrameTime: 0,

    animationFrameId: null,

    onUpdate: null,

    onEnd: null

  };


  /* =======================================================
     ACTUALIZACIÓN
  ======================================================= */

  function notifyUpdate() {

    if (
      typeof state.onUpdate ===
      "function"
    ) {

      state.onUpdate({
        currentTime: state.currentTime,
        duration: state.duration,
        progress:
          state.duration > 0
            ? state.currentTime /
              state.duration
            : 0,
        playing: state.playing
      });

    }

  }


  function notifyEnd() {

    if (
      typeof state.onEnd ===
      "function"
    ) {
      state.onEnd();
    }

  }


  /* =======================================================
     CICLO PRINCIPAL
  ======================================================= */

  function frame(timestamp) {

    if (!state.playing) {

      state.animationFrameId = null;

      return;

    }


    if (!state.lastFrameTime) {
      state.lastFrameTime = timestamp;
    }


    const delta =
      Math.min(
        (
          timestamp -
          state.lastFrameTime
        ) / 1000,
        0.12
      );


    state.lastFrameTime = timestamp;


    state.currentTime +=
      delta *
      state.playbackRate;


    if (
      state.currentTime >=
      state.duration
    ) {

      state.currentTime =
        state.duration;

      state.playing = false;

      state.lastFrameTime = 0;

      state.animationFrameId = null;

      notifyUpdate();

      notifyEnd();

      return;

    }


    notifyUpdate();


    state.animationFrameId =
      window.requestAnimationFrame(
        frame
      );

  }


  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  function configure(options = {}) {

    state.duration =
      Math.max(
        0,
        utils.safeNumber(
          options.duration,
          state.duration
        )
      );


    state.playbackRate =
      Math.max(
        0.1,
        utils.safeNumber(
          options.playbackRate,
          state.playbackRate
        )
      );


    if (
      typeof options.onUpdate ===
      "function"
    ) {
      state.onUpdate =
        options.onUpdate;
    }


    if (
      typeof options.onEnd ===
      "function"
    ) {
      state.onEnd =
        options.onEnd;
    }


    state.currentTime =
      utils.clamp(
        state.currentTime,
        0,
        state.duration
      );


    notifyUpdate();

  }


  /* =======================================================
     REPRODUCIR
  ======================================================= */

  function play() {

    if (state.duration <= 0) {
      return;
    }


    if (
      state.currentTime >=
      state.duration
    ) {
      state.currentTime = 0;
    }


    if (state.playing) {
      return;
    }


    state.playing = true;

    state.lastFrameTime = 0;


    if (!state.animationFrameId) {

      state.animationFrameId =
        window.requestAnimationFrame(
          frame
        );

    }


    notifyUpdate();

  }


  /* =======================================================
     PAUSAR
  ======================================================= */

  function pause() {

    state.playing = false;

    state.lastFrameTime = 0;


    if (state.animationFrameId) {

      window.cancelAnimationFrame(
        state.animationFrameId
      );

      state.animationFrameId = null;

    }


    notifyUpdate();

  }


  /* =======================================================
     ALTERNAR
  ======================================================= */

  function toggle() {

    if (state.playing) {
      pause();
    } else {
      play();
    }

    return state.playing;

  }


  /* =======================================================
     REINICIAR
  ======================================================= */

  function restart(
    autoplay = false
  ) {

    pause();

    state.currentTime = 0;

    notifyUpdate();


    if (autoplay) {
      play();
    }

  }


  /* =======================================================
     IR A UN TIEMPO
  ======================================================= */

  function seek(time) {

    state.currentTime =
      utils.clamp(
        utils.safeNumber(
          time,
          0
        ),
        0,
        state.duration
      );


    state.lastFrameTime = 0;

    notifyUpdate();

    return state.currentTime;

  }


  /* =======================================================
     AVANZAR O RETROCEDER
  ======================================================= */

  function step(seconds) {

    const offset =
      utils.safeNumber(
        seconds,
        config?.playback?.seekStep ?? 5
      );


    return seek(
      state.currentTime +
      offset
    );

  }


  /* =======================================================
     CAMBIAR VELOCIDAD
  ======================================================= */

  function setPlaybackRate(rate) {

    state.playbackRate =
      Math.max(
        0.1,
        utils.safeNumber(
          rate,
          1
        )
      );

    return state.playbackRate;

  }


  /* =======================================================
     CONSULTAS
  ======================================================= */

  function getCurrentTime() {
    return state.currentTime;
  }


  function getDuration() {
    return state.duration;
  }


  function isPlaying() {
    return state.playing;
  }


  function getProgress() {

    if (state.duration <= 0) {
      return 0;
    }

    return utils.clamp(
      state.currentTime /
      state.duration,
      0,
      1
    );

  }


  function getState() {

    return {
      currentTime:
        state.currentTime,

      duration:
        state.duration,

      playing:
        state.playing,

      playbackRate:
        state.playbackRate,

      progress:
        getProgress()
    };

  }


  /* =======================================================
     LIMPIEZA
  ======================================================= */

  function destroy() {

    pause();

    state.currentTime = 0;

    state.duration = 0;

    state.onUpdate = null;

    state.onEnd = null;

  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    configure,

    play,

    pause,

    toggle,

    restart,

    seek,

    step,

    setPlaybackRate,

    getCurrentTime,

    getDuration,

    getProgress,

    isPlaying,

    getState,

    destroy

  });

})();