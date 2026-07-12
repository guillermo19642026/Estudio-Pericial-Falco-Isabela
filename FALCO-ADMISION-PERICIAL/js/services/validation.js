/* =========================================================
   FALCO® VALIDATION ENGINE
   Validaciones reutilizables para formularios periciales
========================================================= */

(function iniciarFalcoValidation(global) {
  "use strict";

  const VERSION = "1.0.0";

  const CLASE_INVALIDO =
    "campo-invalido";

  const CLASE_MENSAJE =
    "mensaje-error";


  /* =======================================================
     UTILIDADES
  ======================================================= */

  function obtenerContenedorCampo(campo) {
    return (
      campo.closest(".campo") ||
      campo.parentElement
    );
  }


  function estaOculto(campo) {
    if (!campo) return true;

    if (campo.disabled) {
      return true;
    }

    if (
      campo.closest("[hidden]") ||
      campo.closest(".oculto")
    ) {
      return true;
    }

    const estilos =
      window.getComputedStyle(campo);

    return (
      estilos.display === "none" ||
      estilos.visibility === "hidden"
    );
  }


  function eliminarMensaje(campo) {
    const contenedor =
      obtenerContenedorCampo(campo);

    if (!contenedor) return;

    contenedor
      .querySelectorAll(
        `.${CLASE_MENSAJE}`
      )
      .forEach(elemento => {
        elemento.remove();
      });
  }


  function limpiarCampo(campo) {
    if (!campo) return;

    campo.classList.remove(
      CLASE_INVALIDO
    );

    campo.removeAttribute(
      "aria-invalid"
    );

    eliminarMensaje(campo);
  }


  function limpiarContenedor(
    contenedor = document
  ) {
    contenedor
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(limpiarCampo);
  }


  /* =======================================================
     MENSAJES
  ======================================================= */

  function obtenerMensaje(campo) {
    if (!campo) {
      return "Revise la información ingresada.";
    }

    if (campo.dataset.mensajeError) {
      return campo.dataset.mensajeError;
    }

    const etiqueta =
      obtenerContenedorCampo(campo)
        ?.querySelector("label")
        ?.textContent
        ?.replace("*", "")
        ?.trim();

    const nombreCampo =
      etiqueta || "Este dato";

    if (
      campo.validity.valueMissing
    ) {
      if (
        campo.type === "checkbox"
      ) {
        return "Debe confirmar esta opción para continuar.";
      }

      return `${nombreCampo} es obligatorio.`;
    }

    if (
      campo.validity.typeMismatch
    ) {
      if (campo.type === "email") {
        return "Ingrese un correo electrónico válido.";
      }

      if (campo.type === "url") {
        return "Ingrese una dirección web válida.";
      }
    }

    if (
      campo.validity.patternMismatch
    ) {
      return (
        campo.dataset.mensajePatron ||
        `${nombreCampo} no tiene un formato válido.`
      );
    }

    if (
      campo.validity.rangeUnderflow
    ) {
      return `El valor mínimo permitido es ${campo.min}.`;
    }

    if (
      campo.validity.rangeOverflow
    ) {
      return `El valor máximo permitido es ${campo.max}.`;
    }

    if (
      campo.validity.stepMismatch
    ) {
      return "Ingrese un valor permitido.";
    }

    if (
      campo.validity.tooShort
    ) {
      return `Debe ingresar al menos ${campo.minLength} caracteres.`;
    }

    if (
      campo.validity.tooLong
    ) {
      return `No puede superar los ${campo.maxLength} caracteres.`;
    }

    if (
      campo.validity.badInput
    ) {
      return "Ingrese un valor válido.";
    }

    return "Revise la información ingresada.";
  }


  function mostrarMensaje(
    campo,
    mensaje
  ) {
    if (!campo) return;

    limpiarCampo(campo);

    const contenedor =
      obtenerContenedorCampo(campo);

    if (!contenedor) return;

    campo.classList.add(
      CLASE_INVALIDO
    );

    campo.setAttribute(
      "aria-invalid",
      "true"
    );

    const elemento =
      document.createElement("span");

    elemento.className =
      CLASE_MENSAJE;

    elemento.textContent =
      mensaje;

    contenedor.appendChild(
      elemento
    );
  }


  /* =======================================================
     VALIDACIONES ESPECÍFICAS
  ======================================================= */

  function validarDni(valor) {
    const limpio =
      String(valor || "")
        .replace(/\D/g, "");

    return (
      limpio.length >= 7 &&
      limpio.length <= 9
    );
  }


  function validarTelefono(valor) {
    const limpio =
      String(valor || "")
        .replace(/\D/g, "");

    return (
      limpio.length >= 8 &&
      limpio.length <= 15
    );
  }


  function validarEmail(valor) {
    if (!valor) return false;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(String(valor).trim());
  }


  function validarFechaNoFutura(valor) {
    if (!valor) return false;

    const fecha =
      new Date(`${valor}T00:00:00`);

    const hoy =
      new Date();

    hoy.setHours(23, 59, 59, 999);

    return (
      !Number.isNaN(
        fecha.getTime()
      ) &&
      fecha <= hoy
    );
  }


  function validarFechaNacimiento(valor) {
    if (
      !validarFechaNoFutura(valor)
    ) {
      return false;
    }

    const fecha =
      new Date(`${valor}T00:00:00`);

    const hoy =
      new Date();

    let edad =
      hoy.getFullYear() -
      fecha.getFullYear();

    const mes =
      hoy.getMonth() -
      fecha.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoy.getDate() <
          fecha.getDate()
      )
    ) {
      edad--;
    }

    return edad >= 0 && edad <= 120;
  }


  function validarTextoMinimo(
    valor,
    minimo = 3
  ) {
    return (
      String(valor || "")
        .trim()
        .length >= minimo
    );
  }


  /* =======================================================
     VALIDACIÓN PERSONALIZADA DEL CAMPO
  ======================================================= */

  function validarReglasEspeciales(
    campo
  ) {
    const tipo =
      campo.dataset.validar;

    if (!tipo) {
      return {
        valido: true,
        mensaje: ""
      };
    }

    const valor =
      campo.value;

    switch (tipo) {
      case "dni":
        return {
          valido: validarDni(valor),
          mensaje:
            "Ingrese un DNI válido, sin puntos ni espacios."
        };

      case "telefono":
        return {
          valido:
            validarTelefono(valor),
          mensaje:
            "Ingrese un número de teléfono válido."
        };

      case "email":
        return {
          valido:
            validarEmail(valor),
          mensaje:
            "Ingrese un correo electrónico válido."
        };

      case "fecha-no-futura":
        return {
          valido:
            validarFechaNoFutura(valor),
          mensaje:
            "La fecha no puede ser posterior al día de hoy."
        };

      case "fecha-nacimiento":
        return {
          valido:
            validarFechaNacimiento(valor),
          mensaje:
            "Ingrese una fecha de nacimiento válida."
        };

      case "texto-detallado": {
        const minimo =
          Number(
            campo.dataset.minimo
          ) || 20;

        return {
          valido:
            validarTextoMinimo(
              valor,
              minimo
            ),
          mensaje:
            `Desarrolle la respuesta con al menos ${minimo} caracteres.`
        };
      }

      default:
        return {
          valido: true,
          mensaje: ""
        };
    }
  }


  /* =======================================================
     VALIDAR UN CAMPO
  ======================================================= */

  function validarCampo(
    campo,
    mostrarError = true
  ) {
    if (
      !campo ||
      estaOculto(campo)
    ) {
      return {
        valido: true,
        campo,
        mensaje: ""
      };
    }

    limpiarCampo(campo);

    if (!campo.checkValidity()) {
      const mensaje =
        obtenerMensaje(campo);

      if (mostrarError) {
        mostrarMensaje(
          campo,
          mensaje
        );
      }

      return {
        valido: false,
        campo,
        mensaje
      };
    }

    const reglaEspecial =
      validarReglasEspeciales(
        campo
      );

    if (!reglaEspecial.valido) {
      if (mostrarError) {
        mostrarMensaje(
          campo,
          reglaEspecial.mensaje
        );
      }

      return {
        valido: false,
        campo,
        mensaje:
          reglaEspecial.mensaje
      };
    }

    return {
      valido: true,
      campo,
      mensaje: ""
    };
  }


  /* =======================================================
     VALIDAR CONTENEDOR
  ======================================================= */

  function validarContenedor(
    contenedor = document,
    {
      enfocar = true,
      desplazar = true
    } = {}
  ) {
    const campos =
      contenedor.querySelectorAll(
        "input, select, textarea"
      );

    const errores = [];

    campos.forEach(campo => {
      const resultado =
        validarCampo(
          campo,
          true
        );

      if (!resultado.valido) {
        errores.push(resultado);
      }
    });

    const primerError =
      errores[0]?.campo || null;

    if (
      primerError &&
      enfocar
    ) {
      primerError.focus({
        preventScroll: true
      });
    }

    if (
      primerError &&
      desplazar
    ) {
      primerError.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    return {
      valido:
        errores.length === 0,

      errores,

      primerError
    };
  }


  /* =======================================================
     VINCULAR VALIDACIÓN EN TIEMPO REAL
  ======================================================= */

  function vincularCampo(campo) {
    if (
      !campo ||
      campo.dataset.validacionVinculada ===
        "true"
    ) {
      return;
    }

    campo.dataset.validacionVinculada =
      "true";

    campo.addEventListener(
      "invalid",
      evento => {
        evento.preventDefault();

        validarCampo(
          campo,
          true
        );
      }
    );

    const evento =
      campo.tagName === "SELECT" ||
      campo.type === "checkbox" ||
      campo.type === "radio"
        ? "change"
        : "input";

    campo.addEventListener(
      evento,
      () => {
        if (
          campo.classList.contains(
            CLASE_INVALIDO
          )
        ) {
          validarCampo(
            campo,
            true
          );
        }
      }
    );

    campo.addEventListener(
      "blur",
      () => {
        if (
          campo.required ||
          campo.value
        ) {
          validarCampo(
            campo,
            true
          );
        }
      }
    );
  }


  function vincularContenedor(
    contenedor = document
  ) {
    contenedor
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(vincularCampo);
  }


  /* =======================================================
     CAMPOS CONDICIONALES
  ======================================================= */

  function configurarObligatorios(
    contenedor,
    activo
  ) {
    if (!contenedor) return;

    contenedor
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(campo => {
        if (
          campo.dataset.opcional ===
            "true" ||
          campo.type === "file"
        ) {
          return;
        }

        campo.required =
          Boolean(activo);

        campo.disabled =
          !activo;

        if (!activo) {
          limpiarCampo(campo);
        }
      });
  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  global.FalcoValidation =
    Object.freeze({
      version: VERSION,

      validarCampo,
      validarContenedor,

      vincularCampo,
      vincularContenedor,

      limpiarCampo,
      limpiarContenedor,

      mostrarMensaje,
      obtenerMensaje,

      configurarObligatorios,

      validarDni,
      validarTelefono,
      validarEmail,
      validarFechaNoFutura,
      validarFechaNacimiento,
      validarTextoMinimo
    });


  console.log(
    `FALCO Validation Engine™ v${VERSION} Ready`
  );

})(window);