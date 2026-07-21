/* =========================================================
   FALCO MENU DRAWER™ v1.2
   Panel lateral de navegación no destructivo
========================================================= */

(function () {
  "use strict";

  const FalcoMenuDrawer = {

    drawer: null,
    overlay: null,
    closeButton: null,
    scrollContainer: null,
    toggleButton: null,
    menu: null,
    headerButtons: null,

    initialized: false,
    isOpen: false,
    lastFocusedElement: null,


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {
      if (this.initialized) return;

      this.menu = document.getElementById("menu");
      this.headerButtons = document.querySelector(".header-botones");
      this.toggleButton = document.getElementById("falcoMenuToggle");

      if (!this.menu || !this.toggleButton) {
        console.warn(
       "FALCO MENU DRAWER™: no se encontró #menu o #falcoMenuToggle."
        );
        return;
      }

      /*
        Se reemplaza el botón por una copia limpia.

        Esto mantiene exactamente el mismo diseño,
        pero elimina onclick y eventos anteriores que
        abrían el menú desplegable original.
      */

      const cleanToggleButton = this.toggleButton.cloneNode(true);

      cleanToggleButton.removeAttribute("onclick");
      cleanToggleButton.id = "falcoMenuToggle";
      cleanToggleButton.type = "button";

      this.toggleButton.replaceWith(cleanToggleButton);
      this.toggleButton = cleanToggleButton;

      this.createDrawer();
      this.moveExistingElements();
      this.prepareAccessibility();
      this.bindEvents();

      this.closeLegacyMenuState();
      this.closeLegacyHeaderState();
      this.closeDropdowns();

      this.initialized = true;

      console.log("FALCO MENU DRAWER™ v1.2 Ready");
    },


    /* =====================================================
       CREACIÓN DEL PANEL
    ===================================================== */

    createDrawer() {
      this.overlay = document.createElement("div");
      this.overlay.className = "falco-menu-overlay";
      this.overlay.setAttribute("aria-hidden", "true");

      this.drawer = document.createElement("aside");
      this.drawer.className = "falco-menu-drawer";
      this.drawer.id = "falcoMenuDrawer";

      this.drawer.setAttribute("aria-hidden", "true");
      this.drawer.setAttribute("aria-label", "Navegación principal");
      this.drawer.setAttribute("role", "dialog");
      this.drawer.setAttribute("aria-modal", "true");

      const drawerHeader = document.createElement("div");
      drawerHeader.className = "falco-menu-drawer-header";

      const heading = document.createElement("div");
      heading.className = "falco-menu-drawer-heading";

      const eyebrow = document.createElement("span");
      eyebrow.className = "falco-menu-drawer-eyebrow";
      eyebrow.textContent = "Sistema FALCO®";

      const title = document.createElement("h2");
      title.className = "falco-menu-drawer-title";
      title.id = "falcoMenuDrawerTitle";
      title.textContent = "Navegación";

      heading.appendChild(eyebrow);
      heading.appendChild(title);

      this.closeButton = document.createElement("button");
      this.closeButton.type = "button";
      this.closeButton.className = "falco-menu-close";
      this.closeButton.setAttribute(
        "aria-label",
        "Cerrar navegación"
      );
      this.closeButton.setAttribute(
        "title",
        "Cerrar navegación"
      );

      drawerHeader.appendChild(heading);
      drawerHeader.appendChild(this.closeButton);

      this.scrollContainer = document.createElement("div");
      this.scrollContainer.className =
        "falco-menu-drawer-scroll";

      this.drawer.setAttribute(
        "aria-labelledby",
        "falcoMenuDrawerTitle"
      );

      this.drawer.appendChild(drawerHeader);
      this.drawer.appendChild(this.scrollContainer);

      document.body.appendChild(this.overlay);
      document.body.appendChild(this.drawer);
    },


    /* =====================================================
       MOVIMIENTO DEL MENÚ EXISTENTE

       No se clonan ni se borran enlaces.
       Se mueven dentro del panel lateral.
    ===================================================== */

    moveExistingElements() {
      this.scrollContainer.appendChild(this.menu);

      if (this.headerButtons) {
        this.scrollContainer.appendChild(this.headerButtons);
      }
    },


    /* =====================================================
       ACCESIBILIDAD
    ===================================================== */

    prepareAccessibility() {
      this.toggleButton.setAttribute(
        "aria-controls",
        "falcoMenuDrawer"
      );

      this.toggleButton.setAttribute(
        "aria-expanded",
        "false"
      );

      this.toggleButton.setAttribute(
        "aria-haspopup",
        "dialog"
      );

      const toggleLabel =
        this.toggleButton.querySelector("em");

      if (
        toggleLabel &&
        !toggleLabel.dataset.originalText
      ) {
        toggleLabel.dataset.originalText =
          toggleLabel.textContent.trim();
      }

      /*
        Los títulos de los desplegables se convierten
        en controles accesibles.
      */

      const dropdownTriggers =
        this.menu.querySelectorAll(".dropdown > span");

      dropdownTriggers.forEach((trigger, index) => {
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("aria-expanded", "false");

        const dropdownMenu =
          trigger.parentElement.querySelector(".dropdown-menu");

        if (dropdownMenu) {
          const dropdownId = `falcoDropdownMenu${index + 1}`;

          dropdownMenu.id = dropdownId;

          trigger.setAttribute(
            "aria-controls",
            dropdownId
          );
        }
      });
    },


    /* =====================================================
       EVENTOS
    ===================================================== */

    bindEvents() {

      /*
        Botón principal de navegación.
      */

      this.toggleButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          this.closeLegacyHeaderState();
          this.toggle();
        }
      );


      /*
        Botón cruz.
      */

      this.closeButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          this.close();
        }
      );


      /*
        Cierre al tocar fuera.
      */

      this.overlay.addEventListener("click", () => {
        this.close();
      });


      /*
        Control propio de los desplegables.

        Captura el evento antes de que puedan intervenir
        las funciones antiguas del menú.
      */

      this.menu.addEventListener(
        "click",
        (event) => {
          const trigger =
            event.target.closest(".dropdown > span");

          if (!trigger) return;

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          this.toggleDropdown(trigger);
        },
        true
      );


      /*
        Apertura de desplegables mediante teclado.
      */

      this.menu.addEventListener(
        "keydown",
        (event) => {
          const trigger =
            event.target.closest(".dropdown > span");

          if (!trigger) return;

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            event.stopPropagation();

            this.toggleDropdown(trigger);
          }
        }
      );


      /*
        Al seleccionar un enlace se cierra el drawer.
      */

      this.drawer.addEventListener(
        "click",
        (event) => {
          const link = event.target.closest("a");

          if (!link) return;

          window.setTimeout(() => {
            this.close();
          }, 80);
        }
      );


      /*
        Tecla Escape y control del foco.
      */

      document.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Escape" &&
            this.isOpen
          ) {
            this.close();
            return;
          }

          if (
            event.key === "Tab" &&
            this.isOpen
          ) {
            this.trapFocus(event);
          }
        }
      );
    },


    /* =====================================================
       ABRIR PANEL
    ===================================================== */

    open() {
      if (this.isOpen) return;

      this.isOpen = true;
      this.lastFocusedElement = document.activeElement;

      this.closeLegacyMenuState();
      this.closeLegacyHeaderState();
      this.closeDropdowns();

      this.drawer.classList.add("is-open");
      this.overlay.classList.add("is-visible");
      this.toggleButton.classList.add(
        "falco-menu-active"
      );

      document.documentElement.classList.add(
        "falco-menu-lock"
      );

      document.body.classList.add(
        "falco-menu-lock",
        "falco-menu-drawer-open"
      );

      this.drawer.setAttribute(
        "aria-hidden",
        "false"
      );

      this.overlay.setAttribute(
        "aria-hidden",
        "false"
      );

      this.toggleButton.setAttribute(
        "aria-expanded",
        "true"
      );

      const toggleLabel =
        this.toggleButton.querySelector("em");

      if (toggleLabel) {
        toggleLabel.textContent = "Cerrar";
      }

      window.setTimeout(() => {
        this.closeButton.focus();
      }, 80);

      document.dispatchEvent(
        new CustomEvent("falco:menu-open")
      );
    },


    /* =====================================================
       CERRAR PANEL
    ===================================================== */

    close() {
      if (!this.isOpen) return;

      this.isOpen = false;

      this.closeLegacyHeaderState();

      this.drawer.classList.remove("is-open");
      this.overlay.classList.remove("is-visible");
      this.toggleButton.classList.remove(
        "falco-menu-active"
      );

      document.documentElement.classList.remove(
        "falco-menu-lock"
      );

      document.body.classList.remove(
        "falco-menu-lock",
        "falco-menu-drawer-open"
      );

      this.drawer.setAttribute(
        "aria-hidden",
        "true"
      );

      this.overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      this.toggleButton.setAttribute(
        "aria-expanded",
        "false"
      );

      const toggleLabel =
        this.toggleButton.querySelector("em");

      if (toggleLabel) {
        toggleLabel.textContent =
          toggleLabel.dataset.originalText ||
          "Navegación";
      }

      this.closeDropdowns();
      this.closeLegacyMenuState();

      if (
        this.lastFocusedElement &&
        typeof this.lastFocusedElement.focus ===
          "function"
      ) {
        window.setTimeout(() => {
          this.lastFocusedElement.focus();
        }, 60);
      }

      document.dispatchEvent(
        new CustomEvent("falco:menu-close")
      );
    },


    /* =====================================================
       ALTERNAR PANEL
    ===================================================== */

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },


    /* =====================================================
       ALTERNAR DESPLEGABLE
    ===================================================== */

    toggleDropdown(trigger) {
      const dropdown = trigger.closest(".dropdown");

      if (!dropdown) return;

      const dropdownMenu =
        dropdown.querySelector(".dropdown-menu");

      if (!dropdownMenu) return;

      const wasOpen =
        dropdown.classList.contains("is-open");

      /*
        Cerramos los demás desplegables para mantener
        el menú compacto, especialmente en celular.
      */

      this.closeDropdowns();

      if (!wasOpen) {
        dropdown.classList.add("is-open");
        dropdownMenu.classList.add("show");

        trigger.setAttribute(
          "aria-expanded",
          "true"
        );
      }
    },


    /* =====================================================
       CIERRE DEL MENÚ ANTERIOR
    ===================================================== */

    closeLegacyMenuState() {
      if (!this.menu) return;

      const possibleClasses = [
        "active",
        "open",
        "show",
        "visible",
        "menu-open",
        "menu-active",
        "nav-open",
        "expanded",
        "activo"
      ];

      possibleClasses.forEach((className) => {
        this.menu.classList.remove(className);
      });

      this.menu.style.removeProperty("display");
      this.menu.style.removeProperty("height");
      this.menu.style.removeProperty("max-height");
    },


    /* =====================================================
       CIERRE DEL ENCABEZADO ANTERIOR
    ===================================================== */

    closeLegacyHeaderState() {
      const elements = [
        document.querySelector("header"),
        document.querySelector(".nav-container"),
        document.querySelector(".header-derecha"),
        document.querySelector(".header-izquierda"),
        document.querySelector(".header-texto")
      ];

      const legacyClasses = [
        "active",
        "open",
        "show",
        "visible",
        "menu-open",
        "menu-active",
        "nav-open",
        "expanded",
        "activo"
      ];

      elements.forEach((element) => {
        if (!element) return;

        legacyClasses.forEach((className) => {
          element.classList.remove(className);
        });
      });

      document.body.classList.remove(
        "menu-open",
        "menu-active",
        "nav-open",
        "menu-abierto",
        "activo"
      );
    },


    /* =====================================================
       CIERRE DE SUBMENÚS
    ===================================================== */

    closeDropdowns() {
      if (!this.drawer) return;

      const dropdowns =
        this.drawer.querySelectorAll(".dropdown");

      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove(
          "active",
          "open",
          "is-open",
          "show",
          "activo"
        );

        const trigger =
          dropdown.querySelector(":scope > span");

        if (trigger) {
          trigger.setAttribute(
            "aria-expanded",
            "false"
          );
        }

        const dropdownMenu =
          dropdown.querySelector(".dropdown-menu");

        if (dropdownMenu) {
          dropdownMenu.classList.remove(
            "active",
            "open",
            "is-open",
            "show",
            "activo"
          );

          dropdownMenu.style.removeProperty(
            "display"
          );
        }
      });
    },


    /* =====================================================
       CONTROL DEL FOCO
    ===================================================== */

    trapFocus(event) {
      const focusableElements =
        this.drawer.querySelectorAll(
          [
            "a[href]",
            "button:not([disabled])",
            "[role='button'][tabindex='0']",
            "[tabindex]:not([tabindex='-1'])"
          ].join(",")
        );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };


  /* =======================================================
     COMPATIBILIDAD CON FUNCIONES DEL HTML ANTERIOR
  ======================================================= */

  window.toggleMenu = function () {
    FalcoMenuDrawer.toggle();
  };

  window.toggleDropdown = function (trigger) {
    FalcoMenuDrawer.toggleDropdown(trigger);
  };


  /* =======================================================
     EXPOSICIÓN GLOBAL
  ======================================================= */

  window.FalcoMenuDrawer = FalcoMenuDrawer;


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        FalcoMenuDrawer.init();
      }
    );
  } else {
    FalcoMenuDrawer.init();
  }

})();