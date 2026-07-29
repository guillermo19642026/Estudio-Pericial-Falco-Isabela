/* =========================================================
   FALCO® COMUNIDAD
   Control principal de la landing institucional
   Versión 1.1
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FalcoComunidad = {

  selectores: {
    header: ".comunidad-header",
    enlacesInternos: 'a[href^="#"]',
    enlacesNavegacion: '.navegacion-principal a[href^="#"]',
    secciones: "main section[id]",
    elementosAnimados: [
      ".hero-contenido",
      ".hero-panel",
      ".presentacion-grid",
      ".titulo-centrado",
      ".tarjeta-diferencial",
      ".metodologia-encabezado",
      ".proceso-item",
      ".areas-introduccion",
      ".areas-listado article",
      ".plataforma-visual",
      ".plataforma-contenido",
      ".frase-institucional .contenedor",
      ".cta-contenido"
    ].join(","),
    anioActual: "#anio-actual"
  },

  clases: {
    headerScroll: "header-con-scroll",
    visible: "elemento-visible",
    preparado: "elemento-animado",
    enlaceActivo: "enlace-activo"
  },

  estado: {
    scrollAnterior: 0,
    ticking: false,
    observerAnimaciones: null,
    observerSecciones: null
  },


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.actualizarAnio();

    this.prepararAnimaciones();

    this.configurarScrollSuave();

    this.configurarHeader();

    this.configurarSeccionActiva();

    this.configurarEnlacesVacios();

    this.configurarMenuResponsive();

    this.configurarFormularioInstitucional();

    console.info(
      "FALCO Comunidad™ v1.1 Ready"
    );

  },


  /* =======================================================
     AÑO AUTOMÁTICO
  ======================================================= */

  actualizarAnio() {

    const elementoAnio =
      document.querySelector(
        this.selectores.anioActual
      );

    if (!elementoAnio) {
      return;
    }

    elementoAnio.textContent =
      String(new Date().getFullYear());

  },


  /* =======================================================
     HEADER AL HACER SCROLL
  ======================================================= */

  configurarHeader() {

    const header =
      document.querySelector(
        this.selectores.header
      );

    if (!header) {
      return;
    }

    const actualizarHeader = () => {

      const scrollActual =
        window.scrollY || 0;

      if (scrollActual > 30) {

        header.classList.add(
          this.clases.headerScroll
        );

      } else {

        header.classList.remove(
          this.clases.headerScroll
        );

      }

      this.estado.scrollAnterior =
        scrollActual;

      this.estado.ticking = false;

    };

    window.addEventListener(
      "scroll",
      () => {

        if (this.estado.ticking) {
          return;
        }

        this.estado.ticking = true;

        window.requestAnimationFrame(
          actualizarHeader
        );

      },
      {
        passive: true
      }
    );

    actualizarHeader();

  },


  /* =======================================================
     SCROLL SUAVE
  ======================================================= */

  configurarScrollSuave() {

    const enlaces =
      document.querySelectorAll(
        this.selectores.enlacesInternos
      );

    enlaces.forEach((enlace) => {

      enlace.addEventListener(
        "click",
        (evento) => {

          const destinoId =
            enlace.getAttribute("href");

          if (
            !destinoId ||
            destinoId === "#"
          ) {
            return;
          }

          const destino =
            document.querySelector(
              destinoId
            );

          if (!destino) {
            return;
          }

          evento.preventDefault();

          const header =
            document.querySelector(
              this.selectores.header
            );

          const alturaHeader =
            header
              ? header.offsetHeight
              : 0;

          const posicionDestino =
            destino.getBoundingClientRect().top
            + window.scrollY
            - alturaHeader
            - 18;

          window.scrollTo({
            top: posicionDestino,
            behavior: this.reducirMovimiento()
              ? "auto"
              : "smooth"
          });

          this.actualizarURL(
            destinoId
          );

        }
      );

    });

  },


  /* =======================================================
     ANIMACIONES DE ENTRADA
  ======================================================= */

  prepararAnimaciones() {

    const elementos =
      document.querySelectorAll(
        this.selectores.elementosAnimados
      );

    if (!elementos.length) {
      return;
    }

    elementos.forEach(
      (elemento, indice) => {

        elemento.classList.add(
          this.clases.preparado
        );

        const demora =
          Math.min(
            (indice % 4) * 80,
            240
          );

        elemento.style.setProperty(
          "--demora-entrada",
          `${demora}ms`
        );

      }
    );

    if (
      this.reducirMovimiento() ||
      !("IntersectionObserver" in window)
    ) {

      elementos.forEach(
        (elemento) => {

          elemento.classList.add(
            this.clases.visible
          );

        }
      );

      return;

    }

    this.estado.observerAnimaciones =
      new IntersectionObserver(
        (entradas, observer) => {

          entradas.forEach(
            (entrada) => {

              if (!entrada.isIntersecting) {
                return;
              }

              entrada.target.classList.add(
                this.clases.visible
              );

              observer.unobserve(
                entrada.target
              );

            }
          );

        },
        {
          threshold: 0.13,
          rootMargin:
            "0px 0px -60px 0px"
        }
      );

    elementos.forEach(
      (elemento) => {

        this.estado.observerAnimaciones.observe(
          elemento
        );

      }
    );

  },


  /* =======================================================
     SECCIÓN ACTIVA EN EL MENÚ
  ======================================================= */

  configurarSeccionActiva() {

    const secciones =
      document.querySelectorAll(
        this.selectores.secciones
      );

    const enlaces =
      document.querySelectorAll(
        this.selectores.enlacesNavegacion
      );

    if (
      !secciones.length ||
      !enlaces.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const enlacesPorId =
      new Map();

    enlaces.forEach(
      (enlace) => {

        const href =
          enlace.getAttribute("href");

        if (
          href &&
          href.startsWith("#")
        ) {

          enlacesPorId.set(
            href.substring(1),
            enlace
          );

        }

      }
    );

    this.estado.observerSecciones =
      new IntersectionObserver(
        (entradas) => {

          const visibles =
            entradas
              .filter(
                (entrada) =>
                  entrada.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio
                  - a.intersectionRatio
              );

          if (!visibles.length) {
            return;
          }

          const idActivo =
            visibles[0].target.id;

          enlaces.forEach(
            (enlace) => {

              enlace.classList.remove(
                this.clases.enlaceActivo
              );

              enlace.removeAttribute(
                "aria-current"
              );

            }
          );

          const enlaceActivo =
            enlacesPorId.get(
              idActivo
            );

          if (!enlaceActivo) {
            return;
          }

          enlaceActivo.classList.add(
            this.clases.enlaceActivo
          );

          enlaceActivo.setAttribute(
            "aria-current",
            "location"
          );

        },
        {
          threshold: [
            0.18,
            0.35,
            0.55
          ],

          rootMargin:
            "-20% 0px -55% 0px"
        }
      );

    secciones.forEach(
      (seccion) => {

        this.estado.observerSecciones.observe(
          seccion
        );

      }
    );

  },


  /* =======================================================
     PROTECCIÓN DE ENLACES VACÍOS
  ======================================================= */

  configurarEnlacesVacios() {

    const enlaces =
      document.querySelectorAll(
        'a[href=""], a[href="#"]'
      );

    enlaces.forEach(
      (enlace) => {

        enlace.addEventListener(
          "click",
          (evento) => {

            evento.preventDefault();

          }
        );

      }
    );

  },



  /* =======================================================
     MENÚ RESPONSIVE
  ======================================================= */

  configurarMenuResponsive() {

    const header =
      document.querySelector(
        this.selectores.header
      );

    if (!header) {
      return;
    }

    const navegacion =
      header.querySelector(
        ".navegacion-principal"
      );

    if (!navegacion) {
      return;
    }

    let botonMenu =
      header.querySelector(
        ".boton-menu-comunidad"
      );

    if (!botonMenu) {

      botonMenu =
        document.createElement(
          "button"
        );

      botonMenu.type = "button";

      botonMenu.className =
        "boton-menu-comunidad";

      botonMenu.setAttribute(
        "aria-label",
        "Abrir menú de navegación"
      );

      botonMenu.setAttribute(
        "aria-expanded",
        "false"
      );

      botonMenu.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;

      const contenedorHeader =
        header.querySelector(
          ".header-contenido"
        ) ||
        header.querySelector(
          ".contenedor"
        );

      if (!contenedorHeader) {
        return;
      }

      contenedorHeader.appendChild(
        botonMenu
      );

    }

    const cerrarMenu = () => {

      navegacion.classList.remove(
        "menu-abierto"
      );

      botonMenu.classList.remove(
        "menu-activo"
      );

      botonMenu.setAttribute(
        "aria-expanded",
        "false"
      );

      botonMenu.setAttribute(
        "aria-label",
        "Abrir menú de navegación"
      );

      document.body.classList.remove(
        "menu-comunidad-abierto"
      );

    };

    const abrirMenu = () => {

      navegacion.classList.add(
        "menu-abierto"
      );

      botonMenu.classList.add(
        "menu-activo"
      );

      botonMenu.setAttribute(
        "aria-expanded",
        "true"
      );

      botonMenu.setAttribute(
        "aria-label",
        "Cerrar menú de navegación"
      );

      document.body.classList.add(
        "menu-comunidad-abierto"
      );

    };

    botonMenu.addEventListener(
      "click",
      () => {

        const estaAbierto =
          navegacion.classList.contains(
            "menu-abierto"
          );

        if (estaAbierto) {
          cerrarMenu();
        } else {
          abrirMenu();
        }

      }
    );

    navegacion
      .querySelectorAll("a")
      .forEach((enlace) => {

        enlace.addEventListener(
          "click",
          cerrarMenu
        );

      });

    document.addEventListener(
      "click",
      (evento) => {

        if (
          !navegacion.classList.contains(
            "menu-abierto"
          )
        ) {
          return;
        }

        if (
          header.contains(
            evento.target
          )
        ) {
          return;
        }

        cerrarMenu();

      }
    );

    document.addEventListener(
      "keydown",
      (evento) => {

        if (
          evento.key === "Escape"
        ) {
          cerrarMenu();
        }

      }
    );

    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth > 900
        ) {
          cerrarMenu();
        }

      }
    );

  },


  /* =======================================================
     FORMULARIO INSTITUCIONAL
  ======================================================= */

  configurarFormularioInstitucional() {

    const formulario =
      document.querySelector(
        "#formularioInstitucional"
      ) ||
      document.querySelector(
        ".formulario-institucional form"
      ) ||
      document.querySelector(
        "form.formulario-institucional"
      );

    if (!formulario) {
      return;
    }

    const mensaje =
      document.querySelector(
        "#mensajeFormulario"
      ) ||
      formulario.querySelector(
        ".mensaje-formulario"
      );

    const botonEnviar =
      formulario.querySelector(
        'button[type="submit"]'
      );

    const campos =
      formulario.querySelectorAll(
        "input, select, textarea"
      );

    const mostrarMensaje = (
      texto,
      tipo
    ) => {

      if (!mensaje) {
        return;
      }

      mensaje.textContent =
        texto;

      mensaje.classList.remove(
        "exito",
        "error",
        "procesando",
        "visible"
      );

      mensaje.classList.add(
        "visible",
        tipo
      );

      mensaje.setAttribute(
        "role",
        tipo === "error"
          ? "alert"
          : "status"
      );

    };

    const limpiarMensaje = () => {

      if (!mensaje) {
        return;
      }

      mensaje.textContent = "";

      mensaje.classList.remove(
        "exito",
        "error",
        "procesando",
        "visible"
      );

      mensaje.removeAttribute(
        "role"
      );

    };

    const obtenerContenedorCampo = (
  campo
) => {

  return campo.closest(
    ".campo-formulario, .campo-confirmacion"
  ) ||
  campo.parentElement;

};


const obtenerMensajeError = (
  campo
) => {

      const contenedor =
        obtenerContenedorCampo(
          campo
        );

      if (!contenedor) {
        return null;
      }

      let error =
        contenedor.querySelector(
          ".campo-error"
        );

      if (!error) {

        error =
          document.createElement(
            "span"
          );

        error.className =
          "campo-error";

        error.setAttribute(
          "aria-live",
          "polite"
        );

        contenedor.appendChild(
          error
        );

      }

      return error;

    };

    const limpiarErrorCampo = (
      campo
    ) => {

      const contenedor =
        obtenerContenedorCampo(
          campo
        );

      const error =
        obtenerMensajeError(
          campo
        );

      if (contenedor) {

        contenedor.classList.remove(
          "campo-invalido"
        );

      }

      campo.removeAttribute(
        "aria-invalid"
      );

      if (error) {
        error.textContent = "";
      }

    };

    const marcarErrorCampo = (
      campo,
      texto
    ) => {

      const contenedor =
        obtenerContenedorCampo(
          campo
        );

      const error =
        obtenerMensajeError(
          campo
        );

      if (contenedor) {

        contenedor.classList.add(
          "campo-invalido"
        );

      }

      campo.setAttribute(
        "aria-invalid",
        "true"
      );

      if (error) {
        error.textContent = texto;
      }

    };

    const validarEmail = (
      valor
    ) => {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        valor
      );

    };

    const validarTelefono = (
      valor
    ) => {

      const telefonoLimpio =
        valor.replace(
          /[\s()+\-]/g,
          ""
        );

      return /^\d{8,15}$/.test(
        telefonoLimpio
      );

    };

    const validarCampo = (
      campo
    ) => {

      limpiarErrorCampo(
        campo
      );

      const valor =
        typeof campo.value === "string"
          ? campo.value.trim()
          : "";

      const nombre =
        campo.getAttribute("name") || "";

      const tipo =
        campo.getAttribute("type") || "";

      if (
        campo.hasAttribute("required")
      ) {

        if (
          tipo === "checkbox" &&
          !campo.checked
        ) {

          marcarErrorCampo(
            campo,
            "Debés aceptar esta confirmación para continuar."
          );

          return false;

        }

        if (
          tipo !== "checkbox" &&
          !valor
        ) {

          marcarErrorCampo(
            campo,
            "Este campo es obligatorio."
          );

          return false;

        }

      }

      if (
        !valor &&
        !campo.hasAttribute("required")
      ) {
        return true;
      }

      if (
        tipo === "email" ||
        nombre.toLowerCase().includes(
          "email"
        ) ||
        nombre.toLowerCase().includes(
          "correo"
        )
      ) {

        if (
          !validarEmail(
            valor
          )
        ) {

          marcarErrorCampo(
            campo,
            "Ingresá un correo electrónico válido."
          );

          return false;

        }

      }

      if (
        tipo === "tel" ||
        nombre.toLowerCase().includes(
          "telefono"
        ) ||
        nombre.toLowerCase().includes(
          "whatsapp"
        )
      ) {

        if (
          !validarTelefono(
            valor
          )
        ) {

          marcarErrorCampo(
            campo,
            "Ingresá un teléfono válido con código de área."
          );

          return false;

        }

      }

      if (
        campo.hasAttribute(
          "minlength"
        )
      ) {

        const minimo =
          Number(
            campo.getAttribute(
              "minlength"
            )
          );

        if (
          valor.length < minimo
        ) {

          marcarErrorCampo(
            campo,
            `Ingresá al menos ${minimo} caracteres.`
          );

          return false;

        }

      }

      return true;

    };

    campos.forEach(
      (campo) => {

        campo.addEventListener(
          "blur",
          () => {

            validarCampo(
              campo
            );

          }
        );

        campo.addEventListener(
          "input",
          () => {

            if (
              campo.getAttribute(
                "aria-invalid"
              ) === "true"
            ) {

              validarCampo(
                campo
              );

            }

            limpiarMensaje();

          }
        );

        campo.addEventListener(
          "change",
          () => {

            if (
              campo.getAttribute(
                "aria-invalid"
              ) === "true"
            ) {

              validarCampo(
                campo
              );

            }

            limpiarMensaje();

          }
        );

      }
    );

    formulario.addEventListener(
      "submit",
      (evento) => {

        evento.preventDefault();

        limpiarMensaje();

        let formularioValido =
          true;

        let primerCampoInvalido =
          null;

        campos.forEach(
          (campo) => {

            const esValido =
              validarCampo(
                campo
              );

            if (!esValido) {

              formularioValido =
                false;

              if (
                !primerCampoInvalido
              ) {

                primerCampoInvalido =
                  campo;

              }

            }

          }
        );

        if (!formularioValido) {

          mostrarMensaje(
            "Revisá los campos señalados antes de enviar la solicitud.",
            "error"
          );

          if (
            primerCampoInvalido
          ) {

            primerCampoInvalido.focus({
              preventScroll: true
            });

            const header =
              document.querySelector(
                this.selectores.header
              );

            const alturaHeader =
              header
                ? header.offsetHeight
                : 0;

            const posicion =
              primerCampoInvalido
                .getBoundingClientRect()
                .top
              + window.scrollY
              - alturaHeader
              - 30;

            window.scrollTo({
              top: posicion,
              behavior:
                this.reducirMovimiento()
                  ? "auto"
                  : "smooth"
            });

          }

          return;

        }

        if (botonEnviar) {

          botonEnviar.disabled =
            true;

          botonEnviar.setAttribute(
            "aria-busy",
            "true"
          );

        }

        mostrarMensaje(
          "Preparando la solicitud institucional…",
          "procesando"
        );

        const datos =
          new FormData(
            formulario
          );

        const obtenerDato = (
          posiblesNombres
        ) => {

          for (
            const nombre
            of posiblesNombres
          ) {

            const valor =
              datos.get(
                nombre
              );

            if (
              typeof valor === "string" &&
              valor.trim()
            ) {

              return valor.trim();

            }

          }

          return "";

        };

        const institucion =
          obtenerDato([
            "institucion",
            "organizacion",
            "nombreInstitucion"
          ]);

        const responsable =
  obtenerDato([
    "responsable",
    "nombre",
    "nombreResponsable",
    "nombreContacto"
  ]);

        const cargo =
  obtenerDato([
    "cargo",
    "rol",
    "cargoContacto"
  ]);

       const email =
  obtenerDato([
    "email",
    "correo",
    "correoContacto"
  ]);

       const telefono =
  obtenerDato([
    "telefono",
    "whatsapp",
    "telefonoContacto"
  ]);

        const localidad =
          obtenerDato([
            "localidad",
            "ciudad",
            "ubicacion"
          ]);

        const tipoInstitucion =
          obtenerDato([
            "tipoInstitucion",
            "tipo_institucion",
            "tipo"
          ]);

        const cantidad =
          obtenerDato([
            "cantidad",
            "cantidadParticipantes",
            "participantes"
          ]);

       const modalidad =
  obtenerDato([
    "modalidad",
    "modalidadPreferida"
  ]);

        const necesidad =
  obtenerDato([
    "necesidad",
    "consulta",
    "objetivo",
    "mensaje",
    "descripcionConsulta"
  ]);

        const lineasMensaje = [
          "Hola, quisiera solicitar una reunión institucional por FALCO® Comunidad.",
          "",
          institucion
            ? `Institución: ${institucion}`
            : "",
          tipoInstitucion
            ? `Tipo de institución: ${tipoInstitucion}`
            : "",
          responsable
            ? `Responsable: ${responsable}`
            : "",
          cargo
            ? `Cargo o función: ${cargo}`
            : "",
          email
            ? `Correo: ${email}`
            : "",
          telefono
            ? `Teléfono: ${telefono}`
            : "",
          localidad
            ? `Localidad: ${localidad}`
            : "",
          cantidad
            ? `Cantidad estimada de participantes: ${cantidad}`
            : "",
          modalidad
            ? `Modalidad de interés: ${modalidad}`
            : "",
          necesidad
            ? `Necesidad institucional: ${necesidad}`
            : ""
        ].filter(
          (linea) =>
            linea !== ""
        );

        const mensajeWhatsApp =
          lineasMensaje.join(
            "\n"
          );

        const numeroWhatsApp =
          "5491132049521";

        const urlWhatsApp =
          `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
            mensajeWhatsApp
          )}`;

        mostrarMensaje(
          "La solicitud fue preparada correctamente. Se abrirá WhatsApp para completar el envío.",
          "exito"
        );

        window.setTimeout(
          () => {

            window.open(
              urlWhatsApp,
              "_blank",
              "noopener,noreferrer"
            );

            if (botonEnviar) {

              botonEnviar.disabled =
                false;

              botonEnviar.removeAttribute(
                "aria-busy"
              );

            }

          },
          600
        );

      }
    );

  },


  /* =======================================================
     UTILIDADES
  ======================================================= */

  reducirMovimiento() {

    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  },


  actualizarURL(hash) {

    if (
      !hash ||
      !window.history ||
      typeof window.history.replaceState
        !== "function"
    ) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      hash
    );

  }

};


/* =========================================================
   INICIO SEGURO
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      FalcoComunidad.init();

    },
    {
      once: true
    }
  );

} else {

  FalcoComunidad.init();

}


/* =========================================================
   EXPOSICIÓN PARA PRUEBAS
========================================================= */

window.FalcoComunidad =
  FalcoComunidad;