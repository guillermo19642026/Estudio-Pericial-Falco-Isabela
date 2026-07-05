/* =========================
   CONSULTA AL CORPUS FALCO®
========================= */

const consultaInput = document.getElementById("consultaInput");
const consultarBtn = document.getElementById("consultarCorpusBtn");
const consultaProcess = document.getElementById("consultaProcess");
const consultaResult = document.getElementById("consultaResult");
const resultTitle = document.getElementById("resultTitle");
const resultBody = document.getElementById("resultBody");
const resultSources = document.getElementById("resultSources");
const suggestionButtons = document.querySelectorAll(".consulta-suggestions button");

let corpusNodes = [];

async function initConsultaCorpus() {
  const corpus = await FalcoCorpusLoader.load("../data/corpus-demo.json");
  corpusNodes = corpus.nodos || [];
}

initConsultaCorpus();


CorpusGraph.init("consultaCanvas");


ResearchVisualizer.init("#researchVisualizer");


suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    consultaInput.value = button.textContent.trim();
    consultaInput.focus();
  });
});

consultarBtn.addEventListener("click", () => {
  const query = consultaInput.value.trim();

  if (!query) {
    consultaInput.focus();
    return;
  }

  runCorpusConsultation(query);
});

async function runCorpusConsultation(query) {
  consultaProcess.classList.add("active");
  consultaResult.classList.remove("active");

  resultTitle.textContent = "Consultando...";
  resultBody.innerHTML = "";
  resultSources.innerHTML = "";

 ResearchVisualizer.reset();

await animateResearch();

const investigation = ResearchEngine.investigate(query, corpusNodes);

CorpusGraph.setNodes(investigation.sources || []);

ResearchVisualizer.showSources(investigation.sources || []);

await new Promise((resolve) => setTimeout(resolve, 900));

const response = ResponseEngine.build(investigation);

  renderEngineResponse(response);

  consultaProcess.classList.remove("active");
  consultaResult.classList.add("active");

 setTimeout(() => {
  consultaResult.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}, 1400);
}

function renderEngineResponse(response) {
  resultTitle.textContent = response.title;
  resultBody.innerHTML = response.html;
  resultSources.innerHTML = "";

  if (!response.sources || !response.sources.length) {
    resultSources.innerHTML = "<p>No hay conocimientos utilizados.</p>";
    return;
  }

  response.sources.forEach((source) => {
    const item = document.createElement("div");
    item.className = "source-item";

    item.innerHTML = `
      <strong>${source.tipo || "Unidad"}</strong>
      ${source.titulo || "Sin título"}
    `;

    resultSources.appendChild(item);
  });
}


async function animateResearch(){

    const steps=[

        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4")

    ];

    steps.forEach(step=>{

        step.classList.remove("done");
        step.classList.remove("active");

    });

    for(const step of steps){

        step.classList.add("active");

        await new Promise(resolve=>setTimeout(resolve,700));

        step.classList.remove("active");

        step.classList.add("done");

        if (window.CorpusGraph) {
  CorpusGraph.activateNext();
}

    }

}