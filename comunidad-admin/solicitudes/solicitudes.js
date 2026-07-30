/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Solicitudes
   Versión 1.0
========================================================= */

"use strict";

const FalcoComunidadSolicitudes = {

    solicitudes: [],

    elementos: {},

    init() {

        this.cache();

        this.configurarEventos();

        this.actualizarIndicadores();

        this.render();

        console.info(
            "FALCO Comunidad Solicitudes™ v1.0 Ready"
        );

    },

    cache() {

        this.elementos = {

            listado:
                document.getElementById(
                    "contenedorSolicitudes"
                ),

            buscador:
                document.getElementById(
                    "buscarSolicitud"
                ),

            filtro:
                document.getElementById(
                    "filtroEstado"
                ),

            mensaje:
                document.getElementById(
                    "mensajeSolicitudes"
                ),

            total:
                document.getElementById(
                    "totalSolicitudes"
                ),

            nuevas:
                document.getElementById(
                    "solicitudesNuevas"
                ),

            analisis:
                document.getElementById(
                    "solicitudesAnalisis"
                ),

            respondidas:
                document.getElementById(
                    "solicitudesRespondidas"
                )

        };

    },

    configurarEventos() {

        this.elementos.buscador?.addEventListener(
            "input",
            () => this.render()
        );

        this.elementos.filtro?.addEventListener(
            "change",
            () => this.render()
        );

        document
            .getElementById(
                "botonRegistrarSolicitud"
            )
            ?.addEventListener(
                "click",
                () => {

                    alert(
                        "Próximamente se abrirá el formulario de registro."
                    );

                }
            );

    },

    actualizarIndicadores() {

        const total = this.solicitudes.length;

        const nuevas =
            this.solicitudes.filter(
                s => s.estado === "nueva"
            ).length;

        const analisis =
            this.solicitudes.filter(
                s => s.estado === "analisis"
            ).length;

        const respondidas =
            this.solicitudes.filter(
                s => s.estado === "respondida"
            ).length;

        this.elementos.total.textContent = total;
        this.elementos.nuevas.textContent = nuevas;
        this.elementos.analisis.textContent = analisis;
        this.elementos.respondidas.textContent = respondidas;

    },

    render() {

        if (!this.elementos.listado) return;

        if (!this.solicitudes.length) {

            this.elementos.listado.innerHTML = `

            <div class="admin-panel-vacio">

                <div>

                    <span class="admin-panel-vacio-icono">
                        01
                    </span>

                    <h4>
                        No hay solicitudes registradas
                    </h4>

                    <p>
                        Cuando la Comunidad se conecte con
                        Firebase las solicitudes aparecerán
                        automáticamente aquí.
                    </p>

                </div>

            </div>

            `;

            return;

        }

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        FalcoComunidadSolicitudes.init();

    }
);