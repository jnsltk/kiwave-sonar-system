<script>
import { connectMqtt } from "./MqttHandler.svelte";
var animals=["monkey","fish","donkey","banana"]
var randomAnimal=animals[1]
setTimeout(async function(){
    randomAnimal="bob";
},5000)


for (let i = 0; i < 25; i++) {
    console.log("bob");
}
let x=10;
while(x>0){
    x--;
}
console.warn("hello");
console.error("hello");
if(true==true){
    console.log("test");
}

connectMqtt();
</script>

<h1>I am a {randomAnimal}</h1>

<style>

    h1{
        color :red;
        font-size: 24px;
    }
</style>
