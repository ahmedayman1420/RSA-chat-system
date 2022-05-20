// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

const {
  formatMessage,
  saveMessage,
  getMessagesRoom,
} = require("../utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isusernameFound,
} = require("../utils/users");
const botName = "RSA Chat System";
let mesg, oldChat;

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Chat System Connection Function < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

const chatSystem = (io) => {
  // ====== --- ====== > Run when client connects < ====== --- ====== //
  io.on("connection", async (socket) => {
    //==// Request for joining room
    socket.on("joinRoom", async ({ username, room, publicKey, n }) => {
      const roomUsers = await getRoomUsers(room);
      const isolduser = await isusernameFound(username, room);
      //==// if room contains less than 2 user go...
      if (roomUsers.length < 2 || (roomUsers.length <= 2 && isolduser)) {
        const { user, isOld } = await userJoin(
          socket.id,
          username,
          room,
          publicKey,
          n
        );
        socket.join(user.cRoom);

        if (!isOld) {
          //==// Welcome current user - message sent to this user
          mesg = formatMessage(botName, "Welcome to RSA App!");
          // saveMessage(mesg, user.cRoom, user._id);
          socket.emit("message", { msg: mesg, name: username, isBot: true });

          //==// Broadcast when a user connects - message sent to all users except current one
          mesg = formatMessage(botName, `${user.username} has joined the chat`);
          // saveMessage(mesg, user.cRoom, user._id);
          socket.broadcast
            .to(user.cRoom)
            .emit("message", { msg: mesg, name: username, isBot: true });
        } else {
          //==// Here i was send user old messages, but now i can't do this.
          // mesg = await getMessagesRoom(user.cRoom);
          //==// if user has old messages show it
          //   for (var i = 0; i < mesg.length; i++) {
          //     oldChat = mesg[i].message;
          //     socket.emit("message", oldChat);
          //   }
        }

        //==// Send users and room info
        io.to(user.cRoom).emit("roomUsers", {
          room: user.cRoom,
          users: await getRoomUsers(user.cRoom),
        });
      } else {
        //==// if room already contains two users
        // saveMessage(mesg, user.cRoom, user._id);
        socket.emit("redirect", "/index.html");
      }
    });

    // //////////////////////////////////////////////////////////////////////////////////////////// //
    // ====== --- ====== > ============================================= < ====== --- ====== //
    // ====== --- ====== > Chat System Send & receive Functions < ====== --- ====== //
    // ====== --- ====== > ============================================= < ====== --- ====== //
    // //////////////////////////////////////////////////////////////////////////////////////////// //

    // ====== --- ====== > Send Public Key < ====== --- ====== //
    socket.on("getPublicKey", async ({ username, room }) => {
      const users = await getRoomUsers(room);
      for (var i = 0; i < users.length; i++) {
        if (users[i].username != username) {
          pk = users[i].publicKey;
          n = users[i].n;
          socket.emit("receivePublicKey", { pk, n });
        }
      }
    });

    // ====== --- ====== > Listen for chatMessage < ====== --- ====== //
    socket.on("chatMessage", async ({ msg, username }) => {
      const user = await getCurrentUser(username);
      msg = formatMessage(user.username, msg);
      saveMessage(msg, user.cRoom, user._id);
      io.to(user.cRoom).emit("message", {
        msg,
        name: username,
        isBot: false,
      });
    });

    //====== --- ====== > Runs when client disconnects < ====== --- ====== //
    socket.on("disactive", async ({ username, room }) => {
      const user = await getCurrentUser(username);
      await userLeave(room);
      if (user) {
        mesg = formatMessage(botName, `${user.username} has left the chat`);
        // saveMessage(mesg, user.cRoom, user._id);
        io.to(user.cRoom).emit("message", {
          msg: mesg,
          name: username,
          isBot: true,
        });

        //==// Send users and room info
        io.to(user.cRoom).emit("roomUsers", {
          room: user.cRoom,
          users: await getRoomUsers(user.cRoom),
        });

        //==// user will back to index.html
        io.emit("leave", "/index.html");
      }
    });
  });
};

// ====== --- ====== > Export Chat System Function < ====== --- ====== //
module.exports = chatSystem;
