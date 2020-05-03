const net = require('net');
const EventEmitter = require('events');

class ArduinoClient extends EventEmitter {
  constructor(ip, port = 23) {
    super();
    this.ip = ip;
    this.port = port;

    this.res = '';
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client = new net.Socket();
      this.client.setEncoding('ascii');

      this.client.on('error', err => {
        reject();
        this.emit('error');
      });
      this.client.on('data', data => this.onData(data));
      this.client.on('close', () => {
        this.emit('close');
      });

      this.client.connect(this.port, this.ip, resolve);
    });
  }


  /**
   * @param {string} buf
   */
  onData(buf) {
    this.res += buf;
    let index = this.res.indexOf('\r\n');
    if (index !== -1) {
      const msg = this.res.substring(0, index);
      this.res = this.res.substring(index + 1);
      this.handleMsg(msg);
    }
  }

  /**
   *
   * @param {string} msg
   */
  handleMsg(msg) {
    const time = new Date();
    const all = msg.split(',').map(parseFloat);
    const refTime = all[0];
    const pulses = all.slice(1)
      .map(p => p - refTime)
      .map(p => new Date(time.valueOf() + p));

    this.emit('pulses', pulses);
  }
}

module.exports.ArduinoClient = ArduinoClient;