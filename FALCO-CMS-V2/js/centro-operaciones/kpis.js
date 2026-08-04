/*
=========================================
FALCO®
Portal Institucional
KPIs por rol
Versión 4.0
=========================================

Los valores permanecen en modo informativo
hasta integrar los datos reales de Firestore.

No modifica:
- Firebase Authentication
- Firestore
- roles
- renderizado
=========================================
*/

export const KPIS = {

  admin: {
    usuarios: "—",
    biblioteca: "—",
    evaluaciones: "—",
    cursos: "—"
  },

  profesional: {
    usuarios: "—",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "—"
  },

  perito: {
    usuarios: "—",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "—"
  },

  alumno: {
    usuarios: "Activo",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "Habilitados"
  },

    gestion_academica: {
    usuarios: "Participantes",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "Administración"
  },


    secretaria: {
    usuarios: "Participantes",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "Operativos"
  },

  periciado: {
    usuarios: "Activo",
    biblioteca: "—",
    evaluaciones: "En curso",
    cursos: "—"
  },

  biblioteca: {
    usuarios: "Activo",
    biblioteca: "Disponible",
    evaluaciones: "—",
    cursos: "—"
  },

  default: {
    usuarios: "—",
    biblioteca: "—",
    evaluaciones: "—",
    cursos: "—"
  }

};