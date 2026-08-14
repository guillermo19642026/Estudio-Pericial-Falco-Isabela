"use strict";

import {
  db
} from "../../firebase-config.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const CAUSAS_COLLECTION =
  "gestion_causas";

const PERICIAS_COLLECTION =
  "gestion_pericias";

const COBRADAS_COLLECTION =
  "gestion_cobradas";


/* =========================================================
   PRUEBA DE CONEXIÓN
========================================================= */

const probarConexion = async () => {
  const testId =
    "falco-prueba-conexion";

  const testRef =
    doc(
      db,
      CAUSAS_COLLECTION,
      testId
    );

  try {
    await setDoc(
      testRef,
      {
        sistema: "FALCO",
        modulo: "Gestion de Causas",
        prueba: true,
        fechaPrueba:
          serverTimestamp()
      }
    );

    const snapshot =
      await getDoc(testRef);

    if (!snapshot.exists()) {
      throw new Error(
        "El documento de prueba no pudo recuperarse."
      );
    }

    console.log(
      "Gestión de Causas FALCO® Firestore OK",
      snapshot.data()
    );

    await deleteDoc(testRef);

    console.log(
      "Documento de prueba eliminado correctamente."
    );

    return true;

  } catch (error) {
    console.error(
      "Gestión de Causas FALCO® Error Firestore:",
      error
    );

    return false;
  }
};


/* =========================================================
   API DE CAUSAS
========================================================= */

const getCases = async () => {
  const snapshot =
    await getDocs(
      collection(
        db,
        CAUSAS_COLLECTION
      )
    );

  return snapshot.docs.map(
    (documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data()
    })
  );
};


const getCaseById = async (
  id
) => {
  if (!id) {
    return null;
  }

  const reference =
    doc(
      db,
      CAUSAS_COLLECTION,
      String(id)
    );

  const snapshot =
    await getDoc(reference);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};


/* =========================================================
   MIGRACIÓN DESDE LOCALSTORAGE
========================================================= */

const migrateFromLocalStorage = async () => {
  const localCases =
    window.GestionCausasData
      ?.getCases?.() || [];

  if (!localCases.length) {
    console.warn(
      "No hay causas locales para migrar."
    );

    return {
      total: 0,
      migradas: 0,
      errores: 0
    };
  }

  let migradas = 0;
  let errores = 0;

  for (const causa of localCases) {
    if (!causa?.id) {
      errores += 1;
      continue;
    }

    const {
      documentos = [],
      ...causaPrincipal
    } = causa;

    try {
      const causaRef =
        doc(
          db,
          CAUSAS_COLLECTION,
          String(causa.id)
        );

      await setDoc(
        causaRef,
        {
          ...causaPrincipal,

          documentosCount:
            Array.isArray(documentos)
              ? documentos.length
              : 0,

          migradaDesdeLocalStorage:
            true,

          fechaMigracion:
            serverTimestamp()
        },
        {
          merge: true
        }
      );

      if (
        Array.isArray(documentos) &&
        documentos.length
      ) {
        for (
          const documento
          of documentos
        ) {
          const documentoId =
            documento?.id ||
            window.crypto
              ?.randomUUID?.() ||
            `documento-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`;

          const documentoRef =
            doc(
              db,
              CAUSAS_COLLECTION,
              String(causa.id),
              "documentos",
              String(documentoId)
            );

          await setDoc(
            documentoRef,
            {
              ...documento,
              id: documentoId
            },
            {
              merge: true
            }
          );
        }
      }

      migradas += 1;

      console.log(
        `Migrada ${migradas}/${localCases.length}:`,
        causa.caratula ||
        causa.id
      );

    } catch (error) {
      errores += 1;

      console.error(
        "Error migrando causa:",
        causa.id,
        causa.caratula,
        error
      );
    }
  }

  const resultado = {
    total:
      localCases.length,

    migradas,

    errores
  };

  console.log(
    "Migración FALCO® finalizada",
    resultado
  );

  return resultado;
};


/* =========================================================
   PERICIAS
========================================================= */

const savePericia = async (
  pericia
) => {
  if (!pericia?.id) {
    throw new Error(
      "La pericia no posee un identificador válido."
    );
  }

  const reference =
    doc(
      db,
      PERICIAS_COLLECTION,
      String(pericia.id)
    );

  const normalized = {
    ...pericia,

    danioPsiquico:
      pericia.danioPsiquico ||
      "sin-determinar",

    tipoRegistro:
      "pericia",

    fechaActualizacion:
      new Date().toISOString()
  };

  await setDoc(
    reference,
    normalized,
    {
      merge: true
    }
  );

  return normalized;
};


const getPericias = async () => {
  const snapshot =
    await getDocs(
      collection(
        db,
        PERICIAS_COLLECTION
      )
    );

  return snapshot.docs.map(
    (documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data()
    })
  );
};


/* =========================================================
   CAUSAS COBRADAS
========================================================= */

const saveCobrada = async (
  causa
) => {
  if (!causa?.id) {
    throw new Error(
      "La causa cobrada no posee un identificador válido."
    );
  }

  const reference =
    doc(
      db,
      COBRADAS_COLLECTION,
      String(causa.id)
    );

  const normalized = {
    ...causa,

    danioPsiquico:
      causa.danioPsiquico ||
      "sin-determinar",

    tipoRegistro:
      "cobrada",

    estadoGeneral:
      "Cobrada",

    activa:
      false,

    situacion:
      "finalizada",

    fechaActualizacion:
      new Date().toISOString()
  };

  await setDoc(
    reference,
    normalized,
    {
      merge: true
    }
  );

  return normalized;
};


const getCobradas = async () => {
  const snapshot =
    await getDocs(
      collection(
        db,
        COBRADAS_COLLECTION
      )
    );

  return snapshot.docs.map(
    (documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data()
    })
  );
};


/* =========================================================
   EXPORTACIÓN GLOBAL
========================================================= */

window.GestionCausasFirestore = {
  probarConexion,

  getCases,
  getCaseById,

  migrateFromLocalStorage,

  savePericia,
  getPericias,

  saveCobrada,
  getCobradas
};


console.log(
  "Gestión de Causas FALCO® Firestore Bridge Ready",
  {
    causas:
      CAUSAS_COLLECTION,

    pericias:
      PERICIAS_COLLECTION,

    cobradas:
      COBRADAS_COLLECTION
  }
);