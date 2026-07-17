/* =========================================================
   FALCO® Viewer Profesional™ v1.0
   Mejora visual no invasiva del Expediente Viewer™
   No modifica Firestore, Loader ni expediente-core.js
========================================================= */

const FalcoViewerProfesional = {

    version: "1.0",

    textoSinInformacion:
        "No se registró información en este módulo.",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init(){

        console.info(
            `FALCO Viewer Profesional™ v${this.version} Ready`
        );

        this.esperarExpediente();

    },


    /* =====================================================
       ESPERAR A QUE EL VIEWER TERMINE DE RENDERIZAR
    ===================================================== */

    esperarExpediente(){

        this.intervalo = window.setInterval(
            () => {

                this.intentos++;

                const expediente =
                    document.getElementById(
                        "expediente"
                    );

                const capitulos =
                    document.querySelectorAll(
                        ".capitulo"
                    );

                if(
                    expediente &&
                    capitulos.length
                ){

                    window.clearInterval(
                        this.intervalo
                    );

                    this.aplicarMejoras();

                    return;

                }

                if(
                    this.intentos >=
                    this.maxIntentos
                ){

                    window.clearInterval(
                        this.intervalo
                    );

                    console.warn(
                        "FALCO Viewer Profesional™ no encontró el expediente renderizado."
                    );

                }

            },
            250
        );

    },


    /* =====================================================
       APLICAR MEJORAS
    ===================================================== */

    aplicarMejoras(){

        this.ocultarCamposSinInformacion();

        this.ocultarContenedoresVacios();

        this.marcarValoresBooleanos();

        this.formatearFechasVisibles();

        this.marcarExpedienteProcesado();

        console.info(
            "FALCO Viewer Profesional™ aplicado correctamente."
        );

    },


    /* =====================================================
       OCULTAR CAMPOS SIN INFORMACIÓN
    ===================================================== */

    ocultarCamposSinInformacion(){

        const elementos =
            document.querySelectorAll(
                ".capitulo-contenido *"
            );

        elementos.forEach(
            elemento => {

                if(
                    elemento.children.length
                ){

                    return;

                }

                const texto =
                    this.normalizarTexto(
                        elemento.textContent
                    );

                if(
                    texto !==
                    this.normalizarTexto(
                        this.textoSinInformacion
                    )
                ){

                    return;

                }

                const bloque =
                    this.encontrarBloqueCampo(
                        elemento
                    );

                if(bloque){

                    bloque.classList.add(
                        "falco-campo-vacio"
                    );

                    bloque.hidden = true;

                }
                else{

                    elemento.hidden = true;

                }

            }
        );

    },


    /* =====================================================
       ENCONTRAR CONTENEDOR DEL CAMPO
    ===================================================== */

    encontrarBloqueCampo(elemento){

        const selectores = [

            ".campo",

            ".campo-item",

            ".dato",

            ".dato-item",

            ".fila-dato",

            ".contenido-item",

            ".render-item",

            ".detalle-item",

            "li",

            "p",

            "div"

        ];

        for(
            const selector
            of selectores
        ){

            const bloque =
                elemento.closest(
                    selector
                );

            if(
                bloque &&
                bloque !==
                document.body &&
                !bloque.classList.contains(
                    "capitulo-contenido"
                )
            ){

                const texto =
                    this.normalizarTexto(
                        bloque.textContent
                    );

                if(
                    texto.includes(
                        this.normalizarTexto(
                            this.textoSinInformacion
                        )
                    )
                ){

                    return bloque;

                }

            }

        }

        return null;

    },


    /* =====================================================
       OCULTAR CONTENEDORES QUE QUEDARON VACÍOS
    ===================================================== */

    ocultarContenedoresVacios(){

        const candidatos =
            document.querySelectorAll(
                [
                    ".grupo-datos",
                    ".grupo-campos",
                    ".contenido-grupo",
                    ".subgrupo",
                    ".render-grupo",
                    ".lista-registros"
                ].join(",")
            );

        candidatos.forEach(
            contenedor => {

                const visibles =
                    Array.from(
                        contenedor.children
                    ).filter(
                        hijo =>
                            !hijo.hidden &&
                            hijo.textContent.trim()
                    );

                if(!visibles.length){

                    contenedor.hidden = true;

                }

            }
        );

    },


    /* =====================================================
       MARCAR RESPUESTAS SÍ / NO
    ===================================================== */

    marcarValoresBooleanos(){

        const elementos =
            document.querySelectorAll(
                ".capitulo-contenido *"
            );

        elementos.forEach(
            elemento => {

                if(
                    elemento.children.length
                ){

                    return;

                }

                if(
                    elemento.closest(
                        "a, button, h1, h2, h3, h4, h5"
                    )
                ){

                    return;

                }

                const valor =
                    this.normalizarTexto(
                        elemento.textContent
                    );

                if(valor === "si"){

                    elemento.classList.add(
                        "falco-valor-booleano",
                        "falco-valor-si"
                    );

                }

                if(valor === "no"){

                    elemento.classList.add(
                        "falco-valor-booleano",
                        "falco-valor-no"
                    );

                }

            }
        );

    },


    /* =====================================================
       FORMATEAR FECHAS VISIBLES
    ===================================================== */

    formatearFechasVisibles(){

        const elementos =
            document.querySelectorAll(
                ".capitulo-contenido *"
            );

        elementos.forEach(
            elemento => {

                if(
                    elemento.children.length
                ){

                    return;

                }

                if(
                    elemento.closest(
                        "a, time, button"
                    )
                ){

                    return;

                }

                const texto =
                    elemento.textContent.trim();

                const coincidencia =
                    texto.match(
                        /^(\d{4})-(\d{2})-(\d{2})$/
                    );

                if(!coincidencia){

                    return;

                }

                const [
                    ,
                    anio,
                    mes,
                    dia
                ] = coincidencia;

                elemento.textContent =
                    `${dia}/${mes}/${anio}`;

                elemento.dataset.fechaOriginal =
                    texto;

            }
        );

    },


    /* =====================================================
       MARCAR EXPEDIENTE PROCESADO
    ===================================================== */

    marcarExpedienteProcesado(){

        const expediente =
            document.getElementById(
                "expediente"
            );

        if(!expediente){

            return;

        }

        expediente.classList.add(
            "falco-viewer-profesional"
        );

        expediente.dataset.viewerProfesional =
            this.version;

    },


    /* =====================================================
       RESTAURAR PRESENTACIÓN ORIGINAL
    ===================================================== */

    restaurar(){

        document
            .querySelectorAll(
                ".falco-campo-vacio"
            )
            .forEach(
                elemento => {

                    elemento.hidden = false;

                    elemento.classList.remove(
                        "falco-campo-vacio"
                    );

                }
            );

        document
            .querySelectorAll(
                ".falco-valor-booleano"
            )
            .forEach(
                elemento => {

                    elemento.classList.remove(
                        "falco-valor-booleano",
                        "falco-valor-si",
                        "falco-valor-no"
                    );

                }
            );

        document
            .querySelectorAll(
                "[data-fecha-original]"
            )
            .forEach(
                elemento => {

                    elemento.textContent =
                        elemento.dataset
                            .fechaOriginal;

                    delete elemento.dataset
                        .fechaOriginal;

                }
            );

        const expediente =
            document.getElementById(
                "expediente"
            );

        expediente?.classList.remove(
            "falco-viewer-profesional"
        );

        if(expediente){

            delete expediente.dataset
                .viewerProfesional;

        }

        console.info(
            "FALCO Viewer Profesional™ restauró la presentación original."
        );

    },


    /* =====================================================
       UTILIDAD
    ===================================================== */

    normalizarTexto(valor){

        return String(
            valor ?? ""
        )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim()
            .toLowerCase();

    }

};



/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerProfesional =
    FalcoViewerProfesional;



/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerProfesional.init();

    }
);