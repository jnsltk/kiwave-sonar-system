import { writable } from "svelte/store";

export let sonarStore=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "rDeg1": "125", //Degree of the sonar
        "rDeg2": "24.56", //Distance of sonar      
        "rRange1": "350",
        "rRange2": "350",
        "ts":0 //Reported at timestamp
    },
})

export let sonarCommands=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "runSonar":false,
        "sDeg1":"0",
        "sDeg2":"180",        
        "sRange": "350",
        "ts":0 //Reported at timestamp
    },
})