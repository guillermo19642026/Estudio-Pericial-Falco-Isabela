document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const rules =
    window.GestionCausasImportadorReglas;

  const fileInput =
    document.getElementById("gcImportFile");

  const selectFileButton =
    document.getElementById("gcSelectImportFile");

  const changeFileButton =
    document.getElementById("gcChangeImportFile");

  const analyzeButton =
    document.getElementById("gcAnalyzeImportFile");

  const dropzone =
    document.getElementById("gcImportDropzone");

  const selectedFileBox =
    document.getElementById("gcImportSelectedFile");

  const fileNameElement =
    document.getElementById("gcImportFileName");

  const fileSizeElement =
    document.getElementById("gcImportFileSize");

  const progressSection =
    document.getElementById("gcImportProgressSection");

  const progressPercent =
    document.getElementById("gcImportProgressPercent");

  const progressBar =
    document.getElementById("gcImportProgressBar");

  const progressText =
    document.getElementById("gcImportProgressText");

  const resultsSection =
    document.getElementById("gcImportResultsSection");

  const caseList =
    document.getElementById("gcImportCaseList");

  const emptyState =
    document.getElementById("gcImportEmptyState");

  const casesCount =
    document.getElementById("gcImportCasesCount");

  const documentsCount =
    document.getElementById("gcImportDocumentsCount");

  const periciadosCount =
    document.getElementById("gcImportPericiadosCount");

  const reviewCount =
    document.getElementById("gcImportReviewCount");

  const visibleCount =
    document.getElementById("gcImportVisibleCount");

  const selectedCount =
    document.getElementById("gcImportSelectedCount");

  const searchInput =
    document.getElementById("gcImportSearch");

  const departmentFilter =
    document.getElementById("gcImportDepartment");

  const reviewFilter =
    document.getElementById("gcImportReviewFilter");

  const documentFilter =
    document.getElementById("gcImportDocumentFilter");

  const selectAllButton =
    document.getElementById("gcSelectAllImportCases");

  const clearSelectionButton =
    document.getElementById("gcClearImportSelection");

  const confirmButton =
    document.getElementById("gcConfirmMassImport");

  const toast =
    document.getElementById("gcToast");

  let selectedZipFile = null;
  let analyzedCases = [];
  let visibleCases = [];

  const showToast = (
    message,
    type = "success"
  ) => {
    if (!toast) {
      return;
    }

    toast.textContent = message;

    toast.className =
      `gc-toast is-visible gc-toast--${type}`;

    window.clearTimeout(showToast.timeout);

    showToast.timeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatFileSize = (bytes = 0) => {
    const size = Number(bytes || 0);

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
      return `${(
        size /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      size /
      (1024 * 1024 * 1024)
    ).toFixed(2)} GB`;
  };

  const updateProgress = (
    percent,
    message
  ) => {
    const safePercent = Math.min(
      Math.max(Number(percent || 0), 0),
      100
    );

    if (progressPercent) {
      progressPercent.textContent =
        `${Math.round(safePercent)}%`;
    }

    if (progressBar) {
      progressBar.style.width =
        `${safePercent}%`;
    }

    if (progressText) {
      progressText.textContent =
        message || "Procesando…";
    }
  };

  const setSelectedFile = (file) => {
    if (!file) {
      return;
    }

    const isZip =
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed" ||
      file.name.toLowerCase().endsWith(".zip");

    if (!isZip) {
      showToast(
        "Seleccione un archivo ZIP válido.",
        "error"
      );

      return;
    }

    selectedZipFile = file;

    if (fileNameElement) {
      fileNameElement.textContent =
        file.name;
    }

    if (fileSizeElement) {
      fileSizeElement.textContent =
        formatFileSize(file.size);
    }

    if (dropzone) {
      dropzone.hidden = true;
    }

    if (selectedFileBox) {
      selectedFileBox.hidden = false;
    }

    if (resultsSection) {
      resultsSection.hidden = true;
    }

    if (progressSection) {
      progressSection.hidden = true;
    }
  };

  const getPathSegments = (path = "") =>
    String(path)
      .replace(/\\/g, "/")
      .split("/")
      .map((segment) =>
        rules.cleanImportedName(segment)
      )
      .filter(Boolean);

  const getCommonRootName = (entries = []) => {
    const firstSegments = entries
      .map((entry) =>
        getPathSegments(entry.name)[0]
      )
      .filter(Boolean);

    if (!firstSegments.length) {
      return "";
    }

    const first = firstSegments[0];

    const allSame =
      firstSegments.every(
        (segment) => segment === first
      );

    return allSame ? first : "";
  };

  const buildCaseMap = (
    entries,
    rootFolderName
  ) => {
    const caseMap = new Map();

    entries.forEach((entry) => {
      if (entry.dir) {
        return;
      }

      if (
        rules.isHiddenPath(entry.name) ||
        rules.isTemporaryFile(entry.name)
      ) {
        return;
      }

      const segments =
        getPathSegments(entry.name);

      if (!segments.length) {
        return;
      }

      const rootOffset =
        rootFolderName &&
        segments[0] === rootFolderName
          ? 1
          : 0;

      const caseFolderName =
        rules.cleanImportedName(
          segments[rootOffset]
        );

      if (!caseFolderName) {
        return;
      }

      const caseFolderExtension =
        rules.getFileExtension(
          caseFolderName
        );

      if (caseFolderExtension) {
        return;
      }

      const fileName =
        rules.cleanImportedName(
          segments[segments.length - 1]
        );

      const relativeSegments =
        segments.slice(rootOffset + 1);

      const subfolderSegments =
        relativeSegments.slice(0, -1);

      if (!caseMap.has(caseFolderName)) {
        caseMap.set(caseFolderName, {
          id:
            window.crypto?.randomUUID?.() ||
            `import-case-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 9)}`,

          folderName:
            caseFolderName,

          rootFolderName,
          selected: true,
          documents: [],
          subfolders: new Map(),
          possiblePericiados: [],
          requiresReview: false,
          possibleDuplicate: false
        });
      }

      const caseRecord =
        caseMap.get(caseFolderName);

      const documentRecord =
        rules.createDocumentRecord({
          fileName,
          fullPath: entry.name,

          size:
            entry._data?.uncompressedSize ||
            entry._data?.length ||
            0,

          compressedSize:
            entry._data?.compressedSize ||
            0,

          modifiedAt:
            entry.date || null
        });

      /*
       * Referencia temporal al archivo interno.
       * Permite que el lector abra el ODT o DOCX
       * mientras analiza el ZIP.
       *
       * Esta propiedad se elimina antes de guardar
       * definitivamente la causa.
       */
      documentRecord.zipEntry = entry;

      documentRecord.subcarpeta =
        subfolderSegments.join("/");

      caseRecord.documents.push(
        documentRecord
      );

      subfolderSegments.forEach(
        (folderName, index) => {
          const folderPath =
            subfolderSegments
              .slice(0, index + 1)
              .join("/");

          if (
            !caseRecord.subfolders.has(
              folderPath
            )
          ) {
            caseRecord.subfolders.set(
              folderPath,
              {
                name:
                  rules.cleanImportedName(
                    folderName
                  ),

                path:
                  folderPath,

                depth:
                  index + 2,

                type:
                  rules.classifyFolder(
                    folderName
                  )
              }
            );
          }
        }
      );
    });

    return caseMap;
  };

    const buildImportedCase = async (
    rawCase,
    index,
    existingCases
  ) => {
    const searchableText = [
      rawCase.folderName,
      rawCase.rootFolderName,
      ...rawCase.documents.map(
        (document) =>
          `${document.nombre} ${document.rutaOriginal}`
      )
    ].join(" ");

    const detectedDepartment =
      rules.detectDepartment(
        rawCase.rootFolderName,
        rawCase.folderName,
        searchableText
      );

    const selectedDepartment =
      departmentFilter?.value || "";

    const department =
      selectedDepartment ||
      detectedDepartment.value ||
      "moron";

    const departmentName =
      department === "la-matanza"
        ? "La Matanza"
        : department === "moron"
          ? "Morón"
          : "Otro";

    const expedienteInicial =
      rules.detectCaseNumber(
        searchableText
      );

    const fueroInicial =
      rules.detectCourtType(
        searchableText
      );

    const possiblePericiados =
      Array.from(
        rawCase.subfolders.values()
      )
        .filter((folder) =>
          rules.detectPossiblePericiadoFolder(
            folder.name,
            folder.depth
          )
        )
        .map((folder) => ({
          id:
            window.crypto?.randomUUID?.() ||
            `periciado-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,

          nombre:
            rules.cleanImportedName(
              folder.name
            ),

          rutaOriginal:
            folder.path,

          estado:
            "Importado para revisión"
        }));

    const possibleDuplicate =
      existingCases.some((causa) => {
        if (
          expedienteInicial &&
          causa.expediente
        ) {
          return (
            rules.normalizeText(
              causa.expediente
            ) ===
            rules.normalizeText(
              expedienteInicial
            )
          );
        }

        return (
          rules.normalizeText(
            causa.caratula
          ) ===
          rules.normalizeText(
            rawCase.folderName
          )
        );
      });

    const reviewDocumentsCount =
      rawCase.documents.filter(
        (document) =>
          document.requiereRevision
      ).length;

    const classifiedDocumentsCount =
      rawCase.documents.length -
      reviewDocumentsCount;

    const hasRecognizedCoreDocument =
      rawCase.documents.some(
        (document) =>
          [
            "caratula",
            "demanda",
            "contestacion-demanda",
            "designacion",
            "aceptacion-cargo",
            "pericia",
            "impugnacion",
            "contestacion-impugnacion",
            "explicaciones",
            "honorarios",
            "carta-pago"
          ].includes(document.categoria)
      );

    const requiresReview =
      rawCase.documents.length === 0 ||
      classifiedDocumentsCount === 0 ||
      !hasRecognizedCoreDocument;

    const activeDocuments =
      rawCase.documents.filter(
        (document) =>
          document.categoria !==
          "archivo-no-clasificado"
      );

    const reader =
      window.GestionCausasImportadorLector;

    const extractor =
      window.GestionCausasImportadorExtractor;

      const parser =
  window.GestionCausasParserJuridico;

    const relevantDocuments =
      reader?.selectRelevantDocuments?.(
        activeDocuments
      ) || [];

    const extractedCaseData = {};

    const extractedLawyers = [];
    const extractedActions = [];
    const extractedFees = [];

    const lawyerKeys = new Set();
    const actionKeys = new Set();
    const feeKeys = new Set();

  const pushLawyer = (lawyer) => {
  if (!lawyer) {
    return;
  }

  const hasUsefulData =
    lawyer.nombreCompleto ||
    lawyer.email ||
    lawyer.telefono ||
    lawyer.matricula ||
    lawyer.domicilioElectronico ||
    lawyer.companiaRepresentada;

  if (!hasUsefulData) {
    return;
  }

  const normalizedEmail =
    rules.normalizeText(
      lawyer.email || ""
    );

  const normalizedElectronicAddress =
    rules.normalizeText(
      lawyer.domicilioElectronico || ""
    );

  const normalizedRegistration =
    rules.normalizeText(
      lawyer.matricula || ""
    );

  const normalizedName =
    rules.normalizeText(
      lawyer.nombreCompleto || ""
    );

  const existingLawyer =
    extractedLawyers.find(
      (item) => {
        const sameEmail =
          normalizedEmail &&
          rules.normalizeText(
            item.email || ""
          ) === normalizedEmail;

        const sameElectronicAddress =
          normalizedElectronicAddress &&
          rules.normalizeText(
            item.domicilioElectronico || ""
          ) ===
            normalizedElectronicAddress;

        const sameRegistration =
          normalizedRegistration &&
          rules.normalizeText(
            item.matricula || ""
          ) === normalizedRegistration;

        const sameNameAndSide =
          normalizedName &&
          item.parte === lawyer.parte &&
          rules.normalizeText(
            item.nombreCompleto || ""
          ) === normalizedName;

        return (
          sameEmail ||
          sameElectronicAddress ||
          sameRegistration ||
          sameNameAndSide
        );
      }
    );

  if (existingLawyer) {
    existingLawyer.nombreCompleto =
      existingLawyer.nombreCompleto ||
      lawyer.nombreCompleto ||
      "";

    existingLawyer.matricula =
      existingLawyer.matricula ||
      lawyer.matricula ||
      "";

    existingLawyer.colegio =
      existingLawyer.colegio ||
      lawyer.colegio ||
      "";

    existingLawyer.telefono =
      existingLawyer.telefono ||
      lawyer.telefono ||
      "";

    existingLawyer.whatsapp =
      existingLawyer.whatsapp ||
      lawyer.whatsapp ||
      "";

    existingLawyer.email =
      existingLawyer.email ||
      lawyer.email ||
      "";

    existingLawyer.domicilioElectronico =
      existingLawyer.domicilioElectronico ||
      lawyer.domicilioElectronico ||
      "";

    existingLawyer.estudioJuridico =
      existingLawyer.estudioJuridico ||
      lawyer.estudioJuridico ||
      "";

    existingLawyer.companiaRepresentada =
      existingLawyer.companiaRepresentada ||
      lawyer.companiaRepresentada ||
      "";

    existingLawyer.observaciones =
      existingLawyer.observaciones ||
      lawyer.observaciones ||
      "";

    return;
  }

  extractedLawyers.push({
    id:
      window.crypto?.randomUUID?.() ||
      `abogado-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

    parte:
      lawyer.parte || "",

    nombreCompleto:
      lawyer.nombreCompleto || "",

    matricula:
      lawyer.matricula || "",

    colegio:
      lawyer.colegio || "",

    telefono:
      lawyer.telefono || "",

    whatsapp:
      lawyer.whatsapp || "",

    email:
      lawyer.email || "",

    domicilioElectronico:
      lawyer.domicilioElectronico || "",

    estudioJuridico:
      lawyer.estudioJuridico || "",

    companiaRepresentada:
      lawyer.companiaRepresentada || "",

    observaciones:
      lawyer.observaciones || ""
  });
};

    const pushAction = (action) => {
      if (!action) {
        return;
      }

      const key =
        rules.normalizeText(
          [
            action.tipo,
            action.titulo,
            action.fecha,
            action.documentoId
          ]
            .filter(Boolean)
            .join("|")
        );

      if (!key || actionKeys.has(key)) {
        return;
      }

      actionKeys.add(key);
      extractedActions.push(action);
    };

    const pushFee = (fee) => {
      if (!fee) {
        return;
      }

      const key =
        rules.normalizeText(
          [
            fee.tipo,
            fee.fecha,
            fee.monto,
            fee.descripcion
          ]
            .filter(Boolean)
            .join("|")
        );

      if (!key || feeKeys.has(key)) {
        return;
      }

      feeKeys.add(key);
      extractedFees.push(fee);
    };

    for (const document of relevantDocuments) {
      if (!document.zipEntry) {
        continue;
      }

      const readResult =
        await reader?.readDocument?.({
          zipEntry:
            document.zipEntry,

          fileName:
            document.nombre
        });

      if (
        !readResult?.success ||
        !readResult.text
      ) {
        document.lecturaAutomatica =
          false;

        document.errorLectura =
          readResult?.error || "";

        continue;
      }

      const extractedText =
        String(readResult.text)
          .replace(/\u0000/g, "")
          .trim();

      document.textoExtraido =
        extractedText.slice(0, 25000);

      document.lecturaAutomatica =
        true;

      document.formatoLectura =
        readResult.format || "";

     if (
  [
    "caratula",
    "demanda",
    "contestacion-demanda"
  ].includes(document.categoria)
) {

  const parsedDocument =
    parser?.parseDocument?.({
      text: extractedText,
      category: document.categoria
    });

  const caseData =
    parsedDocument?.causa || {};

  Object.entries(
    caseData
  ).forEach(([key, value]) => {

    if (
      value &&
      !extractedCaseData[key]
    ) {

      extractedCaseData[key] =
        value;

    }

  });

  document.parserJuridico = {
    procesado: true,
    fecha:
      parsedDocument?.fecha || "",
    categoria:
      document.categoria
  };

if (
  document.categoria === "aceptacion-cargo" &&
  parsedDocument?.fecha &&
  !extractedCaseData.fechaAceptacion
) {
  extractedCaseData.fechaAceptacion =
    parsedDocument.fecha;
}

if (
  (
    document.categoria === "designacion" ||
    document.categoria === "apertura-prueba"
  ) &&
  parsedDocument?.fecha &&
  !extractedCaseData.fechaDesignacion
) {
  extractedCaseData.fechaDesignacion =
    parsedDocument.fecha;
}


}

      const normalizedFileName =
        rules.normalizeText(
          document.nombre
        );

if (
  [
    "demanda",
    "contestacion-demanda"
  ].includes(document.categoria)
) {

  const side =
    document.categoria === "demanda"
      ? "actora"
      : "demandada";

  const parsedLawyer =
    parser?.parseDocument?.({
      text: extractedText,
      category: document.categoria,
      side
    })?.abogado;

  if (
    parsedLawyer &&
    (
      parsedLawyer.nombreCompleto ||
      parsedLawyer.email ||
      parsedLawyer.domicilioElectronico ||
      parsedLawyer.matricula ||
      parsedLawyer.companiaRepresentada
    )
  ) {
    pushLawyer(parsedLawyer);
  }

}


    const looksLikeActorLawyer =
  document.categoria ===
    "abogado-actora" ||
  normalizedFileName.includes(
    "abogado parte actora"
  ) ||
  normalizedFileName.includes(
    "abogada parte actora"
  ) ||
  normalizedFileName.includes(
    "letrado parte actora"
  );

const looksLikeDefendantLawyer =
  document.categoria ===
    "abogado-demandada" ||
  normalizedFileName.includes(
    "abogado parte demandada"
  ) ||
  normalizedFileName.includes(
    "abogada parte demandada"
  ) ||
  normalizedFileName.includes(
    "letrado parte demandada"
  );

      if (looksLikeActorLawyer) {
        pushLawyer(
          extractor?.extractLawyer?.(
            extractedText,
            "actora"
          )
        );
      }

      if (looksLikeDefendantLawyer) {
        pushLawyer(
          extractor?.extractLawyer?.(
            extractedText,
            "demandada"
          )
        );
      }

     if (
  [
    "designacion",
    "aceptacion-cargo",
    "apertura-prueba",
    "fecha-entrevista",
    "prorroga",
    "impugnacion",
    "contestacion-impugnacion",
    "explicaciones",
    "traslado",
    "providencia",
    "audiencia",
    "sentencia"
  ].includes(document.categoria)
) {
        pushAction(
          extractor?.extractAction?.(
            extractedText,
            document
          )
        );
      }

      if (
        [
          "anticipo-gastos",
          "carta-pago",
          "honorarios"
        ].includes(
          document.categoria
        )
      ) {
        pushFee(
          extractor?.extractFeeMovement?.(
            extractedText,
            document
          )
        );
      }
    }

    const expedienteFinal =
      extractedCaseData.expediente ||
      expedienteInicial ||
      "";

    const year =
      rules.detectYear(
        expedienteFinal ||
        searchableText
      );

    const codemandadasMap =
      new Map();

    extractedLawyers
      .filter(
        (lawyer) =>
          lawyer.parte ===
            "demandada" &&
          lawyer.companiaRepresentada
      )
      .forEach((lawyer) => {
        const companyName =
          String(
            lawyer.companiaRepresentada ||
            ""
          ).trim();

        const companyKey =
          rules.normalizeText(
            companyName
          );

        if (
          !companyName ||
          codemandadasMap.has(
            companyKey
          )
        ) {
          return;
        }

        codemandadasMap.set(
          companyKey,
          {
            id:
              window.crypto?.randomUUID?.() ||
              `codemandada-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

            nombre:
              companyName,

            tipo:
              "empresa",

            documento:
              "",

            telefono:
              "",

            email:
              "",

            domicilio:
              "",

            observaciones:
              "Detectada automáticamente desde los datos del abogado de la parte demandada."
          }
        );
      });

    const safeDocuments =
      activeDocuments.map(
        (document) => {
          const {
            zipEntry,
            ...safeDocument
          } = document;

          return safeDocument;
        }
      );

    return {
      id:
        rawCase.id,

      folderName:
        rules.cleanImportedName(
          rawCase.folderName
        ),

      selected:
        true,

      importStatus:
        possibleDuplicate
          ? "duplicate"
          : requiresReview
            ? "review"
            : "ready",

      possibleDuplicate,
      requiresReview,

      causa: {
        id:
          window.crypto?.randomUUID?.() ||
          `causa-importada-${Date.now()}-${index}`,

        caratula:
          extractedCaseData.caratula ||
          rules.cleanImportedName(
            rawCase.folderName
          ),

        expediente:
          expedienteFinal,

        codigoInterno:
          rules.buildInternalCode({
            department,
            year,
            index: index + 1
          }),

        departamento:
          department,

        departamentoNombre:
          departmentName,

        fuero:
          extractedCaseData.fuero ||
          fueroInicial ||
          "",

        organismo:
          extractedCaseData.organismo ||
          "",

        juzgado:
          extractedCaseData.juzgado ||
          "",

        secretaria:
          extractedCaseData.secretaria ||
          "",

        tipoProceso:
          extractedCaseData.tipoProceso ||
          "",

fechaDesignacion:
  extractedCaseData.fechaDesignacion ||
  "",

fechaAceptacion:
  extractedCaseData.fechaAceptacion ||
  "",


        actor:
          extractedCaseData.actor ||
          "",

        demandado:
          extractedCaseData.demandado ||
          "",

        partes: {
          actora: {
            nombre:
              extractedCaseData.actor ||
              "",

            documento:
              "",

            telefono:
              "",

            email:
              "",

            domicilio:
              ""
          },

          demandada: {
            nombre:
              extractedCaseData.demandado ||
              "",

            documento:
              "",

            telefono:
              "",

            email:
              "",

            domicilio:
              ""
          }
        },

        abogados:
          extractedLawyers,

        codemandadas:
          Array.from(
            codemandadasMap.values()
          ),

        periciados:
          possiblePericiados,

        documentos:
          safeDocuments,

        actuaciones:
          extractedActions,

        honorarios:
          extractedFees,
seguimiento: {

  estadoDesignacion:
    activeDocuments.some(
      (document) =>
        document.categoria === "designacion" ||
        document.categoria === "apertura-prueba"
    )
      ? "registrada"
      : "sin-cargar",

  estadoAceptacion:
    activeDocuments.some(
      (document) =>
        document.categoria === "aceptacion-cargo"
    )
      ? "registrada"
      : "sin-cargar",

  estadoAnticipo:
    extractedFees.some(
      (item) =>
        item.tipo === "anticipo-solicitado"
    )
      ? "solicitado"
      : activeDocuments.some(
            (document) =>
              document.categoria === "anticipo-gastos"
          )
        ? "registrado"
        : "sin-solicitar",

  estadoEntrevista:
    activeDocuments.some(
      (document) =>
        document.categoria === "fecha-entrevista"
    )
      ? "registrada"
      : "sin-informacion",

  estadoPericia:
    activeDocuments.some(
      (document) =>
        document.categoria === "pericia"
    )
      ? "presentada"
      : "pendiente",

  estadoImpugnacion:
    activeDocuments.some(
      (document) =>
        document.categoria === "impugnacion"
    )
      ? "recibida"
      : "ninguna",

  estadoContestacion:
    activeDocuments.some(
      (document) =>
        document.categoria === "contestacion-impugnacion"
    )
      ? "presentada"
      : "ninguna",

  estadoHonorarios:
    extractedFees.some(
      (item) =>
        item.estado === "cobrado"
    )
      ? "cobrado"
      : extractedFees.some(
            (item) =>
              item.estado === "regulado"
          )
        ? "regulado"
        : activeDocuments.some(
              (document) =>
                document.categoria === "carta-pago" ||
                document.categoria === "honorarios"
            )
          ? "registrado"
          : "sin-regular",

  estadoCobro:
    activeDocuments.some(
      (document) =>
        document.categoria === "carta-pago"
    )
      ? "cobrado"
      : "pendiente"

},

        estadoGeneral:
          rules.detectCaseStatus(
            activeDocuments
          ),

        proximoPaso:
          rules.detectNextStep(
            activeDocuments
          ),

        proximoVencimiento:
          "",

        observaciones:
          `Importada desde la carpeta "${rules.cleanImportedName(
            rawCase.folderName
          )}". Datos extraídos automáticamente de la documentación disponible. Revisar antes de utilizar en presentaciones judiciales.`,

        activa:
          true,

        origen:
          "importacion-masiva-enriquecida",

        carpetaOrigen:
          rules.cleanImportedName(
            rawCase.folderName
          ),

        archivoOrigen:
          selectedZipFile?.name || "",

        fechaCreacion:
          new Date().toISOString(),

        fechaActualizacion:
          new Date().toISOString()
      },

      documentsCount:
        rawCase.documents.length,

      reviewDocumentsCount,

      periciadosCount:
        possiblePericiados.length
    };
  };

    const analyzeZip = async () => {
    if (!selectedZipFile) {
      showToast(
        "Seleccione primero un archivo ZIP.",
        "error"
      );

      return;
    }

    if (!window.JSZip) {
      showToast(
        "No se pudo cargar JSZip.",
        "error"
      );

      return;
    }

    try {
      if (progressSection) {
        progressSection.hidden = false;
      }

      if (resultsSection) {
        resultsSection.hidden = true;
      }

      if (analyzeButton) {
        analyzeButton.disabled = true;
      }

      updateProgress(
        5,
        "Abriendo el archivo comprimido…"
      );

      const zip =
        await window.JSZip.loadAsync(
          selectedZipFile
        );

      updateProgress(
        18,
        "Leyendo carpetas y archivos…"
      );

      const entries =
        Object.values(zip.files);

      const usableEntries =
        entries.filter(
          (entry) =>
            !rules.isHiddenPath(
              entry.name
            ) &&
            !rules.isTemporaryFile(
              entry.name
            )
        );

      const rootFolderName =
        getCommonRootName(
          usableEntries
        );

      updateProgress(
        30,
        "Detectando las causas…"
      );

      const caseMap =
        buildCaseMap(
          usableEntries,
          rootFolderName
        );

      const rawCases =
        Array.from(
          caseMap.values()
        );

      const existingCases =
        window.GestionCausasData
          ?.getCases?.() || [];

      analyzedCases = [];

      const totalCases =
        rawCases.length;

      for (
        let index = 0;
        index < totalCases;
        index += 1
      ) {
        const rawCase =
          rawCases[index];

        const progressBase =
          totalCases > 0
            ? index / totalCases
            : 0;

        const progressValue =
          35 +
          progressBase * 50;

        updateProgress(
          progressValue,
          `Leyendo documentos de ${
            index + 1
          } de ${totalCases}: ${
            rawCase.folderName
          }`
        );

        const importedCase =
          await buildImportedCase(
            rawCase,
            index,
            existingCases
          );

        analyzedCases.push(
          importedCase
        );

        /*
         * Pequeña pausa para permitir que
         * el navegador actualice la barra
         * y no quede bloqueada la interfaz.
         */
        if (
          index > 0 &&
          index % 5 === 0
        ) {
          await new Promise(
            (resolve) =>
              window.setTimeout(
                resolve,
                0
              )
          );
        }
      }

      updateProgress(
        88,
        "Preparando la revisión de los resultados…"
      );

      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            150
          )
      );

      updateStatistics();
      applyFilters();

      if (resultsSection) {
        resultsSection.hidden = false;
      }

      updateProgress(
        100,
        "Análisis enriquecido finalizado."
      );

      window.setTimeout(() => {
        resultsSection?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 150);

      showToast(
        `Se detectaron ${analyzedCases.length} causa(s) y se analizaron sus documentos compatibles.`
      );
    } catch (error) {
      console.error(
        "Error al analizar el ZIP:",
        error
      );

      showToast(
        "No se pudo analizar el archivo ZIP.",
        "error"
      );

      updateProgress(
        0,
        "El análisis no pudo completarse."
      );
    } finally {
      if (analyzeButton) {
        analyzeButton.disabled = false;
      }
    }
  };

  const updateStatistics = () => {
    const totalDocuments =
      analyzedCases.reduce(
        (sum, item) =>
          sum +
          Number(
            item.documentsCount || 0
          ),
        0
      );

    const totalPericiados =
      analyzedCases.reduce(
        (sum, item) =>
          sum +
          Number(
            item.periciadosCount || 0
          ),
        0
      );

    const totalReview =
      analyzedCases.filter(
        (item) =>
          item.requiresReview ||
          item.possibleDuplicate
      ).length;

    if (casesCount) {
      casesCount.textContent =
        String(
          analyzedCases.length
        );
    }

    if (documentsCount) {
      documentsCount.textContent =
        String(
          totalDocuments
        );
    }

    if (periciadosCount) {
      periciadosCount.textContent =
        String(
          totalPericiados
        );
    }

    if (reviewCount) {
      reviewCount.textContent =
        String(
          totalReview
        );
    }
  };

  const getImportStatusLabel = (
    item
  ) => {
    if (item.possibleDuplicate) {
      return "Posible duplicada";
    }

    if (item.requiresReview) {
      return "Requiere revisión";
    }

    return "Lista para importar";
  };

  const getImportStatusClass = (
    item
  ) => {
    if (
      item.possibleDuplicate ||
      item.requiresReview
    ) {
      return "gc-status--warning";
    }

    return "gc-status--active";
  };

  const renderDocumentsPreview = (
    documents = []
  ) => {
    const visibleDocuments =
      documents.slice(0, 6);

    const rows =
      visibleDocuments
        .map(
          (document) => `
            <li>

              <span>
                ${escapeHtml(
                  document.categoriaNombre ||
                    "Sin categoría"
                )}
              </span>

              <strong>
                ${escapeHtml(
                  document.nombre ||
                    "Documento"
                )}
              </strong>

              ${
                document.lecturaAutomatica
                  ? `
                    <small class="gc-import-document-read">
                      Leído
                    </small>
                  `
                  : document.requiereRevision
                    ? `
                      <small>
                        Revisar
                      </small>
                    `
                    : ""
              }

            </li>
          `
        )
        .join("");

    const remaining =
      documents.length -
      visibleDocuments.length;

    return `
      <ul class="gc-import-document-preview">

        ${rows}

        ${
          remaining > 0
            ? `
              <li class="gc-import-document-preview__more">
                +${remaining} documento(s) más
              </li>
            `
            : ""
        }

      </ul>
    `;
  };

  const renderCases = (cases) => {
    visibleCases = cases;

    if (
      !caseList ||
      !emptyState
    ) {
      return;
    }

    if (visibleCount) {
      visibleCount.textContent =
        String(cases.length);
    }

    if (!cases.length) {
      caseList.innerHTML = "";
      emptyState.hidden = false;

      updateSelectedCount();
      return;
    }

    emptyState.hidden = true;

    caseList.innerHTML = cases
      .map((item) => {
        const lawyersCount =
          Array.isArray(
            item.causa.abogados
          )
            ? item.causa.abogados.length
            : 0;

        const actionsCount =
          Array.isArray(
            item.causa.actuaciones
          )
            ? item.causa.actuaciones.length
            : 0;

        const feesCount =
          Array.isArray(
            item.causa.honorarios
          )
            ? item.causa.honorarios.length
            : 0;

        const extractedFields = [
          item.causa.expediente,
          item.causa.organismo,
          item.causa.actor,
          item.causa.demandado
        ].filter(Boolean).length;

        return `
          <article
            class="gc-import-case-card ${
              item.selected
                ? "is-selected"
                : ""
            }"
            data-import-case-id="${escapeHtml(
              item.id
            )}"
          >

            <div class="gc-import-case-card__selection">

              <input
                type="checkbox"
                class="gc-import-case-checkbox"
                data-case-id="${escapeHtml(
                  item.id
                )}"
                ${
                  item.selected
                    ? "checked"
                    : ""
                }
                aria-label="Seleccionar causa"
              >

            </div>

            <div class="gc-import-case-card__content">

              <div class="gc-import-case-card__top">

                <div>

                  <span class="gc-panel__eyebrow">
                    Carpeta detectada
                  </span>

                  <h4>
                    ${escapeHtml(
                      item.folderName
                    )}
                  </h4>

                </div>

                <span
                  class="gc-status ${getImportStatusClass(
                    item
                  )}"
                >
                  ${escapeHtml(
                    getImportStatusLabel(
                      item
                    )
                  )}
                </span>

              </div>

              <div class="gc-import-case-card__meta">

                <span>
                  <strong>Expediente:</strong>
                  ${escapeHtml(
                    item.causa.expediente ||
                      "No detectado"
                  )}
                </span>

                <span>
                  <strong>Departamento:</strong>
                  ${escapeHtml(
                    item.causa
                      .departamentoNombre ||
                      "Sin detectar"
                  )}
                </span>

                <span>
                  <strong>Fuero:</strong>
                  ${escapeHtml(
                    item.causa.fuero ||
                      "No detectado"
                  )}
                </span>

                <span>
                  <strong>Organismo:</strong>
                  ${escapeHtml(
                    item.causa.organismo ||
                      "No detectado"
                  )}
                </span>

                <span>
                  <strong>Documentos:</strong>
                  ${item.documentsCount}
                </span>

                <span>
                  <strong>Periciados posibles:</strong>
                  ${item.periciadosCount}
                </span>

                <span>
                  <strong>Abogados detectados:</strong>
                  ${lawyersCount}
                </span>

                <span>
                  <strong>Actuaciones:</strong>
                  ${actionsCount}
                </span>

                <span>
                  <strong>Movimientos económicos:</strong>
                  ${feesCount}
                </span>

                <span>
                  <strong>Datos extraídos:</strong>
                  ${extractedFields}/4
                </span>

                <span>
                  <strong>Documentos para revisar:</strong>
                  ${item.reviewDocumentsCount}
                </span>

              </div>

              ${renderDocumentsPreview(
                item.causa.documentos
              )}

            </div>

          </article>
        `;
      })
      .join("");

    updateSelectedCount();
  };

  const updateSelectedCount = () => {
    const totalSelected =
      analyzedCases.filter(
        (item) => item.selected
      ).length;

    if (selectedCount) {
      selectedCount.textContent =
        String(
          totalSelected
        );
    }

    if (confirmButton) {
      confirmButton.disabled =
        totalSelected === 0;
    }
  };

  const getSearchableText = (item) =>
    rules.normalizeText(
      [
        item.folderName,
        item.causa.expediente,
        item.causa.caratula,
        item.causa.departamentoNombre,
        item.causa.fuero,
        item.causa.organismo,
        item.causa.actor,
        item.causa.demandado,

        ...(item.causa.abogados || [])
          .map(
            (lawyer) =>
              [
                lawyer.nombreCompleto,
                lawyer.email,
                lawyer.telefono,
                lawyer.companiaRepresentada
              ]
                .filter(Boolean)
                .join(" ")
          ),

        ...item.causa.documentos.map(
          (document) =>
            `${document.nombre} ${document.categoriaNombre}`
        )
      ]
        .filter(Boolean)
        .join(" ")
    );

  const applyFilters = () => {
    const searchValue =
      rules.normalizeText(
        searchInput?.value
      );

    const departmentValue =
      departmentFilter?.value || "";

    const reviewValue =
      reviewFilter?.value || "";

    const documentValue =
      documentFilter?.value || "";

    const filtered =
      analyzedCases.filter(
        (item) => {
          const matchesSearch =
            !searchValue ||
            getSearchableText(
              item
            ).includes(
              searchValue
            );

          const matchesDepartment =
            !departmentValue ||
            item.causa.departamento ===
              departmentValue;

          const matchesReview =
            !reviewValue ||
            item.importStatus ===
              reviewValue;

          const matchesDocuments =
            !documentValue ||
            (
              documentValue ===
                "with-documents" &&
              item.documentsCount > 0
            ) ||
            (
              documentValue ===
                "without-documents" &&
              item.documentsCount === 0
            ) ||
            (
              documentValue ===
                "with-periciados" &&
              item.periciadosCount > 0
            );

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesReview &&
            matchesDocuments
          );
        }
      );

    renderCases(
      filtered
    );
  };

    const confirmImport = () => {
    const selectedCases =
      analyzedCases.filter(
        (item) => item.selected
      );

    if (!selectedCases.length) {
      showToast(
        "Seleccione al menos una causa.",
        "error"
      );

      return;
    }

    const currentCases =
      window.GestionCausasData
        ?.getCases?.() || [];

    let imported = 0;
    let skipped = 0;

    selectedCases.forEach((item) => {
      const duplicate =
        currentCases.some((causa) => {
          if (
            item.causa.expediente &&
            causa.expediente
          ) {
            return (
              rules.normalizeText(
                item.causa.expediente
              ) ===
              rules.normalizeText(
                causa.expediente
              )
            );
          }

          return (
            rules.normalizeText(
              item.causa.caratula
            ) ===
            rules.normalizeText(
              causa.caratula
            )
          );
        });

      if (duplicate) {
        skipped += 1;
        return;
      }

      const saved =
        window.GestionCausasData
          ?.addCase?.(
            item.causa
          );

      if (saved) {
        currentCases.push(
          item.causa
        );

        imported += 1;
      } else {
        skipped += 1;
      }
    });

    showToast(
      `Importación finalizada: ${imported} causa(s) guardada(s) y ${skipped} omitida(s).`
    );

    if (imported > 0) {
      const importedDepartment =
        selectedCases[0]?.causa
          ?.departamento || "";

      const destination =
        importedDepartment ===
        "la-matanza"
          ? "../causas/causas.html?departamento=la-matanza"
          : "../causas/causas.html?departamento=moron";

      window.setTimeout(() => {
        window.location.href =
          destination;
      }, 1600);
    }
  };

  selectFileButton?.addEventListener(
    "click",
    () => {
      fileInput?.click();
    }
  );

  changeFileButton?.addEventListener(
    "click",
    () => {
      fileInput?.click();
    }
  );

  fileInput?.addEventListener(
    "change",
    (event) => {
      const file =
        event.target.files?.[0];

      if (file) {
        setSelectedFile(file);
      }
    }
  );

  analyzeButton?.addEventListener(
    "click",
    analyzeZip
  );

  dropzone?.addEventListener(
    "dragover",
    (event) => {
      event.preventDefault();

      dropzone.classList.add(
        "is-dragging"
      );
    }
  );

  dropzone?.addEventListener(
    "dragleave",
    () => {
      dropzone.classList.remove(
        "is-dragging"
      );
    }
  );

  dropzone?.addEventListener(
    "drop",
    (event) => {
      event.preventDefault();

      dropzone.classList.remove(
        "is-dragging"
      );

      const file =
        event.dataTransfer
          ?.files?.[0];

      if (file) {
        setSelectedFile(file);
      }
    }
  );

  caseList?.addEventListener(
    "change",
    (event) => {
      const checkbox =
        event.target.closest(
          ".gc-import-case-checkbox"
        );

      if (!checkbox) {
        return;
      }

      const caseId =
        checkbox.dataset.caseId;

      const item =
        analyzedCases.find(
          (caseItem) =>
            caseItem.id === caseId
        );

      if (!item) {
        return;
      }

      item.selected =
        checkbox.checked;

      checkbox
        .closest(
          ".gc-import-case-card"
        )
        ?.classList.toggle(
          "is-selected",
          item.selected
        );

      updateSelectedCount();
    }
  );

  selectAllButton?.addEventListener(
    "click",
    () => {
      visibleCases.forEach(
        (item) => {
          item.selected = true;
        }
      );

      renderCases(
        visibleCases
      );
    }
  );

  clearSelectionButton?.addEventListener(
    "click",
    () => {
      analyzedCases.forEach(
        (item) => {
          item.selected = false;
        }
      );

      renderCases(
        visibleCases
      );
    }
  );

  confirmButton?.addEventListener(
    "click",
    confirmImport
  );

  [
    searchInput,
    departmentFilter,
    reviewFilter,
    documentFilter
  ].forEach((element) => {
    if (!element) {
      return;
    }

    const eventName =
      element.tagName === "INPUT"
        ? "input"
        : "change";

    element.addEventListener(
      eventName,
      applyFilters
    );
  });

  console.log(
    "Gestión de Causas FALCO® Importador Masivo Enriquecido Ready"
  );
});