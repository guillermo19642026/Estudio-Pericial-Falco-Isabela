import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.solicitarTurno = async function () {
  const nombre = document.getElementById("nombreTurno").value.trim();
  const email = document.getElementById("emailTurno").value.trim();
  const telefono = document.getElementById("telefonoTurno").value.trim();
  const fecha = document.getElementById("fechaTurno").value;
  const hora = document.getElementById("horaTurno").value;
  const modalidad = document.getElementById("modalidadTurno").value;
  const motivo = document.getElementById("motivoTurno").value.trim();
  const monto = document.getElementById("montoTurno").value;
  const medioPago = document.getElementById("medioPagoTurno").value;
  const estado = document.getElementById("estadoTurno");

  if (!nombre || !email || !telefono || !fecha || !hora || !modalidad || !motivo || !medioPago) {
    alert("Debe completar todos los campos obligatorios.");
    return;
  }

  const fechaSeleccionada = new Date(fecha + "T00:00:00");
  const dia = fechaSeleccionada.getDay();

  if (dia === 0 || dia === 6) {
    alert("Solo se pueden solicitar turnos de lunes a viernes.");
    return;
  }

  try {
    await addDoc(collection(db, "turnos"), {
      nombre,
      email,
      telefono,
      fecha,
      hora,
      modalidad,
      motivo,
      monto,
      medioPago,
      alias: "FUENTE.PUPILA.GRANO",
      cbu: "0140043403512952341827",
      estado: "solicitado",
      origen: "formulario_publico",
      observaciones: "",
      creadoEn: serverTimestamp()
    });

    estado.textContent =
      "Solicitud enviada correctamente. El turno quedará confirmado una vez informado o acreditado el pago.";

    estado.className = "post-estado ok";

  } catch (error) {
    console.error(error);

    estado.textContent =
      "No se pudo enviar la solicitud. Intentá nuevamente.";

    estado.className = "post-estado error";
  }
};