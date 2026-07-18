/* =========================================================
   FALCO® VIEWER SOCIAL Y RECREATIVO™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza el capítulo Área social y recreativa.
   - Separa vínculos, participación y actividades.
   - Destaca modificaciones posteriores al hecho.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerSocial =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Social y Recreativo™",

      selectorModulo:
    '[data-modulo="area-social-recreativa"]',

        claseContenedor:
            "falco-social-view",

        claseTarjeta:
            "falco-social-card",

        claseEncabezado:
            "falco-social-card-header",

        claseTitulo:
            "falco-social-card-title",

        claseCuerpo:
            "falco-social-card-body",

        claseFila:
            "falco-social-row",

        claseEtiqueta:
            "falco-social-label",

        claseValor:
            "falco-social-value",

        claseOriginal:
            "falco-social-original",

        claseActivo:
            "falco-social-activo",

        datasetAplicado:
            "socialVersion",

        datasetGenerado:
            "socialGenerated",

        datasetTipo:
            "socialType",

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

            "vidaSocial",
            "vinculos",
            "recreacion",
            "impacto",
            "general"

        ],

        titulos: {

            vidaSocial:
                "Vida social",

            vinculos:
                "Vínculos y participación",

            recreacion:
                "Actividades recreativas",

            impacto:
                "Cambios posteriores al hecho",

            general:
                "Información social y recreativa"

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
             * CAMBIOS E IMPACTO
             */

            if (
                texto.includes(
                    "cambio"
                ) ||
                texto.includes(
                    "impacto"
                ) ||
                texto.includes(
                    "afect"
                ) ||
                texto.includes(
                    "antes del hecho"
                ) ||
                texto.includes(
                    "despues del hecho"
                ) ||
                texto.includes(
                    "posterior al hecho"
                ) ||
                texto.includes(
                    "dejo de"
                ) ||
                texto.includes(
                    "abandono"
                ) ||
                texto.includes(
                    "redujo"
                ) ||
                texto.includes(
                    "disminuyo"
                ) ||
                texto.includes(
                    "limitacion"
                )
            ) {

                return "impacto";

            }


            /*
             * ACTIVIDADES RECREATIVAS
             */

            if (
                texto.includes(
                    "actividad"
                ) ||
                texto.includes(
                    "recre"
                ) ||
                texto.includes(
                    "deporte"
                ) ||
                texto.includes(
                    "hobby"
                ) ||
                texto.includes(
                    "pasatiempo"
                ) ||
                texto.includes(
                    "tiempo libre"
                ) ||
                texto.includes(
                    "ocio"
                ) ||
                texto.includes(
                    "salida"
                ) ||
                texto.includes(
                    "vacaciones"
                )
            ) {

                return "recreacion";

            }


            /*
             * VÍNCULOS Y PARTICIPACIÓN
             */

            if (
                texto.includes(
                    "amistad"
                ) ||
                texto.includes(
                    "amigos"
                ) ||
                texto.includes(
                    "vinculo"
                ) ||
                texto.includes(
                    "relacion"
                ) ||
                texto.includes(
                    "grupo"
                ) ||
                texto.includes(
                    "participa"
                ) ||
                texto.includes(
                    "institucion"
                ) ||
                texto.includes(
                    "comunidad"
                ) ||
                texto.includes(
                    "religios"
                ) ||
                texto.includes(
                    "club"
                )
            ) {

                return "vinculos";

            }


            /*
             * VIDA SOCIAL GENERAL
             */

            if (
                texto.includes(
                    "vida social"
                ) ||
                texto.includes(
                    "frecuencia social"
                ) ||
                texto.includes(
                    "contacto social"
                ) ||
                texto.includes(
                    "sociabilidad"
                ) ||
                texto.includes(
                    "socializa"
                ) ||
                texto.includes(
                    "reuniones"
                )
            ) {

                return "vidaSocial";

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

                "vida social actual":
                    "Vida social actual",

                "frecuencia vida social":
                    "Frecuencia",

                "frecuencia social":
                    "Frecuencia",

                "tiene amigos":
                    "Conserva amistades",

                "cantidad amigos":
                    "Cantidad aproximada",

                "calidad vinculos sociales":
                    "Calidad de los vínculos",

                "calidad vinculo social":
                    "Calidad del vínculo",

                "participa grupos":
                    "Participación en grupos",

                "participa en grupos":
                    "Participación en grupos",

                "participa instituciones":
                    "Participación institucional",

                "actividades recreativas":
                    "Actividades recreativas",

                "actividad recreativa":
                    "Actividad recreativa",

                "practica deportes":
                    "Práctica deportiva",

                "deportes":
                    "Deportes",

                "hobbies":
                    "Pasatiempos",

                "pasatiempos":
                    "Pasatiempos",

                "actividades tiempo libre":
                    "Actividades durante el tiempo libre",

                "cambios vida social":
                    "Cambios en la vida social",

                "cambios actividades recreativas":
                    "Cambios en las actividades recreativas",

                "impacto social":
                    "Impacto en el área social",

                "impacto recreativo":
                    "Impacto en el área recreativa",

                "actividades abandonadas":
                    "Actividades abandonadas",

                "actividades reducidas":
                    "Actividades reducidas",

                "limitaciones sociales":
                    "Limitaciones sociales"

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
                    /\bRelacion\b/g,
                    "Relación"
                )
                .replace(
                    /\bVinculo\b/g,
                    "Vínculo"
                )
                .replace(
                    /\bPractica\b/g,
                    "Práctica"
                )
                .replace(
                    /\bDespues\b/g,
                    "Después"
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

                "vida social actual",
                "frecuencia",
                "tiene amigos",
                "cantidad amigos",
                "calidad",
                "vinculo",
                "amistad",
                "participa",
                "grupo",
                "institucion",
                "actividad recreativa",
                "deporte",
                "hobby",
                "pasatiempo",
                "tiempo libre",
                "cambios",
                "impacto",
                "actividad abandonada",
                "actividad reducida",
                "limitacion",
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


window.FalcoViewerSocial =
    FalcoViewerSocial;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        let intentos =
            0;

        const maximosIntentos =
            80;


        const esperarModulo =
            setInterval(
                () => {

                    const modulo =
                        document.querySelector(
                            '[data-modulo="area-social-recreativa"]'
                        );


                    if (
                        !modulo
                    ) {

                        intentos++;

                        if (
                            intentos >=
                            maximosIntentos
                        ) {

                            clearInterval(
                                esperarModulo
                            );

                        }

                        return;

                    }


                    const estaVacio =
                        modulo.classList.contains(
                            "capitulo-vacio"
                        ) ||
                        modulo.classList.contains(
                            "falco-capitulo-sin-datos"
                        ) ||
                        modulo.dataset.cleanupState ===
                            "sin-datos";


                    if (
                        estaVacio
                    ) {

                        clearInterval(
                            esperarModulo
                        );

                        console.info(
                            "FALCO® Viewer Social y Recreativo™: capítulo sin datos."
                        );

                        return;

                    }


                    clearInterval(
                        esperarModulo
                    );

                    FalcoViewerSocial.iniciar();

                },
                250
            );

    }
);