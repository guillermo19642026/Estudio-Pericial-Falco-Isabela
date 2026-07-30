/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Sidebar reutilizable
   Versión 1.0
========================================================= */

"use strict";


class FalcoComunidadSidebar extends HTMLElement {

  connectedCallback() {

    const activo =
      this.getAttribute("data-active") ||
      "";

    const base =
      this.getAttribute("data-base") ||
      "../";

    this.innerHTML = `
      <aside class="comunidad-admin-sidebar">

        <div class="comunidad-admin-sidebar-cabecera">

          <a
            class="comunidad-admin-marca"
            href="${base}dashboard/dashboard.html"
          >

            <span class="comunidad-admin-marca-simbolo">
              F
            </span>

            <span class="comunidad-admin-marca-texto">

              <strong>
                FALCO<sup>®</sup> Comunidad
              </strong>

              <small>
                Centro Administrativo
              </small>

            </span>

          </a>

        </div>


        <nav
          class="comunidad-admin-navegacion"
          aria-label="Navegación administrativa"
        >

          ${this.crearEnlace({
            clave: "dashboard",
            texto: "Dashboard",
            icono: "01",
            href: `${base}dashboard/dashboard.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "solicitudes",
            texto: "Solicitudes",
            icono: "02",
            href: `${base}solicitudes/solicitudes.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "instituciones",
            texto: "Instituciones",
            icono: "03",
            href: `${base}instituciones/instituciones.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "reuniones",
            texto: "Reuniones",
            icono: "04",
            href: `${base}reuniones/reuniones.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "proyectos",
            texto: "Proyectos",
            icono: "05",
            href: `${base}proyectos/proyectos.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "programas",
            texto: "Programas",
            icono: "06",
            href: `${base}programas/programas.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "agenda",
            texto: "Agenda",
            icono: "07",
            href: `${base}agenda/agenda.html`,
            activo
          })}

          ${this.crearEnlace({
            clave: "documentos",
            texto: "Documentos",
            icono: "08",
            href: `${base}documentos/documentos.html`,
            activo
          })}

        </nav>


        <div class="comunidad-admin-sidebar-inferior">

          ${this.crearEnlace({
            clave: "configuracion",
            texto: "Configuración",
            icono: "09",
            href: `${base}configuracion/configuracion.html`,
            activo
          })}

          <a
            class="comunidad-admin-volver"
            href="${base}../FALCO-COMUNIDAD/index.html"
          >

            <span aria-hidden="true">
              ←
            </span>

            <span>
              Volver a Comunidad
            </span>

          </a>

        </div>

      </aside>

      <button
        type="button"
        class="comunidad-admin-sidebar-fondo"
        aria-label="Cerrar menú"
        tabindex="-1"
      ></button>
    `;

    this.configurarCierre();

  }


  crearEnlace({
    clave,
    texto,
    icono,
    href,
    activo
  }) {

    const estaActivo =
      clave === activo;

    return `
      <a
        class="comunidad-admin-enlace${
          estaActivo
            ? " enlace-activo"
            : ""
        }"
        href="${href}"
        ${
          estaActivo
            ? 'aria-current="page"'
            : ""
        }
      >

        <span class="comunidad-admin-enlace-icono">
          ${icono}
        </span>

        <span class="comunidad-admin-enlace-texto">
          ${texto}
        </span>

      </a>
    `;

  }


  configurarCierre() {

    const fondo =
      this.querySelector(
        ".comunidad-admin-sidebar-fondo"
      );

    if (!fondo) {
      return;
    }

    fondo.addEventListener(
      "click",
      () => {

        document.dispatchEvent(
          new CustomEvent(
            "falco-comunidad:cerrar-menu"
          )
        );

      }
    );

  }

}


if (
  !customElements.get(
    "falco-comunidad-sidebar"
  )
) {

  customElements.define(
    "falco-comunidad-sidebar",
    FalcoComunidadSidebar
  );

}


console.info(
  "FALCO Comunidad Sidebar™ v1.0 Ready"
);