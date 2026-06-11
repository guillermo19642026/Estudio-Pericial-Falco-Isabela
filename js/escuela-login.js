import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById("loginEscuelaForm");
const loginMensaje = document.getElementById("loginMensaje");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  loginMensaje.textContent = "Ingresando...";
  loginMensaje.style.color = "#f5dfad";

  try {
    await setPersistence(auth, browserLocalPersistence);

    await signInWithEmailAndPassword(auth, email, password);

    loginMensaje.textContent = "Acceso correcto. Redirigiendo...";
    loginMensaje.style.color = "#9ee6b8";

    setTimeout(() => {
      window.location.href = "./escuela-panel.html";
    }, 800);

  } catch (error) {
    console.error(error);
    loginMensaje.textContent = "Correo o contraseña incorrectos.";
    loginMensaje.style.color = "#ffb4b4";
  }
});