/* =========================
   AION RENDERER ENGINE®
========================= */

const AionRenderer = {

    pulse:0,

    heartbeat(){

        const t=(Date.now()%2200)/2200;

        if(t<0.08){
            return Math.sin((t/.08)*Math.PI)*0.55;
        }

        if(t>.18 && t<.27){
            return Math.sin(((t-.18)/.09)*Math.PI)*0.38;
        }

        return 0;

    },

    getExpansion(){

        const heart=this.heartbeat();

        return 1+(heart*.18)+(this.pulse*.35);

    },

    speak(strength=1){

        this.pulse=strength;

    },

    update(){

        if(this.pulse>0){
            this.pulse*=0.92;
        }

    }

};