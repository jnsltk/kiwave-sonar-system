import { writable } from "svelte/store";

export let sonarStore=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "sRange": 0, //Range set by the user
        "sStartDegree": 0, //Start degree set by the user
        "sEndDegree": 0, //End degree set by the user
        "ts":0 //Reported at timestamp
    },
    "metadata":{}
})