/* =========================================================
   FALCO® VIEWER TRATAMIENTOS™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza los tratamientos actuales y anteriores.
   - Separa psicoterapia, psiquiatría y medicación.
   - Ordena profesionales, frecuencia y fechas.
   - Destaca constancias y observaciones clínicas.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerTratamientos =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Tratamientos™",

        selectorModulo:
            '[data-modulo="tratamientos"]',

        claseContenedor:
            "falco-tratamientos-view",

        claseTarjeta:
            "falco-tratamientos-card",

        claseEncabezado:
            "falco-tratamientos-card-header",

        claseTitulo:
            "falco-tratamientos-card-title",

        claseCuerpo:
            "falco-tratamientos-card-body",

        claseFila:
            "falco-tratamientos-row",

        claseEtiqueta:
            "falco-tratamientos-label",

        claseValor:
            "falco-tratamientos-value",

        claseOriginal:
            "falco-tratamientos-original",

        claseActivo:
            "falco-tratamientos-activo",

        datasetAplicado:
            "tratamientosVersion",

        datasetGenerado:
            "tratamientosGenerated",

        datasetTipo:
            "tratamientosType",

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

            "actual",
            "psicologico",
            "psiquiatrico",
            "medicacion",
            "anteriores",
            "constancias",
            "general"

        ],

        titulos: {

            actual:
                "Tratamiento actual",

            psicologico:
                "Tratamiento psicológico",

            psiquiatrico:
                "Tratamiento psiquiátrico",

            medicacion:
                "Medicación",

            anteriores:
                "Tratamientos anteriores",

            constancias:
                "Constancias y documentación",

            general:
                "Información sobre tratamientos"

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
             * CONSTANCIAS Y DOCUMENTACIÓN
             */

            if (
                texto.includes(
                    "constancia"
                ) ||
                texto.includes(
                    "certificado"
                ) ||
                texto.includes(
                    "documentacion"
                ) ||
                texto.includes(
                    "documento"
                ) ||
                texto.includes(
                    "archivo"
                ) ||
                texto.includes(
                    "adjunto"
                ) ||
                texto.includes(
                    "comprobante"
                )
            ) {

                return "constancias";

            }


            /*
             * MEDICACIÓN
             */

            if (
                texto.includes(
                    "medicacion"
                ) ||
                texto.includes(
                    "medicamento"
                ) ||
                texto.includes(
                    "farmaco"
                ) ||
                texto.includes(
                    "psicofarmaco"
                ) ||
                texto.includes(
                    "dosis"
                ) ||
                texto.includes(
                    "posologia"
                )
            ) {

                return "medicacion";

            }


            /*
             * TRATAMIENTO PSIQUIÁTRICO
             */

            if (
                texto.includes(
                    "psiquiatr"
                ) ||
                texto.includes(
                    "psiquiatra"
                )
            ) {

                return "psiquiatrico";

            }


            /*
             * TRATAMIENTO PSICOLÓGICO
             */

            if (
                texto.includes(
                    "psicolog"
                ) ||
                texto.includes(
                    "psicoterapia"
                ) ||
                texto.includes(
                    "terapia"
                ) ||
                texto.includes(
                    "terapeuta"
                )
            ) {

                return "psicologico";

            }


            /*
             * TRATAMIENTOS ANTERIORES
             */

            if (
                texto.includes(
                    "anterior"
                ) ||
                texto.includes(
                    "previo"
                ) ||
                texto.includes(
                    "antecedente"
                ) ||
                texto.includes(
                    "realizo tratamiento"
                ) ||
                texto.includes(
                    "tratamiento pasado"
                ) ||
                texto.includes(
                    "finalizado"
                ) ||
                texto.includes(
                    "abandono"
                )
            ) {

                return "anteriores";

            }


            /*
             * TRATAMIENTO ACTUAL
             */

            if (
                texto.includes(
                    "actual"
                ) ||
                texto.includes(
                    "desde cuando"
                ) ||
                texto.includes(
                    "fecha inicio"
                ) ||
                texto.includes(
                    "inicio tratamiento"
                ) ||
                texto.includes(
                    "frecuencia"
                ) ||
                texto.includes(
                    "profesional"
                ) ||
                texto.includes(
                    "especialidad"
                ) ||
                texto.includes(
                    "modalidad"
                ) ||
                texto.includes(
                    "obra social"
                )
            ) {

                return "actual";

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

                "realiza tratamiento":
                    "Realiza tratamiento actualmente",

                "realiza tratamiento actualmente":
                    "Realiza tratamiento actualmente",

                "tipo tratamiento":
                    "Tipo de tratamiento",

                "tipo de tratamiento":
                    "Tipo de tratamiento",

                "tratamiento actual":
                    "Tratamiento actual",

                "desde cuando":
                    "Fecha de inicio",

                "fecha inicio":
                    "Fecha de inicio",

                "fecha de inicio":
                    "Fecha de inicio",

                "frecuencia tratamiento":
                    "Frecuencia",

                "frecuencia":
                    "Frecuencia",

                "nombre profesional":
                    "Profesional tratante",

                "profesional":
                    "Profesional tratante",

                "profesional tratante":
                    "Profesional tratante",

                "especialidad profesional":
                    "Especialidad",

                "especialidad":
                    "Especialidad",

                "modalidad tratamiento":
                    "Modalidad",

                "modalidad":
                    "Modalidad",

                "tratamiento psicologico":
                    "Tratamiento psicológico",

                "tratamiento psiquiatrico":
                    "Tratamiento psiquiátrico",

                "tratamientos anteriores":
                    "Tratamientos anteriores",

                "tuvo tratamientos anteriores":
                    "Antecedentes de tratamiento",

                "medicacion":
                    "Medicación",

                "toma medicacion":
                    "Recibe medicación",

                "nombre medicacion":
                    "Medicamento",

                "medicamento":
                    "Medicamento",

                "dosis":
                    "Dosis indicada",

                "motivo tratamiento":
                    "Motivo del tratamiento",

                "motivo de tratamiento":
                    "Motivo del tratamiento",

                "diagnostico":
                    "Diagnóstico informado",

                "constancia tratamiento":
                    "Constancia de tratamiento",

                "adjunta constancia":
                    "Constancia aportada",

                "observaciones tratamiento":
                    "Observaciones",

                "obra social":
                    "Cobertura médica",

                "cobertura medica":
                    "Cobertura médica"

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
                    /\bPsicologico\b/g,
                    "Psicológico"
                )
                .replace(
                    /\bPsiquiatrico\b/g,
                    "Psiquiátrico"
                )
                .replace(
                    /\bMedicacion\b/g,
                    "Medicación"
                )
                .replace(
                    /\bDiagnostico\b/g,
                    "Diagnóstico"
                )
                .replace(
                    /\bFrecuencia\b/g,
                    "Frecuencia"
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
                    valor.url
                ) {

                    return valor.url;

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


            const textoNormalizado =
                this.normalizarTexto(
                    texto
                );


            if (
                textoNormalizado ===
                "si"
            ) {

                return "Sí";

            }


            if (
                textoNormalizado ===
                "no"
            ) {

                return "No";

            }


            if (
                textoNormalizado ===
                "no corresponde"
            ) {

                return "No corresponde";

            }


            if (
                textoNormalizado ===
                "no informa"
            ) {

                return "No informado";

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

                "realiza tratamiento",
                "tratamiento actual",
                "tipo tratamiento",
                "motivo",
                "diagnostico",
                "desde cuando",
                "fecha inicio",
                "profesional",
                "especialidad",
                "frecuencia",
                "modalidad",
                "obra social",
                "tratamiento psicologico",
                "tratamiento psiquiatrico",
                "medicacion",
                "medicamento",
                "dosis",
                "tratamiento anterior",
                "constancia",
                "certificado",
                "documentacion",
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


window.FalcoViewerTratamientos =
    FalcoViewerTratamientos;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerTratamientos.iniciar();

    }
);