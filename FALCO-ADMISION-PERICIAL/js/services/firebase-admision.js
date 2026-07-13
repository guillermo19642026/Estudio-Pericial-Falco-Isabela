/* =========================================================
   FALCO® ADMISIÓN PERICIAL
   FIREBASE ENGINE v1.0
========================================================= */

import { auth, db } from "../../../firebase-config.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const COLECCION_ADMISIONES =
  "falco_admisiones";


/* =========================================================
   ESPERAR USUARIO AUTENTICADO
========================================================= */

function esperarUsuario() {
  return new Promise((resolve, reject) => {
    const cancelar =
      onAuthStateChanged(
        auth,
        usuario => {
          cancelar();

          if (!usuario) {
            reject(
              new Error(
                "No hay un usuario autenticado."
              )
            );

            return;
          }

          resolve(usuario);
        },
        error => {
          cancelar();
          reject(error);
        }
      );
  });
}


/* =========================================================
   REFERENCIA ÚNICA DE LA ADMISIÓN
========================================================= */

function obtenerReferencia(usuarioUID) {
  return doc(
    db,
    COLECCION_ADMISIONES,
    usuarioUID
  );
}


/* =========================================================
   GUARDAR BORRADOR
========================================================= */

async function guardarAdmision(estadoFicha) {
  const usuario =
    await esperarUsuario();

  const referencia =
    obtenerReferencia(usuario.uid);

  await setDoc(
    referencia,
    {
      tipo:
        "ficha_integral_pericial_v2",

      estado:
        "en_proceso",

      usuarioUID:
        usuario.uid,

      usuarioEmail:
        usuario.email || "",

      moduloActual:
        estadoFicha.moduloActual ?? 0,

      completados:
        Array.isArray(
          estadoFicha.completados
        )
          ? estadoFicha.completados
          : [],

      datos:
        estadoFicha.datos || {},

      ultimaActualizacion:
        serverTimestamp()
    },
    {
      merge: true
    }
  );

  return true;
}


/* =========================================================
   CARGAR ADMISIÓN
========================================================= */

async function cargarAdmision() {
  const usuario =
    await esperarUsuario();

  const referencia =
    obtenerReferencia(usuario.uid);

  const documento =
    await getDoc(referencia);

  if (!documento.exists()) {
    return null;
  }

  return {
    id: documento.id,
    ...documento.data()
  };
}


/* =========================================================
   FINALIZAR ADMISIÓN
========================================================= */

async function finalizarAdmision(estadoFicha) {
  const usuario =
    await esperarUsuario();

  const referencia =
    obtenerReferencia(usuario.uid);

  await setDoc(
    referencia,
    {
      tipo:
        "ficha_integral_pericial_v2",

      estado:
        "finalizada",

      usuarioUID:
        usuario.uid,

      usuarioEmail:
        usuario.email || "",

      moduloActual:
        estadoFicha.moduloActual ?? 0,

      completados:
        Array.isArray(
          estadoFicha.completados
        )
          ? estadoFicha.completados
          : [],

      datos:
        estadoFicha.datos || {},

      finalizadaEn:
        serverTimestamp(),

      ultimaActualizacion:
        serverTimestamp()
    },
    {
      merge: true
    }
  );

  return true;
}


/* =========================================================
   API PÚBLICA
========================================================= */

window.FalcoFirebaseAdmision =
  Object.freeze({
    guardar:
      guardarAdmision,

    cargar:
      cargarAdmision,

    finalizar:
      finalizarAdmision
  });


console.log(
  "FALCO Firebase Admisión Engine™ v1.0 Ready"
);