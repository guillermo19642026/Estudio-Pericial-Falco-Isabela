console.log("cms-preview.js cargado");

export function actualizarVistaPreviaRecurso() {
  const titulo = document.getElementById("recursoTitulo")?.value.trim();
  const descripcion = document.getElementById("recursoDescripcion")?.value.trim();
  const modulo = document.getElementById("recursoModulo")?.value;
  const tags = document.getElementById("recursoTags")?.value.trim();
  const activo = document.getElementById("recursoActivo")?.value === "true";
  const destacado = document.getElementById("recursoDestacado")?.value === "true";
  const acceso = document.getElementById("recursoNivelAcceso")?.value;

  document.getElementById("previewTitulo").textContent =
    titulo || "Título del recurso";

  document.getElementById("previewDescripcion").textContent =
    descripcion || "La descripción del recurso aparecerá aquí mientras completás el formulario.";

  document.getElementById("previewModulo").textContent =
    modulo || "Sin módulo";

  document.getElementById("previewEstado").textContent =
    activo ? "Activo / visible" : "Oculto";

  document.getElementById("previewDestacado").textContent =
    destacado ? "⭐ Destacado" : "No destacado";

  document.getElementById("previewAcceso").textContent =
    acceso || "Biblioteca";

  const previewTags = document.getElementById("previewTags");

  if (previewTags) {
    const lista = tags
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    previewTags.innerHTML =
      lista.length
        ? lista.map(t => `<span>${t}</span>`).join("")
        : "<span>Sin etiquetas</span>";
  }
}