const net = require('net');
const EventEmitter = require('events');

class GraphiteClient extends EventEmitter {
  constructor(ip = 'localhost', port = 2023) {
    super();
    this.ip = ip;
    this.port = port;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = new net.Socket();

      this.client.on('error', err => {
        reject();
        this.emit('error');
      });
      this.client.on('close', () => {
        this.emit('close');
      });

      this.client.connect(this.port, this.ip, resolve);
    });
  }


  send(date) {
    const timeSeconds = Math.floor( date / 1000);
    this.client.write('energy.test.count 1 ' + timeSeconds + '\n');
  }
}

module.exports.GraphiteClient = GraphiteClient;