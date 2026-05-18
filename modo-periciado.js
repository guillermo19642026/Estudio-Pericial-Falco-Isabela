const params = new URLSearchParams(window.location.search);
const esModoPericiado = params.get("modo") === "periciado";

if (esModoPericiado) {
  document.body.classList.add("modo-periciado");
  document.body.classList.add("modo-periciado-preload");



  function ocultarResultados() {
    const textos = [
      "Resultados automáticos",
      "Interpretación orientativa",
      "Informe psicológico",
      "Informe clínico"
    ];

    document.querySelectorAll("h1, h2, h3").forEach(titulo => {
      if (textos.some(t => titulo.textContent.includes(t))) {
        const card = titulo.closest(".card, section");
        if (card) card.style.display = "none";
      }
    });

    ["puntajeTotal", "nivel", "cargadasTabla", "interpretacionClinica", "informeClinico"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const card = el.closest(".card, section");
        if (card) card.style.display = "none";
        el.style.display = "none";
      }
    });

    document.querySelectorAll("button").forEach(btn => {
      const texto = btn.textContent.toLowerCase();

      if (
        texto.includes("imprimir") ||
        texto.includes("pdf") ||
        texto.includes("csv")
      ) {
        btn.style.display = "none";
      }
    });
  }

  window.generarInformePDF = function () {
    alert("Evaluación enviada. Los resultados serán revisados por el profesional.");
  };

  window.exportarCSV = function () {
    alert("Función no disponible para este acceso.");
  };

  window.addEventListener("DOMContentLoaded", () => {
    ocultarResultados();

    const observer = new MutationObserver(() => {
      ocultarResultados();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}