/* =========================================================
   FALCO® Viewer Navigation™ v1.0
   Navegación profesional del Expediente Digital

   Funciones:
   - Genera índice automático de capítulos
   - Permite navegar con un clic
   - Resalta el capítulo visible
   - Incluye progreso de lectura
   - Se adapta a dispositivos móviles

   No modifica:
   - Firestore
   - expediente-loader.js
   - expediente-core.js
========================================================= */

const FalcoViewerNavigation = {

    version: "1.0",

    intentos: 0,

    maxIntentos: 60,

    intervalo: null,

    observer: null,

    navegacion: null,

    lista: null,

    barraProgreso: null,

    botonMovil: null,

    capitulos: [],

    capituloActivo: null,


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        console.info(
            `FALCO Viewer Navigation™ v${this.version} Ready`
        );

        this.esperarExpediente();

    },


    /* =====================================================
       ESPERAR EXPEDIENTE RENDERIZADO
    ===================================================== */

    esperarExpediente() {

        this.intervalo = window.setInterval(() => {

            this.intentos++;

            const expediente =
                document.getElementById("expediente");

            const capitulos =
                expediente?.querySelectorAll(
                    '[id^="capitulo-"]'
                );

            const groupsActivo =
                expediente?.classList.contains(
                    "falco-groups-activo"
                );

            if (
                expediente &&
                capitulos?.length &&
                groupsActivo
            ) {

                window.clearInterval(
                    this.intervalo
                );

                this.prepararCapitulos();
                this.crearNavegacion();
                this.crearBotonMovil();
                this.activarScrollSpy();
                this.activarProgreso();
                this.activarEventosGlobales();
                this.marcarExpediente();

                console.info(
                    "FALCO Viewer Navigation™ aplicado correctamente."
                );

                return;

            }

            if (
                this.intentos >=
                this.maxIntentos
            ) {

                window.clearInterval(
                    this.intervalo
                );

                console.warn(
                    "FALCO Viewer Navigation™ no encontró el expediente preparado."
                );

            }

        }, 250);

    },


    /* =====================================================
       PREPARAR CAPÍTULOS
    ===================================================== */

    prepararCapitulos() {

        const expediente =
            document.getElementById("expediente");

        if (!expediente) {
            return;
        }

        this.capitulos =
            Array.from(
                expediente.querySelectorAll(
                    '[id^="capitulo-"]'
                )
            )
            .filter(capitulo => {

                return (
                    !capitulo.hidden &&
                    capitulo.offsetParent !== null
                );

            })
            .map((capitulo, indice) => {

                const titulo =
                    this.obtenerTituloCapitulo(
                        capitulo,
                        indice
                    );

                const numero =
                    this.obtenerNumeroCapitulo(
                        capitulo,
                        indice
                    );

                capitulo.classList.add(
                    "falco-capitulo-navegable"
                );

                capitulo.dataset.navigationIndex =
                    String(indice);

                return {
                    elemento: capitulo,
                    id: capitulo.id,
                    titulo,
                    numero,
                    indice
                };

            });

    },


    /* =====================================================
       OBTENER TÍTULO
    ===================================================== */

    obtenerTituloCapitulo(
        capitulo,
        indice
    ) {

        const selectores = [
            ".capitulo-titulo",
            ".titulo-capitulo",
            ".falco-capitulo-titulo",
            "h1",
            "h2",
            "h3",
            "header h2",
            "header h3"
        ];

        for (
            const selector of selectores
        ) {

            const elemento =
                capitulo.querySelector(
                    selector
                );

            const texto =
                elemento?.textContent?.trim();

            if (texto) {

                return this.limpiarTitulo(
                    texto
                );

            }

        }

        const numero =
            String(indice + 1).padStart(
                2,
                "0"
            );

        return `Módulo ${numero}`;

    },


    /* =====================================================
       OBTENER NÚMERO
    ===================================================== */

    obtenerNumeroCapitulo(
        capitulo,
        indice
    ) {

        const coincidencia =
            capitulo.id.match(
                /capitulo-(\d+)/i
            );

        if (coincidencia?.[1]) {

            return String(
                coincidencia[1]
            ).padStart(
                2,
                "0"
            );

        }

        return String(
            indice + 1
        ).padStart(
            2,
            "0"
        );

    },


    /* =====================================================
       CREAR NAVEGACIÓN
    ===================================================== */

    crearNavegacion() {

        if (!this.capitulos.length) {
            return;
        }

        document
            .querySelector(
                ".falco-viewer-navigation"
            )
            ?.remove();

        const navegacion =
            document.createElement("aside");

        navegacion.className =
            "falco-viewer-navigation";

        navegacion.setAttribute(
            "aria-label",
            "Índice del expediente"
        );

        navegacion.innerHTML = `

            <div class="falco-navigation-panel">

                <header class="falco-navigation-header">

                    <div class="falco-navigation-identidad">

                        <span class="falco-navigation-marca">
                            FALCO®
                        </span>

                        <h2 class="falco-navigation-title">
                            Expediente
                        </h2>

                    </div>

                    <button
                        type="button"
                        class="falco-navigation-close"
                        aria-label="Cerrar índice"
                    >
                        ×
                    </button>

                </header>

                <div class="falco-navigation-progress">

                    <div class="falco-navigation-progress-info">

                        <span>Recorrido</span>

                        <span
                            class="falco-navigation-progress-value"
                        >
                            0%
                        </span>

                    </div>

                    <div class="falco-navigation-progress-track">

                        <div
                            class="falco-navigation-progress-bar"
                        ></div>

                    </div>

                </div>

                <nav class="falco-navigation-content">

                    <ol class="falco-navigation-list"></ol>

                </nav>

                <footer class="falco-navigation-footer">

                    <button
                        type="button"
                        class="falco-navigation-top"
                    >
                        ↑ Volver al inicio
                    </button>

                </footer>

            </div>

        `;

        document.body.appendChild(
            navegacion
        );

        this.navegacion =
            navegacion;

        this.lista =
            navegacion.querySelector(
                ".falco-navigation-list"
            );

        this.barraProgreso =
            navegacion.querySelector(
                ".falco-navigation-progress-bar"
            );

        this.valorProgreso =
            navegacion.querySelector(
                ".falco-navigation-progress-value"
            );

        this.generarEnlaces();

        this.activarEventosNavegacion();

    },


    /* =====================================================
       GENERAR ENLACES
    ===================================================== */

    generarEnlaces() {

        if (!this.lista) {
            return;
        }

        const fragmento =
            document.createDocumentFragment();

        this.capitulos.forEach(
            capitulo => {

                const item =
                    document.createElement("li");

                item.className =
                    "falco-navigation-item";

                const boton =
                    document.createElement("button");

                boton.type = "button";

                boton.className =
                    "falco-navigation-link";

                boton.dataset.target =
                    capitulo.id;

                boton.setAttribute(
                    "aria-label",
                    `Ir a ${capitulo.titulo}`
                );

                boton.innerHTML = `

                    <span
                        class="falco-navigation-number"
                    >
                        ${this.escaparHtml(
                            capitulo.numero
                        )}
                    </span>

                    <span
                        class="falco-navigation-text"
                    >
                        ${this.escaparHtml(
                            capitulo.titulo
                        )}
                    </span>

                    <span
                        class="falco-navigation-status"
                        aria-hidden="true"
                    ></span>

                `;

                boton.addEventListener(
                    "click",
                    () => {

                        this.irACapitulo(
                            capitulo.id
                        );

                    }
                );

                item.appendChild(
                    boton
                );

                fragmento.appendChild(
                    item
                );

            }
        );

        this.lista.appendChild(
            fragmento
        );

    },


    /* =====================================================
       CREAR BOTÓN MÓVIL
    ===================================================== */

    crearBotonMovil() {

        document
            .querySelector(
                ".falco-navigation-toggle"
            )
            ?.remove();

        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className =
            "falco-navigation-toggle";

        boton.setAttribute(
            "aria-label",
            "Abrir índice del expediente"
        );

        boton.setAttribute(
            "aria-expanded",
            "false"
        );

        boton.innerHTML = `

            <span
                class="falco-navigation-toggle-icon"
                aria-hidden="true"
            >
                ☰
            </span>

            <span
                class="falco-navigation-toggle-text"
            >
                Índice
            </span>

        `;

        boton.addEventListener(
            "click",
            () => {

                this.alternarNavegacion();

            }
        );

        document.body.appendChild(
            boton
        );

        this.botonMovil =
            boton;

    },


    /* =====================================================
       EVENTOS DE NAVEGACIÓN
    ===================================================== */

    activarEventosNavegacion() {

        const cerrar =
            this.navegacion?.querySelector(
                ".falco-navigation-close"
            );

        const volverArriba =
            this.navegacion?.querySelector(
                ".falco-navigation-top"
            );

        cerrar?.addEventListener(
            "click",
            () => {

                this.cerrarNavegacion();

            }
        );

        volverArriba?.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        this.cerrarNavegacion();

    }
);

    },


    /* =====================================================
       NAVEGAR A CAPÍTULO
    ===================================================== */

    irACapitulo(id) {

        const capitulo =
            document.getElementById(id);

        if (!capitulo) {
            return;
        }

        const margenSuperior =
            24;

        const posicion =
            capitulo.getBoundingClientRect().top +
            window.scrollY -
            margenSuperior;

        window.scrollTo({
            top: posicion,
            behavior: "smooth"
        });

        capitulo.classList.add(
            "falco-capitulo-destacado"
        );

        window.setTimeout(
            () => {

                capitulo.classList.remove(
                    "falco-capitulo-destacado"
                );

            },
            1500
        );

        this.cerrarNavegacion();

    },


    /* =====================================================
       SCROLL SPY
    ===================================================== */

    activarScrollSpy() {

        if (
            !("IntersectionObserver" in window)
        ) {

            this.activarScrollSpyAlternativo();
            return;

        }

        this.observer =
            new IntersectionObserver(
                entradas => {

                    const visibles =
                        entradas
                            .filter(
                                entrada =>
                                    entrada.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    Math.abs(
                                        a.boundingClientRect.top
                                    ) -
                                    Math.abs(
                                        b.boundingClientRect.top
                                    )
                            );

                    if (!visibles.length) {
                        return;
                    }

                    const capitulo =
                        visibles[0].target;

                    this.marcarCapituloActivo(
                        capitulo.id
                    );

                },
                {
                    root: null,
                    rootMargin:
                        "-15% 0px -65% 0px",
                    threshold: [
                        0,
                        0.1,
                        0.25
                    ]
                }
            );

        this.capitulos.forEach(
            capitulo => {

                this.observer.observe(
                    capitulo.elemento
                );

            }
        );

    },


    /* =====================================================
       SCROLL SPY ALTERNATIVO
    ===================================================== */

    activarScrollSpyAlternativo() {

        let pendiente = false;

        window.addEventListener(
            "scroll",
            () => {

                if (pendiente) {
                    return;
                }

                pendiente = true;

                window.requestAnimationFrame(
                    () => {

                        this.detectarCapituloVisible();

                        pendiente = false;

                    }
                );

            },
            {
                passive: true
            }
        );

        this.detectarCapituloVisible();

    },


    detectarCapituloVisible() {

        const referencia =
            window.innerHeight * 0.3;

        let capituloEncontrado =
            this.capitulos[0];

        this.capitulos.forEach(
            capitulo => {

                const rect =
                    capitulo.elemento
                        .getBoundingClientRect();

                if (
                    rect.top <= referencia
                ) {

                    capituloEncontrado =
                        capitulo;

                }

            }
        );

        if (capituloEncontrado) {

            this.marcarCapituloActivo(
                capituloEncontrado.id
            );

        }

    },


    /* =====================================================
       MARCAR CAPÍTULO ACTIVO
    ===================================================== */

    marcarCapituloActivo(id) {

        if (
            !id ||
            this.capituloActivo === id
        ) {
            return;
        }

        this.capituloActivo =
            id;

        document
            .querySelectorAll(
                ".falco-navigation-link"
            )
            .forEach(
                enlace => {

                    const activo =
                        enlace.dataset.target === id;

                    enlace.classList.toggle(
                        "activo",
                        activo
                    );

                    enlace.setAttribute(
                        "aria-current",
                        activo
                            ? "true"
                            : "false"
                    );

                }
            );

        this.capitulos.forEach(
            capitulo => {

                capitulo.elemento
                    .classList.toggle(
                        "falco-capitulo-activo",
                        capitulo.id === id
                    );

            }
        );

        this.asegurarEnlaceVisible(id);

    },


    /* =====================================================
       MANTENER ENLACE VISIBLE
    ===================================================== */

    asegurarEnlaceVisible(id) {

        const enlace =
            this.navegacion?.querySelector(
                `[data-target="${CSS.escape(id)}"]`
            );

        enlace?.scrollIntoView({
            block: "nearest",
            behavior: "smooth"
        });

    },


    /* =====================================================
       PROGRESO
    ===================================================== */

    activarProgreso() {

        let pendiente = false;

        const actualizar = () => {

            if (pendiente) {
                return;
            }

            pendiente = true;

            window.requestAnimationFrame(
                () => {

                    this.actualizarProgreso();

                    pendiente = false;

                }
            );

        };

        window.addEventListener(
            "scroll",
            actualizar,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            actualizar
        );

        this.actualizarProgreso();

    },


    actualizarProgreso() {

        const documento =
            document.documentElement;

        const recorrido =
            documento.scrollHeight -
            window.innerHeight;

        const porcentaje =
            recorrido > 0
                ? (
                    window.scrollY /
                    recorrido
                ) * 100
                : 0;

        const valor =
            Math.min(
                100,
                Math.max(
                    0,
                    Math.round(porcentaje)
                )
            );

        if (this.barraProgreso) {

            this.barraProgreso.style.width =
                `${valor}%`;

        }

        if (this.valorProgreso) {

            this.valorProgreso.textContent =
                `${valor}%`;

        }

    },


    /* =====================================================
       ABRIR / CERRAR
    ===================================================== */

    alternarNavegacion() {

        const abierta =
            this.navegacion?.classList.contains(
                "abierta"
            );

        if (abierta) {

            this.cerrarNavegacion();

        } else {

            this.abrirNavegacion();

        }

    },


    abrirNavegacion() {

        this.navegacion?.classList.add(
            "abierta"
        );

        document.body.classList.add(
            "falco-navigation-abierta"
        );

        this.botonMovil?.setAttribute(
            "aria-expanded",
            "true"
        );

    },


    cerrarNavegacion() {

        this.navegacion?.classList.remove(
            "abierta"
        );

        document.body.classList.remove(
            "falco-navigation-abierta"
        );

        this.botonMovil?.setAttribute(
            "aria-expanded",
            "false"
        );

    },


    cerrarNavegacionMovil() {

        if (
            window.matchMedia(
                "(max-width: 1180px)"
            ).matches
        ) {

            this.cerrarNavegacion();

        }

    },


    /* =====================================================
       EVENTOS GLOBALES
    ===================================================== */

    activarEventosGlobales() {

        document.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Escape"
                ) {

                    this.cerrarNavegacion();

                }

            }
        );

        document.addEventListener(
            "click",
            evento => {

                const vistaMovil =
                    window.matchMedia(
                        "(max-width: 1180px)"
                    ).matches;

                const abierta =
                    this.navegacion?.classList
                        .contains("abierta");

                if (
                    !vistaMovil ||
                    !abierta
                ) {
                    return;
                }

                const dentroNavegacion =
                    this.navegacion?.contains(
                        evento.target
                    );

                const dentroBoton =
                    this.botonMovil?.contains(
                        evento.target
                    );

                if (
                    !dentroNavegacion &&
                    !dentroBoton
                ) {

                    this.cerrarNavegacion();

                }

            }
        );

    },


    /* =====================================================
       MARCAR EXPEDIENTE
    ===================================================== */

    marcarExpediente() {

        const expediente =
            document.getElementById(
                "expediente"
            );

        if (!expediente) {
            return;
        }

        expediente.classList.add(
            "falco-navigation-activa"
        );

        expediente.dataset
            .navigationVersion =
            this.version;

        document.body.classList.add(
            "falco-viewer-con-navegacion"
        );

    },


    /* =====================================================
       RESTAURAR
    ===================================================== */

    restaurar() {

        this.observer?.disconnect();

        this.navegacion?.remove();
        this.botonMovil?.remove();

        document.body.classList.remove(
            "falco-viewer-con-navegacion",
            "falco-navigation-abierta"
        );

        const expediente =
            document.getElementById(
                "expediente"
            );

        expediente?.classList.remove(
            "falco-navigation-activa"
        );

        if (expediente) {

            delete expediente.dataset
                .navigationVersion;

        }

        this.capitulos.forEach(
            capitulo => {

                capitulo.elemento.classList.remove(
                    "falco-capitulo-navegable",
                    "falco-capitulo-activo",
                    "falco-capitulo-destacado"
                );

                delete capitulo.elemento.dataset
                    .navigationIndex;

            }
        );

        console.info(
            "FALCO Viewer Navigation™ restaurado."
        );

    },


    /* =====================================================
       UTILIDADES
    ===================================================== */

    limpiarTitulo(valor) {

        return String(
            valor || ""
        )
            .replace(
                /^\s*\d+\s*[.\-–—:)]*\s*/,
                ""
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    },


    escaparHtml(valor) {

        return String(
            valor ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

};


/* =========================================================
   EXPOSICIÓN GLOBAL
========================================================= */

window.FalcoViewerNavigation =
    FalcoViewerNavigation;


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoViewerNavigation.init();

    }
);