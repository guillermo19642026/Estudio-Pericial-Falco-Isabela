/* =========================================================
   AION Site Map™ v1.0
   Mapa central del Sistema FALCO®
   No modifica motores existentes
========================================================= */

window.AIONSiteMap = {
  routes: [
    {
      match: ["index.html", "/"],
      slug: "general",
      title: "Sistema FALCO®",
      role: "visitor"
    },
    {
      match: ["danio-psiquico", "daño-psiquico"],
      slug: "danio-psiquico",
      title: "Daño Psíquico",
      role: "visitor"
    },
    {
      match: ["servicios"],
      slug: "servicios",
      title: "Servicios",
      role: "visitor"
    },
    {
      match: ["areas", "áreas"],
      slug: "areas",
      title: "Áreas de intervención",
      role: "visitor"
    },
    {
      match: ["recursos"],
      slug: "recursos",
      title: "Recursos",
      role: "visitor"
    },
    {
      match: ["formacion", "talleres-y-cursos", "cursos"],
      slug: "formacion",
      title: "Formación",
      role: "visitor"
    },
    {
      match: ["sobre-la-perito", "sobre-la-licenciada"],
      slug: "sobre-la-perito",
      title: "Sobre la Perito",
      role: "visitor"
    },
    {
      match: ["contacto", "consultas", "solicitar-turno"],
      slug: "contacto",
      title: "Consultas",
      role: "visitor"
    },
    {
      match: ["faq", "preguntas-frecuentes"],
      slug: "faq",
      title: "Preguntas frecuentes",
      role: "visitor"
    },
    {
      match: ["escuela-login", "escuela-panel", "escuela-para-padres"],
      slug: "escuela",
      title: "Escuela para Padres FALCO®",
      role: "alumno"
    },
    {
      match: ["biblioteca-falco", "biblioteca-login", "biblioteca-profesional"],
      slug: "biblioteca",
      title: "Biblioteca FALCO®",
      role: "biblioteca"
    },
    {
      match: ["tests", "scl90", "bdi", "bai", "desesperanza"],
      slug: "tests",
      title: "Tests psicométricos",
      role: "periciado"
    },
    {
      match: ["area-profesional", "profesional-login"],
      slug: "area-profesional",
      title: "Área Profesional",
      role: "profesional"
    }
  ],

  detect(pathname = window.location.pathname) {
    const path = pathname.toLowerCase();

    const route = this.routes.find(item =>
      item.match.some(term =>
        term === "/"
          ? path === "/"
          : path.includes(term)
      )
    );

    return route || {
      slug: "general",
      title: "Sistema FALCO®",
      role: "visitor"
    };
  },

  getCurrent() {
    return this.detect(window.location.pathname);
  }
};