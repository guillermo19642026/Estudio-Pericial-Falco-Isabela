/* =========================================================
   Response Engine™ v1.1
   Presentación inteligente de respuestas
========================================================= */

class ResponseEngine {

  format(response) {

    return {

      title:
        response.page?.title || "Sistema FALCO®",

      text:
        response.answer,

      suggestions:
        response.page?.suggestions || [],

      related:
        response.page?.related || [],

      source:
        response.source || "Corpus FALCO®"

    };

  }

}

window.ResponseEngine = ResponseEngine;