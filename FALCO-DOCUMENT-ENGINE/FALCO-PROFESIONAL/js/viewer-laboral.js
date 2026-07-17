/* =========================================================
   FALCO® VIEWER LABORAL™ v1.0
   Presentación profesional del capítulo Trabajo actual
========================================================= */

const FalcoViewerLaboral = {

    version:
        "1.0",

    selectorModulo:
        '[data-modulo="trabajo-actual"]',

    mapaCampos: {

        "trabaja actualmente":
            "situacion",

        "empresa actual":
            "empleo",

        "puesto actual":
            "empleo",

        "antiguedad actual":
            "empleo",

        "antigüedad actual":
            "empleo",

        "horario actual":
            "empleo",

        "tareas actuales":
            "funciones",

        "impacto laboral":
            "funciones"

    },

    titulos: {

        situacion:
            "Situación laboral",

        empleo:
            "Datos del empleo",

        funciones:
            "Funciones e impacto"

    },

    iniciar() {

        const aplicar = () => {

            const modulo =
                document.querySelector(
                    this.selectorModulo
                );

            if (!modulo) {

                return false;

            }

            if (
                modulo.dataset
                    .viewerLaboralAplicado ===
                this.version
            ) {

                return true;

            }

            this.aplicar(
                modulo
            );

            return true;

        };

        if (
            aplicar()
        ) {

            return;

        }

        const observer =
            new MutationObserver(
                () => {

                    if (
                        aplicar()
                    ) {

                        observer.disconnect();

                    }

                }
            );

        observer.observe(
            document.body,
            {
                childList:
                    true,

                subtree:
                    true
            }
        );

    },

    normalizarTexto(
        texto = ""
    ) {

        return texto
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

    obtenerCampos(
        modulo
    ) {

        return Array.from(
            modulo.querySelectorAll(
                ".falco-bloque-dato"
            )
        )
        .filter(
            campo =>
                !campo.hidden &&
                campo.dataset
                    .cleanupHidden !==
                "true"
        );

    },

    obtenerDatosCampo(
        campo
    ) {

        const etiquetaElemento =
            campo.querySelector(
                ".falco-etiqueta-dato"
            );

        const valorElemento =
            campo.querySelector(
                ".falco-valor-dato"
            );

        const etiqueta =
            etiquetaElemento
                ?.textContent
                .replace(
                    /\s+/g,
                    " "
                )
                .trim() ||
            "";

        const valor =
            valorElemento
                ?.textContent
                .replace(
                    /\s+/g,
                    " "
                )
                .trim() ||
            "";

        return {
            etiqueta,
            valor
        };

    },

    crearItem(
        etiqueta,
        valor
    ) {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "falco-laboral-item";

        const etiquetaNodo =
            document.createElement(
                "div"
            );

        etiquetaNodo.className =
            "falco-laboral-etiqueta";

        etiquetaNodo.textContent =
            etiqueta;

        const valorNodo =
            document.createElement(
                "div"
            );

        valorNodo.className =
            "falco-laboral-valor";

        valorNodo.textContent =
            valor;

        item.append(
            etiquetaNodo,
            valorNodo
        );

        return item;

    },

    crearTarjeta(
        clave,
        campos
    ) {

        const tarjeta =
            document.createElement(
                "section"
            );

        tarjeta.className =
            `falco-laboral-tarjeta falco-laboral-${clave}`;

        tarjeta.dataset
            .tipoLaboral =
            clave;

        const encabezado =
            document.createElement(
                "header"
            );

        encabezado.className =
            "falco-laboral-encabezado";

        const titulo =
            document.createElement(
                "h4"
            );

        titulo.className =
            "falco-laboral-titulo";

        titulo.textContent =
            this.titulos[clave];

        encabezado.appendChild(
            titulo
        );

        const cuerpo =
            document.createElement(
                "div"
            );

        cuerpo.className =
            "falco-laboral-cuerpo";

        campos.forEach(
            campo => {

                cuerpo.appendChild(
                    this.crearItem(
                        campo.etiqueta,
                        campo.valor
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

    aplicar(
        modulo
    ) {

        const camposOriginales =
            this.obtenerCampos(
                modulo
            );

        if (
            !camposOriginales.length
        ) {

            return;

        }

        const grupos = {

            situacion:
                [],

            empleo:
                [],

            funciones:
                []

        };

        camposOriginales.forEach(
            campo => {

                const datos =
                    this.obtenerDatosCampo(
                        campo
                    );

                const etiquetaNormalizada =
                    this.normalizarTexto(
                        datos.etiqueta
                    );

                const grupo =
                    this.mapaCampos[
                        etiquetaNormalizada
                    ];

                if (
                    !grupo ||
                    !datos.valor
                ) {

                    return;

                }

                grupos[grupo].push(
                    datos
                );

            }
        );

        const contenedor =
            document.createElement(
                "div"
            );

        contenedor.className =
            "falco-laboral-viewer";

        contenedor.dataset
            .laboralVersion =
            this.version;

        [
            "situacion",
            "empleo",
            "funciones"
        ]
        .forEach(
            clave => {

                if (
                    !grupos[clave].length
                ) {

                    return;

                }

                contenedor.appendChild(
                    this.crearTarjeta(
                        clave,
                        grupos[clave]
                    )
                );

            }
        );

        if (
            !contenedor.children.length
        ) {

            return;

        }

        camposOriginales.forEach(
            campo => {

                campo.classList.add(
                    "falco-laboral-original"
                );

            }
        );

        const contenido =
            modulo.querySelector(
                ".capitulo-contenido"
            ) ||
            modulo;

        contenido.appendChild(
            contenedor
        );

        modulo.dataset
            .viewerLaboralAplicado =
            this.version;

        console.log(
            "FALCO Viewer Laboral™ aplicado correctamente.",
            {
                camposProcesados:
                    camposOriginales.length,

                tarjetasGeneradas:
                    contenedor.children.length
            }
        );

    },

    restaurar() {

        const modulo =
            document.querySelector(
                this.selectorModulo
            );

        if (!modulo) {

            return;

        }

        modulo
            .querySelector(
                ".falco-laboral-viewer"
            )
            ?.remove();

        modulo
            .querySelectorAll(
                ".falco-laboral-original"
            )
            .forEach(
                campo => {

                    campo.classList.remove(
                        "falco-laboral-original"
                    );

                }
            );

        delete modulo.dataset
            .viewerLaboralAplicado;

        console.log(
            "FALCO Viewer Laboral™ restaurado."
        );

    }

};


window.FalcoViewerLaboral =
    FalcoViewerLaboral;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerLaboral.iniciar();

    }
);


console.log(
    "FALCO Viewer Laboral™ v1.0 Ready"
);