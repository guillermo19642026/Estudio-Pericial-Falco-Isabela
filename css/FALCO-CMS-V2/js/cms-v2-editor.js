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

    function textoBonito(valor) {
        if (!valor) return "";
        return valor
            .replaceAll("-", " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
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
            actualizadoEn: new Date().toISOString()
        };
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

        const contenidoLocal = {
            ...contenido,
            idTemporal: `contenido_${Date.now()}`,
            creadoEn: new Date().toISOString()
        };

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

    actualizarPreview();

});