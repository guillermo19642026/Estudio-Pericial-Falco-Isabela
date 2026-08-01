/*
=========================================
FALCO®
Portal Institucional
KPIs reales desde Firestore
Versión 1.0
=========================================

Colecciones utilizadas:
- usuarios
- contenidos
- resultados_tests
- escuela_participantes

Este archivo:
- No modifica documentos.
- No crea colecciones.
- Solo consulta cantidades.
=========================================
*/

import { db } from "../../../firebase-config.js";

import {
  collection,
  getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



const COLECCIONES_KPI = {
  usuarios: "usuarios",
  biblioteca: "contenidos",
  evaluaciones: "resultados_tests",
  participantes: "escuela_participantes",
  postulaciones: "postulaciones",
   mesaEntrada: "mesa_entrada",
  documentos: "documentos_periciados",
  turnos: "turnos"

};


async function contarDocumentos(nombreColeccion) {
  try {
    const referencia = collection(db, nombreColeccion);
    const resultado = await getCountFromServer(referencia);

    return resultado.data().count;
  } catch (error) {
    console.error(
      `Portal FALCO®: no fue posible contar ${nombreColeccion}.`,
      error
    );

    return null;
  }
}


function actualizarIndicador(idElemento, valor) {
  const elemento = document.getElementById(idElemento);

  if (!elemento) {
    return;
  }

  elemento.textContent =
    typeof valor === "number"
      ? valor.toLocaleString("es-AR")
      : "—";
}


function mostrarCarga() {
  actualizarIndicador("kpiUsuarios", null);
  actualizarIndicador("kpiBiblioteca", null);
  actualizarIndicador("kpiEvaluaciones", null);
  actualizarIndicador("kpiCursos", null);
  actualizarIndicador("kpiPostulaciones", null);
  actualizarIndicador("kpiMesaEntrada", null);
  actualizarIndicador("kpiDocumentos", null);
actualizarIndicador("kpiTurnos", null);
}


export async function cargarKPIsFirestore(rol) {
  if (String(rol || "").toLowerCase() !== "admin") {
    return;
  }

  mostrarCarga();

const [
  totalUsuarios,
  totalContenidos,
  totalEvaluaciones,
  totalParticipantes,
  totalPostulaciones,
  totalMesaEntrada,
  totalDocumentos,
  totalTurnos
] = await Promise.all([
  contarDocumentos(COLECCIONES_KPI.usuarios),
  contarDocumentos(COLECCIONES_KPI.biblioteca),
  contarDocumentos(COLECCIONES_KPI.evaluaciones),
  contarDocumentos(COLECCIONES_KPI.participantes),
  contarDocumentos(COLECCIONES_KPI.postulaciones),
  contarDocumentos(COLECCIONES_KPI.mesaEntrada),
  contarDocumentos(COLECCIONES_KPI.documentos),
  contarDocumentos(COLECCIONES_KPI.turnos)
]);

  actualizarIndicador("kpiUsuarios", totalUsuarios);
  actualizarIndicador("kpiBiblioteca", totalContenidos);
  actualizarIndicador("kpiEvaluaciones", totalEvaluaciones);
  actualizarIndicador("kpiCursos", totalParticipantes);

  actualizarIndicador(
  "kpiPostulaciones",
  totalPostulaciones
);

actualizarIndicador(
  "kpiMesaEntrada",
  totalMesaEntrada
);

actualizarIndicador("kpiDocumentos", totalDocumentos);
actualizarIndicador("kpiTurnos", totalTurnos);

 console.info("Portal FALCO®: KPIs reales actualizados.", {
  usuarios: totalUsuarios,
  contenidos: totalContenidos,
  evaluaciones: totalEvaluaciones,
  participantes: totalParticipantes,
  postulaciones: totalPostulaciones,
  mesaEntrada: totalMesaEntrada,
  documentos: totalDocumentos,
  turnos: totalTurnos
});
}