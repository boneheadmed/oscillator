ig.module( 
	'plugins.oscillator.oscillator' 
)
.requires(
	'impact.impact',
  'impact.timer'
)
.defines(function(){

ig.Oscillator = ig.Class.extend({
    
    //Stores the two different times that the oscillator will be cycling
    //through. times[0] is the first half of the phase and times[1] is the 
    //second half of the phase. The length of both phases is one cycle.
    times: [],

    
    maxCycles: -1,     //Max number of cycles. -1 is infinite.
    totalTime: 0,      //The total time it will take to complete all cycles.
    cycleTime: 0,      //The time period of one full cycle.
    completed: false,  //Notes if all cycles have been completed.

    init: function(times, cycles) {
            this.oscTimer = new ig.Timer();
            this.set(times, cycles);
    },

    set: function(times, cycles) {
            this.completed = false;
            if (times.constructor === (new Array).constructor){
                this.times = times; 
            }else{
                this.times.push(times);
                this.times.push(times);
            }
            this.cycleTime = this.times[0] + this.times[1];
            if (typeof cycles == "undefined")
                cycles = -1;
            this.maxCycles = cycles;
            if (this.maxCycles != -1)
                this.totalTime = this.maxCycles * this.cycleTime;
            else
                this.totalTime = 0;
            this.oscTimer.reset();
    },

    delta: function() {
             return this.oscTimer.delta();
    },

    currentCycle: function() {
                    //Return the current cycle #, starting with 1.
                    //If all cycles are completed then return -1.
                    if (this.completed)
                        return -1;
                    var delta = this.delta();
                    if (delta > this.totalTime && this.totalTime != 0){
                        this.completed = true;
                        return -1;
                    }
                    return (delta/this.cycleTime).ceil();
    },

    phase: function() {
             //Return the current phase in the cycle.
             //0: First portion of cycle.
             //1: Second portion of cycle.
             //-1: All cycles completed.
             if (this.completed)
                 return -1;
             var delta = this.delta();
             if (delta > this.totalTime && this.totalTime != 0){
                 this.completed = true;
                 return -1;
             }
             var remainder = delta % this.cycleTime;
             return (remainder > this.times[0]) ? 1 : 0;
    },

    reset: function() {
             //Reset the oscillator with the last settings remaining unchanged.
             this.completed = false;
             this.oscTimer.reset();
    }

});

});



