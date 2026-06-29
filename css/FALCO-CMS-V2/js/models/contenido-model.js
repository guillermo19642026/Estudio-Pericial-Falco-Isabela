/**
 * ==========================================================
 * FALCO CMS®
 * Modelo Maestro de Contenidos
 * ==========================================================
 */

export default class Contenido {

    constructor(datos = {}) {

        const ahora = new Date().toISOString();

        /*=========================================
        IDENTIFICACIÓN
        =========================================*/

        this.id = datos.id || "";
        this.uuid = datos.uuid || crypto.randomUUID();

        this.version = datos.version ?? 1;
        this.orden = datos.orden ?? 0;

        /*=========================================
        INFORMACIÓN GENERAL
        =========================================*/

        this.titulo = datos.titulo || "";
        this.subtitulo = datos.subtitulo || "";

        this.descripcion = datos.descripcion || "";
        this.resumen = datos.resumen || "";

        this.contenidoHtml = datos.contenidoHtml || "";
        this.contenidoTexto = datos.contenidoTexto || "";

        /*=========================================
        CLASIFICACIÓN
        =========================================*/

        this.tipo = datos.tipo || "";

        this.modulo = datos.modulo || "";
        this.categoria = datos.categoria || "";
        this.subcategoria = datos.subcategoria || "";

        this.etiquetas = datos.etiquetas || [];
        this.coleccion = datos.coleccion || [];

        this.camposEspecificos = datos.camposEspecificos || {};
        this.programado = datos.programado || "no";

        /*=========================================
        CONTEXTO PROFESIONAL
        =========================================*/

        this.fuero = datos.fuero || "";

        this.autor = datos.autor || "";
        this.coautor = datos.coautor || "";

        this.especialidad = datos.especialidad || "";

        /*=========================================
        PUBLICACIÓN
        =========================================*/

        this.estado = datos.estado || "borrador";

        this.visible = datos.visible ?? true;
        this.destacado = datos.destacado ?? false;

        /*=========================================
        MEMBRESÍAS
        =========================================*/

        this.acceso = datos.acceso || "premium";

        this.planes = datos.planes || [
            "premium"
        ];

        /*=========================================
        ARCHIVOS
        =========================================*/

        this.archivoPrincipal = datos.archivoPrincipal || null;

        this.adjuntos = datos.adjuntos || [];

        /*=========================================
        MULTIMEDIA
        =========================================*/

        this.portada = datos.portada || "";

        this.galeria = datos.galeria || [];

        this.video = datos.video || "";

        this.audio = datos.audio || "";

        /*=========================================
        SEO
        =========================================*/

        this.slug = datos.slug || "";

        this.metaTitulo = datos.metaTitulo || "";

        this.metaDescripcion = datos.metaDescripcion || "";

        this.palabrasClave = datos.palabrasClave || [];

        /*=========================================
        ESTADÍSTICAS
        =========================================*/

        this.estadisticas = datos.estadisticas || {

            vistas:0,

            descargas:0,

            favoritos:0,

            compartidos:0

        };

        /*=========================================
        RELACIONES
        =========================================*/

        this.relacionados = datos.relacionados || [];

        /*=========================================
        AUTOMATIZACIONES
        =========================================*/

        this.fechaPublicacion = datos.fechaPublicacion || null;

        this.fechaVencimiento = datos.fechaVencimiento || null;

        this.programado = datos.programado || "no";

        /*=========================================
        CONTROL
        =========================================*/

        this.idioma = datos.idioma || "es";

        this.eliminado = datos.eliminado ?? false;

        this.eliminadoEn = datos.eliminadoEn || null;

        /*=========================================
        AUDITORÍA
        =========================================*/

        this.creadoPor = datos.creadoPor || "";

        this.actualizadoPor = datos.actualizadoPor || "";

        this.creadoEn = datos.creadoEn || ahora;

        this.actualizadoEn = ahora;

        this.publicadoEn = datos.publicadoEn || null;

        /*=========================================
        OBSERVACIONES
        =========================================*/

        this.notasInternas = datos.notasInternas || "";

        this.observaciones = datos.observaciones || "";
    }

}