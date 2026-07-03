/*
=========================================
FALCO® CORE
Sistema central de permisos
=========================================
*/

import { ROLES } from "./roles.js";

export const PERMISOS = {
  centroOperaciones: [
    ROLES.ADMIN,
    ROLES.PROFESIONAL,
    ROLES.PERITO,
    ROLES.PERICIADO,
    ROLES.ALUMNO,
    ROLES.BIBLIOTECA
  ],

  administracion: [
    ROLES.ADMIN
  ],

  areaProfesional: [
    ROLES.ADMIN,
    ROLES.PROFESIONAL,
    ROLES.PERITO
  ],

  evaluacion: [
    ROLES.ADMIN,
    ROLES.PERICIADO
  ],

  formacion: [
    ROLES.ADMIN,
    ROLES.ALUMNO
  ],

  biblioteca: [
    ROLES.ADMIN,
    ROLES.PROFESIONAL,
    ROLES.PERITO,
    ROLES.ALUMNO,
    ROLES.BIBLIOTECA
  ]
};

export function puedeAcceder(rol, modulo) {
  const permisosModulo = PERMISOS[modulo];

  if (!permisosModulo) return false;

  return permisosModulo.includes(rol);
}