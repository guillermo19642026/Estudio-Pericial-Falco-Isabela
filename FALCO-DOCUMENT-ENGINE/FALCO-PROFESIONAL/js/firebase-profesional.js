/* =========================================================
   FALCO® PROFESIONAL
   FIREBASE CONNECTOR v1.1
========================================================= */

import {
  auth,
  db
} from "../../../firebase-config.js";


import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


function esperarAutenticacion() {

  return new Promise((resolve, reject) => {

    const cancelarObservador =
      onAuthStateChanged(
        auth,

        usuario => {

          cancelarObservador();

          if (!usuario) {

            reject(
              new Error(
                "No hay una sesión profesional iniciada."
              )
            );

            return;
          }

          resolve(usuario);

        },

        error => {

          cancelarObservador();
          reject(error);

        }
      );

  });

}


window.FalcoProfesionalFirebase = {


  async obtenerPericiados() {

    const usuario =
      await esperarAutenticacion();


    console.log(
      "Sesión profesional:",
      {
        uid: usuario.uid,
        email: usuario.email
      }
    );


    if (
      usuario.email
        ?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      throw new Error(
        `La cuenta ${usuario.email || "sin correo"} no tiene acceso administrativo.`
      );

    }


    const resultado = [];


    const snapshot =
      await getDocs(
        collection(
          db,
          "falco_admisiones"
        )
      );


    snapshot.forEach(documento => {

      resultado.push({

        id: documento.id,

        ...documento.data()

      });

    });


    return resultado;

  }

};


console.log(
  "FALCO Profesional Firebase™ v1.1 Ready"
);