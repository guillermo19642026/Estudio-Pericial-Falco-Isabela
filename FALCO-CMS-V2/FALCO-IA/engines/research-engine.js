/* =========================
   RESEARCH ENGINE™
========================= */

window.ResearchEngine = {

  normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },

  investigate(query, corpus) {

    const investigation = new Investigation(query);

    const normalizedQuery = this.normalize(query);

    investigation.mainNode =
      corpus.find(node => {

        const title = this.normalize(node.titulo || "");
        const description = this.normalize(node.descripcion || "");

        return (
          title.includes(normalizedQuery) ||
          normalizedQuery.includes(title) ||
          description.includes(normalizedQuery)
        );

      }) || corpus[0] || null;

    if (investigation.mainNode) {

      investigation.relatedNodes = corpus.filter(node => {

        if (node.id === investigation.mainNode.id) return false;

        return (
          node.categoria === investigation.mainNode.categoria
        );

      });

      investigation.sources = [
        investigation.mainNode,
        ...investigation.relatedNodes
      ];
    }

    investigation.status = "completed";

    return investigation;
  }

};