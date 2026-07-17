/* =========================================================
   FALCO® CENTRO PROFESIONAL
   CORE v1.3
========================================================= */

const FalcoProfesional = {

  expedientes: [],

  elementos: {
    buscador: null,
    estadoCarga: null,
    lista: null,
    sinResultados: null,
    resumen: null
  },


  async init() {
    this.obtenerElementos();
    this.vincularEventos();

    console.log(
      "FALCO Centro Profesional™ v1.3 Ready"
    );

    await this.cargarExpedientes();
  },


  obtenerElementos() {
    this.elementos.buscador =
      document.getElementById(
        "buscarPericiado"
      );

    this.elementos.estadoCarga =
      document.getElementById(
        "estadoCarga"
      );

    this.elementos.lista =
      document.getElementById(
        "listaExpedientes"
      );

    this.elementos.sinResultados =
      document.getElementById(
        "sinResultados"
      );

    this.elementos.resumen =
      document.getElementById(
        "resumenExpedientes"
      );
  },


  vincularEventos() {
    this.elementos.buscador
      ?.addEventListener(
        "input",
        event => {
          this.filtrar(
            event.target.value
          );
        }
      );

    document.addEventListener(
      "click",
      event => {
        const boton =
          event.target.closest(
            "[data-expediente-id]"
          );

        if (!boton) {
          return;
        }

        const expedienteId =
          boton.dataset.expedienteId;

        if (!expedienteId) {
          console.error(
            "El expediente no tiene identificador."
          );

          return;
        }

        const destino =
          new URL(
            "expediente.html",
            window.location.href
          );

        destino.searchParams.set(
          "id",
          expedienteId
        );

        window.location.href =
          destino.href;
      }
    );
  },


  async cargarExpedientes() {
    try {
      if (
        !window
          .FalcoProfesionalFirebase
          ?.obtenerPericiados
      ) {
        throw new Error(
          "El conector profesional de Firebase no está disponible."
        );
      }

      const resultado =
        await window
          .FalcoProfesionalFirebase
          .obtenerPericiados();

      this.expedientes =
        Array.isArray(resultado)
          ? resultado.map(
              expediente =>
                this.normalizarExpediente(
                  expediente
                )
            )
          : [];

      this.ocultarCarga();

      this.renderizar(
        this.expedientes
      );

      console.log(
        "Expedientes cargados:",
        this.expedientes
      );

    } catch (error) {
      console.error(
        "No se pudieron cargar los expedientes:",
        error
      );

      this.mostrarError(
        error.message
      );
    }
  },


  normalizarExpediente(expediente) {
    const datos =
      expediente?.datos || {};

    const personales =
      datos["datos-personales"] || {};

    const judiciales =
      datos["datos-judiciales"] || {};

    return {
      id:
        expediente?.id || "",

      nombre:
        personales.nombre ||
        personales.nombreApellido ||
        expediente?.usuarioEmail ||
        "Periciado sin identificar",

      dni:
        personales.dni ||
        "Sin DNI",

      expediente:
        judiciales.expediente ||
        "Sin número de expediente",

      caratula:
        judiciales.caratula ||
        "Sin carátula registrada",

      tribunal:
        judiciales.tribunal ||
        judiciales.juzgado ||
        "Sin organismo registrado",

      estado:
        expediente?.estado ||
        "en_proceso",

      moduloActual:
        Number(
          expediente?.moduloActual ?? 0
        ),

      completados:
        Array.isArray(
          expediente?.completados
        )
          ? expediente.completados.length
          : 0,

      usuarioEmail:
        expediente?.usuarioEmail || "",

      ultimaActualizacion:
        expediente?.ultimaActualizacion ||
        null,

      original:
        expediente
    };
  },


  renderizar(expedientes) {
    const lista =
      this.elementos.lista;

    if (!lista) {
      return;
    }

    lista.innerHTML = "";

    if (!expedientes.length) {
      lista.hidden = true;

      if (
        this.elementos.sinResultados
      ) {
        this.elementos
          .sinResultados
          .hidden = false;
      }

      this.actualizarResumen(0);

      return;
    }

    if (
      this.elementos.sinResultados
    ) {
      this.elementos
        .sinResultados
        .hidden = true;
    }

    lista.innerHTML =
      expedientes
        .map(
          expediente =>
            this.crearTarjeta(
              expediente
            )
        )
        .join("");

    lista.hidden = false;

    this.actualizarResumen(
      expedientes.length
    );
  },


  crearTarjeta(expediente) {
    const finalizada =
      expediente.estado ===
      "finalizada";

    const claseEstado =
      finalizada
        ? "estado-finalizada"
        : "estado-proceso";

    const textoEstado =
      finalizada
        ? "Expediente completo"
        : "En proceso";

    return `
      <article class="expediente-card">

        <div class="expediente-card__cabecera">

          <div>
            <span class="expediente-card__etiqueta">
              Periciado
            </span>

            <h3>
              ${this.escaparHtml(
                expediente.nombre
              )}
            </h3>
          </div>

          <span class="estado-badge ${claseEstado}">
            ${textoEstado}
          </span>

        </div>


        <div class="expediente-card__datos">

          <div>
            <span>DNI</span>

            <strong>
              ${this.escaparHtml(
                expediente.dni
              )}
            </strong>
          </div>

          <div>
            <span>Expediente</span>

            <strong>
              ${this.escaparHtml(
                expediente.expediente
              )}
            </strong>
          </div>

          <div class="dato-completo">
            <span>Carátula</span>

            <strong>
              ${this.escaparHtml(
                expediente.caratula
              )}
            </strong>
          </div>

          <div class="dato-completo">
            <span>Organismo</span>

            <strong>
              ${this.escaparHtml(
                expediente.tribunal
              )}
            </strong>
          </div>

        </div>


        <div class="expediente-card__pie">

          <span>
            ${expediente.completados}
            de 16 módulos completos
          </span>

          <button
            class="expediente-button"
            type="button"
            data-expediente-id="${this.escaparHtml(
              expediente.id
            )}"
          >
            Abrir expediente
          </button>

        </div>

      </article>
    `;
  },


  filtrar(valor) {
    const consulta =
      String(valor || "")
        .trim()
        .toLocaleLowerCase("es");

    if (!consulta) {
      this.renderizar(
        this.expedientes
      );

      return;
    }

    const filtrados =
      this.expedientes.filter(
        expediente => {
          const contenido = [
            expediente.nombre,
            expediente.dni,
            expediente.expediente,
            expediente.caratula,
            expediente.tribunal,
            expediente.usuarioEmail
          ]
            .join(" ")
            .toLocaleLowerCase("es");

          return contenido.includes(
            consulta
          );
        }
      );

    this.renderizar(
      filtrados
    );
  },


  actualizarResumen(cantidad) {
    const resumen =
      this.elementos.resumen;

    if (!resumen) {
      return;
    }

    resumen.textContent =
      cantidad === 1
        ? "1 expediente visible"
        : `${cantidad} expedientes visibles`;

    resumen.hidden = false;
  },


  ocultarCarga() {
    if (
      this.elementos.estadoCarga
    ) {
      this.elementos
        .estadoCarga
        .hidden = true;
    }
  },


  mostrarError(mensaje) {
    const estado =
      this.elementos.estadoCarga;

    if (!estado) {
      return;
    }

    estado.hidden = false;

    estado.innerHTML = `
      <h3>
        No se pudieron cargar los expedientes
      </h3>

      <p>
        ${this.escaparHtml(mensaje)}
      </p>
    `;
  },


  escaparHtml(valor) {
    return String(
      valor ?? ""
    )
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => {
    FalcoProfesional.init();
  }
);