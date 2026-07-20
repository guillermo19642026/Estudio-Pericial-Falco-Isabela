/* =========================================================
   FALCO Admisión™
   Documentos UI Controller v1.0
   Selección, validación y subida a Firebase Storage
========================================================= */

import {
  validarArchivo,
  subirDocumentosAdmision
} from "../firebase/documentos-storage.js";


const DocumentosUI = {

  initialized: false,

  files: [],
  uploadedDocuments: [],

  elements: {
    container: null,
    input: null,
    list: null,
    validation: null,
    status: null
  },


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

init() {

  if (this.initialized) {
    return true;
  }

  this.initialized = true;

  this.observeReview();

  console.log(
    "FALCO Admisión™ Documentos UI v1.1 Ready"
  );

  return true;

},




observeReview() {

  const mountInterface = () => {

    const review =
      document.getElementById(
        "admisionReview"
      ) ||
      document.querySelector(
        ".admision-review"
      );

    if (!review) {
      return false;
    }

    this.createInterface();
    this.cacheElements();
    this.bindEvents();
    this.renderFiles();

    return true;

  };

  if (mountInterface()) {
    return;
  }

  const observer =
    new MutationObserver(() => {

      if (mountInterface()) {

        observer.disconnect();

        console.log(
          "FALCO Admisión™ Documentos UI montada en revisión"
        );

      }

    });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

},



  /* =======================================================
     INTERFAZ
  ======================================================= */

  createInterface() {

    if (
      document.getElementById(
        "admisionDocumentsSection"
      )
    ) {
      return;
    }

    const review =
      document.getElementById(
        "admisionReview"
      ) ||
      document.querySelector(
        ".admision-review"
      );

    if (!review) {
      return;
    }

    const reviewContent =
      document.getElementById(
        "admisionReviewContent"
      ) ||
      review.querySelector(
        ".admision-review__content"
      );

    const section =
      document.createElement(
        "section"
      );

    section.id =
      "admisionDocumentsSection";

    section.className =
      "admision-documents";

    section.innerHTML = `
      <div class="admision-documents__header">

        <span class="admision-documents__eyebrow">
          Documentación
        </span>

        <h3>
          Adjuntar documentación
        </h3>

        <p>
          Podés adjuntar documentación relacionada con la consulta.
          Esta etapa es opcional y los archivos serán revisados
          únicamente por el Estudio.
        </p>

      </div>

      <div class="admision-documents__upload">

        <label
          class="admision-documents__dropzone"
          for="admisionDocumentsInput"
        >

          <span
            class="admision-documents__icon"
            aria-hidden="true"
          >
            +
          </span>

          <span class="admision-documents__dropzone-content">

            <strong>
              Seleccionar documentos
            </strong>

            <span>
              PDF, Word o imágenes. Máximo 10 MB por archivo.
            </span>

          </span>

          <input
            id="admisionDocumentsInput"
            class="admision-documents__input"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
          >

        </label>

        <div
          id="admisionDocumentsValidation"
          class="admision-question__validation"
          role="alert"
          hidden
        >
          <span
            class="admision-question__validation-icon"
            aria-hidden="true"
          >
            !
          </span>

          <p></p>
        </div>

        <div
          id="admisionDocumentsList"
          class="admision-documents__list"
          aria-live="polite"
        ></div>

        <div
          id="admisionDocumentsStatus"
          class="admision-documents__status"
          role="status"
          aria-live="polite"
          hidden
        ></div>

      </div>
    `;

    if (reviewContent) {

      reviewContent.insertAdjacentElement(
        "afterend",
        section
      );

    } else {

      const actions =
        review.querySelector(
          ".admision-review__actions"
        );

      if (actions) {

        actions.insertAdjacentElement(
          "beforebegin",
          section
        );

      } else {

        review.appendChild(
          section
        );

      }

    }

  },


  cacheElements() {

    this.elements.container =
      document.getElementById(
        "admisionDocumentsSection"
      );

    this.elements.input =
      document.getElementById(
        "admisionDocumentsInput"
      );

    this.elements.list =
      document.getElementById(
        "admisionDocumentsList"
      );

    this.elements.validation =
      document.getElementById(
        "admisionDocumentsValidation"
      );

    this.elements.status =
      document.getElementById(
        "admisionDocumentsStatus"
      );

  },


  bindEvents() {

    this.elements.input
      ?.addEventListener(
        "change",
        (event) => {

          const selectedFiles =
            Array.from(
              event.target.files || []
            );

          this.addFiles(
            selectedFiles
          );

          event.target.value = "";

        }
      );

  },

    /* =======================================================
     ARCHIVOS
  ======================================================= */

  addFiles(files) {

    this.hideValidation();

    const errors = [];

    files.forEach((file) => {

      try {

        const validation =
          validarArchivo(file);

        if (
          validation === false
        ) {
          throw new Error(
            `El archivo "${file.name}" no es válido.`
          );
        }

        if (
          validation &&
          typeof validation === "object" &&
          validation.valido === false
        ) {
          throw new Error(
            validation.mensaje ||
            `El archivo "${file.name}" no es válido.`
          );
        }

        const duplicated =
          this.files.some(
            (currentFile) =>
              currentFile.name === file.name &&
              currentFile.size === file.size &&
              currentFile.lastModified === file.lastModified
          );

        if (duplicated) {

          errors.push(
            `"${file.name}" ya fue seleccionado.`
          );

          return;

        }

        this.files.push(file);

      } catch (error) {

        errors.push(
          error?.message ||
          `No fue posible agregar "${file.name}".`
        );

      }

    });

    this.renderFiles();

    if (errors.length) {

      this.showValidation(
        errors.join(" ")
      );

    }

  },


  removeFile(index) {

    if (
      index < 0 ||
      index >= this.files.length
    ) {
      return;
    }

    this.files.splice(
      index,
      1
    );

    this.renderFiles();

  },


  clear() {

    this.files = [];
    this.uploadedDocuments = [];

    if (
      this.elements.input
    ) {
      this.elements.input.value = "";
    }

    this.hideValidation();
    this.hideStatus();

    this.renderFiles();

  },


  renderFiles() {

    const list =
      this.elements.list;

    if (!list) {
      return;
    }

    list.innerHTML = "";

    if (!this.files.length) {

      const empty =
        document.createElement("p");

      empty.className =
        "admision-documents__empty";

      empty.textContent =
        "No se seleccionaron documentos.";

      list.appendChild(empty);

      return;

    }

    this.files.forEach(
      (file, index) => {

        const item =
          document.createElement(
            "article"
          );

        item.className =
          "admision-documents__item";

        const info =
          document.createElement(
            "div"
          );

        info.className =
          "admision-documents__item-info";

        const title =
          document.createElement(
            "strong"
          );

        title.textContent =
          file.name;

        const details =
          document.createElement(
            "span"
          );

        details.textContent =
          `${this.formatBytes(file.size)} · ${file.type || "Tipo no informado"}`;

        info.append(
          title,
          details
        );

        const remove =
          document.createElement(
            "button"
          );

        remove.type =
          "button";

        remove.className =
          "admision-button admision-button--secondary admision-button--compact";

        remove.textContent =
          "Quitar";

        remove.addEventListener(
          "click",
          () =>
            this.removeFile(index)
        );

        item.append(
          info,
          remove
        );

        list.appendChild(item);

      }
    );

  },


  /* =======================================================
     SUBIDA A FIREBASE
  ======================================================= */

  async uploadForAdmission(
    admissionId
  ) {

    if (!admissionId) {

      throw new Error(
        "No existe ID de admisión."
      );

    }

    if (!this.files.length) {

      this.uploadedDocuments = [];

      return [];

    }

    this.setUploadingState(true);

    this.showStatus(
      "Subiendo documentación...",
      "uploading"
    );

    try {

      const result =
        await subirDocumentosAdmision(
          admissionId,
          this.files
        );

      this.uploadedDocuments =
        Array.isArray(result)
          ? result
          : [];

      this.showStatus(
        "Documentación cargada correctamente.",
        "success"
      );

      return this.uploadedDocuments;

    } catch (error) {

      console.error(error);

      this.showStatus(
        "No fue posible cargar la documentación.",
        "error"
      );

      throw error;

    } finally {

      this.setUploadingState(false);

    }

  },

    /* =======================================================
     ESTADOS
  ======================================================= */

  setUploadingState(active) {

    if (this.elements.input) {
      this.elements.input.disabled =
        active;
    }

    this.elements.container
      ?.querySelectorAll("button")
      .forEach((button) => {
        button.disabled = active;
      });

    this.elements.container
      ?.classList.toggle(
        "is-uploading",
        active
      );

  },


  showValidation(message) {

    if (!this.elements.validation) {
      return;
    }

    const paragraph =
      this.elements.validation.querySelector(
        "p"
      );

    if (paragraph) {
      paragraph.textContent =
        message;
    }

    this.elements.validation.hidden =
      false;

  },


  hideValidation() {

    if (this.elements.validation) {
      this.elements.validation.hidden =
        true;
    }

  },


  showStatus(
    message,
    state = "info"
  ) {

    if (!this.elements.status) {
      return;
    }

    this.elements.status.hidden =
      false;

    this.elements.status.dataset.state =
      state;

    this.elements.status.textContent =
      message;

  },


  hideStatus() {

    if (!this.elements.status) {
      return;
    }

    this.elements.status.hidden =
      true;

    this.elements.status.textContent =
      "";

  },


  /* =======================================================
     API
  ======================================================= */

  getSelectedFiles() {

    return [...this.files];

  },


  getUploadedDocuments() {

    return JSON.parse(
      JSON.stringify(
        this.uploadedDocuments
      )
    );

  },


  hasFiles() {

    return this.files.length > 0;

  },


  formatBytes(bytes) {

    if (!bytes) {
      return "0 B";
    }

    const units = [
      "B",
      "KB",
      "MB",
      "GB"
    ];

    const power =
      Math.floor(
        Math.log(bytes) /
        Math.log(1024)
      );

    const value =
      bytes /
      Math.pow(
        1024,
        power
      );

    return `${value.toFixed(
      power === 0 ? 0 : 1
    )} ${units[power]}`;

  }

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

const boot = () => {

  DocumentosUI.init();

};

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    boot,
    {
      once: true
    }
  );

} else {

  boot();

}

window.FalcoAdmisionDocumentos =
  DocumentosUI;

export {
  DocumentosUI
};