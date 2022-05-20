// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const mongoose = require("mongoose");

// ====== --- ====== > model schema < ====== --- ====== //

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    socketId: { type: String, required: true },
    cRoom: { type: String, required: true },
    publicKey: { type: String, required: true },
    n: { type: String, required: true },
    rooms: [
      {
        type: String,
        required: true,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean },
  },

  {
    timestamps: true, // To save (creation, update) time
  }
);

// ====== --- ====== > blog model < ====== --- ====== //
const users = mongoose.model("users", userSchema); //

// ====== --- ====== > export blog model < ====== --- ====== //
module.exports = users;
