/* =========================================================
   PORTAL INSTITUCIONAL — SISTEMA FALCO®
   Archivo: portal-institucional/js/portal-ui.js

   Funciones iniciales:
   - Menú lateral responsive
   - Menú de usuario
   - Filtros de módulos
   - Navegación interna
   - Año automático
   - Cierre con tecla Escape

   Esta versión no utiliza Firebase ni modifica autenticaciones.
========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTOS PRINCIPALES
  ======================================================= */

  const body = document.body;

  const portalSidebar =
    document.getElementById("portalSidebar");

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const sidebarClose =
    document.getElementById("sidebarClose");

  const sidebarOverlay =
    document.getElementById("sidebarOverlay");

  const userMenuButton =
    document.getElementById("userMenuButton");

  const userDropdown =
    document.getElementById("userDropdown");

  const currentYear =
    document.getElementById("currentYear");

  const sidebarLinks =
    document.querySelectorAll(".sidebar-link");

  const moduleFilterButtons =
    document.querySelectorAll(".module-filter__button");

  const moduleCards =
    document.querySelectorAll(".module-card");


  /* =======================================================
     AÑO AUTOMÁTICO
  ======================================================= */

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }


  /* =======================================================
     MENÚ LATERAL RESPONSIVE
  ======================================================= */

  const openSidebar = () => {
    body.classList.add("sidebar-open");

    if (mobileMenuButton) {
      mobileMenuButton.setAttribute("aria-expanded", "true");
    }

    if (sidebarOverlay) {
      sidebarOverlay.hidden = false;
    }
  };


  const closeSidebar = () => {
    body.classList.remove("sidebar-open");

    if (mobileMenuButton) {
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }

    if (sidebarOverlay) {
      sidebarOverlay.hidden = true;
    }
  };


  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", openSidebar);
  }


  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }


  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }


  /* =======================================================
     MENÚ DEL USUARIO
  ======================================================= */

  const openUserMenu = () => {
    if (!userMenuButton || !userDropdown) {
      return;
    }

    userDropdown.hidden = false;
    userMenuButton.setAttribute("aria-expanded", "true");
  };


  const closeUserMenu = () => {
    if (!userMenuButton || !userDropdown) {
      return;
    }

    userDropdown.hidden = true;
    userMenuButton.setAttribute("aria-expanded", "false");
  };


  const toggleUserMenu = () => {
    if (!userMenuButton || !userDropdown) {
      return;
    }

    const isOpen =
      userMenuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeUserMenu();
    } else {
      openUserMenu();
    }
  };


  if (userMenuButton) {
    userMenuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleUserMenu();
    });
  }


  if (userDropdown) {
    userDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }


  document.addEventListener("click", closeUserMenu);


  /* =======================================================
     FILTROS DE MÓDULOS
  ======================================================= */

  const normalizeValue = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase();
  };


  const filterModules = (selectedFilter) => {
    const normalizedFilter = normalizeValue(selectedFilter);

    moduleCards.forEach((card) => {
      const category = normalizeValue(card.dataset.category);

      const shouldShow =
        normalizedFilter === "todos" ||
        category === normalizedFilter;

      card.hidden = !shouldShow;
    });
  };


  moduleFilterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      moduleFilterButtons.forEach((filterButton) => {
        filterButton.classList.remove("is-active");
      });

      button.classList.add("is-active");

      const selectedFilter =
        button.dataset.filter || "todos";

      filterModules(selectedFilter);

    });

  });


  /* =======================================================
     ENLACES DEL SIDEBAR
  ======================================================= */

  const setActiveSidebarLink = (selectedLink) => {

    sidebarLinks.forEach((link) => {
      link.classList.remove("is-active");
    });

    selectedLink.classList.add("is-active");

  };


  sidebarLinks.forEach((link) => {

    link.addEventListener("click", () => {

      setActiveSidebarLink(link);

      if (window.innerWidth <= 980) {
        closeSidebar();
      }

    });

  });


  /* =======================================================
     DETECCIÓN DE SECCIÓN VISIBLE
  ======================================================= */

  const observedSections = [];

  sidebarLinks.forEach((link) => {

    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    const section =
      document.querySelector(href);

    if (section) {
      observedSections.push({
        link,
        section
      });
    }

  });


  const updateActiveLinkByScroll = () => {

    if (observedSections.length === 0) {
      return;
    }

    const referencePosition =
      window.scrollY + 150;

    let currentItem =
      observedSections[0];

    observedSections.forEach((item) => {

      if (item.section.offsetTop <= referencePosition) {
        currentItem = item;
      }

    });

    setActiveSidebarLink(currentItem.link);

  };


  let scrollTimeout = null;

  window.addEventListener(
    "scroll",
    () => {

      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(
        updateActiveLinkByScroll,
        40
      );

    },
    {
      passive: true
    }
  );


  /* =======================================================
     BOTÓN CONSULTAR ACTIVIDAD
  ======================================================= */

  const activityButton =
    document.querySelector(
      ".welcome-card__actions .button--secondary"
    );


  if (activityButton) {

    activityButton.addEventListener("click", () => {

      const activitySection =
        document.getElementById("actividad");

      if (!activitySection) {
        return;
      }

      activitySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  }


  /* =======================================================
     BOTONES TEMPORALES DEL MENÚ DE USUARIO
  ======================================================= */

  const userDropdownItems =
    document.querySelectorAll(".user-dropdown__item");


  userDropdownItems.forEach((item) => {

    item.addEventListener("click", () => {

      const label =
        normalizeValue(item.textContent);

      if (label.includes("cerrar sesión")) {

        /*
          Todavía no cerramos ninguna sesión real.

          Esta función se conectará más adelante con
          Firebase Authentication cuando integremos
          el acceso único del Sistema FALCO®.
        */

        closeUserMenu();

        console.info(
          "Portal FALCO®: cierre de sesión pendiente de integración."
        );

        return;
      }


      if (label.includes("mi perfil")) {

        closeUserMenu();

        console.info(
          "Portal FALCO®: perfil de usuario pendiente de integración."
        );

        return;
      }


      if (label.includes("preferencias")) {

        closeUserMenu();

        console.info(
          "Portal FALCO®: preferencias pendientes de integración."
        );

      }

    });

  });


  /* =======================================================
     CIERRE MEDIANTE TECLA ESCAPE
  ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
      return;
    }

    closeUserMenu();
    closeSidebar();

  });


  /* =======================================================
     CAMBIO DE TAMAÑO DE VENTANA
  ======================================================= */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 980) {
      closeSidebar();
    }

  });


  /* =======================================================
     VALIDACIÓN INICIAL
  ======================================================= */

  const validatePortalStructure = () => {

    const requiredElements = [
      {
        name: "Sidebar",
        element: portalSidebar
      },
      {
        name: "Contenedor de módulos",
        element: document.querySelector(".modules-grid")
      },
      {
        name: "Encabezado",
        element: document.querySelector(".portal-header")
      }
    ];


    const missingElements =
      requiredElements.filter((item) => !item.element);


    if (missingElements.length > 0) {

      console.warn(
        "Portal FALCO®: faltan elementos estructurales.",
        missingElements.map((item) => item.name)
      );

      return false;
    }


    return true;

  };


  validatePortalStructure();
  updateActiveLinkByScroll();


  console.info(
    "Portal Institucional FALCO®: interfaz inicializada correctamente."
  );

});