import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const tabla = document.getElementById("tablaTurnos");
const estadoListado = document.getElementById("estadoListadoTurnos");
const buscar = document.getElementById("buscarTurno");
const filtroEstado = document.getElementById("filtroEstadoTurno");
const estadoFormulario = document.getElementById("estadoFormularioTurno");

let turnos = [];

function etiquetaEstado(estado) {
  const mapa = {
    solicitado: "Solicitado",
    pendiente_pago: "Pendiente de pago",
    pago_informado: "Pago informado",
    confirmado: "Confirmado",
    realizado: "Realizado",
    cancelado: "Cancelado"
  };

  return mapa[estado] || estado || "—";
}

function filtrarTurnos() {
  const texto = buscar.value.toLowerCase().trim();
  const estado = filtroEstado.value;

  return turnos.filter(turno => {
    const coincideEstado = !estado || turno.estado === estado;

    const contenido = `
      ${turno.nombre || ""}
      ${turno.email || ""}
      ${turno.telefono || ""}
      ${turno.motivo || ""}
      ${turno.modalidad || ""}
    `.toLowerCase();

    const coincideTexto = !texto || contenido.includes(texto);

    return coincideEstado && coincideTexto;
  });
}

function limpiarFormularioTurno() {
  document.getElementById("nombreTurno").value = "";
  document.getElementById("emailTurno").value = "";
  document.getElementById("telefonoTurno").value = "";
  document.getElementById("fechaTurno").value = "";
  document.getElementById("horaTurno").value = "";
  document.getElementById("modalidadTurno").value = "";
  document.getElementById("motivoTurno").value = "";
  document.getElementById("montoTurno").value = "";
  document.getElementById("medioPagoTurno").value = "";
  document.getElementById("estadoTurno").value = "solicitado";
  document.getElementById("observacionesTurno").value = "";
}

window.crearTurno = async function () {
  const nombre = document.getElementById("nombreTurno").value.trim();
  const email = document.getElementById("emailTurno").value.trim();
  const telefono = document.getElementById("telefonoTurno").value.trim();



const fecha = document.getElementById("fechaTurno").value;


  const hora = document.getElementById("horaTurno").value;
  const modalidad = document.getElementById("modalidadTurno").value;
  const motivo = document.getElementById("motivoTurno").value;
  const monto = document.getElementById("montoTurno").value;
  const medioPago = document.getElementById("medioPagoTurno").value;

const alias = document.getElementById("aliasTurno").value;
const cbu = document.getElementById("cbuTurno").value;

  const estado = document.getElementById("estadoTurno").value;
  const observaciones = document.getElementById("observacionesTurno").value.trim();

  if (!nombre || !email || !telefono || !fecha || !hora || !modalidad || !motivo) {
    alert("Debe completar nombre, email, teléfono, fecha, hora, modalidad y motivo.");
    return;
  }

  const fechaSeleccionada = new Date(fecha + "T00:00:00");
const dia = fechaSeleccionada.getDay();

if (dia === 0 || dia === 6) {
  alert("Solo se pueden asignar turnos de lunes a viernes.");
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

      alias,
      cbu,

      estado,
      observaciones,
      creadoEn: serverTimestamp()
    });

    estadoFormulario.textContent = "Turno guardado correctamente.";
    estadoFormulario.className = "post-estado ok";

    limpiarFormularioTurno();

  } catch (error) {
    console.error(error);
    estadoFormulario.textContent = "No se pudo guardar el turno.";
    estadoFormulario.className = "post-estado error";
  }
};

function renderTurnos() {
  tabla.innerHTML = "";

  const filtrados = filtrarTurnos();

  estadoListado.textContent = `Turnos encontrados: ${filtrados.length}`;

  if (filtrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="13">No hay turnos para mostrar.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(turno => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${turno.fecha || "—"}</td>
      <td>${turno.hora || "—"}</td>
      <td>${turno.nombre || "—"}</td>
      <td>${turno.email || "—"}</td>
      <td>${turno.telefono || "—"}</td>
      <td>${turno.modalidad || "—"}</td>
      <td>${turno.motivo || "—"}</td>
      <td>${turno.monto ? "$" + turno.monto : "—"}</td>
      <td>${turno.medioPago || "—"}</td>

      <td>
        <select onchange="actualizarEstadoTurno('${turno.id}', this.value)">
          <option value="solicitado" ${turno.estado === "solicitado" ? "selected" : ""}>Solicitado</option>
          <option value="pendiente_pago" ${turno.estado === "pendiente_pago" ? "selected" : ""}>Pendiente de pago</option>
          <option value="pago_informado" ${turno.estado === "pago_informado" ? "selected" : ""}>Pago informado</option>
          <option value="confirmado" ${turno.estado === "confirmado" ? "selected" : ""}>Confirmado</option>
          <option value="realizado" ${turno.estado === "realizado" ? "selected" : ""}>Realizado</option>
          <option value="cancelado" ${turno.estado === "cancelado" ? "selected" : ""}>Cancelado</option>
        </select>
      </td>

      <td>${turno.observaciones || "—"}</td>

      <td>
        <button onclick="actualizarPagoTurno('${turno.id}')">
          Pago informado
        </button>
      </td>

      <td>
        <button onclick="eliminarTurno('${turno.id}')">
          Eliminar
        </button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

window.actualizarEstadoTurno = async function (id, estado) {
  try {
    await updateDoc(doc(db, "turnos", id), {
      estado,
      actualizadoEn: serverTimestamp()
    });
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar el estado.");
  }
};

window.actualizarPagoTurno = async function (id) {
  try {
    await updateDoc(doc(db, "turnos", id), {
      estado: "pago_informado",
      actualizadoEn: serverTimestamp()
    });
  } catch (error) {
    console.error(error);
    alert("No se pudo actualizar el pago.");
  }
};

window.eliminarTurno = async function (id) {
  if (!confirm("¿Eliminar este turno?")) return;

  try {
    await deleteDoc(doc(db, "turnos", id));
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el turno.");
  }
};

window.limpiarFiltrosTurnos = function () {
  buscar.value = "";
  filtroEstado.value = "";
  renderTurnos();
};

buscar.addEventListener("input", renderTurnos);
filtroEstado.addEventListener("change", renderTurnos);

const q = query(
  collection(db, "turnos"),
  orderBy("fecha", "asc")
);

onSnapshot(q, (snapshot) => {
  turnos = [];

  snapshot.forEach(docSnap => {
    turnos.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  renderTurnos();
});