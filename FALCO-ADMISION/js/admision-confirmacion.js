/* =========================================================
   FALCO Admisión™
   Confirmation Controller v1.1
   Integración con Firestore
========================================================= */

import {
  guardarAdmision
} from "../firebase/admisiones-firestore.js";


const ConfirmationController = {

  payload: null,
  type: "persona",
  referenceId: null,

  saveStatus: "pending",


  async init() {

    this.readParameters();
    this.readPayload();
    this.render();
    this.bindEvents();

    await this.saveToFirestore();

  },


  /* =======================================================
     PARÁMETROS
  ======================================================= */

  readParameters() {

    const url =
      new URL(
        window.location.href
      );

    this.referenceId =
      url.searchParams.get("id");

    const urlType =
      url.searchParams.get("tipo");

    if (
      urlType === "persona" ||
      urlType === "profesional"
    ) {

      this.type = urlType;

    }

  },


  /* =======================================================
     PAYLOAD LOCAL
  ======================================================= */

  readPayload() {

    try {

      const raw =
        localStorage.getItem(
          "falco_admision_pending"
        );

      if (!raw) {

        console.warn(
          "No se encontró una admisión pendiente en el almacenamiento local."
        );

        return;

      }

      const parsed =
        JSON.parse(raw);

      if (
        this.referenceId &&
        parsed.id &&
        parsed.id !==
          this.referenceId
      ) {

        console.warn(
          "La referencia de la URL no coincide con la admisión almacenada."
        );

        return;

      }

      this.payload = parsed;

      this.referenceId =
        parsed.id ||
        this.referenceId;

      this.type =
        parsed.tipoUsuario ||
        this.type;

    } catch (error) {

      console.warn(
        "No fue posible recuperar la constancia:",
        error
      );

    }

  },


  /* =======================================================
     GUARDADO EN FIRESTORE
  ======================================================= */

  async saveToFirestore() {

  if (!this.payload) {

    this.saveStatus =
      "no_payload";

    this.showSaveWarning(
      "La información local no pudo recuperarse. La constancia puede guardarse, pero la admisión no fue enviada al Estudio."
    );

    return;

  }

  /*
   * Antes de enviar, comprobamos si esta misma admisión
   * ya fue registrada correctamente desde este navegador.
   */

  try {

    const savedRaw =
      localStorage.getItem(
        "falco_admision_last_saved"
      );

    if (savedRaw) {

      const saved =
        JSON.parse(savedRaw);

      if (
        saved.id &&
        saved.id === this.payload.id
      ) {

        this.saveStatus =
          "saved";

        this.updateSaveIndicator(
          "Información registrada correctamente."
        );

        console.log(
          "FALCO Admisión™ ya estaba registrada:",
          saved.id
        );

        return;

      }

    }

  } catch (error) {

    console.warn(
      "No fue posible comprobar el registro anterior:",
      error
    );

  }

  try {

    this.saveStatus =
      "saving";

    this.updateSaveIndicator(
      "Guardando información…"
    );

    const result =
      await guardarAdmision(
        this.payload
      );

    /*
     * Guardamos inmediatamente la confirmación local.
     * Así, al recargar la página, no se intenta crear
     * nuevamente el mismo documento.
     */

    localStorage.setItem(
      "falco_admision_last_saved",
      JSON.stringify({
        id: result.id,
        tipoUsuario: this.type,
        estado: "guardada",
        guardadoEn:
          new Date().toISOString()
      })
    );

    this.saveStatus =
      "saved";

    this.updateSaveIndicator(
      "Información registrada correctamente."
    );

    console.log(
      "FALCO Admisión™ guardada:",
      result
    );

  } catch (error) {

    this.saveStatus =
      "error";

    console.error(
      "No fue posible guardar la admisión en Firestore:",
      error
    );

    /*
     * Si Firestore informa falta de permisos y existe
     * una referencia previa, probablemente el documento
     * ya fue creado y se está intentando repetir el envío.
     */

    if (
      error?.code ===
      "permission-denied"
    ) {

      this.updateSaveIndicator(
        "Esta admisión ya fue registrada anteriormente."
      );

      this.showSaveWarning(
        "La referencia ya existe en el sistema. No se generó una admisión duplicada."
      );

      return;

    }

    this.updateSaveIndicator(
      "No fue posible enviar la información. Se conserva una copia en este dispositivo."
    );

    this.showSaveWarning(
      "La información quedó guardada temporalmente en este dispositivo. No cierre ni borre los datos del navegador hasta verificar el envío."
    );

  }

},

  /* =======================================================
     RENDER
  ======================================================= */

  render() {

    const title =
      document.getElementById(
        "confirmationTitle"
      );

    const message =
      document.getElementById(
        "confirmationMessage"
      );

    const reviewText =
      document.getElementById(
        "confirmationReviewText"
      );

    const reference =
      document.getElementById(
        "confirmationReference"
      );

    const referenceId =
      document.getElementById(
        "confirmationId"
      );

    if (
      this.type ===
      "profesional"
    ) {

      this.setText(
        title,
        "Consulta profesional completada"
      );

      this.setText(
        message,
        "La información profesional quedó preparada correctamente."
      );

      this.setText(
        reviewText,
        "El Estudio revisará el objetivo, el material disponible y los plazos antes de confirmar la modalidad de asistencia."
      );

    } else {

      this.setText(
        title,
        "Admisión completada"
      );

      this.setText(
        message,
        "La información inicial quedó preparada correctamente."
      );

      this.setText(
        reviewText,
        "El Estudio revisará la consulta antes de confirmar si corresponde coordinar una entrevista inicial."
      );

    }

    if (
      this.referenceId &&
      reference &&
      referenceId
    ) {

      reference.hidden =
        false;

      this.setText(
        referenceId,
        this.referenceId
      );

    }

    this.createSaveIndicator();

  },


  /* =======================================================
     INDICADOR DE GUARDADO
  ======================================================= */

  createSaveIndicator() {

    if (
      document.getElementById(
        "confirmationSaveStatus"
      )
    ) {

      return;

    }

    const reference =
      document.getElementById(
        "confirmationReference"
      );

    const card =
      document.querySelector(
        ".admision-confirmation__card"
      );

    if (!card) return;

    const indicator =
      document.createElement(
        "div"
      );

    indicator.id =
      "confirmationSaveStatus";

    indicator.className =
      "admision-confirmation__save-status";

    indicator.setAttribute(
      "role",
      "status"
    );

    indicator.setAttribute(
      "aria-live",
      "polite"
    );

    indicator.textContent =
      "Preparando el registro…";

    if (reference) {

      reference.insertAdjacentElement(
        "afterend",
        indicator
      );

    } else {

      card.appendChild(
        indicator
      );

    }

  },


  updateSaveIndicator(
    message
  ) {

    const indicator =
      document.getElementById(
        "confirmationSaveStatus"
      );

    if (indicator) {

      indicator.textContent =
        message;

      indicator.dataset.status =
        this.saveStatus;

    }

  },


  showSaveWarning(
    message
  ) {

    const card =
      document.querySelector(
        ".admision-confirmation__card"
      );

    if (!card) return;

    let warning =
      document.getElementById(
        "confirmationSaveWarning"
      );

    if (!warning) {

      warning =
        document.createElement(
          "div"
        );

      warning.id =
        "confirmationSaveWarning";

      warning.className =
        "admision-notice admision-notice--important";

      warning.innerHTML = `
        <span
          class="admision-notice__icon"
          aria-hidden="true"
        >
          !
        </span>

        <div>
          <strong>
            Atención
          </strong>

          <p></p>
        </div>
      `;

      const actions =
        card.querySelector(
          ".admision-confirmation__actions"
        );

      if (actions) {

        actions.insertAdjacentElement(
          "beforebegin",
          warning
        );

      } else {

        card.appendChild(
          warning
        );

      }

    }

    const paragraph =
      warning.querySelector("p");

    if (paragraph) {

      paragraph.textContent =
        message;

    }

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  bindEvents() {

    document
      .getElementById(
        "downloadAdmissionButton"
      )
      ?.addEventListener(
        "click",
        () =>
          this.downloadReceipt()
      );

  },


  /* =======================================================
     DESCARGA DE CONSTANCIA
  ======================================================= */

  downloadReceipt() {

    const receipt =
      this.buildReceipt();

    const blob =
      new Blob(
        [receipt],
        {
          type:
            "text/plain;charset=utf-8"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `constancia-${
        this.referenceId ||
        "admision-falco"
      }.txt`;

    document.body.appendChild(
      link
    );

    link.click();
    link.remove();

    URL.revokeObjectURL(
      url
    );

  },


  buildReceipt() {

    const createdAt =
      this.payload?.creadoEn
        ? new Date(
            this.payload.creadoEn
          )
        : new Date();

    const date =
      new Intl.DateTimeFormat(
        "es-AR",
        {
          dateStyle:
            "long",

          timeStyle:
            "short"
        }
      ).format(createdAt);

    const typeLabel =
      this.type ===
      "profesional"
        ? "Consulta profesional"
        : "Admisión para personas";

    const saveLabel =
      this.saveStatus ===
      "saved"
        ? "Registrada correctamente"
        : "Pendiente de verificación";

    return [
      "ESTUDIO PERICIAL PSICOLÓGICO FALCO",
      "FALCO Admisión™",
      "",
      `Tipo: ${typeLabel}`,
      `Referencia: ${
        this.referenceId ||
        "No disponible"
      }`,
      `Fecha: ${date}`,
      `Estado del envío: ${saveLabel}`,
      "",
      "La información inicial fue completada correctamente.",
      "",
      "Esta constancia no implica aceptación automática del caso, confirmación de entrevista ni contratación de servicios.",
      "",
      "La modalidad, disponibilidad, plazos y honorarios serán informados luego de revisar el alcance de la consulta."
    ].join("\n");

  },


  setText(
    element,
    value
  ) {

    if (element) {

      element.textContent =
        value ?? "";

    }

  }

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      ConfirmationController
        .init()
        .catch(
          (error) => {

            console.error(
              "Error al iniciar la confirmación:",
              error
            );

          }
        );

    },
    {
      once: true
    }
  );

} else {

  ConfirmationController
    .init()
    .catch(
      (error) => {

        console.error(
          "Error al iniciar la confirmación:",
          error
        );

      }
    );

}


window.FalcoAdmisionConfirmation =
  ConfirmationController;