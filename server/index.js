const net = require('net');

const client = new net.Socket();
// client.setEncoding('hex');
client.connect(23, '192.168.0.155', function() {
  console.log('Connected');
});

let res;

/**
 *
 * @param {Buffer} buf
 */
function onData(buf) {
  if (res) {
    res = Buffer.concat([res, buf], res.length + buf.length);
  } else {
    res = buf;
  }
  let index = res.indexOf('\n');
  if (index !== -1) {
    if (index % 4 === 0) {
      /**
       * @type {Buffer}
       */
      const msg = Uint8Array.prototype.slice.call(res, 0, index + 1);
      res = res.slice(index + 1);
      handleMsg(msg);
    }
  }
}
/**
 *
 * @param {Buffer} msg
 */
function handleMsg(msg) {
  if (msg.length < 5) {
    console.log('invalid message length', msg.length);
    console.log(msg.toString('hex'));
    return;
  }
  if (msg.length % 4 !== 1) {
    console.log('invalid message length, expected multiple of 4 + 1', msg.length);
    console.log(msg.toString('hex'));
    return;
  }
  const time = new Date();
  const refTime = msg.readUInt32LE(0);
  const pulses = [];
  for (let i = 4; i < (msg.length - 1); i += 4) {
    pulses.push(msg.readUInt32LE(i));
  }

  const times = pulses
      .map(p => p - refTime)
      .map(p => new Date(time.valueOf() + p))
      .map(date => {
        const millis = date.getMilliseconds().toString().padStart(3, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');

        return `${hour}:${minutes}:${seconds}:${millis}`;
      });
  console.log(refTime.toString(), pulses.join(','), times.join(','));
}

client.on('data', onData);

client.on('close', function() {
  console.log('Connection closed');
});
