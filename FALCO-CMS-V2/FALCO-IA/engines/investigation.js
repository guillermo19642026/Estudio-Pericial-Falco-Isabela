/* =========================
   INVESTIGATION ENGINE™
========================= */

class Investigation {

    constructor(query){

        this.query = query;

        this.mainNode = null;

        this.relatedNodes = [];

        this.sources = [];

        this.status = "created";

    }

}

window.Investigation = Investigation;