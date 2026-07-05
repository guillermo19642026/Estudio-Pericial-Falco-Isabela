/* =========================
   FALCO TIMELINE ENGINE™
========================= */

window.FalcoTimeline = {
  current: 0,
  total: 0,
  locked: false,

  init(totalScenes) {
    this.total = totalScenes;
    this.current = 0;
  },

  goTo(index, callback) {
    if (this.locked) return;

    if (index < 0) index = this.total - 1;
    if (index >= this.total) index = 0;

    this.locked = true;
    this.current = index;

    if (typeof callback === "function") {
      callback(index);
    }

    setTimeout(() => {
      this.locked = false;
    }, 850);
  },

  next(callback) {
    this.goTo(this.current + 1, callback);
  },

  prev(callback) {
    this.goTo(this.current - 1, callback);
  }
};