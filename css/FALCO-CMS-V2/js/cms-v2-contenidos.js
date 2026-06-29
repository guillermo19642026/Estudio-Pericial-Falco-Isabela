import {
    listarContenidos
} from "./services/contenido.service.js";

document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.querySelector(".falco-empty-state");

    if (!contenedor) return;

    try {

        const contenidos = await listarContenidos();

        if (!contenidos.length) return;

        contenedor.outerHTML = `
            <div class="falco-editorial-list">
                ${contenidos.map(contenido => `
                    <article class="falco-editorial-item">
                        <div class="falco-editorial-icon">
                            <i data-lucide="file-text"></i>
                        </div>

                        <div>
                            <strong>${contenido.titulo || "Sin título"}</strong>
                            <span>${contenido.tipo || "Sin tipo"} · ${contenido.modulo || "Sin módulo"}</span>
                        </div>

                        <span class="falco-badge">${contenido.estado || "Borrador"}</span>

                        <small>${contenido.acceso || "Premium"}</small>

                        <a href="editor.html?id=${contenido.id}">Editar</a>
                    </article>
                `).join("")}
            </div>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

    } catch (error) {
        console.error(error);
        alert("No fue posible cargar los contenidos.");
    }

});