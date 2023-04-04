# Svelte Project Structure


- /src :contains all the source files for the project
- /node_modules :contains all external libraries for the project
- /assets :shall contain media files: *.png, *.jpeg, etc.
- /components :shall contain Svelte components
- app.css :shall only contain **global** styling. In all cases, ensure to apply styling only in respective component.
- App.svelte :contains the root component for the Svelte Application. Shall not contain HTML code related to the function of the application and should utilize components, instead.
- main.js :contains the js code to inject the application into the browser. No need to touch this file.
- index.html :contains raw HTML code. Nothing shall be added here atm, except for maybe changing the title tag, importing fonts, or other external ES6 modules

# Naming conventions

- *.svelte files should start with a capital letter and use camelcase. Example: RadarScreen.svelte


# Running the project

**If this is the first time running the project, ensure you have the necessary libraries by running ``npm i```**

**Run project by running**

```
npm run dev
```

# Utilizing Svelte Stores

If you need to share data across components one option is to use the predefined `sonarStore`. Not all components have it imported. See example `RadarScreen.svelte` on how to import it.
sonarStore acts as a JSON object accessible by components that import it. Before using it, complete tutorial: https://svelte.dev/tutorial/writable-stores

# Using the MQTT integration

- Before sending/receiving any data, you need to initialize the MQTT connection. This can be done by calling the exported function: `initMqtt()` from `MqttHandler.svelte`
- To receive data you need to call the `mqttSubscribe(topic, callback)` function and pass a **String** as the topic argument and a function that is executed everytime a message is received as the callback function.
  The `mqttSubscribe` function returns two parameters to the callback function: `pkt` and `pkt.json()`

  Example callback function:
    ```
        async function(pkt,pktJson){
            console.log(pkt);
            console.log(pktJson);
        }
    ```

  Example call to the `mqttSubscribe(topic,callback)` function:
  ```
    async function exampleFunction(){
        mqttSubscribe("exampletopic",async function(pkt,pktJson){
            console.log(pkt);
            console.log(pktJson);
        })
    }
  ```


