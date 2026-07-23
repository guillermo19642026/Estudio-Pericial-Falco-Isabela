/* =========================================================
   AION Intent Engine™ v1.0
   Detección local de intención sobre Knowledge JSON

   Este módulo:
   - No modifica Conversation Engine.
   - No modifica la interfaz.
   - No ejecuta respuestas.
   - Solo analiza una consulta y propone un answerKey.
========================================================= */

const AIONIntent = {

  /*
   * Palabras muy frecuentes que aportan poco significado.
   * Se excluyen para mejorar la comparación.
   */
  stopWords: new Set([
    "a",
    "al",
    "algo",
    "como",
    "con",
    "cual",
    "cuales",
    "cuando",
    "de",
    "del",
    "desde",
    "donde",
    "el",
    "ella",
    "en",
    "es",
    "esta",
    "este",
    "esto",
    "hay",
    "la",
    "las",
    "lo",
    "los",
    "me",
    "mi",
    "para",
    "pero",
    "por",
    "puede",
    "puedo",
    "que",
    "quien",
    "se",
    "sobre",
    "su",
    "tiene",
    "un",
    "una",
    "y"
  ]),

  /*
   * Normaliza textos:
   * - minúsculas
   * - sin acentos
   * - sin signos
   * - sin espacios repetidos
   */
  normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[¿?¡!.,;:®™"'()[\]{}]/g, " ")
      .replace(/[^a-z0-9ñ\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  /*
   * Convierte una frase en palabras útiles.
   */
  tokenize(text) {
    const normalized =
      this.normalize(text);

    if (!normalized) {
      return [];
    }

    return normalized
      .split(" ")
      .filter((word) => {
        return (
          word.length > 2 &&
          !this.stopWords.has(word)
        );
      });
  },

  /*
   * Devuelve la cantidad de tokens compartidos.
   */
  countMatches(queryTokens, targetTokens) {
    if (
      !Array.isArray(queryTokens) ||
      !Array.isArray(targetTokens)
    ) {
      return 0;
    }

    const targetSet =
      new Set(targetTokens);

    return queryTokens.reduce(
      (total, token) => {
        return targetSet.has(token)
          ? total + 1
          : total;
      },
      0
    );
  },

  /*
   * Obtiene las palabras clave de una respuesta.
   *
   * Admite que en el futuro cada answer tenga:
   *
   * keywords: [...]
   *
   * Pero también funciona con los JSON actuales.
   */
  getKeywords(answerData) {
    if (
      !answerData ||
      typeof answerData !== "object"
    ) {
      return [];
    }

    if (Array.isArray(answerData.keywords)) {
      return answerData.keywords
        .flatMap((keyword) =>
          this.tokenize(keyword)
        );
    }

    return [];
  },

  /*
   * Analiza una consulta contra una respuesta.
   */
  scoreAnswer(
    query,
    queryTokens,
    answerKey,
    answerData
  ) {
    if (
      !answerData ||
      typeof answerData !== "object"
    ) {
      return {
        score: 0,
        reasons: []
      };
    }

    const question =
      answerData.question || "";

    const answer =
      answerData.answer ||
      answerData.response ||
      "";

    const keywords =
      this.getKeywords(answerData);

const examples =
  Array.isArray(answerData.examples)
    ? answerData.examples
    : [];


    const normalizedQuery =
      this.normalize(query);

    const normalizedQuestion =
      this.normalize(question);

    const questionTokens =
      this.tokenize(question);

    const answerTokens =
      this.tokenize(answer);

    const keyTokens =
      this.tokenize(
        String(answerKey || "")
          .replace(/_/g, " ")
      );

    let score = 0;
    const reasons = [];

    /*
     * Coincidencia exacta con la pregunta.
     */
    if (
      normalizedQuery &&
      normalizedQuestion &&
      normalizedQuery === normalizedQuestion
    ) {
      score += 100;
      reasons.push(
        "coincidencia exacta con question"
      );
    }

    /*
     * La consulta aparece dentro de la pregunta
     * o la pregunta aparece dentro de la consulta.
     */
    if (
      normalizedQuery.length > 5 &&
      normalizedQuestion.length > 5 &&
      (
        normalizedQuestion.includes(
          normalizedQuery
        ) ||
        normalizedQuery.includes(
          normalizedQuestion
        )
      )
    ) {
      score += 35;
      reasons.push(
        "coincidencia parcial de frase"
      );
    }

    /*
     * Coincidencias con palabras de la pregunta.
     */
    const questionMatches =
      this.countMatches(
        queryTokens,
        questionTokens
      );

    if (questionMatches > 0) {
      score += questionMatches * 12;

      reasons.push(
        `${questionMatches} coincidencia(s) con question`
      );
    }

    /*
     * Coincidencias con keywords explícitas.
     */
    const keywordMatches =
      this.countMatches(
        queryTokens,
        keywords
      );

    if (keywordMatches > 0) {
      score += keywordMatches * 18;

      reasons.push(
        `${keywordMatches} coincidencia(s) con keywords`
      );
    }

/*
 * Coincidencias con ejemplos de consultas reales.
 */
examples.forEach((example) => {

  const normalizedExample =
    this.normalize(example);

  const exampleTokens =
    this.tokenize(example);

  /*
   * Coincidencia exacta con un ejemplo.
   */
  if (
    normalizedQuery &&
    normalizedExample &&
    normalizedQuery === normalizedExample
  ) {
    score += 90;

    reasons.push(
      "coincidencia exacta con example"
    );

    return;
  }

  /*
   * Coincidencia parcial con palabras del ejemplo.
   */
  const exampleMatches =
    this.countMatches(
      queryTokens,
      exampleTokens
    );

  if (exampleMatches > 0) {
    score += exampleMatches * 20;

    reasons.push(
      `${exampleMatches} coincidencia(s) con examples`
    );
  }

});



    /*
     * Coincidencias con el answerKey.
     * Ejemplo: recursos_gratuitos.
     */
    const keyMatches =
      this.countMatches(
        queryTokens,
        keyTokens
      );

    if (keyMatches > 0) {
      score += keyMatches * 14;

      reasons.push(
        `${keyMatches} coincidencia(s) con answerKey`
      );
    }

    /*
     * La respuesta completa aporta menor peso.
     * Evita que un texto largo gane solamente
     * por contener muchas palabras comunes.
     */
    const answerMatches =
      this.countMatches(
        queryTokens,
        answerTokens
      );

    if (answerMatches > 0) {
      score += answerMatches * 3;

      reasons.push(
        `${answerMatches} coincidencia(s) con answer`
      );
    }

    return {
      score,
      reasons
    };
  },

  /*
   * Busca la intención más probable.
   *
   * Uso:
   *
   * AIONIntent.find(
   *   "¿Qué materiales tienen?",
   *   AIONConversation.data
   * );
   */
  find(query, knowledgeData) {
    const cleanQuery =
      String(query || "").trim();

    const answers =
      knowledgeData?.answers;

    if (!cleanQuery) {
      return {
        matched: false,
        answerKey: null,
        confidence: 0,
        score: 0,
        reason: "Consulta vacía."
      };
    }

    if (
      !answers ||
      typeof answers !== "object"
    ) {
      return {
        matched: false,
        answerKey: null,
        confidence: 0,
        score: 0,
        reason:
          "El conocimiento no contiene answers."
      };
    }

    const queryTokens =
      this.tokenize(cleanQuery);

    if (!queryTokens.length) {
      return {
        matched: false,
        answerKey: null,
        confidence: 0,
        score: 0,
        reason:
          "La consulta no contiene términos suficientes."
      };
    }

    const candidates =
      Object.entries(answers)
        .map(([answerKey, answerData]) => {

          const result =
            this.scoreAnswer(
              cleanQuery,
              queryTokens,
              answerKey,
              answerData
            );

          return {
            answerKey,
            score: result.score,
            reasons: result.reasons,
            question:
              answerData?.question || "",
            answer:
              answerData?.answer ||
              answerData?.response ||
              ""
          };

        })
        .sort(
          (a, b) =>
            b.score - a.score
        );

    const best =
      candidates[0];

    const second =
      candidates[1];

    if (!best || best.score <= 0) {
      return {
        matched: false,
        answerKey: null,
        confidence: 0,
        score: 0,
        reason:
          "No se encontraron coincidencias.",
        candidates:
          candidates.slice(0, 3)
      };
    }

    /*
     * Diferencia entre la primera y segunda opción.
     * Ayuda a detectar resultados ambiguos.
     */
    const scoreDifference =
      best.score -
      (second?.score || 0);

    /*
     * Confianza aproximada entre 0 y 1.
     * Todavía no decide ni ejecuta ninguna acción.
     */
    let confidence =
      Math.min(
        best.score / 70,
        1
      );

    if (
      second &&
      scoreDifference < 8
    ) {
      confidence *= 0.7;
    }

    confidence =
      Number(
        confidence.toFixed(2)
      );

    /*
     * Umbral conservador.
     * Al ser una primera versión, priorizamos
     * no afirmar una intención dudosa.
     */
    const matched =
      best.score >= 12 &&
      confidence >= 0.35;

    return {
      matched,
      answerKey:
        matched
          ? best.answerKey
          : null,
      confidence,
      score: best.score,
      question: best.question,
      answer: best.answer,
      reasons: best.reasons,
      alternatives:
        candidates
          .slice(1, 4)
          .map((candidate) => ({
            answerKey:
              candidate.answerKey,
            score:
              candidate.score,
            question:
              candidate.question
          }))
    };
  }
};

window.AIONIntent = AIONIntent;

console.log(
  "AION Intent Engine™ v1.0 Ready"
);