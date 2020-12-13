const url = require('url');
const http = require('http');
const path = require('path');
const {createReadStream} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    return res.end('not supported');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const readStream = createReadStream(filepath);

      readStream.on('error', () => {
        res.statusCode = 404;
        res.end('not found');
      });

      readStream.on('open', () => {
        readStream.pipe(res);
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
