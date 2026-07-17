/* =========================================================
   FALCO® Viewer Familiar™ v1.0

   Función:
   - Convierte Grupo Familiar en fichas profesionales.
   - Lee los datos ya renderizados por el Viewer.
   - No modifica Firestore ni el Core.
   - Conserva la estructura original como respaldo.
========================================================= */

const FalcoViewerFamily = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    capitulo: null,

    contenidoOriginal: null,

    contenedorFichas: null,


    /* =====================================================
       CONFIGURACIÓN DE ENTIDADES
    ===================================================== */

    entidades: {

        padre: {
            titulo: "Padre",
            orden: 1
        },

        madre: {
            titulo: "Madre",
            orden: 2
        },

        pareja: {
            titulo: "Pareja y convivencia",
            orden: 3
        },

        hermanos: {
            titulo: "Hermanos",
            orden: 4
        },

        hijos: {
            titulo: "Hijos y grupo conviviente",
            orden: 5
        },

        general: {
            titulo: "Información familiar",
            orden: 6
        }

    },


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        console.info(
            `FALCO Viewer Familiar™ v${this.version} Ready`
        );

        this.esperarCapitulo();

    },


    /* =====================================================
       ESPERAR RENDERIZADO
    ===================================================== */

    esperarCapitulo() {

        this.intervalo =
            window.setInterval(() => {

                this.intentos++;

                const capitulo =
                    document.querySelector(
                        '[data-modulo="grupo-familiar"]'
                    );

                const cleanupActivo =
                    document
                        .getElementById("expediente")
                        ?.classList
                        .contains(
                            "falco-cleanup-activo"
                        );

                const campos =
                    capitulo?.querySelectorAll(
                        ".falco-bloque-dato"
                    );

                if (
                    capitulo &&
                    cleanupActivo &&
                    campos?.length
                ) {

                    window.clearInterval(
                        this.intervalo
                    );

                    this.capitulo =
                        capitulo;

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
                        "FALCO Viewer Familiar™ no encontró el capítulo preparado."
                    );

                }

            }, 250);

    },


    /* =====================================================
       APLICAR VIEWER FAMILIAR
    ===================================================== */

    aplicar() {

        if (
            !this.capitulo ||
            this.capitulo.classList.contains(
                "falco-family-activo"
            )
        ) {
            return;
        }

        this.contenidoOriginal =
            this.capitulo.querySelector(
                ".capitulo-contenido"
            );

        if (!this.contenidoOriginal) {

            console.warn(
                "FALCO Viewer Familiar™ no encontró el contenido del capítulo."
            );

            return;

        }

        const campos =
            this.obtenerCamposVisibles();

        if (!campos.length) {

            console.info(
                "FALCO Viewer Familiar™ no encontró información visible."
            );

            return;

        }

        const grupos =
            this.agruparCampos(
                campos
            );

        this.contenedorFichas =
            this.crearContenedor(
                grupos
            );

        if (!this.contenedorFichas) {
            return;
        }

        /*
         * La estructura original no se elimina.
         * Solo se oculta después de crear correctamente
         * la vista profesional.
         */

        this.contenidoOriginal
            .classList
            .add(
                "falco-family-original"
            );

        this.contenidoOriginal
            .setAttribute(
                "aria-hidden",
                "true"
            );

        this.contenidoOriginal
            .insertAdjacentElement(
                "beforebegin",
                this.contenedorFichas
            );

        this.capitulo
            .classList
            .add(
                "falco-family-activo"
            );

        this.capitulo.dataset
            .familyVersion =
            this.version;

        console.info(
            "FALCO Viewer Familiar™ aplicado correctamente.",
            {
                camposProcesados:
                    campos.length,

                fichasGeneradas:
                    Object.keys(
                        grupos
                    ).length
            }
        );

    },


    /* =====================================================
       OBTENER CAMPOS VISIBLES
    ===================================================== */

    obtenerCamposVisibles() {

        return Array.from(
            this.capitulo.querySelectorAll(
                ".falco-bloque-dato"
            )
        )
        .filter(
            bloque => {

                return (
                    !bloque.hidden &&
                    !bloque.classList.contains(
                        "falco-campo-vacio"
                    )
                );

            }
        )
        .map(
            bloque => {

                const tipo =
                    bloque.dataset.tipoCampo ||
                    "general";

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
                    tipo,
                    etiqueta,
                    valor,
                    bloque
                };

            }
        )
        .filter(
            campo =>
                campo.etiqueta &&
                campo.valor
        );

    },


    /* =====================================================
       AGRUPAR CAMPOS
    ===================================================== */

    agruparCampos(campos) {

        const grupos = {};

        campos.forEach(
            campo => {

                const tipo =
                    this.entidades[
                        campo.tipo
                    ]
                        ? campo.tipo
                        : "general";

                if (!grupos[tipo]) {

                    grupos[tipo] = [];

                }

                grupos[tipo].push(
                    campo
                );

            }
        );

        return grupos;

    },


    /* =====================================================
       CREAR CONTENEDOR
    ===================================================== */

    crearContenedor(grupos) {

        const tipos =
            Object.keys(
                grupos
            )
            .sort(
                (a, b) => {

                    const ordenA =
                        this.entidades[a]
                            ?.orden ??
                        999;

                    const ordenB =
                        this.entidades[b]
                            ?.orden ??
                        999;

                    return ordenA -
                        ordenB;

                }
            );

        if (!tipos.length) {
            return null;
        }

        const contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "falco-family-view";

        contenedor.dataset
            .familyGenerated =
            "true";

        tipos.forEach(
            tipo => {

                const ficha =
                    this.crearFicha(
                        tipo,
                        grupos[tipo]
                    );

                if (ficha) {

                    contenedor.appendChild(
                        ficha
                    );

                }

            }
        );

        return contenedor;

    },


    /* =====================================================
       CREAR FICHA
    ===================================================== */

    crearFicha(
        tipo,
        campos
    ) {

        if (
            !campos ||
            !campos.length
        ) {
            return null;
        }

        const configuracion =
            this.entidades[tipo] ||
            this.entidades.general;

        const ficha =
            document.createElement(
                "article"
            );

        ficha.className =
            `falco-family-card falco-family-card-${tipo}`;

        ficha.dataset.familyType =
            tipo;

        const encabezado =
            document.createElement(
                "header"
            );

        encabezado.className =
            "falco-family-card-header";

        const titulo =
            document.createElement(
                "h3"
            );

        titulo.className =
            "falco-family-card-title";

        titulo.textContent =
            configuracion.titulo;

        const contador =
            document.createElement(
                "span"
            );

        contador.className =
            "falco-family-card-count";

        contador.textContent =
            `${campos.length} ${
                campos.length === 1
                    ? "dato"
                    : "datos"
            }`;

        encabezado.append(
            titulo,
            contador
        );

        const cuerpo =
            document.createElement(
                "dl"
            );

        cuerpo.className =
            "falco-family-card-body";

        campos
            .sort(
                (
                    campoA,
                    campoB
                ) =>
                    this.obtenerOrdenCampo(
                        campoA.etiqueta
                    ) -
                    this.obtenerOrdenCampo(
                        campoB.etiqueta
                    )
            )
            .forEach(
                campo => {

                    const fila =
                        this.crearFila(
                            campo
                        );

                    cuerpo.appendChild(
                        fila
                    );

                }
            );

        ficha.append(
            encabezado,
            cuerpo
        );

        return ficha;

    },


    /* =====================================================
       CREAR FILA
    ===================================================== */

    crearFila(campo) {

        const fila =
            document.createElement(
                "div"
            );

        fila.className =
            "falco-family-row";

        const etiqueta =
            document.createElement(
                "dt"
            );

        etiqueta.className =
            "falco-family-label";

        etiqueta.textContent =
            this.formatearEtiqueta(
                campo.etiqueta
            );

        const valor =
            document.createElement(
                "dd"
            );

        valor.className =
            "falco-family-value";

        valor.textContent =
            this.formatearValor(
                campo.etiqueta,
                campo.valor
            );

        fila.append(
            etiqueta,
            valor
        );

        return fila;

    },


    /* =====================================================
       FORMATEAR ETIQUETAS
    ===================================================== */

    formatearEtiqueta(etiqueta) {

        const reemplazos = {

            "Padre Vive":
                "Vive",

            "Madre Vive":
                "Vive",

            "Nombre Padre":
                "Nombre",

            "Nombre Madre":
                "Nombre",

            "Edad Padre":
                "Edad",

            "Edad Madre":
                "Edad",

            "Ocupacion Padre":
                "Ocupación",

            "Ocupacion Madre":
                "Ocupación",

            "Tiene Hermanos":
                "Tiene hermanos",

            "Cantidad Hermanos":
                "Cantidad",

            "Tiene Hijos":
                "Tiene hijos",

            "Cantidad Hijos":
                "Cantidad",

            "Descripcion Convivencia":
                "Descripción de la convivencia",

            "Personas Convivientes":
                "Personas convivientes"

        };

        if (
            reemplazos[etiqueta]
        ) {

            return reemplazos[
                etiqueta
            ];

        }

        return etiqueta
            .replace(
                /([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g,
                "$1 $2"
            )
            .replace(
                /\bOcupacion\b/g,
                "Ocupación"
            )
            .replace(
                /\bDescripcion\b/g,
                "Descripción"
            )
            .replace(
                /\bRelacion\b/g,
                "Relación"
            )
            .trim();

    },


    /* =====================================================
       FORMATEAR VALORES
    ===================================================== */

    formatearValor(
        etiqueta,
        valor
    ) {

        const texto =
            String(
                valor
            ).trim();

        if (
            etiqueta
                .toLowerCase()
                .includes(
                    "edad"
                ) &&
            /^\d+$/.test(
                texto
            )
        ) {

            return `${texto} años`;

        }

        return texto;

    },


    /* =====================================================
       ORDEN DE CAMPOS
    ===================================================== */

    obtenerOrdenCampo(etiqueta) {

        const texto =
            etiqueta.toLowerCase();

        const prioridades = [

            "nombre",
            "edad",
            "vive",
            "ocupacion",
            "ocupación",
            "tiene",
            "cantidad",
            "personas convivientes",
            "descripcion convivencia",
            "descripción convivencia",
            "vinculo",
            "vínculo",
            "apoyo",
            "frecuencia",
            "observaciones"

        ];

        const indice =
            prioridades.findIndex(
                prioridad =>
                    texto.includes(
                        prioridad
                    )
            );

        return indice === -1
            ? 999
            : indice;

    },


    /* =====================================================
       RESTAURAR VISTA ORIGINAL
    ===================================================== */

    restaurar() {

        this.capitulo =
            document.querySelector(
                '[data-modulo="grupo-familiar"]'
            );

        if (!this.capitulo) {
            return;
        }

        this.capitulo
            .querySelectorAll(
                '[data-family-generated="true"]'
            )
            .forEach(
                elemento =>
                    elemento.remove()
            );

        const original =
            this.capitulo.querySelector(
                ".falco-family-original"
            );

        if (original) {

            original.classList.remove(
                "falco-family-original"
            );

            original.removeAttribute(
                "aria-hidden"
            );

        }

        this.capitulo.classList.remove(
            "falco-family-activo"
        );

        delete this.capitulo.dataset
            .familyVersion;

        console.info(
            "FALCO Viewer Familiar™ restaurado."
        );

    }

};


/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerFamily =
    FalcoViewerFamily;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerFamily.init();

    }
);