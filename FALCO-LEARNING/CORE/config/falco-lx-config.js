/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   CONFIGURACIÓN GENERAL DEL MOTOR
   Archivo: falco-lx-config.js
========================================================= */

"use strict";


window.FALCO_LX_CONFIG = Object.freeze({

  /* =======================================================
     IDENTIDAD DEL MOTOR
  ======================================================= */

  engine: {
    name: "FALCO® Learning Experience™",
    shortName: "FALCO-LX",
    version: "1.0.0",
    language: "es-AR"
  },


  /* =======================================================
     REPRODUCCIÓN
  ======================================================= */

  playback: {
    autoplay: false,
    startMuted: true,
    loop: false,
    playbackRate: 1,
    seekStep: 5,
    frameRateReference: 60
  },


  /* =======================================================
     ESCENAS
  ======================================================= */

  scenes: {
    defaultDuration: 8,
    minimumDuration: 2,
    transitionDuration: 800,
    preloadNextScene: true
  },


  /* =======================================================
     TRANSICIONES DISPONIBLES
  ======================================================= */

  transitions: {
    default: "fade",
    allowed: [
      "fade",
      "light",
      "particles",
      "camera",
      "none"
    ]
  },


  /* =======================================================
     TEXTOS
  ======================================================= */

  text: {
    defaultAnimation: "fade-up",
    defaultDelay: 200,
    maximumVisibleLines: 5,
    preserveLineBreaks: true
  },


  /* =======================================================
     IMÁGENES
  ======================================================= */

  images: {
    defaultFit: "cover",
    defaultPosition: "center",
    enableKenBurns: true,
    kenBurnsScale: 1.06,
    preload: true
  },


  /* =======================================================
     AUDIO
  ======================================================= */

  audio: {
    musicVolume: 0.18,
    voiceVolume: 1,
    effectsVolume: 0.35,
    fadeInDuration: 3000,
    fadeOutDuration: 4000,
    syncTolerance: 0.35,
    voiceStartDelay: 0
  },


  /* =======================================================
     PARTÍCULAS
  ======================================================= */

  particles: {
    enabled: true,
    desktopCount: 120,
    mobileCount: 55,
    speed: 1,
    opacity: 0.55
  },


  /* =======================================================
     INTERFAZ DEL REPRODUCTOR
  ======================================================= */

  player: {
    showControls: true,
    showProgress: true,
    showCurrentTime: true,
    showTotalTime: true,
    allowFullscreen: true,
    allowKeyboard: true,
    allowSeeking: true
  },


  /* =======================================================
     ACCESIBILIDAD
  ======================================================= */

  accessibility: {
    respectReducedMotion: true,
    trapFocusInFullscreen: true,
    announceSceneChanges: true
  },


  /* =======================================================
     DEPURACIÓN
  ======================================================= */

  debug: {
    enabled: false,
    logSceneChanges: false,
    logAudioSync: false,
    logContentLoading: false
  }

});