# Private MQTT Broker

In order to have better performance it is necessary to use a private MQTT broker instead of the publicly availabler ones. As such, we have created one using a VPS server.

## Connection details for Websocket protocol

### URL

```mqtt.jnsl.tk```

### Port:
```443```

### Username:
```kiwi```

### Password:
```verbally-scam-friday-idly```

## Connection details for HTTP protocol

### URL

```mqtt-http.jnsl.tk```

### Port:
```1883```

### Username and password:
*Same as above*

## Testing the connection:

The connection that utilizes the wss protocol can be tested using this [website](http://tools.emqx.io/recent_connections).

The HTTP connection can be tested with mosquitto_sub and mosquitto pub as follows:
```sh
mosquitto_sub -h "mqtt-http.jnsl.tk" -t test -u "kiwi" -P "verbally-scam-friday-idly"

mosquitto_pub -h "mqtt-http.jnsl.tk" -t test -u "kiwi" -P "verbally-scam-friday-idly" -m "hello"
```