/* =========================================================
   AION Perception Engine™ v1.0
   Observa el entorno antes del Brain
========================================================= */

class PerceptionEngine {

    constructor(brain){

        this.brain = brain;

        this.lastActivity = Date.now();

    }

    init(){

        this.observeMouse();

        this.observeKeyboard();

        this.observeClicks();

        this.observeIdle();

    }

    observeMouse(){

        window.addEventListener("mousemove",()=>{

            this.lastActivity = Date.now();

            this.brain.handle("user:move");

        });

    }

    observeKeyboard(){

        window.addEventListener("keydown",()=>{

            this.lastActivity = Date.now();

            this.brain.handle("user:typing");

        });

    }

    observeClicks(){

        window.addEventListener("click",(e)=>{

            this.lastActivity = Date.now();

            this.brain.handle("user:click",{

                x:e.clientX,

                y:e.clientY

            });

        });

    }

    observeIdle(){

        setInterval(()=>{

            if(Date.now()-this.lastActivity>12000){

                this.brain.handle("user:idle");

            }

        },1000);

    }

}

window.PerceptionEngine = PerceptionEngine;