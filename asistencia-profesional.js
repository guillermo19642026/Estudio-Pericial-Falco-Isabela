import {
  db
} from "./firebase-config.js";


import {
  collection,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   CLOUDINARY
========================================================= */

const CLOUDINARY_CLOUD_NAME =
  "dxvtuqx6p";

const CLOUDINARY_UPLOAD_PRESET =
  "periciados";

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;


console.log(
  "🔥 Asistencia Profesional FALCO® V2 · Firebase + Cloudinary Ready"
);


/* =========================================================
   ASISTENCIA PROFESIONAL FALCO®
   VERSIÓN 2 · FIRESTORE + CLOUDINARY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /* =====================================================
       REFERENCIAS PRINCIPALES
    ====================================================== */

    const form =
      document.getElementById(
        "asistenciaForm"
      );

    const tipoAsistencia =
      document.getElementById(
        "tipoAsistencia"
      );

    const resultado =
      document.getElementById(
        "asistenciaResultado"
      );

    const submitButton =
      document.getElementById(
        "asistenciaSubmit"
      );

    const gruposDinamicos =
      document.querySelectorAll(
        ".falco-asistencia-dinamico"
      );


    if (
      !form ||
      !tipoAsistencia
    ) {

      console.error(
        "❌ No se encontró el formulario de Asistencia Profesional."
      );

      return;
    }


    /* =====================================================
       MAPA DE TIPOS
    ====================================================== */

    const mapaGrupos = {

      impugnacion:
        "judicial",

      explicaciones:
        "judicial",

      ampliacion:
        "judicial",

      dictamen:
        "dictamen",

      tests:
        "tests",

      revision:
        "dictamen",

      observaciones:
        "judicial",

      otro:
        "otro"

    };


    /* =====================================================
       OCULTAR BLOQUES DINÁMICOS
    ====================================================== */

    function ocultarGruposDinamicos() {

      gruposDinamicos.forEach(
        (grupo) => {

          grupo.hidden =
            true;

        }
      );

    }


    /* =====================================================
       MOSTRAR BLOQUE SEGÚN SERVICIO
    ====================================================== */

    function actualizarCamposDinamicos() {

      ocultarGruposDinamicos();


      const tipo =
        tipoAsistencia.value;


      const grupoObjetivo =
        mapaGrupos[tipo];


      if (
        !grupoObjetivo
      ) {
        return;
      }


      const bloque =
        document.querySelector(
          `[data-asistencia-grupo="${grupoObjetivo}"]`
        );


      if (
        !bloque
      ) {
        return;
      }


      bloque.hidden =
        false;

    }


    tipoAsistencia.addEventListener(
      "change",
      actualizarCamposDinamicos
    );


    actualizarCamposDinamicos();


    /* =====================================================
       VALIDACIÓN VISUAL
    ====================================================== */

    function marcarCampoInvalido(
      campo
    ) {

      campo.classList.add(
        "falco-asistencia-field--invalid"
      );

    }


    function limpiarCampoInvalido(
      campo
    ) {

      campo.classList.remove(
        "falco-asistencia-field--invalid"
      );

    }


    function obtenerContenedorCampo(
      input
    ) {

      return input.closest(
        ".falco-asistencia-field"
      ) ||
      input.closest(
        ".falco-asistencia-check"
      ) ||
      input.closest(
        ".falco-asistencia-radio"
      );

    }


    function limpiarErrores() {

      document
        .querySelectorAll(
          ".falco-asistencia-field--invalid"
        )
        .forEach(
          (campo) => {

            limpiarCampoInvalido(
              campo
            );

          }
        );

    }


    function validarFormulario() {

      limpiarErrores();


      let valido =
        true;


      const requeridos =
        form.querySelectorAll(
          "[required]"
        );


      requeridos.forEach(
        (input) => {

          /*
           * No validar elementos pertenecientes
           * a bloques dinámicos ocultos.
           */

          const bloqueOculto =
            input.closest(
              "[hidden]"
            );


          if (
            bloqueOculto
          ) {
            return;
          }


          let campoValido =
            true;


          if (
            input.type ===
            "checkbox"
          ) {

            campoValido =
              input.checked;

          }

          else if (
            input.type ===
            "radio"
          ) {

            const radios =
              form.querySelectorAll(
                `input[name="${input.name}"]`
              );


            campoValido =
              Array.from(
                radios
              ).some(
                (radio) =>
                  radio.checked
              );

          }

          else {

            campoValido =
              String(
                input.value
              ).trim() !== "";

          }


          if (
            !campoValido
          ) {

            valido =
              false;


            const contenedor =
              obtenerContenedorCampo(
                input
              );


            if (
              contenedor
            ) {

              marcarCampoInvalido(
                contenedor
              );

            }

          }

        }
      );


      return valido;

    }


    /* =====================================================
       LIMPIAR ERROR AL EDITAR
    ====================================================== */

    form.addEventListener(
      "input",
      (event) => {

        const campo =
          obtenerContenedorCampo(
            event.target
          );


        if (
          campo
        ) {

          limpiarCampoInvalido(
            campo
          );

        }

      }
    );


    form.addEventListener(
      "change",
      (event) => {

        const campo =
          obtenerContenedorCampo(
            event.target
          );


        if (
          campo
        ) {

          limpiarCampoInvalido(
            campo
          );

        }

      }
    );

        /* =====================================================
       ARCHIVOS
    ====================================================== */

    const documentosInput =
      document.getElementById(
        "documentos"
      );


    const MAX_ARCHIVOS =
      12;


    const MAX_MB_POR_ARCHIVO =
      15;


    if (
      documentosInput
    ) {

      documentosInput.addEventListener(
        "change",
        () => {

          const archivos =
            Array.from(
              documentosInput.files ||
              []
            );


          if (
            archivos.length >
            MAX_ARCHIVOS
          ) {

            documentosInput.value =
              "";


            mostrarMensaje(
              "error",
              `Puede adjuntar hasta ${MAX_ARCHIVOS} archivos por solicitud.`
            );


            return;

          }


          const demasiadoGrandes =
            archivos.filter(
              (archivo) =>
                archivo.size >
                (
                  MAX_MB_POR_ARCHIVO *
                  1024 *
                  1024
                )
            );


          if (
            demasiadoGrandes.length
          ) {

            documentosInput.value =
              "";


            mostrarMensaje(
              "error",
              `Cada archivo puede tener un tamaño máximo de ${MAX_MB_POR_ARCHIVO} MB.`
            );


            return;

          }


          limpiarMensaje();

        }
      );

    }


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function escaparHTML(
      valor
    ) {

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


    function nombreTipoAsistencia(
      valor
    ) {

      const nombres = {

        impugnacion:
          "Contestación de impugnación",

        explicaciones:
          "Contestación de pedido de explicaciones",

        ampliacion:
          "Ampliación de dictamen",

        dictamen:
          "Confección o revisión de dictamen pericial",

        tests:
          "Análisis e integración de tests",

        revision:
          "Revisión técnico-forense",

        observaciones:
          "Observaciones / análisis de otra pericia",

        otro:
          "Otro requerimiento profesional"

      };


      return nombres[valor] ||
        valor ||
        "Sin especificar";

    }


    function nombreCanal(
      valor
    ) {

      if (
        valor === "whatsapp"
      ) {
        return "WhatsApp";
      }


      if (
        valor === "email"
      ) {
        return "Correo electrónico";
      }


      return "Sin seleccionar";

    }


    function obtenerRadioSeleccionado(
      nombre
    ) {

      return form.querySelector(
        `input[name="${nombre}"]:checked`
      )?.value || "";

    }


    function obtenerArchivos() {

      if (
        !documentosInput
      ) {
        return [];
      }


      return Array.from(
        documentosInput.files ||
        []
      ).map(
        (archivo) => ({

          nombre:
            archivo.name,

          tipo:
            archivo.type,

          tamaño:
            archivo.size

        })
      );

    }


    /* =====================================================
       CONSTRUIR OBJETO DE SOLICITUD
    ====================================================== */

    function construirSolicitud() {

      return {

        tipoAsistencia:
          tipoAsistencia.value,

        tipoAsistenciaNombre:
          nombreTipoAsistencia(
            tipoAsistencia.value
          ),


        solicitante: {

          nombreCompleto:
            document.getElementById(
              "nombreCompleto"
            )?.value.trim() || "",

          profesion:
            document.getElementById(
              "profesion"
            )?.value || "",

          telefono:
            document.getElementById(
              "telefono"
            )?.value.trim() || "",

          email:
            document.getElementById(
              "email"
            )?.value.trim() || "",

          localidad:
            document.getElementById(
              "localidad"
            )?.value.trim() || "",

          matricula:
            document.getElementById(
              "matricula"
            )?.value.trim() || ""

        },


        caso: {

          fuero:
            document.getElementById(
              "fuero"
            )?.value || "",

          jurisdiccion:
            document.getElementById(
              "jurisdiccion"
            )?.value.trim() || "",

          expediente:
            document.getElementById(
              "expediente"
            )?.value.trim() || "",

          vencimiento:
            document.getElementById(
              "vencimiento"
            )?.value || "",

          descripcion:
            document.getElementById(
              "descripcionCaso"
            )?.value.trim() || ""

        },


        judicial: {

          cuestionamientos:
            document.getElementById(
              "cuestionamientos"
            )?.value.trim() || "",

          respuestaPrevia:
            document.getElementById(
              "respuestaPrevia"
            )?.value.trim() || ""

        },


        dictamen: {

          puntosPericia:
            document.getElementById(
              "puntosPericia"
            )?.value.trim() || "",

          entrevistasRealizadas:
            document.getElementById(
              "entrevistasRealizadas"
            )?.value.trim() || "",

          tecnicasAdministradas:
            document.getElementById(
              "tecnicasAdministradas"
            )?.value.trim() || "",

          conclusionesProfesional:
            document.getElementById(
              "conclusionesProfesional"
            )?.value.trim() || ""

        },


        tests: {

          edadEvaluado:
            document.getElementById(
              "edadEvaluado"
            )?.value || "",

          contextoEvaluacion:
            document.getElementById(
              "contextoEvaluacion"
            )?.value || "",

          testsAplicados:
            document.getElementById(
              "testsAplicados"
            )?.value.trim() || "",

          objetivoEvaluacion:
            document.getElementById(
              "objetivoEvaluacion"
            )?.value.trim() || "",

          antecedentesEvaluacion:
            document.getElementById(
              "antecedentesEvaluacion"
            )?.value.trim() || ""

        },


        otro: {

          requerimiento:
            document.getElementById(
              "otroRequerimiento"
            )?.value.trim() || ""

        },


        canalEntrega:
          obtenerRadioSeleccionado(
            "canalEntrega"
          ),


        canalEntregaNombre:
          nombreCanal(
            obtenerRadioSeleccionado(
              "canalEntrega"
            )
          ),


        observaciones:
          document.getElementById(
            "observaciones"
          )?.value.trim() || "",


        declaraciones: {

          autorizacion:
            document.getElementById(
              "declaraAutorizacion"
            )?.checked || false,

          alcance:
            document.getElementById(
              "aceptaAlcance"
            )?.checked || false,

          responsabilidad:
            document.getElementById(
              "aceptaResponsabilidad"
            )?.checked || false

        },


        archivos:
          obtenerArchivos(),


        origen:
          "asistencia-profesional"

      };

    }


    /* =====================================================
       MENSAJES
    ====================================================== */

    function limpiarMensaje() {

      if (
        resultado
      ) {

        resultado.innerHTML =
          "";

        resultado.className =
          "falco-asistencia-resultado";

      }

    }


    function mostrarMensaje(
      tipo,
      mensaje
    ) {

      if (
        !resultado
      ) {
        return;
      }


      resultado.className =
        `falco-asistencia-resultado falco-asistencia-resultado--${tipo}`;


      resultado.innerHTML =
        `<p>${escaparHTML(mensaje)}</p>`;

    }

        /* =====================================================
       GENERAR REFERENCIA DEFINITIVA
    ====================================================== */

    function generarReferenciaDefinitiva(
      idDocumento
    ) {

      const año =
        new Date().getFullYear();


      const codigo =
        String(
          idDocumento
        )
          .replace(
            /[^a-zA-Z0-9]/g,
            ""
          )
          .slice(
            0,
            8
          )
          .toUpperCase();


      return `FALCO-ASP-${año}-${codigo}`;

    }


    /* =====================================================
       SUBIR DOCUMENTACIÓN · CLOUDINARY
    ====================================================== */

    async function subirDocumentacion(
      idSolicitud,
      referencia
    ) {

      console.log(
        "☁️ entrar a subirDocumentacion"
      );


      if (
        !documentosInput
      ) {
        return [];
      }


      const archivos =
        Array.from(
          documentosInput.files ||
          []
        );


      if (
        !archivos.length
      ) {

        console.log(
          "ℹ️ Solicitud sin archivos adjuntos"
        );

        return [];
      }


      const documentosSubidos =
        [];


      for (
        let indice = 0;
        indice < archivos.length;
        indice += 1
      ) {

        const archivo =
          archivos[indice];


        console.log(
          `☁️ Subiendo archivo ${indice + 1}/${archivos.length}:`,
          archivo.name
        );


        const formData =
          new FormData();


        formData.append(
          "file",
          archivo
        );


        formData.append(
          "upload_preset",
          CLOUDINARY_UPLOAD_PRESET
        );


        formData.append(
          "folder",
          `asistencia-profesional/${idSolicitud}`
        );


        formData.append(
          "context",
          `referencia=${referencia}|solicitud=${idSolicitud}`
        );


        const respuesta =
          await fetch(
            CLOUDINARY_UPLOAD_URL,
            {

              method:
                "POST",

              body:
                formData

            }
          );


        if (
          !respuesta.ok
        ) {

          let detalle =
            "";


          try {

            const errorCloudinary =
              await respuesta.json();


            detalle =
              errorCloudinary?.error?.message ||
              "";

          }

          catch (
            error
          ) {

            console.warn(
              "No se pudo leer el detalle de Cloudinary:",
              error
            );

          }


          throw new Error(
            detalle ||
            `Cloudinary rechazó el archivo ${archivo.name}.`
          );

        }


        const datos =
          await respuesta.json();


        console.log(
          "✅ Archivo subido:",
          datos.secure_url
        );


        documentosSubidos.push({

          nombre:
            archivo.name,

          tipo:
            archivo.type || "",

          tamaño:
            archivo.size,

          url:
            datos.secure_url,

          secureUrl:
            datos.secure_url,

          publicId:
            datos.public_id || "",

          resourceType:
            datos.resource_type || "",

          formato:
            datos.format || "",

          bytes:
            datos.bytes ||
            archivo.size,

          cloudinaryAssetId:
            datos.asset_id || "",

          carpeta:
            datos.folder ||
            `asistencia-profesional/${idSolicitud}`

        });

      }


      return documentosSubidos;

    }


    /* =====================================================
       GUARDAR SOLICITUD EN FIRESTORE
    ====================================================== */

    async function guardarSolicitudFirebase(
      solicitud
    ) {

      /*
       * Generamos primero el ID
       * automático de Firestore.
       */

      const documentoRef =
        doc(
          collection(
            db,
            "asistencia_profesional"
          )
        );


      const referencia =
        generarReferenciaDefinitiva(
          documentoRef.id
        );


      console.log(
        "1️⃣ ID generado:",
        documentoRef.id
      );


      console.log(
        "2️⃣ Referencia:",
        referencia
      );


      console.log(
        "3️⃣ Iniciando documentación"
      );


      /*
       * Subimos primero los archivos.
       * Firestore almacenará luego
       * las URLs devueltas por Cloudinary.
       */

      const documentos =
        await subirDocumentacion(
          documentoRef.id,
          referencia
        );


      console.log(
        "4️⃣ Documentación terminada:",
        documentos
      );


      const registro = {

        ...solicitud,


        referencia:
          referencia,


        archivos:
          documentos,


        cantidadArchivos:
          documentos.length,


        estado:
          "nueva",


        prioridad:
          "normal",


        gestion: {

          estado:
            "nueva",

          prioridad:
            "normal",

          presupuesto:
            null,

          presupuestoEstado:
            "pendiente",

          pagoEstado:
            "pendiente",

          observacionesInternas:
            "",

          responsable:
            "",

          fechaInicio:
            null,

          fechaFinalizacion:
            null

        },


        origen:
          "asistencia-profesional",


        version:
          2,


        creadoEn:
          serverTimestamp(),


        actualizadoEn:
          serverTimestamp()

      };


      console.log(
        "5️⃣ Enviando registro a Firestore:",
        registro
      );


      await setDoc(
        documentoRef,
        registro
      );


      console.log(
        "6️⃣ Firestore confirmó el registro"
      );


      return {

        id:
          documentoRef.id,

        referencia:
          referencia,

        documentos:
          documentos,

        registro:
          registro

      };

    }

        /* =====================================================
       ENVIAR FORMULARIO
    ====================================================== */

    form.addEventListener(
      "submit",
      async (event) => {

        console.log(
          "🚀 SUBMIT ASISTENCIA ACTIVADO"
        );


        event.preventDefault();


        limpiarMensaje();


        const valido =
          validarFormulario();


        if (
          !valido
        ) {

          mostrarMensaje(
            "error",
            "Revise los campos obligatorios antes de enviar la solicitud."
          );


          const primerError =
            form.querySelector(
              ".falco-asistencia-field--invalid"
            );


          if (
            primerError
          ) {

            primerError.scrollIntoView({

              behavior:
                "smooth",

              block:
                "center"

            });

          }


          return;

        }


        /* ===============================================
           BLOQUEAR BOTÓN
        =============================================== */

        if (
          submitButton
        ) {

          submitButton.disabled =
            true;


          submitButton.innerHTML =
            `
              Enviando solicitud...
              <span aria-hidden="true">
                →
              </span>
            `;

        }


        if (
          resultado
        ) {

          resultado.className =
            "falco-asistencia-resultado";


          resultado.innerHTML =
            `
              <div class="falco-asistencia-confirmacion">

                <span>
                  Mesa de Entrada FALCO®
                </span>

                <h3>
                  Recibiendo la solicitud...
                </h3>

                <p>
                  Estamos registrando la información
                  y la documentación adjunta.
                </p>

              </div>
            `;

        }


        try {

          const solicitud =
            construirSolicitud();


          const respuesta =
            await guardarSolicitudFirebase(
              solicitud
            );


          console.group(
            "FALCO® · Asistencia Profesional"
          );


          console.log(
            "Solicitud registrada:",
            respuesta
          );


          console.groupEnd();


          /* =============================================
             CONFIRMACIÓN
          ============================================= */

          if (
            resultado
          ) {

            resultado.className =
              "falco-asistencia-resultado falco-asistencia-resultado--ok";

resultado.hidden =
  false;

resultado.style.display =
  "block";

resultado.style.visibility =
  "visible";

resultado.style.opacity =
  "1";



            resultado.innerHTML =
              `
                <div class="falco-asistencia-confirmacion">

                  <span>
                    Solicitud recibida
                  </span>

                  <h3>
                    La solicitud fue registrada correctamente.
                  </h3>

                  <p>
                    El Estudio Pericial Psicológico FALCO®
                    revisará la información y documentación
                    recibida y se comunicará posteriormente
                    con el solicitante.
                  </p>


                  <div class="falco-asistencia-confirmacion__datos">

                    <p>

                      <strong>
                        Referencia
                      </strong>

                      ${escaparHTML(
                        respuesta.referencia
                      )}

                    </p>


                    <p>

                      <strong>
                        Tipo de asistencia
                      </strong>

                      ${escaparHTML(
                        solicitud.tipoAsistenciaNombre
                      )}

                    </p>


                    <p>

                      <strong>
                        Solicitante
                      </strong>

                      ${escaparHTML(
                        solicitud.solicitante.nombreCompleto
                      )}

                    </p>


                    <p>

                      <strong>
                        Canal de entrega
                      </strong>

                      ${escaparHTML(
                        solicitud.canalEntregaNombre
                      )}

                    </p>


                    <p>

                      <strong>
                        Documentación recibida
                      </strong>

                      ${respuesta.documentos.length}
                      archivo${respuesta.documentos.length === 1 ? "" : "s"}

                    </p>


                    <p>

                      <strong>
                        Estado
                      </strong>

                      Recibida · pendiente de revisión

                    </p>

                  </div>


                  <p>
                    Conserve la referencia
                    <strong>
                      ${escaparHTML(
                        respuesta.referencia
                      )}
                    </strong>
                    para cualquier consulta relacionada
                    con esta solicitud.
                  </p>

                </div>
              `;


            resultado.scrollIntoView({

              behavior:
                "smooth",

              block:
                "center"

            });

          }


          /* =============================================
             LIMPIAR FORMULARIO
          ============================================= */

          form.reset();


          ocultarGruposDinamicos();


          if (
            documentosInput
          ) {

            documentosInput.value =
              "";

          }


          if (
            submitButton
          ) {

            submitButton.disabled =
              true;


            submitButton.innerHTML =
              `
                Solicitud enviada
                <span aria-hidden="true">
                  ✓
                </span>
              `;

          }

        }

        catch (
          error
        ) {

          console.error(
            "❌ Error al registrar Asistencia Profesional:",
            error
          );


          if (
            resultado
          ) {

            resultado.className =
              "falco-asistencia-resultado falco-asistencia-resultado--error";


            resultado.innerHTML =
              `
                <div class="falco-asistencia-confirmacion">

                  <span>
                    No se pudo completar el envío
                  </span>

                  <h3>
                    La solicitud no fue registrada.
                  </h3>

                  <p>
                    Verifique la conexión e intente nuevamente.
                    Si el inconveniente continúa,
                    comuníquese directamente con el Estudio.
                  </p>

                </div>
              `;

          }


          if (
            submitButton
          ) {

            submitButton.disabled =
              false;


            submitButton.innerHTML =
              `
                Reintentar envío
                <span aria-hidden="true">
                  →
                </span>
              `;

          }

        }

      }
    );


    /* =====================================================
       REHABILITAR BOTÓN SI SE MODIFICA EL FORMULARIO
    ====================================================== */

    form.addEventListener(
      "input",
      () => {

        if (
          !submitButton
        ) {
          return;
        }


        if (
          submitButton.disabled
        ) {

          submitButton.disabled =
            false;


          submitButton.innerHTML =
            `
              Enviar solicitud al Estudio
              <span aria-hidden="true">
                →
              </span>
            `;

        }

      }
    );


    form.addEventListener(
      "change",
      () => {

        if (
          !submitButton
        ) {
          return;
        }


        if (
          submitButton.disabled
        ) {

          submitButton.disabled =
            false;


          submitButton.innerHTML =
            `
              Enviar solicitud al Estudio
              <span aria-hidden="true">
                →
              </span>
            `;

        }

      }
    );


  }
);