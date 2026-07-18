/* =========================================================
   FALCO® VIEWER DOCUMENTACIÓN™ v1.0

   Función:
   - Detecta documentación cargada en el expediente.
   - Agrupa DNI, constancias, estudios y otros archivos.
   - Presenta enlaces de visualización y descarga.
   - Oculta la estructura original del módulo.
   - No modifica Firestore ni Expediente Core.
========================================================= */
const FalcoViewerDocumentacion = {

    version:
        "1.0",

    selectorModulo:
        '[data-modulo="documentacion"]',

    modulo:
        null,

    contenidoOriginal:
        null,

    contenedor:
        null,

    documentosProcesados:
        0,

    gruposGenerados:
        0,

    intentosInicio:
        0,

    maximosIntentos:
        80,

    temporizadorInicio:
        null,


    /* =====================================================
       INICIO
    ===================================================== */

    iniciar() {

        if (
            this.temporizadorInicio
        ) {

            return;

        }

        console.log(
            `FALCO® Viewer Documentación™ v${this.version} Ready`
        );

        this.intentarInicio();

    },


    /* =====================================================
       ESPERAR CONSTRUCCIÓN DEL EXPEDIENTE
    ===================================================== */

    intentarInicio() {

        const ejecutar =
            () => {

                this.modulo =
                    document.querySelector(
                        this.selectorModulo
                    );

                if (
                    !this.modulo
                ) {

                    this.intentosInicio++;

                    if (
                        this.intentosInicio >=
                        this.maximosIntentos
                    ) {

                        clearInterval(
                            this.temporizadorInicio
                        );

                        this.temporizadorInicio =
                            null;

                        console.warn(
                            "FALCO® Viewer Documentación™ no encontró el capítulo preparado."
                        );

                    }

                    return;

                }


                clearInterval(
                    this.temporizadorInicio
                );

                this.temporizadorInicio =
                    null;


                if (
                    this.modulo.dataset.documentacionVersion ===
                    this.version
                ) {

                    return;

                }


                this.contenidoOriginal =
                    this.detectarContenidoOriginal();


                const documentos =
                    this.extraerDocumentos();


                if (
                    documentos.length === 0
                ) {

                    console.info(
                        "FALCO® Viewer Documentación™ encontró el capítulo, pero no detectó archivos visibles."
                    );

                    return;

                }


                const grupos =
                    this.agruparDocumentos(
                        documentos
                    );


                this.contenedor =
                    this.crearVista(
                        grupos
                    );


                this.insertarVista();

                this.ocultarContenidoOriginal();


                this.modulo.classList.add(
                    "falco-documentacion-activo"
                );


                this.modulo.dataset.documentacionVersion =
                    this.version;


                console.log(
                    "FALCO® Viewer Documentación™ aplicado correctamente.",
                    {
                        documentosProcesados:
                            this.documentosProcesados,

                        gruposGenerados:
                            this.gruposGenerados
                    }
                );

            };


        ejecutar();


        if (
            !this.modulo
        ) {

            this.temporizadorInicio =
                setInterval(
                    ejecutar,
                    250
                );

        }

    },



    /* =====================================================
       DETECTAR CONTENIDO ORIGINAL
    ===================================================== */

    detectarContenidoOriginal() {

        const selectores = [

            ".capitulo-contenido",
            ".modulo-contenido",
            ".contenido-modulo",
            ".contenido",
            ".campos",
            ".datos-modulo"

        ];

        for (
            const selector
            of selectores
        ) {

            const elemento =
                this.modulo.querySelector(
                    selector
                );

            if (
                elemento
            ) {

                return elemento;

            }

        }

        return this.modulo;

    },


    /* =====================================================
       EXTRAER DOCUMENTOS
    ===================================================== */

    extraerDocumentos() {

        const documentos =
            [];

        const elementos =
            this.contenidoOriginal.querySelectorAll(
                [
                    "a[href]",
                    "[data-url]",
                    "[data-file]",
                    "[data-documento]",
                    "[data-filename]",
                    "[data-nombre-archivo]",
                    ".archivo",
                    ".documento",
                    ".adjunto"
                ].join(",")
            );

        elementos.forEach(
            elemento => {

                const documento =
                    this.crearDocumentoDesdeElemento(
                        elemento
                    );

                if (
                    documento &&
                    documento.url
                ) {

                    const duplicado =
                        documentos.some(
                            item =>
                                item.url ===
                                documento.url
                        );

                    if (
                        !duplicado
                    ) {

                        documentos.push(
                            documento
                        );

                    }

                }

            }
        );


        /* Buscar URLs dentro del texto */

        const texto =
            this.contenidoOriginal.textContent ||
            "";

        const urls =
            texto.match(
                /https?:\/\/[^\s"'<>]+/gi
            ) ||
            [];

        urls.forEach(
            url => {

                const limpia =
                    url.replace(
                        /[),.;]+$/,
                        ""
                    );

                const duplicado =
                    documentos.some(
                        item =>
                            item.url ===
                            limpia
                    );

                if (
                    !duplicado
                ) {

                    documentos.push({

                        nombre:
                            this.obtenerNombreDesdeURL(
                                limpia
                            ),

                        url:
                            limpia,

                        fecha:
                            "",

                        categoria:
                            this.detectarCategoria(
                                limpia
                            ),

                        origen:
                            null

                    });

                }

            }
        );

        this.documentosProcesados =
            documentos.length;

        return documentos;

    },


    /* =====================================================
       CREAR DOCUMENTO DESDE ELEMENTO
    ===================================================== */

 crearDocumentoDesdeElemento(
    elemento
) {

    const imagen =
        elemento.matches("img")
            ? elemento
            : elemento.querySelector("img");

    const url =
        elemento.getAttribute("href") ||
        elemento.dataset.url ||
        elemento.dataset.file ||
        elemento.dataset.documento ||
        imagen?.getAttribute("src") ||
        "";

    if (
        !url ||
        url === "#" ||
        url.startsWith("javascript:")
    ) {

        return null;

    }


    const contenedorCercano =
        elemento.closest(
            [
                "[data-tipo]",
                "[data-categoria]",
                "[data-documento]",
                ".campo",
                ".campo-valor",
                ".archivo",
                ".documento",
                ".adjunto"
            ].join(",")
        );


    const etiquetaCercana =
        contenedorCercano?.querySelector(
            [
                ".campo-etiqueta",
                ".campo-label",
                ".label",
                "label",
                "strong",
                "h4",
                "h5"
            ].join(",")
        );


    const nombre =
        elemento.dataset.filename ||
        elemento.dataset.nombreArchivo ||
        elemento.getAttribute("download") ||
        elemento.getAttribute("title") ||
        imagen?.getAttribute("alt") ||
        etiquetaCercana?.textContent?.trim() ||
        this.obtenerNombreDesdeURL(
            url
        );


    const fecha =
        elemento.dataset.fecha ||
        contenedorCercano?.dataset.fecha ||
        elemento.closest("[data-fecha]")?.dataset.fecha ||
        "";


    const textoContexto =
        [
            nombre,
            elemento.dataset.tipo || "",
            elemento.dataset.categoria || "",
            contenedorCercano?.dataset.tipo || "",
            contenedorCercano?.dataset.categoria || "",
            etiquetaCercana?.textContent || "",
            contenedorCercano?.textContent || "",
            elemento.className || "",
            imagen?.className || "",
            imagen?.getAttribute("alt") || "",
            url
        ].join(" ");








      return {

        nombre:
            this.obtenerNombreDocumento(
                nombre,
                textoContexto,
                url
            ),

        url:
            url,

        fecha:
            this.formatearFecha(
                fecha
            ),

        categoria:
            this.detectarCategoria(
                textoContexto
            ),

        origen:
            elemento

    };

},


    /* =====================================================
       AGRUPAR
    ===================================================== */

    agruparDocumentos(
        documentos
    ) {

        const grupos = {

            dni:
                [],

            constancias:
                [],

            estudios:
                [],

            certificados:
                [],

            judicial:
                [],

            otros:
                []

        };

        documentos.forEach(
            documento => {

                const categoria =
                    grupos[
                        documento.categoria
                    ]
                        ? documento.categoria
                        : "otros";

                grupos[
                    categoria
                ].push(
                    documento
                );

            }
        );

        return grupos;

    },


    /* =====================================================
       CREAR VISTA
    ===================================================== */

    crearVista(
        grupos
    ) {

        const contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "falco-documentacion-view";

        contenedor.dataset.documentacionGenerated =
            "true";

            const resumen =
    this.crearResumen(
        grupos
    );

contenedor.appendChild(
    resumen
);

        const orden = [

            "dni",
            "constancias",
            "estudios",
            "certificados",
            "judicial",
            "otros"

        ];

        const titulos = {

            dni:
                "Documentación de identidad",

            constancias:
                "Constancias de tratamiento",

            estudios:
                "Estudios e informes",

            certificados:
                "Certificados y acreditaciones",

            judicial:
                "Documentación judicial",

            otros:
                "Otros documentos"

        };

        orden.forEach(
            categoria => {

                const documentos =
                    grupos[
                        categoria
                    ];

                if (
                    !documentos ||
                    documentos.length === 0
                ) {

                    return;

                }

                const tarjeta =
                    this.crearTarjeta(
                        categoria,
                        titulos[
                            categoria
                        ],
                        documentos
                    );

                contenedor.appendChild(
                    tarjeta
                );

                this.gruposGenerados++;

            }
        );

        return contenedor;

    },



/* =====================================================
   CREAR RESUMEN
===================================================== */

crearResumen(
    grupos
) {

    const categorias = [

        {
            clave:
                "dni",

            titulo:
                "Identidad"
        },

        {
            clave:
                "constancias",

            titulo:
                "Constancias"
        },

        {
            clave:
                "estudios",

            titulo:
                "Estudios"
        },

        {
            clave:
                "certificados",

            titulo:
                "Certificados"
        },

        {
            clave:
                "judicial",

            titulo:
                "Judicial"
        },

        {
            clave:
                "otros",

            titulo:
                "Otros"
        }

    ];


    const total =
        categorias.reduce(
            (
                acumulado,
                categoria
            ) => {

                return acumulado +
                    (
                        grupos[
                            categoria.clave
                        ]?.length ||
                        0
                    );

            },
            0
        );


    const resumen =
        document.createElement(
            "section"
        );

    resumen.className =
        "falco-documentacion-summary";


    const encabezado =
        document.createElement(
            "div"
        );

    encabezado.className =
        "falco-documentacion-summary-header";


    const titulo =
        document.createElement(
            "h4"
        );

    titulo.className =
        "falco-documentacion-summary-title";

    titulo.textContent =
        "Documentación aportada";


    const totalElemento =
        document.createElement(
            "span"
        );

    totalElemento.className =
        "falco-documentacion-summary-total";

    totalElemento.textContent =
        total === 1
            ? "1 documento"
            : `${total} documentos`;


    encabezado.append(
        titulo,
        totalElemento
    );


    const lista =
        document.createElement(
            "div"
        );

    lista.className =
        "falco-documentacion-summary-list";


    categorias.forEach(
        categoria => {

            const cantidad =
                grupos[
                    categoria.clave
                ]?.length ||
                0;

            if (
                cantidad === 0
            ) {

                return;

            }


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "falco-documentacion-summary-item";


            const nombre =
                document.createElement(
                    "span"
                );

            nombre.className =
                "falco-documentacion-summary-label";

            nombre.textContent =
                categoria.titulo;


            const contador =
                document.createElement(
                    "strong"
                );

            contador.className =
                "falco-documentacion-summary-count";

            contador.textContent =
                cantidad;


            item.append(
                nombre,
                contador
            );

            lista.appendChild(
                item
            );

        }
    );


    resumen.append(
        encabezado,
        lista
    );

    return resumen;

},





    /* =====================================================
       CREAR TARJETA
    ===================================================== */

    crearTarjeta(
        categoria,
        titulo,
        documentos
    ) {

        const tarjeta =
            document.createElement(
                "section"
            );

        tarjeta.className =
            [
                "falco-documentacion-card",
                `falco-documentacion-card-${categoria}`
            ].join(
                " "
            );

        tarjeta.dataset.documentacionType =
            categoria;


        const encabezado =
            document.createElement(
                "header"
            );

        encabezado.className =
            "falco-documentacion-card-header";


        const tituloElemento =
            document.createElement(
                "h4"
            );

        tituloElemento.className =
            "falco-documentacion-card-title";

        tituloElemento.textContent =
            titulo;


        const contador =
            document.createElement(
                "span"
            );

        contador.className =
            "falco-documentacion-card-count";

        contador.textContent =
            documentos.length === 1
                ? "1 archivo"
                : `${documentos.length} archivos`;


        encabezado.append(
            tituloElemento,
            contador
        );


        const cuerpo =
            document.createElement(
                "div"
            );

        cuerpo.className =
            "falco-documentacion-card-body";


        documentos.forEach(
            documento => {

                cuerpo.appendChild(
                    this.crearFilaDocumento(
                        documento
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


    /* =====================================================
       CREAR FILA
    ===================================================== */

    crearFilaDocumento(
        documento
    ) {

        const fila =
            document.createElement(
                "article"
            );

        fila.className =
            "falco-documentacion-item";


        const informacion =
            document.createElement(
                "div"
            );

        informacion.className =
            "falco-documentacion-info";


        const nombre =
            document.createElement(
                "strong"
            );

        nombre.className =
            "falco-documentacion-name";

        nombre.textContent =
            documento.nombre ||
            "Documento adjunto";


        informacion.appendChild(
            nombre
        );


        if (
            documento.fecha
        ) {

            const fecha =
                document.createElement(
                    "span"
                );

            fecha.className =
                "falco-documentacion-date";

            fecha.textContent =
                `Cargado el ${documento.fecha}`;

            informacion.appendChild(
                fecha
            );

        }


        const acciones =
            document.createElement(
                "div"
            );

        acciones.className =
            "falco-documentacion-actions";


        const ver =
            document.createElement(
                "a"
            );

        ver.className =
            [
                "falco-documentacion-button",
                "falco-documentacion-button-view"
            ].join(
                " "
            );

        ver.href =
            documento.url;

        ver.target =
            "_blank";

        ver.rel =
            "noopener noreferrer";

        ver.textContent =
            "Ver";







const descargar =
    document.createElement(
        "button"
    );

descargar.className =
    [
        "falco-documentacion-button",
        "falco-documentacion-button-download"
    ].join(
        " "
    );

descargar.type =
    "button";

descargar.textContent =
    "Descargar";

descargar.addEventListener(
    "click",
    () => {

        this.descargarDocumento(
            documento
        );

    }
);

acciones.append(
    ver,
    descargar
);



        fila.append(
            informacion,
            acciones
        );

        return fila;

    },



/* =====================================================
   DESCARGAR DOCUMENTO
===================================================== */

async descargarDocumento(
    documento
) {

    const url =
        documento?.url;

    if (
        !url
    ) {

        console.warn(
            "FALCO® Viewer Documentación™: URL de descarga no disponible."
        );

        return;

    }

    try {

        const respuesta =
            await fetch(
                url
            );

        if (
            !respuesta.ok
        ) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }

        const archivo =
            await respuesta.blob();

        const urlTemporal =
            URL.createObjectURL(
                archivo
            );

        const enlace =
            document.createElement(
                "a"
            );

        enlace.href =
            urlTemporal;

        enlace.download =
            documento.nombre ||
            this.obtenerNombreDesdeURL(
                url
            ) ||
            "documento";

        document.body.appendChild(
            enlace
        );

        enlace.click();

        enlace.remove();

        setTimeout(
            () => {

                URL.revokeObjectURL(
                    urlTemporal
                );

            },
            1000
        );

    } catch (
        error
    ) {

        console.error(
            "FALCO® Viewer Documentación™: no fue posible descargar el archivo.",
            error
        );

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }

},





    /* =====================================================
       INSERTAR VISTA
    ===================================================== */

    insertarVista() {

        if (
            this.contenidoOriginal ===
            this.modulo
        ) {

            const titulo =
                this.modulo.querySelector(
                    ".capitulo-titulo"
                );

            if (
                titulo
            ) {

                titulo.insertAdjacentElement(
                    "afterend",
                    this.contenedor
                );

                return;

            }

            this.modulo.appendChild(
                this.contenedor
            );

            return;

        }

        this.contenidoOriginal.insertAdjacentElement(
            "beforebegin",
            this.contenedor
        );

    },


    /* =====================================================
       OCULTAR ORIGINAL
    ===================================================== */

    ocultarContenidoOriginal() {

        if (
            this.contenidoOriginal ===
            this.modulo
        ) {

            Array.from(
                this.modulo.children
            ).forEach(
                hijo => {

                    if (
                        hijo !== this.contenedor &&
                        !hijo.classList.contains(
                            "capitulo-encabezado"
                        ) &&
                        !hijo.classList.contains(
                            "capitulo-titulo"
                        )
                    ) {

                        hijo.classList.add(
                            "falco-documentacion-original"
                        );

                    }

                }
            );

            return;

        }

        this.contenidoOriginal.classList.add(
            "falco-documentacion-original"
        );

    },


/* =====================================================
   DETECTAR CATEGORÍA
===================================================== */

detectarCategoria(
    valor
) {

    const texto =
        this.normalizarTexto(
            valor
        );

    if (
        texto.includes("dni") ||
        texto.includes("dnifrente") ||
        texto.includes("dnidorso") ||
        texto.includes("dni frente") ||
        texto.includes("dni dorso") ||
        texto.includes("documento identidad") ||
        texto.includes("documento de identidad") ||
        texto.includes("frente del documento") ||
        texto.includes("dorso del documento")
    ) {

        return "dni";

    }

    if (
        texto.includes("constancia") ||
        texto.includes("tratamiento") ||
        texto.includes("psicolog") ||
        texto.includes("psiquiatr")
    ) {

        return "constancias";

    }

    if (
        texto.includes("estudio") ||
        texto.includes("informe") ||
        texto.includes("historia clinica") ||
        texto.includes("epicrisis") ||
        texto.includes("diagnostico") ||
        texto.includes("resultado")
    ) {

        return "estudios";

    }

    if (
        texto.includes("certificado") ||
        texto.includes("cud") ||
        texto.includes("discapacidad") ||
        texto.includes("acreditacion")
    ) {

        return "certificados";

    }

    if (
        texto.includes("expediente") ||
        texto.includes("demanda") ||
        texto.includes("denuncia") ||
        texto.includes("causa") ||
        texto.includes("judicial") ||
        texto.includes("resolucion")
    ) {

        return "judicial";

    }

    return "otros";

},


    /* =====================================================
   OBTENER NOMBRE REPRESENTATIVO
===================================================== */

obtenerNombreDocumento(
    nombre,
    contexto,
    url
) {

    const nombreNormalizado =
        this.normalizarTexto(
            nombre
        );

    const contextoNormalizado =
        this.normalizarTexto(
            contexto
        );


    const nombresGenericos = [

        "abrir imagen en tamaño completo",
        "abrir imagen",
        "ver imagen",
        "ver archivo",
        "descargar",
        "documento adjunto",
        "archivo adjunto"

    ];


    const esGenerico =
        !nombreNormalizado ||
        nombresGenericos.includes(
            nombreNormalizado
        );


    if (
        contextoNormalizado.includes("dni frente") ||
        contextoNormalizado.includes("frente dni") ||
        contextoNormalizado.includes("documento frente")
    ) {

        return "DNI – Frente";

    }


    if (
        contextoNormalizado.includes("dni dorso") ||
        contextoNormalizado.includes("dorso dni") ||
        contextoNormalizado.includes("documento dorso")
    ) {

        return "DNI – Dorso";

    }





   if (
    contextoNormalizado.includes("certificado")
) {

    return "Certificado adjunto";

}


 if (
    contextoNormalizado.includes("constancia")
) {

    return "Constancia de tratamiento";

}


    if (
        contextoNormalizado.includes("estudio") ||
        contextoNormalizado.includes("informe")
    ) {

       return "Estudio o informe";

    }


    if (
        !esGenerico
    ) {

        return this.limpiarNombre(
            nombre
        );

    }


    return this.obtenerNombreDesdeURL(
        url
    );

},


    /* =====================================================
       UTILIDADES
    ===================================================== */

    obtenerNombreDesdeURL(
        url
    ) {

        try {

            const ruta =
                new URL(
                    url,
                    window.location.href
                ).pathname;

            const nombre =
                ruta
                    .split(
                        "/"
                    )
                    .pop();

            return this.limpiarNombre(
                decodeURIComponent(
                    nombre ||
                    "Documento adjunto"
                )
            );

        } catch {

            return "Documento adjunto";

        }

    },


    limpiarNombre(
        nombre
    ) {

        return String(
            nombre ||
            "Documento adjunto"
        )
            .replace(
                /[_-]+/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    },


    formatearFecha(
        valor
    ) {

        if (
            !valor
        ) {

            return "";

        }

        const fecha =
            new Date(
                valor
            );

        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return String(
                valor
            );

        }

        return fecha.toLocaleDateString(
            "es-AR",
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );

    },


    normalizarTexto(
        valor
    ) {

        return String(
            valor ||
            ""
        )
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[_-]+/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }

};


window.FalcoViewerDocumentacion =
    FalcoViewerDocumentacion;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerDocumentacion.iniciar();

    }
);