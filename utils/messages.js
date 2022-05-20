const moment = require("moment");
const chat = require("../model/chat-model");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

async function saveMessage(message, room, userId) {
  const newChat = new chat({ message, room, userId });
  await newChat.save();
}

async function getMessagesRoom(room) {
  const data = await chat.find({ room }).populate("userId");
  return data;
}

module.exports = {
  formatMessage,
  saveMessage,
  getMessagesRoom
};
