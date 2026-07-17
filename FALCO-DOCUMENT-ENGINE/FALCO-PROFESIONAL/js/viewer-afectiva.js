/* =========================================================
   FALCO® Viewer Área Afectiva™ v1.0

   Función:
   - Organiza el capítulo Área Afectiva.
   - Lee datos ya renderizados.
   - No modifica Firestore ni el Core.
   - Conserva la vista original como respaldo.
========================================================= */

const FalcoViewerAfectiva = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    capitulo: null,

    contenidoOriginal: null,

    contenedor: null,


    /* =====================================================
       CONFIGURACIÓN DE GRUPOS
    ===================================================== */

    grupos: {

        situacion: {
            titulo: "Situación afectiva",
            orden: 1
        },

        pareja: {
            titulo: "Pareja actual",
            orden: 2
        },

        convivencia: {
            titulo: "Convivencia y familia en común",
            orden: 3
        },

        general: {
            titulo: "Información afectiva",
            orden: 99
        }

    },


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        console.info(
            `FALCO Viewer Área Afectiva™ v${this.version} Ready`
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
                        '[data-modulo="area-afectiva"]'
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
                        "FALCO Viewer Área Afectiva™ no encontró el capítulo preparado."
                    );

                }

            }, 250);

    },


    /* =====================================================
       APLICAR VIEWER
    ===================================================== */

    aplicar() {

        if (
            !this.capitulo ||
            this.capitulo.classList.contains(
                "falco-afectiva-activo"
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
                "FALCO Viewer Área Afectiva™ no encontró el contenido original."
            );

            return;

        }

        const campos =
            this.obtenerCamposVisibles();

        if (!campos.length) {

            console.info(
                "FALCO Viewer Área Afectiva™ no encontró información visible."
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

        if (!this.contenedor) {
            return;
        }

        this.contenidoOriginal
            .classList
            .add(
                "falco-afectiva-original"
            );

        this.contenidoOriginal
            .setAttribute(
                "aria-hidden",
                "true"
            );

        this.contenidoOriginal
            .insertAdjacentElement(
                "beforebegin",
                this.contenedor
            );


/* =====================================================
   OCULTAR CONTENIDO ORIGINAL
===================================================== */

this.contenidoOriginal.hidden = true;

this.contenidoOriginal.style.display = "none";




        this.capitulo
            .classList
            .add(
                "falco-afectiva-activo"
            );

        this.capitulo.dataset
            .afectivaVersion =
            this.version;

        console.info(
            "FALCO Viewer Área Afectiva™ aplicado correctamente.",
            {
                camposProcesados:
                    campos.length,

                gruposGenerados:
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
            bloque =>
                !bloque.hidden &&
                !bloque.classList.contains(
                    "falco-campo-vacio"
                )
        )
        .map(
            bloque => {

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
                        bloque.dataset.tipoCampo ||
                        "general",
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

        const resultado = {};

        campos.forEach(
            campo => {

                const tipo =
                    this.detectarGrupo(
                        campo.etiqueta
                    );

                if (!resultado[tipo]) {

                    resultado[tipo] = [];

                }

                resultado[tipo].push(
                    campo
                );

            }
        );

        return resultado;

    },


    /* =====================================================
       DETECTAR GRUPO
    ===================================================== */

    detectarGrupo(etiqueta) {

        const texto =
            String(etiqueta)
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );

        if (
            texto.includes(
                "estado civil"
            ) ||
            texto.includes(
                "tiene pareja"
            )
        ) {

            return "situacion";

        }

        if (
            texto.includes(
                "nombre pareja"
            ) ||
            texto.includes(
                "edad pareja"
            ) ||
            texto.includes(
                "ocupacion pareja"
            ) ||
            texto.includes(
                "tiempo relacion"
            )
        ) {

            return "pareja";

        }

        if (
            texto.includes(
                "conviven"
            ) ||
            texto.includes(
                "hijos comun"
            ) ||
            texto.includes(
                "hijos en comun"
            ) ||
            texto.includes(
                "convivencia"
            )
        ) {

            return "convivencia";

        }

        return "general";

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
                (a, b) =>
                    (
                        this.grupos[a]
                            ?.orden ??
                        999
                    ) -
                    (
                        this.grupos[b]
                            ?.orden ??
                        999
                    )
            );

        if (!tipos.length) {
            return null;
        }

        const contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "falco-afectiva-view";

        contenedor.dataset
            .afectivaGenerated =
            "true";

        tipos.forEach(
            tipo => {

                const tarjeta =
                    this.crearTarjeta(
                        tipo,
                        grupos[tipo]
                    );

                if (tarjeta) {

                    contenedor.appendChild(
                        tarjeta
                    );

                }

            }
        );

        return contenedor;

    },


    /* =====================================================
       CREAR TARJETA
    ===================================================== */

    crearTarjeta(
        tipo,
        campos
    ) {

        if (!campos?.length) {
            return null;
        }

        const configuracion =
            this.grupos[tipo] ||
            this.grupos.general;

        const tarjeta =
            document.createElement(
                "article"
            );

        tarjeta.className =
            `falco-afectiva-card falco-afectiva-card-${tipo}`;

        const encabezado =
            document.createElement(
                "header"
            );

        encabezado.className =
            "falco-afectiva-card-header";

        const titulo =
            document.createElement(
                "h3"
            );

        titulo.className =
            "falco-afectiva-card-title";

        titulo.textContent =
            configuracion.titulo;

        encabezado.appendChild(
            titulo
        );

        const cuerpo =
            document.createElement(
                "dl"
            );

        cuerpo.className =
            "falco-afectiva-card-body";

        campos
            .sort(
                (a, b) =>
                    this.obtenerOrdenCampo(
                        a.etiqueta
                    ) -
                    this.obtenerOrdenCampo(
                        b.etiqueta
                    )
            )
            .forEach(
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


    /* =====================================================
       CREAR FILA
    ===================================================== */

    crearFila(campo) {

        const fila =
            document.createElement(
                "div"
            );

        fila.className =
            "falco-afectiva-row";

        const etiqueta =
            document.createElement(
                "dt"
            );

        etiqueta.className =
            "falco-afectiva-label";

        etiqueta.textContent =
            this.formatearEtiqueta(
                campo.etiqueta
            );

        const valor =
            document.createElement(
                "dd"
            );

        valor.className =
            "falco-afectiva-value";

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

            "Nombre Pareja":
                "Nombre",

            "Edad Pareja":
                "Edad",

            "Ocupacion Pareja":
                "Ocupación",

            "Tiempo Relacion":
                "Tiempo de relación",

            "Hijos Comun":
                "Hijos en común",

            "Tiene Pareja":
                "Tiene pareja",

            "Estado Civil":
                "Estado civil"

        };

        if (reemplazos[etiqueta]) {

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
            String(valor).trim();

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

            "estado civil",
            "tiene pareja",
            "nombre",
            "edad",
            "ocupacion",
            "ocupación",
            "tiempo",
            "conviven",
            "hijos"

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
       RESTAURAR
    ===================================================== */

    restaurar() {

        this.capitulo =
            document.querySelector(
                '[data-modulo="area-afectiva"]'
            );

        if (!this.capitulo) {
            return;
        }

        this.capitulo
            .querySelectorAll(
                '[data-afectiva-generated="true"]'
            )
            .forEach(
                elemento =>
                    elemento.remove()
            );

        const original =
            this.capitulo.querySelector(
                ".falco-afectiva-original"
            );

        if (original) {

            original.classList.remove(
                "falco-afectiva-original"
            );

            original.removeAttribute(
                "aria-hidden"
            );

        }

        this.capitulo.classList.remove(
            "falco-afectiva-activo"
        );

        delete this.capitulo.dataset
            .afectivaVersion;

        console.info(
            "FALCO Viewer Área Afectiva™ restaurado."
        );

    }

};


/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerAfectiva =
    FalcoViewerAfectiva;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerAfectiva.init();

    }
);