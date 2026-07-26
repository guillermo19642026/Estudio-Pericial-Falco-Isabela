/* ==========================================================
   SISTEMA FALCO®
   Escuela para Padres
   Header administrativo reutilizable
   FALCO Admin Header™ v1.0
========================================================== */

const headers = document.querySelectorAll("[data-admin-header]");

headers.forEach((contenedor) => {

  const eyebrow =
    contenedor.dataset.eyebrow ||
    "Escuela para Padres";

  const titulo =
    contenedor.dataset.title ||
    "Centro de Administración";

  const subtitulo =
    contenedor.dataset.subtitle ||
    "";

  const mostrarUsuario =
    contenedor.dataset.user !== "false";

  const rol =
    contenedor.dataset.role ||
    "Administración";

  const nombre =
    contenedor.dataset.name ||
    "Sistema FALCO®";

  contenedor.innerHTML = `
    <header class="admin-header">

      <div class="admin-header-contenido">

        <div class="admin-eyebrow">
          ${eyebrow}
        </div>

        <h1>
          ${titulo}
        </h1>

        ${
          subtitulo
            ? `
              <p class="admin-subtitulo">
                ${subtitulo}
              </p>
            `
            : ""
        }

      </div>

      ${
        mostrarUsuario
          ? `
            <div class="admin-user">

              <span class="admin-user-role">
                ${rol}
              </span>

              <strong>
                ${nombre}
              </strong>

            </div>
          `
          : ""
      }

    </header>
  `;

});

console.log("FALCO Admin Header™ v1.0 Ready");