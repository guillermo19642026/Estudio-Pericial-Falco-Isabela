/* =========================================================
   FALCO® Viewer Cleanup™ v1.0
   Limpieza inteligente del Expediente Digital

   Funciones:
   - Oculta campos sin información real
   - Conserva valores válidos como "No", "Sí" y "0"
   - Protege enlaces, imágenes y documentación
   - Oculta grupos que quedan completamente vacíos
   - Marca capítulos sin información visible
   - Permite restaurar todos los elementos

   No modifica:
   - Firestore
   - expediente-loader.js
   - expediente-core.js
   - viewer-profesional.js
   - viewer-layout.js
   - viewer-groups.js
   - viewer-navigation.js
========================================================= */

const FalcoViewerCleanup = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    camposOcultos: 0,

    gruposOcultos: 0,


    /* =====================================================
       VALORES CONSIDERADOS VACÍOS
    ===================================================== */

    valoresVacios: new Set([

        "",
        "-",
        "—",
        "--",
        "–",
        "...",
        "null",
        "undefined",
        "sin dato",
        "sin datos",
        "sin información",
        "sin informacion",
        "no informado",
        "no informada",
        "no informa",
        "no especificado",
        "no especificada",
        "n/a",
        "na"

    ]),


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        console.info(
            `FALCO Viewer Cleanup™ v${this.version} Ready`
        );

        this.esperarViewer();

    },


    /* =====================================================
       ESPERAR CAPAS ANTERIORES
    ===================================================== */

    esperarViewer() {

        this.intervalo =
            window.setInterval(() => {

                this.intentos++;

                const expediente =
                    document.getElementById(
                        "expediente"
                    );

                const groupsActivo =
                    expediente?.classList.contains(
                        "falco-groups-activo"
                    );

                const bloques =
                    expediente?.querySelectorAll(
                        ".falco-bloque-dato"
                    );

                if (
                    expediente &&
                    groupsActivo &&
                    bloques?.length
                ) {

                    window.clearInterval(
                        this.intervalo
                    );

                    this.aplicar();

                    return;

                }

                if (
                    this.intentos >=
                    this.maxIntentos
                ) {

                    window.clearInterval(
                        this.intervalo
                    );

                    console.warn(
                        "FALCO Viewer Cleanup™ no encontró el expediente preparado."
                    );

                }

            }, 250);

    },


    /* =====================================================
       APLICAR LIMPIEZA
    ===================================================== */

    aplicar() {

        this.camposOcultos = 0;
        this.gruposOcultos = 0;

        const expediente =
            document.getElementById(
                "expediente"
            );

        if (!expediente) {
            return;
        }

        const bloques =
            Array.from(
                expediente.querySelectorAll(
                    ".falco-bloque-dato"
                )
            );

        bloques.forEach(
            bloque => {

                this.procesarBloque(
                    bloque
                );

            }
        );

        this.procesarGrupos();
        this.procesarCapitulos();
        this.marcarExpediente();

        console.info(
            "FALCO Viewer Cleanup™ aplicado correctamente.",
            {
                camposOcultos:
                    this.camposOcultos,

                gruposOcultos:
                    this.gruposOcultos
            }
        );

    },


    /* =====================================================
       PROCESAR BLOQUE
    ===================================================== */

    procesarBloque(bloque) {

        if (!bloque) {
            return;
        }


        /*
 * Si el Core identificó explícitamente el valor como vacío,
 * el bloque completo debe ocultarse.
 */

const marcadorVacio =
    bloque.querySelector(
        ".falco-valor-dato > .campo-vacio," +
        ".falco-valor-dato > .falco-campo-vacio," +
        ".campo-valor > .campo-vacio," +
        ".campo-valor > .falco-campo-vacio"
    );

if (marcadorVacio) {

    bloque.hidden = true;

    bloque.classList.add(
        "falco-campo-vacio"
    );

    bloque.classList.remove(
        "falco-campo-con-informacion"
    );

    bloque.dataset.cleanupHidden =
        "true";

    this.camposOcultos++;

    return;

}

        /*
         * No se ocultan elementos que hayan sido protegidos
         * explícitamente por otra capa.
         */

        if (
            bloque.dataset.cleanupIgnore ===
            "true"
        ) {
            return;
        }

        /*
         * La documentación y los adjuntos se conservan.
         */

        if (
            this.esBloqueDocumental(
                bloque
            )
        ) {
            return;
        }

        const valor =
            this.obtenerValorDelBloque(
                bloque
            );

        if (
            this.valorTieneInformacion(
                valor,
                bloque
            )
        ) {

            bloque.classList.add(
                "falco-campo-con-informacion"
            );

            bloque.classList.remove(
                "falco-campo-vacio"
            );

            return;

        }

        bloque.hidden = true;

        bloque.classList.add(
            "falco-campo-vacio"
        );

        bloque.classList.remove(
            "falco-campo-con-informacion"
        );

        bloque.dataset.cleanupHidden =
            "true";

        this.camposOcultos++;

    },


/* =====================================================
   OBTENER VALOR REAL DEL BLOQUE
===================================================== */

obtenerValorDelBloque(bloque) {

    const selectoresValor = [

        ".falco-valor-dato",
        ".valor-dato",
        ".campo-valor",
        ".dato-valor",
        "[data-field-value]",
        "dd"

    ];

    for (
        const selector of
        selectoresValor
    ) {

        const elemento =
            bloque.querySelector(
                selector
            );

        if (elemento) {

            /*
             * Se trabaja sobre una copia para no modificar
             * el contenido original renderizado.
             */

            const clon =
                elemento.cloneNode(true);

            /*
             * Se eliminan mensajes internos utilizados por
             * el Core para representar campos vacíos.
             */

            clon
                .querySelectorAll(
                    [
                        ".campo-vacio",
                        ".falco-campo-vacio",
                        "[data-empty-field]",
                        "[data-campo-vacio]"
                    ].join(",")
                )
                .forEach(
                    mensaje =>
                        mensaje.remove()
                );

            return clon.textContent ?? "";

        }

    }

    /*
     * Respaldo para estructuras donde la etiqueta y el
     * valor se encuentran en el mismo contenedor.
     */

    const clon =
        bloque.cloneNode(true);

    const elementosNoValor = [

        ".falco-etiqueta-dato",
        ".etiqueta-dato",
        ".campo-etiqueta",
        ".dato-etiqueta",
        ".campo-vacio",
        ".falco-campo-vacio",
        "[data-empty-field]",
        "[data-campo-vacio]",
        "dt",
        "label"

    ];

    elementosNoValor.forEach(
        selector => {

            clon
                .querySelectorAll(
                    selector
                )
                .forEach(
                    elemento =>
                        elemento.remove()
                );

        }
    );

    return clon.textContent ?? "";

},


    /* =====================================================
       DETERMINAR SI HAY INFORMACIÓN
    ===================================================== */

    valorTieneInformacion(
        valor,
        bloque
    ) {

        /*
         * Los archivos, imágenes, enlaces y controles con
         * contenido son considerados información válida.
         */

        if (
            this.contieneContenidoEspecial(
                bloque
            )
        ) {
            return true;
        }

        const texto =
            this.normalizarValor(
                valor
            );

        if (!texto) {
            return false;
        }

        /*
         * "No", "Sí", "0", fechas y números se conservan.
         */

        if (
            texto === "no" ||
            texto === "sí" ||
            texto === "si" ||
            texto === "0"
        ) {
            return true;
        }

        return !this.valoresVacios.has(
            texto
        );

    },


    /* =====================================================
       CONTENIDO ESPECIAL
    ===================================================== */

    contieneContenidoEspecial(bloque) {

        const imagen =
            bloque.querySelector(
                "img[src]"
            );

        if (imagen) {
            return true;
        }

        const enlace =
            bloque.querySelector(
                "a[href]"
            );

        if (
            enlace &&
            enlace.getAttribute("href") &&
            enlace.getAttribute("href") !== "#"
        ) {
            return true;
        }

        const video =
            bloque.querySelector(
                "video[src], audio[src], iframe[src]"
            );

        if (video) {
            return true;
        }

        const archivo =
            bloque.querySelector(
                "[data-file-url], [data-document-url], [data-archivo-url]"
            );

        if (archivo) {
            return true;
        }

        const inputMarcado =
            bloque.querySelector(
                'input[type="checkbox"]:checked,' +
                'input[type="radio"]:checked'
            );

        if (inputMarcado) {
            return true;
        }

        const inputConValor =
            Array.from(
                bloque.querySelectorAll(
                    "input, textarea, select"
                )
            )
            .some(
                elemento => {

                    const valor =
                        String(
                            elemento.value ?? ""
                        ).trim();

                    return valor !== "";

                }
            );

        return inputConValor;

    },


    /* =====================================================
       PROTEGER DOCUMENTACIÓN
    ===================================================== */

    esBloqueDocumental(bloque) {

        if (
            bloque.closest(
                ".falco-documentacion-layout"
            )
        ) {
            return true;
        }

        if (
            bloque.closest(
                ".falco-tarjeta-documental"
            )
        ) {
            return true;
        }

        if (
            bloque.closest(
                ".documentacion-adjunta"
            )
        ) {
            return true;
        }

        if (
            bloque.closest(
                '[id*="documentacion"]'
            ) &&
            this.contieneContenidoEspecial(
                bloque
            )
        ) {
            return true;
        }

        return false;

    },


    /* =====================================================
       PROCESAR GRUPOS
    ===================================================== */

    procesarGrupos() {

        const grupos =
            document.querySelectorAll(
                ".falco-grupo-datos"
            );

        grupos.forEach(
            grupo => {

                const campos =
                    Array.from(
                        grupo.querySelectorAll(
                            ".falco-bloque-dato"
                        )
                    );

                const camposVisibles =
                    campos.filter(
                        campo =>
                            !campo.hidden &&
                            !campo.classList.contains(
                                "falco-campo-vacio"
                            )
                    );

                const contenidoEspecial =
                    this.contieneContenidoEspecial(
                        grupo
                    );

                if (
                    campos.length &&
                    !camposVisibles.length &&
                    !contenidoEspecial
                ) {

                    grupo.hidden = true;

                    grupo.classList.add(
                        "falco-grupo-vacio"
                    );

                    grupo.dataset.cleanupHidden =
                        "true";

                    this.gruposOcultos++;

                    return;

                }

                grupo.classList.remove(
                    "falco-grupo-vacio"
                );

            }
        );

    },


    /* =====================================================
       PROCESAR CAPÍTULOS
    ===================================================== */

    procesarCapitulos() {

        const expediente =
            document.getElementById(
                "expediente"
            );

        const capitulos =
            expediente?.querySelectorAll(
                '[id^="capitulo-"]'
            );

        capitulos?.forEach(
            capitulo => {

                const bloques =
                    Array.from(
                        capitulo.querySelectorAll(
                            ".falco-bloque-dato"
                        )
                    );

                const visibles =
                    bloques.filter(
                        bloque =>
                            !bloque.hidden &&
                            bloque.offsetParent !== null
                    );

                const gruposVisibles =
                    Array.from(
                        capitulo.querySelectorAll(
                            ".falco-grupo-datos"
                        )
                    )
                    .filter(
                        grupo =>
                            !grupo.hidden
                    );

                const tieneDocumentos =
                    this.contieneContenidoEspecial(
                        capitulo
                    );

                const sinInformacion =
                    !visibles.length &&
                    !gruposVisibles.length &&
                    !tieneDocumentos;

                capitulo.classList.toggle(
                    "falco-capitulo-sin-datos",
                    sinInformacion
                );

                capitulo.classList.toggle(
                    "falco-capitulo-con-datos",
                    !sinInformacion
                );

                capitulo.dataset.cleanupState =
                    sinInformacion
                        ? "sin-datos"
                        : "con-datos";

            }
        );

    },


    /* =====================================================
       NORMALIZACIÓN
    ===================================================== */

    normalizarValor(valor) {

        return String(
            valor ?? ""
        )
            .replace(
                /\u00a0/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim()
            .toLocaleLowerCase(
                "es-AR"
            );

    },


    /* =====================================================
       MARCAR EXPEDIENTE
    ===================================================== */

    marcarExpediente() {

        const expediente =
            document.getElementById(
                "expediente"
            );

        if (!expediente) {
            return;
        }

        expediente.classList.add(
            "falco-cleanup-activo"
        );

        expediente.dataset.cleanupVersion =
            this.version;

        expediente.dataset.camposOcultos =
            String(
                this.camposOcultos
            );

    },


    /* =====================================================
       RESTAURAR
    ===================================================== */

    restaurar() {

        document
            .querySelectorAll(
                '[data-cleanup-hidden="true"]'
            )
            .forEach(
                elemento => {

                    elemento.hidden = false;

                    elemento.classList.remove(
                        "falco-campo-vacio",
                        "falco-grupo-vacio"
                    );

                    delete elemento.dataset
                        .cleanupHidden;

                }
            );

        document
            .querySelectorAll(
                ".falco-campo-con-informacion"
            )
            .forEach(
                elemento => {

                    elemento.classList.remove(
                        "falco-campo-con-informacion"
                    );

                }
            );

        document
            .querySelectorAll(
                '[id^="capitulo-"]'
            )
            .forEach(
                capitulo => {

                    capitulo.classList.remove(
                        "falco-capitulo-sin-datos",
                        "falco-capitulo-con-datos"
                    );

                    delete capitulo.dataset
                        .cleanupState;

                }
            );

        const expediente =
            document.getElementById(
                "expediente"
            );

        expediente?.classList.remove(
            "falco-cleanup-activo"
        );

        if (expediente) {

            delete expediente.dataset
                .cleanupVersion;

            delete expediente.dataset
                .camposOcultos;

        }

        this.camposOcultos = 0;
        this.gruposOcultos = 0;

        console.info(
            "FALCO Viewer Cleanup™ restaurado."
        );

    }

};


/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerCleanup =
    FalcoViewerCleanup;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerCleanup.init();

    }
);