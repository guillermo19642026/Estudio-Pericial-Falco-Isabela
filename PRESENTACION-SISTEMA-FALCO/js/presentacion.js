/* ==========================================================
   PRESENTACIÓN SISTEMA FALCO®
   Versión funcional estable
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================
     MOTOR DE VOZ DE AION
  ======================================================== */

  function loadAionVoice() {

    if (!("speechSynthesis" in window)) {
      console.warn(
        "Este navegador no admite síntesis de voz."
      );

      AION_VOICE_CONFIG.enabled = false;
      return;
    }

    const voices =
      window.speechSynthesis.getVoices();

    if (!voices.length) {
      return;
    }

    const preferredNames = [
      "Microsoft Tomás",
      "Microsoft Tomas",
      "Tomás",
      "Tomas",
      "Microsoft Elena",
      "Microsoft Sabina"
    ];

    aionVoice =
      voices.find(voice =>
        preferredNames.some(name =>
          voice.name
            .toLowerCase()
            .includes(name.toLowerCase())
        )
      ) ||
      voices.find(voice =>
        voice.lang.toLowerCase() === "es-ar"
      ) ||
      voices.find(voice =>
        voice.lang.toLowerCase().startsWith("es")
      ) ||
      null;

    if (aionVoice) {
      console.log(
        `Voz de AION seleccionada: ${aionVoice.name}`
      );
    }
  }


  function stopAionVoice() {

    if (!("speechSynthesis" in window)) {
      return;
    }

    sceneToken += 1;
    activeUtterance = null;

    window.speechSynthesis.cancel();
  }


  function speakAsAion(text) {

    if (
      !AION_VOICE_CONFIG.enabled ||
      !text ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang =
      AION_VOICE_CONFIG.lang;

    utterance.rate =
      AION_VOICE_CONFIG.rate;

    utterance.pitch =
      AION_VOICE_CONFIG.pitch;

    utterance.volume =
      AION_VOICE_CONFIG.volume;

    if (aionVoice) {
      utterance.voice = aionVoice;
    }

    activeUtterance = utterance;

    utterance.onend = () => {

      if (activeUtterance === utterance) {
        activeUtterance = null;
      }

    };

    utterance.onerror = event => {

      if (activeUtterance === utterance) {
        activeUtterance = null;
      }

      if (
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        console.warn(
          "La narración de AION no pudo completarse.",
          event.error
        );
      }

    };

    window.speechSynthesis.speak(utterance);
  }


  function buildSceneNarration(scene) {

    return `${scene.title}. ${scene.text}`;

  }


  /* ========================================================
     ESCENAS
  ======================================================== */

  const scenes = [

    {
      category: "Sistema FALCO®",
      title: "Bienvenido al ecosistema profesional",
      text: "Desde aquí comienza el acceso a las principales áreas, servicios y herramientas del Sistema FALCO®.",
      image: "assets/screenshots/01-inicio.jpg",
      duration: 9000,
      emphasis: true
    },

    {
      category: "Servicios periciales",
      title: "Pericia Psicológica",
      text: "El estudio realiza evaluaciones psicológicas forenses en los ámbitos civil, laboral, penal y de familia.",
      image: "assets/screenshots/02-pericia-psicologica.jpg",
      duration: 7500
    },

    {
      category: "Daño psíquico",
      title: "Evaluación del Daño Psíquico",
      text: "La evaluación analiza las consecuencias psicológicas vinculadas con accidentes, conflictos y otros hechos judiciales.",
      image: "assets/screenshots/03-danio-psiquico.jpg",
      duration: 7500
    },

    {
      category: "Evaluación judicial",
      title: "Evaluación Psicológica Judicial",
      text: "Entrevistas clínicas, técnicas psicométricas y análisis integral aplicados al contexto judicial.",
      image: "assets/screenshots/04-evaluacion-judicial.jpg",
      duration: 7000
    },

    {
      category: "Informes",
      title: "Informe Pericial Psicológico",
      text: "Elaboración de informes técnicos claros, fundamentados y adecuados a los puntos de pericia solicitados.",
      image: "assets/screenshots/05-informe-pericial.jpg",
      duration: 7000
    },

    {
      category: "Perito de parte",
      title: "Asistencia Técnica de Parte",
      text: "Acompañamiento profesional durante la evaluación, análisis de la pericia oficial y asesoramiento durante el proceso.",
      image: "assets/screenshots/06-perito-de-parte.jpg",
      duration: 7500
    },

    {
      category: "Impugnaciones",
      title: "Impugnación de Pericias Psicológicas",
      text: "Análisis técnico de dictámenes, observaciones, pedidos de explicaciones e impugnaciones fundadas.",
      image: "assets/screenshots/07-impugnaciones.jpg",
      duration: 7500
    },

    {
      category: "Contrainformes",
      title: "Contrainformes Psicológicos",
      text: "Revisión especializada de evaluaciones e informes para detectar inconsistencias metodológicas o diagnósticas.",
      image: "assets/screenshots/08-contrainformes.jpg",
      duration: 7000
    },

    {
      category: "Abogados",
      title: "Consultoría Técnica para Estudios Jurídicos",
      text: "Los abogados y estudios jurídicos reciben asesoramiento pericial, análisis de informes y asistencia estratégica.",
      image: "assets/screenshots/09-estudios-juridicos.jpg",
      duration: 9000,
      emphasis: true
    },

    {
      category: "Supervisión",
      title: "Asistencia a Peritos Psicólogos",
      text: "Supervisión de casos, elección de técnicas, corrección de informes, escritos judiciales y seguimiento de causas.",
      image: "assets/screenshots/10-supervision-peritos.jpg",
      duration: 9000,
      emphasis: true
    },

    {
      category: "Formación",
      title: "Cursos y Talleres",
      text: "Propuestas de capacitación para profesionales que desean iniciarse o perfeccionarse en la actividad pericial.",
      image: "assets/screenshots/11-cursos-talleres.jpg",
      duration: 8000
    },

    {
      category: "Formación profesional",
      title: "Formación Especializada",
      text: "Contenidos orientados a la práctica, la evaluación psicológica, la escritura pericial y la intervención judicial.",
      image: "assets/screenshots/12-formacion-profesional.jpg",
      duration: 7500
    },

    {
      category: "Método FALCO®",
      title: "Una metodología propia",
      text: "El Método FALCO® organiza el proceso de evaluación, análisis e integración de resultados desde una perspectiva profesional.",
      image: "assets/screenshots/13-metodo-falco.jpg",
      duration: 8000
    },

    {
      category: "Programa Premium",
      title: "Acompañamiento Profesional Integral",
      text: "Un programa pensado para brindar formación, recursos, supervisión y asistencia continua.",
      image: "assets/screenshots/14-programa-premium.jpg",
      duration: 7500
    },

    {
      category: "Área Profesional",
      title: "Centro Profesional FALCO®",
      text: "Un espacio exclusivo con novedades, biblioteca, tests, informes, escritos judiciales, cursos y consultoría.",
      image: "assets/screenshots/15-area-profesional.jpg",
      duration: 9500,
      emphasis: true
    },

    {
      category: "Biblioteca Profesional",
      title: "Recursos Técnicos Especializados",
      text: "Material profesional organizado para acompañar la evaluación, la redacción de informes y la práctica judicial.",
      image: "assets/screenshots/16-biblioteca-profesional.jpg",
      duration: 8500
    },

    {
      category: "Biblioteca FALCO®",
      title: "Conocimiento organizado",
      text: "La biblioteca reúne doctrina, modelos, publicaciones y contenidos elaborados para la actividad profesional.",
      image: "assets/screenshots/17-biblioteca-falco.jpg",
      duration: 8500,
      emphasis: true
    },

    {
      category: "Escritos judiciales",
      title: "Modelos y Herramientas Procesales",
      text: "Recursos para contestaciones, impugnaciones, aclaraciones, apelaciones y otras presentaciones judiciales.",
      image: "assets/screenshots/18-escritos-judiciales.jpg",
      duration: 7500
    },

    {
      category: "Plataforma de Periciados",
      title: "Evaluación digital guiada",
      text: "Cada periciado accede a un espacio privado para completar documentación, evaluaciones y antecedentes personales.",
      image: "assets/screenshots/19-plataforma-periciados.jpg",
      duration: 10000,
      emphasis: true
    },

    {
      category: "Panel del Periciado",
      title: "Seguimiento de cada etapa",
      text: "El panel muestra el progreso, las evaluaciones completadas, la documentación pendiente y el siguiente paso.",
      image: "assets/screenshots/20-dashboard-periciado.jpg",
      duration: 9000,
      emphasis: true
    },

    {
      category: "Evaluaciones psicológicas",
      title: "Instrumentos Psicométricos",
      text: "La plataforma permite administrar instrumentos como SCL-90, BDI, BAI y Escala de Desesperanza.",
      image: "assets/screenshots/21-tests-periciados.jpg",
      duration: 8500
    },

    {
      category: "Ficha Integral",
      title: "Historia personal y situación actual",
      text: "La ficha integra datos personales, familiares, sociales, laborales, médicos y judiciales relevantes para la evaluación.",
      image: "assets/screenshots/22-ficha-integral.jpg",
      duration: 9000
    },

    {
      category: "Escuela FALCO®",
      title: "Programas y formación para familias",
      text: "La Escuela FALCO® brinda cursos, encuentros, materiales y actividades organizadas en módulos.",
      image: "assets/screenshots/23-escuela-falco.jpg",
      duration: 8000
    },

    {
      category: "AION",
      title: "Una guía dentro del ecosistema",
      text: "AION acompaña a los usuarios, orienta cada recorrido y facilita el acceso a las distintas herramientas del sistema.",
      image: "assets/screenshots/24-aion.jpg",
      duration: 9500,
      emphasis: true
    },

    {
      category: "Sistema FALCO®",
      title: "Mucho más que una página web",
      text: "Un ecosistema que integra servicios periciales, formación, recursos profesionales, evaluación digital y tecnología.",
      image: "assets/screenshots/25-ecosistema-general.jpg",
      duration: 10000,
      emphasis: true
    }

  ];


  /* ========================================================
     CONFIGURACIÓN
  ======================================================== */

  const SCENE_DURATION = 8000;

  const AION_VOICE_CONFIG = {
    enabled: true,
    lang: "es-AR",
    rate: 0.92,
    pitch: 0.88,
    volume: 1
  };

  let currentScene = 0;
  let playing = false;
  let timer = null;
  let activeUtterance = null;
  let sceneToken = 0;
  let aionVoice = null;


  /* ========================================================
     ELEMENTOS
  ======================================================== */

  const introScreen =
    document.getElementById("introScreen");

  const presentationScreen =
    document.getElementById("presentationScreen");

  const closingScreen =
    document.getElementById("closingScreen");

  const falcoPresentation =
    document.getElementById("falcoPresentation");

  const sceneFrame =
    document.getElementById("sceneFrame");

  const sceneImageContainer =
    document.getElementById("sceneImageContainer");

  const sceneImage =
    document.getElementById("sceneImage");

  const sceneCategory =
    document.getElementById("sceneCategory");

  const sceneTitle =
    document.getElementById("sceneTitle");

  const sceneDescription =
    document.getElementById("sceneDescription");

  const sceneNumber =
    document.getElementById("sceneNumber");

  const progressBar =
    document.getElementById("progressBar");

  const currentSceneCounter =
    document.getElementById("currentSceneCounter");

  const totalSceneCounter =
    document.getElementById("totalSceneCounter");

  const startButton =
    document.getElementById("startButton");

  const previousButton =
    document.getElementById("previousButton");

  const nextButton =
    document.getElementById("nextButton");

  const pauseButton =
    document.getElementById("pauseButton");

  const pauseButtonIcon =
    document.getElementById("pauseButtonIcon");

  const fullscreenButton =
    document.getElementById("fullscreenButton");

  const restartButton =
    document.getElementById("restartButton");


  /* ========================================================
     VALIDACIÓN
  ======================================================== */

  const requiredElements = {
    introScreen,
    presentationScreen,
    closingScreen,
    falcoPresentation,
    sceneFrame,
    sceneImageContainer,
    sceneImage,
    sceneCategory,
    sceneTitle,
    sceneDescription,
    sceneNumber,
    progressBar,
    currentSceneCounter,
    totalSceneCounter,
    startButton,
    previousButton,
    nextButton,
    pauseButton,
    pauseButtonIcon,
    fullscreenButton,
    restartButton
  };

  const missingElements =
    Object.entries(requiredElements)
      .filter(([, element]) => !element)
      .map(([name]) => name);

  if (missingElements.length > 0) {

    console.error(
      "Presentación FALCO: faltan estos elementos en el HTML:",
      missingElements
    );

    return;
  }


  /* ========================================================
     UTILIDADES
  ======================================================== */

  function formatNumber(number) {

    return String(number).padStart(2, "0");

  }


  function clearSceneTimer() {

    if (timer !== null) {

      window.clearTimeout(timer);
      timer = null;

    }

  }


  /* ========================================================
     MOSTRAR ESCENA
  ======================================================== */

  function showScene(index) {

    if (index < 0 || index >= scenes.length) {
      return;
    }

    clearSceneTimer();
    stopAionVoice();

    const token = sceneToken;

    currentScene = index;

    const scene = scenes[index];

    sceneFrame.classList.add(
      "is-changing"
    );

    window.setTimeout(() => {

      if (token !== sceneToken) {
        return;
      }

      sceneImage.src =
        scene.image;

      sceneImage.alt =
        scene.title;

      sceneCategory.textContent =
        scene.category;

      sceneTitle.textContent =
        scene.title;

      sceneDescription.textContent =
        scene.text;

      sceneNumber.textContent =
        formatNumber(index + 1);

      currentSceneCounter.textContent =
        formatNumber(index + 1);

      totalSceneCounter.textContent =
        formatNumber(scenes.length);

      const progress =
        ((index + 1) / scenes.length) * 100;

      progressBar.style.width =
        `${progress}%`;

      sceneFrame.classList.remove(
        "scene-motion-left",
        "scene-motion-right",
        "scene-motion-center"
      );

      const movements = [
        "scene-motion-left",
        "scene-motion-right",
        "scene-motion-center"
      ];

      sceneFrame.classList.add(
        movements[index % movements.length]
      );

      sceneFrame.classList.remove(
        "is-changing"
      );

      const narration =
        buildSceneNarration(scene);

      speakAsAion(narration);

      if (playing) {

        const wordCount =
          narration
            .trim()
            .split(/\s+/)
            .length;

        const estimatedNarrationTime =
          Math.round(
            (wordCount * 360) /
            AION_VOICE_CONFIG.rate
          );

        const sceneDuration =
          Math.max(
            Number.isFinite(scene.duration)
              ? scene.duration
              : SCENE_DURATION,
            estimatedNarrationTime + 600
          );

        timer = window.setTimeout(() => {

          if (
            playing &&
            token === sceneToken
          ) {
            nextScene();
          }

        }, sceneDuration);

      }

    }, 450);

  }


  /* ========================================================
     NAVEGACIÓN
  ======================================================== */

  function nextScene() {

    clearSceneTimer();
    stopAionVoice();

    if (currentScene < scenes.length - 1) {

      showScene(currentScene + 1);
      return;

    }

    finishPresentation();

  }


  function previousScene() {

    clearSceneTimer();
    stopAionVoice();

    if (currentScene > 0) {

      showScene(currentScene - 1);
      return;

    }

    showScene(0);

  }


  /* ========================================================
     PRESENTACIÓN
  ======================================================== */

  function startPresentation() {

    clearSceneTimer();
    stopAionVoice();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }

    currentScene = 0;
    playing = true;

    pauseButtonIcon.textContent =
      "Ⅱ";

    introScreen.classList.remove(
      "is-visible"
    );

    introScreen.classList.add(
      "is-leaving"
    );

    window.setTimeout(() => {

      introScreen.hidden = true;

      introScreen.classList.remove(
        "is-leaving"
      );

      closingScreen.hidden = true;

      closingScreen.classList.remove(
        "is-visible",
        "is-leaving"
      );

      presentationScreen.hidden =
        false;

      window.requestAnimationFrame(() => {

        presentationScreen.classList.add(
          "is-visible"
        );

      });

      showScene(0);

    }, 850);

  }


  function togglePause() {

    playing = !playing;

    if (playing) {

      pauseButtonIcon.textContent =
        "Ⅱ";

      showScene(currentScene);

      return;
    }

    pauseButtonIcon.textContent =
      "▶";

    clearSceneTimer();
    stopAionVoice();

  }


  function finishPresentation() {

    clearSceneTimer();
    stopAionVoice();

    playing = false;

    presentationScreen.classList.remove(
      "is-visible"
    );

    presentationScreen.classList.add(
      "is-leaving"
    );

    window.setTimeout(() => {

      presentationScreen.hidden =
        true;

      presentationScreen.classList.remove(
        "is-leaving"
      );

      closingScreen.hidden =
        false;

      window.requestAnimationFrame(() => {

        closingScreen.classList.add(
          "is-visible"
        );

      });

    }, 850);

  }


  function restartPresentation() {

    clearSceneTimer();
    stopAionVoice();

    currentScene = 0;
    playing = true;

    pauseButtonIcon.textContent =
      "Ⅱ";

    closingScreen.classList.remove(
      "is-visible"
    );

    closingScreen.classList.add(
      "is-leaving"
    );

    window.setTimeout(() => {

      closingScreen.hidden =
        true;

      closingScreen.classList.remove(
        "is-leaving"
      );

      presentationScreen.hidden =
        false;

      window.requestAnimationFrame(() => {

        presentationScreen.classList.add(
          "is-visible"
        );

      });

      showScene(0);

    }, 850);

  }


  /* ========================================================
     PANTALLA COMPLETA
  ======================================================== */

  async function toggleFullscreen() {

    try {

      if (!document.fullscreenElement) {

        await falcoPresentation
          .requestFullscreen();

      } else {

        await document
          .exitFullscreen();

      }

    } catch (error) {

      console.warn(
        "No fue posible activar la pantalla completa.",
        error
      );

    }

  }


  /* ========================================================
     IMÁGENES
  ======================================================== */

  sceneImage.addEventListener(
    "error",
    () => {

      sceneImageContainer.classList.add(
        "has-image-error"
      );

      sceneImage.alt =
        "Captura pendiente de incorporar";

    }
  );


  sceneImage.addEventListener(
    "load",
    () => {

      sceneImageContainer.classList.remove(
        "has-image-error"
      );

    }
  );


  /* ========================================================
     TECLADO
  ======================================================== */

  function handleKeyboard(event) {

    if (presentationScreen.hidden) {
      return;
    }

    switch (event.key) {

      case "ArrowRight":

        nextScene();
        break;

      case "ArrowLeft":

        previousScene();
        break;

      case " ":

        event.preventDefault();
        togglePause();
        break;

      default:

        break;

    }

  }


  /* ========================================================
     EVENTOS
  ======================================================== */

  startButton.addEventListener(
    "click",
    startPresentation
  );

  previousButton.addEventListener(
    "click",
    previousScene
  );

  nextButton.addEventListener(
    "click",
    nextScene
  );

  pauseButton.addEventListener(
    "click",
    togglePause
  );

  fullscreenButton.addEventListener(
    "click",
    toggleFullscreen
  );

  restartButton.addEventListener(
    "click",
    restartPresentation
  );

  document.addEventListener(
    "keydown",
    handleKeyboard
  );


  /* ========================================================
     ESTADO INICIAL
  ======================================================== */

  totalSceneCounter.textContent =
    formatNumber(scenes.length);

  currentSceneCounter.textContent =
    "01";

  progressBar.style.width =
    "0%";

  loadAionVoice();

  if ("speechSynthesis" in window) {

    window.speechSynthesis
      .onvoiceschanged = () => {

        loadAionVoice();

      };

  }

  console.log(
    "Presentación Sistema FALCO® lista."
  );

});