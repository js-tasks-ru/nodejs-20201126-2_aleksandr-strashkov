const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._length = 0;
    this._limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this._length += chunk.length;

    if (this._length > this._limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
