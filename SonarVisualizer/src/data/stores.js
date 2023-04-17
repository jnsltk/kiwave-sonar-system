import { writable } from "svelte/store";

export let sonarStore=writable({
    //Data for sonar as per agreed description
    "sonarData":{
        "deg1": "125", //Degree of the sonar
        "dist1": "24.56", //Distance of sonar
        "deg2": "125", //Degree of the sonar
        "dist2": "24.56", //Distance of sonar
        "range": "350",
        "ts":0 //Reported at timestamp
    },
    "metadata":{}
})