/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR DE AUDIO v2.0
   Música + múltiples narraciones
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
     ELEMENTOS FIJOS
  ======================================================= */

  const music =
    document.getElementById(
      "flxMusic"
    );

  const originalNarration =
    document.getElementById(
      "flxNarration"
    );

  const soundEffect =
    document.getElementById(
      "flxSoundEffect"
    );


  /* =======================================================
     ESTADO
  ======================================================= */

  const state = {

    enabled: false,

    playing: false,

    currentTime: 0,

    duration: 0,

    musicVolume:
      config?.audio?.musicVolume ??
      0.18,

    voiceVolume:
      config?.audio?.voiceVolume ??
      1,

    effectsVolume:
      config?.audio?.effectsVolume ??
      0.35,

    fadeInDuration:
      config?.audio?.fadeInDuration ??
      3000,

    fadeOutDuration:
      config?.audio?.fadeOutDuration ??
      4000,

    syncTolerance:
      config?.audio?.syncTolerance ??
      0.35,

    narrationTracks: [],

    activeNarrationIndex: -1

  };


  /* =======================================================
     UTILIDADES INTERNAS
  ======================================================= */

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
      Number.isFinite(
        track.duration
      ) &&
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


  function playTrack(
    track,
    localTime
  ) {

    if (
      !track ||
      !state.enabled
    ) {
      return;
    }

    setSafeTime(
      track,
      localTime
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


  function clearNarrationTracks() {

    state.narrationTracks.forEach(
      (item) => {

        item.element.pause();

        item.element.removeAttribute(
          "src"
        );

        item.element.load();

      }
    );

    state.narrationTracks = [];

    state.activeNarrationIndex = -1;

  }


  /* =======================================================
     CREAR PISTAS DE NARRACIÓN
  ======================================================= */

  function createNarrationTrack(
    narrationData,
    index
  ) {

    const element =
      index === 0 &&
      originalNarration
        ? originalNarration
        : new Audio();

    element.preload = "metadata";

    element.src =
      utils.normalizePath(
        narrationData.source || ""
      );

    element.volume =
      utils.clamp(
        state.voiceVolume,
        0,
        1
      );

    element.muted =
      !state.enabled;

    element.dataset.flxNarrationId =
      narrationData.id ||
      `narracion-${index + 1}`;

    element.addEventListener(
      "error",
      () => {

        utils?.debugLog(
          `No se pudo cargar la narración ${
            narrationData.id ||
            index + 1
          }.`
        );

      }
    );

    return {

      id:
        narrationData.id ||
        `narracion-${index + 1}`,

      source:
        narrationData.source || "",

      start:
        Math.max(
          0,
          utils.safeNumber(
            narrationData.start,
            0
          )
        ),

      element

    };

  }


  function loadNarrations(
    moduleMedia
  ) {

    clearNarrationTracks();

    let narrations = [];

    if (
      Array.isArray(
        moduleMedia.narrations
      )
    ) {

      narrations =
        moduleMedia.narrations;

    } else if (
      utils.hasText(
        moduleMedia.narration
      )
    ) {

      narrations = [
        {
          id: "parte-01",
          source:
            moduleMedia.narration,
          start: 0
        }
      ];

    }

    state.narrationTracks =
      narrations
        .filter(
          (item) =>
            utils.hasText(
              item?.source
            )
        )
        .map(
          createNarrationTrack
        )
        .sort(
          (a, b) =>
            a.start - b.start
        );

  }


  /* =======================================================
     IDENTIFICAR NARRACIÓN ACTIVA
  ======================================================= */

  function getActiveNarrationIndex(
    globalTime
  ) {

    if (
      !state.narrationTracks.length
    ) {
      return -1;
    }

    let activeIndex = -1;

    state.narrationTracks.forEach(
      (track, index) => {

        const nextTrack =
          state.narrationTracks[
            index + 1
          ];

        const endBoundary =
          nextTrack
            ? nextTrack.start
            : Infinity;

        if (
          globalTime >= track.start &&
          globalTime < endBoundary
        ) {
          activeIndex = index;
        }

      }
    );

    return activeIndex;

  }


  function getNarrationLocalTime(
    track,
    globalTime
  ) {

    if (!track) {
      return 0;
    }

    return Math.max(
      0,
      globalTime - track.start
    );

  }


  function pauseInactiveNarrations(
    activeIndex
  ) {

    state.narrationTracks.forEach(
      (track, index) => {

        if (index !== activeIndex) {
          pauseTrack(
            track.element
          );
        }

      }
    );

  }


  /* =======================================================
     VOLUMEN DE MÚSICA
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

      music.muted =
        !state.enabled;

    }


    state.narrationTracks.forEach(
      (track) => {

        track.element.volume =
          utils.clamp(
            state.voiceVolume,
            0,
            1
          );

        track.element.muted =
          !state.enabled;

      }
    );


    if (soundEffect) {

      soundEffect.volume =
        utils.clamp(
          state.effectsVolume,
          0,
          1
        );

      soundEffect.muted =
        !state.enabled;

    }

  }


  /* =======================================================
     SINCRONIZACIÓN DE MÚSICA
  ======================================================= */

  function syncMusic(
    force = false
  ) {

    if (!music?.src) {
      return;
    }

    const difference =
      Math.abs(
        music.currentTime -
        state.currentTime
      );

    if (
      force ||
      difference >
        state.syncTolerance
    ) {

      setSafeTime(
        music,
        state.currentTime
      );

    }

  }


  /* =======================================================
     SINCRONIZACIÓN DE NARRACIONES
  ======================================================= */

  function syncNarrations(
    force = false
  ) {

    const activeIndex =
      getActiveNarrationIndex(
        state.currentTime
      );

    pauseInactiveNarrations(
      activeIndex
    );

    state.activeNarrationIndex =
      activeIndex;

    if (activeIndex < 0) {
      return;
    }

    const activeTrack =
      state.narrationTracks[
        activeIndex
      ];

    const localTime =
      getNarrationLocalTime(
        activeTrack,
        state.currentTime
      );

    const difference =
      Math.abs(
        activeTrack.element.currentTime -
        localTime
      );

    if (
      force ||
      difference >
        state.syncTolerance
    ) {

      setSafeTime(
        activeTrack.element,
        localTime
      );

    }


    if (
      state.playing &&
      state.enabled &&
      activeTrack.element.paused
    ) {

      activeTrack.element
        .play()
        .catch((error) => {

          utils?.debugLog(
            "La narración espera interacción del usuario.",
            error
          );

        });

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

    syncMusic(force);

    syncNarrations(force);

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

      music.preload =
        "metadata";

    }


    loadNarrations(
      moduleMedia
    );


    if (soundEffect) {

      soundEffect.removeAttribute(
        "src"
      );

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

    applyVolumes();

    if (state.playing) {
      play();
    }

  }


  function disable() {

    state.enabled = false;

    pauseTrack(music);

    state.narrationTracks.forEach(
      (track) => {
        pauseTrack(
          track.element
        );
      }
    );

    pauseTrack(soundEffect);

    applyVolumes();

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


    if (music?.src) {

      playTrack(
        music,
        state.currentTime
      );

    }


    const activeIndex =
      getActiveNarrationIndex(
        state.currentTime
      );

    pauseInactiveNarrations(
      activeIndex
    );

    state.activeNarrationIndex =
      activeIndex;


    if (activeIndex >= 0) {

      const activeTrack =
        state.narrationTracks[
          activeIndex
        ];

      playTrack(
        activeTrack.element,
        getNarrationLocalTime(
          activeTrack,
          state.currentTime
        )
      );

    }

  }


  function pause() {

    state.playing = false;

    pauseTrack(music);

    state.narrationTracks.forEach(
      (track) => {
        pauseTrack(
          track.element
        );
      }
    );

    pauseTrack(soundEffect);

  }


  function restart() {

    pause();

    state.currentTime = 0;

    state.activeNarrationIndex = -1;

    resetTrack(music);

    state.narrationTracks.forEach(
      (track) => {
        resetTrack(
          track.element
        );
      }
    );

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
     EFECTOS
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
      utils.normalizePath(
        source
      );

    soundEffect.currentTime = 0;

    soundEffect.volume =
      utils.clamp(
        volume ??
        state.effectsVolume,
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
     CONFIGURACIÓN POR MÓDULO
  ======================================================= */

  function configureFromModule(
    moduleData
  ) {

    const audiovisual =
      moduleData?.audiovisual || {};


    state.musicVolume =
      utils.safeNumber(
        audiovisual.musicVolume,
        config?.audio
          ?.musicVolume ?? 0.18
      );


    state.voiceVolume =
      utils.safeNumber(
        audiovisual.voiceVolume,
        config?.audio
          ?.voiceVolume ?? 1
      );


    state.effectsVolume =
      utils.safeNumber(
        audiovisual.effectsVolume,
        config?.audio
          ?.effectsVolume ?? 0.35
      );


    state.fadeInDuration =
      utils.safeNumber(
        audiovisual.fadeInDuration,
        config?.audio
          ?.fadeInDuration ?? 3000
      );


    state.fadeOutDuration =
      utils.safeNumber(
        audiovisual.fadeOutDuration,
        config?.audio
          ?.fadeOutDuration ?? 4000
      );


    state.syncTolerance =
      utils.safeNumber(
        audiovisual.syncTolerance,
        config?.audio
          ?.syncTolerance ?? 0.35
      );


    applyVolumes();

  }


  /* =======================================================
     CONSULTAS
  ======================================================= */

  function isEnabled() {
    return state.enabled;
  }


  function isPlaying() {
    return state.playing;
  }


  function getState() {

    return {

      enabled:
        state.enabled,

      playing:
        state.playing,

      currentTime:
        state.currentTime,

      duration:
        state.duration,

      musicVolume:
        state.musicVolume,

      voiceVolume:
        state.voiceVolume,

      narrationCount:
        state.narrationTracks.length,

      activeNarrationIndex:
        state.activeNarrationIndex,

      activeNarrationId:
        state.activeNarrationIndex >= 0
          ? state.narrationTracks[
              state.activeNarrationIndex
            ]?.id || null
          : null

    };

  }


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