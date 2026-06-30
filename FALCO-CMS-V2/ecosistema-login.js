import { auth, db } from "../firebase-config.js";

import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

const formLogin = document.getElementById("formLoginEcosistema");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Ingrese email y contraseña.");
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

    if (rol === "admin") {
    window.location.href = "cms-dashboard.html";
    return;
}

    if (rol === "perito" || rol === "profesional") {
  window.location.href = "../dashboard-perito.html";
  return;
}

if (rol === "biblioteca") {
  window.location.href = "../biblioteca-falco.html";
  return;
}

if (rol === "alumno") {
  window.location.href = "../escuela-panel.html";
  return;
}

if (rol === "periciado") {
  if (snap.exists() && dataUsuario.usado === true) {
    alert("Este usuario ya fue utilizado.");
    await signOut(auth);
    return;
  }

  window.location.href = "../dashboard-periciado.html";
  return;
}

    alert("Este usuario no tiene un rol autorizado.");
    await signOut(auth);

  } catch (error) {
    console.error(error);
    alert("Correo o contraseña incorrectos.");
  }
});