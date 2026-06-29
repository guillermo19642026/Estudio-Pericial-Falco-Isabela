/**
 * ==========================================================
 * FALCO CMS®
 * Servicio Firestore
 * ==========================================================
 */

import { db } from "../../firebase.js";

import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COLECCION_CONTENIDOS = "cms_contenidos";

/**
 * Crear contenido nuevo
 */
export async function crearContenido(contenido) {

    const referencia = await addDoc(
        collection(db, COLECCION_CONTENIDOS),
        {
            ...contenido,
            creadoEn: serverTimestamp(),
            actualizadoEn: serverTimestamp()
        }
    );

    return referencia.id;
}

/**
 * Actualizar contenido existente
 */
export async function actualizarContenido(id, datos) {

    const referencia = doc(db, COLECCION_CONTENIDOS, id);

    await updateDoc(referencia, {
        ...datos,
        actualizadoEn: serverTimestamp()
    });

    return true;
}

/**
 * Obtener un contenido por ID
 */
export async function obtenerContenido(id) {

    const referencia = doc(db, COLECCION_CONTENIDOS, id);
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

/**
 * Listar contenidos activos
 */
export async function listarContenidos() {

    const consulta = query(
        collection(db, COLECCION_CONTENIDOS),
        orderBy("actualizadoEn", "desc")
    );

    const snapshot = await getDocs(consulta);

    return snapshot.docs
    .map(documento => ({
        ...documento.data(),
        id: documento.id
    }))
    .filter(contenido => contenido.eliminado !== true);
}

/**
 * Publicar contenido
 */
export async function publicarContenido(id) {

    const referencia = doc(db, COLECCION_CONTENIDOS, id);

    await updateDoc(referencia, {
        estado: "publicado",
        publicado: true,
        visible: true,
        publicadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp()
    });

    return true;
}

/**
 * Archivar contenido
 */
export async function archivarContenido(id) {

    const referencia = doc(db, COLECCION_CONTENIDOS, id);

    await updateDoc(referencia, {
        estado: "archivado",
        visible: false,
        actualizadoEn: serverTimestamp()
    });

    return true;
}

/**
 * Enviar a papelera
 */
export async function enviarAPapelera(id) {

    const referencia = doc(db, COLECCION_CONTENIDOS, id);

    await updateDoc(referencia, {
        eliminado: true,
        eliminadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp()
    });

    return true;
}