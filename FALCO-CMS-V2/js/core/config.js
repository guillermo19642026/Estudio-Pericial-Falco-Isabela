/*
=========================================
FALCO® CORE
Configuración general del ecosistema
=========================================
*/

export const CONFIG = {
  nombre: "FALCO®",
  nombreCompleto: "Ecosistema FALCO®",
  moduloActual: "Centro de Operaciones",
  version: "3.1",

  contacto: {
    whatsapp: "5491132049521",
    mensajeSoporte:
      "Hola.%0A%0ANecesito%20asistencia%20t%C3%A9cnica.%0A%0AM%C3%B3dulo:%20Centro%20de%20Operaciones%20FALCO%C2%AE.%0AUsuario:%20%0ARol:%20%0A%0ADetalle%20de%20la%20consulta:"
  },

  ui: {
    marca: "FALCO®",
    subtitulo: "Plataforma Profesional",
    estadoSistema: "Operativa"
  }
};

export function obtenerWhatsappSoporte() {
  return `https://wa.me/${CONFIG.contacto.whatsapp}?text=${CONFIG.contacto.mensajeSoporte}`;
}