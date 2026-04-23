/* ===============================
   INIT GENERAL
=============================== */
window.addEventListener("load", () => {

  // ===== LOADER =====
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";

  // ===== SCROLL SUAVE =====
  const header = document.querySelector("header");

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const offset = header ? header.offsetHeight + 10 : 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: "smooth"
      });

      // cerrar menú mobile después del click
      const menu = document.getElementById("menu");
      if (window.innerWidth <= 768 && menu) {
        menu.classList.remove("active");
      }
    });
  });

  // ===== FIX SCROLL MOBILE =====
  document.querySelectorAll('#menu a[href^="#"]').forEach(link => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        const href = this.getAttribute("href");
        const target = document.querySelector(href);
        if (!target) return;

        setTimeout(() => {
          const header = document.querySelector("header");
          const offset = header ? header.offsetHeight + 10 : 10;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top: top,
            behavior: "smooth"
          });
        }, 250);
      }
    });
  });

  // ===== BOTONES "VER PROGRAMAS" =====
  document.querySelectorAll(".toggle-lista").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const card = this.closest(".curso-card, .card.expandible, .card");
      if (!card) return;

      const estabaAbierto = card.classList.contains("activo");

      document.querySelectorAll(".curso-card, .card.expandible").forEach(c => {
        c.classList.remove("activo");
      });

      if (!estabaAbierto) {
        card.classList.add("activo");
      }
    });
  });

  // evitar que links internos de programas cierren raro
  document.querySelectorAll(".lista-programas a, .lista-items a, .lista-pdf a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

});


/* ===============================
   MENU HEADER
=============================== */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) menu.classList.toggle("active");
}

function toggleDropdown(element) {
  const parent = element.parentElement;
  const submenu = parent.querySelector(".dropdown-menu");
  const isMobile = window.innerWidth <= 768;

  if (!submenu) return;

  // en PC usa hover del CSS
  if (!isMobile) return;

  // cerrar otros
  document.querySelectorAll(".dropdown").forEach(drop => {
    if (drop !== parent) {
      drop.classList.remove("active");
      const otherSubmenu = drop.querySelector(".dropdown-menu");
      if (otherSubmenu) otherSubmenu.style.display = "none";
    }
  });

  const abierto = submenu.style.display === "flex";

  if (abierto) {
    parent.classList.remove("active");
    submenu.style.display = "none";
  } else {
    parent.classList.add("active");
    submenu.style.display = "flex";
    submenu.style.flexDirection = "column";
    submenu.style.position = "static";
    submenu.style.opacity = "1";
    submenu.style.visibility = "visible";
    submenu.style.transform = "none";
    submenu.style.width = "100%";
    submenu.style.minWidth = "100%";
    submenu.style.marginTop = "6px";
    submenu.style.padding = "6px 0";
    submenu.style.background = "rgba(255,255,255,0.03)";
    submenu.style.border = "1px solid rgba(255,255,255,0.08)";
    submenu.style.borderRadius = "8px";
    submenu.style.boxShadow = "none";
  }
}


/* ===============================
   ACORDEON GENERAL
=============================== */
function toggleAcordeon(header) {
  const item = header.parentElement;
  const acordeon = item.parentElement;

  acordeon.querySelectorAll(".acordeon-item").forEach(el => {
    if (el !== item) el.classList.remove("activo");
  });

  item.classList.toggle("activo");
}


/* ===============================
   SUB ACORDEON
=============================== */
function toggleSubAcordeon(header) {
  const item = header.parentElement;
  const contenedor = item.parentElement;

  contenedor.querySelectorAll(".acordeon-item").forEach(el => {
    if (el !== item) el.classList.remove("activo");
  });

  item.classList.toggle("activo");
}


/* ===============================
   TECNICAS
=============================== */
function toggleTecnicas(header) {
  const item = header.parentElement;
  const contenedor = item.parentElement;

  contenedor.querySelectorAll(".acordeon-item").forEach(el => {
    if (el !== item) el.classList.remove("activo");
  });

  item.classList.toggle("activo");
}


/* ===============================
   DAÑO / ITEMS DESPLEGABLES
=============================== */
function toggleDanio(header) {
  const item = header.closest(".danio-item");
  if (!item) return;

  const contenedor = item.parentElement;
  const yaActivo = item.classList.contains("activo");

  contenedor.querySelectorAll(".danio-item").forEach(el => {
    el.classList.remove("activo");
  });

  if (!yaActivo) item.classList.add("activo");
}


/* ===============================
   FORMULARIOS
=============================== */
function toggleForm(header) {
  const item = header.parentElement;
  const contenido = item.querySelector(".form-contenido");
  const icono = header.querySelector(".icono");

  document.querySelectorAll("#formularios .form-item").forEach(el => {
    if (el !== item) {
      const c = el.querySelector(".form-contenido");
      const i = el.querySelector(".icono");
      if (c) c.style.display = "none";
      if (i) i.textContent = "+";
    }
  });

  if (!contenido || !icono) return;

  if (contenido.style.display === "block") {
    contenido.style.display = "none";
    icono.textContent = "+";
  } else {
    contenido.style.display = "block";
    icono.textContent = "−";
  }
}


/* ===============================
   RECURSOS
=============================== */
function toggleRecurso(header) {
  const item = header.parentElement;
  const contenido = item.querySelector(".form-contenido, .recurso-contenido");
  const icono = header.querySelector(".icono");

  document.querySelectorAll("#recursos .form-item, #recursos .recurso-item").forEach(el => {
    if (el !== item) {
      const c = el.querySelector(".form-contenido, .recurso-contenido");
      const i = el.querySelector(".icono");
      if (c) c.style.display = "none";
      if (i) i.textContent = "+";
    }
  });

  if (!contenido || !icono) return;

  if (contenido.style.display === "block") {
    contenido.style.display = "none";
    icono.textContent = "+";
  } else {
    contenido.style.display = "block";
    icono.textContent = "−";
  }
}


/* ===============================
   TALLERES / CURSOS
=============================== */
function toggleLista(card) {
  document.querySelectorAll(".curso-card, .card.expandible").forEach(c => {
    if (c !== card) c.classList.remove("activo");
  });

  card.classList.toggle("activo");
}


/* ===============================
   FAB
=============================== */
function toggleFab() {
  const fab = document.querySelector(".fab-container");
  if (fab) fab.classList.toggle("active");
}


/* ===============================
   BLOQUES GENERICOS
=============================== */
function toggleTecnico() {
  const bloque = document.getElementById("versionTecnica");
  if (!bloque) return;

  bloque.style.display = (bloque.style.display === "block") ? "none" : "block";
}

function toggleBloque(id) {
  const bloque = document.getElementById(id);
  if (bloque) bloque.classList.toggle("activo");
}



/* ===============================
   HEADER APARECE AL DESLIZAR
=============================== */
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");

  if (!header) return;

  if (window.scrollY > 40) {
    header.classList.add("header-visible");
  } else {
    header.classList.remove("header-visible");
  }
});