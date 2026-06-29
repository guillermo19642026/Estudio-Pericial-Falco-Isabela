import Contenido from "./models/contenido.model.js";

import {
    crearContenido
} from "./services/contenido.service.js";


document.addEventListener("DOMContentLoaded", () => {

    if (window.lucide) {
        lucide.createIcons();
    }

    const titulo = document.getElementById("contenidoTitulo");
    const descripcion = document.getElementById("contenidoDescripcion");
    const tipo = document.getElementById("contenidoTipo");
    const modulo = document.getElementById("contenidoModulo");
    const fuero = document.getElementById("contenidoFuero");
    const etiquetas = document.getElementById("contenidoEtiquetas");
    const acceso = document.getElementById("contenidoAcceso");
    const estado = document.getElementById("contenidoEstado");
    const archivoUrl = document.getElementById("contenidoArchivoUrl");
    const videoUrl = document.getElementById("contenidoVideoUrl");
    const notas = document.getElementById("contenidoNotas");

    const previewTitulo = document.getElementById("previewTitulo");
    const previewDescripcion = document.getElementById("previewDescripcion");
    const previewTipo = document.getElementById("previewTipo");
    const previewAcceso = document.getElementById("previewAcceso");
    const previewEstado = document.getElementById("previewEstado");
    const estadoVisual = document.getElementById("estadoVisual");

    const btnGuardar = document.getElementById("btnGuardarContenido");
    const btnVistaPrevia = document.getElementById("btnVistaPrevia");

    const slug = document.getElementById("contenidoSlug");

    const camposDinamicos = document.getElementById("camposDinamicos");

    function textoBonito(valor) {
        if (!valor) return "";
        return valor
            .replaceAll("-", " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }

function generarSlug(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}




    function obtenerContenido() {
        return {
            titulo: titulo.value.trim(),
            descripcion: descripcion.value.trim(),
            tipo: tipo.value,
            modulo: modulo.value,
            fuero: fuero.value,
            etiquetas: etiquetas.value
                .split(",")
                .map(etiqueta => etiqueta.trim())
                .filter(Boolean),
            acceso: acceso.value,
            estado: estado.value,
            archivoUrl: archivoUrl.value.trim(),
            videoUrl: videoUrl.value.trim(),
            notas: notas.value.trim(),
            fechaPublicacion: document.getElementById("contenidoFechaPublicacion")?.value || "",
            fechaVencimiento: document.getElementById("contenidoFechaVencimiento")?.value || "",
            programado: document.getElementById("contenidoProgramado")?.value || "no",
            slug: generarSlug(titulo.value),
            metaTitulo: document.getElementById("contenidoMetaTitulo")?.value.trim() || "",
            metaDescripcion: document.getElementById("contenidoMetaDescripcion")?.value.trim() || "",
            actualizadoEn: new Date().toISOString(),
            multimedia: {
            imagen: document.getElementById("contenidoImagen")?.files[0]?.name || "",
            pdf: document.getElementById("contenidoPdf")?.files[0]?.name || "",
            video: document.getElementById("contenidoVideo")?.files[0]?.name || "",
            audio: document.getElementById("contenidoAudio")?.files[0]?.name || ""
},
        };
    }


    function renderCamposDinamicos() {
    if (!camposDinamicos) return;

    const valorTipo = tipo.value;

    let html = "";

    if (valorTipo === "escrito") {
        html = `
        <div class="falco-card falco-editor-card">
            <h2>Campos específicos · Escrito judicial</h2>

            <label>Tipo de escrito</label>
            <input data-campo="tipoEscrito" class="falco-input" type="text" placeholder="Ej: Aceptación de cargo, impugnación, pedido de explicaciones">

            <label>Instancia</label>
        <input data-campo="instancia" class="falco-input" type="text" placeholder="Ej: Primera instancia, Cámara, etapa pericial">

            <label>Normativa relacionada</label>
<textarea data-campo="normativa" class="falco-textarea" rows="4" placeholder="Normativa, jurisprudencia o referencias relevantes"></textarea>        </div>
        `;
    }

    if (valorTipo === "biblioteca") {
        html = `
        <div class="falco-card falco-editor-card">
            <h2>Campos específicos · Biblioteca</h2>

            <label>Autor</label>
<input data-campo="autor" class="falco-input" type="text" placeholder="Autor o institución">

            <label>Año de publicación</label>
<input data-campo="anioPublicacion" class="falco-input" type="number" placeholder="2026">

            <label>Tipo de recurso</label>
<input data-campo="tipoRecurso" class="falco-input" type="text" placeholder="Manual, guía, modelo, artículo">        </div>
        `;
    }

    if (valorTipo === "curso") {
        html = `
        <div class="falco-card falco-editor-card">
            <h2>Campos específicos · Curso</h2>

            <label>Instructor</label>
<input data-campo="instructor" class="falco-input" type="text" placeholder="Nombre del instructor">

            <label>Duración</label>
<input data-campo="duracion" class="falco-input" type="text" placeholder="Ej: 8 encuentros · 16 horas">

            <label>Certificado</label>
            <select data-campo="certificado" class="falco-select-dark">
    <option>Incluye certificado</option>
    <option>No incluye certificado</option>
</select>
        </div>
        `;
    }

    if (valorTipo === "test") {
        html = `
        <div class="falco-card falco-editor-card">
            <h2>Campos específicos · Test psicométrico</h2>

            <label>Cantidad de ítems</label>
<input data-campo="cantidadItems" class="falco-input" type="number" placeholder="Ej: 21">

            <label>Tipo de corrección</label>
            <select data-campo="tipoCorreccion" class="falco-select-dark">
    <option>Corrección automática</option>
    <option>Corrección manual</option>
</select>

            <label>Salida del resultado</label>
<input data-campo="salidaResultado" class="falco-input" type="text" placeholder="Ej: PDF, gráfico, escala">        </div>
        `;
    }

    if (valorTipo === "video") {
        html = `
        <div class="falco-card falco-editor-card">
            <h2>Campos específicos · Video</h2>

            <label>Plataforma</label>
<input data-campo="plataforma" class="falco-input" type="text" placeholder="YouTube, Vimeo, archivo propio">

            <label>Duración</label>
<input data-campo="duracion" class="falco-input" type="text" placeholder="Ej: 12:35">

            <label>Miniatura</label>
<input data-campo="duracion" class="falco-input" type="text" placeholder="Ej: 12:35">
        </div>
        `;
    }

    camposDinamicos.innerHTML = html;
}




    function actualizarPreview() {
        const contenido = obtenerContenido();

        previewTitulo.textContent = contenido.titulo || "Sin título";

        previewDescripcion.textContent =
            contenido.descripcion || "La descripción del contenido aparecerá aquí.";

        previewTipo.textContent =
            contenido.tipo ? textoBonito(contenido.tipo) : "Sin tipo";

        previewAcceso.textContent =
            textoBonito(contenido.acceso || "premium");

        previewEstado.textContent =
            textoBonito(contenido.estado || "borrador");

        estadoVisual.textContent =
            textoBonito(contenido.estado || "borrador");

             if (slug && titulo.value.trim()) {
        slug.value = generarSlug(titulo.value);
    }

}
    

    function validarContenido(contenido) {
        if (!contenido.titulo) {
            alert("Debe ingresar un título para el contenido.");
            titulo.focus();
            return false;
        }

        if (!contenido.tipo) {
            alert("Debe seleccionar un tipo de contenido.");
            tipo.focus();
            return false;
        }

        return true;
    }

    function guardarContenido() {
        const contenido = obtenerContenido();

        if (!validarContenido(contenido)) return;

       const contenidoLocal = new Contenido({
    ...contenido,
    idTemporal: `contenido_${Date.now()}`,
    creadoEn: new Date().toISOString()
});

        localStorage.setItem(
            "falco_cms_v2_contenido_borrador",
            JSON.stringify(contenidoLocal)
        );

        alert("Contenido guardado como borrador local. Luego lo conectamos con Firestore.");

        console.log("Contenido preparado:", contenidoLocal);
    }

    function mostrarVistaPrevia() {
        actualizarPreview();
        alert("Vista previa actualizada.");
    }

    const campos = [
        titulo,
        descripcion,
        tipo,
        modulo,
        fuero,
        etiquetas,
        acceso,
        estado,
        archivoUrl,
        videoUrl,
        notas
    ];

    campos.forEach(campo => {
        if (!campo) return;
        campo.addEventListener("input", actualizarPreview);
        campo.addEventListener("change", actualizarPreview);
    });

    btnGuardar?.addEventListener("click", guardarContenido);
    btnVistaPrevia?.addEventListener("click", mostrarVistaPrevia);
    tipo?.addEventListener("change", renderCamposDinamicos);

    actualizarPreview();
    renderCamposDinamicos();

});