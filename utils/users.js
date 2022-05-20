// ====== --- ====== > Import Variables < ====== --- ====== //
const users = require("../model/user-model");
const chat = require("../model/chat-model");

// ====== --- ====== > Check is username found < ====== --- ====== //
async function isusernameFound(username, room) {
  const oldUser = await users.findOne({ username, isDeleted: false });
  let isOld;
  if (oldUser && oldUser.rooms.includes(room)) isOld = true;
  else isOld = false;
  return isOld;
}

// ====== --- ====== > Join user to chat < ====== --- ====== //
async function userJoin(socketId, username, room, publicKey, n) {
  const oldUser = await users.findOne({ username, isDeleted: false });
  let isOld;
  if (oldUser) {
    if (oldUser.rooms.includes(room)) {
      const data = await users.updateOne(
        { username, isDeleted: false },
        { socketId, cRoom: room, publicKey, n, isActive: true }
      );

      isOld = true;
    } else {
      let newRooms = oldUser.rooms;
      newRooms.push(room);
      const data = await users.updateOne(
        { username, isDeleted: false },
        { socketId, cRoom: room, rooms: newRooms, publicKey, n, isActive: true }
      );
    }
  } else {
    const newUser = new users({
      socketId,
      cRoom: room,
      username,
      publicKey,
      rooms: [room],
      n,
      isActive: true,
    });
    await newUser.save();

    isOld = false;
  }

  const user = await users.findOne({ socketId, isDeleted: false });
  return { user, isOld };
}

// ====== --- ====== > Get current user of given name < ====== --- ====== //
async function getCurrentUser(name) {
  return await users.findOne({ username: name, isDeleted: false });
}

// ====== --- ====== > User leaves chat < ====== --- ====== //
async function userLeave(room) {
  const data = await users.update(
    { cRoom: room, isDeleted: false },
    { isActive: false, rooms: [] }
  );
}

// ====== --- ====== > Get room users < ====== --- ====== //
async function getRoomUsers(room) {
  const oldUsers = await users.find({ isDeleted: false });
  const temp = [];
  for (var i = 0; i < oldUsers.length; i++) {
    if (oldUsers[i].rooms.includes(room)) {
      temp.push(oldUsers[i]);
    }
  }

  return temp;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isusernameFound,
};
