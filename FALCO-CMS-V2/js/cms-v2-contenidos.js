import {
    listarContenidos,
    enviarAPapelera
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

    <div class="falco-editorial-main">

        <div class="falco-editorial-thumb">

    ${
        contenido.multimedia?.imagen?.url
        ? `<img src="${contenido.multimedia.imagen.url}" alt="">`
        : `<i data-lucide="file-text"></i>`
    }

</div>

       <div class="falco-editorial-info">

    <strong>${contenido.titulo || "Sin título"}</strong>

    <span>
        ${contenido.tipo || "Sin tipo"} ·
        ${contenido.modulo || "Sin módulo"} ·
        ${contenido.fuero || "Sin fuero"}
    </span>

</div>

    </div>

   <div class="falco-editorial-meta">

    <span class="falco-badge">
        ${contenido.estado || "Borrador"}
    </span>

    <span class="falco-badge">
        ${contenido.fuero || "General"}
    </span>

    <span class="falco-badge falco-badge-gold">
        ${contenido.acceso || "Premium"}
    </span>

</div>

    <div class="falco-editorial-actions">

        <a
            class="falco-btn falco-btn-dark"
            href="editor.html?id=${contenido.id}">
            <i data-lucide="edit-3"></i>
            Editar
        </a>

        <button
            class="falco-btn falco-btn-danger falco-delete"
            data-id="${contenido.id}">
            <i data-lucide="trash-2"></i>
            Papelera
        </button>

    </div>

</article>


                `).join("")}
            </div>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

document.querySelectorAll(".falco-delete").forEach(boton => {

    boton.addEventListener("click", async () => {

        const id = boton.dataset.id;

        const confirmar = confirm(
            "¿Enviar este contenido a la papelera?"
        );

        if (!confirmar) return;

        try {

            await enviarAPapelera(id);

            boton.closest(".falco-editorial-item").remove();

            alert("Contenido enviado a la papelera.");

        } catch (error) {

            console.error(error);

            alert("No fue posible eliminar el contenido.");

        }

    });

});


    } catch (error) {
        console.error(error);
        alert("No fue posible cargar los contenidos.");
    }

});