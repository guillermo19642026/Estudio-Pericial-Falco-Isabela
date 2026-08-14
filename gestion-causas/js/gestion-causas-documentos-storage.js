/* =========================================================
   GESTIÓN DE CAUSAS FALCO®
   Documentos Cloudinary Storage v1.0
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN CLOUDINARY
========================================================= */

const CLOUD_NAME =
  "dxvtuqx6p";

const UPLOAD_PRESET =
  "periciados";

const CLOUDINARY_FOLDER =
  "falco-gestion";


/* =========================================================
   CONFIGURACIÓN DE ARCHIVOS
========================================================= */

const MAX_FILE_SIZE =
  20 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",

  "application/msword",

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.oasis.opendocument.text",

  "application/octet-stream"
];

const ALLOWED_EXTENSIONS = [
  "pdf",
  "odt",
  "doc",
  "docx"
];


/* =========================================================
   UTILIDADES
========================================================= */

const obtenerExtension = (
  fileName = ""
) => {
  const parts =
    String(fileName)
      .toLowerCase()
      .split(".");

  if (
    parts.length < 2
  ) {
    return "";
  }

  return (
    parts.pop() ||
    ""
  ).trim();
};


const normalizarNombre = (
  value = ""
) =>
  String(value)
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9._-]+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );


const crearNombreUnico = (
  fileName = ""
) => {
  const extension =
    obtenerExtension(
      fileName
    );

  const baseName =
    normalizarNombre(
      fileName.replace(
        /\.[^.]+$/,
        ""
      )
    ) ||
    "documento";

  const random =
    crypto
      .getRandomValues(
        new Uint32Array(1)
      )[0]
      .toString(36);

  const timestamp =
    Date.now();

  return extension
    ? `${timestamp}-${random}-${baseName}`
    : `${timestamp}-${random}-${baseName}`;
};


const formatearBytes = (
  bytes
) => {
  if (
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return "0 KB";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index =
    Math.min(
      Math.floor(
        Math.log(bytes) /
        Math.log(1024)
      ),
      units.length - 1
    );

  const value =
    bytes /
    Math.pow(
      1024,
      index
    );

  return `${value.toFixed(
    index === 0
      ? 0
      : 2
  )} ${units[index]}`;
};


/* =========================================================
   VALIDACIONES
========================================================= */

const validarTipoRegistro = (
  tipoRegistro = ""
) => {
  const allowed = [
    "causas",
    "pericias",
    "cobradas"
  ];

  if (
    !allowed.includes(
      tipoRegistro
    )
  ) {
    throw new Error(
      `Tipo de registro inválido: ${tipoRegistro}`
    );
  }

  return true;
};


const validarRegistroId = (
  registroId = ""
) => {
  const value =
    String(
      registroId ||
      ""
    ).trim();

  if (!value) {
    throw new Error(
      "El registro no posee un identificador válido."
    );
  }

  return true;
};


const validarArchivo = (
  archivo
) => {
  if (
    !(archivo instanceof File)
  ) {
    throw new Error(
      "El archivo seleccionado no es válido."
    );
  }

  if (
    archivo.size <= 0
  ) {
    throw new Error(
      `El archivo "${archivo.name}" está vacío.`
    );
  }

  if (
    archivo.size >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      `El archivo "${archivo.name}" supera el máximo permitido de 20 MB.`
    );
  }

  const extension =
    obtenerExtension(
      archivo.name
    );

  const extensionAllowed =
    ALLOWED_EXTENSIONS.includes(
      extension
    );

  /*
   * Algunos navegadores identifican archivos ODT
   * como application/octet-stream.
   *
   * Por eso validamos principalmente la extensión,
   * siempre dentro de la lista permitida.
   */

  const typeAllowed =
    !archivo.type ||
    ALLOWED_FILE_TYPES.includes(
      archivo.type
    );

  if (
    !extensionAllowed ||
    !typeAllowed
  ) {
    throw new Error(
      `El archivo "${archivo.name}" tiene un formato no permitido.`
    );
  }

  return true;
};


/* =========================================================
   RUTAS CLOUDINARY
========================================================= */

const crearRutaDocumento = (
  tipoRegistro,
  registroId
) => {
  validarTipoRegistro(
    tipoRegistro
  );

  validarRegistroId(
    registroId
  );

  return [
    CLOUDINARY_FOLDER,
    tipoRegistro,
    String(registroId),
    "documentos"
  ].join("/");
};


/* =========================================================
   NORMALIZACIÓN DE ERRORES
========================================================= */

const normalizarErrorStorage = (
  error,
  fileName = ""
) => {
  const normalizedError =
    error instanceof Error
      ? error
      : new Error(
          String(
            error ||
            "Error desconocido."
          )
        );

  if (
    !normalizedError.code
  ) {
    normalizedError.code =
      "cloudinary/unknown";
  }

  if (
    fileName &&
    !normalizedError.fileName
  ) {
    normalizedError.fileName =
      fileName;
  }

  return normalizedError;
};


/* =========================================================
   SUBIR UN DOCUMENTO
========================================================= */

const subirDocumento = async (
  tipoRegistro,
  registroId,
  archivo,
  options = {}
) => {
  validarTipoRegistro(
    tipoRegistro
  );

  validarRegistroId(
    registroId
  );

  validarArchivo(
    archivo
  );


  const folder =
    crearRutaDocumento(
      tipoRegistro,
      registroId
    );


  const publicId =
    crearNombreUnico(
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
    UPLOAD_PRESET
  );


  formData.append(
    "folder",
    folder
  );


  formData.append(
    "public_id",
    publicId
  );


  formData.append(
    "context",
    [
      `registro_id=${encodeURIComponent(
        registroId
      )}`,

      `tipo_registro=${tipoRegistro}`,

      `nombre_original=${encodeURIComponent(
        archivo.name
      )}`,

      "origen=FALCO_Gestion_Causas"
    ].join("|")
  );


  if (
    typeof options.onProgress ===
    "function"
  ) {
    options.onProgress({
      progress: 5,

      bytesTransferred: 0,

      totalBytes:
        archivo.size,

      state:
        "running",

      fileName:
        archivo.name
    });
  }


  let response;


  try {

    response =
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method:
            "POST",

          body:
            formData
        }
      );

  } catch (error) {

    console.error(
      "Error de conexión con Cloudinary:",
      error
    );

    throw normalizarErrorStorage(
      error,
      archivo.name
    );
  }


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    console.error(
      "Cloudinary devolvió una respuesta inválida:",
      error
    );

    throw new Error(
      `No fue posible subir "${archivo.name}". Cloudinary devolvió una respuesta inválida.`
    );
  }


  if (
    !response.ok
  ) {

    console.error(
      "Error Cloudinary:",
      data
    );


    const cloudinaryError =
      new Error(
        data?.error?.message ||
        "Cloudinary rechazó la carga."
      );


    cloudinaryError.code =
      "cloudinary/upload-failed";


    throw normalizarErrorStorage(
      cloudinaryError,
      archivo.name
    );
  }


  if (
    typeof options.onProgress ===
    "function"
  ) {
    options.onProgress({
      progress: 100,

      bytesTransferred:
        archivo.size,

      totalBytes:
        archivo.size,

      state:
        "success",

      fileName:
        archivo.name
    });
  }


  const result = {

    id:
      data.asset_id ||
      data.public_id,

    registroId:
      String(
        registroId
      ),

    tipoRegistro,

    nombreOriginal:
      archivo.name,

    nombreStorage:
      data.public_id,

    publicId:
      data.public_id,

    assetId:
      data.asset_id ||
      null,

    ruta:
      data.public_id,

    carpeta:
      folder,

    url:
      data.secure_url,

    secureUrl:
      data.secure_url,

    tipo:
      archivo.type ||
      "",

    resourceType:
      data.resource_type ||
      "auto",

    formato:
      data.format ||
      obtenerExtension(
        archivo.name
      ),

    extension:
      obtenerExtension(
        archivo.name
      ),

    tamanio:
      archivo.size,

    bytes:
      data.bytes ||
      archivo.size,

    tamanioLegible:
      formatearBytes(
        data.bytes ||
        archivo.size
      ),

    version:
      data.version ||
      null,

    subidoEn:
      new Date()
        .toISOString(),

    estado:
      "subido",

    proveedor:
      "cloudinary"
  };


  console.log(
    "Gestión de Causas FALCO® documento subido a Cloudinary:",
    result
  );


  return result;
};


/* =========================================================
   SUBIR VARIOS DOCUMENTOS
========================================================= */

const subirDocumentos = async (
  tipoRegistro,
  registroId,
  archivos,
  options = {}
) => {
  validarTipoRegistro(
    tipoRegistro
  );

  validarRegistroId(
    registroId
  );


  const fileList =
    Array.from(
      archivos ||
      []
    );


  if (
    fileList.length === 0
  ) {
    return [];
  }


  const results = [];


  for (
    let index = 0;
    index < fileList.length;
    index += 1
  ) {

    const archivo =
      fileList[index];


    const result =
      await subirDocumento(
        tipoRegistro,
        registroId,
        archivo,
        {
          onProgress:
            options.onProgress
        }
      );


    results.push(
      result
    );


    if (
      typeof options.onFileComplete ===
      "function"
    ) {
      options.onFileComplete({
        index,
        total:
          fileList.length,
        archivo,
        result
      });
    }
  }


  return results;
};


/* =========================================================
   API PÚBLICA
========================================================= */

window.GestionCausasDocumentosStorage = {

  subirDocumento,

  subirDocumentos,

  crearRutaDocumento,

  validarArchivo,

  obtenerExtension,

  formatearBytes,

  config: {

    cloudName:
      CLOUD_NAME,

    uploadPreset:
      UPLOAD_PRESET,

    folder:
      CLOUDINARY_FOLDER,

    maxFileSize:
      MAX_FILE_SIZE,

    allowedExtensions:
      [
        ...ALLOWED_EXTENSIONS
      ]
  }
};


console.log(
  "Gestión de Causas FALCO® Cloudinary Storage Ready",
  {
    cloudName:
      CLOUD_NAME,

    folder:
      CLOUDINARY_FOLDER,

    tipos: [
      "causas",
      "pericias",
      "cobradas"
    ]
  }
);