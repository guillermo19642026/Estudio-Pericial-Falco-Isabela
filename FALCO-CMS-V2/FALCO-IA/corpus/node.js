/* =========================
   FALCO CORPUS NODE™
========================= */

class FalcoCorpusNode {
  constructor(data = {}) {
    this.id = data.id || "";
    this.titulo = data.titulo || "Sin título";
    this.tipo = data.tipo || "sin_tipo";
    this.categoria = data.categoria || "Sin categoría";
    this.subcategoria = data.subcategoria || "";
    this.nivelAcceso = data.nivelAcceso || "interno";
    this.estado = data.estado || "borrador";
    this.descripcion = data.descripcion || "";
    this.relaciones = Array.isArray(data.relaciones) ? data.relaciones : [];
    this.raw = data;
  }

  getTitulo() {
    return this.titulo;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getRelaciones() {
    return this.relaciones;
  }

  esPublico() {
    return this.nivelAcceso === "publico";
  }

  esProfesional() {
    return this.nivelAcceso === "profesional";
  }

  esInterno() {
    return this.nivelAcceso === "interno";
  }

  estaValidado() {
    return this.estado === "validado";
  }

  puedeUsarseEnIA() {
    return this.estaValidado();
  }
}

window.FalcoCorpusNode = FalcoCorpusNode;