/* =========================================================
   FALCO® VIEWER LABORAL™ v2.0
   Implementado sobre FALCO® Viewer Base™
========================================================= */

const FalcoViewerLaboral =
    FalcoViewerBase.crear({

        version:
            "2.0",

        nombre:
            "Viewer Laboral™",

        selectorModulo:
            '[data-modulo="trabajo-actual"]',

        claseContenedor:
            "falco-laboral-viewer",

        claseTarjeta:
            "falco-laboral-tarjeta",

        claseEncabezado:
            "falco-laboral-encabezado",

        claseTitulo:
            "falco-laboral-titulo",

        claseCuerpo:
            "falco-laboral-cuerpo",

        claseFila:
            "falco-laboral-item",

        claseEtiqueta:
            "falco-laboral-etiqueta",

        claseValor:
            "falco-laboral-valor",

        claseOriginal:
            "falco-laboral-original",

        claseActivo:
            "falco-laboral-activo",

        datasetAplicado:
            "viewerLaboralAplicado",

        datasetGenerado:
            "laboralGenerated",

        datasetTipo:
            "tipoLaboral",

        modoInsercion:
            "append",

        ocultarOriginal:
            "campos",

        ordenGrupos: [

            "situacion",
            "empleo",
            "funciones"

        ],

        titulos: {

            situacion:
                "Situación laboral",

            empleo:
                "Datos del empleo",

            funciones:
                "Funciones e impacto"

        },


        /* =================================================
           DETECTAR GRUPO
        ================================================= */

        detectarGrupo(
            campo
        ) {

            const etiqueta =
                this.normalizarTexto(
                    campo.etiqueta
                );

            const mapaCampos = {

                "trabaja actualmente":
                    "situacion",

                "empresa actual":
                    "empleo",

                "puesto actual":
                    "empleo",

                "antiguedad actual":
                    "empleo",

                "horario actual":
                    "empleo",

                "tareas actuales":
                    "funciones",

                "impacto laboral":
                    "funciones"

            };

            return mapaCampos[
                etiqueta
            ] ||
            "funciones";

        },


        /* =================================================
           FORMATEAR ETIQUETA
        ================================================= */

        formatearEtiqueta(
            etiqueta
        ) {

            const reemplazos = {

                "Trabaja Actualmente":
                    "Trabaja actualmente",

                "Empresa Actual":
                    "Empresa",

                "Puesto Actual":
                    "Puesto",

                "Antiguedad Actual":
                    "Antigüedad",

                "Antigüedad Actual":
                    "Antigüedad",

                "Horario Actual":
                    "Horario",

                "Tareas Actuales":
                    "Tareas",

                "Impacto Laboral":
                    "Impacto laboral"

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
                    /\bAntiguedad\b/g,
                    "Antigüedad"
                )
                .trim();

        },


        /* =================================================
           FORMATEAR VALOR
        ================================================= */

        formatearValor(
            etiqueta,
            valor
        ) {

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

            const texto =
                this.normalizarTexto(
                    campo.etiqueta
                );

            const prioridades = [

                "trabaja actualmente",
                "empresa actual",
                "puesto actual",
                "antiguedad actual",
                "horario actual",
                "tareas actuales",
                "impacto laboral"

            ];

            const indice =
                prioridades.indexOf(
                    texto
                );

            return indice === -1
                ? 999
                : indice;

        }

    });


window.FalcoViewerLaboral =
    FalcoViewerLaboral;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerLaboral.iniciar();

    }
);