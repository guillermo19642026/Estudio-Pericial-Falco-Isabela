/* =========================================================
   AION Guide™ v2.0
   Controlado por Interaction Manager™
========================================================= */

const AIONGuide = {

  container: null,
  messageBox: null,

  knowledge: null,
  interaction: null,

  initAttempts: 0,
  showTimer: null,

  init() {
    this.waitForFloat();
  },

  waitForFloat() {

    this.container = document.querySelector(".aion-float");

    if (!this.container) {

      this.initAttempts++;

      if (this.initAttempts < 40) {
        setTimeout(() => this.waitForFloat(),250);
      }

      return;
    }

    this.knowledge = window.KnowledgeEngine
      ? new KnowledgeEngine()
      : null;

    this.interaction = window.InteractionManager
      ? new InteractionManager({
          minDelay:5000,
          cooldown:30000
      })
      : null;

    this.createMessageBox();

this.container.addEventListener("click", () => {
  this.showContextMessage();
});


    this.start();
  },

  start(){

    this.loop();

  },

  loop(){

    clearTimeout(this.showTimer);

    this.showTimer=setTimeout(()=>{

        this.trySpeak();

        this.loop();

    },4000);

  },

  createMessageBox(){

    this.messageBox=document.createElement("div");

    this.messageBox.className="aion-guide-message";

    this.container.appendChild(this.messageBox);

  },

  async trySpeak(){

    if(!this.interaction) return;

    const page=window.location.pathname;

    if(!this.interaction.canSpeak(page))
        return;

    this.showContextMessage();

  },

  async showContextMessage(){

    let text="Estoy disponible si necesitás orientación.";

    if(this.knowledge){

        const data=await this.knowledge.getCurrentPageKnowledge();

        if(data?.greeting)
            text=data.greeting;

    }

    this.messageBox.textContent=text;

    this.messageBox.classList.add("is-visible");

    if(window.AionFloat){

        AionFloat.setState("speaking");

        setTimeout(()=>{

            AionFloat.setState("idle");

        },2200);

    }

    setTimeout(()=>{

        this.hide();

    },7000);

  },

  hide(){

      this.messageBox.classList.remove("is-visible");

  }

};

document.addEventListener("DOMContentLoaded",()=>{

    AIONGuide.init();

});