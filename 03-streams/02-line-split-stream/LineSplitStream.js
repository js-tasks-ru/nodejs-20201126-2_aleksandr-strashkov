const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._rest = '';
  }

  _transform(chunk, encoding, callback) {
    const text = chunk.toString();

    if (text.includes(os.EOL)) {
      const lines = text.split(os.EOL);

      lines[0] = this._rest + lines[0];

      this._rest = lines.pop();

      lines.forEach((line) => {
        this.push(line);
      });
      callback(null);
    } else {
      this._rest += text;
      callback(null, null);
    }
  }

  _flush(callback) {
    if (this._rest) {
      callback(null, this._rest);
    }
  }
}

module.exports = LineSplitStream;
