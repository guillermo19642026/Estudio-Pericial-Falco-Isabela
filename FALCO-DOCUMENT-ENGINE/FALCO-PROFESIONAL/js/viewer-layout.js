/* =========================================================
   FALCO® Viewer Layout™ v1.0
   Organización visual no invasiva del expediente

   No modifica:
   - Firestore
   - expediente-loader.js
   - expediente-core.js
   - documentos adjuntos
========================================================= */

const FalcoViewerLayout = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    capitulosConfigurados: {

        "capitulo-01": "datos-personales",
        "capitulo-02": "datos-judiciales",
        "capitulo-03": "relato-hecho",
        "capitulo-04": "grupo-familiar",
        "capitulo-05": "area-afectiva",
        "capitulo-06": "area-social",
        "capitulo-07": "educacion",
        "capitulo-08": "historia-laboral",
        "capitulo-09": "trabajo-actual",
        "capitulo-10": "tratamientos",
        "capitulo-11": "antecedentes-salud",
        "capitulo-12": "habitos",
        "capitulo-13": "impacto-actual",
        "capitulo-14": "documentacion",
        "capitulo-15": "observaciones-finales",
        "capitulo-16": "consentimiento"

    },


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init(){

        console.info(
            `FALCO Viewer Layout™ v${this.version} Ready`
        );

        this.esperarViewer();

    },


    /* =====================================================
       ESPERAR EXPEDIENTE RENDERIZADO
    ===================================================== */

    esperarViewer(){

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

                    this.aplicarLayout();

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
                        "FALCO Viewer Layout™ no encontró el expediente renderizado."
                    );

                }

            },
            250
        );

    },


    /* =====================================================
       APLICAR LAYOUT
    ===================================================== */

    aplicarLayout(){

        this.marcarExpediente();

        this.marcarCapitulos();

        this.marcarBloquesDeDatos();

        this.marcarEtiquetasYValores();

        this.clasificarCampos();

        this.marcarDocumentacion();

        console.info(
            "FALCO Viewer Layout™ aplicado correctamente."
        );

    },


    /* =====================================================
       MARCAR EXPEDIENTE
    ===================================================== */

    marcarExpediente(){

        const expediente =
            document.getElementById(
                "expediente"
            );

        if(!expediente){

            return;

        }

        expediente.classList.add(
            "falco-layout-activo"
        );

        expediente.dataset.layoutVersion =
            this.version;

    },


    /* =====================================================
       MARCAR CAPÍTULOS
    ===================================================== */

    marcarCapitulos(){

        Object.entries(
            this.capitulosConfigurados
        ).forEach(
            ([id, tipo]) => {

                const capitulo =
                    document.getElementById(
                        id
                    );

                if(!capitulo){

                    return;

                }

                capitulo.classList.add(
                    "falco-capitulo-layout",
                    `falco-capitulo-${tipo}`
                );

                capitulo.dataset.tipoCapitulo =
                    tipo;

                const contenido =
                    capitulo.querySelector(
                        ".capitulo-contenido"
                    );

                contenido?.classList.add(
                    "falco-capitulo-grid"
                );

            }
        );

    },


    /* =====================================================
       MARCAR BLOQUES DE DATOS
    ===================================================== */

    marcarBloquesDeDatos(){

        document
            .querySelectorAll(
                ".capitulo-contenido"
            )
            .forEach(
                contenido => {

                    Array.from(
                        contenido.children
                    ).forEach(
                        elemento => {

                            if(
                                elemento.hidden ||
                                !elemento.textContent.trim()
                            ){

                                return;

                            }

                            if(
                                elemento.matches(
                                    [
                                        "h1",
                                        "h2",
                                        "h3",
                                        "h4",
                                        "h5",
                                        "section.anexos-expediente"
                                    ].join(",")
                                )
                            ){

                                return;

                            }

                            elemento.classList.add(
                                "falco-bloque-dato"
                            );

                        }
                    );

                }
            );

    },


    /* =====================================================
       MARCAR ETIQUETAS Y VALORES
    ===================================================== */

    marcarEtiquetasYValores(){

        document
            .querySelectorAll(
                ".falco-bloque-dato"
            )
            .forEach(
                bloque => {

                    const hijosVisibles =
                        Array.from(
                            bloque.children
                        ).filter(
                            elemento =>
                                !elemento.hidden &&
                                elemento.textContent.trim()
                        );

                    if(
                        hijosVisibles.length >= 2
                    ){

                        hijosVisibles[0].classList.add(
                            "falco-etiqueta-dato"
                        );

                        hijosVisibles
                            .slice(1)
                            .forEach(
                                elemento => {

                                    elemento.classList.add(
                                        "falco-valor-dato"
                                    );

                                }
                            );

                        return;

                    }

                    this.marcarPorContenido(
                        bloque
                    );

                }
            );

    },


    /* =====================================================
       IDENTIFICAR ETIQUETA Y VALOR POR TEXTO
    ===================================================== */

    marcarPorContenido(bloque){

        const elementos =
            Array.from(
                bloque.querySelectorAll(
                    "span, strong, b, p, div, dt, dd"
                )
            )
            .filter(
                elemento =>
                    !elemento.children.length &&
                    elemento.textContent.trim()
            );

        if(
            elementos.length < 2
        ){

            return;

        }

        elementos[0].classList.add(
            "falco-etiqueta-dato"
        );

        elementos
            .slice(1)
            .forEach(
                elemento => {

                    elemento.classList.add(
                        "falco-valor-dato"
                    );

                }
            );

    },


    /* =====================================================
       CLASIFICAR CAMPOS
    ===================================================== */

    clasificarCampos(){

        document
            .querySelectorAll(
                ".falco-bloque-dato"
            )
            .forEach(
                bloque => {

                    const texto =
                        this.normalizarTexto(
                            bloque.textContent
                        );

                    const tipo =
                        this.detectarTipoCampo(
                            texto
                        );

                    if(!tipo){

                        return;

                    }

                    bloque.classList.add(
                        `falco-campo-${tipo}`
                    );

                    bloque.dataset.tipoCampo =
                        tipo;

                }
            );

    },


    /* =====================================================
       DETECTAR TIPO DE CAMPO
    ===================================================== */

    detectarTipoCampo(texto){

        if(
            this.contieneAlguno(
                texto,
                [
                    "nombre padre",
                    "edad padre",
                    "ocupacion padre",
                    "padre vive",
                    "relacion padre",
                    "contacto padre",
                    "convive padre"
                ]
            )
        ){

            return "padre";

        }

        if(
            this.contieneAlguno(
                texto,
                [
                    "nombre madre",
                    "edad madre",
                    "ocupacion madre",
                    "madre vive",
                    "relacion madre",
                    "contacto madre",
                    "convive madre"
                ]
            )
        ){

            return "madre";

        }

        if(
            texto.includes(
                "hermano"
            )
        ){

            return "hermanos";

        }

        if(
            texto.includes(
                "hijo"
            )
        ){

            return "hijos";

        }

        if(
            this.contieneAlguno(
                texto,
                [
                    "nombre pareja",
                    "edad pareja",
                    "ocupacion pareja",
                    "tiempo relacion",
                    "tiene pareja",
                    "conviven"
                ]
            )
        ){

            return "pareja";

        }

        if(
            texto.includes(
                "trabajo 1"
            )
        ){

            return "trabajo-1";

        }

        if(
            texto.includes(
                "trabajo 2"
            )
        ){

            return "trabajo-2";

        }

        if(
            texto.includes(
                "trabajo 3"
            )
        ){

            return "trabajo-3";

        }

        if(
            this.contieneAlguno(
                texto,
                [
                    "tratamiento",
                    "profesional",
                    "psicologia",
                    "psiquiatria",
                    "medicacion"
                ]
            )
        ){

            return "tratamiento";

        }

        if(
            this.contieneAlguno(
                texto,
                [
                    "expediente",
                    "caratula",
                    "tribunal",
                    "fuero",
                    "actor",
                    "demandado",
                    "abogado"
                ]
            )
        ){

            return "judicial";

        }

        return null;

    },


    /* =====================================================
       MARCAR DOCUMENTACIÓN
    ===================================================== */

    marcarDocumentacion(){

        const anexos =
            document.querySelector(
                ".anexos-expediente"
            );

        if(!anexos){

            return;

        }

        anexos.classList.add(
            "falco-documentacion-layout"
        );

        anexos
            .querySelectorAll(
                ".grupo-anexo"
            )
            .forEach(
                grupo => {

                    grupo.classList.add(
                        "falco-tarjeta-documental"
                    );

                }
            );

    },


    /* =====================================================
       RESTAURAR
    ===================================================== */

    restaurar(){

        document
            .querySelectorAll(
                [
                    ".falco-layout-activo",
                    ".falco-capitulo-layout",
                    ".falco-capitulo-grid",
                    ".falco-bloque-dato",
                    ".falco-etiqueta-dato",
                    ".falco-valor-dato",
                    ".falco-documentacion-layout",
                    ".falco-tarjeta-documental"
                ].join(",")
            )
            .forEach(
                elemento => {

                    Array.from(
                        elemento.classList
                    )
                        .filter(
                            clase =>
                                clase.startsWith(
                                    "falco-"
                                )
                        )
                        .forEach(
                            clase => {

                                elemento.classList.remove(
                                    clase
                                );

                            }
                        );

                    delete elemento.dataset
                        .tipoCampo;

                    delete elemento.dataset
                        .tipoCapitulo;

                    delete elemento.dataset
                        .layoutVersion;

                }
            );

        console.info(
            "FALCO Viewer Layout™ restaurado."
        );

    },


    /* =====================================================
       UTILIDADES
    ===================================================== */

    contieneAlguno(
        texto,
        expresiones
    ){

        return expresiones.some(
            expresion =>
                texto.includes(
                    expresion
                )
        );

    },


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

window.FalcoViewerLayout =
    FalcoViewerLayout;



/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerLayout.init();

    }
);