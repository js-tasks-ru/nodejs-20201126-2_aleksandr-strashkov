const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const {PassThrough} = require('stream');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    return res.end('Not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {
        flags: 'wx',
      });

      writeStream.on('error', () => {
        res.statusCode = 409;
        return res.end();
      });

      req.on('aborted', () => {
        fs.unlinkSync(filepath);
      });

      writeStream.on('open', () => {
        const limitSizeStream = new LimitSizeStream({limit: 1024 * 1024});
        const readStream = new PassThrough();

        limitSizeStream.on('error', () => {
          fs.unlinkSync(filepath);
          res.statusCode = 413;
          res.end();
        });

        req
            .pipe(readStream)
            .pipe(limitSizeStream)
            .pipe(writeStream)
            .on('close', () => {
              res.statusCode = 201;
              res.end();
            });
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
