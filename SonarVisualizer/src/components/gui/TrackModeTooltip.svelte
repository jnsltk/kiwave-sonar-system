<div class="tooltip" data-tooltip = "When the radar is in trackmode, it finds an object in the range and starts tracking/following it, ignoring all other objects.">         
    <div class="questionmark">?</div>
</div>

<style>

    .tooltip {
        border: solid;
        border-width: 1px;
        border-color: #c3c1c1;
        border-radius: 20px;
        height: 20px;
        width: 20px;
        margin-left: 4px;
        text-align: center;
        color: #c3c1c1;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
    
    }

    .tooltip::after{
        padding: 5px;
        transform: translate(-100px, -30px);
        border-radius: 10px;
        background-color: #d5d7d4;
        color: black;
        font-size: 12px;
        width: 155px;
        text-align: center;
        flex-wrap: wrap;
        box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    }


    .tooltip:hover:after {
        content: attr(data-tooltip);

    }

    .tooltip:hover .questionmark {
    display: none;
    }

    @media screen and (max-width:1300px){
       .tooltip::after{
        transform: translate(-100px, -30px);
       }
    }

    @media screen and (max-width:1000px){
       .tooltip::after{
        transform: translate(-120px, -30px);
       }
    }
</style>
