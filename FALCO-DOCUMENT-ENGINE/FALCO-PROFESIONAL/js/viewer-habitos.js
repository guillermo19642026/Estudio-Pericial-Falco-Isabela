/* =========================================================
   FALCO® VIEWER HÁBITOS Y CALIDAD DE VIDA™ v1.0
   Implementado sobre FALCO® Viewer Base™

   Función:
   - Organiza sueño, alimentación y actividad física.
   - Agrupa hábitos, consumos y rutinas.
   - Presenta escalas de valoración y sus explicaciones.
   - No modifica Firestore ni Expediente Core.
========================================================= */

const FalcoViewerHabitos =
    FalcoViewerBase.crear({

        version:
            "1.0",

        nombre:
            "Viewer Hábitos y Calidad de Vida™",

        selectorModulo:
            '[data-modulo="habitos-calidad-vida"]',

        claseContenedor:
            "falco-habitos-view",

        claseTarjeta:
            "falco-habitos-card",

        claseEncabezado:
            "falco-habitos-card-header",

        claseTitulo:
            "falco-habitos-card-title",

        claseCuerpo:
            "falco-habitos-card-body",

        claseFila:
            "falco-habitos-row",

        claseEtiqueta:
            "falco-habitos-label",

        claseValor:
            "falco-habitos-value",

        claseOriginal:
            "falco-habitos-original",

        claseActivo:
            "falco-habitos-activo",

        datasetAplicado:
            "habitosVersion",

        datasetGenerado:
            "habitosGenerated",

        datasetTipo:
            "habitosType",

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

            "sueno",
            "alimentacion",
            "actividadFisica",
            "consumos",
            "rutina",
            "calidadVida",
            "valoraciones",
            "general"

        ],

        titulos: {

            sueno:
                "Sueño y descanso",

            alimentacion:
                "Alimentación",

            actividadFisica:
                "Actividad física",

            consumos:
                "Consumos y hábitos",

            rutina:
                "Rutinas cotidianas",

            calidadVida:
                "Calidad de vida",

            valoraciones:
                "Valoraciones personales",

            general:
                "Información sobre hábitos"

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


            /* VALORACIONES */

            if (
                texto.includes(
                    "valoracion"
                ) ||
                texto.includes(
                    "puntaje"
                ) ||
                texto.includes(
                    "escala"
                ) ||
                texto.includes(
                    "del 1 al 10"
                ) ||
                texto.includes(
                    "explicacion"
                ) ||
                texto.includes(
                    "fundamente"
                ) ||
                texto.includes(
                    "justifique"
                )
            ) {

                return "valoraciones";

            }


            /* SUEÑO */

            if (
                texto.includes(
                    "sueno"
                ) ||
                texto.includes(
                    "descanso"
                ) ||
                texto.includes(
                    "dormir"
                ) ||
                texto.includes(
                    "duerme"
                ) ||
                texto.includes(
                    "insomnio"
                ) ||
                texto.includes(
                    "pesadilla"
                ) ||
                texto.includes(
                    "despertar"
                )
            ) {

                return "sueno";

            }


            /* ALIMENTACIÓN */

            if (
                texto.includes(
                    "alimentacion"
                ) ||
                texto.includes(
                    "comida"
                ) ||
                texto.includes(
                    "dieta"
                ) ||
                texto.includes(
                    "apetito"
                ) ||
                texto.includes(
                    "peso"
                ) ||
                texto.includes(
                    "hambre"
                )
            ) {

                return "alimentacion";

            }


            /* ACTIVIDAD FÍSICA */

            if (
                texto.includes(
                    "actividad fisica"
                ) ||
                texto.includes(
                    "ejercicio"
                ) ||
                texto.includes(
                    "deporte"
                ) ||
                texto.includes(
                    "gimnasio"
                ) ||
                texto.includes(
                    "caminata"
                ) ||
                texto.includes(
                    "entrenamiento"
                )
            ) {

                return "actividadFisica";

            }


            /* CONSUMOS */

            if (
                texto.includes(
                    "alcohol"
                ) ||
                texto.includes(
                    "tabaco"
                ) ||
                texto.includes(
                    "cigarr"
                ) ||
                texto.includes(
                    "sustancia"
                ) ||
                texto.includes(
                    "droga"
                ) ||
                texto.includes(
                    "consumo"
                ) ||
                texto.includes(
                    "cafe"
                ) ||
                texto.includes(
                    "bebida energetica"
                )
            ) {

                return "consumos";

            }


            /* RUTINAS */

            if (
                texto.includes(
                    "rutina"
                ) ||
                texto.includes(
                    "horario"
                ) ||
                texto.includes(
                    "actividad diaria"
                ) ||
                texto.includes(
                    "dia habitual"
                ) ||
                texto.includes(
                    "vida cotidiana"
                ) ||
                texto.includes(
                    "tareas domesticas"
                )
            ) {

                return "rutina";

            }


            /* CALIDAD DE VIDA */

            if (
                texto.includes(
                    "calidad de vida"
                ) ||
                texto.includes(
                    "bienestar"
                ) ||
                texto.includes(
                    "energia"
                ) ||
                texto.includes(
                    "cansancio"
                ) ||
                texto.includes(
                    "fatiga"
                ) ||
                texto.includes(
                    "autonomia"
                ) ||
                texto.includes(
                    "limitacion"
                )
            ) {

                return "calidadVida";

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

                "horas sueno":
                    "Horas de sueño",

                "horas de sueno":
                    "Horas de sueño",

                "calidad sueno":
                    "Calidad del sueño",

                "calidad de sueno":
                    "Calidad del sueño",

                "dificultad dormir":
                    "Dificultades para dormir",

                "dificultades para dormir":
                    "Dificultades para dormir",

                "despertares nocturnos":
                    "Despertares nocturnos",

                "pesadillas":
                    "Pesadillas",

                "descanso reparador":
                    "Descanso reparador",

                "alimentacion actual":
                    "Alimentación actual",

                "cambios alimentacion":
                    "Cambios en la alimentación",

                "cambios en la alimentacion":
                    "Cambios en la alimentación",

                "cambios apetito":
                    "Cambios en el apetito",

                "actividad fisica":
                    "Actividad física",

                "realiza actividad fisica":
                    "Realiza actividad física",

                "frecuencia actividad fisica":
                    "Frecuencia de actividad física",

                "tipo actividad fisica":
                    "Tipo de actividad física",

                "consume alcohol":
                    "Consumo de alcohol",

                "consumo alcohol":
                    "Consumo de alcohol",

                "consume tabaco":
                    "Consumo de tabaco",

                "consumo tabaco":
                    "Consumo de tabaco",

                "consume sustancias":
                    "Consumo de sustancias",

                "otras sustancias":
                    "Otras sustancias",

                "rutina diaria":
                    "Rutina diaria",

                "actividades cotidianas":
                    "Actividades cotidianas",

                "calidad de vida":
                    "Calidad de vida actual",

                "nivel energia":
                    "Nivel de energía",

                "nivel de energia":
                    "Nivel de energía",

                "cansancio":
                    "Cansancio o fatiga",

                "autonomia":
                    "Autonomía cotidiana",

                "valoracion":
                    "Valoración",

                "puntaje":
                    "Puntaje informado",

                "explicacion":
                    "Fundamento de la valoración",

                "observaciones habitos":
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
                    /\bSueno\b/g,
                    "Sueño"
                )
                .replace(
                    /\bAlimentacion\b/g,
                    "Alimentación"
                )
                .replace(
                    /\bFisica\b/g,
                    "Física"
                )
                .replace(
                    /\bEnergia\b/g,
                    "Energía"
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
                    valor.valor !== undefined &&
                    valor.valor !== null
                ) {

                    const explicacion =
                        valor.explicacion ||
                        valor.detalle ||
                        valor.observacion ||
                        "";

                    return explicacion
                        ? `${valor.valor}/10 — ${explicacion}`
                        : `${valor.valor}/10`;

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


            const etiquetaNormalizada =
                this.normalizarTexto(
                    etiqueta
                );


            if (
                etiquetaNormalizada.includes(
                    "valoracion"
                ) ||
                etiquetaNormalizada.includes(
                    "puntaje"
                )
            ) {

                const numero =
                    Number(
                        texto
                    );

                if (
                    Number.isFinite(
                        numero
                    ) &&
                    numero >= 1 &&
                    numero <= 10
                ) {

                    return `${numero}/10`;

                }

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

                "horas de sueno",
                "calidad del sueno",
                "dificultad para dormir",
                "despertares",
                "pesadillas",
                "descanso",
                "alimentacion",
                "apetito",
                "peso",
                "actividad fisica",
                "frecuencia",
                "deporte",
                "alcohol",
                "tabaco",
                "sustancias",
                "rutina",
                "actividades cotidianas",
                "calidad de vida",
                "bienestar",
                "energia",
                "cansancio",
                "autonomia",
                "valoracion",
                "puntaje",
                "explicacion",
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


window.FalcoViewerHabitos =
    FalcoViewerHabitos;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerHabitos.iniciar();

    }
);