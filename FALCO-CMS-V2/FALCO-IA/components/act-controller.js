/* =========================
   FALCO ACT CONTROLLER®
========================= */

const FalcoActController = {

  scenes: [],
  progressBar: null,
  actCounter: null,
  nextButton: null,
  prevButton: null,

  init() {

    this.scenes = document.querySelectorAll(".ia-scene");
    this.progressBar = document.getElementById("iaProgressBar");
    this.actCounter = document.getElementById("iaActCounter");
    this.nextButton = document.getElementById("iaNext");
    this.prevButton = document.getElementById("iaPrev");

    FalcoTimeline.init(this.scenes.length);
    FalcoCamera.init(".falco-ia-cinematic");

    this.bindEvents();

  },

  bindEvents() {

    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.next());
    }

    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.prev());
    }

    document.addEventListener("keydown", (event) => {

      if (event.key === "ArrowRight") {
        this.next();
      }

      if (event.key === "ArrowLeft") {
        this.prev();
      }

    });

  },

  showScene(index) {

    this.scenes.forEach((scene, i) => {
      scene.classList.toggle("ia-scene-active", i === index);
    });

    const progress = ((index + 1) / this.scenes.length) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = progress + "%";
    }

    if (this.actCounter) {
      this.actCounter.textContent =
        `ACTO ${index + 1} / ${this.scenes.length}`;
    }

    FalcoCamera.moveTo(index);

    if (index === 0) {
      syncCanvasParticles(1);
    } else {
      syncCanvasParticles(2);
    }

  },

  next() {
    FalcoTimeline.next(this.showScene.bind(this));
  },

  prev() {
    FalcoTimeline.prev(this.showScene.bind(this));
  }

};