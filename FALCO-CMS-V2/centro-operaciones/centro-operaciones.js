import { auth, db } from "../../firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  renderCentroOperaciones
} from "../js/centro-operaciones/render.js";


import {
  guardarUsuario,
  cerrarSesionLocal
} from "../js/core/storage.js";

import {
  ruta
} from "../js/core/routes.js";


const nombreUsuario = document.getElementById("nombreUsuario");
const rolUsuario = document.getElementById("rolUsuario");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

function normalizarRol(rol) {
  return String(rol || "").trim().toLowerCase();
}

btnCerrarSesion.addEventListener("click", async () => {
  await signOut(auth);

  cerrarSesionLocal();

  window.location.href = ruta("loginEcosistema");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = ruta("loginEcosistema");
    return;
  }

  const refUsuario = doc(db, "usuarios", user.uid);
  const snapUsuario = await getDoc(refUsuario);

  if (!snapUsuario.exists()) {
    nombreUsuario.textContent = user.email;
    rolUsuario.textContent = "SIN ROL";

    renderCentroOperaciones("default");
    return;
  }

  const data = snapUsuario.data();

  const nombre =
    data.nombreCompleto ||
    data.nombre ||
    data.displayName ||
    user.email;

  const rol = normalizarRol(data.rol);

  guardarUsuario(user.uid, rol, user.email);

  nombreUsuario.textContent = nombre;
  rolUsuario.textContent = rol ? rol.toUpperCase() : "SIN ROL";

  const estadoRol = document.getElementById("estadoRol");
  const estadoPerfil = document.getElementById("estadoPerfil");
  const ultimoAcceso = document.getElementById("ultimoAcceso");

  if (estadoRol) estadoRol.textContent = rol ? rol.toUpperCase() : "SIN ROL";
  if (estadoPerfil) estadoPerfil.textContent = "Activo";
  if (ultimoAcceso) ultimoAcceso.textContent = "Hoy";

  renderCentroOperaciones(rol);
});