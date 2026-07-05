window.addEventListener("load", () => {
  const theme = document.getElementById("falcoTheme");
  const btn = document.getElementById("audioToggle");

  console.log("Audio:", theme);
  console.log("Botón música:", btn);

  if (!theme || !btn) return;

  let on = false;

  btn.onclick = () => {
    on = !on;

    if (on) {
      btn.textContent = "🔊 Música";
      theme.volume = 0.28;
      theme.play();
    } else {
      btn.textContent = "🔇 Música";
      theme.pause();
      theme.currentTime = 0;
    }
  };

  window.stopAudio = function () {
    theme.pause();
    theme.currentTime = 0;
    theme.volume = 0;
    on = false;
    btn.textContent = "🔇 Música";
  };
});