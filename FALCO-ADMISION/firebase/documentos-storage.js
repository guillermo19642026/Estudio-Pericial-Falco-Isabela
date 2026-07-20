/* =========================================================
   FALCO Admisión™
   Documentos Cloudinary Storage v2.0
========================================================= */


/* =========================================================
   CONFIGURACIÓN CLOUDINARY
========================================================= */

const CLOUD_NAME =
  "dxvtuqx6p";

const UPLOAD_PRESET =
  "periciados";

const CLOUDINARY_FOLDER =
  "falco-admisiones";


/* =========================================================
   CONFIGURACIÓN DE ARCHIVOS
========================================================= */

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const ALLOWED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "doc",
  "docx"
];


/* =========================================================
   VALIDACIONES
========================================================= */

function validarArchivo(
  archivo
) {

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
      `El archivo "${archivo.name}" supera el máximo permitido de 10 MB.`
    );

  }

  const extension =
    obtenerExtension(
      archivo.name
    );

  const typeAllowed =
    ALLOWED_FILE_TYPES.includes(
      archivo.type
    );

  const extensionAllowed =
    ALLOWED_EXTENSIONS.includes(
      extension
    );

  if (
    !typeAllowed ||
    !extensionAllowed
  ) {

    throw new Error(
      `El archivo "${archivo.name}" tiene un formato no permitido.`
    );

  }

  return true;

}


function validarAdmisionId(
  admisionId
) {

  if (
    typeof admisionId !==
      "string" ||
    !admisionId.trim()
  ) {

    throw new Error(
      "No se recibió un identificador de admisión válido."
    );

  }

  if (
    !admisionId.startsWith(
      "FALCO-ADM-"
    )
  ) {

    throw new Error(
      "El identificador de admisión no tiene el formato esperado."
    );

  }

  return true;

}


/* =========================================================
   UTILIDADES
========================================================= */

function obtenerExtension(
  fileName
) {

  const parts =
    String(fileName)
      .toLowerCase()
      .split(".");

  if (
    parts.length < 2
  ) {

    return "";

  }

  return parts.pop();

}


function limpiarNombreArchivo(
  fileName
) {

  const extension =
    obtenerExtension(
      fileName
    );

  const baseName =
    String(fileName)
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .toLowerCase();

  const safeBase =
    baseName ||
    "documento";

  return extension
    ? `${safeBase}.${extension}`
    : safeBase;

}


function crearNombreUnico(
  fileName
) {

  const cleanName =
    limpiarNombreArchivo(
      fileName
    );

  const extension =
    obtenerExtension(
      cleanName
    );

  const baseName =
    cleanName.replace(
      /\.[^/.]+$/,
      ""
    );

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

}


function crearRutaDocumento(
  admisionId
) {

  return `${CLOUDINARY_FOLDER}/${admisionId}/documentos`;

}


function formatearBytes(
  bytes
) {

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
    index === 0 ? 0 : 2
  )} ${units[index]}`;

}


/* =========================================================
   SUBIR UN ARCHIVO A CLOUDINARY
========================================================= */

async function subirDocumentoAdmision(
  admisionId,
  archivo,
  options = {}
) {

  validarAdmisionId(
    admisionId
  );

  validarArchivo(
    archivo
  );

  const folder =
    crearRutaDocumento(
      admisionId
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
      `admision_id=${admisionId}`,
      `nombre_original=${encodeURIComponent(
        archivo.name
      )}`,
      "origen=FALCO_Admision"
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
          method: "POST",
          body: formData
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

    admisionId:
      admisionId,

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
      archivo.type,

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

    ancho:
      data.width ||
      null,

    alto:
      data.height ||
      null,

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
    "FALCO Admisión™ documento subido a Cloudinary:",
    result
  );

  return result;

}


/* =========================================================
   SUBIR VARIOS ARCHIVOS
========================================================= */

async function subirDocumentosAdmision(
  admisionId,
  archivos,
  options = {}
) {

  validarAdmisionId(
    admisionId
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
    index++
  ) {

    const archivo =
      fileList[index];

    if (
      typeof options.onFileStart ===
      "function"
    ) {

      options.onFileStart({
        archivo,
        index,
        total:
          fileList.length
      });

    }

    const result =
      await subirDocumentoAdmision(
        admisionId,
        archivo,
        {

          onProgress:
            progressData => {

              if (
                typeof options.onProgress ===
                "function"
              ) {

                options.onProgress({
                  ...progressData,
                  index,
                  totalFiles:
                    fileList.length
                });

              }

            }

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
        result,
        index,
        total:
          fileList.length
      });

    }

  }

  return results;

}


/* =========================================================
   ELIMINAR ARCHIVO
========================================================= */

/*
 * La eliminación directa desde el navegador no se realiza,
 * porque Cloudinary exige una solicitud firmada con el
 * API Secret.
 *
 * Esta función se conserva para mantener compatible
 * la API utilizada por el resto del sistema.
 */

async function eliminarDocumentoAdmision(
  ruta
) {

  if (
    typeof ruta !==
      "string" ||
    !ruta.trim()
  ) {

    throw new Error(
      "La ruta del documento no es válida."
    );

  }

  console.warn(
    "La eliminación de documentos de Cloudinary requiere una operación firmada desde un servidor.",
    ruta
  );

  return {
    ruta,
    eliminado: false,
    requiereServidor: true,
    proveedor:
      "cloudinary"
  };

}


/* =========================================================
   ERRORES
========================================================= */

function normalizarErrorStorage(
  error,
  fileName = ""
) {

  const code =
    error?.code ||
    "cloudinary/unknown";

  const prefix =
    fileName
      ? `No fue posible subir "${fileName}".`
      : "No fue posible subir el archivo.";

  const messages = {

    "cloudinary/upload-failed":
      "Cloudinary rechazó la carga.",

    "cloudinary/network-error":
      "No fue posible establecer conexión con Cloudinary.",

    "cloudinary/invalid-preset":
      "El preset de subida de Cloudinary no es válido.",

    "cloudinary/unknown":
      "Se produjo un error desconocido durante la carga."

  };

  const detail =
    error?.message ||
    messages[code] ||
    messages["cloudinary/unknown"];

  const normalizedError =
    new Error(
      `${prefix} ${detail}`
    );

  normalizedError.code =
    code;

  normalizedError.originalError =
    error;

  return normalizedError;

}


/* =========================================================
   EXPORTACIONES
========================================================= */

export {
  validarArchivo,
  validarAdmisionId,
  limpiarNombreArchivo,
  formatearBytes,
  subirDocumentoAdmision,
  subirDocumentosAdmision,
  eliminarDocumentoAdmision
};


console.log(
  "FALCO Admisión™ Documentos Cloudinary Storage v2.0 Ready"
);