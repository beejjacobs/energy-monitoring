const {ArduinoClient} = require('./arduino-client');
const {GraphiteClient} = require('./graphite-client');

const arduino = new ArduinoClient('192.168.0.4');
const graphite = new GraphiteClient('192.168.0.2');

let recieved = false;
let reconnecting = false;

// stop the process if there are any socket errors
arduino.on('error', err => {
  console.error('arduino error', err);
  if (reconnecting) {
    return;
  }
  process.exit(1);
});

arduino.on('close', () => {
  console.error('arduino close');
  if (reconnecting) {
    return;
  }
  process.exit(1);
});

graphite.on('error', err => {
  console.error('graphite error', err);
  process.exit(1);
});

graphite.on('close', () => {
  console.error('graphite close');
  process.exit(1);
});

arduino.on('pulses', pulses => {
  recieved = true;
  console.log('pulses', pulses);
  pulses.forEach(date => graphite.send(date));
});

arduino.connect()
  .then(() => console.log('connected to arduino'))
  .catch(err => {
    console.log(`couldn't connect to arduino`);
    process.exit(1);
  });

graphite.connect()
  .then(() => console.log('connected to graphite'))
  .catch(err => {
    console.log(`couldn't connect to graphite`);
    process.exit(1);
  });

// check for pulses every 5s
setInterval(() => {
  if (!recieved) {
    console.log('watchdog run');
    reconnecting = true;
    arduino.disconnect();
    arduino.connect()
      .then(() => {
        console.log('connected to arduino');
        reconnecting = false;
      })
      .catch(err => {
        console.log(`couldn't connect to arduino`);
        process.exit(1);
      });
  }
  recieved = false;
}, 5000);