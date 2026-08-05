/* =========================================================
   FALCO® LEARNING EXPERIENCE™
   MOTOR PRINCIPAL
   Archivo: falco-lx-engine.js
========================================================= */

"use strict";


window.FALCO_LX_ENGINE = (() => {

  /* =======================================================
     DEPENDENCIAS
  ======================================================= */

  const utils =
    window.FALCO_LX_UTILS;

  const config =
    window.FALCO_LX_CONFIG;

  const audio =
    window.FALCO_LX_AUDIO;

  const timeline =
    window.FALCO_LX_TIMELINE;

  const animation =
    window.FALCO_LX_ANIMATION;

  const renderer =
    window.FALCO_LX_RENDERER;

  const player =
    window.FALCO_LX_PLAYER;


  /* =======================================================
     CONTENIDO ACTIVO
  ======================================================= */

  const courseData =
    window.FALCO_LX_COURSE;

  const moduleData =
    window.FALCO_LX_MODULE;


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

  const scenesContainer =
    document.getElementById(
      "flxScenes"
    );

  const transitionElement =
    document.getElementById(
      "flxTransition"
    );

  const loadingElement =
    document.getElementById(
      "flxLoading"
    );

  const errorElement =
    document.getElementById(
      "flxError"
    );

  const liveRegion =
    document.getElementById(
      "flxLiveRegion"
    );

  const particlesCanvas =
    document.getElementById(
      "flxParticles"
    );


  /* =======================================================
     ESTADO GENERAL
  ======================================================= */

  const state = {

    initialized: false,

    ready: false,

    destroyed: false,

    currentTime: 0,

    duration: 0,

    playing: false,

    soundEnabled: false,

    currentScene: null,

    currentSceneIndex: 0,

    scenes: [],

    renderedScenes: [],

    previousSceneId: null,

    firstSceneActivation: true,

    particlesEnabled: false,

    particleContext: null,

    particles: [],

    particleWidth: 0,

    particleHeight: 0,

    particleFrameId: null,

    particleLastFrame: 0,

    reducedMotion:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

  };


  /* =======================================================
     VALIDACIÓN DE DEPENDENCIAS
  ======================================================= */

  function validateDependencies() {

    const missing = [];

    if (!utils) {
      missing.push(
        "FALCO_LX_UTILS"
      );
    }

    if (!config) {
      missing.push(
        "FALCO_LX_CONFIG"
      );
    }

    if (!audio) {
      missing.push(
        "FALCO_LX_AUDIO"
      );
    }

    if (!timeline) {
      missing.push(
        "FALCO_LX_TIMELINE"
      );
    }

    if (!animation) {
      missing.push(
        "FALCO_LX_ANIMATION"
      );
    }

    if (!renderer) {
      missing.push(
        "FALCO_LX_RENDERER"
      );
    }

    if (!player) {
      missing.push(
        "FALCO_LX_PLAYER"
      );
    }

    if (missing.length) {

      throw new Error(
        [
          "Faltan componentes del motor:",
          missing.join(", ")
        ].join(" ")
      );

    }

  }


  /* =======================================================
     VALIDACIÓN DEL CONTENIDO
  ======================================================= */

  function validateContent() {

    const courseValidation =
      utils.validateCourse(
        courseData
      );

    if (!courseValidation.valid) {

      throw new Error(
        courseValidation.errors.join(
          " "
        )
      );

    }


    const moduleValidation =
      utils.validateModule(
        moduleData
      );

    if (!moduleValidation.valid) {

      throw new Error(
        moduleValidation.errors.join(
          " "
        )
      );

    }


    const moduleBelongsToCourse =
      !moduleData.courseId ||
      moduleData.courseId ===
        courseData.id;


    if (!moduleBelongsToCourse) {

      throw new Error(
        "El módulo activo no pertenece al curso seleccionado."
      );

    }

  }


  /* =======================================================
     INFORMACIÓN ACCESIBLE
  ======================================================= */

  function announce(message) {

    if (
      !liveRegion ||
      !utils.hasText(message)
    ) {
      return;
    }

    liveRegion.textContent = "";

    window.setTimeout(
      () => {

        liveRegion.textContent =
          message;

      },
      40
    );

  }


  function announceScene(scene) {

    if (
      !config?.accessibility
        ?.announceSceneChanges ||
      !scene
    ) {
      return;
    }

    const content =
      scene.content || {};

    const sceneTitle =
      content.title ||
      content.text ||
      content.quote ||
      `Escena ${
        state.currentSceneIndex + 1
      }`;

    announce(sceneTitle);

  }


  /* =======================================================
     OBTENER ÍNDICE DE ESCENA
  ======================================================= */

  function getSceneIndex(scene) {

    if (!scene) {
      return 0;
    }

    const index =
      state.scenes.findIndex(
        (item) =>
          item.id === scene.id
      );

    return index >= 0
      ? index
      : 0;

  }


  /* =======================================================
     TRANSICIÓN ENTRE ESCENAS
  ======================================================= */

  function playSceneTransition(
    scene
  ) {

    if (
      state.firstSceneActivation ||
      !transitionElement
    ) {
      return;
    }

    const transitionName =
      scene.transitionIn ||
      config?.transitions?.default ||
      "fade";

    animation.playTransition(
      transitionElement,
      transitionName
    );

  }


  /* =======================================================
     ACTIVAR ESCENA
  ======================================================= */

  function activateScene(
    scene,
    options = {}
  ) {

    if (!scene) {
      return;
    }

    const force =
      Boolean(options.force);

    const sceneChanged =
      !state.currentScene ||
      state.currentScene.id !==
        scene.id;


    if (
      !sceneChanged &&
      !force
    ) {
      return;
    }


    const previousScene =
      state.currentScene;

    const previousElement =
      previousScene
        ? renderer.getSceneElement(
            previousScene.id
          )
        : null;


    const sceneElement =
      renderer.getSceneElement(
        scene.id
      );


    if (!sceneElement) {
      return;
    }


    if (previousElement) {

      animation.resetScene(
        previousElement
      );

    }


    animation.resetScene(
      sceneElement
    );


    playSceneTransition(scene);


    renderer.activateScene(
      scene,
      {
        force
      }
    );


    state.previousSceneId =
      previousScene?.id || null;

    state.currentScene =
      scene;

    state.currentSceneIndex =
      getSceneIndex(scene);


    animation.animateScene(
      sceneElement,
      scene
    );


    announceScene(scene);


    player.update({

      currentSceneIndex:
        state.currentSceneIndex

    });


    if (
      config?.debug
        ?.logSceneChanges
    ) {

      utils.debugLog(
        "Cambio de escena",
        {
          id: scene.id,
          index:
            state.currentSceneIndex,
          time:
            state.currentTime
        }
      );

    }


    state.firstSceneActivation =
      false;

  }


  /* =======================================================
     ACTUALIZACIÓN GENERAL
  ======================================================= */

  function handleTimelineUpdate(
    timelineState
  ) {

    if (
      !state.ready ||
      state.destroyed
    ) {
      return;
    }


    state.currentTime =
      timelineState.currentTime;

    state.duration =
      timelineState.duration;

    state.playing =
      timelineState.playing;


    const currentScene =
      utils.getSceneByTime(
        state.scenes,
        state.currentTime
      );


    if (currentScene) {

      activateScene(
        currentScene
      );

    }


    audio.sync(
      state.currentTime,
      state.duration
    );


    player.update({

      currentTime:
        state.currentTime,

      playing:
        state.playing,

      soundEnabled:
        state.soundEnabled,

      currentSceneIndex:
        state.currentSceneIndex

    });

  }


  /* =======================================================
     FINAL DE LA EXPERIENCIA
  ======================================================= */

  function handleTimelineEnd() {

    state.playing = false;

    audio.pause();

    player.setEndedState();

    announce(
      "La experiencia ha finalizado."
    );


    if (
      config?.playback?.loop
    ) {

      window.setTimeout(
        () => {

          restartExperience(true);

        },
        600
      );

    }

  }


  /* =======================================================
     REPRODUCCIÓN
  ======================================================= */

  function playExperience() {

    if (!state.ready) {
      return;
    }

    timeline.play();

    audio.play();

    state.playing = true;

    player.update({
      playing: true
    });

  }


  function pauseExperience() {

    timeline.pause();

    audio.pause();

    state.playing = false;

    player.update({
      playing: false
    });

  }


  function toggleExperience() {

    if (state.playing) {
      pauseExperience();
    } else {
      playExperience();
    }

  }


  /* =======================================================
     REINICIAR
  ======================================================= */

  function restartExperience(
    autoplay = true
  ) {

    if (!state.ready) {
      return;
    }


    timeline.pause();

    audio.restart();

    animation.resetAll(
      scenesContainer
    );


    state.currentTime = 0;

    state.playing = false;

    state.currentScene = null;

    state.previousSceneId = null;

    state.currentSceneIndex = 0;

    state.firstSceneActivation = true;


    timeline.seek(0);


    const firstScene =
      state.scenes[0];


    if (firstScene) {

      activateScene(
        firstScene,
        {
          force: true
        }
      );

    }


    audio.seek(
      0,
      state.duration
    );


    player.update({

      currentTime: 0,

      playing: false,

      currentSceneIndex: 0,

      soundEnabled:
        state.soundEnabled

    });


    if (autoplay) {

      playExperience();

    }

  }


  /* =======================================================
     IR A UN TIEMPO
  ======================================================= */

  function seekExperience(time) {

    if (!state.ready) {
      return;
    }


    const targetTime =
      utils.clamp(
        utils.safeNumber(
          time,
          0
        ),
        0,
        state.duration
      );


    timeline.seek(
      targetTime
    );


    audio.seek(
      targetTime,
      state.duration
    );


    const targetScene =
      utils.getSceneByTime(
        state.scenes,
        targetTime
      );


    if (targetScene) {

      activateScene(
        targetScene,
        {
          force:
            targetScene.id ===
            state.currentScene?.id
        }
      );

    }


    player.update({

      currentTime:
        targetTime,

      playing:
        timeline.isPlaying(),

      currentSceneIndex:
        targetScene
          ? getSceneIndex(
              targetScene
            )
          : 0

    });

  }


  /* =======================================================
     NAVEGACIÓN ENTRE ESCENAS
  ======================================================= */

  function goToScene(index) {

    if (
      !state.ready ||
      !state.scenes.length
    ) {
      return;
    }


    const safeIndex =
      utils.clamp(
        Number(index) || 0,
        0,
        state.scenes.length - 1
      );


    const scene =
      state.scenes[safeIndex];


    if (!scene) {
      return;
    }


    seekExperience(
      scene.start
    );

  }


  function goToPreviousScene() {

    goToScene(
      state.currentSceneIndex - 1
    );

  }


  function goToNextScene() {

    goToScene(
      state.currentSceneIndex + 1
    );

  }


  /* =======================================================
     SONIDO
  ======================================================= */

  function toggleSound() {

    state.soundEnabled =
      audio.toggle();


    player.update({

      soundEnabled:
        state.soundEnabled

    });


    if (
      state.soundEnabled &&
      state.playing
    ) {

      audio.play();

    }


    announce(
      state.soundEnabled
        ? "Sonido activado."
        : "Sonido desactivado."
    );


    return state.soundEnabled;

  }


  /* =======================================================
     CONFIGURAR REPRODUCTOR
  ======================================================= */

  function configurePlayer() {

    player.initialize();


    player.configure({

      moduleData,

      courseData,

      scenes:
        state.scenes,

      duration:
        state.duration,


      onPlay:
        playExperience,


      onPause:
        pauseExperience,


      onRestart:
        () => {
          restartExperience(true);
        },


      onSeek:
        seekExperience,


      onSoundToggle:
        toggleSound,


      onPreviousScene:
        goToScene,


      onNextScene:
        goToScene

    });


    player.update({

      currentTime: 0,

      playing: false,

      soundEnabled:
        state.soundEnabled,

      currentSceneIndex: 0

    });

  }


  /* =======================================================
     CONFIGURAR AUDIO
  ======================================================= */

  function configureAudio() {

    audio.configureFromModule(
      moduleData
    );

    audio.loadSources(
      moduleData,
      courseData
    );


    const startMuted =
      moduleData?.audiovisual
        ?.startMuted ??
      config?.playback
        ?.startMuted ??
      true;


    if (startMuted) {

      audio.disable();

      state.soundEnabled =
        false;

    } else {

      audio.enable();

      state.soundEnabled =
        true;

    }

  }


  /* =======================================================
     CONFIGURAR LÍNEA DE TIEMPO
  ======================================================= */

  function configureTimeline() {

    timeline.configure({

      duration:
        state.duration,

      playbackRate:
        config?.playback
          ?.playbackRate ?? 1,

      onUpdate:
        handleTimelineUpdate,

      onEnd:
        handleTimelineEnd

    });

  }


  /* =======================================================
     PARTÍCULAS
  ======================================================= */

  function getParticleCount() {

    const mobile =
      window.matchMedia(
        "(max-width: 700px)"
      ).matches;


    return mobile
      ? config?.particles
          ?.mobileCount ?? 55
      : config?.particles
          ?.desktopCount ?? 120;

  }


  function createParticle() {

    return {

      x:
        Math.random() *
        state.particleWidth,

      y:
        Math.random() *
        state.particleHeight,

      radius:
        0.4 +
        Math.random() * 1.45,

      opacity:
        0.08 +
        Math.random() * 0.44,

      velocityX:
        (
          Math.random() - 0.5
        ) * 0.018,

      velocityY:
        -0.012 -
        Math.random() * 0.025,

      pulse:
        Math.random() *
        Math.PI * 2,

      pulseSpeed:
        0.0015 +
        Math.random() * 0.0035,

      gold:
        Math.random() > 0.35

    };

  }


  function resizeParticles() {

    if (
      !particlesCanvas ||
      !state.particleContext
    ) {
      return;
    }


    const rect =
      particlesCanvas
        .getBoundingClientRect();


    const ratio =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    state.particleWidth =
      rect.width;

    state.particleHeight =
      rect.height;


    particlesCanvas.width =
      Math.max(
        1,
        Math.floor(
          rect.width * ratio
        )
      );


    particlesCanvas.height =
      Math.max(
        1,
        Math.floor(
          rect.height * ratio
        )
      );


    particlesCanvas.style.width =
      `${rect.width}px`;

    particlesCanvas.style.height =
      `${rect.height}px`;


    state.particleContext
      .setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );

  }


  function updateParticle(
    particle,
    delta
  ) {

    particle.x +=
      particle.velocityX *
      delta;

    particle.y +=
      particle.velocityY *
      delta;

    particle.pulse +=
      particle.pulseSpeed *
      delta;


    if (
      particle.y < -10
    ) {

      particle.y =
        state.particleHeight + 10;

      particle.x =
        Math.random() *
        state.particleWidth;

    }


    if (
      particle.x < -10
    ) {

      particle.x =
        state.particleWidth + 10;

    }


    if (
      particle.x >
      state.particleWidth + 10
    ) {

      particle.x = -10;

    }

  }


  function drawParticle(particle) {

    const context =
      state.particleContext;


    if (!context) {
      return;
    }


    const pulse =
      0.7 +
      Math.sin(
        particle.pulse
      ) * 0.3;


    const opacity =
      particle.opacity *
      pulse;


    const radius =
      particle.radius *
      (
        0.85 +
        pulse * 0.25
      );


    const gradient =
      context.createRadialGradient(

        particle.x,
        particle.y,
        0,

        particle.x,
        particle.y,
        radius * 4

      );


    if (particle.gold) {

      gradient.addColorStop(
        0,
        `rgba(244, 216, 158, ${opacity})`
      );

      gradient.addColorStop(
        0.35,
        `rgba(212, 175, 103, ${opacity * 0.45})`
      );

    } else {

      gradient.addColorStop(
        0,
        `rgba(121, 204, 235, ${opacity})`
      );

      gradient.addColorStop(
        0.35,
        `rgba(46, 123, 216, ${opacity * 0.4})`
      );

    }


    gradient.addColorStop(
      1,
      "rgba(0, 0, 0, 0)"
    );


    context.beginPath();

    context.fillStyle =
      gradient;

    context.arc(

      particle.x,
      particle.y,
      radius * 4,

      0,
      Math.PI * 2

    );

    context.fill();

  }


  function animateParticles(timestamp) {

    if (
      !state.particlesEnabled ||
      !state.particleContext
    ) {

      state.particleFrameId =
        null;

      return;

    }


    if (!state.particleLastFrame) {

      state.particleLastFrame =
        timestamp;

    }


    const delta =
      Math.min(
        timestamp -
        state.particleLastFrame,
        40
      );


    state.particleLastFrame =
      timestamp;


    state.particleContext
      .clearRect(

        0,
        0,

        state.particleWidth,
        state.particleHeight

      );


    state.particles.forEach(
      (particle) => {

        if (!state.reducedMotion) {

          updateParticle(
            particle,
            delta
          );

        }

        drawParticle(
          particle
        );

      }
    );


    state.particleFrameId =
      window.requestAnimationFrame(
        animateParticles
      );

  }


  function initializeParticles() {

    const moduleAllowsParticles =
      moduleData?.audiovisual
        ?.showParticles ??
      config?.particles?.enabled ??
      true;


    if (
      !moduleAllowsParticles ||
      !particlesCanvas
    ) {

      state.particlesEnabled =
        false;

      return;

    }


    const context =
      particlesCanvas.getContext(
        "2d",
        {
          alpha: true
        }
      );


    if (!context) {
      return;
    }


    state.particleContext =
      context;

    state.particlesEnabled =
      true;


    resizeParticles();


    state.particles =
      Array.from(
        {
          length:
            getParticleCount()
        },
        createParticle
      );


    if (
      !state.particleFrameId
    ) {

      state.particleFrameId =
        window.requestAnimationFrame(
          animateParticles
        );

    }

  }


  /* =======================================================
     VISIBILIDAD DE LA PESTAÑA
  ======================================================= */

  function handleVisibilityChange() {

    if (
      document.hidden &&
      state.playing
    ) {

      pauseExperience();

    }

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
     REGISTRO DE EVENTOS GENERALES
  ======================================================= */

  function registerEvents() {

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    window.addEventListener(
      "resize",
      resizeParticles
    );


    registerReducedMotion();

  }


  /* =======================================================
     MOSTRAR LA EXPERIENCIA
  ======================================================= */

  async function revealExperience() {

    await utils.wait(450);


    if (loadingElement) {

      loadingElement.classList.add(
        "is-hidden"
      );

    }


    if (errorElement) {

      errorElement.hidden = true;

    }


    stage?.focus();

  }


  /* =======================================================
     MANEJO DE ERRORES
  ======================================================= */

  function handleInitializationError(
    error
  ) {

    console.error(
      "FALCO-LX:",
      error
    );


    state.ready = false;

    state.initialized = false;


    utils.showError(
      error?.message ||
      "No fue posible iniciar la experiencia."
    );

  }


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  async function initialize() {

    if (
      state.initialized ||
      state.destroyed
    ) {
      return;
    }


    try {

      validateDependencies();

      validateContent();


      state.scenes =
        Array.isArray(
          moduleData.scenes
        )
          ? moduleData.scenes
          : [];


      state.duration =
        utils.getTotalDuration(
          moduleData
        );


      if (
        state.duration <= 0
      ) {

        throw new Error(
          "El módulo no tiene una duración válida."
        );

      }


      state.renderedScenes =
        renderer.renderModule(
          moduleData
        );


      if (
        !state.renderedScenes.length
      ) {

        throw new Error(
          "No fue posible generar las escenas del módulo."
        );

      }


      configureAudio();

      configureTimeline();

      configurePlayer();

      registerEvents();

      initializeParticles();


      state.ready = true;

      state.initialized = true;


      const firstScene =
        state.scenes[0];


      if (firstScene) {

        activateScene(
          firstScene,
          {
            force: true
          }
        );

      }


      timeline.seek(0);


      player.update({

        currentTime: 0,

        playing: false,

        soundEnabled:
          state.soundEnabled,

        currentSceneIndex: 0

      });


      await revealExperience();


      if (
        config?.playback?.autoplay
      ) {

        playExperience();

      }


      utils.debugLog(
        "FALCO-LX inicializado",
        {
          course:
            courseData.id,
          module:
            moduleData.id,
          duration:
            state.duration,
          scenes:
            state.scenes.length
        }
      );

    } catch (error) {

      handleInitializationError(
        error
      );

    }

  }


  /* =======================================================
     DESTRUIR MOTOR
  ======================================================= */

  function destroy() {

    if (state.destroyed) {
      return;
    }


    pauseExperience();


    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    window.removeEventListener(
      "resize",
      resizeParticles
    );


    if (
      state.particleFrameId
    ) {

      window.cancelAnimationFrame(
        state.particleFrameId
      );

      state.particleFrameId =
        null;

    }


    timeline.destroy();

    animation.destroy();

    renderer.destroy();

    player.destroy();

    audio.restart();


    state.ready = false;

    state.initialized = false;

    state.destroyed = true;

  }


  /* =======================================================
     CONSULTAR ESTADO
  ======================================================= */

  function getState() {

    return {

      initialized:
        state.initialized,

      ready:
        state.ready,

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

      currentSceneId:
        state.currentScene?.id ||
        null,

      totalScenes:
        state.scenes.length,

      courseId:
        courseData?.id ||
        null,

      moduleId:
        moduleData?.id ||
        null

    };

  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  return Object.freeze({

    initialize,

    play:
      playExperience,

    pause:
      pauseExperience,

    toggle:
      toggleExperience,

    restart:
      restartExperience,

    seek:
      seekExperience,

    goToScene,

    goToPreviousScene,

    goToNextScene,

    toggleSound,

    getState,

    destroy

  });

})();


/* =========================================================
   INICIO AUTOMÁTICO
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      window.FALCO_LX_ENGINE
        .initialize();

    },
    {
      once: true
    }
  );

} else {

  window.FALCO_LX_ENGINE
    .initialize();

}