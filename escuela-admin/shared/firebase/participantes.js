import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const COLLECTION = "escuela_participantes";

/* ==========================================
   Obtener todos
========================================== */

export async function obtenerTodos() {

  const snapshot = await getDocs(collection(db, COLLECTION));

  return snapshot.docs.map(docItem => ({
    id: docItem.id,
    ...docItem.data()
  }));

}

/* ==========================================
   Obtener uno
========================================== */

export async function obtenerPorId(id) {

  const referencia = doc(db, COLLECTION, id);

  const documento = await getDoc(referencia);

  if (!documento.exists()) return null;

  return {
    id: documento.id,
    ...documento.data()
  };

}

/* ==========================================
   Crear participante
========================================== */

export async function crear(datos) {

  return await addDoc(
    collection(db, COLLECTION),
    {

      // ==========================
      // DATOS PERSONALES
      // ==========================

      nombre: datos.nombre || "",
      apellido: datos.apellido || "",
      dni: datos.dni || "",
      correo: datos.correo || "",
      telefono: datos.telefono || "",

      // ==========================
      // ESTADO
      // ==========================

      estado: "activo",

      profesor: null,

      // ==========================
      // PROGRESO
      // ==========================

      progreso: {
        porcentaje: 0,
        moduloActual: 1,
        ultimoAcceso: null
      },

      // ==========================
      // ENCUENTROS
      // ==========================

      encuentros: {
        1: { completado: false, fecha: null },
        2: { completado: false, fecha: null },
        3: { completado: false, fecha: null },
        4: { completado: false, fecha: null },
        5: { completado: false, fecha: null },
        6: { completado: false, fecha: null },
        7: { completado: false, fecha: null },
        8: { completado: false, fecha: null }
      },

      // ==========================
      // CERTIFICADO
      // ==========================

      certificado: {
        emitido: false,
        fecha: null,
        url: null
      },

      // ==========================
      // ENCUESTA FINAL
      // ==========================

      encuestaFinal: {
        completada: false,
        fecha: null
      },

      // ==========================
      // FECHAS
      // ==========================

      creado: serverTimestamp(),
      actualizado: serverTimestamp()

    }
  );

}

/* ==========================================
   Actualizar participante
========================================== */

export async function actualizar(id, datos) {

  await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...datos,
      actualizado: serverTimestamp()
    }
  );

}

/* ==========================================
   Eliminar participante
========================================== */

export async function eliminar(id) {

  await deleteDoc(
    doc(db, COLLECTION, id)
  );

}