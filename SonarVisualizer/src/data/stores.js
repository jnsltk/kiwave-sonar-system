import { writable } from "svelte/store";


export let sonarStore=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "rDeg1": "0", //Degree of the sonar
        "rDeg2": "0", //Distance of sonar      
        "rRange1": "-1",
        "rRange2": "-1",
        "isTracking":false,
        "trackingReportedAt":0,
        "ts":0 //Reported at timestamp
    },    
    "sonarStatus":{
        "lastCommandReceived":true,
        "isOnline": false
    }
})

export let sonarCommands=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "runSonar":false,
        "trackMode":true,
        "sDeg1":"0",
        "sDeg2":"180",        
        "sRange": "350",
        "ts":0 //Reported at timestamp
    },

})



export const notificationStore = writable(true); // default state is true


export let darkModeSwitch=writable({
    //Data for darkmode switch
    "isDark" : false
})

