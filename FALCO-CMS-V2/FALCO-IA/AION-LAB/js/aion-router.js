/* =========================================================
   AION Router™ v1.0
   Director de contexto para Sistema FALCO®
========================================================= */

class AIONRouter {
  constructor() {
    this.path = window.location.pathname.toLowerCase();
    this.title = document.title || "";
  }

  getContext() {
    const page = this.detectPage();

    return {
      page: page.slug,
      title: page.title,
      knowledge: page.knowledge,
      greeting: page.greeting,
      role: page.role || "visitor",
      primaryAction: page.primaryAction || "orientar"
    };
  }

  detectPage() {
    if (this.isHome()) {
      return {
        slug: "home",
        title: "Sistema FALCO®",
        knowledge: "general",
        greeting: "Bienvenido al Sistema FALCO®. Puedo orientarte según lo que necesites.",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("pericia-psicologica")) {
      return {
        slug: "pericia-psicologica",
        title: "Pericia Psicológica",
        knowledge: "pericia-psicologica",
        greeting: "Estás en la sección de Pericia Psicológica. Puedo orientarte sobre el proceso pericial.",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("danio-psiquico") || this.path.includes("daño-psiquico")) {
      return {
        slug: "danio-psiquico",
        title: "Daño Psíquico",
        knowledge: "danio-psiquico",
        greeting: "Estás en la sección de Daño Psíquico. Puedo orientarte sobre nexo causal, secuelas y evaluación pericial.",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("informe-pericial")) {
      return {
        slug: "informe-pericial",
        title: "Informe Pericial Psicológico",
        knowledge: "informe-pericial",
        greeting: "Estás en la sección de Informe Pericial. Puedo orientarte sobre qué incluye y para qué sirve.",
        primaryAction: "informar"
      };
    }

    if (this.path.includes("perito-psicologa-de-parte") || this.path.includes("perito-de-parte")) {
      return {
        slug: "perito-de-parte",
        title: "Perito de Parte",
        knowledge: "perito-de-parte",
        greeting: "Estás en la sección de Perito de Parte. Puedo orientarte sobre asistencia técnica para abogados y causas judiciales.",
        role: "abogado",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("impugnacion") || this.path.includes("impugnaciones") || this.path.includes("contrainformes")) {
      return {
        slug: "impugnaciones",
        title: "Impugnaciones y Contrainformes",
        knowledge: "impugnaciones",
        greeting: "Estás en la sección de revisión técnica, impugnaciones o contrainformes. Puedo orientarte sobre cómo analizar una pericia.",
        role: "abogado",
        primaryAction: "orientar"
      };
    }

    if (this.path.includes("honorarios") || this.path.includes("cuanto-cuesta")) {
      return {
        slug: "honorarios",
        title: "Honorarios e Informes",
        knowledge: "honorarios",
        greeting: "Estás consultando información sobre honorarios. Puedo orientarte sobre presupuestos, informes y modalidades de intervención.",
        primaryAction: "orientar"
      };
    }

    return {
      slug: "general",
      title: "Sistema FALCO®",
      knowledge: "general",
      greeting: "Puedo orientarte dentro del Sistema FALCO® según lo que necesites.",
      primaryAction: "orientar"
    };
  }

  isHome() {
    return (
      this.path === "/" ||
      this.path.endsWith("/index.html") ||
      this.path.endsWith("index.html")
    );
  }
}

window.AIONRouter = AIONRouter;