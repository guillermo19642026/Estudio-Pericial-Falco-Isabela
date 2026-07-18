/* =========================================================
   FALCO® VIEWER EDUCACIÓN Y FORMACIÓN™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza el capítulo Educación y formación.
   - Separa nivel educativo, estudios y trayectoria.
   - Identifica interrupciones, dificultades e impacto.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerEducacion =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Educación y Formación™",

        selectorModulo:
            '[data-modulo="educacion"]',

        claseContenedor:
            "falco-educacion-view",

        claseTarjeta:
            "falco-educacion-card",

        claseEncabezado:
            "falco-educacion-card-header",

        claseTitulo:
            "falco-educacion-card-title",

        claseCuerpo:
            "falco-educacion-card-body",

        claseFila:
            "falco-educacion-row",

        claseEtiqueta:
            "falco-educacion-label",

        claseValor:
            "falco-educacion-value",

        claseOriginal:
            "falco-educacion-original",

        claseActivo:
            "falco-educacion-activo",

        datasetAplicado:
            "educacionVersion",

        datasetGenerado:
            "educacionGenerated",

        datasetTipo:
            "educacionType",

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

            "nivel",
            "estudios",
            "trayectoria",
            "impacto",
            "general"

        ],

        titulos: {

            nivel:
                "Nivel educativo",

            estudios:
                "Estudios y formación",

            trayectoria:
                "Trayectoria académica",

            impacto:
                "Dificultades e impacto actual",

            general:
                "Información educativa"

        },


        /* =================================================
           DETECTAR GRUPO
        ================================================= */

        detectarGrupo(
            campo
        ) {

            const texto =
                this.normalizarTexto(
                    `${campo.etiqueta || ""} ${campo.tipo || ""}`
                );


            /*
             * DIFICULTADES E IMPACTO
             */

            if (
                texto.includes(
                    "dificultad"
                ) ||
                texto.includes(
                    "impacto"
                ) ||
                texto.includes(
                    "afecto"
                ) ||
                texto.includes(
                    "afectacion"
                ) ||
                texto.includes(
                    "interrump"
                ) ||
                texto.includes(
                    "abandono"
                ) ||
                texto.includes(
                    "dejo de estudiar"
                ) ||
                texto.includes(
                    "problema"
                ) ||
                texto.includes(
                    "limitacion"
                ) ||
                texto.includes(
                    "concentracion"
                ) ||
                texto.includes(
                    "rendimiento actual"
                )
            ) {

                return "impacto";

            }


            /*
             * TRAYECTORIA ACADÉMICA
             */

            if (
                texto.includes(
                    "trayectoria"
                ) ||
                texto.includes(
                    "rendimiento"
                ) ||
                texto.includes(
                    "repit"
                ) ||
                texto.includes(
                    "abandono escolar"
                ) ||
                texto.includes(
                    "interrupcion"
                ) ||
                texto.includes(
                    "regularidad"
                ) ||
                texto.includes(
                    "materias"
                ) ||
                texto.includes(
                    "finalizo"
                ) ||
                texto.includes(
                    "completo"
                ) ||
                texto.includes(
                    "años cursados"
                ) ||
                texto.includes(
                    "anio cursado"
                )
            ) {

                return "trayectoria";

            }


            /*
             * ESTUDIOS Y FORMACIÓN
             */

            if (
                texto.includes(
                    "carrera"
                ) ||
                texto.includes(
                    "titulo"
                ) ||
                texto.includes(
                    "institucion"
                ) ||
                texto.includes(
                    "establecimiento"
                ) ||
                texto.includes(
                    "curso"
                ) ||
                texto.includes(
                    "capacitacion"
                ) ||
                texto.includes(
                    "formacion"
                ) ||
                texto.includes(
                    "especialidad"
                ) ||
                texto.includes(
                    "oficio"
                ) ||
                texto.includes(
                    "estudia actualmente"
                ) ||
                texto.includes(
                    "estudios actuales"
                )
            ) {

                return "estudios";

            }


            /*
             * NIVEL EDUCATIVO
             */

            if (
                texto.includes(
                    "nivel educativo"
                ) ||
                texto.includes(
                    "nivel alcanzado"
                ) ||
                texto.includes(
                    "escolaridad"
                ) ||
                texto.includes(
                    "primario"
                ) ||
                texto.includes(
                    "secundario"
                ) ||
                texto.includes(
                    "terciario"
                ) ||
                texto.includes(
                    "universitario"
                ) ||
                texto.includes(
                    "posgrado"
                )
            ) {

                return "nivel";

            }

            return "general";

        },


        /* =================================================
           FORMATEAR ETIQUETAS
        ================================================= */

        formatearEtiqueta(
            etiqueta
        ) {

            const clave =
                this.normalizarTexto(
                    etiqueta
                );

            const reemplazos = {

                "nivel educativo":
                    "Nivel educativo alcanzado",

                "nivel educativo alcanzado":
                    "Nivel educativo alcanzado",

                "nivel alcanzado":
                    "Nivel educativo alcanzado",

                "primario completo":
                    "Estudios primarios",

                "secundario completo":
                    "Estudios secundarios",

                "terciario completo":
                    "Estudios terciarios",

                "universitario completo":
                    "Estudios universitarios",

                "estudia actualmente":
                    "Estudia actualmente",

                "institucion educativa":
                    "Institución educativa",

                "establecimiento educativo":
                    "Establecimiento",

                "carrera actual":
                    "Carrera",

                "carrera estudiada":
                    "Carrera",

                "titulo obtenido":
                    "Título obtenido",

                "titulo alcanzado":
                    "Título obtenido",

                "cursos realizados":
                    "Cursos realizados",

                "capacitaciones":
                    "Capacitaciones",

                "oficios aprendidos":
                    "Oficios aprendidos",

                "rendimiento escolar":
                    "Rendimiento académico",

                "rendimiento academico":
                    "Rendimiento académico",

                "repitio":
                    "Repitió algún año",

                "repitio años":
                    "Años repetidos",

                "interrumpio estudios":
                    "Interrumpió sus estudios",

                "motivo interrupcion":
                    "Motivo de la interrupción",

                "dificultades aprendizaje":
                    "Dificultades de aprendizaje",

                "dificultades actuales":
                    "Dificultades actuales",

                "impacto educativo":
                    "Impacto en el área educativa",

                "cambios rendimiento":
                    "Cambios en el rendimiento",

                "problemas concentracion":
                    "Dificultades de concentración"

            };

            if (
                reemplazos[
                    clave
                ]
            ) {

                return reemplazos[
                    clave
                ];

            }

            return String(
                etiqueta
            )
                .replace(
                    /([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g,
                    "$1 $2"
                )
                .replace(
                    /\bInstitucion\b/g,
                    "Institución"
                )
                .replace(
                    /\bTitulo\b/g,
                    "Título"
                )
                .replace(
                    /\bEducacion\b/g,
                    "Educación"
                )
                .replace(
                    /\bFormacion\b/g,
                    "Formación"
                )
                .replace(
                    /\bCapacitacion\b/g,
                    "Capacitación"
                )
                .replace(
                    /\bInterrupcion\b/g,
                    "Interrupción"
                )
                .replace(
                    /\bConcentracion\b/g,
                    "Concentración"
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
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();

            const normalizado =
                this.normalizarTexto(
                    texto
                );

            if (
                normalizado ===
                "si"
            ) {

                return "Sí";

            }

            if (
                normalizado ===
                "no"
            ) {

                return "No";

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

                "nivel educativo",
                "nivel alcanzado",
                "primario",
                "secundario",
                "terciario",
                "universitario",
                "posgrado",
                "estudia actualmente",
                "institucion",
                "establecimiento",
                "carrera",
                "titulo",
                "curso",
                "capacitacion",
                "oficio",
                "trayectoria",
                "rendimiento",
                "repitio",
                "interrumpio",
                "motivo interrupcion",
                "dificultad",
                "concentracion",
                "impacto",
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

        }

    });


window.FalcoViewerEducacion =
    FalcoViewerEducacion;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerEducacion.iniciar();

    }
);