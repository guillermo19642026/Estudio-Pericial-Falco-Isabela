/* =========================================================
   FALCO® STORAGE ENGINE
   Guardado local reutilizable
========================================================= */

(function iniciarFalcoStorage(global) {
  "use strict";

  const VERSION = "1.0.0";


  /* =======================================================
     UTILIDADES INTERNAS
  ======================================================= */

  function validarClave(clave) {
    if (
      typeof clave !== "string" ||
      clave.trim() === ""
    ) {
      throw new TypeError(
        "FALCO Storage: la clave debe ser un texto válido."
      );
    }

    return clave.trim();
  }


  function clonar(valor) {
    if (valor === undefined) {
      return undefined;
    }

    if (
      typeof structuredClone === "function"
    ) {
      return structuredClone(valor);
    }

    return JSON.parse(
      JSON.stringify(valor)
    );
  }


  function crearResultado({
    ok,
    datos = null,
    error = null
  }) {
    return {
      ok,
      datos,
      error
    };
  }


  /* =======================================================
     GUARDAR
  ======================================================= */

  function guardar(clave, datos) {
    try {
      const claveValida =
        validarClave(clave);

      const contenido = {
        version: VERSION,
        actualizadoEn:
          new Date().toISOString(),
        datos: clonar(datos)
      };

      localStorage.setItem(
        claveValida,
        JSON.stringify(contenido)
      );

      return crearResultado({
        ok: true,
        datos: clonar(contenido)
      });

    } catch (error) {
      console.error(
        "FALCO Storage: no se pudo guardar.",
        error
      );

      return crearResultado({
        ok: false,
        error
      });
    }
  }


  /* =======================================================
     OBTENER
  ======================================================= */

  function obtener(
    clave,
    valorPredeterminado = null
  ) {
    try {
      const claveValida =
        validarClave(clave);

      const contenidoGuardado =
        localStorage.getItem(
          claveValida
        );

      if (!contenidoGuardado) {
        return crearResultado({
          ok: true,
          datos: clonar(
            valorPredeterminado
          )
        });
      }

      const contenido =
        JSON.parse(
          contenidoGuardado
        );

      /*
       * Compatibilidad con el formato anterior:
       * si localStorage contiene directamente el estado,
       * también lo recuperamos correctamente.
       */
      const datos =
        contenido &&
        typeof contenido === "object" &&
        Object.prototype.hasOwnProperty.call(
          contenido,
          "datos"
        ) &&
        Object.prototype.hasOwnProperty.call(
          contenido,
          "version"
        )
          ? contenido.datos
          : contenido;

      return crearResultado({
        ok: true,
        datos: clonar(datos)
      });

    } catch (error) {
      console.error(
        "FALCO Storage: no se pudieron recuperar los datos.",
        error
      );

      return crearResultado({
        ok: false,
        datos: clonar(
          valorPredeterminado
        ),
        error
      });
    }
  }


  /* =======================================================
     ELIMINAR
  ======================================================= */

  function eliminar(clave) {
    try {
      const claveValida =
        validarClave(clave);

      localStorage.removeItem(
        claveValida
      );

      return crearResultado({
        ok: true
      });

    } catch (error) {
      console.error(
        "FALCO Storage: no se pudo eliminar la información.",
        error
      );

      return crearResultado({
        ok: false,
        error
      });
    }
  }


  /* =======================================================
     EXISTENCIA
  ======================================================= */

  function existe(clave) {
    try {
      const claveValida =
        validarClave(clave);

      return localStorage.getItem(
        claveValida
      ) !== null;

    } catch (error) {
      console.error(
        "FALCO Storage: no se pudo verificar la clave.",
        error
      );

      return false;
    }
  }


  /* =======================================================
     ACTUALIZAR PARCIALMENTE
  ======================================================= */

  function actualizar(
    clave,
    cambios,
    valorInicial = {}
  ) {
    if (
      !cambios ||
      typeof cambios !== "object" ||
      Array.isArray(cambios)
    ) {
      return crearResultado({
        ok: false,
        error: new TypeError(
          "FALCO Storage: los cambios deben ser un objeto."
        )
      });
    }

    const resultadoActual =
      obtener(
        clave,
        valorInicial
      );

    const estadoActual =
      resultadoActual.datos &&
      typeof resultadoActual.datos ===
        "object" &&
      !Array.isArray(
        resultadoActual.datos
      )
        ? resultadoActual.datos
        : {};

    const estadoActualizado = {
      ...estadoActual,
      ...clonar(cambios)
    };

    return guardar(
      clave,
      estadoActualizado
    );
  }


  /* =======================================================
     EXPORTAR RESPALDO
  ======================================================= */

  function exportar(clave) {
    const resultado =
      obtener(clave);

    if (!resultado.ok) {
      return resultado;
    }

    try {
      const respaldo = {
        sistema:
          "Sistema de Admisión Pericial FALCO®",
        version: VERSION,
        exportadoEn:
          new Date().toISOString(),
        clave,
        datos: resultado.datos
      };

      const contenido =
        JSON.stringify(
          respaldo,
          null,
          2
        );

      return crearResultado({
        ok: true,
        datos: contenido
      });

    } catch (error) {
      return crearResultado({
        ok: false,
        error
      });
    }
  }


  /* =======================================================
     IMPORTAR RESPALDO
  ======================================================= */

  function importar(
    clave,
    contenido
  ) {
    try {
      const respaldo =
        typeof contenido === "string"
          ? JSON.parse(contenido)
          : contenido;

      if (
        !respaldo ||
        typeof respaldo !== "object"
      ) {
        throw new TypeError(
          "El respaldo no contiene información válida."
        );
      }

      const datos =
        Object.prototype.hasOwnProperty.call(
          respaldo,
          "datos"
        )
          ? respaldo.datos
          : respaldo;

      return guardar(
        clave,
        datos
      );

    } catch (error) {
      console.error(
        "FALCO Storage: no se pudo importar el respaldo.",
        error
      );

      return crearResultado({
        ok: false,
        error
      });
    }
  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  global.FalcoStorage = Object.freeze({
    version: VERSION,
    guardar,
    obtener,
    actualizar,
    eliminar,
    existe,
    exportar,
    importar
  });


  console.log(
    `FALCO Storage Engine™ v${VERSION} Ready`
  );

})(window);