/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Núcleo administrativo compartido
   Versión 1.0
========================================================= */

"use strict";


const FalcoComunidadAdmin = {

  botonMenu: null,
  sidebarHost: null,

  init() {

    this.obtenerElementos();
    this.configurarMenu();
    this.configurarEventosGlobales();

    console.info(
      "FALCO Comunidad Admin Core™ v1.0 Ready"
    );

  },


  obtenerElementos() {

    this.botonMenu =
      document.getElementById(
        "botonMenuAdmin"
      );

    this.sidebarHost =
      document.querySelector(
        ".admin-comunidad-sidebar-host"
      );

  },


  configurarMenu() {

    if (
      !this.botonMenu ||
      !this.sidebarHost
    ) {
      return;
    }

    this.botonMenu.addEventListener(
      "click",
      () => {

        const menuAbierto =
          this.sidebarHost.classList.contains(
            "menu-abierto"
          );

        if (menuAbierto) {
          this.cerrarMenu();
        } else {
          this.abrirMenu();
        }

      }
    );

  },


  configurarEventosGlobales() {

    document.addEventListener(
      "falco-comunidad:cerrar-menu",
      () => {
        this.cerrarMenu();
      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Escape") {
          this.cerrarMenu();
        }

      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 1024) {
          this.cerrarMenu();
        }

      }
    );


    document.addEventListener(
      "click",
      event => {

        const enlace =
          event.target.closest(
            ".comunidad-admin-enlace"
          );

        if (
          enlace &&
          window.innerWidth <= 1024
        ) {
          this.cerrarMenu();
        }

      }
    );

  },


  abrirMenu() {

    if (
      !this.sidebarHost ||
      !this.botonMenu
    ) {
      return;
    }

    this.sidebarHost.classList.add(
      "menu-abierto"
    );

    this.botonMenu.classList.add(
      "menu-activo"
    );

    this.botonMenu.setAttribute(
      "aria-expanded",
      "true"
    );

    this.botonMenu.setAttribute(
      "aria-label",
      "Cerrar menú administrativo"
    );

    document.body.classList.add(
      "menu-admin-abierto"
    );

  },


  cerrarMenu() {

    if (
      !this.sidebarHost ||
      !this.botonMenu
    ) {
      return;
    }

    this.sidebarHost.classList.remove(
      "menu-abierto"
    );

    this.botonMenu.classList.remove(
      "menu-activo"
    );

    this.botonMenu.setAttribute(
      "aria-expanded",
      "false"
    );

    this.botonMenu.setAttribute(
      "aria-label",
      "Abrir menú administrativo"
    );

    document.body.classList.remove(
      "menu-admin-abierto"
    );

  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadAdmin.init();

  }
);