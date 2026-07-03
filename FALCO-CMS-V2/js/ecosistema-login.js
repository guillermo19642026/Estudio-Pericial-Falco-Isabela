import { auth, db } from "../firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const formLogin = document.getElementById("formLoginEcosistema");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Completá email y contraseña.");
    return;
  }

  try {
    const credencial = await signInWithEmailAndPassword(auth, email, password);
    const uid = credencial.user.uid;

    const refUsuario = doc(db, "usuarios", uid);
    const snapUsuario = await getDoc(refUsuario);

    if (!snapUsuario.exists()) {
      alert("El usuario no tiene un perfil asignado.");
      return;
    }

    const usuario = snapUsuario.data();
    const rol = usuario.rol;

    if (!rol) {
      alert("El usuario no tiene un rol asignado.");
      return;
    }

    if (rol === "periciado" && usuario.usado === true) {
      alert("Este acceso ya fue utilizado o finalizado.");
      return;
    }

    localStorage.setItem("falcoUidUsuario", uid);
    localStorage.setItem("falcoRolUsuario", rol);
    localStorage.setItem("falcoEmailUsuario", email);

    window.location.href = "centro-operaciones/centro-operaciones.html";

  } catch (error) {
    console.error(error);
    alert("No se pudo iniciar sesión. Verificá email y contraseña.");
  }
});