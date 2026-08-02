/*
=========================================
FALCO®
Portal Institucional
Control visual de permisos
Versión 1.0
=========================================

Compatibilidad:
- Si el usuario no tiene permisos personalizados,
  conserva todos los módulos definidos para su rol.
- El administrador siempre conserva acceso completo.
- Esta capa controla la visualización del Portal.
- Las reglas de Firestore seguirán siendo la seguridad real.
=========================================
*/

const PERMISO_POR_MODULO = {

  /* Área profesional y pericial */

  "Centro Profesional": "centroProfesional",
  "Gestión de Periciados": "gestionPericiados",
  "Gestión Pericial": "gestionPericiados",

  "Centro de Evaluaciones": "evaluaciones",
  "Plataforma de Evaluación": "evaluaciones",
  "Plataforma de Periciados": "evaluaciones",
  "Evaluaciones Psicológicas": "evaluaciones",
  "Resultados de Evaluaciones": "evaluaciones",

  "Mi Documentación": "documentacionPericiados",
  "Documentación": "documentacionPericiados",
  "Documentación de Periciados": "documentacionPericiados",

  /* Biblioteca */

  "Biblioteca FALCO®": "biblioteca",
  "Biblioteca Profesional": "biblioteca",
  "Biblioteca del Curso": "biblioteca",
  "Método FALCO®": "biblioteca",

  /* Formación */

  "Campus de Formación": "campus",
  "Administración Campus": "administracion",

  "Escuela para Padres": "escuela",
  "Administración Escuela": "administracion",
  "Participantes Escuela": "administracion",
  "Alta de Participantes": "administracion",
  "Certificados": "administracion",
  "Programa Premium": "campus",

  /* Admisión */

  "FALCO® Admisión": "admision",
  "Gestión de Admisiones": "admision",
  "Detalle de Admisiones": "admision",
  "Postulaciones Profesionales": "admision",

  /* Comunidad */

  "FALCO® Comunidad": "comunidad",
  "Administración Comunidad": "administracion",
  "Instituciones": "comunidad",
  "Solicitudes Institucionales": "comunidad",
  "Reuniones": "comunidad",
  "Proyectos": "comunidad",
  "Programas": "comunidad",
  "Agenda Comunidad": "comunidad",

  /* Administración */

  "Motor de Contenidos FALCO®": "administracion",
  "Editor de Recursos": "administracion",
  "Usuarios y Permisos": "administracion",
  "Configuración del Sistema": "administracion",
  "Estadísticas Generales": "administracion",
  "Administración Biblioteca": "administracion",
  "Contenidos": "administracion",
  "Publicaciones": "administracion",
  "Categorías": "administracion",
  "Etiquetas": "administracion",
  "Mesa de Entrada": "administracion",
  "Document Engine FALCO®": "administracion"
};


const PERMISO_POR_ACCESO = {
  "🏠 Sitio principal": null,
  "💬 Soporte": null,

  "👥 Gestión de periciados": "gestionPericiados",
  "⚖️ Gestión pericial": "gestionPericiados",

  "🧠 Centro profesional": "centroProfesional",
  "🧠 Evaluaciones": "evaluaciones",
  "🧪 Mi evaluación": "evaluaciones",
  "📁 Mi documentación": "documentacionPericiados",

  "📚 Biblioteca": "biblioteca",
  "🎓 Campus": "campus",
  "👨‍👩‍👧 Escuela": "escuela",

  "📝 Admisiones": "admision",
  "🏛️ Comunidad": "comunidad",

  "📂 Centro de contenidos": "administracion",
  "📂 CMS": "administracion"
};


/*
Los módulos públicos o institucionales no necesitan
un permiso personalizado.
*/

const MODULOS_SIEMPRE_VISIBLES = new Set([
  "Página Principal",
  "Sitio Institucional",
  "Ecosistema FALCO®",
  "Presentación del Sistema"
]);


export function tienePermisosPersonalizados(permisos) {
  return Boolean(
    permisos &&
    typeof permisos === "object" &&
    !Array.isArray(permisos) &&
    Object.keys(permisos).length > 0
  );
}


export function puedeVerModulo(
  modulo,
  rol,
  permisos
) {
  const rolNormalizado =
    String(rol || "")
      .trim()
      .toLowerCase();

  /*
    El administrador conserva acceso total.
  */

  if (rolNormalizado === "admin") {
    return true;
  }

  /*
    Las páginas institucionales permanecen visibles.
  */

  if (
    MODULOS_SIEMPRE_VISIBLES.has(
      modulo.titulo
    )
  ) {
    return true;
  }

  /*
    Compatibilidad:
    sin permisos personalizados, se conserva
    el comportamiento actual por rol.
  */

  if (
    !tienePermisosPersonalizados(permisos)
  ) {
    return true;
  }

  const permisoNecesario =
    PERMISO_POR_MODULO[modulo.titulo];

  /*
    Si el módulo todavía no fue clasificado,
    no lo ocultamos para evitar romper accesos.
  */

  if (!permisoNecesario) {
    return true;
  }

  return (
    permisos[permisoNecesario] === true
  );
}


export function filtrarGruposPorPermisos(
  grupos,
  rol,
  permisos
) {
  if (!Array.isArray(grupos)) {
    return [];
  }

  return grupos
    .map((grupo) => ({
      ...grupo,

      items: Array.isArray(grupo.items)
        ? grupo.items.filter((modulo) =>
            puedeVerModulo(
              modulo,
              rol,
              permisos
            )
          )
        : []
    }))
    .filter(
      (grupo) => grupo.items.length > 0
    );
}


export function filtrarAccesosPorPermisos(
  accesos,
  rol,
  permisos
) {
  const rolNormalizado =
    String(rol || "")
      .trim()
      .toLowerCase();

  if (!Array.isArray(accesos)) {
    return [];
  }

  if (rolNormalizado === "admin") {
    return accesos;
  }

  if (
    !tienePermisosPersonalizados(permisos)
  ) {
    return accesos;
  }

  return accesos.filter(([titulo]) => {
    const permisoNecesario =
      PERMISO_POR_ACCESO[titulo];

    if (!permisoNecesario) {
      return true;
    }

    return permisos[permisoNecesario] === true;
  });
}