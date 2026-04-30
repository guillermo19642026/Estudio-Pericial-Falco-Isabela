import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ===== LOGIN =====
window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  if (!email || !password) {
    errorBox.textContent = "Ingrese email y contraseña";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    errorBox.textContent = "Usuario o contraseña incorrectos";
    console.error(error);
  }
};


// ===== LOGOUT =====
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};


// ===== PROTECCIÓN DE PÁGINAS =====
onAuthStateChanged(auth, user => {

  const pagina = window.location.pathname.toLowerCase();
  const esLogin = pagina.includes("login");

  if (!user && !esLogin) {
    window.location.href = "login.html";
  }

  if (user && esLogin) {
    window.location.href = "dashboard.html";
  }
});


// ===== SOLICITAR ACCESO (WHATSAPP + MAIL) =====
window.solicitarAcceso = function () {

  const emailCampo = document.getElementById("email");
  const email = emailCampo?.value || prompt("Ingresá tu email");

  if (!email) return;

  const mensaje = `Hola, solicito acceso a los tests psicométricos.

Email: ${email}
Fecha: ${new Date().toLocaleString()}`;

  const usarWhatsapp = confirm("¿Enviar por WhatsApp?\nAceptar = WhatsApp\nCancelar = Email");

  if (usarWhatsapp) {
    const telefono = "549XXXXXXXXXX"; // ← TU NUMERO
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  } else {
    const tuEmail = "TU_EMAIL@gmail.com";
    const url = `mailto:${tuEmail}?subject=Solicitud acceso&body=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
  }
};