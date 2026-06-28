import { db } from "./firebase-config.js";

import { actualizarDashboard } from "./cms-dashboard.js";

import { renderizarContenidos } from "./cms-explorer.js";

import { inicializarEditorCMS } from "./cms-editor.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("Motor de Contenidos Falco cargado");



const listaRecursosCMS = document.getElementById("listaRecursosCMS");
const buscarRecurso = document.getElementById("buscarRecurso");
const filtroModulo = document.getElementById("filtroModulo");



let contenidos = [];


buscarRecurso?.addEventListener("input", actualizarExplorador);
filtroModulo?.addEventListener("change", actualizarExplorador);





function actualizarExplorador() {
  renderizarContenidos({
    contenidos,
    listaRecursosCMS,
    buscarRecurso,
    filtroModulo
  });
}



inicializarEditorCMS({
  db,
  getContenidos: () => contenidos,
  cargarContenidos
});

cargarContenidos();


async function cargarContenidos() {
  if (!listaRecursosCMS) return;

  listaRecursosCMS.innerHTML = `
    <p class="bloque-tests-nota">Cargando recursos...</p>
  `;

  try {
    const q = query(
      collection(db, "contenidos"),
      orderBy("creadoEn", "desc")
    );

    const snapshot = await getDocs(q);

    contenidos = [];

    snapshot.forEach((documento) => {
      contenidos.push({
        id: documento.id,
        ...documento.data()
      });
    });


actualizarDashboard(contenidos);

    actualizarExplorador();

  } catch (error) {
    console.error("Error al cargar contenidos:", error);

    listaRecursosCMS.innerHTML = `
      <p class="bloque-tests-nota">
        No se pudieron cargar los recursos.
      </p>
    `;
  }
}





window.verRecurso = function(url) {
  if (!url || url === "undefined" || url === "null") {
    alert("Este recurso no tiene URL cargada.");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    alert("La URL cargada no es válida. Debe comenzar con https://");
    return;
  }

  window.location.href = url;
};

window.toggleActivo = async function(id, estadoActual) {
  try {
    await updateDoc(doc(db, "contenidos", id), {
      activo: !estadoActual,
      actualizadoEn: serverTimestamp()
    });

    await cargarContenidos();

  } catch (error) {
    console.error(error);
    alert("No se pudo cambiar el estado del recurso.");
  }
};

window.archivarContenido = async function(id) {
  const confirmar = confirm(
    "¿Seguro que querés archivar este recurso? No se eliminará de Firestore."
  );

  if (!confirmar) return;

  try {
    await updateDoc(doc(db, "contenidos", id), {
      archivado: true,
      activo: false,
      actualizadoEn: serverTimestamp()
    });

    await cargarContenidos();

  } catch (error) {
    console.error(error);
    alert("No se pudo archivar el recurso.");
  }
};


