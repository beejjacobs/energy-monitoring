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
        this.emit('error', err);
      });
      this.client.on('close', () => {
        this.emit('close');
      });

      this.client.connect(this.port, this.ip, resolve);
    });
  }


  send(date) {
    if (!this.client || this.client.connecting) {
      return;
    }
    const timeSeconds = Math.floor( date / 1000);
    this.client.write('energy.wh.count 1 ' + timeSeconds + '\n');
  }
}

module.exports.GraphiteClient = GraphiteClient;