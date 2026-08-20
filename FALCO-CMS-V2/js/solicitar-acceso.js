import { db } from "../../firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const formSolicitud =
  document.getElementById(
    "formSolicitudAcceso"
  );

const estadoSolicitud =
  document.getElementById(
    "estadoSolicitud"
  );

const botonEnviar =
  formSolicitud?.querySelector(
    'button[type="submit"]'
  );


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const COLECCION =
  "solicitudes_acceso";


const nombresAreas = {

  profesional:
    "Profesional / Perito",

  evaluaciones:
    "Evaluaciones",

  biblioteca:
    "Biblioteca FALCO®",

  formacion:
    "Formación / Campus",

  escuela:
    "Escuela para Padres",

  otro:
    "Otro"

};


/* =========================================================
   MENSAJES
========================================================= */

function mostrarEstado(
  mensaje,
  tipo
) {

  if (!estadoSolicitud) {
    return;
  }


  estadoSolicitud.textContent =
    mensaje;


  estadoSolicitud.classList.remove(
    "is-success",
    "is-error"
  );


  if (tipo === "success") {

    estadoSolicitud.classList.add(
      "is-success"
    );

  }


  if (tipo === "error") {

    estadoSolicitud.classList.add(
      "is-error"
    );

  }

}


/* =========================================================
   ENVÍO
========================================================= */

async function enviarSolicitud(
  event
) {

  event.preventDefault();


  if (!formSolicitud) {
    return;
  }


  const nombre =
    document
      .getElementById("nombre")
      ?.value
      .trim() || "";


  const email =
    document
      .getElementById("email")
      ?.value
      .trim()
      .toLowerCase() || "";


  const whatsapp =
    document
      .getElementById("whatsapp")
      ?.value
      .trim() || "";


  const area =
    document
      .getElementById("area")
      ?.value || "";


  const mensaje =
    document
      .getElementById("mensaje")
      ?.value
      .trim() || "";


  /* -----------------------------------------
     VALIDACIÓN
  ----------------------------------------- */

  if (
    !nombre ||
    !email ||
    !whatsapp ||
    !area
  ) {

    mostrarEstado(
      "Complete los campos obligatorios antes de enviar la solicitud.",
      "error"
    );

    return;

  }


  /* -----------------------------------------
     ESTADO DEL BOTÓN
  ----------------------------------------- */

  if (botonEnviar) {

    botonEnviar.disabled =
      true;

    botonEnviar.innerHTML = `
      <span>
        Enviando solicitud...
      </span>

      <span aria-hidden="true">
        …
      </span>
    `;

  }


  mostrarEstado(
    "",
    ""
  );


  try {

    /* ---------------------------------------
       GUARDAR EN FIRESTORE
    --------------------------------------- */

    await addDoc(
      collection(
        db,
        COLECCION
      ),
      {

        nombre,

        email,

        whatsapp,

        area,

        areaNombre:
          nombresAreas[area] ||
          area,

        mensaje,

        estado:
          "pendiente",

        origen:
          "solicitar-acceso",

        creadoEn:
          serverTimestamp(),

        actualizadoEn:
          serverTimestamp()

      }
    );


    /* ---------------------------------------
       CONFIRMACIÓN
    --------------------------------------- */

    mostrarEstado(
      "Solicitud registrada correctamente. El Estudio revisará la información y se comunicará con usted.",
      "success"
    );


    formSolicitud.reset();


  } catch (error) {

    console.error(
      "FALCO® · Error al registrar solicitud de acceso:",
      error
    );


    mostrarEstado(
      "No fue posible enviar la solicitud. Intente nuevamente en unos minutos.",
      "error"
    );

  } finally {

    if (botonEnviar) {

      botonEnviar.disabled =
        false;

      botonEnviar.innerHTML = `
        <span>
          Solicitar acceso
        </span>

        <span aria-hidden="true">
          →
        </span>
      `;

    }

  }

}


/* =========================================================
   EVENTO
========================================================= */

if (formSolicitud) {

  formSolicitud.addEventListener(
    "submit",
    enviarSolicitud
  );

}