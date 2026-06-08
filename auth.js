import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 CONFIGURACIÓN ADMIN
const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

// ===== LOGIN =====
// Admin: sin límite
// Periciados: un solo uso
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


    // 🔐 ADMIN SIN LÍMITE
    if (rol === "periciado") {

      // 🔥 BLOQUEO DE USO ÚNICO PARA PERICIADOS
      if (snap.exists() && dataUsuario.usado === true) {
        if (errorBox) errorBox.textContent = "Este usuario ya fue utilizado.";
        await signOut(auth);
        return;
      }

      // ✔ MARCAR COMO USADO SOLO PERICIADOS
      await setDoc(ref, {
        email: user.email,
        rol: rol,
        usado: true,
        fechaUso: new Date().toISOString()
      }, { merge: true });
    }

  if (rol === "admin") {
  window.location.href = "dashboard.html";

} else if (rol === "perito") {
  window.location.href = "dashboard-perito.html";

} else if (rol === "informe") {
  window.location.href = "panel-informe.html";

} else if (rol === "biblioteca") {
  window.location.href = "biblioteca-falco.html";

} else {
  window.location.href = "dashboard-periciado.html";
}

  } catch (error) {
    console.error(error);
    if (errorBox) {
      errorBox.textContent = "No se pudo iniciar sesión. Revisá usuario, contraseña o permisos.";
    }
  }
};

// ===== LOGOUT =====
window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ===== PROTEGER PÁGINAS + CONTROL DE ROLES =====
onAuthStateChanged(auth, async (user) => {
  const pagina = window.location.pathname.toLowerCase();

  const esLogin =
    pagina.includes("login.html") ||
    pagina.endsWith("/");

  if (!user && !esLogin) {
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
const esBiblioteca = rol === "biblioteca";
const tieneAccesoPanel = esAdmin || esPerito;


  const paginasAdmin = [
    "dashboard.html",
    "admin-resultados.html",
    "panel-postulaciones.html",
    "panel-mesa-entrada.html",
    "archivo-pericial.html"
  ];

  const paginasPericiado = [
    "dashboard-periciado.html",
    "scl90.html",
    "bdi.html",
    "bai.html",
    "desesperanza.html"
  ];



const paginasInforme = [
  "panel-informe.html",
  "scl90.html",
  "bdi.html",
  "bai.html",
  "desesperanza.html",
  "analisis-integrado.html"
];

const paginasBiblioteca = [
  "biblioteca-falco.html"
];


  // 🔒 Periciado no puede entrar a paneles admin
 if ((esPericiado || esInforme) && paginasAdmin.some(p => pagina.includes(p))) {
  window.location.href = esInforme ? "panel-informe.html" : "dashboard-periciado.html";
  return;
}

if (esBiblioteca) {

  const puedeEntrarBiblioteca =
    paginasBiblioteca.some(p => pagina.includes(p));

  if (!puedeEntrarBiblioteca) {
    window.location.href = "biblioteca-falco.html";
    return;
  }

}



  // 🔒 Admin y perito no usan dashboard periciado
if (
  (esAdmin || esPerito) &&
  pagina.includes("dashboard-periciado.html")
) {

  if (esAdmin) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "dashboard-perito.html";
  }

  return;
}


if (
  (esAdmin || esPerito) &&
  pagina.includes("panel-informe.html")
) {

  if (esAdmin) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "dashboard-perito.html";
  }

  return;
}



  // 👁️ Mostrar / ocultar botones admin
  const botonesAdmin = document.querySelectorAll(".admin-only");

  botonesAdmin.forEach(boton => {
    boton.style.display = tieneAccesoPanel ? "flex" : "none";
  });

  const dashboardMetricas = document.getElementById("dashboardMetricas");

  if (dashboardMetricas) {
    dashboardMetricas.style.display = tieneAccesoPanel ? "grid" : "none";
  }

  // 🧠 Si periciado entra a un test sin modo=periciado, lo corregimos
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