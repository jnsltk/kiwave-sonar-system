<script>
    'use strict';

    import { createEventDispatcher } from 'svelte';
                
    export let scanning = false; // SCANNING -> status: true   NOT SCANNING -> status: false (by default).       

    const dispatch = createEventDispatcher();

    function start() {
        //TODO: probably this method will need some updates for mqtt protocol
        scanning = true;

        dispatch('start',{
            scanning: true
        });
        
    }

    function stop() {
        scanning = false;

        dispatch('stop',{
            scanning: false
        });
    }

</script>

<main>
    {#if scanning === false}
        <button class='my-button' on:click= {start}>START  &nbsp;SCANNING</button>
    {:else}
        <button class='my-button' on:click={stop}>STOP &nbsp;SCANNING</button>
    {/if}
</main>

<style>
    :global(*){
        margin: 0;
        padding: 0;
        box-sizing: border-box; 
    }

    .my-button{
        color: #F5F5F5;
        background-color: #333333;
        width: 400px;
        height: 100px;
        border-radius: 10px;
        border: none;
        text-align: center;
        font-size: 1em;
        font-family: 'IBM Plex Sans';
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .my-button:hover{
        opacity: 0.8;
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
    }

    
    @media only screen and (max-width: 600px){
        .my-button{
            width: 90%;
            font-size: 20px;
        }
    }


</style>