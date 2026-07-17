/* =========================================================
   FALCO EXPEDIENTE PROFESIONAL™
   FIREBASE LOADER v1.1
   Expediente + documentación pericial
========================================================= */

import {
  auth,
  db
} from "../../../firebase-config.js";


import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";


function esperarAutenticacion() {

  return new Promise(
    (resolve, reject) => {

      const detener =
        onAuthStateChanged(
          auth,

          usuario => {
            detener();
            resolve(usuario);
          },

          error => {
            detener();
            reject(error);
          }
        );

    }
  );

}


/* =========================================================
   OBTENER DOCUMENTACIÓN DEL PERICIADO
========================================================= */

async function obtenerDocumentacion(
  usuarioUID
) {

  if (!usuarioUID) {

    console.warn(
      "El expediente no contiene usuarioUID."
    );

    return null;

  }


  /*
    PRIMER INTENTO

    Busca directamente:

    documentos_periciados/{usuarioUID}

    Este es el caso del expediente de prueba actual.
  */

  const referenciaDirecta =
    doc(
      db,
      "documentos_periciados",
      usuarioUID
    );


  const snapshotDirecto =
    await getDoc(
      referenciaDirecta
    );


  if (
    snapshotDirecto.exists()
  ) {

    console.log(
      "Documentación encontrada por ID directo:",
      snapshotDirecto.id
    );


    return {
      id: snapshotDirecto.id,
      ...snapshotDirecto.data()
    };

  }


  /*
    SEGUNDO INTENTO

    Algunos documentos antiguos pueden tener un ID
    automático distinto del usuarioUID.

    En ese caso se busca por el campo usuarioUID.
  */

  const consulta =
    query(
      collection(
        db,
        "documentos_periciados"
      ),

      where(
        "usuarioUID",
        "==",
        usuarioUID
      ),

      limit(1)
    );


  const resultado =
    await getDocs(
      consulta
    );


  if (
    resultado.empty
  ) {

    console.warn(
      "No se encontró documentación para el usuario:",
      usuarioUID
    );

    return null;

  }


  const documento =
    resultado.docs[0];


  console.log(
    "Documentación encontrada por usuarioUID:",
    documento.id
  );


  return {
    id: documento.id,
    ...documento.data()
  };

}


/* =========================================================
   LOADER PÚBLICO
========================================================= */

window.FalcoExpedienteLoader = {

  async obtenerExpediente(
    expedienteId
  ) {

    const usuario =
      await esperarAutenticacion();


    if (!usuario) {

      throw new Error(
        "No hay una sesión profesional iniciada."
      );

    }


    const correo =
      usuario.email
        ?.trim()
        .toLowerCase();


    if (
      correo !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      throw new Error(
        "La cuenta actual no tiene permiso para consultar expedientes."
      );

    }


    /* =========================
       CARGAR EXPEDIENTE
    ========================= */

    const referenciaExpediente =
      doc(
        db,
        "falco_admisiones",
        expedienteId
      );


    const snapshotExpediente =
      await getDoc(
        referenciaExpediente
      );


    if (
      !snapshotExpediente.exists()
    ) {

      throw new Error(
        "El expediente solicitado no existe."
      );

    }


    const expediente = {
      id: snapshotExpediente.id,
      ...snapshotExpediente.data()
    };


    /* =========================
       CARGAR DOCUMENTACIÓN
    ========================= */

    try {

      expediente.documentos =
        await obtenerDocumentacion(
          expediente.usuarioUID
        );

    } catch (error) {

      console.error(
        "No se pudo cargar la documentación:",
        error
      );


      /*
        El expediente sigue funcionando aunque
        falle la carga documental.
      */

      expediente.documentos =
        null;

    }


    console.log(
      "Expediente profesional enriquecido:",
      expediente
    );


    return expediente;

  }

};


console.log(
  "FALCO Expediente Loader™ v1.1 Ready"
);