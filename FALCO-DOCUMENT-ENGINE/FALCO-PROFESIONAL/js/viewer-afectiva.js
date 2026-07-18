/* =========================================================
   FALCO® VIEWER ÁREA AFECTIVA™ v2.0
   Implementado sobre FALCO® Viewer Base™
========================================================= */

const FalcoViewerAfectiva =
    FalcoViewerBase.crear({

        version:
            "2.0",

        nombre:
            "Viewer Área Afectiva™",

        selectorModulo:
            '[data-modulo="area-afectiva"]',

        claseContenedor:
            "falco-afectiva-view",

        claseTarjeta:
            "falco-afectiva-card",

        claseEncabezado:
            "falco-afectiva-card-header",

        claseTitulo:
            "falco-afectiva-card-title",

        claseCuerpo:
            "falco-afectiva-card-body",

        claseFila:
            "falco-afectiva-row",

        claseEtiqueta:
            "falco-afectiva-label",

        claseValor:
            "falco-afectiva-value",

        claseOriginal:
            "falco-afectiva-original",

        claseActivo:
            "falco-afectiva-activo",

        datasetAplicado:
            "afectivaVersion",

        datasetGenerado:
            "afectivaGenerated",

        datasetTipo:
            "afectivaType",

        modoInsercion:
            "before",

        ocultarOriginal:
            "contenido",

        elementoCuerpo:
            "dl",

        elementoEtiqueta:
            "dt",

        elementoValor:
            "dd",

        ordenGrupos: [

            "situacion",
            "pareja",
            "convivencia",
            "general"

        ],

        titulos: {

            situacion:
                "Situación afectiva",

            pareja:
                "Pareja actual",

            convivencia:
                "Convivencia y familia en común",

            general:
                "Información afectiva"

        },


        /* =================================================
           DETECTAR GRUPO
        ================================================= */

        detectarGrupo(
            campo
        ) {

            const texto =
                this.normalizarTexto(
                    campo.etiqueta
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


        /* =================================================
           FORMATEAR ETIQUETAS
        ================================================= */

        formatearEtiqueta(
            etiqueta
        ) {

            const reemplazos = {

                "Nombre Pareja":
                    "Nombre",

                "Edad Pareja":
                    "Edad",

                "Ocupacion Pareja":
                    "Ocupación",

                "Ocupación Pareja":
                    "Ocupación",

                "Tiempo Relacion":
                    "Tiempo de relación",

                "Tiempo Relación":
                    "Tiempo de relación",

                "Hijos Comun":
                    "Hijos en común",

                "Hijos Común":
                    "Hijos en común",

                "Tiene Pareja":
                    "Tiene pareja",

                "Estado Civil":
                    "Estado civil"

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
                    /\bRelacion\b/g,
                    "Relación"
                )
                .trim();

        },


        /* =================================================
           FORMATEAR VALORES
        ================================================= */

        formatearValor(
            etiqueta,
            valor
        ) {

            const texto =
                String(
                    valor
                ).trim();

            if (
                this.normalizarTexto(
                    etiqueta
                )
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


        /* =================================================
           ORDEN DE CAMPOS
        ================================================= */

        obtenerOrdenCampo(
            campo
        ) {

            const texto =
                this.normalizarTexto(
                    campo.etiqueta
                );

            const prioridades = [

                "estado civil",
                "tiene pareja",
                "nombre pareja",
                "edad pareja",
                "ocupacion pareja",
                "tiempo relacion",
                "conviven",
                "hijos comun",
                "hijos en comun",
                "convivencia"

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

        }

    });


window.FalcoViewerAfectiva =
    FalcoViewerAfectiva;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerAfectiva.iniciar();

    }
);