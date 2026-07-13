/* =========================================================
   FALCO®
   MÓDULO HÁBITOS Y CALIDAD DE VIDA
========================================================= */

function inicializarHabitosCalidadVida() {

    const slider = document.getElementById("calidadVida");
    const valor = document.getElementById("valorCalidadVida");
    const label = document.getElementById("labelCalidadVida");

    if (!slider || !valor || !label) return;

    function actualizarEscala() {

        valor.textContent = slider.value;

        label.textContent =
            `Explique por qué eligió la puntuación ${slider.value} *`;

    }

    actualizarEscala();

    slider.addEventListener("input", actualizarEscala);

    console.log("FALCO® Hábitos y Calidad de Vida Ready");

}