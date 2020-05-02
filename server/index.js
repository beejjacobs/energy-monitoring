const net = require('net');

const client = new net.Socket();
client.setEncoding('ascii');
client.connect(23, '192.168.0.155', function() {
  console.log('Connected');
});

/**
 * @type {String}
 */
let res = '';

/**
 *
 * @param {string} buf
 */
function onData(buf) {
  res += buf;
  let index = res.indexOf('\r\n');
  if (index !== -1) {
      const msg = res.substring(0, index);
      res = res.substring(index + 1);
      handleMsg(msg);
  }
}

const store = new Set();
/**
 *
 * @param {string} msg
 */
function handleMsg(msg) {
  const time = new Date();
  const all = msg.split(',').map(parseFloat);
  const refTime = all[0];
  const pulses = all.slice(1);

  const dates = pulses
      .map(p => p - refTime)
      .map(p => new Date(time.valueOf() + p));
  const times = dates
      .map(date => {
        const millis = date.getMilliseconds().toString().padStart(3, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');

        return `${hour}:${minutes}:${seconds}:${millis}`;
      });

  dates.forEach(d => store.add(d));
  console.log(refTime.toString(), 'power:', calcPower() + 'w', pulses.join(','), times.join(','));
}

const msPerHour = 1000 * 60 * 60;

function calcPower() {
  if (store.size < 2) {
    return 0;
  }
  const pulses = Array.from(store);
  /** @type {Date} */
  const start = pulses[pulses.length - 2];
  /** @type {Date} */
  const end = pulses[pulses.length - 1];
  const timeMs = end.valueOf() - start.valueOf();
  const timeHrs = timeMs / msPerHour;
  const power = 1.0 / timeHrs;

  return power.toFixed(0);
}

client.on('data', onData);

client.on('close', function() {
  console.log('Connection closed');
});
