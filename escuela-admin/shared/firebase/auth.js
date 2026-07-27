import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

/* =========================================================
   CREAR PARTICIPANTE
========================================================= */

export async function crearParticipante(email, password) {

  const credenciales =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credenciales.user;

}

/* =========================================================
   INICIAR SESIÓN
========================================================= */

export async function iniciarSesion(email, password) {

  const credenciales =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credenciales.user;

}

/* =========================================================
   CAMBIAR CONTRASEÑA
========================================================= */

export async function cambiarPassword(passwordNueva) {

  if (!auth.currentUser) {
    throw new Error("No existe un usuario autenticado.");
  }

  await updatePassword(
    auth.currentUser,
    passwordNueva
  );

}

/* =========================================================
   CERRAR SESIÓN
========================================================= */

export async function cerrarSesion() {

  await signOut(auth);

}