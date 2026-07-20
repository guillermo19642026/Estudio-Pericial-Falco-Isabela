/* =========================================================
   FALCO Admisión™
   Question Engine v1.0
========================================================= */

(() => {
  "use strict";

  const QuestionEngine = {
    initialized: false,

    config: null,
    stateModule: null,
    messages: null,
    questionnaire: null,

    userType: null,
    questions: [],
    visibleQuestions: [],
    answers: {},

    currentQuestionId: null,
    currentIndex: 0,
    editingFromReview: false,
    completed: false,

    elements: {},

    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    async init(options = {}) {
      if (this.initialized) {
        return true;
      }

      this.config =
        window.FalcoAdmisionConfig || {};

      this.stateModule =
        window.FalcoAdmisionState || null;

      this.cacheElements();

      if (!this.isInterviewPage()) {
        return false;
      }

      this.bindEvents();

      this.setLoading(true);
      this.setAionState(
        "loading",
        "Estoy preparando el recorrido de admisión."
      );

      try {
        this.userType =
          options.userType ||
          this.resolveUserType();

        await this.loadData();

        this.restoreState();
        this.refreshVisibleQuestions();

        if (!this.visibleQuestions.length) {
          throw new Error(
            "No existen preguntas disponibles para este recorrido."
          );
        }

        this.resolveInitialQuestion();
        this.renderCurrentQuestion();
        this.updateProgress();

        this.initialized = true;
        this.setLoading(false);

        return true;
      } catch (error) {
        console.error(
          "FALCO Question Engine:",
          error
        );

        this.showFatalError(
          error.message ||
          "No fue posible iniciar el recorrido."
        );

        return false;
      }
    },

    isInterviewPage() {
      return Boolean(
        this.elements.question ||
        this.elements.questionContainer ||
        document.body.classList.contains(
          "admision-page--interview"
        )
      );
    },

    cacheElements() {
      this.elements = {
        loading:
          document.getElementById(
            "admisionLoading"
          ) ||
          document.querySelector(
            ".admision-interview__loading"
          ),

        error:
          document.getElementById(
            "admisionError"
          ) ||
          document.querySelector(
            ".admision-interview__error"
          ),

        errorMessage:
          document.getElementById(
            "admisionErrorMessage"
          ),

        question:
          document.getElementById(
            "admisionQuestion"
          ) ||
          document.querySelector(
            ".admision-question"
          ),

        questionContainer:
          document.getElementById(
            "questionContainer"
          ) ||
          document.getElementById(
            "admisionQuestionContainer"
          ),

        section:
          document.getElementById(
            "questionSection"
          ) ||
          document.querySelector(
            "[data-question-section]"
          ),

        number:
          document.getElementById(
            "questionNumber"
          ) ||
          document.querySelector(
            "[data-question-number]"
          ),

        title:
          document.getElementById(
            "questionTitle"
          ) ||
          document.querySelector(
            "[data-question-title]"
          ),

        description:
          document.getElementById(
            "questionDescription"
          ) ||
          document.querySelector(
            "[data-question-description]"
          ),

        response:
          document.getElementById(
            "questionResponse"
          ) ||
          document.querySelector(
            ".admision-question__response"
          ),

        help:
          document.getElementById(
            "questionHelp"
          ) ||
          document.querySelector(
            ".admision-question__help"
          ),

        helpText:
          document.getElementById(
            "questionHelpText"
          ),

        validation:
          document.getElementById(
            "questionValidation"
          ) ||
          document.querySelector(
            ".admision-question__validation"
          ),

        validationText:
          document.getElementById(
            "questionValidationText"
          ),

        navigation:
          document.getElementById(
            "admisionNavigation"
          ) ||
          document.querySelector(
            ".admision-navigation"
          ),

       previousButton:
  document.getElementById(
    "previousQuestionButton"
  ) ||
  document.getElementById(
    "btnAnterior"
  ) ||
  document.querySelector(
    "[data-action='previous-question']"
  ) ||
  document.querySelector(
    "[data-action='previous']"
  ),

       nextButton:
  document.getElementById(
    "nextQuestionButton"
  ) ||
  document.getElementById(
    "btnContinuar"
  ) ||
  document.querySelector(
    "[data-action='next-question']"
  ) ||
  document.querySelector(
    "[data-action='next']"
  ),

        savedText:
          document.getElementById(
            "navigationSaved"
          ) ||
          document.querySelector(
            ".admision-navigation__saved"
          ),

        progressBar:
          document.getElementById(
            "admisionProgressBar"
          ) ||
          document.querySelector(
            "[data-progress-bar]"
          ),

        progressText:
          document.getElementById(
            "admisionProgressText"
          ) ||
          document.querySelector(
            "[data-progress-text]"
          ),

        progressCounter:
          document.getElementById(
            "admisionProgressCounter"
          ) ||
          document.querySelector(
            "[data-progress-counter]"
          ),

        progressPercentage:
          document.getElementById(
            "admisionProgressPercentage"
          ) ||
          document.querySelector(
            "[data-progress-percentage]"
          ),

        saveStatus:
          document.getElementById(
            "admisionSaveStatus"
          ) ||
          document.querySelector(
            ".admision-save-status"
          ),

        aionLabel:
          document.getElementById(
            "aionStateLabel"
          ) ||
          document.querySelector(
            "[data-aion-label]"
          ),

        aionMessage:
          document.getElementById(
            "aionMessage"
          ) ||
          document.querySelector(
            ".aion-guide__content p"
          ),

        review:
          document.getElementById(
            "admisionReview"
          ) ||
          document.querySelector(
            ".admision-review"
          ),

        reviewContent:
          document.getElementById(
            "admisionReviewContent"
          ) ||
          document.querySelector(
            ".admision-review__content"
          ),

        reviewSubmit:
          document.getElementById(
            "submitAdmissionButton"
          ) ||
          document.getElementById(
            "btnEnviarAdmision"
          ) ||
          document.querySelector(
            "[data-action='submit-admission']"
          ),

        reviewBack:
          document.getElementById(
            "reviewBackButton"
          ) ||
          document.querySelector(
            "[data-action='review-back']"
          ),

        consent:
          document.getElementById(
            "admisionConsent"
          ),

        restartButton:
          document.getElementById(
            "restartAdmissionButton"
          ) ||
          document.querySelector(
            "[data-action='restart']"
          ),

        restartModal:
          document.getElementById(
            "restartModal"
          ) ||
          document.querySelector(
            ".admision-modal"
          ),

        restartConfirm:
          document.getElementById(
            "confirmRestartButton"
          ) ||
          document.querySelector(
            "[data-action='confirm-restart']"
          ),

        restartCancel:
          document.getElementById(
            "cancelRestartButton"
          ) ||
          document.querySelector(
            "[data-action='cancel-restart']"
          )
      };
    },

    /* =====================================================
       CARGA DE DATOS
    ===================================================== */

    async loadData() {
      const basePath =
        this.resolveDataBasePath();

      const questionFile =
        this.userType === "profesional"
          ? "preguntas-profesionales.json"
          : "preguntas-personas.json";

      const [
        questionnaireResponse,
        messagesResponse
      ] = await Promise.all([
        fetch(
          `${basePath}${questionFile}`,
          {
            cache: "no-store"
          }
        ),

        fetch(
          `${basePath}mensajes-aion.json`,
          {
            cache: "no-store"
          }
        )
      ]);

      if (!questionnaireResponse.ok) {
        throw new Error(
          `No se pudo cargar ${questionFile}.`
        );
      }

      if (!messagesResponse.ok) {
        throw new Error(
          "No se pudo cargar mensajes-aion.json."
        );
      }

      this.questionnaire =
        await questionnaireResponse.json();

      this.messages =
        await messagesResponse.json();

      if (
        !this.questionnaire ||
        !Array.isArray(
          this.questionnaire.preguntas
        )
      ) {
        throw new Error(
          "El archivo de preguntas no tiene una estructura válida."
        );
      }

      this.questions = [
        ...this.questionnaire.preguntas
      ].sort(
        (a, b) =>
          Number(a.orden || 0) -
          Number(b.orden || 0)
      );
    },

    resolveDataBasePath() {
      const configuredPath =
        this.config?.rutas?.data ||
        this.config?.paths?.data;

      if (configuredPath) {
        return configuredPath.endsWith("/")
          ? configuredPath
          : `${configuredPath}/`;
      }

      return "data/";
    },

    resolveUserType() {
      const url =
        new URL(window.location.href);

      const urlType =
        url.searchParams.get("tipo") ||
        url.searchParams.get("usuario");

      if (
        urlType === "profesional" ||
        urlType === "persona"
      ) {
        this.persistUserType(urlType);

        return urlType;
      }

      const stateType =
        this.readStateValue(
          "tipoUsuario"
        ) ||
        this.readStateValue(
          "userType"
        );

      if (
        stateType === "profesional" ||
        stateType === "persona"
      ) {
        return stateType;
      }

      const localType =
        localStorage.getItem(
          "falco_admision_tipo_usuario"
        );

      if (
        localType === "profesional" ||
        localType === "persona"
      ) {
        return localType;
      }

      return "persona";
    },

    persistUserType(type) {
      localStorage.setItem(
        "falco_admision_tipo_usuario",
        type
      );
    },

    /* =====================================================
       ESTADO Y PERSISTENCIA
    ===================================================== */

    restoreState() {
      const stored =
        this.readStoredState();

      if (!stored) {
        this.answers = {};
        return;
      }

      if (
        stored.userType &&
        stored.userType !== this.userType
      ) {
        this.answers = {};
        return;
      }

      this.answers =
        stored.answers &&
        typeof stored.answers === "object"
          ? stored.answers
          : {};

      this.currentQuestionId =
        stored.currentQuestionId || null;

      this.completed =
        Boolean(stored.completed);
    },

    readStoredState() {
      if (
        this.stateModule &&
        typeof this.stateModule.getState ===
          "function"
      ) {
        try {
          return this.stateModule.getState();
        } catch (error) {
          console.warn(
            "No se pudo leer FalcoAdmisionState:",
            error
          );
        }
      }

      const keys = [
        "falco_admision_state",
        "falcoAdmisionState",
        "falco-admision-state"
      ];

      for (const key of keys) {
        try {
          const raw =
            localStorage.getItem(key);

          if (raw) {
            return JSON.parse(raw);
          }
        } catch (error) {
          console.warn(
            `Estado inválido en ${key}.`
          );
        }
      }

      return null;
    },

    saveState() {
      const state = {
        version: "1.0.0",
        userType: this.userType,
        tipoUsuario: this.userType,
        questionnaireId:
          this.questionnaire?.id || null,
        currentQuestionId:
          this.currentQuestionId,
        currentIndex:
          this.currentIndex,
        answers:
          this.answers,
        completed:
          this.completed,
        updatedAt:
          new Date().toISOString()
      };

      this.setSaveStatus(
        "Guardando…",
        "saving"
      );

      try {
        if (
          this.stateModule &&
          typeof this.stateModule.setState ===
            "function"
        ) {
          this.stateModule.setState(state);
        } else if (
          this.stateModule &&
          typeof this.stateModule.save ===
            "function"
        ) {
          this.stateModule.save(state);
        }

        localStorage.setItem(
          "falco_admision_state",
          JSON.stringify(state)
        );

        this.setSaveStatus(
          "Progreso guardado",
          "saved"
        );

        this.announce(
          this.messages?.accesibilidad
            ?.progreso_actualizado
        );

        return true;
      } catch (error) {
        console.error(
          "No se pudo guardar el estado:",
          error
        );

        this.setSaveStatus(
          "No se pudo guardar",
          "error"
        );

        return false;
      }
    },

    readStateValue(key) {
      const state =
        this.readStoredState();

      return state?.[key];
    },

    resetState() {
      this.answers = {};
      this.currentIndex = 0;
      this.currentQuestionId = null;
      this.editingFromReview = false;
      this.completed = false;

      if (
        this.stateModule &&
        typeof this.stateModule.reset ===
          "function"
      ) {
        try {
          this.stateModule.reset();
        } catch (error) {
          console.warn(error);
        }
      }

      [
        "falco_admision_state",
        "falcoAdmisionState",
        "falco-admision-state"
      ].forEach((key) =>
        localStorage.removeItem(key)
      );
    },

    /* =====================================================
       PREGUNTAS CONDICIONALES
    ===================================================== */

    refreshVisibleQuestions() {
      this.visibleQuestions =
        this.questions.filter(
          (question) =>
            this.shouldShowQuestion(question)
        );

      const currentVisibleIndex =
        this.visibleQuestions.findIndex(
          (question) =>
            question.id ===
            this.currentQuestionId
        );

      if (currentVisibleIndex >= 0) {
        this.currentIndex =
          currentVisibleIndex;
      } else if (
        this.currentIndex >=
        this.visibleQuestions.length
      ) {
        this.currentIndex = Math.max(
          0,
          this.visibleQuestions.length - 1
        );
      }
    },

    shouldShowQuestion(question) {
      if (!question.condicion) {
        return true;
      }

      const condition =
        question.condicion;

      const sourceAnswer =
        this.answers[
          condition.pregunta
        ];

      const expectedValues =
        Array.isArray(condition.valores)
          ? condition.valores
          : condition.valor !== undefined
            ? [condition.valor]
            : [];

      if (
        condition.operador ===
        "no_contiene"
      ) {
        return !this.answerMatches(
          sourceAnswer,
          expectedValues
        );
      }

      return this.answerMatches(
        sourceAnswer,
        expectedValues
      );
    },

    answerMatches(
      answer,
      expectedValues
    ) {
      if (Array.isArray(answer)) {
        return answer.some((value) =>
          expectedValues.includes(value)
        );
      }

      if (
        answer &&
        typeof answer === "object"
      ) {
        return Object.values(answer).some(
          (value) =>
            expectedValues.includes(value)
        );
      }

      return expectedValues.includes(
        answer
      );
    },

    resolveInitialQuestion() {
      if (this.completed) {
        this.showReview();
        return;
      }

      const restoredIndex =
        this.visibleQuestions.findIndex(
          (question) =>
            question.id ===
            this.currentQuestionId
        );

      if (restoredIndex >= 0) {
        this.currentIndex =
          restoredIndex;
      } else {
        this.currentIndex = 0;
        this.currentQuestionId =
          this.visibleQuestions[0].id;
      }
    },

    /* =====================================================
       RENDERIZADO GENERAL
    ===================================================== */

    renderCurrentQuestion() {
      if (this.completed) {
        this.showReview();
        return;
      }

      this.refreshVisibleQuestions();

      const question =
        this.visibleQuestions[
          this.currentIndex
        ];

      if (!question) {
        this.showReview();
        return;
      }

      this.currentQuestionId =
        question.id;

      this.hideReview();
      this.clearValidation();

      if (this.elements.question) {
        this.elements.question.hidden =
          false;

        this.elements.question.classList
          .remove("is-entering");

        requestAnimationFrame(() => {
          this.elements.question?.classList
            .add("is-entering");
        });
      }

      this.setText(
        this.elements.section,
        question.seccion ||
        "Admisión"
      );

      this.setText(
        this.elements.number,
        `Pregunta ${
          this.currentIndex + 1
        } de ${
          this.visibleQuestions.length
        }`
      );

      this.setText(
        this.elements.title,
        question.titulo || ""
      );

      this.setText(
        this.elements.description,
        question.descripcion || ""
      );

      if (
        this.elements.description
      ) {
        this.elements.description.hidden =
          !question.descripcion;
      }

      this.renderHelp(question);
      this.renderResponse(question);
      this.renderAionQuestion(question);
      this.updateNavigation();
      this.updateProgress();
      this.saveState();

      requestAnimationFrame(() => {
        this.focusQuestionTitle();
      });

      this.announce(
  this.messages?.accesibilidad
    ?.pregunta_cargada ||
  "Nueva pregunta cargada."
);

const header = document.querySelector(".admision-progress-header");

if (header) {
  header.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
    },

    renderResponse(question) {
      const container =
        this.elements.response;

      if (!container) {
        throw new Error(
          "No se encontró el contenedor de respuestas."
        );
      }

      container.innerHTML = "";

      const renderers = {
        radio: () =>
          this.renderOptions(
            question,
            "radio"
          ),

        checkbox: () =>
          this.renderOptions(
            question,
            "checkbox"
          ),

        text: () =>
          this.renderSingleField(
            question,
            "text"
          ),

        email: () =>
          this.renderSingleField(
            question,
            "email"
          ),

        tel: () =>
          this.renderSingleField(
            question,
            "tel"
          ),

        date: () =>
          this.renderSingleField(
            question,
            "date"
          ),

        textarea: () =>
          this.renderTextarea(question),

        select: () =>
          this.renderSelectQuestion(
            question
          ),

        grupo: () =>
          this.renderGroup(question)
      };

      const renderer =
        renderers[question.tipo];

      if (!renderer) {
        container.innerHTML = `
          <div class="admision-notice admision-notice--important">
            <span class="admision-notice__icon">i</span>
            <div>
              <strong>Tipo de pregunta no compatible</strong>
              <p>No existe un renderizador para “${this.escapeHtml(
                question.tipo
              )}”.</p>
            </div>
          </div>
        `;

        return;
      }

      renderer();
    },

    renderHelp(question) {
      const help =
        this.elements.help;

      if (!help) {
        return;
      }

      if (!question.ayuda) {
        help.hidden = true;
        return;
      }

      help.hidden = false;

      if (this.elements.helpText) {
        this.setText(
          this.elements.helpText,
          question.ayuda
        );
      } else {
        const textNode =
          help.querySelector("p");

        if (textNode) {
          this.setText(
            textNode,
            question.ayuda
          );
        }
      }
    },

    /* =====================================================
       RADIO Y CHECKBOX
    ===================================================== */

    renderOptions(
      question,
      inputType
    ) {
      const container =
        document.createElement("div");

      container.className =
        "admision-options";

      if (
        question.opciones?.length <= 4
      ) {
        container.classList.add(
          "admision-options--two-columns"
        );
      }

      const storedValue =
        this.answers[question.id];

      const selectedValues =
        Array.isArray(storedValue)
          ? storedValue
          : storedValue !== undefined &&
              storedValue !== null &&
              storedValue !== ""
            ? [storedValue]
            : [];

      (
        question.opciones || []
      ).forEach((option, index) => {
        const label =
          document.createElement("label");

        label.className =
          "admision-option-card";

        if (
          inputType === "checkbox"
        ) {
          label.classList.add(
            "admision-option-card--checkbox"
          );
        }

        const input =
          document.createElement("input");

        input.className =
          "admision-option-card__input";

        input.type = inputType;
        input.name =
          question.id;

        input.value =
          option.valor;

        input.id =
          `${question.id}-${index}`;

        input.checked =
          selectedValues.includes(
            option.valor
          );

        input.addEventListener(
          "change",
          () =>
            this.handleOptionChange(
              question,
              input
            )
        );

        const control =
          document.createElement("span");

        control.className =
          "admision-option-card__control";

        const indicator =
          document.createElement("span");

        indicator.className =
          "admision-option-card__indicator";

        indicator.setAttribute(
          "aria-hidden",
          "true"
        );

        const content =
          document.createElement("span");

        content.className =
          "admision-option-card__content";

        const strong =
          document.createElement("strong");

        strong.textContent =
          option.etiqueta ||
          option.valor;

        content.appendChild(strong);

        if (option.descripcion) {
          const description =
            document.createElement(
              "span"
            );

          description.textContent =
            option.descripcion;

          content.appendChild(
            description
          );
        }

        control.append(
          indicator,
          content
        );

        label.append(
          input,
          control
        );

        container.appendChild(label);
      });

      this.elements.response.appendChild(
        container
      );
    },

    handleOptionChange(
      question,
      input
    ) {
      if (input.type === "radio") {
        this.answers[question.id] =
          input.value;
      } else {
        const selected = [
          ...this.elements.response
            .querySelectorAll(
              `input[name="${question.id}"]:checked`
            )
        ].map(
          (element) =>
            element.value
        );

        this.answers[question.id] =
          selected;
      }

      this.clearValidation();
      this.refreshVisibleQuestions();
      this.saveState();

      this.announce(
        this.messages?.accesibilidad
          ?.respuesta_seleccionada ||
        "Respuesta seleccionada."
      );
    },

    /* =====================================================
       CAMPOS SIMPLES
    ===================================================== */

    renderSingleField(
      question,
      type
    ) {
      const field =
        this.createFieldWrapper();

      const label =
        this.createFieldLabel(
          question.etiqueta ||
          question.titulo,
          question.id
        );

      const input =
        document.createElement("input");

      input.className =
        "admision-input";

      input.type = type;
      input.id =
        `field-${question.id}`;

      input.name =
        question.id;

      input.value =
        this.answers[question.id] || "";

      input.placeholder =
        question.placeholder || "";

      if (question.autocomplete) {
        input.autocomplete =
          question.autocomplete;
      }

      if (
        question.maximoCaracteres
      ) {
        input.maxLength =
          question.maximoCaracteres;
      }

      input.required =
        Boolean(question.obligatoria);

      this.bindTextInput(
        input,
        question
      );

      field.append(
        label,
        input
      );

      this.appendFieldFooter(
        field,
        question,
        input
      );

      this.elements.response.appendChild(
        field
      );
    },

    renderTextarea(question) {
      const field =
        this.createFieldWrapper();

      const label =
        this.createFieldLabel(
          question.etiqueta ||
          "Respuesta",
          question.id
        );

      const textarea =
        document.createElement(
          "textarea"
        );

      textarea.className =
        "admision-textarea";

      textarea.id =
        `field-${question.id}`;

      textarea.name =
        question.id;

      textarea.value =
        this.answers[question.id] || "";

      textarea.placeholder =
        question.placeholder || "";

      textarea.required =
        Boolean(question.obligatoria);

      if (
        question.maximoCaracteres
      ) {
        textarea.maxLength =
          question.maximoCaracteres;
      }

      this.bindTextInput(
        textarea,
        question
      );

      field.append(
        label,
        textarea
      );

      this.appendFieldFooter(
        field,
        question,
        textarea
      );

      this.elements.response.appendChild(
        field
      );

      this.updateCharacterCounter(
        question,
        textarea
      );
    },

    renderSelectQuestion(
      question
    ) {
      const field =
        this.createFieldWrapper();

      const label =
        this.createFieldLabel(
          question.etiqueta ||
          question.titulo,
          question.id
        );

      const wrapper =
        document.createElement("div");

      wrapper.className =
        "admision-select-wrapper";

      const select =
        this.createSelect(
          question,
          question.id,
          this.answers[question.id]
        );

      wrapper.appendChild(select);
      wrapper.appendChild(
        this.createSelectIcon()
      );

      field.append(
        label,
        wrapper
      );

      this.elements.response.appendChild(
        field
      );
    },

    bindTextInput(
      input,
      question
    ) {
      input.addEventListener(
        "input",
        () => {
          this.answers[question.id] =
            input.value;

          input.classList.remove(
            "is-invalid"
          );

          this.clearValidation();

          this.updateCharacterCounter(
            question,
            input
          );

          this.saveState();
        }
      );

      input.addEventListener(
        "blur",
        () => {
          this.answers[question.id] =
            input.value.trim();

          this.saveState();
        }
      );
    },

    /* =====================================================
       GRUPOS
    ===================================================== */

    renderGroup(question) {
      const fields =
        document.createElement("div");

      fields.className =
        "admision-fields";

      const fieldCount =
        question.campos?.length || 0;

      if (fieldCount === 2) {
        fields.classList.add(
          "admision-fields--two-columns"
        );
      }

      if (fieldCount >= 3) {
        fields.classList.add(
          "admision-fields--three-columns"
        );
      }

      const storedGroup =
        this.answers[question.id] &&
        typeof this.answers[
          question.id
        ] === "object"
          ? this.answers[question.id]
          : {};

      (
        question.campos || []
      ).forEach((fieldDefinition) => {
        const field =
          this.createFieldWrapper();

        const inputId =
          `${question.id}-${fieldDefinition.id}`;

        const label =
          this.createFieldLabel(
            fieldDefinition.etiqueta,
            inputId
          );

        let control;

        if (
          fieldDefinition.tipo ===
          "select"
        ) {
          const wrapper =
            document.createElement("div");

          wrapper.className =
            "admision-select-wrapper";

          control =
            this.createSelect(
              fieldDefinition,
              inputId,
              storedGroup[
                fieldDefinition.id
              ]
            );

          wrapper.append(
            control,
            this.createSelectIcon()
          );

          field.append(
            label,
            wrapper
          );
        } else if (
          fieldDefinition.tipo ===
          "textarea"
        ) {
          control =
            document.createElement(
              "textarea"
            );

          control.className =
            "admision-textarea";

          field.append(
            label,
            control
          );
        } else {
          control =
            document.createElement(
              "input"
            );

          control.className =
            "admision-input";

          control.type =
            fieldDefinition.tipo ||
            "text";

          field.append(
            label,
            control
          );
        }

        control.id =
          inputId;

        control.name =
          fieldDefinition.id;

        control.value =
          storedGroup[
            fieldDefinition.id
          ] || "";

        control.placeholder =
          fieldDefinition.placeholder ||
          "";

        control.required =
          Boolean(
            fieldDefinition.obligatorio
          );

        if (
          fieldDefinition.autocomplete
        ) {
          control.autocomplete =
            fieldDefinition.autocomplete;
        }

        if (
          fieldDefinition.maximoCaracteres
        ) {
          control.maxLength =
            fieldDefinition.maximoCaracteres;
        }

        control.dataset.groupQuestion =
          question.id;

        control.dataset.groupField =
          fieldDefinition.id;

        control.addEventListener(
          "input",
          () =>
            this.handleGroupInput(
              question,
              fieldDefinition,
              control
            )
        );

        control.addEventListener(
          "change",
          () =>
            this.handleGroupInput(
              question,
              fieldDefinition,
              control
            )
        );

        if (
          fieldDefinition.ayuda
        ) {
          const help =
            document.createElement(
              "small"
            );

          help.className =
            "admision-field__help";

          help.textContent =
            fieldDefinition.ayuda;

          field.appendChild(help);
        }

        fields.appendChild(field);
      });

      this.elements.response.appendChild(
        fields
      );
    },

    handleGroupInput(
      question,
      fieldDefinition,
      control
    ) {
      const groupValue =
        this.answers[question.id] &&
        typeof this.answers[
          question.id
        ] === "object"
          ? {
              ...this.answers[
                question.id
              ]
            }
          : {};

      groupValue[
        fieldDefinition.id
      ] = control.value;

      this.answers[question.id] =
        groupValue;

      control.classList.remove(
        "is-invalid"
      );

      this.clearValidation();
      this.saveState();
    },

    createSelect(
      definition,
      name,
      storedValue
    ) {
      const select =
        document.createElement(
          "select"
        );

      select.className =
        "admision-select";

      select.id = name;
      select.name = name;

      (
        definition.opciones || []
      ).forEach((option) => {
        const optionElement =
          document.createElement(
            "option"
          );

        optionElement.value =
          option.valor;

        optionElement.textContent =
          option.etiqueta ||
          option.valor;

        optionElement.selected =
          String(storedValue || "") ===
          String(option.valor);

        select.appendChild(
          optionElement
        );
      });

      select.addEventListener(
        "change",
        () => {
          if (
            select.dataset
              .groupQuestion
          ) {
            return;
          }

          this.answers[
            definition.id
          ] = select.value;

          this.clearValidation();
          this.saveState();
        }
      );

      return select;
    },

    createSelectIcon() {
      const icon =
        document.createElement("span");

      icon.className =
        "admision-select-wrapper__icon";

      icon.textContent = "⌄";

      icon.setAttribute(
        "aria-hidden",
        "true"
      );

      return icon;
    },

    createFieldWrapper() {
      const field =
        document.createElement("div");

      field.className =
        "admision-field";

      return field;
    },

    createFieldLabel(
      text,
      inputId
    ) {
      const label =
        document.createElement("label");

      label.className =
        "admision-field__label";

      label.htmlFor =
        inputId.startsWith("field-")
          ? inputId
          : `field-${inputId}`;

      label.textContent =
        text || "Respuesta";

      return label;
    },

    appendFieldFooter(
      field,
      question,
      input
    ) {
      if (
        !question.ayuda &&
        !question.maximoCaracteres
      ) {
        return;
      }

      const footer =
        document.createElement("div");

      footer.className =
        "admision-field__footer";

      if (question.ayuda) {
        const help =
          document.createElement(
            "small"
          );

        help.className =
          "admision-field__help";

        help.textContent =
          question.ayuda;

        footer.appendChild(help);
      }

      if (
        question.maximoCaracteres
      ) {
        const counter =
          document.createElement(
            "span"
          );

        counter.className =
          "admision-field__counter";

        counter.dataset.counterFor =
          question.id;

        counter.textContent =
          `${
            input.value.length
          } / ${
            question.maximoCaracteres
          }`;

        footer.appendChild(counter);
      }

      field.appendChild(footer);
    },

    updateCharacterCounter(
      question,
      input
    ) {
      if (
        !question.maximoCaracteres
      ) {
        return;
      }

      const counter =
        this.elements.response
          ?.querySelector(
            `[data-counter-for="${question.id}"]`
          );

      if (counter) {
        counter.textContent =
          `${input.value.length} / ${question.maximoCaracteres}`;
      }
    },

    /* =====================================================
       VALIDACIÓN
    ===================================================== */

    validateCurrentQuestion() {
      const question =
        this.visibleQuestions[
          this.currentIndex
        ];

      if (!question) {
        return true;
      }

      const answer =
        this.answers[question.id];

      this.clearInvalidFields();

      switch (question.tipo) {
        case "radio":
          if (
            question.obligatoria &&
            !this.hasValue(answer)
          ) {
            return this.validationFailure(
              "obligatoria"
            );
          }

          break;

        case "checkbox": {
          const values =
            Array.isArray(answer)
              ? answer
              : [];

          const minimum =
            Number(
              question.minimoSelecciones ??
              (question.obligatoria
                ? 1
                : 0)
            );

          if (
            values.length < minimum
          ) {
            return this.validationFailure(
              "seleccion_minima"
            );
          }

          break;
        }

        case "text":
        case "email":
        case "tel":
        case "date":
        case "textarea":
          return this.validateTextQuestion(
            question,
            answer
          );

        case "select":
          if (
            question.obligatoria &&
            !this.hasValue(answer)
          ) {
            return this.validationFailure(
              "obligatoria"
            );
          }

          break;

        case "grupo":
          return this.validateGroup(
            question,
            answer
          );

        default:
          return true;
      }

      return true;
    },

    validateTextQuestion(
      question,
      answer
    ) {
      const value =
        String(answer || "").trim();

      if (
        question.obligatoria &&
        !value
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "obligatoria"
        );
      }

      if (!value) {
        return true;
      }

      if (
        question.minimoCaracteres &&
        value.length <
          question.minimoCaracteres
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "texto_minimo"
        );
      }

      if (
        question.maximoCaracteres &&
        value.length >
          question.maximoCaracteres
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "texto_maximo"
        );
      }

      if (
        question.tipo === "email" &&
        !this.isValidEmail(value)
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "email"
        );
      }

      if (
        question.tipo === "tel" &&
        !this.isValidPhone(value)
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "telefono"
        );
      }

      if (
        question.tipo === "date" &&
        !this.isValidDate(value)
      ) {
        this.markSingleFieldInvalid();

        return this.validationFailure(
          "fecha"
        );
      }

      return true;
    },

    validateGroup(
      question,
      answer
    ) {
      const group =
        answer &&
        typeof answer === "object"
          ? answer
          : {};

      let firstInvalid =
        null;

      for (
        const field of
        question.campos || []
      ) {
        const value =
          String(
            group[field.id] || ""
          ).trim();

        if (
          field.obligatorio &&
          !value
        ) {
          const control =
            this.elements.response
              ?.querySelector(
                `[data-group-field="${field.id}"]`
              );

          control?.classList.add(
            "is-invalid"
          );

          if (!firstInvalid) {
            firstInvalid = control;
          }
        }

        if (
          value &&
          field.tipo === "email" &&
          !this.isValidEmail(value)
        ) {
          const control =
            this.elements.response
              ?.querySelector(
                `[data-group-field="${field.id}"]`
              );

          control?.classList.add(
            "is-invalid"
          );

          firstInvalid ||=
            control;
        }

        if (
          value &&
          field.tipo === "tel" &&
          !this.isValidPhone(value)
        ) {
          const control =
            this.elements.response
              ?.querySelector(
                `[data-group-field="${field.id}"]`
              );

          control?.classList.add(
            "is-invalid"
          );

          firstInvalid ||=
            control;
        }
      }

      if (firstInvalid) {
        firstInvalid.focus();

        return this.validationFailure(
          "grupo_incompleto"
        );
      }

      return true;
    },

    validationFailure(type) {
      const validation =
        this.messages?.validaciones?.[
          type
        ] ||
        this.messages?.validaciones
          ?.generica ||
        {
          etiqueta:
            "Revisemos esta respuesta",
          mensaje:
            "Hay un dato que necesita ser completado."
        };

      this.showValidation(
        validation.mensaje,
        validation.etiqueta
      );

      this.setAionState(
        "warning",
        validation.mensaje
      );

      this.announce(
        this.messages?.accesibilidad
          ?.validacion_error ||
        "La respuesta necesita ser revisada."
      );

      return false;
    },

    showValidation(
      message,
      label = ""
    ) {
      const validation =
        this.elements.validation;

      if (!validation) {
        return;
      }

      validation.hidden = false;

      const finalMessage =
        label
          ? `${label}. ${message}`
          : message;

      if (
        this.elements.validationText
      ) {
        this.setText(
          this.elements.validationText,
          finalMessage
        );
      } else {
        const text =
          validation.querySelector("p");

        if (text) {
          this.setText(
            text,
            finalMessage
          );
        }
      }

      validation.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    },

    clearValidation() {
      if (
        this.elements.validation
      ) {
        this.elements.validation.hidden =
          true;
      }
    },

    clearInvalidFields() {
      this.elements.response
        ?.querySelectorAll(
          ".is-invalid"
        )
        .forEach((element) =>
          element.classList.remove(
            "is-invalid"
          )
        );
    },

    markSingleFieldInvalid() {
      const field =
        this.elements.response
          ?.querySelector(
            ".admision-input, .admision-textarea, .admision-select"
          );

      field?.classList.add(
        "is-invalid"
      );

      field?.focus();
    },

    hasValue(value) {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (
        value &&
        typeof value === "object"
      ) {
        return Object.values(value).some(
          (item) =>
            String(item || "").trim()
        );
      }

      return Boolean(
        String(value ?? "").trim()
      );
    },

    isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
      );
    },

    isValidPhone(value) {
      const digits =
        value.replace(/\D/g, "");

      return digits.length >= 8;
    },

    isValidDate(value) {
      if (!value) {
        return false;
      }

      const date =
        new Date(
          `${value}T12:00:00`
        );

      return !Number.isNaN(
        date.getTime()
      );
    },

    /* =====================================================
       NAVEGACIÓN
    ===================================================== */

    next() {
      if (
        !this.validateCurrentQuestion()
      ) {
        return;
      }

      this.saveState();
      this.refreshVisibleQuestions();

      if (
        this.editingFromReview
      ) {
        this.editingFromReview = false;
        this.showReview();
        return;
      }

      if (
        this.currentIndex >=
        this.visibleQuestions.length - 1
      ) {
        this.showReview();
        return;
      }

      this.currentIndex += 1;

      this.currentQuestionId =
        this.visibleQuestions[
          this.currentIndex
        ].id;

      this.renderCurrentQuestion();
    },

    previous() {
      this.clearValidation();

      if (
        this.currentIndex <= 0
      ) {
        return;
      }

      this.currentIndex -= 1;

      this.currentQuestionId =
        this.visibleQuestions[
          this.currentIndex
        ].id;

      this.renderCurrentQuestion();
    },

    goToQuestion(questionId) {
      this.completed = false;
      this.editingFromReview = true;

      this.refreshVisibleQuestions();

      const index =
        this.visibleQuestions.findIndex(
          (question) =>
            question.id ===
            questionId
        );

      if (index < 0) {
        return;
      }

      this.currentIndex = index;
      this.currentQuestionId =
        questionId;

      this.renderCurrentQuestion();
    },

    updateNavigation() {
      if (
        this.elements.navigation
      ) {
        this.elements.navigation.hidden =
          false;
      }

      if (
        this.elements.previousButton
      ) {
        this.elements.previousButton.disabled =
          this.currentIndex === 0;

        this.elements.previousButton.hidden =
          this.currentIndex === 0;
      }

      if (
        this.elements.nextButton
      ) {
        const last =
          this.currentIndex ===
          this.visibleQuestions.length -
            1;

        this.elements.nextButton.textContent =
          this.editingFromReview
            ? "Guardar cambio"
            : last
              ? "Revisar admisión"
              : "Continuar";
      }
    },

    /* =====================================================
       PROGRESO
    ===================================================== */

    updateProgress() {
      const total =
        this.visibleQuestions.length;

      const current =
        Math.min(
          this.currentIndex + 1,
          total
        );

      const answered =
        this.visibleQuestions.filter(
          (question) =>
            this.isQuestionAnswered(
              question
            )
        ).length;

      const percentage =
        total
          ? Math.round(
              (answered / total) *
                100
            )
          : 0;

      if (
        this.elements.progressBar
      ) {
        this.elements.progressBar.style.width =
          `${percentage}%`;

        this.elements.progressBar.setAttribute(
          "aria-valuenow",
          String(percentage)
        );
      }

      this.setText(
        this.elements.progressText,
        `Progreso de la admisión`
      );

      this.setText(
        this.elements.progressCounter,
        `${current} de ${total}`
      );

      this.setText(
        this.elements.progressPercentage,
        `${percentage}%`
      );
    },

    isQuestionAnswered(question) {
      if (
        !this.shouldShowQuestion(
          question
        )
      ) {
        return false;
      }

      const answer =
        this.answers[question.id];

      if (
        question.tipo === "checkbox"
      ) {
        return (
          Array.isArray(answer) &&
          answer.length > 0
        );
      }

      if (
        question.tipo === "grupo"
      ) {
        const requiredFields =
          (
            question.campos || []
          ).filter(
            (field) =>
              field.obligatorio
          );

        if (!requiredFields.length) {
          return this.hasValue(answer);
        }

        return requiredFields.every(
          (field) =>
            this.hasValue(
              answer?.[field.id]
            )
        );
      }

      return this.hasValue(answer);
    },

    /* =====================================================
       REVISIÓN FINAL
    ===================================================== */

    showReview() {
      this.refreshVisibleQuestions();

      this.completed = false;
      this.currentQuestionId = null;

      if (
        this.elements.question
      ) {
        this.elements.question.hidden =
          true;
      }

      if (
        this.elements.navigation
      ) {
        this.elements.navigation.hidden =
          true;
      }

      if (
        this.elements.review
      ) {
        this.elements.review.hidden =
          false;

        this.elements.review.classList
          .remove("is-entering");

        requestAnimationFrame(() => {
          this.elements.review?.classList
            .add("is-entering");
        });
      }

      this.renderReviewItems();

      this.setAionState(
        "review",
        this.messages?.estados?.review
          ?.mensaje ||
        "Revisá las respuestas antes de enviar."
      );

      this.updateProgressForReview();
      this.saveState();

      this.announce(
        this.messages?.accesibilidad
          ?.revision_abierta ||
        "Se abrió la revisión final."
      );
    },

    hideReview() {
      if (this.elements.review) {
        this.elements.review.hidden =
          true;
      }
    },

    renderReviewItems() {
      const container =
        this.elements.reviewContent;

      if (!container) {
        return;
      }

      container.innerHTML = "";

      this.visibleQuestions.forEach(
        (question) => {
          const item =
            document.createElement(
              "article"
            );

          item.className =
            "admision-review-item";

          const content =
            document.createElement(
              "div"
            );

          content.className =
            "admision-review-item__content";

          const section =
            document.createElement(
              "span"
            );

          section.className =
            "admision-review-item__section";

          section.textContent =
            question.seccion ||
            "Admisión";

          const title =
            document.createElement(
              "strong"
            );

          title.textContent =
            question.titulo;

          const answer =
            document.createElement("p");

          answer.textContent =
            this.formatAnswer(
              question,
              this.answers[
                question.id
              ]
            );

          const editButton =
            document.createElement(
              "button"
            );

          editButton.type =
            "button";

          editButton.className =
            "admision-button admision-button--secondary admision-button--compact";

          editButton.textContent =
            "Editar";

          editButton.addEventListener(
            "click",
            () =>
              this.goToQuestion(
                question.id
              )
          );

          content.append(
            section,
            title,
            answer
          );

          item.append(
            content,
            editButton
          );

          container.appendChild(item);
        }
      );
    },

    formatAnswer(
      question,
      answer
    ) {
      const emptyText =
        this.messages?.revision
          ?.sin_respuesta ||
        "Sin respuesta registrada";

      if (
        answer === undefined ||
        answer === null ||
        answer === "" ||
        (
          Array.isArray(answer) &&
          !answer.length
        )
      ) {
        return emptyText;
      }

      if (
        question.tipo === "radio" ||
        question.tipo ===
          "checkbox" ||
        question.tipo === "select"
      ) {
        const values =
          Array.isArray(answer)
            ? answer
            : [answer];

        return values
          .map((value) =>
            this.findOptionLabel(
              question.opciones,
              value
            )
          )
          .join(", ");
      }

      if (
        question.tipo === "grupo"
      ) {
        return (
          question.campos || []
        )
          .map((field) => {
            const value =
              answer?.[field.id];

            if (!this.hasValue(value)) {
              return null;
            }

            const formattedValue =
              field.tipo === "select"
                ? this.findOptionLabel(
                    field.opciones,
                    value
                  )
                : value;

            return `${field.etiqueta}: ${formattedValue}`;
          })
          .filter(Boolean)
          .join("\n") || emptyText;
      }

      return String(answer);
    },

    findOptionLabel(
      options,
      value
    ) {
      const option =
        (options || []).find(
          (item) =>
            String(item.valor) ===
            String(value)
        );

      return (
        option?.etiqueta ||
        String(value)
      );
    },

    updateProgressForReview() {
      if (
        this.elements.progressBar
      ) {
        this.elements.progressBar.style.width =
          "100%";

        this.elements.progressBar.setAttribute(
          "aria-valuenow",
          "100"
        );
      }

      this.setText(
        this.elements.progressCounter,
        `${this.visibleQuestions.length} de ${this.visibleQuestions.length}`
      );

      this.setText(
        this.elements.progressPercentage,
        "100%"
      );
    },

    backFromReview() {
      this.completed = false;
      this.editingFromReview = false;
      this.currentIndex = Math.max(
        0,
        this.visibleQuestions.length - 1
      );

      this.currentQuestionId =
        this.visibleQuestions[
          this.currentIndex
        ]?.id || null;

      this.renderCurrentQuestion();
    },

    /* =====================================================
       PREPARACIÓN DEL ENVÍO
    ===================================================== */

    prepareSubmission() {
      const consent =
        this.elements.consent;

      if (
        consent &&
        !consent.checked
      ) {
        const validation =
          this.messages?.validaciones
            ?.consentimiento;

        this.showReviewValidation(
          validation?.mensaje ||
          "Confirmá la información antes de enviar."
        );

        return null;
      }

      const missingQuestion =
        this.visibleQuestions.find(
          (question) =>
            question.obligatoria &&
            !this.isQuestionAnswered(
              question
            )
        );

      if (missingQuestion) {
        this.showReviewValidation(
          "Existe una respuesta obligatoria incompleta."
        );

        this.goToQuestion(
          missingQuestion.id
        );

        return null;
      }

      return {
        id:
          this.createAdmissionId(),
        tipoUsuario:
          this.userType,
        cuestionario:
          this.questionnaire?.id,
        version:
          this.questionnaire?.version,
        respuestas:
          this.answers,
        preguntasVisibles:
          this.visibleQuestions.map(
            (question) =>
              question.id
          ),
        creadoEn:
          new Date().toISOString(),
        estado:
          "preparada"
      };
    },



async submit() {

  const payload =
    this.prepareSubmission();

  if (!payload) {
    return;
  }

  const submitButton =
    this.elements.reviewSubmit;

  if (submitButton) {

    submitButton.disabled =
      true;

    submitButton.dataset.originalText =
      submitButton.textContent;

    submitButton.textContent =
      "Enviando admisión…";

  }

  this.setAionState(
    "thinking",
    "Estoy preparando la información y la documentación."
  );

  try {

    const documentsController =
      window.FalcoAdmisionDocumentos;

    let uploadedDocuments = [];

    if (
      documentsController &&
      typeof documentsController
        .uploadForAdmission ===
        "function"
    ) {

      uploadedDocuments =
        await documentsController
          .uploadForAdmission(
            payload.id
          );

    }

    payload.documentos =
      Array.isArray(
        uploadedDocuments
      )
        ? uploadedDocuments
        : [];

    payload.cantidadDocumentos =
      payload.documentos.length;

    payload.estado =
      "preparada";

    document.dispatchEvent(
      new CustomEvent(
        "falco:admission-ready",
        {
          detail: payload
        }
      )
    );

    localStorage.setItem(
      "falco_admision_pending",
      JSON.stringify(payload)
    );

    this.completed = true;

    this.saveState();

    this.setAionState(
      "completed",
      this.messages?.finalizacion?.[
        this.userType
      ]?.mensaje ||
      "La admisión quedó preparada correctamente."
    );

    window.location.href =
      `confirmacion.html?id=${encodeURIComponent(
        payload.id
      )}&tipo=${encodeURIComponent(
        this.userType
      )}`;

  } catch (error) {

    console.error(
      "No fue posible completar el envío:",
      error
    );

    this.setAionState(
      "error",
      "No fue posible completar el envío. Revisá la conexión e intentá nuevamente."
    );

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        submitButton.dataset
          .originalText ||
        "Enviar admisión";

    }

    this.showReviewValidation(
      "No fue posible cargar la documentación o preparar la admisión. La información continúa guardada en este dispositivo."
    );

  }

},



    showReviewValidation(message) {
      let notice =
        this.elements.review
          ?.querySelector(
            "[data-review-validation]"
          );

      if (!notice) {
        notice =
          document.createElement("div");

        notice.className =
          "admision-question__validation";

        notice.dataset.reviewValidation =
          "true";

        notice.innerHTML = `
          <span class="admision-question__validation-icon">!</span>
          <p></p>
        `;

        this.elements.reviewContent
          ?.before(notice);
      }

      notice.hidden = false;

      const paragraph =
        notice.querySelector("p");

      if (paragraph) {
        paragraph.textContent =
          message;
      }

      notice.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    },

    createAdmissionId() {
      const timestamp =
        Date.now().toString(36);

      const random =
        Math.random()
          .toString(36)
          .slice(2, 8);

      return `FALCO-ADM-${timestamp}-${random}`
        .toUpperCase();
    },

    /* =====================================================
       AION
    ===================================================== */

    renderAionQuestion(question) {
      const genericMessages =
        this.getGenericQuestionMessages(
          question.tipo
        );

      const message =
        question.aion ||
        genericMessages[0] ||
        "Respondé con tranquilidad para continuar.";

      this.setAionState(
        "speaking",
        message
      );
    },

    getGenericQuestionMessages(type) {
      const map = {
        radio:
          "seleccion_unica",

        checkbox:
          "seleccion_multiple",

        text:
          "texto_corto",

        email:
          "contacto",

        tel:
          "contacto",

        textarea:
          "texto_largo",

        grupo:
          "grupo_campos",

        date:
          "fecha"
      };

      const key =
        map[type] ||
        "texto_corto";

      return (
        this.messages?.preguntas?.[
          key
        ] || []
      );
    },

    setAionState(
      state,
      message
    ) {
      const stateData =
        this.messages?.estados?.[
          state
        ];

      this.setText(
        this.elements.aionLabel,
        stateData?.etiqueta ||
        "AION"
      );

      this.setText(
        this.elements.aionMessage,
        message ||
        stateData?.mensaje ||
        ""
      );

      const guide =
        this.elements.aionMessage
          ?.closest(".aion-guide");

      if (guide) {
        guide.dataset.state =
          state;
      }

      document.dispatchEvent(
        new CustomEvent(
          "falco:aion-state",
          {
            detail: {
              state,
              message:
                message ||
                stateData?.mensaje ||
                ""
            }
          }
        )
      );
    },

    /* =====================================================
       REINICIO
    ===================================================== */

    openRestartModal() {
      const modal =
        this.elements.restartModal;

      if (!modal) {
        const confirmed =
          window.confirm(
            "¿Querés eliminar las respuestas guardadas y comenzar nuevamente?"
          );

        if (confirmed) {
          this.confirmRestart();
        }

        return;
      }

      modal.hidden = false;

      document.body.classList.add(
        "has-modal-open"
      );

      this.announce(
        this.messages?.accesibilidad
          ?.modal_reinicio_abierto
      );
    },

    closeRestartModal() {
      if (
        this.elements.restartModal
      ) {
        this.elements.restartModal.hidden =
          true;
      }

      document.body.classList.remove(
        "has-modal-open"
      );

      this.announce(
        this.messages?.accesibilidad
          ?.modal_reinicio_cerrado
      );
    },

    confirmRestart() {
      this.resetState();
      this.closeRestartModal();

      this.refreshVisibleQuestions();

      this.currentIndex = 0;
      this.currentQuestionId =
        this.visibleQuestions[0]?.id ||
        null;

      this.renderCurrentQuestion();

      this.setAionState(
        "success",
        this.messages?.reinicio
          ?.confirmado?.[0] ||
        "El recorrido fue reiniciado."
      );
    },

    /* =====================================================
       EVENTOS
    ===================================================== */

    bindEvents() {
      this.elements.nextButton
        ?.addEventListener(
          "click",
          () => this.next()
        );

      this.elements.previousButton
        ?.addEventListener(
          "click",
          () => this.previous()
        );

      this.elements.reviewBack
        ?.addEventListener(
          "click",
          () =>
            this.backFromReview()
        );

      this.elements.reviewSubmit
  ?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.submit();
    }
  );

      this.elements.restartButton
        ?.addEventListener(
          "click",
          () =>
            this.openRestartModal()
        );

      this.elements.restartCancel
        ?.addEventListener(
          "click",
          () =>
            this.closeRestartModal()
        );

      this.elements.restartConfirm
        ?.addEventListener(
          "click",
          () =>
            this.confirmRestart()
        );

      this.elements.restartModal
        ?.querySelector(
          ".admision-modal__backdrop"
        )
        ?.addEventListener(
          "click",
          () =>
            this.closeRestartModal()
        );

      document.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Escape" &&
            this.elements.restartModal &&
            !this.elements.restartModal
              .hidden
          ) {
            this.closeRestartModal();
          }





         if (
  event.key === "Enter" &&
  (
    event.ctrlKey ||
    event.metaKey
  ) &&
  (
    !this.elements.review ||
    this.elements.review.hidden
  ) &&
  (
    !this.elements.restartModal ||
    this.elements.restartModal.hidden
  )
) {
  event.preventDefault();
  this.next();
}
        }
      );

      window.addEventListener(
        "online",
        () => {
          this.setAionState(
            "online",
            this.messages?.estados
              ?.online?.mensaje
          );
        }
      );

      window.addEventListener(
        "offline",
        () => {
          this.setAionState(
            "offline",
            this.messages?.estados
              ?.offline?.mensaje
          );
        }
      );
    },

    /* =====================================================
       INTERFAZ Y UTILIDADES
    ===================================================== */

    setLoading(active) {
      if (this.elements.loading) {
        this.elements.loading.hidden =
          !active;
      }

      if (
        this.elements.question
      ) {
        this.elements.question.hidden =
          active;
      }

      if (
        this.elements.navigation
      ) {
        this.elements.navigation.hidden =
          active;
      }
    },

    showFatalError(message) {
      this.setLoading(false);

      if (
        this.elements.question
      ) {
        this.elements.question.hidden =
          true;
      }

      if (
        this.elements.navigation
      ) {
        this.elements.navigation.hidden =
          true;
      }

      if (this.elements.error) {
        this.elements.error.hidden =
          false;
      }

      if (
        this.elements.errorMessage
      ) {
        this.setText(
          this.elements.errorMessage,
          message
        );
      } else if (
        this.elements.error
      ) {
        const paragraph =
          this.elements.error.querySelector(
            "p"
          );

        if (paragraph) {
          this.setText(
            paragraph,
            message
          );
        }
      }

      this.setAionState(
        "error",
        message
      );
    },

    setSaveStatus(
      text,
      state
    ) {
      const status =
        this.elements.saveStatus;

      if (status) {
        status.dataset.state =
          state;

        const textElement =
          status.querySelector(
            "[data-save-text]"
          );

        if (textElement) {
          this.setText(
            textElement,
            text
          );
        } else {
          const textNode =
            [...status.childNodes].find(
              (node) =>
                node.nodeType ===
                Node.TEXT_NODE &&
                node.textContent.trim()
            );

          if (textNode) {
            textNode.textContent =
              ` ${text}`;
          }
        }
      }

      this.setText(
        this.elements.savedText,
        text
      );
    },

    focusQuestionTitle() {
      if (
        !this.elements.title
      ) {
        return;
      }

      this.elements.title.setAttribute(
        "tabindex",
        "-1"
      );

      this.elements.title.focus({
        preventScroll: true
      });
    },

    announce(message) {
      if (!message) {
        return;
      }

      let region =
        document.getElementById(
          "admisionLiveRegion"
        );

      if (!region) {
        region =
          document.createElement("div");

        region.id =
          "admisionLiveRegion";

        region.setAttribute(
          "aria-live",
          "polite"
        );

        region.setAttribute(
          "aria-atomic",
          "true"
        );

        Object.assign(
          region.style,
          {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: "0"
          }
        );

        document.body.appendChild(
          region
        );
      }

      region.textContent = "";

      window.setTimeout(() => {
        region.textContent =
          message;
      }, 30);
    },

    setText(element, value) {
      if (element) {
        element.textContent =
          value ?? "";
      }
    },

    escapeHtml(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    },

    /* =====================================================
       API PÚBLICA
    ===================================================== */

    getCurrentQuestion() {
      return (
        this.visibleQuestions[
          this.currentIndex
        ] || null
      );
    },

    getAnswers() {
      return JSON.parse(
        JSON.stringify(
          this.answers
        )
      );
    },

    getSubmissionData() {
      return {
        tipoUsuario:
          this.userType,
        cuestionario:
          this.questionnaire?.id,
        respuestas:
          this.getAnswers()
      };
    }
  };

  window.FalcoAdmisionEngine =
    QuestionEngine;

  const boot = () => {
    QuestionEngine.init();
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
})();