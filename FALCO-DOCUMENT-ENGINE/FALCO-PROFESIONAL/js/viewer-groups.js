/* =========================================================
   FALCO® Viewer Groups™ v1.0
   Agrupación visual modular del Expediente Digital

   Requiere:
   - viewer-profesional.js
   - viewer-layout.js

   No modifica:
   - Firestore
   - expediente-loader.js
   - expediente-core.js
========================================================= */

const FalcoViewerGroups = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    gruposConfigurados: [

        {
            capitulo: "capitulo-04",
            tipo: "padre",
            titulo: "Padre"
        },

        {
            capitulo: "capitulo-04",
            tipo: "madre",
            titulo: "Madre"
        },

        {
            capitulo: "capitulo-04",
            tipo: "hermanos",
            titulo: "Hermanos"
        },

        {
            capitulo: "capitulo-04",
            tipo: "hijos",
            titulo: "Hijos"
        },

        {
            capitulo: "capitulo-05",
            tipo: "pareja",
            titulo: "Pareja"
        },

        {
            capitulo: "capitulo-08",
            tipo: "trabajo-1",
            titulo: "Trabajo 1"
        },

        {
            capitulo: "capitulo-08",
            tipo: "trabajo-2",
            titulo: "Trabajo 2"
        },

        {
            capitulo: "capitulo-08",
            tipo: "trabajo-3",
            titulo: "Trabajo 3"
        },

        {
            capitulo: "capitulo-10",
            tipo: "tratamiento",
            titulo: "Tratamientos"
        }

    ],


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init(){

        console.info(
            `FALCO Viewer Groups™ v${this.version} Ready`
        );

        this.esperarLayout();

    },


    /* =====================================================
       ESPERAR CAPAS ANTERIORES
    ===================================================== */

    esperarLayout(){

        this.intervalo = window.setInterval(
            () => {

                this.intentos++;

                const expediente =
                    document.getElementById(
                        "expediente"
                    );

                const layoutActivo =
                    expediente?.classList.contains(
                        "falco-layout-activo"
                    );

                const bloques =
                    document.querySelectorAll(
                        ".falco-bloque-dato"
                    );

                if(
                    expediente &&
                    layoutActivo &&
                    bloques.length
                ){

                    window.clearInterval(
                        this.intervalo
                    );

                    this.aplicarGrupos();

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
                        "FALCO Viewer Groups™ no encontró el layout preparado."
                    );

                }

            },
            250
        );

    },


    /* =====================================================
       APLICAR AGRUPACIONES
    ===================================================== */

    aplicarGrupos(){

        this.gruposConfigurados.forEach(
            configuracion => {

                this.crearGrupo(
                    configuracion
                );

            }
        );

        this.marcarCapitulosAgrupados();

        this.marcarExpediente();

        console.info(
            "FALCO Viewer Groups™ aplicado correctamente."
        );

    },


    /* =====================================================
       CREAR GRUPO
    ===================================================== */

    crearGrupo(configuracion){

        const capitulo =
            document.getElementById(
                configuracion.capitulo
            );

        if(!capitulo){

            return;

        }

        const contenido =
            capitulo.querySelector(
                ".capitulo-contenido"
            );

        if(!contenido){

            return;

        }

        const selector =
            `.falco-campo-${configuracion.tipo}`;

        const campos =
            Array.from(
                contenido.querySelectorAll(
                    selector
                )
            )
            .filter(
                campo =>
                    !campo.hidden &&
                    !campo.closest(
                        ".falco-grupo-datos"
                    )
            );

        if(!campos.length){

            return;

        }

        const grupo =
            this.construirGrupo(
                configuracion
            );

        const primerCampo =
            campos[0];

        contenido.insertBefore(
            grupo,
            primerCampo
        );

        const cuerpo =
            grupo.querySelector(
                ".falco-grupo-cuerpo"
            );

        campos.forEach(
            campo => {

                cuerpo.appendChild(
                    campo
                );

            }
        );

        this.limpiarEtiquetasDelGrupo(
            grupo,
            configuracion.tipo
        );

        this.ocultarGrupoSiQuedoVacio(
            grupo
        );

    },


    /* =====================================================
       CONSTRUIR CONTENEDOR
    ===================================================== */

    construirGrupo(configuracion){

        const grupo =
            document.createElement(
                "section"
            );

        grupo.className = [
            "falco-grupo-datos",
            `falco-grupo-${configuracion.tipo}`
        ].join(" ");

        grupo.dataset.tipoGrupo =
            configuracion.tipo;

        grupo.dataset.groupsVersion =
            this.version;

        grupo.innerHTML = `

            <header class="falco-grupo-encabezado">

                <h4 class="falco-grupo-titulo">

                    ${this.escaparHtml(
                        configuracion.titulo
                    )}

                </h4>

            </header>

            <div class="falco-grupo-cuerpo"></div>
        `;

        return grupo;

    },


    /* =====================================================
       LIMPIAR PREFIJOS DE ETIQUETAS
    ===================================================== */

    limpiarEtiquetasDelGrupo(
        grupo,
        tipo
    ){

        const etiquetas =
            grupo.querySelectorAll(
                ".falco-etiqueta-dato"
            );

        etiquetas.forEach(
            etiqueta => {

                const original =
                    etiqueta.textContent.trim();

                if(!original){

                    return;

                }

                etiqueta.dataset.etiquetaOriginal =
                    original;

                const limpia =
                    this.limpiarEtiqueta(
                        original,
                        tipo
                    );

                etiqueta.textContent =
                    limpia || original;

            }
        );

    },


    /* =====================================================
       LIMPIAR ETIQUETA
    ===================================================== */

    limpiarEtiqueta(
        etiqueta,
        tipo
    ){

        let resultado =
            String(
                etiqueta || ""
            ).trim();

        const expresiones = {

            padre:
                /^(nombre|edad|ocupación|ocupacion|relación|relacion|contacto|convive|descripción|descripcion|frecuencia)?\s*padre\s*/i,

            madre:
                /^(nombre|edad|ocupación|ocupacion|relación|relacion|contacto|convive|descripción|descripcion|frecuencia)?\s*madre\s*/i,

            pareja:
                /^(nombre|edad|ocupación|ocupacion|tiempo|tiene|estado|hijos)?\s*pareja\s*/i,

            hermanos:
                /^hermanos?\s*\d*\s*/i,

            hijos:
                /^hijos?\s*\d*\s*/i,

            "trabajo-1":
                /^trabajo\s*1\s*/i,

            "trabajo-2":
                /^trabajo\s*2\s*/i,

            "trabajo-3":
                /^trabajo\s*3\s*/i

        };

        const expresion =
            expresiones[tipo];

        if(expresion){

            resultado =
                resultado.replace(
                    expresion,
                    ""
                );

        }

        resultado =
            resultado
                .replace(
                    /^\s*[-–—:]\s*/,
                    ""
                )
                .trim();

        return this.capitalizarPrimera(
            resultado
        );

    },


    /* =====================================================
       MARCAR CAPÍTULOS AGRUPADOS
    ===================================================== */

    marcarCapitulosAgrupados(){

        const capitulos =
            new Set(
                this.gruposConfigurados.map(
                    grupo =>
                        grupo.capitulo
                )
            );

        capitulos.forEach(
            id => {

                const capitulo =
                    document.getElementById(
                        id
                    );

                const grupos =
                    capitulo?.querySelectorAll(
                        ".falco-grupo-datos"
                    );

                if(
                    capitulo &&
                    grupos?.length
                ){

                    capitulo.classList.add(
                        "falco-capitulo-agrupado"
                    );

                }

            }
        );

    },


    /* =====================================================
       OCULTAR GRUPO VACÍO
    ===================================================== */

    ocultarGrupoSiQuedoVacio(grupo){

        const camposVisibles =
            Array.from(
                grupo.querySelectorAll(
                    ".falco-bloque-dato"
                )
            )
            .filter(
                campo =>
                    !campo.hidden &&
                    campo.textContent.trim()
            );

        if(!camposVisibles.length){

            grupo.hidden = true;

        }

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
            "falco-groups-activo"
        );

        expediente.dataset.groupsVersion =
            this.version;

    },


    /* =====================================================
       RESTAURAR AGRUPACIONES
    ===================================================== */

    restaurar(){

        document
            .querySelectorAll(
                ".falco-grupo-datos"
            )
            .forEach(
                grupo => {

                    const cuerpo =
                        grupo.querySelector(
                            ".falco-grupo-cuerpo"
                        );

                    const padre =
                        grupo.parentElement;

                    if(
                        cuerpo &&
                        padre
                    ){

                        Array.from(
                            cuerpo.children
                        ).forEach(
                            campo => {

                                campo
                                    .querySelectorAll(
                                        "[data-etiqueta-original]"
                                    )
                                    .forEach(
                                        etiqueta => {

                                            etiqueta.textContent =
                                                etiqueta.dataset
                                                    .etiquetaOriginal;

                                            delete etiqueta.dataset
                                                .etiquetaOriginal;

                                        }
                                    );

                                padre.insertBefore(
                                    campo,
                                    grupo
                                );

                            }
                        );

                    }

                    grupo.remove();

                }
            );

        document
            .querySelectorAll(
                ".falco-capitulo-agrupado"
            )
            .forEach(
                capitulo => {

                    capitulo.classList.remove(
                        "falco-capitulo-agrupado"
                    );

                }
            );

        const expediente =
            document.getElementById(
                "expediente"
            );

        expediente?.classList.remove(
            "falco-groups-activo"
        );

        if(expediente){

            delete expediente.dataset
                .groupsVersion;

        }

        console.info(
            "FALCO Viewer Groups™ restaurado."
        );

    },


    /* =====================================================
       UTILIDADES
    ===================================================== */

    capitalizarPrimera(valor){

        const texto =
            String(
                valor || ""
            ).trim();

        if(!texto){

            return "";

        }

        return (
            texto.charAt(0).toUpperCase() +
            texto.slice(1)
        );

    },


    escaparHtml(valor){

        return String(
            valor ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

};



/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerGroups =
    FalcoViewerGroups;



/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerGroups.init();

    }
);