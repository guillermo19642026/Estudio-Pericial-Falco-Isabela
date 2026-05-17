import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const estado = document.getElementById("archivo_estado");
const estadoArchivo = document.getElementById("estadoArchivo");
const tabla = document.getElementById("tablaArchivo");

const buscarArchivo = document.getElementById("buscarArchivo");
const filtroCategoriaArchivo = document.getElementById("filtroCategoriaArchivo");

let archivo = [];

window.guardarArchivo = async function(event) {
  event.preventDefault();

  const datos = {
    titulo: document.getElementById("archivo_titulo").value.trim(),
    categoria: document.getElementById("archivo_categoria").value,
    fecha: document.getElementById("archivo_fecha").value,
    link: document.getElementById("archivo_link").value.trim(),
    descripcion: document.getElementById("archivo_descripcion").value.trim(),
    creadoEn: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "archivo_pericial"), datos);

    estado.textContent = "Material guardado correctamente.";
    estado.className = "post-estado ok";

    event.target.reset();

  } catch (error) {
    console.error(error);
    estado.textContent = "No se pudo guardar el material.";
    estado.className = "post-estado error";
  }
};

function formatearFecha(timestamp, fechaManual) {
  if (fechaManual) return fechaManual;
  if (!timestamp || !timestamp.toDate) return "—";

  return timestamp.toDate().toLocaleDateString("es-AR");
}

function obtenerArchivoFiltrado() {
  const texto = buscarArchivo.value.toLowerCase().trim();
  const categoria = filtroCategoriaArchivo.value.toLowerCase();

  return archivo.filter(item => {
    const titulo = (item.titulo || "").toLowerCase();
    const cat = (item.categoria || "").toLowerCase();
    const desc = (item.descripcion || "").toLowerCase();

    const coincideTexto =
      !texto ||
      titulo.includes(texto) ||
      cat.includes(texto) ||
      desc.includes(texto);

    const coincideCategoria =
      !categoria ||
      cat === categoria;

    return coincideTexto && coincideCategoria;
  });
}


function obtenerIconoCategoria(categoria){

  switch(categoria){

    case "Escritos":
      return "⚖️";

    case "Modelos":
      return "📄";

    case "Jurisprudencia":
      return "📘";

    case "Causas":
      return "🏛️";

    case "Informes":
      return "🧠";

    case "Notas técnicas":
      return "📝";

    case "Material académico":
      return "📚";

    default:
      return "📁";
  }

}

function obtenerClaseCategoria(categoria){

  switch(categoria){

    case "Escritos":
      return "cat-escritos";

    case "Modelos":
      return "cat-modelos";

    case "Jurisprudencia":
      return "cat-jurisprudencia";

    case "Causas":
      return "cat-causas";

    case "Informes":
      return "cat-informes";

    case "Notas técnicas":
      return "cat-notas";

    case "Material académico":
      return "cat-academico";

    default:
      return "";
  }

}


function renderArchivo() {
  tabla.innerHTML = "";

  const filtrados = obtenerArchivoFiltrado();

  estadoArchivo.textContent = `Materiales encontrados: ${filtrados.length}`;

  if (filtrados.length === 0) {
    tabla.innerHTML = `
      <tr>
        <td colspan="6">No hay materiales para los filtros seleccionados.</td>
      </tr>
    `;
    return;
  }

  filtrados.forEach(item => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${formatearFecha(item.creadoEn, item.fecha)}</td>
      <td>${item.titulo || "—"}</td>
      
      <td>
  <span class="badge-categoria ${obtenerClaseCategoria(item.categoria)}">
    ${obtenerIconoCategoria(item.categoria)}
    ${item.categoria || "Sin categoría"}
  </span>
</td>

      <td>${item.descripcion || "—"}</td>
      <td>${item.link ? `<a href="${item.link}" target="_blank">Abrir</a>` : "—"}</td>
      <td>
        <button onclick="eliminarArchivo('${item.id}')">Eliminar</button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

window.eliminarArchivo = async function(id) {
  if (!confirm("¿Eliminar este material del archivo?")) return;

  try {
    await deleteDoc(doc(db, "archivo_pericial", id));
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el material.");
  }
};

window.limpiarFiltrosArchivo = function() {
  buscarArchivo.value = "";
  filtroCategoriaArchivo.value = "";
  renderArchivo();
};

buscarArchivo.addEventListener("input", renderArchivo);
filtroCategoriaArchivo.addEventListener("change", renderArchivo);

const q = query(
  collection(db, "archivo_pericial"),
  orderBy("creadoEn", "desc")
);

onSnapshot(q, (snapshot) => {
  archivo = [];

  snapshot.forEach(docSnap => {
    archivo.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  renderArchivo();
});