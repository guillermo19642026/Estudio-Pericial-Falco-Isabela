/* =========================================================
   FALCO® VIEWER IMPACTO ACTUAL™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza las repercusiones actuales informadas.
   - Agrupa las áreas personal, familiar, social y laboral.
   - Presenta síntomas, limitaciones y cambios posteriores.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerImpacto =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Impacto Actual™",

        selectorModulo:
            '[data-modulo="impacto-actual"]',

        claseContenedor:
            "falco-impacto-view",

        claseTarjeta:
            "falco-impacto-card",

        claseEncabezado:
            "falco-impacto-card-header",

        claseTitulo:
            "falco-impacto-card-title",

        claseCuerpo:
            "falco-impacto-card-body",

        claseFila:
            "falco-impacto-row",

        claseEtiqueta:
            "falco-impacto-label",

        claseValor:
            "falco-impacto-value",

        claseOriginal:
            "falco-impacto-original",

        claseActivo:
            "falco-impacto-activo",

        datasetAplicado:
            "impactoVersion",

        datasetGenerado:
            "impactoGenerated",

        datasetTipo:
            "impactoType",

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

            "emocional",
            "cognitivo",
            "fisico",
            "personal",
            "familiar",
            "social",
            "laboral",
            "actividades",
            "autonomia",
            "cambios",
            "general"

        ],

        titulos: {

            emocional:
                "Impacto emocional",

            cognitivo:
                "Funciones cognitivas",

            fisico:
                "Manifestaciones físicas",

            personal:
                "Repercusión personal",

            familiar:
                "Repercusión familiar",

            social:
                "Repercusión social",

            laboral:
                "Repercusión laboral",

            actividades:
                "Actividades cotidianas",

            autonomia:
                "Autonomía y desenvolvimiento",

            cambios:
                "Cambios posteriores al hecho",

            general:
                "Información sobre el impacto actual"

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


            /* IMPACTO EMOCIONAL */

            if (
                texto.includes(
                    "emocional"
                ) ||
                texto.includes(
                    "animo"
                ) ||
                texto.includes(
                    "angustia"
                ) ||
                texto.includes(
                    "ansiedad"
                ) ||
                texto.includes(
                    "tristeza"
                ) ||
                texto.includes(
                    "miedo"
                ) ||
                texto.includes(
                    "temor"
                ) ||
                texto.includes(
                    "irritabilidad"
                ) ||
                texto.includes(
                    "enojo"
                ) ||
                texto.includes(
                    "culpa"
                ) ||
                texto.includes(
                    "desesperanza"
                ) ||
                texto.includes(
                    "inseguridad"
                ) ||
                texto.includes(
                    "autoestima"
                )
            ) {

                return "emocional";

            }


            /* FUNCIONES COGNITIVAS */

            if (
                texto.includes(
                    "atencion"
                ) ||
                texto.includes(
                    "concentracion"
                ) ||
                texto.includes(
                    "memoria"
                ) ||
                texto.includes(
                    "pensamiento"
                ) ||
                texto.includes(
                    "olvido"
                ) ||
                texto.includes(
                    "cognitiv"
                ) ||
                texto.includes(
                    "decision"
                )
            ) {

                return "cognitivo";

            }


            /* MANIFESTACIONES FÍSICAS */

            if (
                texto.includes(
                    "fisico"
                ) ||
                texto.includes(
                    "dolor"
                ) ||
                texto.includes(
                    "tension"
                ) ||
                texto.includes(
                    "palpitacion"
                ) ||
                texto.includes(
                    "sudoracion"
                ) ||
                texto.includes(
                    "mareo"
                ) ||
                texto.includes(
                    "cefalea"
                ) ||
                texto.includes(
                    "somatico"
                ) ||
                texto.includes(
                    "corporal"
                )
            ) {

                return "fisico";

            }


            /* IMPACTO FAMILIAR */

            if (
                texto.includes(
                    "familia"
                ) ||
                texto.includes(
                    "familiar"
                ) ||
                texto.includes(
                    "pareja"
                ) ||
                texto.includes(
                    "hijo"
                ) ||
                texto.includes(
                    "convivencia"
                ) ||
                texto.includes(
                    "hogar"
                )
            ) {

                return "familiar";

            }


            /* IMPACTO SOCIAL */

            if (
                texto.includes(
                    "social"
                ) ||
                texto.includes(
                    "amistad"
                ) ||
                texto.includes(
                    "amigos"
                ) ||
                texto.includes(
                    "reunion"
                ) ||
                texto.includes(
                    "aislamiento"
                ) ||
                texto.includes(
                    "salidas"
                ) ||
                texto.includes(
                    "vinculo"
                ) ||
                texto.includes(
                    "relaciones"
                )
            ) {

                return "social";

            }


            /* IMPACTO LABORAL */

            if (
                texto.includes(
                    "laboral"
                ) ||
                texto.includes(
                    "trabajo"
                ) ||
                texto.includes(
                    "tarea"
                ) ||
                texto.includes(
                    "rendimiento"
                ) ||
                texto.includes(
                    "empleo"
                ) ||
                texto.includes(
                    "actividad profesional"
                ) ||
                texto.includes(
                    "licencia"
                ) ||
                texto.includes(
                    "ausent"
                )
            ) {

                return "laboral";

            }


            /* ACTIVIDADES COTIDIANAS */

            if (
                texto.includes(
                    "actividad cotidiana"
                ) ||
                texto.includes(
                    "actividad diaria"
                ) ||
                texto.includes(
                    "vida diaria"
                ) ||
                texto.includes(
                    "tareas domesticas"
                ) ||
                texto.includes(
                    "recreativa"
                ) ||
                texto.includes(
                    "ocio"
                ) ||
                texto.includes(
                    "deporte"
                ) ||
                texto.includes(
                    "rutina"
                )
            ) {

                return "actividades";

            }


            /* AUTONOMÍA */

            if (
                texto.includes(
                    "autonomia"
                ) ||
                texto.includes(
                    "independencia"
                ) ||
                texto.includes(
                    "desplazamiento"
                ) ||
                texto.includes(
                    "movilidad"
                ) ||
                texto.includes(
                    "ayuda de terceros"
                ) ||
                texto.includes(
                    "asistencia"
                ) ||
                texto.includes(
                    "desenvolvimiento"
                )
            ) {

                return "autonomia";

            }


            /* CAMBIOS POSTERIORES */

            if (
                texto.includes(
                    "cambio"
                ) ||
                texto.includes(
                    "antes del hecho"
                ) ||
                texto.includes(
                    "despues del hecho"
                ) ||
                texto.includes(
                    "posterior"
                ) ||
                texto.includes(
                    "desde el hecho"
                ) ||
                texto.includes(
                    "desde el accidente"
                ) ||
                texto.includes(
                    "modificacion"
                )
            ) {

                return "cambios";

            }


            /* IMPACTO PERSONAL */

            if (
                texto.includes(
                    "personal"
                ) ||
                texto.includes(
                    "proyecto de vida"
                ) ||
                texto.includes(
                    "bienestar"
                ) ||
                texto.includes(
                    "calidad de vida"
                ) ||
                texto.includes(
                    "limitacion"
                ) ||
                texto.includes(
                    "afectacion"
                )
            ) {

                return "personal";

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

                "estado animo":
                    "Estado de ánimo actual",

                "estado de animo":
                    "Estado de ánimo actual",

                "cambios animo":
                    "Cambios en el estado de ánimo",

                "cambios de animo":
                    "Cambios en el estado de ánimo",

                "ansiedad":
                    "Ansiedad",

                "angustia":
                    "Angustia",

                "tristeza":
                    "Tristeza",

                "miedos":
                    "Miedos o temores actuales",

                "irritabilidad":
                    "Irritabilidad",

                "autoestima":
                    "Autoestima",

                "atencion":
                    "Atención",

                "concentracion":
                    "Concentración",

                "memoria":
                    "Memoria",

                "dificultades cognitivas":
                    "Dificultades cognitivas",

                "manifestaciones fisicas":
                    "Manifestaciones físicas",

                "sintomas fisicos":
                    "Síntomas físicos",

                "impacto personal":
                    "Repercusión personal",

                "impacto familiar":
                    "Repercusión familiar",

                "impacto social":
                    "Repercusión social",

                "impacto laboral":
                    "Repercusión laboral",

                "actividades cotidianas":
                    "Actividades cotidianas",

                "actividades recreativas":
                    "Actividades recreativas",

                "tareas domesticas":
                    "Tareas domésticas",

                "autonomia":
                    "Autonomía actual",

                "requiere ayuda":
                    "Necesidad de ayuda de terceros",

                "ayuda terceros":
                    "Ayuda de terceros",

                "cambios posteriores":
                    "Cambios posteriores al hecho",

                "cambios desde el hecho":
                    "Cambios desde el hecho",

                "antes y despues":
                    "Comparación antes y después del hecho",

                "calidad vida":
                    "Calidad de vida actual",

                "calidad de vida":
                    "Calidad de vida actual",

                "proyecto vida":
                    "Proyecto de vida",

                "proyecto de vida":
                    "Proyecto de vida",

                "limitaciones actuales":
                    "Limitaciones actuales",

                "observaciones impacto":
                    "Observaciones"

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
                    /\bAnimo\b/g,
                    "Ánimo"
                )
                .replace(
                    /\bAtencion\b/g,
                    "Atención"
                )
                .replace(
                    /\bConcentracion\b/g,
                    "Concentración"
                )
                .replace(
                    /\bFisico\b/g,
                    "Físico"
                )
                .replace(
                    /\bFisica\b/g,
                    "Física"
                )
                .replace(
                    /\bAutonomia\b/g,
                    "Autonomía"
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

            if (
                valor === null ||
                valor === undefined
            ) {

                return "";

            }


            if (
                Array.isArray(
                    valor
                )
            ) {

                return valor
                    .filter(
                        elemento =>
                            elemento !== null &&
                            elemento !== undefined &&
                            String(
                                elemento
                            ).trim() !== ""
                    )
                    .map(
                        elemento => {

                            if (
                                typeof elemento ===
                                "object"
                            ) {

                                return (
                                    elemento.descripcion ||
                                    elemento.detalle ||
                                    elemento.nombre ||
                                    JSON.stringify(
                                        elemento
                                    )
                                );

                            }

                            return String(
                                elemento
                            );

                        }
                    )
                    .join(
                        ", "
                    );

            }


            if (
                typeof valor ===
                "object"
            ) {

                if (
                    valor.descripcion
                ) {

                    return valor.descripcion;

                }


                if (
                    valor.detalle
                ) {

                    return valor.detalle;

                }


                if (
                    valor.valor !== undefined
                ) {

                    const explicacion =
                        valor.explicacion ||
                        valor.observacion ||
                        valor.fundamento ||
                        "";

                    return explicacion
                        ? `${valor.valor} — ${explicacion}`
                        : String(
                            valor.valor
                        );

                }


                try {

                    return JSON.stringify(
                        valor
                    );

                } catch {

                    return String(
                        valor
                    );

                }

            }


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


            if (
                normalizado ===
                "ninguno" ||
                normalizado ===
                "ninguna"
            ) {

                return "No registra";

            }


            if (
                normalizado ===
                "sin cambios"
            ) {

                return "No refiere cambios";

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

                "estado de animo",
                "cambios en el estado de animo",
                "ansiedad",
                "angustia",
                "tristeza",
                "miedo",
                "irritabilidad",
                "autoestima",
                "atencion",
                "concentracion",
                "memoria",
                "manifestaciones fisicas",
                "sintomas fisicos",
                "impacto personal",
                "calidad de vida",
                "proyecto de vida",
                "impacto familiar",
                "impacto social",
                "impacto laboral",
                "rendimiento",
                "actividades cotidianas",
                "actividades recreativas",
                "tareas domesticas",
                "autonomia",
                "ayuda de terceros",
                "limitaciones",
                "cambios posteriores",
                "antes y despues",
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


window.FalcoViewerImpacto =
    FalcoViewerImpacto;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerImpacto.iniciar();

    }
);