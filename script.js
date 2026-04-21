
// ===============================
// INIT (cuando carga todo)
// ===============================
window.addEventListener("load", () => {

  // ===============================
  // LOADER
  // ===============================
  const loader = document.getElementById("loader");


  if (loader) loader.style.display = "none";

  // ===============================
  // FAQ BUSCADOR
  // ===============================
  const items = document.querySelectorAll(".faq-item");
  const buscador = document.getElementById("faq-buscador");

  if (buscador) {
    items.forEach(item => item.classList.remove("visible"));

    buscador.addEventListener("keyup", () => {
      const texto = buscador.value.toLowerCase();

      items.forEach(item => {
        const contenido = item.innerText.toLowerCase();

        if (texto && contenido.includes(texto)) {
          item.classList.add("visible");
        } else {
          item.classList.remove("visible");
        }
      });
    });
  }

  // ===============================
  // SCROLL SUAVE (FIX HEADER)
  // ===============================
  const header = document.querySelector("header");

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      const offset = header.offsetHeight + 10;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: top,
        behavior: "smooth"
      });
    });
  });

  // ===============================
  // FONDO NEURONAL (NÍTIDO)
  // ===============================
  const canvas = document.getElementById("neuronal-bg");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;

      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;

      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
ctx.fillStyle = "rgba(255,255,255,0.8)";
ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();


            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(212,175,55,0.25)";


            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(212,175,55,0.35)"; // dorado suave
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

});


// ===============================
// MENU
// ===============================
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) menu.classList.toggle("active");
}

function toggleDropdown(element) {
  const parent = element.parentElement;

  document.querySelectorAll(".dropdown").forEach(drop => {
    if (drop !== parent) drop.classList.remove("active");
  });

  parent.classList.toggle("active");
}





function abrirModal(tipo){

  const titulo = document.getElementById("modal-titulo");
  const texto = document.getElementById("modal-texto");
  const modal = document.getElementById("modal");

  const contenido = {
    prueba: {
      titulo: "TEST OK",
      texto: "Si ves esto, funciona perfecto"
    }
  };

  console.log("CLICK:", tipo);
  console.log("DATA:", contenido[tipo]);

  if(contenido[tipo]){
    titulo.innerText = contenido[tipo].titulo;
    texto.innerText = contenido[tipo].texto;
  } else {
    titulo.innerText = "ERROR";
    texto.innerText = "No encontró el contenido";
  }

  modal.style.display = "flex";
}



















// ===============================
// MODAL (UNIFICADO PRO)
// ===============================

function abrirModal(tipo){

  const titulo = document.getElementById("modal-titulo");
  const texto = document.getElementById("modal-texto");
  const modal = document.getElementById("modal");
  const contenido = {



// =========================
// SERVICIOS JURIDICOS
// =========================
pericia: {
  titulo: "Pericia Psicológica",
  texto: "Evaluación psicológica integral solicitada en el marco de un proceso judicial. Incluye entrevistas clínicas, aplicación de técnicas psicodiagnósticas y elaboración de informe pericial conforme a estándares legales."
},

danio: {
  titulo: "Evaluación de Daño Psíquico",
  texto: "Análisis del impacto psicológico derivado de un hecho traumático. Se evalúan secuelas emocionales, funcionalidad psíquica y su relación con el evento denunciado."
},

informes: {
  titulo: "Informes Técnicos",
  texto: "Elaboración de informes psicológicos claros, fundamentados y adaptados a requerimientos judiciales o profesionales."
},


// =========================
// SERVICIOS JURIDICOS EXTRA
// =========================
ratificacion: {
  titulo: "Ratificación en Juicio",
  texto: "Presentación y defensa del informe pericial ante el tribunal, respondiendo preguntas técnicas y aclaraciones requeridas por las partes."
},

control: {
  titulo: "Control de Pericia",
  texto: "Análisis técnico de pericias realizadas por otros profesionales, evaluando metodología, coherencia y fundamentación."
},

impugnacion: {
  titulo: "Impugnación de Informes",
  texto: "Elaboración de observaciones técnicas y objeciones fundamentadas frente a informes periciales cuestionables."
},


// =========================
// SERVICIOS PARTICULARES
// =========================
tcc: {
  titulo: "Terapia Individual",
  texto: "Espacio terapéutico orientado al abordaje de problemáticas emocionales, ansiedad, estrés y desarrollo personal."
},

familiar: {
  titulo: "Terapia Familiar",
  texto: "Intervención psicológica enfocada en dinámicas familiares, conflictos vinculares y fortalecimiento de la comunicación."
},

pareja: {
  titulo: "Terapia de Pareja",
  texto: "Acompañamiento terapéutico para resolver conflictos, mejorar la comunicación y fortalecer el vínculo de pareja."
},





    // =========================
    // TECNICAS
    // =========================

    entrevista: {
      titulo: "Entrevista Clínica",
      texto: "Exploración profunda de la historia personal, estado emocional y contexto del evaluado."
    },

    observacion: {
      titulo: "Observación Clínica",
      texto: "Análisis del comportamiento, actitud y lenguaje no verbal."
    },

    psicometricos: {
      titulo: "Tests Psicométricos",
      texto: "Instrumentos estandarizados que permiten mediciones objetivas."
    },

    proyectivas: {
      titulo: "Técnicas Proyectivas",
      texto: "Exploran aspectos inconscientes y dinámica de la personalidad."
    },

    personalidad: {
      titulo: "Evaluación de Personalidad",
      texto: "Análisis de rasgos, estructura psíquica y mecanismos defensivos."
    },

    cognitiva: {
      titulo: "Evaluación Cognitiva",
      texto: "Estudio de memoria, atención y funciones ejecutivas."
    },

    discurso: {
      titulo: "Análisis del Discurso",
      texto: "Evaluación de coherencia narrativa y consistencia lógica."
    },

    emocional: {
      titulo: "Evaluación Emocional",
      texto: "Análisis de ansiedad, estrés y estado emocional general."
    },

    integrado: {
      titulo: "Análisis Integrado",
      texto: "Síntesis técnica de todos los resultados obtenidos."
    },



// =========================
// RECURSOS
// =========================
libros: {
  titulo: "Bibliografía en Psicología Forense",
  texto: "Selección de textos fundamentales sobre evaluación psicológica, daño psíquico y práctica pericial. Incluye autores de referencia en el ámbito judicial."
},

apuntes: {
  titulo: "Apuntes Técnicos",
  texto: "Material resumido sobre técnicas de evaluación, criterios diagnósticos y estructura de informes periciales."
},

manuales: {
  titulo: "Manuales Prácticos",
  texto: "Guías de aplicación para entrevistas, administración de test y redacción de informes psicológicos."
},

test: {
  titulo: "Test Psicológicos",
  texto: "Instrumentos utilizados en psicodiagnóstico como Bender, SCL-90 y técnicas proyectivas."
},

guias: {
  titulo: "Guías Profesionales",
  texto: "Lineamientos técnicos para la práctica pericial y actuación en el ámbito judicial."
},

otros: {
  titulo: "Material Complementario",
  texto: "Artículos, documentos técnicos y recursos adicionales de consulta profesional."
},




    // =========================
    // SERVICIOS
    // =========================
     pericias: {
      titulo: "Pericias Judiciales",
      texto: "Evaluaciones psicológicas para procesos judiciales con informes técnicos."
    },

    asesoramiento: {
      titulo: "Asesoramiento Legal",
      texto: "Consultoría técnica para abogados en estrategias procesales."
    },

    particular: {
      titulo: "Atención Particular",
      texto: "Evaluaciones clínicas y orientación profesional."
    },

    // =========================
    // AREAS
    // =========================
    civil: {
      titulo: "Derecho Civil",
      texto: "Evaluación de daño psíquico y pericias en daños y perjuicios."
    },

    laboral: {
      titulo: "Derecho Laboral",
      texto: "Evaluación de estrés laboral y accidentes de trabajo."
    },

    penal: {
      titulo: "Derecho Penal",
      texto: "Análisis de imputabilidad y estado mental."
    },

    familia: {
      titulo: "Derecho de Familia",
      texto: "Evaluación de vínculos, cuidado personal y régimen de visitas."
    },

    evaluaciones: {
      titulo: "Evaluaciones Psicológicas",
      texto: "Estudios clínicos y psicodiagnósticos."
    },

    informes: {
      titulo: "Informes Periciales",
      texto: "Elaboración de informes técnicos claros y fundamentados."
    },





     // =========================
// SOBRE LA PERITO
// =========================

"modal-perito": {
  titulo: "Perfil Profesional",
  texto: "Licenciada en Psicología especializada en evaluación psicológica forense. Experiencia en pericias judiciales, elaboración de informes técnicos y asesoramiento a estudios jurídicos. Formación en psicodiagnóstico, técnicas proyectivas y evaluación del daño psíquico en distintos fueros."
},

"modal-credenciales": {
  titulo: "Credenciales",
  texto: "Licenciada en Psicología. Formación en psicología forense y evaluación pericial. Capacitación en técnicas psicodiagnósticas validadas. Participación en procesos judiciales en los ámbitos civil, laboral, penal y de familia."
},


  };

  if(contenido[tipo]){
    titulo.innerText = contenido[tipo].titulo;
    texto.innerText = contenido[tipo].texto;
  } else {
    titulo.innerText = "Información";
    texto.innerText = "Contenido en desarrollo.";
  }

  modal.style.display = "flex";
}

// ===============================
// CIERRE GLOBAL MODAL
// ===============================

document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal-tecnica").forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});
// ===============================


// ===============================
// BOTON FLOTANTE
// ===============================
function toggleFab() {
  document.querySelector(".fab-container").classList.toggle("active");
}


function toggleTecnico(){
  const bloque = document.getElementById("versionTecnica");

  if(bloque.style.display === "block"){
    bloque.style.display = "none";
  } else {
    bloque.style.display = "block";
  }
}



function toggleBloque(id){
  const bloque = document.getElementById(id);
  bloque.classList.toggle("activo");
}


function toggleAcordeon(header){

  const item = header.parentElement;
  const acordeon = item.parentElement;

  // cerrar todos
  acordeon.querySelectorAll(".acordeon-item").forEach(el => {
    if(el !== item){
      el.classList.remove("activo");
    }
  });

  // toggle actual
  item.classList.toggle("activo");
}



function toggleDanio(header){

  const item = header.closest(".danio-item");
  const contenedor = item.parentElement; // 🔑 clave

  const yaActivo = item.classList.contains("activo");

  // cerrar SOLO los del mismo bloque
  contenedor.querySelectorAll(".danio-item").forEach(el=>{
    el.classList.remove("activo");
  });

  // si NO estaba abierto → abrirlo
  if(!yaActivo){
    item.classList.add("activo");
  }
}


// ===============================
// TALLERES Y CURSOS
// ===============================

function toggleLista(card){

  // cerrar otros (opcional, queda más pro)
  document.querySelectorAll(".card.desplegable").forEach(c=>{
    if(c !== card){
      c.classList.remove("activo");
    }
  });

  // toggle del actual
  card.classList.toggle("activo");
}


document.querySelectorAll(".lista-pdf a").forEach(link => {
  link.addEventListener("click", function(e){
    e.stopPropagation();
  });
});



function toggleLista(card){

  // cerrar otras
  document.querySelectorAll(".card.expandible").forEach(c=>{
    if(c !== card){
      c.classList.remove("activo");
    }
  });

  // toggle actual
  card.classList.toggle("activo");
}


window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});




const canvas = document.getElementById("neuronal-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();





document.querySelectorAll(".toggle-lista").forEach(btn => {
  btn.addEventListener("click", function (e) {

    e.stopPropagation();

    const card = this.closest(".curso-card");
    const estaAbierto = card.classList.contains("activo");

    // 🔴 cerrar todos
    document.querySelectorAll(".curso-card").forEach(c => {
      c.classList.remove("activo");
    });

    // 🟢 si estaba cerrado → abrir
    if (!estaAbierto) {
      card.classList.add("activo");
    }

  });
});





function toggleCard(header){

  const item = header.closest(".card-acordeon");
  const contenedor = header.closest(".grid, .grid-juridicos, .grid-particulares");

  if(item.classList.contains("activo")){
    item.classList.remove("activo");
    return;
  }

  contenedor.querySelectorAll(".card-acordeon").forEach(el=>{
    el.classList.remove("activo");
  });

  item.classList.add("activo");
}





function toggleRecurso(el){
  const card = el.parentElement;

  // cerrar otros (modo pro)
  document.querySelectorAll("#recursos .recurso-acordeon").forEach(c => {
    if(c !== card) c.classList.remove("activo");
  });

  card.classList.toggle("activo");
}



function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}


document.querySelectorAll("#menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("menu").classList.remove("active");
  });
});


document.querySelectorAll("#menu .dropdown span").forEach(item => {
  item.addEventListener("click", function () {
    this.parentElement.classList.toggle("active");
  });
});


function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}


function toggleDropdown(element) {
  let all = document.querySelectorAll(".dropdown");

  all.forEach(d => {
    if (d !== element.parentElement) {
      d.classList.remove("active");
    }
  });

  element.parentElement.classList.toggle("active");
}


function toggleDropdown(element) {

  let parent = element.parentElement;

  // cerrar otros
  document.querySelectorAll(".dropdown").forEach(d => {
    if (d !== parent) {
      d.classList.remove("active");
    }
  });

  // toggle actual
  parent.classList.toggle("active");
}


function toggleForm(header) {
  const item = header.parentElement;
  const contenido = item.querySelector('.form-contenido');
  const icono = header.querySelector('.icono');

  document.querySelectorAll('#formularios .form-item').forEach((el) => {
    if (el !== item) {
      el.querySelector('.form-contenido').style.display = 'none';
      el.querySelector('.icono').textContent = '+';
    }
  });

  if (contenido.style.display === 'block') {
    contenido.style.display = 'none';
    icono.textContent = '+';
  } else {
    contenido.style.display = 'block';
    icono.textContent = '−';
  }
}



document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', function () {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    const header = document.querySelector('header');
    const offset = header ? header.offsetHeight + 20 : 20;

    if (target && target.classList.contains('form-item')) {
      const formHeader = target.querySelector('.form-header');

      setTimeout(() => {
        toggleForm(formHeader);

        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });
        }, 200);

      }, 400);
    }
  });
});






function toggleMenu() {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".menu-toggle");

  menu.classList.toggle("menu-abierto");
  toggle.classList.toggle("activo");
}

document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll("#menu a");

  // cerrar al tocar link
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        menu.classList.remove("menu-abierto");
        toggle.classList.remove("activo");
      }
    });
  });

  // dropdown mobile
  if (window.innerWidth <= 768) {
    document.querySelectorAll("#menu .dropdown > span").forEach((item) => {
      item.addEventListener("click", function () {
        const parent = this.parentElement;
        parent.classList.toggle("activo");
      });
    });
  }

  // cerrar tocando afuera
  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove("menu-abierto");
        toggle.classList.remove("activo");
      }
    }
  });
});