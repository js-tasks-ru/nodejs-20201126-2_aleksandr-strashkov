const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

async function auth(socket, next) {
  const {token} = socket.handshake.query;

  if (!token) {
    socket.error('anonymous sessions are not allowed');
    return;
  }

  const session = await Session.findOne({token}).populate('user');

  if (!session) {
    socket.error('wrong or expired session token');
    return;
  }

  socket.user = session.user;

  return next();
}

async function saveMessage(text) {
  await Message.create({
    date: new Date(),
    text,
    chat: this.user.id,
    user: this.user.displayName,
  });
}

function socket(server) {
  const io = socketIO(server);

  io.use(auth);

  io.on('connection', function(socket) {
    socket.on('message', saveMessage);
  });

  return io;
}

module.exports = socket;
