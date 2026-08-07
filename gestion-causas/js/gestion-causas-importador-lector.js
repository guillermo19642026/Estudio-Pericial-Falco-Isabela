(() => {
  "use strict";

  const decodeXmlEntities = (value = "") =>
    String(value)
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&apos;", "'")
      .replace(/&#(\d+);/g, (_, number) =>
        String.fromCharCode(Number(number))
      );

  const xmlToPlainText = (xml = "") =>
    decodeXmlEntities(
      String(xml)
        .replace(/<text:tab[^>]*\/>/gi, "\t")
        .replace(/<text:line-break[^>]*\/>/gi, "\n")
        .replace(/<\/text:p>/gi, "\n")
        .replace(/<\/text:h>/gi, "\n")
        .replace(/<\/w:p>/gi, "\n")
        .replace(/<w:tab[^>]*\/>/gi, "\t")
        .replace(/<[^>]+>/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    );

  const readOdt = async (arrayBuffer) => {
    const documentZip =
      await window.JSZip.loadAsync(arrayBuffer);

    const contentFile =
      documentZip.file("content.xml");

    if (!contentFile) {
      return {
        success: false,
        text: "",
        error: "No se encontró content.xml."
      };
    }

    const contentXml =
      await contentFile.async("text");

    return {
      success: true,
      text: xmlToPlainText(contentXml),
      format: "odt"
    };
  };

  const readDocx = async (arrayBuffer) => {
    const documentZip =
      await window.JSZip.loadAsync(arrayBuffer);

    const contentFile =
      documentZip.file(
        "word/document.xml"
      );

    if (!contentFile) {
      return {
        success: false,
        text: "",
        error:
          "No se encontró word/document.xml."
      };
    }

    const contentXml =
      await contentFile.async("text");

    return {
      success: true,
      text: xmlToPlainText(contentXml),
      format: "docx"
    };
  };

  const readTextFile = async (
    arrayBuffer
  ) => {
    const decoder =
      new TextDecoder("utf-8");

    return {
      success: true,
      text: decoder.decode(arrayBuffer),
      format: "text"
    };
  };

  const readDocument = async ({
    zipEntry,
    fileName = ""
  } = {}) => {
    if (!zipEntry) {
      return {
        success: false,
        text: "",
        error: "Archivo no disponible."
      };
    }

    const extension =
      window
        .GestionCausasImportadorReglas
        ?.getFileExtension?.(fileName) || "";

    const supportedExtensions = [
      "odt",
      "docx",
      "txt",
      "rtf"
    ];

    if (
      !supportedExtensions.includes(
        extension
      )
    ) {
      return {
        success: false,
        text: "",
        format: extension,
        unsupported: true,
        error:
          `El formato ${extension || "desconocido"} todavía no se puede leer automáticamente.`
      };
    }

    try {
      const arrayBuffer =
        await zipEntry.async(
          "arraybuffer"
        );

      if (extension === "odt") {
        return await readOdt(
          arrayBuffer
        );
      }

      if (extension === "docx") {
        return await readDocx(
          arrayBuffer
        );
      }

      return await readTextFile(
        arrayBuffer
      );
    } catch (error) {
      console.error(
        "No se pudo leer el documento:",
        fileName,
        error
      );

      return {
        success: false,
        text: "",
        format: extension,
        error:
          "No se pudo extraer el contenido."
      };
    }
  };

  const selectRelevantDocuments = (
    documents = []
  ) => {
   const preferredCategories = [
  "caratula",
  "abogado-actora",
  "abogado-demandada",
  "contestacion-demanda",
  "demanda",
  "aceptacion-cargo",
  "designacion",
  "apertura-prueba",
  "fecha-entrevista",
  "anticipo-gastos",
  "carta-pago",
  "honorarios",
  "impugnacion",
  "contestacion-impugnacion",
  "explicaciones",
  "traslado",
  "providencia",
  "audiencia",
  "sentencia",
  "pericia"
];

    return documents
      .filter((document) =>
        preferredCategories.includes(
          document.categoria
        )
      )
      .sort((a, b) => {
        const indexA =
          preferredCategories.indexOf(
            a.categoria
          );

        const indexB =
          preferredCategories.indexOf(
            b.categoria
          );

        return indexA - indexB;
      });
  };

  window.GestionCausasImportadorLector = {
    readDocument,
    readOdt,
    readDocx,
    readTextFile,
    xmlToPlainText,
    selectRelevantDocuments
  };

  console.log(
    "Gestión de Causas FALCO® Lector Documental Ready"
  );
})();