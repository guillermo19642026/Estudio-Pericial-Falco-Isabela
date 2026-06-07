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




/* ===============================
   FONDO NEURONAL
=============================== */

const canvas = document.getElementById("neuronal-bg");

if (canvas) {

  const ctx = canvas.getContext("2d");

  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }));
  }

  function animateNeurons() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(201,169,110,.7)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {

        const q = particles[j];

        const dx = p.x - q.x;
        const dy = p.y - q.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);

          ctx.strokeStyle =
            `rgba(201,169,110,${(1 - dist / 140) * 0.18})`;

          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateNeurons);
  }

  resizeCanvas();
  animateNeurons();

  window.addEventListener("resize", resizeCanvas);
}








/* ===============================
   ANALYTICS - CLICS IMPORTANTES
   Seguro: no modifica diseño ni funciones existentes
=============================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gtag !== "function") return;

  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener("click", () => {
      gtag("event", "click_whatsapp", {
        event_category: "consulta",
        event_label: link.textContent.trim() || "WhatsApp"
      });
    });
  });

  document.querySelectorAll('a[href*="login.html"]').forEach(link => {
    link.addEventListener("click", () => {
      gtag("event", "click_acceso_tests", {
        event_category: "plataforma",
        event_label: "Acceso a tests psicometricos"
      });
    });
  });

  document.querySelectorAll('a[href*="solicitar-turno.html"]').forEach(link => {
    link.addEventListener("click", () => {
      gtag("event", "click_solicitar_turno", {
        event_category: "turnos",
        event_label: "Solicitar turno"
      });
    });
  });
});





/* ===============================
   MENU ACTIVO SEGUN SECCION VISIBLE
   Version compatible con header fijo
=============================== */

document.addEventListener("DOMContentLoaded", () => {
  const linksMenu = document.querySelectorAll('#menu a[href^="#"]');

  if (!linksMenu.length) return;

  const activarMenu = () => {
    let linkActivo = null;

    linksMenu.forEach(link => {
      const id = link.getAttribute("href");
      const section = document.querySelector(id);

      if (!section) return;

      const rect = section.getBoundingClientRect();

      if (rect.top <= 220 && rect.bottom >= 220) {
        linkActivo = link;
      }
    });

    linksMenu.forEach(link => link.classList.remove("activo"));

    if (linkActivo) {
      linkActivo.classList.add("activo");
    }
  };

  window.addEventListener("scroll", activarMenu);
  window.addEventListener("resize", activarMenu);
  activarMenu();
});


/* ===============================
   SCROLL REVEAL
=============================== */

document.addEventListener("DOMContentLoaded", () => {

  const elementos = document.querySelectorAll(
    ".card, .acordeon-item, .danio-item, .servicio-juridico-card, .caso-card, .acceso-card, .proceso-card"
  );

  elementos.forEach(el => {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }

    });

  }, {
    threshold: 0.12
  });

  elementos.forEach(el => observer.observe(el));

});