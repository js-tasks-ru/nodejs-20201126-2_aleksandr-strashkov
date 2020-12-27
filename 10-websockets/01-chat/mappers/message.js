module.exports = function mapMessage(message) {
  return {
    id: message.id,
    date: message.date,
    user: message.user,
    text: message.text,
  };
};
