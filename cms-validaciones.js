console.log("cms-validaciones.js cargado");

function abrirEditorVisual() {
  document.getElementById("nuevo-recurso")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function urlValida(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function validarFormularioRecurso(recurso) {
  const campoTitulo = document.getElementById("recursoTitulo");
  const campoDescripcion = document.getElementById("recursoDescripcion");
  const campoModulo = document.getElementById("recursoModulo");
  const campoTipoContenido = document.getElementById("recursoTipoContenido");
  const campoFuero = document.getElementById("recursoFuero");
  const campoTipoEscrito = document.getElementById("recursoTipoEscrito");
  const campoNivelAcceso = document.getElementById("recursoNivelAcceso");
  const campoUrlPdf = document.getElementById("recursoUrlPdf");
  const campoUrlWord = document.getElementById("recursoUrlWord");
  const campoUrlVideo = document.getElementById("recursoUrlVideo");
  const campoTags = document.getElementById("recursoTags");

  if (!recurso.titulo) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe ingresar el título del recurso.", campo: campoTitulo };
  }

  if (!recurso.descripcion) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe ingresar la descripción del recurso.", campo: campoDescripcion };
  }

  if (!recurso.modulo) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe seleccionar el módulo del recurso.", campo: campoModulo };
  }

  if (!recurso.tipoContenido) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe seleccionar el tipo de contenido.", campo: campoTipoContenido };
  }

  if (!recurso.fuero) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe seleccionar el fuero o categoría principal.", campo: campoFuero };
  }

  if (recurso.tipoContenido === "escrito" && !recurso.tipoEscrito) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe seleccionar el tipo de escrito judicial.", campo: campoTipoEscrito };
  }

  if (!recurso.nivelAcceso) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe seleccionar el nivel de acceso.", campo: campoNivelAcceso };
  }

  if (!recurso.urlPdf && !recurso.urlWord && !recurso.urlVideo) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe ingresar al menos una URL: PDF, Word o Video.", campo: campoUrlPdf };
  }

  if (recurso.urlPdf && !urlValida(recurso.urlPdf)) {
    abrirEditorVisual();
    return { ok: false, mensaje: "La URL del PDF no es válida. Debe comenzar con http:// o https://.", campo: campoUrlPdf };
  }

  if (recurso.urlWord && !urlValida(recurso.urlWord)) {
    abrirEditorVisual();
    return { ok: false, mensaje: "La URL alternativa no es válida. Debe comenzar con http:// o https://.", campo: campoUrlWord };
  }

  if (recurso.urlVideo && !urlValida(recurso.urlVideo)) {
    abrirEditorVisual();
    return { ok: false, mensaje: "La URL del video no es válida. Debe comenzar con http:// o https://.", campo: campoUrlVideo };
  }

  if (!recurso.tags) {
    abrirEditorVisual();
    return { ok: false, mensaje: "Debe ingresar palabras clave para facilitar la búsqueda.", campo: campoTags };
  }

  return { ok: true };
}