/*
=========================================
FALCO® CORE
Roles oficiales del Ecosistema
=========================================
*/

export const ROLES = {

    ADMIN: "admin",

    PROFESIONAL: "profesional",

    PERITO: "perito",

    PERICIADO: "periciado",

    ALUMNO: "alumno",

    BIBLIOTECA: "biblioteca"

};

export function esAdministrador(rol){

    return rol === ROLES.ADMIN;

}

export function esProfesional(rol){

    return rol === ROLES.PROFESIONAL;

}

export function esPerito(rol){

    return rol === ROLES.PERITO;

}

export function esPericiado(rol){

    return rol === ROLES.PERICIADO;

}

export function esAlumno(rol){

    return rol === ROLES.ALUMNO;

}

export function esBiblioteca(rol){

    return rol === ROLES.BIBLIOTECA;

}

export function tieneAccesoProfesional(rol){

    return [

        ROLES.ADMIN,

        ROLES.PROFESIONAL,

        ROLES.PERITO

    ].includes(rol);

}