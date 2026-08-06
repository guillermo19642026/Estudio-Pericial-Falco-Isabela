document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gcNewCaseForm");

  const departmentInput = document.getElementById("gcDepartment");
  const fileNumberInput = document.getElementById("gcFileNumber");
  const internalCodeInput = document.getElementById("gcInternalCode");

  const lawyersContainer = document.getElementById(
    "gcLawyersContainer"
  );

  const codefendantsContainer = document.getElementById(
    "gcCodefendantsContainer"
  );

  const codefendantsEmpty = document.getElementById(
    "gcCodefendantsEmpty"
  );

  const addLawyerButton = document.getElementById(
    "gcAddLawyerButton"
  );

  const addCodefendantButton = document.getElementById(
    "gcAddCodefendantButton"
  );

  const saveDraftButton = document.getElementById(
    "gcSaveDraftButton"
  );

  const toast = document.getElementById("gcToast");

  const STORAGE_KEY = "falco_gestion_causas";
  const DRAFT_KEY = "falco_gestion_causas_borrador";

  let lawyerCounter = 0;
  let codefendantCounter = 0;

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const showToast = (message, type = "success") => {
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.className = `gc-toast is-visible gc-toast--${type}`;

    window.clearTimeout(showToast.timeout);

    showToast.timeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  const generateId = () => {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }

    return `causa-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  };

  const getStoredCases = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("No se pudieron leer las causas:", error);
      return [];
    }
  };

  const getDepartmentData = () => {
    const department = departmentInput?.value || "";

    const map = {
      moron: {
        nombre: "Morón",
        codigo: "MO"
      },
      "la-matanza": {
        nombre: "La Matanza",
        codigo: "LM"
      },
      otro: {
        nombre: "Otro",
        codigo: "OT"
      }
    };

    return map[department] || {
      nombre: "",
      codigo: "XX"
    };
  };

  const getYearFromFileNumber = () => {
    const value = fileNumberInput?.value || "";
    const match = value.match(/(?:19|20)\d{2}/);

    return match
      ? match[0]
      : String(new Date().getFullYear());
  };

  const generateInternalCode = () => {
    if (!internalCodeInput) {
      return;
    }

    const department = getDepartmentData();
    const year = getYearFromFileNumber();
   const existingCases =
  window.GestionCausasData?.getCases?.() || [];

    const sameDepartmentAndYear = existingCases.filter(
      (causa) =>
        causa.departamento === departmentInput?.value &&
        String(causa.anio || "") === year
    );

    const sequence = String(
      sameDepartmentAndYear.length + 1
    ).padStart(3, "0");

    internalCodeInput.value =
      `FALCO-${department.codigo}-${year}-${sequence}`;
  };

  const updateCodefendantsEmptyState = () => {
    if (!codefendantsEmpty || !codefendantsContainer) {
      return;
    }

    codefendantsEmpty.hidden =
      codefendantsContainer.children.length > 0;
  };

  const createLawyerCard = (data = {}) => {
    lawyerCounter += 1;

    const card = document.createElement("article");

    card.className = "gc-dynamic-card";
    card.dataset.lawyerId =
      data.id || `abogado-${lawyerCounter}`;

    card.innerHTML = `
      <div class="gc-dynamic-card__header">

        <div>
          <span class="gc-panel__eyebrow">
            Representación letrada
          </span>

          <h4>
            Abogado/a interviniente
          </h4>
        </div>

        <button
          type="button"
          class="gc-dynamic-card__remove"
          data-action="remove-lawyer"
          aria-label="Eliminar abogado"
        >
          Eliminar
        </button>

      </div>

      <div class="gc-form-grid">

        <div class="gc-field">
          <label>
            Parte que representa *
          </label>

          <select
            data-field="parte"
            required
          >
            <option value="">Seleccionar</option>

            <option
              value="actora"
              ${data.parte === "actora" ? "selected" : ""}
            >
              Parte actora
            </option>

            <option
              value="demandada"
              ${data.parte === "demandada" ? "selected" : ""}
            >
              Parte demandada
            </option>

            <option
              value="codemandada"
              ${data.parte === "codemandada" ? "selected" : ""}
            >
              Codemandada
            </option>

            <option
              value="tercero"
              ${data.parte === "tercero" ? "selected" : ""}
            >
              Tercero citado
            </option>
          </select>
        </div>

        <div class="gc-field gc-field--wide">
          <label>
            Nombre completo *
          </label>

          <input
            type="text"
            data-field="nombreCompleto"
            value="${escapeHtml(data.nombreCompleto || "")}"
            placeholder="Dr./Dra. Nombre y apellido"
            required
          >
        </div>

        <div class="gc-field">
          <label>
            Matrícula
          </label>

          <input
            type="text"
            data-field="matricula"
            value="${escapeHtml(data.matricula || "")}"
            placeholder="Tomo, folio o matrícula"
          >
        </div>

        <div class="gc-field">
          <label>
            Colegio profesional
          </label>

          <input
            type="text"
            data-field="colegio"
            value="${escapeHtml(data.colegio || "")}"
            placeholder="CAM, CALM u otro"
          >
        </div>

        <div class="gc-field">
          <label>
            Teléfono
          </label>

          <input
            type="tel"
            data-field="telefono"
            value="${escapeHtml(data.telefono || "")}"
            placeholder="Teléfono de contacto"
          >
        </div>

        <div class="gc-field">
          <label>
            WhatsApp
          </label>

          <input
            type="tel"
            data-field="whatsapp"
            value="${escapeHtml(data.whatsapp || "")}"
            placeholder="Número de WhatsApp"
          >
        </div>

        <div class="gc-field">
          <label>
            Correo electrónico
          </label>

          <input
            type="email"
            data-field="email"
            value="${escapeHtml(data.email || "")}"
            placeholder="correo@ejemplo.com"
          >
        </div>

        <div class="gc-field">
          <label>
            Domicilio electrónico
          </label>

          <input
            type="text"
            data-field="domicilioElectronico"
            value="${escapeHtml(
              data.domicilioElectronico || ""
            )}"
            placeholder="CUIT@notificaciones..."
          >
        </div>

        <div class="gc-field gc-field--wide">
          <label>
            Estudio jurídico
          </label>

          <input
            type="text"
            data-field="estudioJuridico"
            value="${escapeHtml(data.estudioJuridico || "")}"
            placeholder="Nombre del estudio"
          >
        </div>

        <div class="gc-field gc-field--wide">
          <label>
            Compañía o parte representada
          </label>

          <input
            type="text"
            data-field="companiaRepresentada"
            value="${escapeHtml(
              data.companiaRepresentada || ""
            )}"
            placeholder="Ej.: aseguradora, ART o codemandada"
          >
        </div>

        <div class="gc-field gc-field--full">
          <label>
            Observaciones
          </label>

          <textarea
            data-field="observaciones"
            rows="3"
            placeholder="Información adicional del profesional"
          >${escapeHtml(data.observaciones || "")}</textarea>
        </div>

      </div>
    `;

    lawyersContainer?.appendChild(card);

    return card;
  };

  const createCodefendantCard = (data = {}) => {
    codefendantCounter += 1;

    const card = document.createElement("article");

    card.className = "gc-dynamic-card";
    card.dataset.codefendantId =
      data.id || `codemandada-${codefendantCounter}`;

    card.innerHTML = `
      <div class="gc-dynamic-card__header">

        <div>
          <span class="gc-panel__eyebrow">
            Parte demandada adicional
          </span>

          <h4>
            Codemandada
          </h4>
        </div>

        <button
          type="button"
          class="gc-dynamic-card__remove"
          data-action="remove-codefendant"
          aria-label="Eliminar codemandada"
        >
          Eliminar
        </button>

      </div>

      <div class="gc-form-grid">

        <div class="gc-field gc-field--wide">
          <label>
            Nombre o razón social *
          </label>

          <input
            type="text"
            data-field="nombre"
            value="${escapeHtml(data.nombre || "")}"
            required
          >
        </div>

        <div class="gc-field">
          <label>
            Tipo
          </label>

          <select data-field="tipo">
            <option
              value="empresa"
              ${data.tipo === "empresa" ? "selected" : ""}
            >
              Empresa
            </option>

            <option
              value="aseguradora"
              ${data.tipo === "aseguradora" ? "selected" : ""}
            >
              Aseguradora
            </option>

            <option
              value="art"
              ${data.tipo === "art" ? "selected" : ""}
            >
              ART
            </option>

            <option
              value="empleador"
              ${data.tipo === "empleador" ? "selected" : ""}
            >
              Empleador
            </option>

            <option
              value="persona"
              ${data.tipo === "persona" ? "selected" : ""}
            >
              Persona
            </option>

            <option
              value="otro"
              ${data.tipo === "otro" ? "selected" : ""}
            >
              Otro
            </option>
          </select>
        </div>

        <div class="gc-field">
          <label>
            CUIT / DNI
          </label>

          <input
            type="text"
            data-field="documento"
            value="${escapeHtml(data.documento || "")}"
          >
        </div>

        <div class="gc-field">
          <label>
            Teléfono
          </label>

          <input
            type="tel"
            data-field="telefono"
            value="${escapeHtml(data.telefono || "")}"
          >
        </div>

        <div class="gc-field">
          <label>
            Correo electrónico
          </label>

          <input
            type="email"
            data-field="email"
            value="${escapeHtml(data.email || "")}"
          >
        </div>

        <div class="gc-field gc-field--full">
          <label>
            Domicilio
          </label>

          <input
            type="text"
            data-field="domicilio"
            value="${escapeHtml(data.domicilio || "")}"
          >
        </div>

        <div class="gc-field gc-field--wide">
          <label>
            Compañía o entidad
          </label>

          <input
            type="text"
            data-field="compania"
            value="${escapeHtml(data.compania || "")}"
            placeholder="Nombre comercial o entidad vinculada"
          >
        </div>

        <div class="gc-field gc-field--wide">
          <label>
            Abogado representante
          </label>

          <input
            type="text"
            data-field="abogadoNombre"
            value="${escapeHtml(data.abogadoNombre || "")}"
          >
        </div>

        <div class="gc-field">
          <label>
            Teléfono del abogado
          </label>

          <input
            type="tel"
            data-field="abogadoTelefono"
            value="${escapeHtml(data.abogadoTelefono || "")}"
          >
        </div>

        <div class="gc-field">
          <label>
            Correo del abogado
          </label>

          <input
            type="email"
            data-field="abogadoEmail"
            value="${escapeHtml(data.abogadoEmail || "")}"
          >
        </div>

        <div class="gc-field gc-field--full">
          <label>
            Observaciones
          </label>

          <textarea
            data-field="observaciones"
            rows="3"
          >${escapeHtml(data.observaciones || "")}</textarea>
        </div>

      </div>
    `;

    codefendantsContainer?.appendChild(card);
    updateCodefendantsEmptyState();

    return card;
  };

  const readDynamicCard = (card) => {
    const data = {
      id:
        card.dataset.lawyerId ||
        card.dataset.codefendantId ||
        generateId()
    };

    card.querySelectorAll("[data-field]").forEach((field) => {
      data[field.dataset.field] = field.value.trim();
    });

    return data;
  };

  const collectLawyers = () => {
    if (!lawyersContainer) {
      return [];
    }

    return Array.from(
      lawyersContainer.querySelectorAll(
        "[data-lawyer-id]"
      )
    ).map(readDynamicCard);
  };

  const collectCodefendants = () => {
    if (!codefendantsContainer) {
      return [];
    }

    return Array.from(
      codefendantsContainer.querySelectorAll(
        "[data-codefendant-id]"
      )
    ).map(readDynamicCard);
  };

  const getFormValue = (name) => {
    const field = form?.elements.namedItem(name);

    return field ? String(field.value || "").trim() : "";
  };

  const buildCaseObject = () => {
    const department = getDepartmentData();
    const status = getFormValue("estadoGeneral");

    return {
      id: generateId(),
      codigoInterno: getFormValue("codigoInterno"),
      expediente: getFormValue("expediente"),
      caratula: getFormValue("caratula"),

      departamento: getFormValue("departamento"),
      departamentoNombre: department.nombre,
      anio: getYearFromFileNumber(),

      fuero: getFormValue("fuero"),
      organismo: getFormValue("organismo"),
      juzgado: getFormValue("juzgado"),
      secretaria: getFormValue("secretaria"),
      tipoProceso: getFormValue("tipoProceso"),

      estadoGeneral: status,
      activa: !["Finalizada", "Archivada"].includes(status),

      fechaDesignacion: getFormValue("fechaDesignacion"),
      fechaAceptacion: getFormValue("fechaAceptacion"),
      proximoVencimiento: getFormValue(
        "proximoVencimiento"
      ),
      proximoPaso: getFormValue("proximoPaso"),

      actor: getFormValue("actorNombre"),

      partes: {
        actora: {
          nombre: getFormValue("actorNombre"),
          documento: getFormValue("actorDocumento"),
          telefono: getFormValue("actorTelefono"),
          email: getFormValue("actorEmail"),
          domicilio: getFormValue("actorDomicilio")
        },

        demandada: {
          nombre: getFormValue("demandadoNombre"),
          tipo: getFormValue("demandadoTipo"),
          documento: getFormValue("demandadoDocumento"),
          telefono: getFormValue("demandadoTelefono"),
          email: getFormValue("demandadoEmail"),
          domicilio: getFormValue("demandadoDomicilio")
        }
      },

      demandado: getFormValue("demandadoNombre"),

      abogados: collectLawyers(),
      codemandadas: collectCodefendants(),

      seguimiento: {
        estadoAnticipo: getFormValue("estadoAnticipo"),
        estadoEntrevista: getFormValue(
          "estadoEntrevista"
        ),
        estadoPericia: getFormValue("estadoPericia"),
        estadoHonorarios: getFormValue(
          "estadoHonorarios"
        )
      },

      observaciones: getFormValue("observaciones"),

      actuaciones: [],
      entrevistas: [],
      documentos: [],
      honorarios: [],

      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
  };

  const validateDynamicFields = () => {
    const requiredFields = [
      ...document.querySelectorAll(
        ".gc-dynamic-card [required]"
      )
    ];

    const invalidField = requiredFields.find(
      (field) => !field.value.trim()
    );

    if (!invalidField) {
      return true;
    }

    invalidField.focus();

    showToast(
      "Completá los datos obligatorios de abogados y codemandadas.",
      "error"
    );

    return false;
  };

  const saveDraft = () => {
    if (!form) {
      return;
    }

    const draft = buildCaseObject();

    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(draft)
      );

      showToast("Borrador guardado correctamente.");
    } catch (error) {
      console.error("No se pudo guardar el borrador:", error);

      showToast(
        "No se pudo guardar el borrador.",
        "error"
      );
    }
  };

  const restoreDraft = () => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);

      if (!stored || !form) {
        return;
      }

      const draft = JSON.parse(stored);

      const simpleValues = {
        departamento: draft.departamento,
        fuero: draft.fuero,
        expediente: draft.expediente,
        codigoInterno: draft.codigoInterno,
        caratula: draft.caratula,
        organismo: draft.organismo,
        juzgado: draft.juzgado,
        secretaria: draft.secretaria,
        tipoProceso: draft.tipoProceso,
        estadoGeneral: draft.estadoGeneral,
        fechaDesignacion: draft.fechaDesignacion,
        fechaAceptacion: draft.fechaAceptacion,
        proximoVencimiento: draft.proximoVencimiento,
        proximoPaso: draft.proximoPaso,

        actorNombre: draft.partes?.actora?.nombre,
        actorDocumento: draft.partes?.actora?.documento,
        actorTelefono: draft.partes?.actora?.telefono,
        actorEmail: draft.partes?.actora?.email,
        actorDomicilio: draft.partes?.actora?.domicilio,

        demandadoNombre:
          draft.partes?.demandada?.nombre,
        demandadoTipo:
          draft.partes?.demandada?.tipo,
        demandadoDocumento:
          draft.partes?.demandada?.documento,
        demandadoTelefono:
          draft.partes?.demandada?.telefono,
        demandadoEmail:
          draft.partes?.demandada?.email,
        demandadoDomicilio:
          draft.partes?.demandada?.domicilio,

        estadoAnticipo:
          draft.seguimiento?.estadoAnticipo,
        estadoEntrevista:
          draft.seguimiento?.estadoEntrevista,
        estadoPericia:
          draft.seguimiento?.estadoPericia,
        estadoHonorarios:
          draft.seguimiento?.estadoHonorarios,

        observaciones: draft.observaciones
      };

      Object.entries(simpleValues).forEach(
        ([name, value]) => {
          const field = form.elements.namedItem(name);

          if (field && value !== undefined && value !== null) {
            field.value = value;
          }
        }
      );

      lawyersContainer.innerHTML = "";
      codefendantsContainer.innerHTML = "";

      (draft.abogados || []).forEach(createLawyerCard);
      (draft.codemandadas || []).forEach(
        createCodefendantCard
      );

      if (!(draft.abogados || []).length) {
        createLawyerCard({
          parte: "actora"
        });

        createLawyerCard({
          parte: "demandada"
        });
      }

      updateCodefendantsEmptyState();

      showToast("Se recuperó el borrador guardado.");
    } catch (error) {
      console.error("No se pudo recuperar el borrador:", error);
    }
  };

  const registerCase = () => {
    if (!form) {
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();

      showToast(
        "Completá los campos obligatorios.",
        "error"
      );

      return;
    }

    if (!validateDynamicFields()) {
      return;
    }

  const newCase = buildCaseObject();

const existingCases =
  window.GestionCausasData?.getCases?.() || [];

const duplicate = existingCases.some(
  (causa) =>
    newCase.expediente &&
    causa.expediente &&
    causa.expediente.toLowerCase() ===
      newCase.expediente.toLowerCase()
);

if (duplicate) {
  showToast(
    "Ya existe una causa con ese número de expediente.",
    "error"
  );

  fileNumberInput?.focus();
  return;
}

const saved =
  window.GestionCausasData?.addCase?.(newCase);

if (!saved) {
  showToast(
    "No se pudo registrar la causa.",
    "error"
  );

  return;
}

localStorage.removeItem(DRAFT_KEY);

showToast("La causa fue registrada correctamente.");

window.setTimeout(() => {
  window.location.href =
    `./ficha-causa.html?id=${encodeURIComponent(
      newCase.id
    )}`;
}, 700);

};

  lawyersContainer?.addEventListener("click", (event) => {
    const removeButton = event.target.closest(
      '[data-action="remove-lawyer"]'
    );

    if (!removeButton) {
      return;
    }

    removeButton.closest(".gc-dynamic-card")?.remove();
  });

  codefendantsContainer?.addEventListener(
    "click",
    (event) => {
      const removeButton = event.target.closest(
        '[data-action="remove-codefendant"]'
      );

      if (!removeButton) {
        return;
      }

      removeButton.closest(".gc-dynamic-card")?.remove();
      updateCodefendantsEmptyState();
    }
  );

  addLawyerButton?.addEventListener("click", () => {
    const card = createLawyerCard();
    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  addCodefendantButton?.addEventListener("click", () => {
    const card = createCodefendantCard();

    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  saveDraftButton?.addEventListener("click", saveDraft);

  departmentInput?.addEventListener(
    "change",
    generateInternalCode
  );

  fileNumberInput?.addEventListener(
    "input",
    generateInternalCode
  );

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    registerCase();
  });

  restoreDraft();

  if (!lawyersContainer?.children.length) {
    createLawyerCard({
      parte: "actora"
    });

    createLawyerCard({
      parte: "demandada"
    });
  }

  generateInternalCode();
  updateCodefendantsEmptyState();

  console.log(
    "Gestión de Causas FALCO® Nueva Causa Ready"
  );
});