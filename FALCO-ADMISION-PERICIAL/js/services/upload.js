/* =========================================================
   FALCO® UPLOAD ENGINE
   Gestión reutilizable de archivos
========================================================= */

(function iniciarFalcoUpload(global) {
  "use strict";

  const VERSION = "1.0.0";

  const CONFIGURACION = {
    tamañoMaximoMb: 10,

    tiposPermitidos: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp"
    ]
  };


  /* =======================================================
     UTILIDADES
  ======================================================= */

  function convertirBytes(bytes) {
    if (!Number.isFinite(bytes)) {
      return "0 KB";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }


  function obtenerTamañoMaximoBytes(
    input
  ) {
    const maximoMb =
      Number(
        input.dataset.maxMb
      ) ||
      CONFIGURACION.tamañoMaximoMb;

    return maximoMb * 1024 * 1024;
  }


  function obtenerTiposPermitidos(
    input
  ) {
    const tiposPersonalizados =
      input.dataset.tipos;

    if (!tiposPersonalizados) {
      return CONFIGURACION.tiposPermitidos;
    }

    return tiposPersonalizados
      .split(",")
      .map(tipo => tipo.trim())
      .filter(Boolean);
  }


  function crearIdentificador() {
    return `archivo_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;
  }


  function obtenerContenedor(input) {
    return (
      input.closest(".campo") ||
      input.parentElement
    );
  }


  function obtenerListaArchivos(input) {
    const contenedor =
      obtenerContenedor(input);

    if (!contenedor) return null;

    let lista =
      contenedor.querySelector(
        ".upload-lista"
      );

    if (!lista) {
      lista =
        document.createElement("div");

      lista.className =
        "upload-lista";

      input.insertAdjacentElement(
        "afterend",
        lista
      );
    }

    return lista;
  }


  function obtenerMensaje(input) {
    const contenedor =
      obtenerContenedor(input);

    if (!contenedor) return null;

    let mensaje =
      contenedor.querySelector(
        ".upload-mensaje"
      );

    if (!mensaje) {
      mensaje =
        document.createElement("div");

      mensaje.className =
        "upload-mensaje";

      input.insertAdjacentElement(
        "afterend",
        mensaje
      );
    }

    return mensaje;
  }


  function mostrarMensaje(
    input,
    texto,
    tipo = "info"
  ) {
    const mensaje =
      obtenerMensaje(input);

    if (!mensaje) return;

    mensaje.textContent = texto;

    mensaje.className =
      `upload-mensaje upload-mensaje--${tipo}`;
  }


  function limpiarMensaje(input) {
    const contenedor =
      obtenerContenedor(input);

    contenedor
      ?.querySelector(
        ".upload-mensaje"
      )
      ?.remove();
  }


  /* =======================================================
     VALIDACIÓN DE ARCHIVOS
  ======================================================= */

  function validarArchivo(
    archivo,
    input
  ) {
    const tamañoMaximo =
      obtenerTamañoMaximoBytes(input);

    const tiposPermitidos =
      obtenerTiposPermitidos(input);

    if (
      archivo.size >
      tamañoMaximo
    ) {
      return {
        valido: false,
        error:
          `El archivo "${archivo.name}" supera el tamaño máximo permitido de ${convertirBytes(
            tamañoMaximo
          )}.`
      };
    }

    if (
      tiposPermitidos.length > 0 &&
      !tiposPermitidos.includes(
        archivo.type
      )
    ) {
      return {
        valido: false,
        error:
          `El formato del archivo "${archivo.name}" no está permitido.`
      };
    }

    return {
      valido: true,
      error: null
    };
  }


  function validarArchivos(
    input
  ) {
    const archivos =
      Array.from(
        input.files || []
      );

    const validos = [];
    const errores = [];

    archivos.forEach(archivo => {
      const resultado =
        validarArchivo(
          archivo,
          input
        );

      if (resultado.valido) {
        validos.push(archivo);
      } else {
        errores.push(
          resultado.error
        );
      }
    });

    return {
      valido:
        errores.length === 0,

      archivos: validos,
      errores
    };
  }


  /* =======================================================
     VISTA PREVIA
  ======================================================= */

  function crearVistaArchivo(
    archivo
  ) {
    const item =
      document.createElement("div");

    item.className =
      "upload-item";

    item.dataset.archivoId =
      crearIdentificador();

    const esImagen =
      archivo.type.startsWith(
        "image/"
      );

    let vista = "";

    if (esImagen) {
      const url =
        URL.createObjectURL(
          archivo
        );

      vista = `
        <img
          class="upload-item__imagen"
          src="${url}"
          alt="Vista previa de ${archivo.name}">
      `;
    } else {
      vista = `
        <div class="upload-item__icono">
          PDF
        </div>
      `;
    }

    item.innerHTML = `
      ${vista}

      <div class="upload-item__datos">

        <strong>
          ${archivo.name}
        </strong>

        <span>
          ${convertirBytes(
            archivo.size
          )}
        </span>

      </div>
    `;

    return item;
  }


  function renderizarArchivos(
    input,
    archivos
  ) {
    const lista =
      obtenerListaArchivos(input);

    if (!lista) return;

    lista.innerHTML = "";

    archivos.forEach(archivo => {
      lista.appendChild(
        crearVistaArchivo(
          archivo
        )
      );
    });
  }


  /* =======================================================
     PROCESAR INPUT
  ======================================================= */

  function procesarInput(input) {
    limpiarMensaje(input);

    const resultado =
      validarArchivos(input);

    if (!resultado.valido) {
      input.value = "";

      renderizarArchivos(
        input,
        []
      );

      mostrarMensaje(
        input,
        resultado.errores.join(" "),
        "error"
      );

      input.dispatchEvent(
        new CustomEvent(
          "falco:upload-error",
          {
            bubbles: true,
            detail: resultado
          }
        )
      );

      return resultado;
    }

    renderizarArchivos(
      input,
      resultado.archivos
    );

    if (
      resultado.archivos.length > 0
    ) {
      mostrarMensaje(
        input,
        `${resultado.archivos.length} archivo(s) seleccionado(s).`,
        "exito"
      );
    }

    input.dispatchEvent(
      new CustomEvent(
        "falco:upload-ready",
        {
          bubbles: true,
          detail: resultado
        }
      )
    );

    return resultado;
  }


  /* =======================================================
     VINCULACIÓN
  ======================================================= */

  function vincularInput(input) {
    if (
      !input ||
      input.type !== "file" ||
      input.dataset.uploadVinculado ===
        "true"
    ) {
      return;
    }

    input.dataset.uploadVinculado =
      "true";

    input.addEventListener(
      "change",
      () => {
        procesarInput(input);
      }
    );
  }


  function vincularContenedor(
    contenedor = document
  ) {
    contenedor
      .querySelectorAll(
        'input[type="file"]'
      )
      .forEach(vincularInput);
  }


  /* =======================================================
     OBTENER METADATOS
  ======================================================= */

  function obtenerMetadatos(input) {
    return Array.from(
      input.files || []
    ).map(archivo => ({
      nombre: archivo.name,
      tipo: archivo.type,
      tamaño: archivo.size,
      tamañoFormateado:
        convertirBytes(
          archivo.size
        ),
      ultimaModificacion:
        archivo.lastModified
    }));
  }


  /* =======================================================
     LIMPIAR INPUT
  ======================================================= */

  function limpiarInput(input) {
    if (!input) return;

    input.value = "";

    obtenerListaArchivos(
      input
    )?.replaceChildren();

    limpiarMensaje(input);
  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  global.FalcoUpload =
    Object.freeze({
      version: VERSION,

      vincularInput,
      vincularContenedor,

      procesarInput,
      validarArchivo,
      validarArchivos,

      obtenerMetadatos,
      limpiarInput,

      convertirBytes
    });


  console.log(
    `FALCO Upload Engine™ v${VERSION} Ready`
  );

})(window);