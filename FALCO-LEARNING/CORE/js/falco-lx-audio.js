/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR DE AUDIO
   Archivo: falco-lx-audio.js
========================================================= */

"use strict";


window.FALCO_LX_AUDIO = (() => {

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  const utils =
    window.FALCO_LX_UTILS;

  const config =
    window.FALCO_LX_CONFIG;


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  const music =
    document.getElementById("flxMusic");

  const narration =
    document.getElementById("flxNarration");

  const soundEffect =
    document.getElementById("flxSoundEffect");


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    enabled: false,

    playing: false,

    currentTime: 0,

    duration: 0,

    musicVolume:
      config?.audio?.musicVolume ?? 0.18,

    voiceVolume:
      config?.audio?.voiceVolume ?? 1,

    effectsVolume:
      config?.audio?.effectsVolume ?? 0.35,

    fadeInDuration:
      config?.audio?.fadeInDuration ?? 3000,

    fadeOutDuration:
      config?.audio?.fadeOutDuration ?? 4000,

    syncTolerance:
      config?.audio?.syncTolerance ?? 0.35,

    voiceStartDelay:
      config?.audio?.voiceStartDelay ?? 0

  };


  /* =======================================================
     UTILIDADES INTERNAS
  ======================================================= */

  function hasTrack(track) {

    return Boolean(
      track &&
      track.src
    );

  }


  function canPlayAtTime(
    track,
    time
  ) {

    if (!track) {
      return false;
    }

    if (
      Number.isFinite(track.duration) &&
      track.duration > 0 &&
      time >= track.duration
    ) {
      return false;
    }

    return true;

  }


  function setSafeTime(
    track,
    time
  ) {

    if (!track) {
      return;
    }

    let safeTime =
      Math.max(
        0,
        Number(time) || 0
      );

    if (
      Number.isFinite(track.duration) &&
      track.duration > 0
    ) {

      safeTime =
        Math.min(
          safeTime,
          Math.max(
            0,
            track.duration - 0.05
          )
        );

    }

    try {

      track.currentTime =
        safeTime;

    } catch (error) {

      utils?.debugLog(
        "La pista todavía está cargando.",
        error
      );

    }

  }


  function pauseTrack(track) {

    if (
      track &&
      !track.paused
    ) {
      track.pause();
    }

  }


  function resetTrack(track) {

    if (!track) {
      return;
    }

    track.pause();

    setSafeTime(
      track,
      0
    );

  }


  function playTrack(
    track,
    time
  ) {

    if (
      !track ||
      !state.enabled ||
      !canPlayAtTime(track, time)
    ) {
      return;
    }

    setSafeTime(
      track,
      time
    );

    track
      .play()
      .catch((error) => {

        utils?.debugLog(
          "El navegador bloqueó temporalmente una pista.",
          error
        );

      });

  }


  /* =======================================================
     VOLUMEN MUSICAL DINÁMICO
  ======================================================= */

  function getMusicVolume(
    currentTime,
    totalDuration
  ) {

    const baseVolume =
      state.musicVolume;

    const fadeInSeconds =
      state.fadeInDuration / 1000;

    const fadeOutSeconds =
      state.fadeOutDuration / 1000;


    if (
      fadeInSeconds > 0 &&
      currentTime < fadeInSeconds
    ) {

      return utils.clamp(
        (
          currentTime /
          fadeInSeconds
        ) * baseVolume,
        0,
        baseVolume
      );

    }


    const fadeOutStart =
      Math.max(
        0,
        totalDuration -
        fadeOutSeconds
      );


    if (
      fadeOutSeconds > 0 &&
      currentTime >= fadeOutStart
    ) {

      const remaining =
        totalDuration -
        currentTime;

      return utils.clamp(
        (
          remaining /
          fadeOutSeconds
        ) * baseVolume,
        0,
        baseVolume
      );

    }


    return baseVolume;

  }


  function applyVolumes() {

    if (music) {
      music.volume =
        utils.clamp(
          getMusicVolume(
            state.currentTime,
            state.duration
          ),
          0,
          1
        );
    }

    if (narration) {
      narration.volume =
        utils.clamp(
          state.voiceVolume,
          0,
          1
        );
    }

    if (soundEffect) {
      soundEffect.volume =
        utils.clamp(
          state.effectsVolume,
          0,
          1
        );
    }

  }


  /* =======================================================
     SINCRONIZACIÓN
  ======================================================= */

  function syncTrack(
    track,
    targetTime,
    force = false
  ) {

    if (!track) {
      return;
    }

    if (
      !canPlayAtTime(
        track,
        targetTime
      )
    ) {
      pauseTrack(track);
      return;
    }

    const difference =
      Math.abs(
        track.currentTime -
        targetTime
      );

    if (
      force ||
      difference >
        state.syncTolerance
    ) {

      setSafeTime(
        track,
        targetTime
      );

    }

  }


  function sync(
    currentTime,
    totalDuration,
    force = false
  ) {

    state.currentTime =
      Math.max(
        0,
        Number(currentTime) || 0
      );

    state.duration =
      Math.max(
        0,
        Number(totalDuration) || 0
      );


    const narrationTime =
      Math.max(
        0,
        state.currentTime -
        state.voiceStartDelay
      );


    syncTrack(
      music,
      state.currentTime,
      force
    );


    if (
      state.currentTime <
      state.voiceStartDelay
    ) {

      pauseTrack(narration);

    } else {

      syncTrack(
        narration,
        narrationTime,
        force
      );

    }


    applyVolumes();

  }


  /* =======================================================
     CARGAR ARCHIVOS
  ======================================================= */

  function loadSources(
    moduleData,
    courseData
  ) {

    const moduleMedia =
      moduleData?.media || {};

    const courseAudio =
      courseData?.audio || {};


    if (music) {

      music.src =
        utils.normalizePath(
          moduleMedia.music ||
          courseAudio.music ||
          ""
        );

      music.preload = "metadata";

    }


    if (narration) {

      narration.src =
        utils.normalizePath(
          moduleMedia.narration ||
          ""
        );

      narration.preload = "metadata";

    }


    if (soundEffect) {

      soundEffect.src = "";

      soundEffect.preload =
        "metadata";

    }


    applyVolumes();

  }


  /* =======================================================
     ACTIVAR Y DESACTIVAR SONIDO
  ======================================================= */

  function enable() {

    state.enabled = true;

    if (music) {
      music.muted = false;
    }

    if (narration) {
      narration.muted = false;
    }

    if (soundEffect) {
      soundEffect.muted = false;
    }

    applyVolumes();

    if (state.playing) {
      play();
    }

  }


  function disable() {

    state.enabled = false;

    pauseTrack(music);
    pauseTrack(narration);
    pauseTrack(soundEffect);

  }


  function toggle() {

    if (state.enabled) {
      disable();
    } else {
      enable();
    }

    return state.enabled;

  }


  /* =======================================================
     REPRODUCCIÓN
  ======================================================= */

  function play() {

    state.playing = true;

    if (!state.enabled) {
      return;
    }

    applyVolumes();

    playTrack(
      music,
      state.currentTime
    );


    if (
      state.currentTime >=
      state.voiceStartDelay
    ) {

      playTrack(
        narration,
        Math.max(
          0,
          state.currentTime -
          state.voiceStartDelay
        )
      );

    }

  }


  function pause() {

    state.playing = false;

    pauseTrack(music);
    pauseTrack(narration);
    pauseTrack(soundEffect);

  }


  function restart() {

    pause();

    state.currentTime = 0;

    resetTrack(music);
    resetTrack(narration);
    resetTrack(soundEffect);

    applyVolumes();

  }


  function seek(
    time,
    totalDuration
  ) {

    sync(
      time,
      totalDuration,
      true
    );

    if (
      state.playing &&
      state.enabled
    ) {
      play();
    }

  }


  /* =======================================================
     EFECTOS DE SONIDO
  ======================================================= */

  function playEffect(
    source,
    volume = null
  ) {

    if (
      !state.enabled ||
      !soundEffect ||
      !utils.hasText(source)
    ) {
      return;
    }

    soundEffect.pause();

    soundEffect.src =
      utils.normalizePath(source);

    soundEffect.currentTime = 0;

    soundEffect.volume =
      utils.clamp(
        volume ?? state.effectsVolume,
        0,
        1
      );

    soundEffect
      .play()
      .catch((error) => {

        utils?.debugLog(
          "No fue posible reproducir el efecto.",
          error
        );

      });

  }


  /* =======================================================
     ERRORES
  ======================================================= */

  function registerTrackEvents() {

    [
      {
        track: music,
        label: "música"
      },
      {
        track: narration,
        label: "narración"
      },
      {
        track: soundEffect,
        label: "efecto"
      }
    ].forEach((item) => {

      item.track
        ?.addEventListener(
          "error",
          () => {

            utils?.debugLog(
              `No se pudo cargar la pista de ${item.label}.`
            );

          }
        );

    });

  }


  /* =======================================================
     CONFIGURACIÓN DEL MÓDULO
  ======================================================= */

  function configureFromModule(
    moduleData
  ) {

    const audiovisual =
      moduleData?.audiovisual || {};


    state.musicVolume =
      utils.safeNumber(
        audiovisual.musicVolume,
        config?.audio?.musicVolume ?? 0.18
      );


    state.voiceVolume =
      utils.safeNumber(
        audiovisual.voiceVolume,
        config?.audio?.voiceVolume ?? 1
      );


    state.fadeInDuration =
      utils.safeNumber(
        audiovisual.fadeInDuration,
        config?.audio?.fadeInDuration ?? 3000
      );


    state.fadeOutDuration =
      utils.safeNumber(
        audiovisual.fadeOutDuration,
        config?.audio?.fadeOutDuration ?? 4000
      );


    state.voiceStartDelay =
      utils.safeNumber(
        audiovisual.voiceStartDelay,
        config?.audio?.voiceStartDelay ?? 0
      );


    applyVolumes();

  }


  /* =======================================================
     CONSULTAS DE ESTADO
  ======================================================= */

  function isEnabled() {
    return state.enabled;
  }


  function isPlaying() {
    return state.playing;
  }


  function getState() {

    return {
      ...state
    };

  }


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  registerTrackEvents();


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    loadSources,

    configureFromModule,

    enable,

    disable,

    toggle,

    play,

    pause,

    restart,

    seek,

    sync,

    playEffect,

    isEnabled,

    isPlaying,

    getState

  });

})();