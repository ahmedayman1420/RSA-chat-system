// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const mongoose = require("mongoose");

// ====== --- ====== > model schema < ====== --- ====== //

const chatSchema = mongoose.Schema(
  {
    message: {
      username: { type: String, required: true },
      text: { type: String, required: true },
      time: { type: String, required: true },
    },
    room: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users", // relate chat collection with user collection
    },
    isDeleted: { type: Boolean, default: false },
  },

  {
    timestamps: true, // To save (creation, update) time
  }
);

// ====== --- ====== > chat model < ====== --- ====== //
const chat = mongoose.model("chat", chatSchema); // create blog collection with given (name, schema).

// ====== --- ====== > export blog model < ====== --- ====== //
module.exports = chat;
