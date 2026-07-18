/* =========================================================
   FALCO® VIEWER ANTECEDENTES DE SALUD™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza antecedentes médicos y psicológicos.
   - Separa enfermedades, cirugías e internaciones.
   - Agrupa accidentes, medicación y antecedentes familiares.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerSalud =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Antecedentes de Salud™",

        selectorModulo:
            '[data-modulo="antecedentes-salud"]',

        claseContenedor:
            "falco-salud-view",

        claseTarjeta:
            "falco-salud-card",

        claseEncabezado:
            "falco-salud-card-header",

        claseTitulo:
            "falco-salud-card-title",

        claseCuerpo:
            "falco-salud-card-body",

        claseFila:
            "falco-salud-row",

        claseEtiqueta:
            "falco-salud-label",

        claseValor:
            "falco-salud-value",

        claseOriginal:
            "falco-salud-original",

        claseActivo:
            "falco-salud-activo",

        datasetAplicado:
            "saludVersion",

        datasetGenerado:
            "saludGenerated",

        datasetTipo:
            "saludType",

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

            "estadoActual",
            "enfermedades",
            "cirugias",
            "internaciones",
            "accidentes",
            "saludMental",
            "antecedentesFamiliares",
            "general"

        ],

        titulos: {

            estadoActual:
                "Estado de salud actual",

            enfermedades:
                "Enfermedades y diagnósticos",

            cirugias:
                "Cirugías e intervenciones",

            internaciones:
                "Internaciones",

            accidentes:
                "Accidentes y lesiones previas",

            saludMental:
                "Antecedentes de salud mental",

            antecedentesFamiliares:
                "Antecedentes familiares",

            general:
                "Información de salud"

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
             * ANTECEDENTES FAMILIARES
             */

            if (
                texto.includes(
                    "familiar"
                ) ||
                texto.includes(
                    "familiares"
                ) ||
                texto.includes(
                    "hereditario"
                ) ||
                texto.includes(
                    "herencia"
                ) ||
                texto.includes(
                    "antecedentes familiares"
                )
            ) {

                return "antecedentesFamiliares";

            }


            /*
             * SALUD MENTAL
             */

            if (
                texto.includes(
                    "psicolog"
                ) ||
                texto.includes(
                    "psiquiatr"
                ) ||
                texto.includes(
                    "salud mental"
                ) ||
                texto.includes(
                    "crisis"
                ) ||
                texto.includes(
                    "ansiedad"
                ) ||
                texto.includes(
                    "depresion"
                ) ||
                texto.includes(
                    "panico"
                ) ||
                texto.includes(
                    "intento"
                ) ||
                texto.includes(
                    "autolesion"
                )
            ) {

                return "saludMental";

            }


            /*
             * ACCIDENTES Y LESIONES
             */

            if (
                texto.includes(
                    "accidente"
                ) ||
                texto.includes(
                    "lesion"
                ) ||
                texto.includes(
                    "traumatismo"
                ) ||
                texto.includes(
                    "fractura"
                ) ||
                texto.includes(
                    "golpe"
                ) ||
                texto.includes(
                    "secuela"
                )
            ) {

                return "accidentes";

            }


            /*
             * INTERNACIONES
             */

            if (
                texto.includes(
                    "internacion"
                ) ||
                texto.includes(
                    "internado"
                ) ||
                texto.includes(
                    "hospitalizacion"
                ) ||
                texto.includes(
                    "hospitalizado"
                )
            ) {

                return "internaciones";

            }


            /*
             * CIRUGÍAS
             */

            if (
                texto.includes(
                    "cirugia"
                ) ||
                texto.includes(
                    "operacion"
                ) ||
                texto.includes(
                    "operado"
                ) ||
                texto.includes(
                    "intervencion quirurgica"
                )
            ) {

                return "cirugias";

            }


            /*
             * ENFERMEDADES Y DIAGNÓSTICOS
             */

            if (
                texto.includes(
                    "enfermedad"
                ) ||
                texto.includes(
                    "diagnostico"
                ) ||
                texto.includes(
                    "patologia"
                ) ||
                texto.includes(
                    "cronica"
                ) ||
                texto.includes(
                    "alergia"
                ) ||
                texto.includes(
                    "discapacidad"
                ) ||
                texto.includes(
                    "cud"
                )
            ) {

                return "enfermedades";

            }


            /*
             * ESTADO ACTUAL
             */

            if (
                texto.includes(
                    "estado de salud"
                ) ||
                texto.includes(
                    "salud actual"
                ) ||
                texto.includes(
                    "actualmente"
                ) ||
                texto.includes(
                    "dolor"
                ) ||
                texto.includes(
                    "sintoma"
                ) ||
                texto.includes(
                    "limitacion actual"
                ) ||
                texto.includes(
                    "control medico"
                )
            ) {

                return "estadoActual";

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

                "estado salud actual":
                    "Estado de salud actual",

                "estado de salud actual":
                    "Estado de salud actual",

                "salud actual":
                    "Estado de salud actual",

                "tiene enfermedades":
                    "Presenta enfermedades",

                "enfermedades actuales":
                    "Enfermedades actuales",

                "enfermedades cronicas":
                    "Enfermedades crónicas",

                "diagnosticos":
                    "Diagnósticos informados",

                "diagnostico":
                    "Diagnóstico informado",

                "tiene alergias":
                    "Presenta alergias",

                "alergias":
                    "Alergias",

                "tuvo cirugias":
                    "Antecedentes quirúrgicos",

                "cirugias":
                    "Cirugías realizadas",

                "fecha cirugia":
                    "Fecha de la cirugía",

                "motivo cirugia":
                    "Motivo de la cirugía",

                "tuvo internaciones":
                    "Antecedentes de internación",

                "internaciones":
                    "Internaciones",

                "motivo internacion":
                    "Motivo de la internación",

                "fecha internacion":
                    "Fecha de la internación",

                "tuvo accidentes previos":
                    "Accidentes previos",

                "accidentes previos":
                    "Accidentes previos",

                "lesiones previas":
                    "Lesiones previas",

                "secuelas previas":
                    "Secuelas anteriores",

                "antecedentes psicologicos":
                    "Antecedentes psicológicos",

                "antecedentes psiquiatricos":
                    "Antecedentes psiquiátricos",

                "antecedentes salud mental":
                    "Antecedentes de salud mental",

                "antecedentes familiares":
                    "Antecedentes familiares",

                "discapacidad":
                    "Discapacidad informada",

                "posee cud":
                    "Cuenta con CUD",

                "cud":
                    "Certificado Único de Discapacidad",

                "dolores actuales":
                    "Dolores actuales",

                "sintomas actuales":
                    "Síntomas actuales",

                "controles medicos":
                    "Controles médicos",

                "observaciones salud":
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
                    /\bDiagnostico\b/g,
                    "Diagnóstico"
                )
                .replace(
                    /\bCirugia\b/g,
                    "Cirugía"
                )
                .replace(
                    /\bInternacion\b/g,
                    "Internación"
                )
                .replace(
                    /\bPsicologico\b/g,
                    "Psicológico"
                )
                .replace(
                    /\bPsiquiatrico\b/g,
                    "Psiquiátrico"
                )
                .replace(
                    /\bMedico\b/g,
                    "Médico"
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
                        elemento =>
                            typeof elemento === "object"
                                ? JSON.stringify(
                                    elemento
                                )
                                : String(
                                    elemento
                                )
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
                    valor.nombre
                ) {

                    return valor.nombre;

                }

                if (
                    valor.descripcion
                ) {

                    return valor.descripcion;

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
                "no corresponde"
            ) {

                return "No corresponde";

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

                "estado de salud",
                "salud actual",
                "enfermedad",
                "diagnostico",
                "patologia",
                "alergia",
                "discapacidad",
                "cud",
                "cirugia",
                "operacion",
                "internacion",
                "hospitalizacion",
                "accidente",
                "lesion",
                "secuela",
                "antecedentes psicologicos",
                "antecedentes psiquiatricos",
                "salud mental",
                "antecedentes familiares",
                "dolor",
                "sintoma",
                "control medico",
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


window.FalcoViewerSalud =
    FalcoViewerSalud;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerSalud.iniciar();

    }
);