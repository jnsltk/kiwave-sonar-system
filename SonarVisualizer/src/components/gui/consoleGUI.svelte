<script>
    export let temperature = 12;
    export let soundspeed = 340;
    export let objects = [
        {
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },
    {
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },
    {
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },
    {
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    },{
        "deg": "125", //Degree of the sonar
        "dist": "24.56", //Distance of sonar
        "ts":0 //Reported at timestamp
    }
    ];
</script>

<main>
    <div class="terminalbox">
        <p>TEMP: {temperature} &#x2103</p>
        <p>SOUND SPEED: {soundspeed} m/s</p><br>
        <p>Found Objects:</p> 
        {#each objects as object}
            <p>Deg: {object.deg} Distance: {object.dist} Timestamp: {object.ts}</p>
        {/each}
    </div>
</main>

<style>
    div.terminalbox{
        background-color: #474646;
        color: #ffffff;
        padding: 10px 10px;
        width: 350px;
        border-radius: 10px;
        overflow: auto;
        height: 195px;
         
    }

    p{
        margin-top: 4px;
    }

    div.terminalbox::-webkit-scrollbar {
    width: 12px;
    }

    div.terminalbox::-webkit-scrollbar-track {
    background: #2f2f2f;
    border-radius: 10px;
    }

    div.terminalbox::-webkit-scrollbar-thumb {
    background: #585858;
    border-radius: 10px;
    }

    div.terminalbox::-webkit-scrollbar-thumb:hover {
    background: #555;
    }

</style>