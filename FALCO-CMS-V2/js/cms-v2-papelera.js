import {
    listarPapelera,
    restaurarContenido
} from "./services/contenido.service.js";

document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.querySelector(".falco-empty-state");

    if (!contenedor) return;

    try {

        const contenidos = await listarPapelera();

        if (!contenidos.length) {

            contenedor.innerHTML = `
                <h2>La papelera está vacía</h2>
                <p>No existen contenidos eliminados.</p>
            `;

            return;
        }

        contenedor.outerHTML = `
            <div class="falco-editorial-list">

                ${contenidos.map(contenido => `

                    <article class="falco-editorial-item">

                        <div class="falco-editorial-icon">
                            <i data-lucide="trash-2"></i>
                        </div>

                        <div class="falco-editorial-info">
                            <strong>${contenido.titulo}</strong>

                            <span>
                                ${contenido.tipo} ·
                                ${contenido.modulo}
                            </span>
                        </div>

                        <button
    class="falco-btn falco-btn-success falco-restaurar"
    data-id="${contenido.id}">
    <i data-lucide="rotate-ccw"></i>
    Restaurar
</button>

                    </article>

                `).join("")}

            </div>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

        document.querySelectorAll(".falco-restaurar")
            .forEach(boton => {

                boton.addEventListener("click", async () => {

                    await restaurarContenido(
                        boton.dataset.id
                    );

                    boton.closest(
                        ".falco-editorial-item"
                    ).remove();

                    alert("Contenido restaurado.");

                });

            });

    } catch (error) {

        console.error(error);

    }

});