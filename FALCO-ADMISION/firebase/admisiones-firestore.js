/* =========================================================
   FALCO Admisión™
   Admisiones Firestore™ v1.0

   Responsabilidad:
   - Crear admisiones
   - Evitar duplicaciones
   - Actualizar admisiones
   - Consultar admisiones por ID
========================================================= */

import {
  db
} from "./firebase-config.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const COLLECTION_NAME =
  "admisiones";


/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizarValor(value) {

  if (value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {

    return value.map(
      normalizarValor
    );

  }

  if (
    value !== null &&
    typeof value === "object"
  ) {

    const result = {};

    Object.entries(value).forEach(
      ([key, item]) => {

        result[key] =
          normalizarValor(item);

      }
    );

    return result;

  }

  return value;

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function validarAdmision(payload) {

  if (
    !payload ||
    typeof payload !== "object"
  ) {

    throw new Error(
      "La admisión no contiene datos válidos."
    );

  }

  if (!payload.id) {

    throw new Error(
      "La admisión no posee un identificador."
    );

  }

  if (
    payload.tipoUsuario !== "persona" &&
    payload.tipoUsuario !== "profesional"
  ) {

    throw new Error(
      "El tipo de usuario de la admisión no es válido."
    );

  }

}


/* =========================================================
   PREPARACIÓN DEL DOCUMENTO
========================================================= */

function prepararAdmision(payload) {

  const normalized =
    normalizarValor(payload);

  return {

    ...normalized,

    id: payload.id,

    tipoUsuario:
      payload.tipoUsuario,

    estado:
      "completada",

    origen:
      "FALCO Admisión™",

    canal:
      "web",

    versionFormulario:
      payload.versionFormulario ||
      "1.0",

    revision: {

      estado:
        "sin_revisar",

      revisado:
        false,

      revisadoPor:
        null,

      revisadoEn:
        null,

      observaciones:
        null

    },

    actualizadoEn:
      serverTimestamp()

  };

}


/* =========================================================
   GUARDAR ADMISIÓN
   Creación pública sin lectura previa
========================================================= */

async function guardarAdmision(
  payload
) {

  validarAdmision(payload);

  const admissionRef =
    doc(
      db,
      COLLECTION_NAME,
      payload.id
    );

  const admissionData = {
    ...prepararAdmision(payload),

    creadoEn:
      serverTimestamp(),

    sincronizadoEn:
      serverTimestamp()
  };

  /*
   * No usamos getDoc().
   *
   * El formulario público puede crear la admisión,
   * pero no debe poder leer documentos de Firestore.
   */

  await setDoc(
    admissionRef,
    admissionData
  );

  return {
    id: payload.id,
    created: true,
    updated: false
  };

}


/* =========================================================
   OBTENER ADMISIÓN
========================================================= */

async function obtenerAdmision(
  admissionId
) {

  if (!admissionId) {

    throw new Error(
      "Debe indicarse el ID de la admisión."
    );

  }

  const admissionRef =
    doc(
      db,
      COLLECTION_NAME,
      admissionId
    );

  const snapshot =
    await getDoc(admissionRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };

}


/* =========================================================
   ACTUALIZAR ESTADO
========================================================= */

async function actualizarEstadoAdmision(
  admissionId,
  estado
) {

  if (!admissionId) {

    throw new Error(
      "Debe indicarse el ID de la admisión."
    );

  }

  if (!estado) {

    throw new Error(
      "Debe indicarse el nuevo estado."
    );

  }

  const admissionRef =
    doc(
      db,
      COLLECTION_NAME,
      admissionId
    );

  await updateDoc(
    admissionRef,
    {
      estado,
      actualizadoEn:
        serverTimestamp()
    }
  );

}


/* =========================================================
   MARCAR COMO REVISADA
========================================================= */

async function marcarAdmisionRevisada(
  admissionId,
  {
    revisadoPor = null,
    observaciones = null
  } = {}
) {

  if (!admissionId) {

    throw new Error(
      "Debe indicarse el ID de la admisión."
    );

  }

  const admissionRef =
    doc(
      db,
      COLLECTION_NAME,
      admissionId
    );

  await updateDoc(
    admissionRef,
    {
      "revision.estado":
        "revisada",

      "revision.revisado":
        true,

      "revision.revisadoPor":
        revisadoPor,

      "revision.revisadoEn":
        serverTimestamp(),

      "revision.observaciones":
        observaciones,

      actualizadoEn:
        serverTimestamp()
    }
  );

}


/* =========================================================
   EXPORTACIONES
========================================================= */

export {
  guardarAdmision,
  obtenerAdmision,
  actualizarEstadoAdmision,
  marcarAdmisionRevisada
};


console.log(
  "FALCO Admisión™ Firestore v1.0 Ready"
);