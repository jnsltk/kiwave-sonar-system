/*
Imported as local CDN from: https://github.com/shanewholloway/js-u8-mqtt
*/

function encode_varint(n, a=[]) {
    do {
      const ni = n & 0x7f;
      n >>>= 7;
      a.push( ni | (0===n ? 0 : 0x80) );
    } while (n > 0)
    return a
  }
  
  
  /*
  export function decode_varint_loop(u8, i=0) {
    let i0 = i
    let shift = 0, n = (u8[i] & 0x7f)
    while ( 0x80 & u8[i++] )
      n |= (u8[i] & 0x7f) << (shift += 7)
  
    return [n, i, i0]
  }
  */
  
  
  function decode_varint$1(u8, i=0) {
    let i0 = i;
    // unrolled for a max of 4 chains
    let n = (u8[i] & 0x7f) <<  0;
    if ( 0x80 & u8[i++] ) {
      n |= (u8[i] & 0x7f) <<  7;
      if ( 0x80 & u8[i++] ) {
        n |= (u8[i] & 0x7f) << 14;
        if ( 0x80 & u8[i++] ) {
          n |= (u8[i] & 0x7f) << 21;
        }
      }
    }
    return [n, i, i0]
  }
  
  const mqtt_props = /* #__PURE__ */
    init_mqtt_props();
  
  function init_mqtt_props() {
    let mqtt_props = new Map();
  
    let entries = [
      [ 0x01, 'u8',   'payload_format_indicator'],
      [ 0x02, 'u32',  'message_expiry_interval'],
      [ 0x03, 'utf8', 'content_type'],
      [ 0x08, 'utf8', 'response_topic'],
      [ 0x09, 'bin',  'correlation_data'],
      [ 0x0B, 'vint', 'subscription_identifier'],
      [ 0x11, 'u32',  'session_expiry_interval'],
      [ 0x12, 'utf8', 'assigned_client_identifier'],
      [ 0x13, 'u16',  'server_keep_alive'],
      [ 0x15, 'utf8', 'authentication_method'],
      [ 0x16, 'bin',  'authentication_data'],
      [ 0x17, 'u8',   'request_problem_information'],
      [ 0x18, 'u32',  'will_delay_interval'],
      [ 0x19, 'u8',   'request_response_information'],
      [ 0x1A, 'utf8', 'response_information'],
      [ 0x1C, 'utf8', 'server_reference'],
      [ 0x1F, 'utf8', 'reason_string'],
      [ 0x21, 'u16',  'receive_maximum'],
      [ 0x22, 'u16',  'topic_alias_maximum'],
      [ 0x23, 'u16',  'topic_alias'],
      [ 0x24, 'u8',   'maximum_qos'],
      [ 0x25, 'u8',   'retain_available'],
      [ 0x26, 'pair', 'user_properties', {op: 'kv_obj'}],
      [ 0x27, 'u32',  'maximum_packet_size'],
      [ 0x28, 'u8',   'wildcard_subscription_available'],
      [ 0x29, 'u8',   'subscription_identifiers_available', {op: 'u8_vec'}],
      [ 0x2A, 'u8',   'shared_subscription_available'],
    ];
  
    for (let [id, type, name, extra] of entries) {
      let prop_obj = {id, type, name, ...extra};
      mqtt_props.set(prop_obj.id, prop_obj);
      mqtt_props.set(prop_obj.name, prop_obj);
    }
  
    return mqtt_props
  }
  
  class U8_Reason extends Number {
    static of(v, pkt_kind, by_kind) {
      let self = new this(v);
      self.reason = by_kind?.[pkt_kind]?.get(v) || pkt_kind;
      return self
    }
  }
  
  class mqtt_reader_v4 {
    static of(buf) { return this.prototype.of(buf) }
    of(buf) {
      let step = (width, k) => (k=0|step.k, step.k=k+width, k);
      return {__proto__: this, buf, step}
    }
  
    has_more() {
      return this.buf.byteLength > (this.step.k|0)
    }
  
    u8() {
      return this.buf[this.step(1)]
    }
  
    u16() {
      let {buf, step} = this, i = step(2);
      return (buf[i]<<8) | buf[i+1]
    }
  
    u32() {
      let {buf, step} = this, i = step(4);
      return (buf[i]<<24) | (buf[i+1]<<16) | (buf[i+2]<<8) | buf[i+3]
    }
  
    vint() {
      let {buf, step} = this;
      let [n, vi, vi0] = decode_varint$1(buf, step.k|0);
      step(vi - vi0);
      return n
    }
  
    bin() {
      let {buf, step} = this, i = step(2);
      let len = (buf[i]<<8) | buf[i+1];
      i = step(len);
      return buf.subarray(i, i+len)
    }
  
    utf8() { return new TextDecoder('utf-8').decode(this.bin()) }
    pair() { return [ this.utf8(), this.utf8() ] }
  
    flags(FlagsType) { return new FlagsType(this.buf[this.step(1)]) }
  
    reason(pkt_kind) {
      let v = this.buf[this.step(1)];
      if (null != v)
        return U8_Reason.of(v, pkt_kind, this._reasons_by)
    }
  
    flush() {
      let {buf, step} = this;
      this.step = this.buf = null;
      return buf.subarray(step.k|0)
    }
  
  }
  
  class mqtt_reader_v5$1 extends mqtt_reader_v4 {
    props() {
      let {buf, step} = this;
      let [n, vi, vi0] = decode_varint$1(buf, step.k|0);
      step(n + vi - vi0);
      if (0 === n) return null
  
      let res={}, fork = this.of(buf.subarray(vi, step.k|0));
      while (fork.has_more()) {
        let pt = mqtt_props.get( fork.u8() )
          , value = fork[pt.type]();
        res[pt.name] = ! pt.op ? value
          : fork[pt.op](res[pt.name], value);
      }
      return res
    }
  
    kv_obj(obj=Object.create(null), [k,v]) {
      obj[k] = v;
      return obj
    }
    u8_vec(vec=[], u8) {
      vec.push(u8);
      return vec
    }
  
    /*
    vbuf() {
      let {buf, step} = this
      let [n, vi, vi0] = decode_varint(buf, step.k|0)
      step(n + vi - vi0)
      return 0 === n ? null
        : buf.subarray(vi, step.k|0)
    }
    */
  }
  
  function mqtt_reader_info(mqtt_reader, ... info_fn_list) {
    mqtt_reader = class extends mqtt_reader {
      static reasons(pkt_type, ...reason_entries) {
        let proto = this.prototype;
        proto._reasons_by = {... proto._reasons_by};
  
        let lut = (proto._reasons_by[pkt_type] ||= new Map());
        for (let [u8, reason] of reason_entries)
          lut.set( u8, reason );
  
        return this
      }
    };
  
    for (let fn_info of info_fn_list)
      fn_info(mqtt_reader);
  
    return mqtt_reader
  }
  
  class mqtt_writer_v4 {
    static of() { return this.prototype.of() }
    of() { return {__proto__: this, $:[]} }
  
    static init() { return this }
  
    as_pkt(pkt_id) { return this.pack([pkt_id]) }
  
    push(...z) { this.$.push(...z); }
    pack(hdr) {
      let z, i, n=0, parts = this.$;
      this.$ = false;
      for (z of parts) n += z.length;
  
      hdr = encode_varint(n, hdr);
      i = hdr.length;
  
      let pkt = new Uint8Array(i + n);
      pkt.set(hdr, 0);
      for (z of parts) {
        pkt.set(z, i);
        i += z.length;
      }
      return pkt
    }
  
    u8(v) { this.push([ v & 0xff ]); }
    u16(v) { this.push([ (v>>>8) & 0xff, v & 0xff ]); }
    u32(v) { this.push([ (v>>>24) & 0xff, (v>>>16) & 0xff, (v>>>8) & 0xff, v & 0xff ]); }
    vint(v) { this.push( encode_varint(v) );}
  
    bin(u8_buf) {
      if (! u8_buf) return this.u16(0)
      if ('string' === typeof u8_buf)
        return this.utf8(u8_buf)
  
      if (u8_buf.length !== u8_buf.byteLength)
        u8_buf = new Uint8Array(u8_buf);
  
      this.u16(u8_buf.byteLength);
      this.push(u8_buf);
    }
  
    utf8(v) {
      let u8_buf = new TextEncoder('utf-8').encode(v);
      this.u16(u8_buf.byteLength);
      this.push(u8_buf);
    }
    pair(k,v) { this.utf8(k); this.utf8(v); }
  
    flags(v, enc_flags, b0=0) {
      if (undefined !== v && isNaN(+v))
        v = enc_flags(v, 0);
  
      v |= b0;
      this.push([v]);
      return v
    }
  
    reason(v) { this.push([v | 0]); }
  
    flush(buf) {
      if (null != buf)
        this.push(
          'string' === typeof buf
            ? new TextEncoder('utf-8').encode(buf)
            : buf );
  
      this.push = false;
    }
  }
  
  
  class mqtt_writer_v5 extends mqtt_writer_v4 {
    props(props) {
      if (! props)
        return this.u8(0)
  
      if (! Array.isArray(props))
        props = props.entries
          ? Array.from(props.entries())
          : Object.entries(props);
  
      if (0 === props.length)
        return this.u8(0)
  
      let fork = this.of();
      for (let [name, value] of props) {
        let pt = mqtt_props.get(name);
        fork[pt.op || 'one'](value, pt);
      }
      this.push(fork.pack());
    }
  
    one(value, pt) {
      this.u8(pt.id);
      this[pt.type](value);
    }
    kv_obj(obj, pt) {
      for (let kv of Object.entries(obj)) {
        this.u8(pt.id);
        this.pair(kv);
      }
    }
    u8_vec(vec, pt) {
      for (let v of vec) {
        this.u8(pt.id);
        this.u8(v);
      }
    }
  }
  
  function mqtt_decode_connack(ns, mqtt_reader) {
    class _connack_flags_ extends Number {
      get session_present() { return this & 0x01 !== 0 }
    }
  
    return ns[0x2] = (pkt, u8_body) => {
      let rdr = mqtt_reader.of(u8_body);
  
      pkt.flags =
        rdr.flags(_connack_flags_);
  
      pkt.reason = rdr.reason(pkt.type);
      if (5 <= pkt.mqtt_level)
        pkt.props = rdr.props();
      return pkt }
  }
  
  
  function _connack_v4(mqtt_reader) {
    mqtt_reader.reasons('connack',
      // MQTT 3.1.1
      [ 0x00, 'Success'],
      [ 0x01, 'Connection refused, unacceptable protocol version'],
      [ 0x02, 'Connection refused, identifier rejected'],
      [ 0x03, 'Connection refused, server unavailable'],
      [ 0x04, 'Connection refused, bad user name or password'],
      [ 0x05, 'Connection refused, not authorized'],
    );
  }
  
  function _connack_v5(mqtt_reader) {
    _connack_v4(mqtt_reader);
  
    mqtt_reader.reasons('connack',
      // MQTT 5.0
      [ 0x81, 'Malformed Packet'],
      [ 0x82, 'Protocol Error'],
      [ 0x83, 'Implementation specific error'],
      [ 0x84, 'Unsupported Protocol Version'],
      [ 0x85, 'Client Identifier not valid'],
      [ 0x86, 'Bad User Name or Password'],
      [ 0x87, 'Not authorized'],
      [ 0x88, 'Server unavailable'],
      [ 0x89, 'Server busy'],
      [ 0x8A, 'Banned'],
      [ 0x8C, 'Bad authentication method'],
      [ 0x90, 'Topic Name invalid'],
      [ 0x95, 'Packet too large'],
      [ 0x97, 'Quota exceeded'],
      [ 0x99, 'Payload format invalid'],
      [ 0x9A, 'Retain not supported'],
      [ 0x9B, 'QoS not supported'],
      [ 0x9C, 'Use another server'],
      [ 0x9D, 'Server moved'],
      [ 0x9F, 'Connection rate exceeded'],
    );
  }
  
  function mqtt_decode_publish(ns, mqtt_reader) {
    return ns[0x3] = (pkt, u8_body) => {
      let {hdr} = pkt;
      pkt.dup = Boolean(hdr & 0x8);
      pkt.retain = Boolean(hdr & 0x1);
      let qos = pkt.qos = (hdr>>1) & 0x3;
  
      let rdr = mqtt_reader.of(u8_body);
      pkt.topic = rdr.utf8();
      if (0 !== qos)
        pkt.pkt_id = rdr.u16();
  
      if (5 <= pkt.mqtt_level)
        pkt.props = rdr.props();
  
      pkt.payload = rdr.flush();
      return pkt }
  }
  
  function mqtt_decode_puback(ns, mqtt_reader) {
    return ns[0x4] = (pkt, u8_body) => {
      let rdr = mqtt_reader.of(u8_body);
  
      pkt.pkt_id = rdr.u16();
      if (5 <= pkt.mqtt_level) {
        pkt.reason = rdr.reason(pkt.type);
        pkt.props = rdr.props();
      }
  
      return pkt }
  }
  
  
  function _puback_v5(mqtt_reader) {
    mqtt_reader.reasons('puback',
      // MQTT 5.0
      [ 0x00, 'Success'],
      [ 0x10, 'No matching subscribers'],
      [ 0x80, 'Unspecified error'],
      [ 0x83, 'Implementation specific error'],
      [ 0x87, 'Not authorized'],
      [ 0x90, 'Topic Name invalid'],
      [ 0x91, 'Packet identifier in use'],
      [ 0x97, 'Quota exceeded'],
      [ 0x99, 'Payload format invalid'],
    );
  }
  
  function _mqtt_decode_suback(mqtt_reader) {
    return (pkt, u8_body) => {
      let rdr = mqtt_reader.of(u8_body);
  
      pkt.pkt_id = rdr.u16();
      if (5 <= pkt.mqtt_level)
        pkt.props = rdr.props();
  
      let answers = pkt.answers = [];
      while (rdr.has_more())
        answers.push(
          rdr.reason(pkt.type) );
  
      return pkt }
  }
  
  function mqtt_decode_suback(ns, mqtt_reader) {
    return ns[0x9] = _mqtt_decode_suback(mqtt_reader)
  }
  
  function _suback_v4(mqtt_reader) {
    mqtt_reader.reasons('suback',
      // MQTT 3.1.1
      [ 0x00, 'Granted QoS 0'],
      [ 0x01, 'Granted QoS 1'],
      [ 0x02, 'Granted QoS 2'],
    );
  }
  
  function _suback_v5(mqtt_reader) {
    _suback_v4(mqtt_reader);
  
    mqtt_reader.reasons('suback',
      // MQTT 5.0
      [ 0x80, 'Unspecified error'],
      [ 0x83, 'Implementation specific error'],
      [ 0x87, 'Not authorized'],
      [ 0x8F, 'Topic Filter invalid'],
      [ 0x91, 'Packet Identifier in use'],
      [ 0x97, 'Quota exceeded'],
      [ 0x9E, 'Shared Subscriptions not supported'],
      [ 0xA1, 'Subscription Identifiers not supported'],
      [ 0xA2, 'Wildcard Subscriptions not supported'],
    );
  }
  
  function mqtt_decode_unsuback(ns, mqtt_reader) {
    return ns[0xb] = _mqtt_decode_suback(mqtt_reader)
  }
  
  function _unsuback_v4(mqtt_reader) {
    mqtt_reader.reasons('unsuback',
      // MQTT 3.1.1
      [ 0x00, 'Success'],
      [ 0x11, 'No subscription existed'],
      [ 0x80, 'Unspecified error'],
      [ 0x83, 'Implementation specific error'],
      [ 0x87, 'Not authorized'],
      [ 0x8F, 'Topic Filter invalid'],
      [ 0x91, 'Packet Identifier in use'],
    );
  }
  
  function mqtt_decode_pingxxx(ns) {
    return ns[0xc] = ns[0xd] = pkt => pkt
  }
  
  function mqtt_decode_disconnect(ns, mqtt_reader) {
    return ns[0xe] = (pkt, u8_body) => {
      if (u8_body && 5 <= pkt.mqtt_level) {
        let rdr = mqtt_reader.of(u8_body);
        pkt.reason = rdr.reason(pkt.type);
        pkt.props = rdr.props();
      }
      return pkt }
  }
  
  
  function _disconnect_v5(mqtt_reader) {
    mqtt_reader.reasons('disconnect',
      // MQTT 5.0
      [ 0x00, 'Normal disconnection'],
      [ 0x04, 'Disconnect with Will Message'],
      [ 0x80, 'Unspecified error'],
      [ 0x81, 'Malformed Packet'],
      [ 0x82, 'Protocol Error'],
      [ 0x83, 'Implementation specific error'],
      [ 0x87, 'Not authorized'],
      [ 0x89, 'Server busy'],
      [ 0x8B, 'Server shutting down'],
      [ 0x8D, 'Keep Alive timeout'],
      [ 0x8E, 'Session taken over'],
      [ 0x8F, 'Topic Filter invalid'],
      [ 0x90, 'Topic Name invalid'],
      [ 0x93, 'Receive Maximum exceeded'],
      [ 0x94, 'Topic Alias invalid'],
      [ 0x95, 'Packet too large'],
      [ 0x96, 'Message rate too high'],
      [ 0x97, 'Quota exceeded'],
      [ 0x98, 'Administrative action'],
      [ 0x99, 'Payload format invalid'],
      [ 0x9A, 'Retain not supported'],
      [ 0x9B, 'QoS not supported'],
      [ 0x9C, 'Use another server'],
      [ 0x9D, 'Server moved'],
      [ 0x9E, 'Shared Subscriptions not supported'],
      [ 0x9F, 'Connection rate exceeded'],
      [ 0xA0, 'Maximum connect time'],
      [ 0xA1, 'Subscription Identifiers not supported'],
      [ 0xA2, 'Wildcard Subscriptions not supported'],
    );
  }
  
  function mqtt_decode_auth(ns, mqtt_reader) {
    return ns[0xf] = (pkt, u8_body) => {
      if ( 5 <= pkt.mqtt_level ) {
        let rdr = mqtt_reader.of(u8_body);
        pkt.reason = rdr.reason(pkt.type);
        pkt.props = rdr.props();
      }
      return pkt }
  }
  
  
  function _auth_v5(mqtt_reader) {
    mqtt_reader.reasons('auth',
      // MQTT 5.0
      [ 0x00, 'Success' ],
      [ 0x18, 'Continue authentication' ],
      [ 0x19, 'Re-authenticate' ],
    );
  }
  
  function mqtt_encode_connect(ns, mqtt_writer) {
    const _c_mqtt_proto = new Uint8Array([
      0, 4, 0x4d, 0x51, 0x54, 0x54 ]);
  
    const _enc_flags_connect = flags => 0
        | ( flags.reserved ? 0x01 : 0 )
        | ( (flags.will_qos & 0x3) << 3 )
        | ( flags.clean_start ? 0x02 : 0 )
        | ( flags.will_flag ? 0x04 : 0 )
        | ( flags.will_retain ? 0x20 : 0 )
        | ( flags.password ? 0x40 : 0 )
        | ( flags.username ? 0x80 : 0 );
  
    const _enc_flags_will = will => 0x4
        | ( (will.qos & 0x3) << 3 )
        | ( will.retain ? 0x20 : 0 );
  
    return ns.connect = ( mqtt_level, pkt ) => {
      let wrt = mqtt_writer.of(pkt);
  
      wrt.push(_c_mqtt_proto);
      wrt.u8( mqtt_level );
  
      let {will, username, password} = pkt;
      let flags = wrt.flags(
        pkt.flags,
        _enc_flags_connect,
        0 | (username ? 0x80 : 0)
          | (password ? 0x40 : 0)
          | (will ? _enc_flags_will(will) : 0) );
  
      wrt.u16(pkt.keep_alive);
  
      if (5 <= mqtt_level)
        wrt.props(pkt.props);
  
  
      wrt.utf8(pkt.client_id);
      if (flags & 0x04) { // .will_flag
        if (5 <= mqtt_level)
          wrt.props(will.props);
  
        wrt.utf8(will.topic);
        wrt.bin(will.payload);
      }
  
      if (flags & 0x80) // .username
        wrt.utf8(username);
  
      if (flags & 0x40) // .password
        wrt.bin(password);
  
      return wrt.as_pkt(0x10)
    }
  }
  
  function mqtt_encode_publish(ns, mqtt_writer) {
    return ns.publish = ( mqtt_level, pkt ) => {
      let qos = (pkt.qos & 0x3) << 1;
      let wrt = mqtt_writer.of(pkt);
  
      wrt.utf8(pkt.topic);
      if (0 !== qos)
        wrt.u16(pkt.pkt_id);
  
      if ( 5 <= mqtt_level) {
        wrt.props(pkt.props);
        wrt.flush(pkt.payload);
      } else {
        wrt.flush(pkt.payload);
      }
  
      return wrt.as_pkt(
        0x30 | qos | (pkt.dup ? 0x8 : 0) | (pkt.retain ? 0x1 : 0) )
    }
  }
  
  function mqtt_encode_puback(ns, mqtt_writer) {
    return ns.puback = ( mqtt_level, pkt ) => {
      let wrt = mqtt_writer.of(pkt);
  
      wrt.u16(pkt.pkt_id);
      if (5 <= mqtt_level) {
        wrt.reason(pkt.reason);
        wrt.props(pkt.props);
      }
  
      return wrt.as_pkt(0x40)
    }
  }
  
  function mqtt_encode_subscribe(ns, mqtt_writer) {
    const _enc_subscribe_flags = opts => 0
        | ( opts.qos & 0x3 )
        | ( opts.retain ? 0x4 : 0 )
        | ( (opts.retain_handling & 0x3) << 2 );
  
    return ns.subscribe = ( mqtt_level, pkt ) => {
      let wrt = mqtt_writer.of(pkt);
  
      wrt.u16(pkt.pkt_id);
      if (5 <= mqtt_level)
        wrt.props(pkt.props);
  
      let f0 = _enc_subscribe_flags(pkt);
      for (let each of pkt.topics) {
        if ('string' === typeof each) {
          wrt.utf8(each);
          wrt.u8(f0);
        } else {
          let [topic, opts] =
            Array.isArray(each) ? each
              : [each.topic, each.opts];
  
          wrt.utf8(topic);
          if (undefined === opts) wrt.u8(f0);
          else wrt.flags(opts, _enc_subscribe_flags);
        }
      }
  
      return wrt.as_pkt(0x82)
    }
  }
  
  function mqtt_encode_unsubscribe(ns, mqtt_writer) {
    return ns.unsubscribe = ( mqtt_level, pkt ) => {
      let wrt = mqtt_writer.of(pkt);
  
      wrt.u16(pkt.pkt_id);
      if (5 <= mqtt_level)
        wrt.props(pkt.props);
  
      for (let topic of pkt.topics)
        wrt.utf8(topic);
  
      return wrt.as_pkt(0xa2)
    }
  }
  
  function mqtt_encode_pingxxx(ns) {
    ns.pingreq  = () => new Uint8Array([ 0xc0, 0 ]);
    ns.pingresp = () => new Uint8Array([ 0xd0, 0 ]);
  }
  
  function mqtt_encode_disconnect(ns, mqtt_writer) {
    return ns.disconnect = ( mqtt_level, pkt ) => {
      let wrt = mqtt_writer.of(pkt);
  
      if (pkt && 5 <= mqtt_level) {
        if (pkt.reason || pkt.props) {
          wrt.reason(pkt.reason);
          wrt.props(pkt.props);
        }
      }
  
      return wrt.as_pkt(0xe0)
    }
  }
  
  function mqtt_encode_auth(ns, mqtt_writer) {
    return ns.auth = ( mqtt_level, pkt ) => {
      if (5 > mqtt_level)
        throw new Error('Auth packets are only available after MQTT 5.x')
  
      let wrt = mqtt_writer.of(pkt);
  
      wrt.reason(pkt.reason);
      wrt.props(pkt.props);
  
      return wrt.as_pkt(0xf0)
    }
  }
  
  const mqtt_decode_v5 =  [
    mqtt_decode_connack,
    mqtt_decode_publish,
    mqtt_decode_puback,
    mqtt_decode_suback,
    mqtt_decode_unsuback,
    mqtt_decode_pingxxx,
    mqtt_decode_disconnect,
    mqtt_decode_auth,
  ];
  
  
  const mqtt_encode_v5 =  [
    mqtt_encode_connect,
    mqtt_encode_puback,
    mqtt_encode_publish,
    mqtt_encode_subscribe,
    mqtt_encode_unsubscribe,
    mqtt_encode_pingxxx,
    mqtt_encode_disconnect,
    mqtt_encode_auth,
  ];
  
  const mqtt_reader_v5 = /* #__PURE__ */
    mqtt_reader_info(
      mqtt_reader_v5$1,
      _connack_v5,
      _puback_v5,
      _suback_v5,
      _unsuback_v4,
      _disconnect_v5,
      _auth_v5,
    );
  
  
  const mqtt_opts_v5 = 
    { decode_fns: mqtt_decode_v5,
      mqtt_reader: mqtt_reader_v5,
      encode_fns: mqtt_encode_v5,
      mqtt_writer: mqtt_writer_v5, };
  
  /*
  export function decode_varint_loop(u8, i=0) {
    let i0 = i
    let shift = 0, n = (u8[i] & 0x7f)
    while ( 0x80 & u8[i++] )
      n |= (u8[i] & 0x7f) << (shift += 7)
  
    return [n, i, i0]
  }
  */
  
  
  function decode_varint(u8, i=0) {
    let i0 = i;
    // unrolled for a max of 4 chains
    let n = (u8[i] & 0x7f) <<  0;
    if ( 0x80 & u8[i++] ) {
      n |= (u8[i] & 0x7f) <<  7;
      if ( 0x80 & u8[i++] ) {
        n |= (u8[i] & 0x7f) << 14;
        if ( 0x80 & u8[i++] ) {
          n |= (u8[i] & 0x7f) << 21;
        }
      }
    }
    return [n, i, i0]
  }
  
  function mqtt_raw_dispatch(opt) {
    let u8 = new Uint8Array(0);
    return u8_buf => {
      u8 = 0 === u8.byteLength
        ? u8_buf : _u8_join(u8, u8_buf);
  
      let res = [];
      while (1) {
        let [len_body, len_vh] = decode_varint(u8, 1);
        let len_pkt = len_body + len_vh;
  
        if ( u8.byteLength < len_pkt )
          return res
  
        let b0 = u8[0];
        let u8_body = 0 === len_body ? null
          : u8.subarray(len_vh, len_pkt);
  
        u8 = u8.subarray(len_pkt);
  
        let pkt = opt.decode_pkt(b0, u8_body, opt);
        if (null != pkt)
          res.push( pkt );
      }
    }
  }
  
  function _u8_join(a, b) {
    let alen = a.byteLength, r = new Uint8Array(alen + b.byteLength);
    r.set(a, 0);
    r.set(b, alen);
    return r
  }
  
  const _pkt_types = ['~', 'connect', 'connack', 'publish', 'puback', 'pubrec', 'pubrel', 'pubcomp', 'subscribe', 'suback', 'unsubscribe', 'unsuback', 'pingreq', 'pingresp', 'disconnect', 'auth'];
  
  function mqtt_pkt_ctx(mqtt_level, opts, pkt_ctx) {
    pkt_ctx = {
      __proto__: pkt_ctx || opts.pkt_ctx,
      mqtt_level,
      get hdr() { return this.b0 & 0xf },
      get id() { return this.b0 >>> 4 },
      get type() { return _pkt_types[this.b0 >>> 4] },
    };
  
    let op, _decode_by_id=[], _encode_by_type={};
    for (op of opts.encode_fns)
      op(_encode_by_type, opts.mqtt_writer);
    for (op of opts.decode_fns)
      op(_decode_by_id, opts.mqtt_reader);
  
    return {
      pkt_ctx,
  
      encode_pkt(type, pkt) {
        return _encode_by_type[type]( mqtt_level, pkt ) },
  
      decode_pkt(b0, u8_body) {
        let fn_decode = _decode_by_id[b0>>>4] || _decode_by_id[0];
        return fn_decode?.({__proto__: this.pkt_ctx, b0}, u8_body) },
  
      mqtt_stream() {
        let self = { __proto__: this, pkt_ctx: { __proto__: pkt_ctx } };
        self.pkt_ctx._base_ = self.pkt_ctx;
        self.decode = mqtt_raw_dispatch(self);
        return self
      },
    }
  }
  
  function ao_defer_ctx(as_res = (...args) => args) {
    let y,n,_pset = (a,b) => { y=a, n=b; };
    return p =>(
      p = new Promise(_pset)
    , as_res(p, y, n)) }
  
  const ao_defer_v = /* #__PURE__ */
    ao_defer_ctx();
  
  Promise.resolve({type:'init'});
  
  function _mqtt_conn(client, [on_mqtt, pkt_future]) {
    let _q_init = ao_defer_v(), _q_ready = ao_defer_v();
    let _send_ready = async (...args) => (await _q_ready[0])(...args);
    let _send_mqtt_pkt, _has_connected;
    client._send = _send_ready;
  
    return {
      async when_ready() {await _q_ready[0];}
  
    , ping: _ping_interval (() =>_send_mqtt_pkt?.('pingreq'))
  
    , reset(err) {
        if (! _send_mqtt_pkt) {return}
  
        if (err) {
          _q_init[2](err);}
  
        _send_mqtt_pkt = null;
        _q_init = ao_defer_v();
        client._send = _send_ready;
  
        // call client.on_conn_reset in next promise microtask
        client.conn_emit('on_disconnect', false===err, err);}
  
    , async send_connect(... args) {
        if (! _send_mqtt_pkt) {
          await _q_init[0]; }// _send_mqtt_pkt is set before fulfilled
  
        // await connack response
        let res = await _send_mqtt_pkt(...args);
        if (0 == res[0].reason) {
          _has_connected = true;
          // resolve _q_ready[0] with _send_mqtt_pkt closure
          _q_ready[1](client._send = _send_mqtt_pkt);
          _q_ready = ao_defer_v();
          client.conn_emit('on_ready');}
  
        return res}
  
    , is_set: (() =>!! _send_mqtt_pkt)
    , set(mqtt_ctx, send_u8_pkt) {
        if (_send_mqtt_pkt) {
          throw new Error('Already connected')}
  
        mqtt_ctx = mqtt_ctx.mqtt_stream();
        let sess_ctx = {mqtt: client};
        let on_mqtt_chunk = u8_buf =>
          on_mqtt(mqtt_ctx.decode(u8_buf), sess_ctx);
  
        _send_mqtt_pkt = async (type, pkt, key) => {
          let res = undefined !== key
            ? pkt_future(key) : true;
  
          await send_u8_pkt(
            mqtt_ctx.encode_pkt(type, pkt));
  
          return res};
  
        _q_init[1](_send_mqtt_pkt); // resolve _q_init with _send_mqtt_pkt closure
  
        // call client.on_live in next promise microtask
        client.conn_emit('on_live', _has_connected);
        return on_mqtt_chunk} } }
  
  
  function _ping_interval(send_ping) {
    let tid;
    return (( td ) => {
      tid = clearInterval(tid);
      if (td) {
        tid = setInterval(send_ping, 1000 * td);
        
  
  
        
        // ensure the interval allows the NodeJS event loop to exit
        tid.unref?.();
        return true} }) }
  
  function parse(str, loose) {
      if (str instanceof RegExp) return { keys:false, pattern:str };
      var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
      arr[0] || arr.shift();
  
      while (tmp = arr.shift()) {
          c = tmp[0];
          if (c === '*') {
              keys.push('wild');
              pattern += '/(.*)';
          } else if (c === ':') {
              o = tmp.indexOf('?', 1);
              ext = tmp.indexOf('.', 1);
              keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
              pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
              if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
          } else {
              pattern += '/' + tmp;
          }
      }
  
      return {
          keys: keys,
          pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
      };
  }
  
  // Use [regexparam][] for url-like topic parsing
  
  function _ignore(pkt, params, ctx) {ctx.done = true;}
  
  function _mqtt_topic_router() {
    let pri_lsts = [[],[]], rm = Symbol();
    let find = topic => _mqtt_routes_iter(pri_lsts, topic);
  
    return {find,
  
      add(topic_route, ...args) {
        let fn = args.pop();
        let priority = args.pop();
  
        if ('function' !== typeof fn) {
          if (false === fn) {
            fn = _ignore;}
          else throw new TypeError()}
  
        let rte = parse(
          topic_route.replace(/[+#]$/, '*'));
  
        rte.key = topic_route;
        rte.tgt = fn;
        pri_lsts[priority ? 0 : 1].push(rte);
        return this}
  
    , remove(topic_route, priority) {
        let lst = pri_lsts[priority ? 0 : 1];
        return _mqtt_route_remove([lst], topic_route)}
  
    , clear(priority) {
        pri_lsts[priority ? 0 : 1] = [];
        if (null == priority) {
          pri_lsts[1] = [];} }
  
    , async invoke(pkt, ctx) {
        ctx.idx = 0;
        ctx.rm = rm;
  
        for (let [fn, params] of find(pkt.topic)) {
          let res = await fn(pkt, params, ctx);
  
          if (rm === res) {
            _mqtt_route_remove(pri_lsts, fn);}
  
          if (ctx.done) {
            break}
          else ctx.idx++;}
  
        let {pkt_id, qos} = pkt;
        if (1 === qos) {
          await ctx.mqtt._send('puback', {pkt_id});} } } }
  
  
  function * _mqtt_routes_iter(all_route_lists, topic) {
    for (let route_list of all_route_lists) {
      for (let route of route_list) {
        let res = _mqtt_route_match_one(topic, route);
        if (undefined !== res) {
          yield res;} } } }
  
  
  function _mqtt_route_match_one(topic, {keys, pattern, tgt}) {
    let match = '/' !== topic[0]
      ? pattern.exec('/'+topic)
      : pattern.exec(topic);
  
    if (null === match) {
      return}
  
    if (false === keys) {
      let {groups} = match;
      if (! groups) {
        return [tgt]}
  
      let params = {};
      for (let k in groups) {
        params[k] = groups[k];}
  
      return [tgt, params]}
  
    if (0 === keys.length) {
      return [tgt]}
  
    let params = {};
    for (let i=0; i<keys.length; i++) {
      params[ keys[i] ] = match[1+i];}
    return [tgt, params]}
  
  
  function _mqtt_route_remove(all_route_lists, query) {
    let match = route => route===query || route.tgt===query || route.key===query;
    for (let lst of all_route_lists) {
      let i = lst.findIndex(match);
      if (0 <= i) {return !! lst.splice(i,1)} }
    return false}
  
  const _mqtt_cmdid_dispatch ={
    create(target) {
      return {__proto__: this, target, hashbelt: [new Map()]} }
  
  , bind_pkt_future(_pkt_id=100) {
      let {hashbelt} = this;
  
      let _tmp_; // use _tmp_ to reuse _by_key closure
      let _by_key = answer_monad =>
        hashbelt[0].set(_tmp_, answer_monad);
  
      return (( pkt_or_key ) => {
        if ('string' === typeof pkt_or_key) {
          _tmp_ = pkt_or_key;}
        else {
          _pkt_id = (_pkt_id + 1) & 0xffff;
          _tmp_ = pkt_or_key.pkt_id = _pkt_id;}
  
        return new Promise(_by_key)}) }
  
  , answer(key, pkt) {
      for (let map of this.hashbelt) {
        let answer_monad = map.get(key);
        if (undefined !== answer_monad) {
          map.delete(key);
  
          answer_monad([pkt, /*err*/]); // option/maybe monad
          return true} }
      return false}
  
  , rotate_belt(n) {
      let {hashbelt} = this;
      hashbelt.unshift(new Map());
      for (let old of hashbelt.splice(n || 5)) {
        for (let answer_monad of old.values()) {
          answer_monad([/*pkt*/, 'expired']); } } }// option/maybe monad
  
  , cmdids: ((() => {
      return [
        (() =>{}    )// 0x0 reserved
      , by_evt   // 0x1 connect
      , by_type  // 0x2 connack
      , by_evt   // 0x3 publish
      , by_id    // 0x4 puback
      , by_id    // 0x5 pubrec
      , by_id    // 0x6 pubrel
      , by_id    // 0x7 pubcomp
      , by_evt   // 0x8 subscribe
      , by_id    // 0x9 suback
      , by_evt   // 0xa unsubscribe
      , by_id    // 0xb unsuback
      , by_type  // 0xc pingreq
      , by_type  // 0xd pingresp
      , by_evt   // 0xe disconnect
      , by_type  ]// 0xf auth
  
  
      function by_id(disp, pkt) {
        disp.answer(pkt.pkt_id, pkt); }
  
      function by_type(disp, pkt, ctx) {
        disp.answer(pkt.type, pkt);
        by_evt(disp, pkt, ctx);}
  
      async function by_evt({target}, pkt, ctx) {
        let fn = target[`mqtt_${pkt.type}`]
          || target.mqtt_pkt;
  
        if (undefined !== fn) {
          await fn.call(target, pkt, ctx);} } })()) };
  
  function _mqtt_dispatch(opt, target) {
    let _disp_ = _mqtt_cmdid_dispatch.create(target);
    let { cmdids } = _disp_;
  
    // default rotate at 1s across 5 buckets
    let { td: rotate_td=1000, n: rotate_n=5 } =
      opt && opt.rotate || {};
  
    let rotate_ts = rotate_td + Date.now();
  
    return [on_mqtt,
      _disp_.bind_pkt_future()]
  
    function on_mqtt(pkt_list, ctx) {
      for (let pkt of pkt_list) {
        cmdids[pkt.id](_disp_, pkt, ctx); }
  
      if (Date.now() > rotate_ts) {
        _disp_.rotate_belt(rotate_n);
        rotate_ts = rotate_td + Date.now();} } }
  
  class MQTTError extends Error {
    constructor(mqtt_pkt, reason=mqtt_pkt.reason) {
      super(`[0x${reason.toString(16)}] ${reason.reason}`);
      this.mqtt_pkt = mqtt_pkt;
      this.reason = reason;} }
  
  class MQTTBase {
    constructor(opt={}) {
      this._conn_ = _mqtt_conn(this,
        this._init_dispatch(opt, this)); }
  
    async conn_emit(evt, arg, err_arg) {
      this.log_conn?.(evt, arg, err_arg);
      try {
        let fn_evt = this[await evt]; // microtask break
        if (fn_evt) {
          await fn_evt.call(this, this, arg, err_arg);}
        else if (err_arg) {
          await this.on_error(err_arg, evt);} }
      catch (err) {
        this.on_error(err, evt);} }
  
    on_error(err, err_path) {
      console.warn('[[u8-mqtt error: %s]]', err_path, err); }
  
    // Handshaking Packets
  
    async connect(pkt={}) {
      let cid = pkt.client_id || ['u8-mqtt--', ''];
      if (Array.isArray(cid)) {
        pkt.client_id = cid = this.init_client_id(cid);}
      this.client_id = cid;
  
      if (null == pkt.keep_alive) {
        pkt.keep_alive = 60;}
  
      let res = await this._conn_
        .send_connect('connect', pkt, 'connack');
  
      if (0 != res[0].reason) {
        throw new this.MQTTError(res[0])}
  
      // TODO: merge with server's keep_alive frequency
      this._conn_.ping(pkt.keep_alive);
      return res}
  
    async disconnect(pkt={}) {
      let res = await this._send('disconnect', pkt);
      this._conn_.reset(false);
      return res}
  
    auth(pkt={}) {
      return this._send('auth', pkt, 'auth')}
  
    ping() {return this._send('pingreq', null, 'pingresp')}
  
  
    // alias: sub
    subscribe(pkt, ex) {
      pkt = _as_topics(pkt, ex);
      return this._send('subscribe', pkt, pkt)}
    _sub_chain(topic, ex) {
      let res = this.subscribe([[ topic ]], ex);
      let subs = this.subs ||(this.subs = new Map());
      subs.set((res.topic = topic), (subs.last = res));
      return this }// fluent api -- return this and track side effects
  
    // alias: unsub
    unsubscribe(pkt, ex) {
      pkt = _as_topics(pkt, ex);
      return this._send('unsubscribe', pkt, pkt)}
  
    get on_topic() {return this.router.add}
  
    // alias: sub_topic
    subscribe_topic(topic_route, ...args) {
      this.router.add(topic_route, true, args.pop() );// handler
      let topic = this.topic_for(topic_route);
      return this._sub_chain(topic, args.pop() ) }// ex
  
    // alias: unsub_topic
    unsubscribe_topic(topic_route) {
      this.router.remove(topic_route, true);
      let topic = this.topic_for(topic_route);
      return this.unsubscribe([[ topic ]]) }
  
    // alias: shared_sub
    shared_subscribe(group, topic_route, ...args) {
      this.router.add(topic_route, true, args.pop() );// handler
      let topic = this.topic_for(topic_route);
      if (null != group) {
        topic = `$share/${group}/${topic}`;}
      return this._sub_chain(topic, args.pop() ) }// ex
  
    // alias: shared_unsub
    shared_unsubscribe(group, topic_route) {
      this.router.remove(topic_route, true);
      let topic = this.topic_for(topic_route);
      if (null != group) {
        topic = `$share/${group}/${topic}`;}
      return this.unsubscribe([[ topic ]]) }
  
    topic_for(topic_route) {
      return topic_route.replace(/[:*].*$/, '#')}
  
  
    // alias: pub
    publish(pkt, pub_opt) {return _pub(this, pkt, pub_opt)}
    post(topic, payload, pub_opt) {return _pub.m(this, topic, payload, pub_opt)}
    send(topic, payload, pub_opt) {return _pub.mq(this, topic, payload, pub_opt)}
    store(topic, payload, pub_opt) {return _pub.mqr(this, topic, payload, pub_opt)}
  
    json_post(topic, msg, pub_opt) {return _pub.o(this, topic, msg, pub_opt)}
    json_send(topic, msg, pub_opt) {return _pub.oq(this, topic, msg, pub_opt)}
    json_store(topic, msg, pub_opt) {return _pub.oqr(this, topic, msg, pub_opt)}
  
    obj_post(topic, msg, pub_opt) {return _pub.o(this, topic, msg, pub_opt)}
    obj_send(topic, msg, pub_opt) {return _pub.oq(this, topic, msg, pub_opt)}
    obj_store(topic, msg, pub_opt) {return _pub.oqr(this, topic, msg, pub_opt)}
  
  
  
    // Utility Methods
  
    init_client_id(parts) {
      let cid = this.client_id;
  
      if (undefined === cid) {
        this.client_id = cid = (
          
          this.sess_client_id(parts)
          
  
          );}
  
      return cid}
  
    new_client_id(parts) {
      return [parts[0], Math.random().toString(36).slice(2), parts[1]].join('')}
  
    
    sess_client_id(parts) {
      let key = parts.join('\x20');
      let cid = sessionStorage.getItem(key);
      if (null == cid) {
        cid = this.new_client_id(parts);
        sessionStorage.setItem(key, cid);}
      return cid}
  
  
    // Internal API
  
    /* async _send(type, pkt) -- provided by _conn_ and transport */
  
    _init_router(opt) {
      return this.router = _mqtt_topic_router()}
  
    _init_dispatch(opt) {
      let tgt ={
        __proto__: opt.on_mqtt_type || {}
      , router: this._init_router(opt, this)};
  
      tgt.mqtt_publish ||= tgt.router.invoke;
      return _mqtt_dispatch(this, tgt)} }
  
  
   {
    let p = MQTTBase.prototype;
    Object.assign(p,{
      MQTTError
    , pub: p.publish
    , sub: p.subscribe
    , unsub: p.unsubscribe
    , sub_topic: p.subscribe_topic
    , unsub_topic: p.unsubscribe_topic
    , shared_sub: p.shared_subscribe
    , shared_unsub: p.shared_unsubscribe} );
  
    /*
      p.on_mqtt_type = {
        mqtt_auth(pkt, ctx) ::
        mqtt_connect(pkt, ctx) ::
        mqtt_connack(pkt, ctx) ::
        mqtt_disconnect(pkt, ctx) ::
  
        mqtt_publish(pkt, ctx)
        mqtt_subscribe(pkt, ctx) ::
        mqtt_unsubscribe(pkt, ctx) ::
  
        mqtt_pingreq(pkt, ctx) ::
        mqtt_pingresp(pkt, ctx) ::
      }
    */}
  
  
  function _as_topics(pkt, ex) {
    if ('string' === typeof pkt) {
      return {topics:[pkt], ... ex}}
    if (pkt[Symbol.iterator]) {
      return {topics:[... pkt], ... ex}}
    return ex ? {...pkt, ...ex} : pkt}
  
  
  async function _pub(self, pkt, pub_opt) {
    if (undefined === pkt.payload) {
      if ('function' === typeof pub_opt) {
        pub_opt = {fn_encode: pub_opt};}
  
      let {msg} = pkt;
      switch (typeof msg) {
        case 'function':
          pub_opt = {...pub_opt, fn_encode: msg};
          // flow into 'undefined' case
        case 'undefined':
          // return a single-value closure to publish packets
          return v => _pub(self, {...pkt, [pkt.arg || 'payload']: v}, pub_opt)
  
        default:
          // Encode payload from msg; fn_encode allows alternative to JSON.stringify
          let {fn_encode} = pub_opt || {};
          pkt.payload = fn_encode
            ? await fn_encode(msg)
            : JSON.stringify(msg);} }
  
    if (pub_opt) {
      if (pub_opt.props) {
        pkt.props = pub_opt.props;}
      if (pub_opt.xform) {
        pkt = pub_opt.xform(pkt) || pkt;} }
  
    return self._send('publish', pkt,
      pkt.qos ? pkt : void 0 ) }// key
  
   {
    Object.assign(_pub,{
      m: (self, topic, payload, pub_opt) =>
        _pub(self, {topic, payload, qos:0}, pub_opt)
    , mq: (self, topic, payload, pub_opt) =>
        _pub(self, {topic, payload, qos:1}, pub_opt)
    , mqr: (self, topic, payload, pub_opt) =>
        _pub(self, {topic, payload, qos:1, retain: 1}, pub_opt)
  
    , o: (self, topic, msg, pub_opt) =>
        _pub(self, {topic, msg, arg: 'msg', qos:0}, pub_opt)
    , oq: (self, topic, msg, pub_opt) =>
        _pub(self, {topic, msg, arg: 'msg', qos:1}, pub_opt)
    , oqr: (self, topic, msg, pub_opt) =>
        _pub(self, {topic, msg, arg: 'msg', qos:1, retain: 1}, pub_opt)} ); }
  
  const pkt_api = {
    utf8(u8) { return new TextDecoder('utf-8').decode(u8 || this.payload ) },
    json(u8) { return JSON.parse( this.utf8(u8) || null ) },
    text(u8) { return this.utf8(u8) },
  };
  
  class MQTTCore extends MQTTBase {
    constructor(opt={}) {
      super(opt);
      this.with(opt);}
  
    static mqtt_ctx(mqtt_level, mqtt_opts, pkt_ctx=pkt_api) {
      let self = class extends this {};
      self.prototype.mqtt_ctx =
        mqtt_pkt_ctx(mqtt_level, mqtt_opts, pkt_ctx);
      return self}
  
    with(fns_ns) {
      for (let [k,v] of Object.entries(fns_ns)) {
        if ('function' === typeof v) {this[k] = v;} }
      return this}
  
    //log_conn(evt, arg, err_arg) ::
    //  console.info @ '[[u8-mqtt log: %s]]', evt, arg, err_arg
  
    on_live(client, is_reconnect) {
      if (is_reconnect) {
        return client.connect()} }
  
    //on_reconnect(client) ::
  
    _use_conn(fn_reconnect) {
      return (this.reconnect = fn_reconnect)?.()}
    with_autoreconnect(opt=2000) {
      if (opt.toFixed) {opt ={delay: opt};}
      return this.with({
        on_reconnect() {
          this.delay(opt.delay || 2000)
            .then(this.reconnect)
            .then(opt.reconnect, opt.error);} }) }
  
    on_disconnect(client, intentional) {
      if (! intentional) {
        return client.on_reconnect?.()} }
  
    delay(ms) {
      return new Promise(done => setTimeout(done, ms)) }
  
    with_async_iter(async_iter, write_u8_pkt) {
      let on_mqtt_chunk = this._conn_.set(
        this.mqtt_ctx,
        write_u8_pkt);
  
      this._msg_loop = ((async () => {
        try {
          async_iter = await async_iter;
          for await (let chunk of async_iter)
            on_mqtt_chunk(chunk);
          this._conn_.reset();}
        catch (err) {
          this._conn_.reset(err);} })());
  
      return this}
  
  
  
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    with_stream(read_stream, write_stream) {
      if (undefined === write_stream) {
        write_stream = read_stream;}
  
      return this.with_async_iter(read_stream,
        u8_pkt => write_stream.write(u8_pkt)) }
  
  
    with_websock(websock) {
      if (! websock?.send) {
        websock = new URL(websock || 'ws://127.0.0.1:9001');
        return this._use_conn (() =>
          this.with_websock(
            new WebSocket(websock, ['mqtt'])) ) }
  
      websock.binaryType = 'arraybuffer';
  
      let ready, {readyState} = websock;
      if (1 !== readyState) {
        if (0 !== readyState) {
          throw new Error('Invalid WebSocket readyState') }
  
        ready = new Promise(fn => websock.onopen = fn); }
  
  
      let {_conn_} = this;
      let on_mqtt_chunk = _conn_.set(
        this.mqtt_ctx,
        async u8_pkt =>(
          await ready
        , websock.send(u8_pkt)) );
  
      websock.onmessage = evt =>(on_mqtt_chunk(new Uint8Array(evt.data)));
      websock.onclose = evt => {
        if (! evt.wasClean) {
          var err = new Error('websocket connection close');
          err.code = evt.code;
          err.reason = evt.reason;}
  
        _conn_.reset(err);};
  
      return this} }
  
  const version = '0.3.2-0';
  
  const MQTTClient_v4 = /* #__PURE__ */
    MQTTCore.mqtt_ctx(4, mqtt_opts_v5);
  
  const MQTTClient_v5 = /* #__PURE__ */
    MQTTCore.mqtt_ctx(5, mqtt_opts_v5);
  
  const mqtt_v4 = opt =>
    new MQTTClient_v4(opt);
  
  const mqtt_v5 = opt =>
    new MQTTClient_v5(opt);
  
  export { MQTTBase, MQTTClient_v4, MQTTClient_v5, MQTTCore, MQTTError, _mqtt_cmdid_dispatch, _mqtt_conn, _mqtt_dispatch, _mqtt_route_match_one, _mqtt_route_remove, _mqtt_routes_iter, _mqtt_topic_router, ao_defer_v, mqtt_v4 as default, mqtt_v4, mqtt_v5, version };
  //# sourceMappingURL=index.js.map