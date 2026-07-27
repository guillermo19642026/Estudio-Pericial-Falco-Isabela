/* =========================================================
   SISTEMA FALCO®
   Escuela para Padres
   FALCO Admin Sidebar™ v1.0
========================================================= */

const FalcoAdminSidebar = {

  init() {

    const contenedor = document.querySelector(
      "[data-admin-sidebar]"
    );

    if (!contenedor) {

      console.warn(
        "FALCO Admin Sidebar™: no se encontró [data-admin-sidebar]."
      );

      return;
    }

    const moduloActivo =
      contenedor.dataset.active || "dashboard";

    const base =
      contenedor.dataset.base || "../";

    contenedor.innerHTML = this.template(
      moduloActivo,
      base
    );

    console.log(
      "FALCO Admin Sidebar™ v1.0 Ready"
    );

  },

  template(moduloActivo, base) {

    const crearEnlace = (
      modulo,
      href,
      texto
    ) => {

      const claseActiva =
        moduloActivo === modulo
          ? " activo"
          : "";

      return `
        <a
          href="${href}"
          class="admin-nav-link${claseActiva}"
        >
          ${texto}
        </a>
      `;

    };

    return `
      <aside class="admin-sidebar">

        <div class="admin-brand">

          <span class="admin-brand-sistema">
            Sistema FALCO®
          </span>

          <span class="admin-brand-area">
            Escuela para Padres
          </span>

        </div>

        <nav class="admin-nav">

          ${crearEnlace(
            "dashboard",
            `${base}dashboard/dashboard.html`,
            "Inicio"
          )}

          ${crearEnlace(
            "participantes",
            `${base}participantes/participantes.html`,
            "Participantes"
          )}

          ${crearEnlace(
            "alta",
            `${base}alta/alta-participante.html`,
            "Nuevo participante"
          )}

          ${crearEnlace(
            "encuentros",
            `${base}encuentros/encuentros.html`,
            "Encuentros"
          )}

          ${crearEnlace(
            "certificados",
            `${base}certificados/certificados.html`,
            "Certificados"
          )}

          ${crearEnlace(
            "configuracion",
            `${base}configuracion/configuracion.html`,
            "Configuración"
          )}

        </nav>

        <div class="admin-sidebar-footer">

          <a href="${base}../index.html">
            Volver al Sistema FALCO®
          </a>

        </div>

      </aside>
    `;

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => FalcoAdminSidebar.init()
);

export default FalcoAdminSidebar;