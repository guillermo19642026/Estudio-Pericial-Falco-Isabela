/* =========================================================
   FALCO IDENTITY™
   FIREBASE ADAPTER v1.1
========================================================= */

import {
  auth,
  db
} from "../../../firebase-config.js";


import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


function esperarSesionFirebase() {
  return new Promise(
    (resolve, reject) => {

      const detenerObservador =
        onAuthStateChanged(
          auth,

          usuario => {
            detenerObservador();
            resolve(usuario);
          },

          error => {
            detenerObservador();
            reject(error);
          }
        );
    }
  );
}


function normalizarRol(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}


async function obtenerPerfilUsuario(usuario) {
  const referencia =
    doc(
      db,
      "usuarios",
      usuario.uid
    );

  const snapshot =
    await getDoc(referencia);

  return snapshot.exists()
    ? snapshot.data()
    : null;
}


window.FalcoIdentityFirebase = {

  async resolverIdentidad() {
    const usuario =
      await esperarSesionFirebase();

    if (!usuario) {
      return {
        autenticado: false,
        usuario: null,
        perfil: null,
        rol: "invitado"
      };
    }

    const email =
      usuario.email
        ?.trim()
        .toLowerCase() || "";

    const perfil =
      await obtenerPerfilUsuario(
        usuario
      );

    let rol =
      normalizarRol(
        perfil?.rol
      );

    if (
      email ===
      ADMIN_EMAIL.toLowerCase()
    ) {
      rol = "admin";
    }

    if (!rol) {
      rol = "sin_rol";
    }

    return {
      autenticado: true,

      usuario: {
        uid: usuario.uid,
        email: usuario.email || "",
        emailVerificado:
          Boolean(
            usuario.emailVerified
          )
      },

      perfil,

      rol
    };
  },


  async cerrarSesion() {
    await signOut(auth);

    return true;
  }

};


console.log(
  "FALCO Identity Firebase™ v1.1 Ready"
);