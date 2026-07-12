/* =========================================================
   FALCO®
   MÓDULO GRUPO FAMILIAR
========================================================= */

function inicializarGrupoFamiliar() {
  inicializarFamiliaresDinamicos({
    idRespuesta: "tieneHermanos",
    idCantidad: "cantidadHermanos",
    idContenedor: "contenedorHermanos",
    idBoton: "agregarHermano",
    tipo: "Hermano",
    prefijo: "hermanos"
  });

  inicializarFamiliaresDinamicos({
    idRespuesta: "tieneHijos",
    idCantidad: "cantidadHijos",
    idContenedor: "contenedorHijos",
    idBoton: "agregarHijo",
    tipo: "Hijo",
    prefijo: "hijos"
  });

  console.log(
    "FALCO® Grupo Familiar inicializado"
  );
}


/* =========================================================
   MOTOR DE FAMILIARES DINÁMICOS
========================================================= */

function inicializarFamiliaresDinamicos({
  idRespuesta,
  idCantidad,
  idContenedor,
  idBoton,
  tipo,
  prefijo
}) {
  const respuesta =
    document.getElementById(idRespuesta);

  const cantidad =
    document.getElementById(idCantidad);

  const contenedor =
    document.getElementById(idContenedor);

  const botonAgregar =
    document.getElementById(idBoton);

  if (
    !respuesta ||
    !cantidad ||
    !contenedor ||
    !botonAgregar
  ) {
    console.warn(
      `No se pudo iniciar el bloque ${tipo}.`,
      {
        respuesta,
        cantidad,
        contenedor,
        botonAgregar
      }
    );

    return;
  }


  /* =======================================================
     DATOS GUARDADOS DEL MÓDULO
  ======================================================= */

  function obtenerDatosGuardados() {
    if (
      !window.FalcoAdmision ||
      typeof window.FalcoAdmision
        .obtenerDatos !== "function"
    ) {
      return {};
    }

    const datosCompletos =
      window.FalcoAdmision.obtenerDatos();

    return (
      datosCompletos["grupo-familiar"] ||
      {}
    );
  }


  /* =======================================================
     GENERACIÓN DE NOMBRES
  ======================================================= */

  function obtenerNombreCampo(
    indice,
    nombre
  ) {
    return `${prefijo}[${indice}][${nombre}]`;
  }


  function obtenerIdCampo(
    indice,
    nombre
  ) {
    return `${prefijo}_${indice}_${nombre}`;
  }


  /* =======================================================
     PREPARAR CAMPOS DE LA TARJETA
  ======================================================= */

  function prepararCampos(
    tarjeta,
    indice
  ) {
    const campos =
      tarjeta.querySelectorAll(
        "input, select, textarea"
      );

    campos.forEach(campo => {
      const nombre =
        campo.dataset.campo;

      if (!nombre) return;

      campo.id =
        obtenerIdCampo(
          indice,
          nombre
        );

      campo.name =
        obtenerNombreCampo(
          indice,
          nombre
        );
    });
  }


  /* =======================================================
     RESTAURAR DATOS DE UNA TARJETA
  ======================================================= */

  function restaurarTarjeta(
    tarjeta,
    indice
  ) {
    const datosGuardados =
      obtenerDatosGuardados();

    const campos =
      tarjeta.querySelectorAll(
        "input, select, textarea"
      );

    campos.forEach(campo => {
      const clave =
        campo.id || campo.name;

      if (!clave) return;

      if (
        !Object.prototype.hasOwnProperty.call(
          datosGuardados,
          clave
        )
      ) {
        return;
      }

      const valor =
        datosGuardados[clave];

      if (
        campo.type === "checkbox" ||
        campo.type === "radio"
      ) {
        campo.checked =
          Boolean(valor);

        return;
      }

      campo.value =
        valor ?? "";
    });
  }


  /* =======================================================
     RENUMERAR TARJETAS
  ======================================================= */

  function renumerarTarjetas() {
    const tarjetas =
      contenedor.querySelectorAll(
        ".persona-card"
      );

    tarjetas.forEach(
      (tarjeta, posicion) => {
        const indice =
          posicion + 1;

        const titulo =
          tarjeta.querySelector(
            ".persona-card__titulo"
          );

        if (titulo) {
          titulo.textContent =
            `${tipo} ${indice}`;
        }

        tarjeta.dataset.indice =
          String(indice);

        prepararCampos(
          tarjeta,
          indice
        );
      }
    );

    cantidad.value =
      String(tarjetas.length);
  }


  /* =======================================================
     GUARDAR MÓDULO
  ======================================================= */

  function guardarGrupoFamiliar() {
    if (
      typeof guardarDatosDelModulo ===
      "function"
    ) {
      guardarDatosDelModulo(
        "grupo-familiar",
        false
      );
    }
  }


  /* =======================================================
     VINCULAR GUARDADO A UNA TARJETA
  ======================================================= */

  function vincularGuardadoTarjeta(
    tarjeta
  ) {
    const campos =
      tarjeta.querySelectorAll(
        "input, select, textarea"
      );

    campos.forEach(campo => {
      const evento =
        campo.tagName === "SELECT" ||
        campo.type === "checkbox" ||
        campo.type === "radio"
          ? "change"
          : "input";

      campo.addEventListener(
        evento,
        guardarGrupoFamiliar
      );
    });
  }


  /* =======================================================
     CREAR TARJETA
  ======================================================= */

  function crearTarjeta({
    restaurar = false
  } = {}) {
    const indice =
      contenedor.children.length + 1;

    const tarjeta =
      document.createElement("div");

    tarjeta.className =
      "persona-card";

    tarjeta.dataset.indice =
      String(indice);

    tarjeta.innerHTML = `
      <h3 class="persona-card__titulo">
        ${tipo} ${indice}
      </h3>

      <div class="form-grid">

        <div class="campo full">
          <label>
            Nombre y apellido *
          </label>

          <input
            type="text"
            data-campo="nombre"
            required>
        </div>


        <div class="campo">
          <label>
            Edad *
          </label>

          <input
            type="number"
            min="0"
            max="120"
            data-campo="edad"
            required>
        </div>


        <div class="campo">
          <label>
            Ocupación *
          </label>

          <input
            type="text"
            data-campo="ocupacion"
            required>
        </div>


        <div class="campo">
          <label>
            ¿Vive actualmente? *
          </label>

          <select
            data-campo="vive"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No sabe">
              No sabe
            </option>

          </select>
        </div>


        <div class="campo">
          <label>
            ¿Convive con usted? *
          </label>

          <select
            data-campo="convive"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No corresponde">
              No corresponde
            </option>

          </select>
        </div>


        <div class="campo">
          <label>
            ¿Lo ve o mantiene contacto? *
          </label>

          <select
            data-campo="mantieneContacto"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Sí">
              Sí
            </option>

            <option value="No">
              No
            </option>

            <option value="No corresponde">
              No corresponde
            </option>

          </select>
        </div>


        <div class="campo">
          <label>
            Frecuencia de contacto *
          </label>

          <select
            data-campo="frecuenciaContacto"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Diaria">
              Diaria
            </option>

            <option value="Varias veces por semana">
              Varias veces por semana
            </option>

            <option value="Semanal">
              Semanal
            </option>

            <option value="Quincenal">
              Quincenal
            </option>

            <option value="Mensual">
              Mensual
            </option>

            <option value="Esporádica">
              Esporádica
            </option>

            <option value="No mantiene contacto">
              No mantiene contacto
            </option>

            <option value="No corresponde">
              No corresponde
            </option>

          </select>
        </div>


        <div class="campo">
          <label>
            ¿Cómo es la relación? *
          </label>

          <select
            data-campo="calidadRelacion"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Muy buena">
              Muy buena
            </option>

            <option value="Buena">
              Buena
            </option>

            <option value="Regular">
              Regular
            </option>

            <option value="Mala">
              Mala
            </option>

            <option value="Muy mala">
              Muy mala
            </option>

            <option value="Conflictiva">
              Conflictiva
            </option>

            <option value="Sin relación">
              Sin relación
            </option>

            <option value="No corresponde">
              No corresponde
            </option>

          </select>
        </div>


        <div class="campo">
          <label>
            ¿Se brindan ayuda o apoyo? *
          </label>

          <select
            data-campo="apoyo"
            required>

            <option value="">
              Seleccione...
            </option>

            <option value="Sí, mutuamente">
              Sí, mutuamente
            </option>

            <option value="Recibo ayuda">
              Recibo ayuda
            </option>

            <option value="Le brindo ayuda">
              Le brindo ayuda
            </option>

            <option value="No">
              No
            </option>

            <option value="No corresponde">
              No corresponde
            </option>

          </select>
        </div>


        <div class="campo full">
          <label>
            Describa cómo se llevan y cómo es el trato actual *
          </label>

          <textarea
            rows="5"
            data-campo="descripcionRelacion"
            required
            placeholder="Indique si se ven, se hablan, se visitan, se ayudan, existen conflictos o no mantienen relación."></textarea>
        </div>


        <div class="campo full">
          <label>
            Observaciones
          </label>

          <textarea
            rows="4"
            data-campo="observaciones"></textarea>
        </div>


        <div class="campo full">
          <button
            type="button"
            class="btn-eliminar">

            Eliminar ${tipo.toLowerCase()}

          </button>
        </div>

      </div>
    `;

    prepararCampos(
      tarjeta,
      indice
    );

    tarjeta
      .querySelector(".btn-eliminar")
      ?.addEventListener(
        "click",
        () => {
          tarjeta.remove();

          renumerarTarjetas();
          guardarGrupoFamiliar();
        }
      );

    contenedor.appendChild(tarjeta);

    vincularGuardadoTarjeta(
      tarjeta
    );

    if (restaurar) {
      restaurarTarjeta(
        tarjeta,
        indice
      );
    }

    renumerarTarjetas();
  }


  /* =======================================================
     CREAR SEGÚN LA CANTIDAD
  ======================================================= */

  function sincronizarCantidad({
    restaurar = false
  } = {}) {
    if (
      respuesta.value !== "Sí"
    ) {
      return;
    }

    const cantidadSolicitada =
      Math.max(
        0,
        Math.min(
          30,
          Number(cantidad.value) || 0
        )
      );

    while (
      contenedor.children.length <
      cantidadSolicitada
    ) {
      crearTarjeta({
        restaurar
      });
    }

    while (
      contenedor.children.length >
      cantidadSolicitada
    ) {
      contenedor.lastElementChild
        ?.remove();
    }

    renumerarTarjetas();
  }


  /* =======================================================
     ACTIVAR O DESACTIVAR BLOQUE
  ======================================================= */

  function actualizarDisponibilidad({
    restaurar = false
  } = {}) {
    const activo =
      respuesta.value === "Sí";

    cantidad.disabled =
      !activo;

    botonAgregar.disabled =
      !activo;

    if (!activo) {
      cantidad.value =
        respuesta.value === "No"
          ? "0"
          : "";

      contenedor.innerHTML = "";

      return;
    }

    sincronizarCantidad({
      restaurar
    });
  }


  /* =======================================================
     EVENTOS
  ======================================================= */

  respuesta.addEventListener(
    "change",
    () => {
      actualizarDisponibilidad();
      guardarGrupoFamiliar();
    }
  );

  cantidad.addEventListener(
    "input",
    () => {
      sincronizarCantidad();
      guardarGrupoFamiliar();
    }
  );

  cantidad.addEventListener(
    "change",
    () => {
      sincronizarCantidad();
      guardarGrupoFamiliar();
    }
  );

  botonAgregar.addEventListener(
    "click",
    () => {
      crearTarjeta();
      guardarGrupoFamiliar();
    }
  );


  /* =======================================================
     ESTADO INICIAL Y RESTAURACIÓN
  ======================================================= */

  actualizarDisponibilidad({
    restaurar: true
  });
}


console.log(
  "FALCO® módulo grupo-familiar.js Ready"
);