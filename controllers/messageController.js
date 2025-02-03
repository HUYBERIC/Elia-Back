const sendMessage = (req, res) => {
  res.send("Send a message");
};

const getMessageById = (req, res) => {
  res.send(`Message ID: ${req.params.id}`);
};

module.exports = { sendMessage, getMessageById };
