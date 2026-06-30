import {
    listarContenidos
} from "./services/contenido.service.js";

document.addEventListener("DOMContentLoaded", async () => {

    const contenedor =
        document.querySelector(".falco-empty-state");

    if (!contenedor) return;

    const contenidos = await listarContenidos();

    const biblioteca = contenidos.filter(c =>

        c.tipo === "biblioteca"

        && c.estado !== "archivado"

        && c.eliminado !== true

    );


document.getElementById("kpiTotalBiblioteca").textContent =
    biblioteca.length;

document.getElementById("kpiPremiumBiblioteca").textContent =
    biblioteca.filter(c => c.acceso === "premium").length;

document.getElementById("kpiPublicosBiblioteca").textContent =
    biblioteca.filter(c => c.acceso === "publico").length;

document.getElementById("kpiPublicadosBiblioteca").textContent =
    biblioteca.filter(c => c.estado === "publicado").length;




    if (!biblioteca.length) return;


    contenedor.outerHTML = `
    <div class="falco-library-grid">

        ${biblioteca.map(contenido => `

            <article class="falco-library-card">

                <div class="falco-library-cover">
                    ${
                        contenido.multimedia?.imagen?.url
                        ? `<img src="${contenido.multimedia.imagen.url}" alt="">`
                        : `<i data-lucide="library"></i>`
                    }
                </div>

                <div class="falco-library-body">

                    <span class="falco-eyebrow">
                        ${contenido.tipo || "Biblioteca"}
                    </span>

                    <h3>${contenido.titulo || "Sin título"}</h3>

                    <p>
                        ${contenido.descripcion || "Recurso profesional del ecosistema FALCO®."}
                    </p>

                    <div class="falco-preview-meta">
                        <span>${contenido.acceso || "Premium"}</span>
                        <span>${contenido.modulo || "General"}</span>
                    </div>

                    <a
                        class="falco-btn falco-btn-dark"
                        href="editor.html?id=${contenido.id}">
                        <i data-lucide="eye"></i>
                        Ver recurso
                    </a>

                </div>

            </article>

        `).join("")}

    </div>
`;

    lucide.createIcons();

});