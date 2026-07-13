/* =========================================================
   FALCO®
   MÓDULO HISTORIA LABORAL
========================================================= */

function inicializarHistoriaLaboral() {
  const contenedor =
    document.getElementById(
      "contenedorTrabajos"
    );

  const botonAgregar =
    document.getElementById(
      "agregarTrabajo"
    );

  const template =
    document.getElementById(
      "templateTrabajo"
    );

  if (
    !contenedor ||
    !botonAgregar ||
    !template
  ) {
    console.warn(
      "Historia laboral: faltan elementos HTML."
    );

    return;
  }


  function guardarModulo() {
    if (
      typeof guardarDatosDelModulo ===
      "function"
    ) {
      guardarDatosDelModulo(
        "historia-laboral",
        false
      );
    }
  }


  function prepararCampos(
    tarjeta,
    indice
  ) {
    const campos =
      tarjeta.querySelectorAll(
        "input, textarea, select"
      );

    const nombres = [
      "empresa",
      "puesto",
      "desde",
      "hasta",
      "tareas",
      "motivoEgreso"
    ];

    campos.forEach(
      (campo, posicion) => {
        const nombre =
          nombres[posicion] ||
          `campo${posicion + 1}`;

        campo.id =
          `trabajo_${indice}_${nombre}`;

        campo.name =
          `trabajos[${indice}][${nombre}]`;
      }
    );
  }


  function renumerarTrabajos() {
    const tarjetas =
      contenedor.querySelectorAll(
        ".persona-card"
      );

    tarjetas.forEach(
      (tarjeta, posicion) => {
        const indice =
          posicion + 1;

        const titulo =
          tarjeta.querySelector("h3");

        if (titulo) {
          titulo.textContent =
            `Trabajo ${indice}`;
        }

        prepararCampos(
          tarjeta,
          indice
        );
      }
    );
  }


  function vincularGuardado(
    tarjeta
  ) {
    tarjeta
      .querySelectorAll(
        "input, textarea, select"
      )
      .forEach(campo => {
        const evento =
          campo.tagName === "SELECT"
            ? "change"
            : "input";

        campo.addEventListener(
          evento,
          guardarModulo
        );
      });
  }


  function agregarTrabajo() {
    const fragmento =
      template.content.cloneNode(true);

    const tarjeta =
      fragmento.querySelector(
        ".persona-card"
      );

    const indice =
      contenedor.children.length + 1;

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

          renumerarTrabajos();
          guardarModulo();
        }
      );

    contenedor.appendChild(
      fragmento
    );

    const tarjetaCreada =
      contenedor.lastElementChild;

    vincularGuardado(
      tarjetaCreada
    );

    renumerarTrabajos();
  }


  botonAgregar.addEventListener(
    "click",
    () => {
      agregarTrabajo();
      guardarModulo();
    }
  );


  if (
    contenedor.children.length === 0
  ) {
    agregarTrabajo();
  }

  console.log(
    "FALCO® Historia Laboral Ready"
  );
}