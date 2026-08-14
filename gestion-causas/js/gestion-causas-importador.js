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

  const destinationFilter =
    document.getElementById("gcImportDestination");

  const destinationMessage =
    document.getElementById("gcImportDestinationMessage");

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

 const importSourceText =
  rules.normalizeText(
    [
      destinationFilter?.value || "",
      selectedZipFile?.name || "",
      rootFolderName || ""
    ].join(" ")
  );

const importDestination =
  importSourceText.includes("pericia") ||
  importSourceText.includes("conteste")
    ? "pericias"
    : importSourceText.includes("cobrada")
      ? "cobradas"
      : destinationFilter?.value ||
        "causas";


  /* =====================================================
     MODO ESPECIAL: PERICIAS Y CONTESTES
  ===================================================== */
if (
  importDestination ===
  "pericias"
) {

  const getProfessionalRecordName = (
    fileName = ""
  ) => {
    let name =
      rules.cleanImportedName(
        fileName
      );

    name = name.replace(
      /\.[a-z0-9]{2,6}$/i,
      ""
    );

    name = name.replace(
      /\([^)]*\)/g,
      " "
    );

    name = name.replace(
      /\bJCC\b.*$/i,
      " "
    );

    name = name.replace(
      /\bTT\b.*$/i,
      " "
    );

    name = name.replace(
      /\bJUZGADO\s+(?:CIVIL|LABORAL|DEL\s+TRABAJO).*$/i,
      " "
    );

    name = name.replace(
      /\bTRIBUNAL\s+(?:DEL|DE)\s+TRABAJO.*$/i,
      " "
    );

    name = name.replace(
      /\bPERICIA(?:\s+PSICOLOGICA)?\b.*$/i,
      " "
    );

    name = name.replace(
      /\bCONTESTE\b.*$/i,
      " "
    );

    name = name.replace(
      /\bCONTESTACION\b.*$/i,
      " "
    );

    name = name.replace(
      /\bIMPUGNACION\b.*$/i,
      " "
    );

    name = name.replace(
      /\bEXPLICACIONES\b.*$/i,
      " "
    );

    name = name
      .replace(
        /[_\-–—]+/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

    return (
      name ||
      "Registro sin identificar"
    );
  };


  entries.forEach((entry) => {
    if (entry.dir) {
      return;
    }

    if (
      rules.isHiddenPath(
        entry.name
      ) ||
      rules.isTemporaryFile(
        entry.name
      )
    ) {
      return;
    }

    const segments =
      getPathSegments(
        entry.name
      );

    const rootOffset =
      rootFolderName &&
      segments[0] === rootFolderName
        ? 1
        : 0;

    const logicalSegments =
      segments.slice(
        rootOffset
      );

   if (
  logicalSegments.length < 1
) {
  return;
}

    /*
     * Primer nivel:
     * CIVIL / TRABAJO
     */
    const areaFolder = "";

    const normalizedArea =
      rules.normalizeText(
        areaFolder
      );

    const fuero =
      normalizedArea.includes("civil")
        ? "Civil"
        : normalizedArea.includes("trabajo")
          ? "Laboral"
          : "";

    /*
     * Segundo nivel opcional:
     * SI / NO
     */
    let damageFolder = "";

    if (
      logicalSegments.length >= 3
    ) {
      const possibleDamage =
        rules.cleanImportedName(
          logicalSegments[1] || ""
        );

      const normalizedDamage =
        rules.normalizeText(
          possibleDamage
        );

      if (
        normalizedDamage === "si" ||
        normalizedDamage === "no"
      ) {
        damageFolder =
          possibleDamage;
      }
    }

    const normalizedDamageFolder =
      rules.normalizeText(
        damageFolder
      );

    const danioPsiquico =
      normalizedDamageFolder === "si"
        ? "con-danio"
        : normalizedDamageFolder === "no"
          ? "sin-danio"
          : "sin-determinar";

    /*
     * El último elemento siempre
     * es el archivo.
     */
    const fileName =
      rules.cleanImportedName(
        logicalSegments[
          logicalSegments.length - 1
        ]
      );

    if (!fileName) {
      return;
    }

    const professionalName =
      getProfessionalRecordName(
        fileName
      );

const normalizedFileName =
  rules.normalizeText(
    fileName
  );

const departamentoDetectado =
  normalizedFileName.includes(
    "matanza"
  )
    ? "la-matanza"
    : normalizedFileName.includes(
        "moron"
      )
      ? "moron"
      : "";


    if (!professionalName) {
      return;
    }

    /*
     * Agrupamos Pericia + Conteste
     * de una misma persona.
     */
    const caseMapKey =
      `${normalizedArea}::${rules.normalizeText(
        professionalName
      )}`;

    if (
      !caseMap.has(
        caseMapKey
      )
    ) {
      caseMap.set(
        caseMapKey,
        {
          id:
            window.crypto
              ?.randomUUID?.() ||
            `pericia-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 9)}`,

          folderName:
            professionalName,

          rootFolderName:
            [
              rootFolderName,
              areaFolder,
              damageFolder
            ]
              .filter(Boolean)
              .join(" "),

          selected:
            true,

          documents:
            [],

          subfolders:
            new Map(),

          possiblePericiados:
            [],

          requiresReview:
            false,

          possibleDuplicate:
            false,

          esTerminada:
            false,

          situacion:
            "activa",

          carpetaContenedora:
            areaFolder,

          fueroDetectado:
  fuero,

departamentoDetectado:
  departamentoDetectado,

danioPsiquicoDetectado:
  danioPsiquico
        }
      );
    }

    const caseRecord =
      caseMap.get(
        caseMapKey
      );

    /*
     * Si primero estaba sin determinar
     * y luego encontramos SI o NO,
     * guardamos el dato detectado.
     */
    if (
      caseRecord
        .danioPsiquicoDetectado ===
        "sin-determinar" &&
      danioPsiquico !==
        "sin-determinar"
    ) {
      caseRecord
        .danioPsiquicoDetectado =
        danioPsiquico;
    }

    /*
     * Si aparece la misma persona
     * tanto en SI como en NO,
     * la marcamos para revisión.
     */
    if (
      caseRecord
        .danioPsiquicoDetectado !==
        "sin-determinar" &&
      danioPsiquico !==
        "sin-determinar" &&
      caseRecord
        .danioPsiquicoDetectado !==
        danioPsiquico
    ) {
      caseRecord.requiresReview =
        true;
    }

    const documentRecord =
      rules.createDocumentRecord({
        fileName,

        fullPath:
          entry.name,

        size:
          entry._data
            ?.uncompressedSize ||
          entry._data?.length ||
          0,

        compressedSize:
          entry._data
            ?.compressedSize ||
          0,

        modifiedAt:
          entry.date ||
          null
      });

    documentRecord.zipEntry =
      entry;

    documentRecord.subcarpeta =
      [
        areaFolder,
        damageFolder
      ]
        .filter(Boolean)
        .join("/");

    documentRecord.danioPsiquico =
      danioPsiquico;

    documentRecord.esCausaTerminada =
      false;

    caseRecord.documents.push(
      documentRecord
    );
  });


  console.log(
    "Gestión de Pericias FALCO® agrupación documental",
    {
      registros:
        caseMap.size,

      archivos:
        entries.filter(
          (entry) =>
            !entry.dir
        ).length,

      conDanio:
        Array.from(
          caseMap.values()
        ).filter(
          (item) =>
            item.danioPsiquicoDetectado ===
            "con-danio"
        ).length,

      sinDanio:
        Array.from(
          caseMap.values()
        ).filter(
          (item) =>
            item.danioPsiquicoDetectado ===
            "sin-danio"
        ).length,

      sinDeterminar:
        Array.from(
          caseMap.values()
        ).filter(
          (item) =>
            item.danioPsiquicoDetectado ===
            "sin-determinar"
        ).length
    }
  );

  return caseMap;
}


  /* =====================================================
     MODO NORMAL: CAUSAS
     Morón / La Matanza
  ===================================================== */

  const isFinishedFolder = (
    value = ""
  ) => {
    const normalized =
      rules.normalizeText(
        value
      );

    return (
      normalized.includes(
        "terminad"
      ) ||
      normalized.includes(
        "finalizad"
      ) ||
      normalized.includes(
        "cerrad"
      )
    );
  };


  entries.forEach((entry) => {
    if (entry.dir) {
      return;
    }

    if (
      rules.isHiddenPath(
        entry.name
      ) ||
      rules.isTemporaryFile(
        entry.name
      )
    ) {
      return;
    }


    const segments =
      getPathSegments(
        entry.name
      );

    if (!segments.length) {
      return;
    }


    const rootOffset =
      rootFolderName &&
      segments[0] ===
        rootFolderName
        ? 1
        : 0;


    const finishedFolderIndex =
      segments.findIndex(
        (
          segment,
          index
        ) =>
          index >=
            rootOffset &&
          isFinishedFolder(
            segment
          )
      );


    const isInsideFinishedFolder =
      finishedFolderIndex !== -1;


    const firstLogicalSegment =
      isInsideFinishedFolder
        ? segments[
            finishedFolderIndex
          ]
        : segments[
            rootOffset
          ] || "";


    const caseFolderIndex =
      isInsideFinishedFolder
        ? finishedFolderIndex + 1
        : rootOffset;


    const rawCaseFolderName =
      segments[
        caseFolderIndex
      ] || "";


    const caseFolderName =
      rules.cleanImportedName(
        rawCaseFolderName
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


    if (
      isInsideFinishedFolder &&
      segments.length <=
        caseFolderIndex + 1
    ) {
      return;
    }


    const fileName =
      rules.cleanImportedName(
        segments[
          segments.length - 1
        ]
      );


    if (!fileName) {
      return;
    }


    const relativeSegments =
      segments.slice(
        caseFolderIndex + 1
      );


    const subfolderSegments =
      relativeSegments.slice(
        0,
        -1
      );


    const caseMapKey =
      `${
        isInsideFinishedFolder
          ? "terminada"
          : "activa"
      }::${rules.normalizeText(
        caseFolderName
      )}`;


    if (
      !caseMap.has(
        caseMapKey
      )
    ) {
      caseMap.set(
        caseMapKey,
        {
          id:
            window.crypto
              ?.randomUUID?.() ||
            `import-case-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 9)}`,

          folderName:
            caseFolderName,

          rootFolderName,

          selected:
            true,

          documents:
            [],

          subfolders:
            new Map(),

          possiblePericiados:
            [],

          requiresReview:
            false,

          possibleDuplicate:
            false,

          esTerminada:
            isInsideFinishedFolder,

          situacion:
            isInsideFinishedFolder
              ? "finalizada"
              : "activa",

          carpetaContenedora:
            isInsideFinishedFolder
              ? firstLogicalSegment
              : ""
        }
      );
    }


    const caseRecord =
      caseMap.get(
        caseMapKey
      );


    const documentRecord =
      rules.createDocumentRecord({
        fileName,

        fullPath:
          entry.name,

        size:
          entry._data
            ?.uncompressedSize ||
          entry._data?.length ||
          0,

        compressedSize:
          entry._data
            ?.compressedSize ||
          0,

        modifiedAt:
          entry.date ||
          null
      });


    documentRecord.zipEntry =
      entry;


    documentRecord.subcarpeta =
      subfolderSegments.join(
        "/"
      );


    documentRecord.esCausaTerminada =
      isInsideFinishedFolder;


    caseRecord.documents.push(
      documentRecord
    );


    subfolderSegments.forEach(
      (
        folderName,
        index
      ) => {
        const folderPath =
          subfolderSegments
            .slice(
              0,
              index + 1
            )
            .join("/");


        if (
          caseRecord.subfolders.has(
            folderPath
          )
        ) {
          return;
        }


        caseRecord.subfolders.set(
          folderPath,
          {
            name:
              folderName,

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
  rawCase.departamentoDetectado ||
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
          ].includes(
            document.categoria
          )
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
              ) ===
                normalizedRegistration;

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

      const hasUsefulData =
        action.fecha ||
        action.tipo ||
        action.descripcion;

      if (!hasUsefulData) {
        return;
      }

      const key =
        [
          action.fecha || "",
          action.tipo || "",
          action.descripcion || ""
        ]
          .map((value) =>
            rules.normalizeText(value)
          )
          .join("::");

      if (
        actionKeys.has(key)
      ) {
        return;
      }

      actionKeys.add(key);

      extractedActions.push({
        id:
          window.crypto?.randomUUID?.() ||
          `actuacion-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        fecha:
          action.fecha || "",

        tipo:
          action.tipo || "",

        descripcion:
          action.descripcion || "",

        origen:
          action.origen || "importacion"
      });
    };


    const pushFee = (fee) => {
      if (!fee) {
        return;
      }

      const hasUsefulData =
        fee.monto ||
        fee.porcentaje ||
        fee.estado ||
        fee.fecha ||
        fee.descripcion;

      if (!hasUsefulData) {
        return;
      }

      const key =
        [
          fee.fecha || "",
          fee.monto || "",
          fee.porcentaje || "",
          fee.estado || "",
          fee.descripcion || ""
        ]
          .map((value) =>
            rules.normalizeText(value)
          )
          .join("::");

      if (
        feeKeys.has(key)
      ) {
        return;
      }

      feeKeys.add(key);

      extractedFees.push({
        id:
          window.crypto?.randomUUID?.() ||
          `honorario-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,

        fecha:
          fee.fecha || "",

        monto:
          fee.monto || "",

        porcentaje:
          fee.porcentaje || "",

        estado:
          fee.estado || "",

        descripcion:
          fee.descripcion || "",

        origen:
          fee.origen || "importacion"
      });
    };


    if (
      reader &&
      extractor &&
      relevantDocuments.length
    ) {
      for (
        const document
        of relevantDocuments
      ) {
        try {
          const documentText =
            await reader.readDocument(
              document
            );

          if (!documentText) {
            continue;
          }

          const extraction =
            extractor.extractDocumentData(
              documentText,
              {
                document,
                folderName:
                  rawCase.folderName,
                department
              }
            ) || {};

          if (
            extraction.expediente &&
            !extractedCaseData.expediente
          ) {
            extractedCaseData.expediente =
              extraction.expediente;
          }

          if (
            extraction.caratula &&
            !extractedCaseData.caratula
          ) {
            extractedCaseData.caratula =
              extraction.caratula;
          }

          if (
            extraction.fuero &&
            !extractedCaseData.fuero
          ) {
            extractedCaseData.fuero =
              extraction.fuero;
          }

          if (
            extraction.juzgado &&
            !extractedCaseData.juzgado
          ) {
            extractedCaseData.juzgado =
              extraction.juzgado;
          }

          if (
            extraction.organismo &&
            !extractedCaseData.organismo
          ) {
            extractedCaseData.organismo =
              extraction.organismo;
          }

          if (
            extraction.actor &&
            !extractedCaseData.actor
          ) {
            extractedCaseData.actor =
              extraction.actor;
          }

          if (
            extraction.demandado &&
            !extractedCaseData.demandado
          ) {
            extractedCaseData.demandado =
              extraction.demandado;
          }

          if (
            extraction.compania &&
            !extractedCaseData.compania
          ) {
            extractedCaseData.compania =
              extraction.compania;
          }

          if (
            extraction.fechaDesignacion &&
            !extractedCaseData.fechaDesignacion
          ) {
            extractedCaseData.fechaDesignacion =
              extraction.fechaDesignacion;
          }

          if (
            extraction.fechaAceptacionCargo &&
            !extractedCaseData.fechaAceptacionCargo
          ) {
            extractedCaseData.fechaAceptacionCargo =
              extraction.fechaAceptacionCargo;
          }

          if (
            extraction.fechaPericia &&
            !extractedCaseData.fechaPericia
          ) {
            extractedCaseData.fechaPericia =
              extraction.fechaPericia;
          }

          if (
            extraction.fechaSentencia &&
            !extractedCaseData.fechaSentencia
          ) {
            extractedCaseData.fechaSentencia =
              extraction.fechaSentencia;
          }

          if (
            Array.isArray(
              extraction.abogados
            )
          ) {
            extraction.abogados.forEach(
              pushLawyer
            );
          }

          if (
            Array.isArray(
              extraction.actuaciones
            )
          ) {
            extraction.actuaciones.forEach(
              pushAction
            );
          }

          if (
            Array.isArray(
              extraction.honorarios
            )
          ) {
            extraction.honorarios.forEach(
              pushFee
            );
          }

          if (
            parser?.parse
          ) {
            const parsed =
              parser.parse(
                documentText,
                {
                  document,
                  department
                }
              ) || {};

            if (
              parsed.expediente &&
              !extractedCaseData.expediente
            ) {
              extractedCaseData.expediente =
                parsed.expediente;
            }

            if (
              parsed.caratula &&
              !extractedCaseData.caratula
            ) {
              extractedCaseData.caratula =
                parsed.caratula;
            }

            if (
              parsed.fuero &&
              !extractedCaseData.fuero
            ) {
              extractedCaseData.fuero =
                parsed.fuero;
            }

            if (
              parsed.juzgado &&
              !extractedCaseData.juzgado
            ) {
              extractedCaseData.juzgado =
                parsed.juzgado;
            }

            if (
              Array.isArray(
                parsed.abogados
              )
            ) {
              parsed.abogados.forEach(
                pushLawyer
              );
            }

            if (
              Array.isArray(
                parsed.actuaciones
              )
            ) {
              parsed.actuaciones.forEach(
                pushAction
              );
            }

            if (
              Array.isArray(
                parsed.honorarios
              )
            ) {
              parsed.honorarios.forEach(
                pushFee
              );
            }
          }

        } catch (error) {
          console.warn(
            "No se pudo analizar un documento:",
            document?.nombre ||
              document?.rutaOriginal,
            error
          );
        }
      }
    }


    const expediente =
      extractedCaseData.expediente ||
      expedienteInicial ||
      "";

    const caratula =
      extractedCaseData.caratula ||
      rawCase.folderName ||
      "Sin carátula";

    const fuero =
  rawCase.fueroDetectado ||
  extractedCaseData.fuero ||
  fueroInicial ||
  "";

    const duplicateAfterExtraction =
      existingCases.some((causa) => {
        if (
          expediente &&
          causa.expediente
        ) {
          return (
            rules.normalizeText(
              causa.expediente
            ) ===
            rules.normalizeText(
              expediente
            )
          );
        }

        return (
          rules.normalizeText(
            causa.caratula
          ) ===
          rules.normalizeText(
            caratula
          )
        );
      });


    const documents =
      rawCase.documents.map(
        (document) => {
          const {
            zipEntry,
            ...safeDocument
          } = document;

          return safeDocument;
        }
      );


    const importedCase = {
      id:
        rawCase.id,

      codigoInterno:
        rules.buildInternalCode(
          department,
          expediente,
          index
        ),

      caratula,

      expediente,

      departamento:
        department,

      departamentoNombre:
        departmentName,

      fuero,

      juzgado:
        extractedCaseData.juzgado ||
        "",

      organismo:
        extractedCaseData.organismo ||
        "",

      actor:
        extractedCaseData.actor ||
        "",

      demandado:
        extractedCaseData.demandado ||
        "",

      compania:
        extractedCaseData.compania ||
        "",

      estadoGeneral:
        rawCase.esTerminada
          ? "Finalizada"
          : "Designada",

      activa:
        !rawCase.esTerminada,

      situacion:
        rawCase.esTerminada
          ? "finalizada"
          : "activa",

      esTerminada:
        Boolean(
          rawCase.esTerminada
        ),

      carpetaContenedora:
        rawCase.carpetaContenedora ||
        "",

      carpetaOriginal:
        rawCase.folderName,

      carpetaRaiz:
        rawCase.rootFolderName,

      documentos:
        documents,

      documentosCount:
        documents.length,

      periciados:
        possiblePericiados,

      periciadosCount:
        possiblePericiados.length,

      abogados:
        extractedLawyers,

      actuaciones:
        extractedActions,

      honorarios:
        extractedFees,

      fechaDesignacion:
        extractedCaseData.fechaDesignacion ||
        "",

      fechaAceptacionCargo:
        extractedCaseData.fechaAceptacionCargo ||
        "",

      fechaPericia:
        extractedCaseData.fechaPericia ||
        "",

      fechaSentencia:
        extractedCaseData.fechaSentencia ||
        "",

      danioPsiquico:
  rawCase.danioPsiquicoDetectado ||
  "sin-determinar",

      observaciones:
        "",

      importado:
        true,

      origenImportacion:
        "Importador Masivo FALCO®",

      archivoOrigen:
        selectedZipFile?.name ||
        "",

      requiereRevision:
        requiresReview,

      posibleDuplicada:
        Boolean(
          possibleDuplicate ||
          duplicateAfterExtraction
        ),

      seleccionado:
        true,

      fechaCreacion:
        new Date().toISOString(),

      fechaActualizacion:
        new Date().toISOString()
    };


    return importedCase;
  };


  const getDestination = () =>
    destinationFilter?.value ||
    "causas";


  const getDestinationLabel = (
    destination = getDestination()
  ) => {
    if (
      destination === "pericias"
    ) {
      return "Pericias";
    }

    if (
      destination === "cobradas"
    ) {
      return "Causas cobradas";
    }

    return "Gestión de Causas";
  };


  const updateDestinationMessage = () => {
    if (!destinationMessage) {
      return;
    }

    const destination =
      getDestination();

    if (
      destination === "pericias"
    ) {
      destinationMessage.textContent =
        "Las causas seleccionadas se guardarán en Pericias.";

      return;
    }

    if (
      destination === "cobradas"
    ) {
      destinationMessage.textContent =
        "Las causas seleccionadas se guardarán en Causas cobradas.";

      return;
    }

    destinationMessage.textContent =
      "Las causas seleccionadas se guardarán en Gestión de Causas.";
  };


  const getExistingDestinationCases =
    async () => {
      const destination =
        getDestination();

      if (
        destination === "pericias"
      ) {
        return (
          await window
            .GestionCausasFirestore
            ?.getPericias?.()
        ) || [];
      }

      if (
        destination === "cobradas"
      ) {
        return (
          await window
            .GestionCausasFirestore
            ?.getCobradas?.()
        ) || [];
      }

      return (
        window.GestionCausasData
          ?.getCases?.() || []
      );
    };


  const matchesSearch = (
    causa,
    search
  ) => {
    if (!search) {
      return true;
    }

    const searchable =
      rules.normalizeText(
        [
          causa.caratula,
          causa.expediente,
          causa.codigoInterno,
          causa.carpetaOriginal,
          causa.departamentoNombre,
          causa.fuero,
          ...(causa.documentos || [])
            .map((document) =>
              document.nombre
            )
        ]
          .filter(Boolean)
          .join(" ")
      );

    return searchable.includes(
      rules.normalizeText(search)
    );
  };


  const applyFilters = () => {
    const search =
      searchInput?.value || "";

    const reviewValue =
      reviewFilter?.value || "";

    const documentValue =
      documentFilter?.value || "";

    visibleCases =
      analyzedCases.filter(
        (causa) => {
          if (
            !matchesSearch(
              causa,
              search
            )
          ) {
            return false;
          }

          if (
            reviewValue ===
              "ready" &&
            causa.requiereRevision
          ) {
            return false;
          }

          if (
            reviewValue ===
              "review" &&
            !causa.requiereRevision
          ) {
            return false;
          }

          if (
            reviewValue ===
              "duplicate" &&
            !causa.posibleDuplicada
          ) {
            return false;
          }

          if (
            documentValue ===
              "with-documents" &&
            !causa.documentosCount
          ) {
            return false;
          }

          if (
            documentValue ===
              "without-documents" &&
            causa.documentosCount
          ) {
            return false;
          }

          if (
            documentValue ===
              "with-periciados" &&
            !causa.periciadosCount
          ) {
            return false;
          }

          return true;
        }
      );

    renderCases();
  };

    const getImportStatusLabel = (
    causa
  ) => {
    if (causa.posibleDuplicada) {
      return "Posible duplicada";
    }

    if (causa.requiereRevision) {
      return "Requiere revisión";
    }

    return "Lista para importar";
  };


  const getImportStatusClass = (
    causa
  ) => {
    if (
      causa.posibleDuplicada ||
      causa.requiereRevision
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


  const renderCases = () => {
    if (
      !caseList ||
      !emptyState
    ) {
      return;
    }

    if (visibleCount) {
      visibleCount.textContent =
        String(
          visibleCases.length
        );
    }

    if (!visibleCases.length) {
      caseList.innerHTML = "";
      emptyState.hidden = false;

      updateSelectedCount();
      return;
    }

    emptyState.hidden = true;

    caseList.innerHTML =
      visibleCases
        .map((causa) => {
          const lawyersCount =
            Array.isArray(
              causa.abogados
            )
              ? causa.abogados.length
              : 0;

          const actionsCount =
            Array.isArray(
              causa.actuaciones
            )
              ? causa.actuaciones.length
              : 0;

          const feesCount =
            Array.isArray(
              causa.honorarios
            )
              ? causa.honorarios.length
              : 0;

          const extractedFields = [
            causa.expediente,
            causa.organismo,
            causa.actor,
            causa.demandado
          ].filter(Boolean).length;

          return `
            <article
              class="gc-import-case-card ${
                causa.seleccionado
                  ? "is-selected"
                  : ""
              }"
              data-import-case-id="${escapeHtml(
                causa.id
              )}"
            >

              <div class="gc-import-case-card__selection">

                <input
                  type="checkbox"
                  class="gc-import-case-checkbox"
                  data-case-id="${escapeHtml(
                    causa.id
                  )}"
                  ${
                    causa.seleccionado
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
                        causa.carpetaOriginal ||
                        causa.caratula ||
                        "Sin nombre"
                      )}
                    </h4>

                  </div>

                  <span
                    class="gc-status ${getImportStatusClass(
                      causa
                    )}"
                  >
                    ${escapeHtml(
                      getImportStatusLabel(
                        causa
                      )
                    )}
                  </span>

                </div>

                <div class="gc-import-case-card__meta">

                  <span>
                    <strong>
                      Expediente:
                    </strong>

                    ${escapeHtml(
                      causa.expediente ||
                      "No detectado"
                    )}
                  </span>

                  <span>
                    <strong>
                      Departamento:
                    </strong>

                    ${escapeHtml(
                      causa.departamentoNombre ||
                      "Sin detectar"
                    )}
                  </span>

                  <span>
                    <strong>
                      Fuero:
                    </strong>

                    ${escapeHtml(
                      causa.fuero ||
                      "No detectado"
                    )}
                  </span>

                  <span>
                    <strong>
                      Organismo:
                    </strong>

                    ${escapeHtml(
                      causa.organismo ||
                      "No detectado"
                    )}
                  </span>

                  <span>
                    <strong>
                      Documentos:
                    </strong>

                    ${causa.documentosCount || 0}
                  </span>

                  <span>
                    <strong>
                      Periciados posibles:
                    </strong>

                    ${causa.periciadosCount || 0}
                  </span>

                  <span>
                    <strong>
                      Abogados detectados:
                    </strong>

                    ${lawyersCount}
                  </span>

                  <span>
                    <strong>
                      Actuaciones:
                    </strong>

                    ${actionsCount}
                  </span>

                  <span>
                    <strong>
                      Movimientos económicos:
                    </strong>

                    ${feesCount}
                  </span>

                  <span>
                    <strong>
                      Datos extraídos:
                    </strong>

                    ${extractedFields}/4
                  </span>

                </div>

                ${renderDocumentsPreview(
                  causa.documentos || []
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
        (causa) =>
          causa.seleccionado
      ).length;

    if (selectedCount) {
      selectedCount.textContent =
        String(totalSelected);
    }

    if (confirmButton) {
      confirmButton.disabled =
        totalSelected === 0;
    }
  };


  const updateStatistics = () => {
    const totalDocuments =
      analyzedCases.reduce(
        (sum, causa) =>
          sum +
          Number(
            causa.documentosCount || 0
          ),
        0
      );

    const totalPericiados =
      analyzedCases.reduce(
        (sum, causa) =>
          sum +
          Number(
            causa.periciadosCount || 0
          ),
        0
      );

    const totalReview =
      analyzedCases.filter(
        (causa) =>
          causa.requiereRevision ||
          causa.posibleDuplicada
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
        Object.values(
          zip.files
        );

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
        await getExistingDestinationCases();

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

      visibleCases =
        [...analyzedCases];

      updateStatistics();

      applyFilters();

      if (resultsSection) {
        resultsSection.hidden = false;
      }

      updateProgress(
        100,
        "Análisis enriquecido finalizado."
      );

      window.setTimeout(
        () => {
          resultsSection
            ?.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
            });
        },
        150
      );

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


  const isDuplicate = (
    causa,
    existingCases
  ) =>
    existingCases.some(
      (existing) => {
        if (
          causa.expediente &&
          existing.expediente
        ) {
          return (
            rules.normalizeText(
              causa.expediente
            ) ===
            rules.normalizeText(
              existing.expediente
            )
          );
        }

        return (
          rules.normalizeText(
            causa.caratula
          ) ===
          rules.normalizeText(
            existing.caratula
          )
        );
      }
    );


  const saveGeneralCase = async (
    causa
  ) => {
    const saved =
      window.GestionCausasData
        ?.addCase?.(
          causa
        );

    if (!saved) {
      return false;
    }

    if (
      window.GestionCausasData
        ?.flush
    ) {
      await window
        .GestionCausasData
        .flush();
    }

    return true;
  };


  const savePericia = async (
    causa
  ) => {
    const api =
      window.GestionCausasFirestore;

    if (
      typeof api?.savePericia !==
      "function"
    ) {
      throw new Error(
        "El puente Firestore para Pericias no está disponible."
      );
    }

    await api.savePericia({
      ...causa,

      tipoRegistro:
        "pericia",

      danioPsiquico:
        causa.danioPsiquico ||
        "sin-determinar"
    });

    return true;
  };


  const saveCobrada = async (
    causa
  ) => {
    const api =
      window.GestionCausasFirestore;

    if (
      typeof api?.saveCobrada !==
      "function"
    ) {
      throw new Error(
        "El puente Firestore para Causas cobradas no está disponible."
      );
    }

    await api.saveCobrada({
      ...causa,

      tipoRegistro:
        "cobrada",

      estadoGeneral:
        "Cobrada",

      activa:
        false,

      situacion:
        "finalizada",

      danioPsiquico:
        causa.danioPsiquico ||
        "sin-determinar"
    });

    return true;
  };


  const confirmImport = async () => {
    const selectedCases =
      analyzedCases.filter(
        (causa) =>
          causa.seleccionado
      );

    if (!selectedCases.length) {
      showToast(
        "Seleccione al menos una causa.",
        "error"
      );

      return;
    }

    const destination =
      getDestination();

    if (
      (
        destination === "pericias" ||
        destination === "cobradas"
      ) &&
      !window.GestionCausasFirestore
    ) {
      showToast(
        "Firestore todavía no está disponible. Recargue la página e intente nuevamente.",
        "error"
      );

      return;
    }

    if (confirmButton) {
      confirmButton.disabled = true;
    }

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    try {
      const existingCases =
        await getExistingDestinationCases();

      for (
        const causa
        of selectedCases
      ) {
        if (
          isDuplicate(
            causa,
            existingCases
          )
        ) {
          skipped += 1;
          continue;
        }

        try {
          let saved = false;

          if (
            destination ===
            "pericias"
          ) {
            saved =
              await savePericia(
                causa
              );

          } else if (
            destination ===
            "cobradas"
          ) {
            saved =
              await saveCobrada(
                causa
              );

          } else {
            saved =
              await saveGeneralCase(
                causa
              );
          }

          if (saved) {
            existingCases.push(
              causa
            );

            imported += 1;

          } else {
            errors += 1;
          }

        } catch (error) {
          errors += 1;

          console.error(
            "Error guardando registro:",
            causa.caratula ||
            causa.id,
            error
          );
        }
      }

      const destinationLabel =
        getDestinationLabel(
          destination
        );

      const message =
        errors > 0
          ? `Importación finalizada en ${destinationLabel}: ${imported} guardada(s), ${skipped} omitida(s) y ${errors} con error.`
          : `Importación finalizada en ${destinationLabel}: ${imported} guardada(s) y ${skipped} omitida(s).`;

      showToast(
        message,
        errors > 0
          ? "error"
          : "success"
      );

      if (
        imported > 0
      ) {
        let destinationUrl = "";

        if (
          destination ===
          "pericias"
        ) {
          destinationUrl =
            "../causas/pericias.html";

        } else if (
          destination ===
          "cobradas"
        ) {
          destinationUrl =
            "../causas/cobradas.html";

        } else {
          const importedDepartment =
            selectedCases[0]
              ?.departamento ||
            "";

          destinationUrl =
            importedDepartment ===
            "la-matanza"
              ? "../causas/causas.html?departamento=la-matanza"
              : "../causas/causas.html?departamento=moron";
        }

        window.setTimeout(
          () => {
            window.location.href =
              destinationUrl;
          },
          1600
        );
      }

    } catch (error) {
      console.error(
        "Error general durante la importación:",
        error
      );

      showToast(
        "La importación no pudo completarse.",
        "error"
      );

    } finally {
      if (confirmButton) {
        confirmButton.disabled =
          analyzedCases.filter(
            (causa) =>
              causa.seleccionado
          ).length === 0;
      }
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
        event.target
          .files?.[0];

      if (file) {
        setSelectedFile(
          file
        );
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
        setSelectedFile(
          file
        );
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

      const causa =
        analyzedCases.find(
          (item) =>
            item.id === caseId
        );

      if (!causa) {
        return;
      }

      causa.seleccionado =
        checkbox.checked;

      checkbox
        .closest(
          ".gc-import-case-card"
        )
        ?.classList.toggle(
          "is-selected",
          causa.seleccionado
        );

      updateSelectedCount();
    }
  );


  selectAllButton?.addEventListener(
    "click",
    () => {
      visibleCases.forEach(
        (causa) => {
          causa.seleccionado =
            true;
        }
      );

      renderCases();
    }
  );


  clearSelectionButton?.addEventListener(
    "click",
    () => {
      analyzedCases.forEach(
        (causa) => {
          causa.seleccionado =
            false;
        }
      );

      renderCases();
    }
  );


  confirmButton?.addEventListener(
    "click",
    confirmImport
  );


  destinationFilter?.addEventListener(
    "change",
    () => {
      updateDestinationMessage();

      /*
       * Si ya había un análisis realizado,
       * recalculamos posibles duplicados
       * para el nuevo destino.
       */
      if (
        analyzedCases.length
      ) {
        showToast(
          `Destino seleccionado: ${getDestinationLabel()}.`
        );
      }
    }
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
      element.tagName ===
      "INPUT"
        ? "input"
        : "change";

    element.addEventListener(
      eventName,
      applyFilters
    );
  });


  updateDestinationMessage();


  console.log(
    "Gestión de Causas FALCO® Importador Masivo Enriquecido Ready",
    {
      destino:
        getDestination(),

      firestore:
        Boolean(
          window.GestionCausasFirestore
        )
    }
  );

});