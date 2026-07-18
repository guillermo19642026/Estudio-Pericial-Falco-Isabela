/* =========================================================
   FALCO® VIEWER FAMILIAR™ v2.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza Grupo Familiar en fichas profesionales.
   - Conserva la clasificación proveniente del Core.
   - Reconoce familia directa, política y extendida.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerFamily =
    FalcoViewerBase.crear({

        version:
            "2.0",

        nombre:
            "Viewer Familiar™",

        selectorModulo:
            '[data-modulo="grupo-familiar"]',

        claseContenedor:
            "falco-family-view",

        claseTarjeta:
            "falco-family-card",

        claseEncabezado:
            "falco-family-card-header",

        claseTitulo:
            "falco-family-card-title",

        claseCuerpo:
            "falco-family-card-body",

        claseFila:
            "falco-family-row",

        claseEtiqueta:
            "falco-family-label",

        claseValor:
            "falco-family-value",

        claseOriginal:
            "falco-family-original",

        claseActivo:
            "falco-family-activo",

        datasetAplicado:
            "familyVersion",

        datasetGenerado:
            "familyGenerated",

        datasetTipo:
            "familyType",

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

            "padre",
            "madre",
            "pareja",
            "hermanos",
            "hijos",
            "abuelos",
            "familiaPolitica",
            "familiaExtendida",
            "general"

        ],

        titulos: {

            padre:
                "Padre",

            madre:
                "Madre",

            pareja:
                "Pareja",

            hermanos:
                "Hermanos",

            hijos:
                "Hijos",

            abuelos:
                "Abuelos",

            familiaPolitica:
                "Familia política",

            familiaExtendida:
                "Familia extendida",

            general:
                "Información familiar"

        },


        /* =================================================
           DETECTAR GRUPO FAMILIAR
        ================================================= */

        detectarGrupo(
            campo
        ) {

            const tipoOriginal =
                String(
                    campo.tipo || ""
                )
                .trim();

            /*
             * Conservamos la clasificación que ya viene
             * correctamente definida desde el Core.
             */

            if (
                tipoOriginal &&
                tipoOriginal !==
                    "general" &&
                this.titulos[
                    tipoOriginal
                ]
            ) {

                return tipoOriginal;

            }

            const texto =
                this.normalizarTexto(
                    `${campo.etiqueta || ""} ${campo.valor || ""}`
                );

            /*
             * Padre
             */

            if (
                /\bpadre\b/.test(
                    texto
                )
            ) {

                return "padre";

            }

            /*
             * Madre
             */

            if (
                /\bmadre\b/.test(
                    texto
                )
            ) {

                return "madre";

            }

            /*
             * Pareja
             */

            if (
                texto.includes(
                    "pareja"
                ) ||
                texto.includes(
                    "conyuge"
                )
            ) {

                return "pareja";

            }

            /*
             * Hermanos
             */

            if (
                /\bherman[oa]s?\b/.test(
                    texto
                )
            ) {

                return "hermanos";

            }

            /*
             * Hijos
             */

            if (
                /\bhij[oa]s?\b/.test(
                    texto
                )
            ) {

                return "hijos";

            }

            /*
             * Abuelos
             */

            if (
                /\babuel[oa]s?\b/.test(
                    texto
                )
            ) {

                return "abuelos";

            }

            /*
             * Familia política
             */

            if (
                texto.includes(
                    "familia politica"
                ) ||
                texto.includes(
                    "familia del conyuge"
                ) ||
                texto.includes(
                    "familia de la pareja"
                ) ||
                /\bsuegr[oa]s?\b/.test(
                    texto
                ) ||
                /\bcuñad[oa]s?\b/.test(
                    texto
                )
            ) {

                return "familiaPolitica";

            }

            /*
             * Familia extendida
             */

            if (
                texto.includes(
                    "familia extendida"
                ) ||
                texto.includes(
                    "familia extensa"
                ) ||
                /\btios?\b/.test(
                    texto
                ) ||
                /\btias?\b/.test(
                    texto
                ) ||
                /\bprimos?\b/.test(
                    texto
                ) ||
                /\bprimas?\b/.test(
                    texto
                ) ||
                /\bsobrinos?\b/.test(
                    texto
                ) ||
                /\bsobrinas?\b/.test(
                    texto
                )
            ) {

                return "familiaExtendida";

            }

            return this.titulos[
                tipoOriginal
            ]
                ? tipoOriginal
                : "general";

        },


        /* =================================================
           CONTADOR DEL ENCABEZADO
        ================================================= */

        crearComplementoEncabezado(
            clave,
            campos
        ) {

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

            return contador;

        },


        /* =================================================
           FORMATEAR ETIQUETAS
        ================================================= */

        formatearEtiqueta(
            etiqueta
        ) {

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

                "Ocupación Padre":
                    "Ocupación",

                "Ocupacion Madre":
                    "Ocupación",

                "Ocupación Madre":
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

                "Descripción Convivencia":
                    "Descripción de la convivencia",

                "Personas Convivientes":
                    "Personas convivientes"

            };

            if (
                reemplazos[
                    etiqueta
                ]
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

                "nombre",
                "edad",
                "vive",
                "ocupacion",
                "tiene",
                "cantidad",
                "personas convivientes",
                "descripcion convivencia",
                "vinculo",
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

        }

    });


window.FalcoViewerFamily =
    FalcoViewerFamily;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerFamily.iniciar();

    }
);