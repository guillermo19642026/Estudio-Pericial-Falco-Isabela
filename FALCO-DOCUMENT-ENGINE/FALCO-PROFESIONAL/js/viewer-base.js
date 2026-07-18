/* =========================================================
   FALCO® VIEWER BASE™ v1.0
   Motor común para Viewers del Expediente Profesional

   Función:
   - Espera el renderizado del capítulo.
   - Obtiene los campos visibles.
   - Agrupa la información.
   - Genera tarjetas profesionales.
   - Conserva y restaura la vista original.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerBase = {

    version:
        "1.0",


    /* =====================================================
       CREAR VIEWER
    ===================================================== */

    crear(
        configuracion = {}
    ) {

        const viewer = {

            version:
                configuracion.version ||
                "1.0",

            nombre:
                configuracion.nombre ||
                "Viewer",

            selectorModulo:
                configuracion.selectorModulo ||
                "",

            esperarCleanup:
                configuracion.esperarCleanup !==
                false,

            maxIntentos:
                configuracion.maxIntentos ||
                60,

            intervaloEspera:
                configuracion.intervaloEspera ||
                250,

            claseContenedor:
                configuracion.claseContenedor ||
                "falco-viewer-base",

            claseTarjeta:
                configuracion.claseTarjeta ||
                "falco-viewer-card",

            claseEncabezado:
                configuracion.claseEncabezado ||
                "falco-viewer-header",

            claseTitulo:
                configuracion.claseTitulo ||
                "falco-viewer-title",

            claseCuerpo:
                configuracion.claseCuerpo ||
                "falco-viewer-body",

            claseFila:
                configuracion.claseFila ||
                "falco-viewer-row",

            claseEtiqueta:
                configuracion.claseEtiqueta ||
                "falco-viewer-label",

            claseValor:
                configuracion.claseValor ||
                "falco-viewer-value",

            claseOriginal:
                configuracion.claseOriginal ||
                "falco-viewer-original",

            claseActivo:
                configuracion.claseActivo ||
                "falco-viewer-activo",

            datasetAplicado:
                configuracion.datasetAplicado ||
                "viewerAplicado",

            datasetGenerado:
                configuracion.datasetGenerado ||
                "viewerGenerated",

            datasetTipo:
                configuracion.datasetTipo ||
                "viewerType",

            modoInsercion:
                configuracion.modoInsercion ||
                "append",

            ocultarOriginal:
                configuracion.ocultarOriginal ||
                "campos",

            ordenGrupos:
                configuracion.ordenGrupos ||
                [],

            titulos:
                configuracion.titulos ||
                {},

            intentos:
                0,

            observer:
                null,

            modulo:
                null,

            contenidoOriginal:
                null,

            contenedor:
                null,


            /* =================================================
               INICIALIZACIÓN
            ================================================= */

            iniciar() {

                console.info(
                    `FALCO® ${this.nombre} v${this.version} Ready`
                );

                if (
                    this.intentarAplicar()
                ) {

                    return;

                }

                this.observer =
                    new MutationObserver(
                        () => {

                            if (
                                this.intentarAplicar()
                            ) {

                                this.detenerEspera();

                            }

                        }
                    );

                this.observer.observe(
                    document.body,
                    {
                        childList:
                            true,

                        subtree:
                            true
                    }
                );

                this.intervalo =
                    window.setInterval(
                        () => {

                            this.intentos++;

                            if (
                                this.intentarAplicar()
                            ) {

                                this.detenerEspera();

                                return;

                            }

                            if (
                                this.intentos >=
                                this.maxIntentos
                            ) {

                                this.detenerEspera();

                                console.warn(
                                    `FALCO® ${this.nombre} no encontró el capítulo preparado.`
                                );

                            }

                        },
                        this.intervaloEspera
                    );

            },


            /* =================================================
               DETENER ESPERA
            ================================================= */

            detenerEspera() {

                if (
                    this.observer
                ) {

                    this.observer.disconnect();

                    this.observer =
                        null;

                }

                if (
                    this.intervalo
                ) {

                    window.clearInterval(
                        this.intervalo
                    );

                    this.intervalo =
                        null;

                }

            },


            /* =================================================
               INTENTAR APLICAR
            ================================================= */

            intentarAplicar() {

                const modulo =
                    document.querySelector(
                        this.selectorModulo
                    );

                if (!modulo) {

                    return false;

                }

                const campos =
                    modulo.querySelectorAll(
                        ".falco-bloque-dato"
                    );

                if (
                    !campos.length
                ) {

                    return false;

                }

                if (
                    this.esperarCleanup
                ) {

                    const cleanupActivo =
                        document
                            .getElementById(
                                "expediente"
                            )
                            ?.classList
                            .contains(
                                "falco-cleanup-activo"
                            );

                    if (
                        !cleanupActivo
                    ) {

                        return false;

                    }

                }

                this.modulo =
                    modulo;

                this.aplicar();

                return true;

            },


            /* =================================================
               NORMALIZAR TEXTO
            ================================================= */

            normalizarTexto(
                texto = ""
            ) {

                return String(
                    texto
                )
                .normalize(
                    "NFD"
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim()
                .toLowerCase();

            },


            /* =================================================
               OBTENER CAMPOS
            ================================================= */

            obtenerCampos() {

                if (
                    !this.modulo
                ) {

                    return [];

                }

                return Array.from(
                    this.modulo.querySelectorAll(
                        ".falco-bloque-dato"
                    )
                )
                .filter(
                    bloque => {

                        const ocultoPorCleanup =
                            bloque.dataset
                                .cleanupHidden ===
                            "true";

                        const campoVacio =
                            bloque.classList.contains(
                                "falco-campo-vacio"
                            );

                        return (
                            !bloque.hidden &&
                            !ocultoPorCleanup &&
                            !campoVacio
                        );

                    }
                )
                .map(
                    bloque =>
                        this.obtenerDatosCampo(
                            bloque
                        )
                )
                .filter(
                    campo =>
                        campo.etiqueta &&
                        campo.valor
                );

            },


            /* =================================================
               LEER CAMPO
            ================================================= */

            obtenerDatosCampo(
                bloque
            ) {

                const etiqueta =
                    bloque
                        .querySelector(
                            ".falco-etiqueta-dato"
                        )
                        ?.textContent
                        ?.replace(
                            /\s+/g,
                            " "
                        )
                        .trim() ||
                    "";

                const valor =
                    bloque
                        .querySelector(
                            ".falco-valor-dato"
                        )
                        ?.textContent
                        ?.replace(
                            /\s+/g,
                            " "
                        )
                        .trim() ||
                    "";

                return {

                    etiqueta,

                    valor,

                    tipo:
                        bloque.dataset
                            .tipoCampo ||
                        "general",

                    bloque

                };

            },


            /* =================================================
               AGRUPAR CAMPOS
            ================================================= */

            agruparCampos(
                campos
            ) {

                const grupos = {};

                campos.forEach(
                    campo => {

                        const grupo =
                            configuracion
                                .detectarGrupo
                                ?.call(
                                    this,
                                    campo
                                ) ||
                            campo.tipo ||
                            "general";

                        if (
                            !grupos[grupo]
                        ) {

                            grupos[grupo] =
                                [];

                        }

                        grupos[grupo].push(
                            campo
                        );

                    }
                );

                return grupos;

            },


            /* =================================================
               ORDENAR GRUPOS
            ================================================= */

            obtenerGruposOrdenados(
                grupos
            ) {

                const claves =
                    Object.keys(
                        grupos
                    );

                return claves.sort(
                    (
                        grupoA,
                        grupoB
                    ) => {

                        const indiceA =
                            this.ordenGrupos
                                .indexOf(
                                    grupoA
                                );

                        const indiceB =
                            this.ordenGrupos
                                .indexOf(
                                    grupoB
                                );

                        const ordenA =
                            indiceA === -1
                                ? 999
                                : indiceA;

                        const ordenB =
                            indiceB === -1
                                ? 999
                                : indiceB;

                        return ordenA -
                            ordenB;

                    }
                );

            },


            /* =================================================
               CREAR CONTENEDOR
            ================================================= */

            crearContenedor(
                grupos
            ) {

                const claves =
                    this.obtenerGruposOrdenados(
                        grupos
                    );

                if (
                    !claves.length
                ) {

                    return null;

                }

                const contenedor =
                    document.createElement(
                        "div"
                    );

                contenedor.className =
                    this.claseContenedor;

                contenedor.dataset[
                    this.datasetGenerado
                ] =
                    "true";

                claves.forEach(
                    clave => {

                        const tarjeta =
                            this.crearTarjeta(
                                clave,
                                grupos[clave]
                            );

                        if (
                            tarjeta
                        ) {

                            contenedor.appendChild(
                                tarjeta
                            );

                        }

                    }
                );

                return contenedor;

            },


            /* =================================================
               CREAR TARJETA
            ================================================= */

            crearTarjeta(
                clave,
                campos
            ) {

                if (
                    !campos?.length
                ) {

                    return null;

                }

                const tarjeta =
                    document.createElement(
                        "section"
                    );

                tarjeta.className =
                    `${this.claseTarjeta} ${this.claseTarjeta}-${clave}`;

                tarjeta.dataset[
                    this.datasetTipo
                ] =
                    clave;

                const encabezado =
                    document.createElement(
                        "header"
                    );

                encabezado.className =
                    this.claseEncabezado;

                const titulo =
                    document.createElement(
                        "h4"
                    );

                titulo.className =
                    this.claseTitulo;

                titulo.textContent =
                    this.titulos[clave] ||
                    configuracion
                        .tituloGeneral ||
                    "Información";

                encabezado.appendChild(
                    titulo
                );

                if (
                    typeof configuracion
                        .crearComplementoEncabezado ===
                    "function"
                ) {

                    const complemento =
                        configuracion
                            .crearComplementoEncabezado
                            .call(
                                this,
                                clave,
                                campos
                            );

                    if (
                        complemento
                    ) {

                        encabezado.appendChild(
                            complemento
                        );

                    }

                }

                const cuerpo =
                    document.createElement(
                        configuracion
                            .elementoCuerpo ||
                        "div"
                    );

                cuerpo.className =
                    this.claseCuerpo;

                const camposOrdenados =
                    [...campos]
                        .sort(
                            (
                                campoA,
                                campoB
                            ) =>
                                this.obtenerOrdenCampo(
                                    campoA
                                ) -
                                this.obtenerOrdenCampo(
                                    campoB
                                )
                        );

                camposOrdenados.forEach(
                    campo => {

                        cuerpo.appendChild(
                            this.crearFila(
                                campo
                            )
                        );

                    }
                );

                tarjeta.append(
                    encabezado,
                    cuerpo
                );

                return tarjeta;

            },


            /* =================================================
               CREAR FILA
            ================================================= */

            crearFila(
                campo
            ) {

                const fila =
                    document.createElement(
                        "div"
                    );

                fila.className =
                    this.claseFila;

                const etiqueta =
                    document.createElement(
                        configuracion
                            .elementoEtiqueta ||
                        "div"
                    );

                etiqueta.className =
                    this.claseEtiqueta;

                etiqueta.textContent =
                    this.formatearEtiqueta(
                        campo.etiqueta,
                        campo
                    );

                const valor =
                    document.createElement(
                        configuracion
                            .elementoValor ||
                        "div"
                    );

                valor.className =
                    this.claseValor;

                valor.textContent =
                    this.formatearValor(
                        campo.etiqueta,
                        campo.valor,
                        campo
                    );

                fila.append(
                    etiqueta,
                    valor
                );

                return fila;

            },


            /* =================================================
               FORMATEAR ETIQUETA
            ================================================= */

            formatearEtiqueta(
                etiqueta,
                campo
            ) {

                if (
                    typeof configuracion
                        .formatearEtiqueta ===
                    "function"
                ) {

                    return configuracion
                        .formatearEtiqueta
                        .call(
                            this,
                            etiqueta,
                            campo
                        );

                }

                return etiqueta;

            },


            /* =================================================
               FORMATEAR VALOR
            ================================================= */

            formatearValor(
                etiqueta,
                valor,
                campo
            ) {

                if (
                    typeof configuracion
                        .formatearValor ===
                    "function"
                ) {

                    return configuracion
                        .formatearValor
                        .call(
                            this,
                            etiqueta,
                            valor,
                            campo
                        );

                }

                return String(
                    valor
                ).trim();

            },


            /* =================================================
               ORDENAR CAMPOS
            ================================================= */

            obtenerOrdenCampo(
                campo
            ) {

                if (
                    typeof configuracion
                        .obtenerOrdenCampo ===
                    "function"
                ) {

                    return configuracion
                        .obtenerOrdenCampo
                        .call(
                            this,
                            campo
                        );

                }

                return 999;

            },


            /* =================================================
               APLICAR VIEWER
            ================================================= */

            aplicar() {

                if (
                    !this.modulo
                ) {

                    return;

                }

                if (
                    this.modulo.dataset[
                        this.datasetAplicado
                    ] ===
                    this.version
                ) {

                    return;

                }

                const campos =
                    this.obtenerCampos();

                if (
                    !campos.length
                ) {

                    console.info(
                        `FALCO® ${this.nombre} no encontró información visible.`
                    );

                    return;

                }

                const grupos =
                    this.agruparCampos(
                        campos
                    );

                this.contenedor =
                    this.crearContenedor(
                        grupos
                    );

                if (
                    !this.contenedor ||
                    !this.contenedor.children
                        .length
                ) {

                    return;

                }

                this.contenidoOriginal =
                    this.modulo.querySelector(
                        ".capitulo-contenido"
                    ) ||
                    this.modulo;

                this.insertarContenedor();

                this.ocultarContenidoOriginal(
                    campos
                );

                this.modulo.classList.add(
                    this.claseActivo
                );

                this.modulo.dataset[
                    this.datasetAplicado
                ] =
                    this.version;

                console.info(
                    `FALCO® ${this.nombre} aplicado correctamente.`,
                    {
                        camposProcesados:
                            campos.length,

                        gruposGenerados:
                            this.contenedor
                                .children
                                .length
                    }
                );

            },


            /* =================================================
               INSERTAR CONTENEDOR
            ================================================= */

            insertarContenedor() {

                if (
                    this.modoInsercion ===
                    "before"
                ) {

                    this.contenidoOriginal
                        .insertAdjacentElement(
                            "beforebegin",
                            this.contenedor
                        );

                    return;

                }

                this.contenidoOriginal
                    .appendChild(
                        this.contenedor
                    );

            },


            /* =================================================
               OCULTAR ORIGINAL
            ================================================= */

            ocultarContenidoOriginal(
                campos
            ) {

                if (
                    this.ocultarOriginal ===
                    "contenido"
                ) {

                    this.contenidoOriginal
                        .classList
                        .add(
                            this.claseOriginal
                        );

                    this.contenidoOriginal
                        .setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    this.contenidoOriginal
                        .hidden =
                        true;

                    this.contenidoOriginal
                        .style
                        .display =
                        "none";

                    return;

                }

                campos.forEach(
                    campo => {

                        campo.bloque
                            .classList
                            .add(
                                this.claseOriginal
                            );

                    }
                );

            },


            /* =================================================
               RESTAURAR
            ================================================= */

            restaurar() {

                this.detenerEspera();

                const modulo =
                    document.querySelector(
                        this.selectorModulo
                    );

                if (
                    !modulo
                ) {

                    return;

                }

                modulo
                    .querySelectorAll(
                        `[data-${this.convertirDatasetAtributo(
                            this.datasetGenerado
                        )}="true"]`
                    )
                    .forEach(
                        elemento =>
                            elemento.remove()
                    );

                if (
                    this.ocultarOriginal ===
                    "contenido"
                ) {

                    const original =
                        modulo.querySelector(
                            `.${this.claseOriginal}`
                        );

                    if (
                        original
                    ) {

                        original.classList.remove(
                            this.claseOriginal
                        );

                        original.removeAttribute(
                            "aria-hidden"
                        );

                        original.hidden =
                            false;

                        original.style.display =
                            "";

                    }

                } else {

                    modulo
                        .querySelectorAll(
                            `.${this.claseOriginal}`
                        )
                        .forEach(
                            campo => {

                                campo.classList.remove(
                                    this.claseOriginal
                                );

                            }
                        );

                }

                modulo.classList.remove(
                    this.claseActivo
                );

                delete modulo.dataset[
                    this.datasetAplicado
                ];

                this.modulo =
                    null;

                this.contenidoOriginal =
                    null;

                this.contenedor =
                    null;

                console.info(
                    `FALCO® ${this.nombre} restaurado.`
                );

            },


            /* =================================================
               DATASET A ATRIBUTO HTML
            ================================================= */

            convertirDatasetAtributo(
                nombre
            ) {

                return nombre.replace(
                    /[A-Z]/g,
                    letra =>
                        `-${letra.toLowerCase()}`
                );

            }

        };

        return viewer;

    }

};


window.FalcoViewerBase =
    FalcoViewerBase;


console.info(
    "FALCO® Viewer Base™ v1.0 Ready"
);