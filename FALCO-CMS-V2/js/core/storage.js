/*
=========================================
FALCO® CORE
Storage centralizado
=========================================
*/

const CLAVES = {

    UID: "falcoUidUsuario",

    ROL: "falcoRolUsuario",

    EMAIL: "falcoEmailUsuario"

};

export function guardarUsuario(uid, rol, email){

    localStorage.setItem(CLAVES.UID, uid);
    localStorage.setItem(CLAVES.ROL, rol);
    localStorage.setItem(CLAVES.EMAIL, email);

}

export function obtenerUID(){

    return localStorage.getItem(CLAVES.UID);

}

export function obtenerRol(){

    return localStorage.getItem(CLAVES.ROL);

}

export function obtenerEmail(){

    return localStorage.getItem(CLAVES.EMAIL);

}

export function cerrarSesionLocal(){

    Object.values(CLAVES).forEach(clave=>{

        localStorage.removeItem(clave);

    });

}