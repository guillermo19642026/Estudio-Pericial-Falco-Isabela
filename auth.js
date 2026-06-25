import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

window.login = async function () {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const errorBox = document.getElementById("error");

  if (errorBox) errorBox.textContent = "";

  if (!email || !password) {
    if (errorBox) errorBox.textContent = "Ingrese email y contraseña.";
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);
    const dataUsuario = snap.exists() ? snap.data() : {};

    const rol =
      user.email === ADMIN_EMAIL
        ? "admin"
        : (dataUsuario.rol || "periciado");

    if (rol === "periciado") {
      if (snap.exists() && dataUsuario.usado === true) {
        if (errorBox) errorBox.textContent = "Este usuario ya fue utilizado.";
        await signOut(auth);
        return;
      }
    }

const params = new URLSearchParams(window.location.search);
const destino = params.get("destino");

if (destino === "biblioteca") {
  if (
    rol === "admin" ||
    rol === "profesional" ||
    rol === "biblioteca"
  ) {
    window.location.href = "biblioteca-profesional.html";
    return;
  } else {
    await signOut(auth);
    if (errorBox) {
      errorBox.textContent = "Este usuario no tiene acceso a la Biblioteca Profesional.";
    }
    return;
  }
}



    if (rol === "admin") {
      window.location.href = "dashboard.html";
      return;

    } else if (rol === "perito") {
      window.location.href = "dashboard-perito.html";
      return;

    } else if (rol === "informe") {
      window.location.href = "panel-informe.html";
      return;

    } else if (rol === "profesional") {
      window.location.href = "dashboard-profesional.html";
      return;


    } else if (rol === "periciado") {
      window.location.href = "dashboard-periciado.html";
      return;

    } else {
      await signOut(auth);
      if (errorBox) {
        errorBox.textContent = "Este usuario no tiene autorización para ingresar a tests psicométricos.";
      }
      return;
    }

  } catch (error) {
    console.error(error);
    if (errorBox) {
      errorBox.textContent = "Correo o contraseña incorrectos.";
    }
  }
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

onAuthStateChanged(auth, async (user) => {
  const pagina = window.location.pathname.toLowerCase();

  const esLogin =
    pagina.endsWith("/login.html") ||
    pagina.endsWith("/");

const paginasPublicas = [
  "biblioteca-profesional.html"
];

const esPaginaPublica = paginasPublicas.some(p => pagina.includes(p));

if (!user && !esLogin && !esPaginaPublica) {
  window.location.href = "login.html";
  return;
}

  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  const dataUsuario = snap.exists() ? snap.data() : {};

  const rol =
    user.email === ADMIN_EMAIL
      ? "admin"
      : (dataUsuario.rol || "periciado");

  const esAdmin = rol === "admin";
  const esPerito = rol === "perito";
  const esPericiado = rol === "periciado";
  const esInforme = rol === "informe";
  const esProfesional = rol === "profesional";
  const tieneAccesoPanel = esAdmin || esPerito;

  const paginasAdmin = [
    "dashboard.html",
    "admin-resultados.html",
    "panel-postulaciones.html",
    "panel-mesa-entrada.html",
    "archivo-pericial.html"
  ];

   const paginasProfesional = [
    "dashboard-profesional.html",
    "area-profesional-psicologos.html",
    "novedades-profesionales.html",
    "biblioteca-profesional.html",
    "evaluacion-psicologica.html",
    "informes-modelos.html",
    "area-pericial.html",
    "formacion-profesional.html",
    "consultoria-profesional.html",
    "recursos-tecnicos.html",
    "perfil-profesional.html"
  ];

 


  /*
  Área Profesional pública:
  Se permite navegar las páginas profesionales sin login
  para que los visitantes puedan conocer los recursos disponibles.

  El acceso se restringirá únicamente sobre documentos,
  modelos, cursos, escritos y contenidos descargables.
*/
/*
if (!(esProfesional || esAdmin) && paginasProfesional.some(p => pagina.includes(p))) {
  window.location.href = "login.html";
  return;
}
*/



  if ((esPericiado || esInforme) && paginasAdmin.some(p => pagina.includes(p))) {
    window.location.href = esInforme ? "panel-informe.html" : "dashboard-periciado.html";
    return;
  }

  if ((esAdmin || esPerito) && pagina.includes("dashboard-periciado.html")) {
    window.location.href = esAdmin ? "dashboard.html" : "dashboard-perito.html";
    return;
  }

  if ((esAdmin || esPerito) && pagina.includes("panel-informe.html")) {
    window.location.href = esAdmin ? "dashboard.html" : "dashboard-perito.html";
    return;
  }

  const botonesAdmin = document.querySelectorAll(".admin-only");
  botonesAdmin.forEach(boton => {
    boton.style.display = tieneAccesoPanel ? "flex" : "none";
  });

  const dashboardMetricas = document.getElementById("dashboardMetricas");
  if (dashboardMetricas) {
    dashboardMetricas.style.display = tieneAccesoPanel ? "grid" : "none";
  }

  const estaEnTest =
    pagina.includes("scl90.html") ||
    pagina.includes("bdi.html") ||
    pagina.includes("bai.html") ||
    pagina.includes("desesperanza.html");

  if ((esPericiado || esInforme) && estaEnTest) {
    const params = new URLSearchParams(window.location.search);

    if (params.get("modo") !== "periciado") {
      window.location.replace(window.location.pathname + "?modo=periciado");
      return;
    }
  }
});