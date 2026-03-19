// ===============================
// LOADER
// ===============================

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});


// ===============================
// SERVICIOS
// ===============================

function abrirServicio(servicio){

  const titulo = document.getElementById("titulo-servicio");
  const texto = document.getElementById("texto-servicio");

  const datos = {

    pericia:["Pericia Psicológica","Evaluación psicológica en procesos judiciales mediante entrevistas clínicas y técnicas psicodiagnósticas."],
    danio:["Evaluación de Daño Psíquico","Valoración del impacto psicológico posterior a hechos traumáticos."],
    informes:["Informes Técnicos","Elaboración de informes psicológicos dirigidos a tribunales."],
    entrevista:["Entrevista Pericial","Entrevistas psicológicas especializadas para evaluación forense."],
    asesoria:["Asesoramiento a Abogados","Orientación técnica en estrategias periciales."],
    juicio:["Ratificación en Juicio","Defensa del informe pericial ante el tribunal."],
    tcc:["Terapia Individual","Tratamiento psicológico basado en evidencia científica."],
    familiar:["Terapia Familiar","Intervención terapéutica en conflictos familiares."],
    pareja:["Terapia de Pareja","Recomposición del vínculo afectivo."]

  };

  if(!datos[servicio]) return;

  titulo.innerText = datos[servicio][0];
  texto.innerText = datos[servicio][1];

  document.getElementById("detalle-servicio")?.scrollIntoView({
    behavior:"smooth"
  });

}

window.abrirServicio = abrirServicio;


// ===============================
// AREAS
// ===============================

function abrirArea(area){

  const titulo = document.getElementById("titulo-area");
  const texto = document.getElementById("texto-area");

  const datos = {

    civil:["Pericia Psicológica en Derecho Civil","Evaluaciones psicológicas en procesos civiles vinculados a daños y perjuicios."],
    laboral:["Pericia Psicológica en Derecho Laboral","Evaluación psicológica en conflictos laborales y accidentes de trabajo."],
    penal:["Pericia Psicológica en Derecho Penal","Evaluaciones psicológicas dentro de procesos penales."],
    familia:["Pericia Psicológica en Derecho de Familia","Evaluaciones psicológicas en conflictos familiares."],
    evaluaciones:["Evaluaciones Psicológicas","Aplicación de entrevistas clínicas y test psicodiagnósticos."],
    informes:["Informes Periciales","Elaboración de informes técnicos psicológicos para tribunales."]

  };

  if(!datos[area]) return;

  titulo.innerText = datos[area][0];
  texto.innerText = datos[area][1];

  document.getElementById("detalle-area")?.scrollIntoView({
    behavior:"smooth"
  });

}

window.abrirArea = abrirArea;


// ===============================
// TESTS
// ===============================

function mostrarTest(test){

  const titulo = document.getElementById("titulo-test");
  const contenido = document.getElementById("contenido-test");
  const panel = document.getElementById("detalle-test");

  const datos = {

    mmpi:{
      titulo:"Inventario Multifásico de Personalidad de Minnesota (MMPI)",
      texto:"Instrumento psicométrico ampliamente utilizado para evaluar rasgos de personalidad y posibles indicadores de psicopatología."
    },

    rorschach:{
      titulo:"Test de Rorschach",
      texto:"Técnica proyectiva basada en la interpretación de manchas de tinta que permite explorar procesos emocionales y dinámicas profundas de la personalidad."
    },

    bender:{
      titulo:"Test Gestáltico Visomotor de Bender",
      texto:"Instrumento utilizado para evaluar integración visomotora y detectar posibles indicadores neuropsicológicos o emocionales."
    },

    htp:{
      titulo:"HTP (Casa-Árbol-Persona)",
      texto:"Técnica proyectiva gráfica que permite explorar aspectos emocionales y dinámica de personalidad."
    },

    lluvia:{
      titulo:"Persona Bajo la Lluvia",
      texto:"Técnica proyectiva que analiza mecanismos de afrontamiento frente a situaciones de estrés."
    },

    zulliger:{
      titulo:"Test de Zulliger",
      texto:"Técnica proyectiva derivada del Rorschach para evaluar dinámica emocional."
    },

    ansiedad:{
      titulo:"Inventarios de Ansiedad y Depresión",
      texto:"Escalas psicométricas utilizadas para evaluar niveles de ansiedad y depresión."
    },

    estres:{
      titulo:"Evaluación de Estrés Postraumático",
      texto:"Instrumentos destinados a evaluar síntomas asociados a experiencias traumáticas."
    },

    clinicas:{
      titulo:"Escalas de Evaluación Clínica",
      texto:"Instrumentos estructurados para evaluar diferentes dimensiones del funcionamiento psicológico."
    }

  };

  if(!datos[test]) return;

  titulo.innerText = datos[test].titulo;
  contenido.innerText = datos[test].texto;

  panel.style.display = "block";

  const offset = 120; // altura del header

const top = panel.getBoundingClientRect().top + window.pageYOffset - offset;

window.scrollTo({
top: top,
behavior: "smooth"
});

}

window.mostrarTest = mostrarTest;


// ===============================
// MENUS
// ===============================

function toggleAreas(){
  document.getElementById("submenuAreas")?.classList.toggle("mostrar");
}

function toggleServicios(){
  document.getElementById("submenuServicios")?.classList.toggle("show");
}

function toggleFormacion(){
  document.getElementById("submenuFormacion")?.classList.toggle("show");
}

window.toggleAreas = toggleAreas;
window.toggleServicios = toggleServicios;
window.toggleFormacion = toggleFormacion;


// ===============================
// FAQ ACORDEON
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {

    const pregunta = item.querySelector("h3");
    const respuesta = item.querySelector("p");

    if(!pregunta || !respuesta) return;

    respuesta.style.display = "none";

    pregunta.addEventListener("click", () => {

      items.forEach(i=>{
        const p = i.querySelector("p");
        if(p) p.style.display="none";
      });

      respuesta.style.display="block";

    });

  });

});


function toggleServicios(){

const menu = document.getElementById("submenuServicios");

menu.style.display =
menu.style.display === "flex"
? "none"
: "flex";

}


function toggleFormacion(){

const menu = document.getElementById("submenuFormacion");

menu.style.display =
menu.style.display === "flex"
? "none"
: "flex";

}

document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("neuronal-bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numParticles = 80;

class Particle{

constructor(){

this.x = Math.random()*canvas.width;
this.y = Math.random()*canvas.height;

this.vx = (Math.random()-0.5)*0.5;
this.vy = (Math.random()-0.5)*0.5;

}

move(){

this.x += this.vx;
this.y += this.vy;

if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
if(this.y < 0 || this.y > canvas.height) this.vy *= -1;

}

draw(){

ctx.beginPath();
ctx.arc(this.x,this.y,2,0,Math.PI*2);
ctx.fillStyle="rgba(255,255,255,0.6)";
ctx.fill();

}

}

for(let i=0;i<numParticles;i++){

particles.push(new Particle());

}

function connect(){

for(let a=0;a<particles.length;a++){

for(let b=a;b<particles.length;b++){

let dx = particles[a].x - particles[b].x;
let dy = particles[a].y - particles[b].y;

let distance = Math.sqrt(dx*dx+dy*dy);

if(distance < 120){

ctx.beginPath();
ctx.strokeStyle="rgba(255,255,255,0.08)";
ctx.lineWidth=1;

ctx.moveTo(particles[a].x,particles[a].y);
ctx.lineTo(particles[b].x,particles[b].y);

ctx.stroke();

}

}

}

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p=>{
p.move();
p.draw();
});

connect();

requestAnimationFrame(animate);

}

animate();

window.addEventListener("resize",()=>{

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

});

});


function buscarContenido(){

let input = document.getElementById("buscadorInput").value.toLowerCase();

let cards = document.querySelectorAll(".card");

cards.forEach(card=>{

let texto = card.innerText.toLowerCase();

if(texto.includes(input)){
card.style.display="block";
}else{
card.style.display="none";
}

});

}


function buscarFAQ(){

let input = document.getElementById("buscadorFAQ").value.toLowerCase();

let preguntas = document.querySelectorAll(".faq-item");

preguntas.forEach(item => {

let texto = item.innerText.toLowerCase();

if(texto.includes(input)){
item.style.display="block";
}else{
item.style.display="none";
}

});

}


// ===============================
    // MENU FLOTANTE
    // ===============================
    
    window.toggleMenu=function(){
    
    const menu=document.getElementById("menuServicios");
    
    if(menu){
    menu.classList.toggle("abrir");
    }
    
    };
    
  // ===============================
// BUSCADOR FAQ AVANZADO
// ===============================

function normalizarTexto(texto){
  return texto
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"");
  }
  
  document.addEventListener("DOMContentLoaded",function(){
  
  const buscador=document.getElementById("faq-buscador");
  const items=document.querySelectorAll(".faq-item");
  
  if(!buscador) return;
  
  // ocultar todo al inicio
  items.forEach(function(item){
  item.style.display="none";
  });
  
  buscador.addEventListener("keyup",function(){
  
  let texto=buscador.value;
  let textoNormalizado=normalizarTexto(texto);
  
  items.forEach(function(item){
  
  let pregunta=item.querySelector("h3");
  let respuesta=item.querySelector("p");
  
  let contenido=normalizarTexto(pregunta.innerText+" "+respuesta.innerText);
  
  if(textoNormalizado.length>0 && contenido.includes(textoNormalizado)){
  
  item.style.display="block";
  
  setTimeout(()=>{
  item.classList.add("visible");
  },10);
  
  // resaltar palabra
  let regex=new RegExp("("+texto+")","gi");
  
  pregunta.innerHTML=pregunta.innerText.replace(regex,'<span class="resaltado">$1</span>');
  respuesta.innerHTML=respuesta.innerText.replace(regex,'<span class="resaltado">$1</span>');
  
  }else{
  
  item.classList.remove("visible");
  item.style.display="none";
  
  // restaurar texto
  pregunta.innerHTML=pregunta.innerText;
  respuesta.innerHTML=respuesta.innerText;
  
  }
  
  });
  
  if(texto===""){
  items.forEach(function(item){
  item.style.display="none";
  });
  }
  
  });
  
  });




  function toggleMenu(){

const menu = document.getElementById("menuServicios");

menu.classList.toggle("activo");

}


  // ===============================
// TECNICAS
// ===============================

function mostrarTecnica(tecnica){

const titulo = document.getElementById("titulo-tecnica");
const texto = document.getElementById("texto-tecnica");
const panel = document.getElementById("detalle-tecnica");

const datos = {

entrevista:{
titulo:"Entrevista Clínica",
texto:"La entrevista clínica es una herramienta central en la evaluación psicológica forense. Permite explorar la historia personal, antecedentes relevantes, funcionamiento emocional y percepción del conflicto legal."
},

observacion:{
titulo:"Observación Clínica",
texto:"Consiste en el análisis sistemático del comportamiento del evaluado durante las entrevistas, incluyendo lenguaje verbal, comunicación no verbal, coherencia emocional y actitud frente al proceso."
},

psicometricos:{
titulo:"Tests Psicométricos",
texto:"Instrumentos estandarizados que permiten evaluar rasgos de personalidad, indicadores clínicos y variables psicológicas mediante escalas objetivas."
},

proyectivas:{
titulo:"Técnicas Proyectivas",
texto:"Métodos que exploran aspectos profundos de la personalidad y dinámica emocional a través de estímulos ambiguos o gráficos."
},

personalidad:{
titulo:"Evaluación de Personalidad",
texto:"Análisis global del funcionamiento psicológico del evaluado mediante diferentes instrumentos psicodiagnósticos."
},

cognitiva:{
titulo:"Evaluación Cognitiva",
texto:"Valoración de procesos cognitivos como memoria, atención, pensamiento y capacidad de razonamiento."
},

discurso:{
titulo:"Análisis del Discurso",
texto:"Estudio del relato del evaluado, su coherencia narrativa, contenido emocional y posibles inconsistencias."
},

emocional:{
titulo:"Evaluación del Estado Emocional",
texto:"Exploración de síntomas emocionales, ansiedad, estrés y manifestaciones psicológicas relevantes."
},

integrado:{
titulo:"Análisis Psicodiagnóstico Integrado",
texto:"Integración de todos los datos obtenidos durante la evaluación para elaborar conclusiones técnicas dentro del informe pericial."
}

};

if(!datos[tecnica]) return;

titulo.innerText = datos[tecnica].titulo;
texto.innerText = datos[tecnica].texto;

panel.style.display = "block";

panel.scrollIntoView({
behavior:"smooth"
});

}


function mostrarTecnica(tecnica){

const titulo = document.getElementById("modal-titulo");
const texto = document.getElementById("modal-texto");
const modal = document.getElementById("modal-tecnica");

const datos = {

entrevista:{
titulo:"Entrevista Clínica",
texto:"La entrevista clínica permite explorar antecedentes personales, historia vital, estado emocional y percepción del conflicto judicial."
},

observacion:{
titulo:"Observación Clínica",
texto:"Consiste en el análisis del comportamiento, actitud, comunicación verbal y no verbal del evaluado durante la evaluación."
},

psicometricos:{
titulo:"Tests Psicométricos",
texto:"Instrumentos psicológicos estandarizados que permiten medir rasgos de personalidad, variables clínicas y aspectos cognitivos."
},

proyectivas:{
titulo:"Técnicas Proyectivas",
texto:"Métodos utilizados para explorar dinámicas profundas de la personalidad y aspectos emocionales."
},

personalidad:{
titulo:"Evaluación de Personalidad",
texto:"Permite comprender el funcionamiento psicológico global del evaluado."
},

cognitiva:{
titulo:"Evaluación Cognitiva",
texto:"Explora memoria, atención, pensamiento y otras funciones cognitivas."
},

discurso:{
titulo:"Análisis del Discurso",
texto:"Analiza coherencia narrativa, contenido emocional y consistencia del relato."
},

emocional:{
titulo:"Evaluación del Estado Emocional",
texto:"Permite identificar síntomas emocionales, niveles de ansiedad o estrés."
},

integrado:{
titulo:"Análisis Psicodiagnóstico Integrado",
texto:"Integra entrevistas, observaciones y resultados de evaluación para elaborar conclusiones periciales."
}

};

if(!datos[tecnica]) return;

titulo.innerText = datos[tecnica].titulo;
texto.innerText = datos[tecnica].texto;

modal.style.display = "flex";

}

function cerrarTecnica(){
document.getElementById("modal-tecnica").style.display = "none";
}


// cerrar SOLO si se hace click en el fondo

window.addEventListener("click", function(e){

const modal = document.getElementById("modal-tecnica");
const contenido = document.querySelector(".modal-contenido");

if(e.target === modal){
modal.style.display = "none";
}

});



// CERRAR HACIENDO CLICK FUERA DEL CUADRO

window.addEventListener("click", function(e){

const modal = document.getElementById("modal-tecnica");

if(e.target === modal){
modal.style.display = "none";
}

});


function abrirAmbito(){
document.getElementById("modal-ambito").style.display = "block";
}

function cerrarAmbito(){
document.getElementById("modal-ambito").style.display = "none";
}


window.onclick = function(event) {

if(event.target.classList.contains("modal")){

event.target.style.display = "none";

}

}

function toggleRecursos(){

  const menu = document.getElementById("submenuRecursos");
  
  menu.classList.toggle("activo");
  
  }


  function abrirDossier(){
document.getElementById("dossier").style.display="flex";
}

function cerrarDossier(){
document.getElementById("dossier").style.display="none";
}

function abrirMaterial(){
document.getElementById("material-abogados").style.display="flex";
}

function cerrarMaterial(){
document.getElementById("material-abogados").style.display="none";
}



// ===============================
// ANIMACION SCROLL TIMELINE
// ===============================

function revealOnScroll(){

const elementos = document.querySelectorAll(".reveal");

elementos.forEach(function(el){

const windowHeight = window.innerHeight;
const elementTop = el.getBoundingClientRect().top;

if(elementTop < windowHeight - 100){
el.classList.add("active");
}

});

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);



// ===============================
// SCROLL REVEAL ULTRA SEGURO
// ===============================

(function(){

function mostrarElementos(){

var elementos = document.querySelectorAll(".reveal");

for(var i = 0; i < elementos.length; i++){

var ventana = window.innerHeight;
var top = elementos[i].getBoundingClientRect().top;

if(top < ventana - 100){
elementos[i].classList.add("active");
}

}

}

// eventos
window.addEventListener("scroll", mostrarElementos);
window.addEventListener("load", mostrarElementos);

// ejecución inicial
setTimeout(mostrarElementos, 300);

})();