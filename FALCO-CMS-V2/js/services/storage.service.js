/**
 * ==========================================================
 * FALCO CMS®
 * Cloudinary Storage Service
 * ==========================================================
 */

const CLOUD_NAME = "dxvtuqx6p";
const UPLOAD_PRESET = "periciados";

export async function subirArchivo(
    archivo,
    carpeta = "cms"
) {

    if (!archivo) return null;

    const formData = new FormData();

    formData.append("file", archivo);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", carpeta);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error(data);
        throw new Error("No fue posible subir el archivo.");
    }

    return {

        nombre: archivo.name,

        url: data.secure_url,

        publicId: data.public_id,

        tipo: archivo.type,

        peso: archivo.size

    };

}