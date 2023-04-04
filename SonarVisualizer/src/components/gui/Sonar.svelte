<script>
    /*
    This file shall bind all separate components into one single component.
    */
    
    import { mqttSend, mqttSubscribe, initMqtt } from "../mqtt/MqttHandler";
    import Console from "./Console.svelte";
    import RadarScreen from "./RadarScreen.svelte";
    import ToggleButton from "./ToggleButton.svelte";

    //Setting the launch mqtt function to a variable
    const mqtt=async function launchMqtt(){
        await initMqtt("wss://test.mosquitto.org:8081")
    }

    /*
    * When creating a new function that has an effect on end functionality, put it into this array.
    * That way we can notify end user when tool is ready by awaiting all promises to settle.
    */
    Promise.all([mqtt]).then(async function(){
        console.log("Tool ready!");
    }).catch(async function(e){
        throw Error("Unsettled promise! "+e)
    })


</script>

<!-- The order is arbitrary, feel free to modify. Ideally, create columns in separate divs -->
<RadarScreen/>
<Console/>
<ToggleButton/>


<style>


</style>