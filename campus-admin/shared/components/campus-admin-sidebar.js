/* =========================================================
   FALCO Campus Admin Sidebar™ v1.0
========================================================= */

class CampusAdminSidebar {

  constructor() {

    this.element = null;
    this.active = "dashboard";
    this.base = "../";

  }

  init() {

    this.element = document.querySelector("[data-campus-admin-sidebar]");

    if (!this.element) return;

    this.active =
      this.element.dataset.active || "dashboard";

    this.base =
      this.element.dataset.base || "../";

    this.render();

    console.info(
      "FALCO Campus Admin Sidebar™ v1.0 Ready"
    );

  }

  render() {

    this.element.innerHTML = `

      <aside class="campus-sidebar">

        <div class="campus-sidebar-brand">

          <span class="campus-sidebar-logo">
            F
          </span>

          <div>

            <strong>
              Campus FALCO®
            </strong>

            <small>
              Centro Administrativo
            </small>

          </div>

        </div>

        <nav class="campus-sidebar-nav">

          ${this.item(
            "dashboard",
            "Dashboard",
            "⌂",
            `${this.base}dashboard/dashboard.html`
          )}

          ${this.item(
            "cursos",
            "Cursos",
            "◫",
            `${this.base}cursos/cursos.html`
          )}

        </nav>

        <div class="campus-sidebar-footer">

          <a
            href="../../portal-cursos.html"
            target="_blank"
            rel="noopener noreferrer"
            class="campus-sidebar-link"
          >
            ↗ Portal de Cursos
          </a>

        </div>

      </aside>

    `;

  }

  item(id, texto, icono, href) {

    const activo =
      this.active === id
        ? " campus-sidebar-item--active"
        : "";

    return `

      <a
        href="${href}"
        class="campus-sidebar-item${activo}"
      >

        <span class="campus-sidebar-icon">
          ${icono}
        </span>

        <span>
          ${texto}
        </span>

      </a>

    `;

  }

}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    window.CampusAdminSidebar =
      new CampusAdminSidebar();

    window.CampusAdminSidebar.init();

  }
);