/* =========================================================
   AION Presence Engine™ v1.0
   Living Presence Project
========================================================= */

class PresenceEngine {

    constructor(){

        this.state="idle";

        this.mood={

            calm:1,

            curiosity:0,

            attention:0,

            thinking:false,

            speaking:false,

            sleeping:false,

            warning:false

        };

    }

    setState(state){

        this.state=state;

    }

    setMood(property,value){

        if(this.mood[property]===undefined)return;

        this.mood[property]=value;

    }

    getMood(){

        return structuredClone(this.mood);

    }

    curiosity(level=.5){

        this.mood.curiosity=level;

        this.mood.attention=.8;

    }

    focus(level=1){

        this.mood.attention=level;

    }

    relax(){

        this.mood.calm=1;

        this.mood.attention=.2;

        this.mood.curiosity=.1;

    }

    think(active=true){

        this.mood.thinking=active;

    }

    speak(active=true){

        this.mood.speaking=active;

    }

    warning(active=true){

        this.mood.warning=active;

    }

    sleep(active=true){

        this.mood.sleeping=active;

    }

}

window.PresenceEngine=PresenceEngine;