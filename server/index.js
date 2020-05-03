const {ArduinoClient} = require('./arduino-client');
const {GraphiteClient} = require('./graphite-client');

const arduino = new ArduinoClient('192.168.0.155');
const graphite = new GraphiteClient();

// stop the process if there are any socket errors
arduino.on('error', err => {
  console.error('arduino error', err);
  process.exit(1);
});

arduino.on('close', () => {
  console.error('arduino close');
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