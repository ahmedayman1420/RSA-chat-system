// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Variable Declaration < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
var myKey;
var isReady = false;
var pKey;
var N, keySize;
var testMode = false;
//==// Get username and room from URL
const { username, room, P, Q, E, size } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

if (!(P == "" || Q == "" || E == "")) testMode = true;
if (size == "") keySize = 16;
else keySize = size;

console.log(keySize);

var today = new Date();

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Open Connection With Server and Setup Chating < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

(async function () {
  const socket = io();

  // ====== --- ====== > Generate Key For User < ====== --- ====== //
  if (!testMode) {
    async function generateRSAKeys(size) {
      let key = await generateKey(0, size);
      myKey = [BigInt(key.p), BigInt(key.q), BigInt(key.e)];
      // console.log(myKey);
    }
    await generateRSAKeys(keySize);
  } else {
    myKey = [BigInt(P), BigInt(Q), BigInt(E)];
    console.log(myKey);
  }
  // ====== --- ====== > Join chatroom < ====== --- ====== //

  socket.emit("joinRoom", {
    username,
    room,
    publicKey: myKey[2].toString(),
    n: (myKey[0] * myKey[1]).toString(),
  });

  //==// Get room and users
  socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);

    //==// Here check if two users are active, then they can start chatting else wait until both are active
    console.log(users);
    if (users.length == 2) {
      if (users[0].isActive == true && users[1].isActive == true)
        socket.emit("getPublicKey", { username, room });
      else {
        isReady = false;
      }
    }
  });

  // ====== --- ====== > Get Public Key Of user < ====== --- ====== //
  socket.on("receivePublicKey", ({ pk, n }) => {
    pKey = BigInt(pk);
    N = BigInt(n);
    isReady = true;
    // console.log(pKey);
    // console.log(N);
  });

  // //////////////////////////////////////////////////////////////////////////////////////////// //
  // ====== --- ====== > ============================================= < ====== --- ====== //
  // ====== --- ====== > Chat Events < ====== --- ====== //
  // ====== --- ====== > ============================================= < ====== --- ====== //
  // //////////////////////////////////////////////////////////////////////////////////////////// //

  // ====== --- ====== > Message from server < ====== --- ====== //
  socket.on("message", async ({ msg, name, isBot }) => {
    if (name != username) {
      if (!isBot) {
        // console.log("Here ...");
        msg.text = await decryptMessage(
          //==// Decrypt received message
          msg.text,
          BigInt(myKey[0]),
          BigInt(myKey[1]),
          BigInt(myKey[2])
        );
      }
      outputMessage(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down
    }
  });

  // ====== --- ====== > Send Message To server < ====== --- ====== //
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value; // Get message text
    msg = msg.trim();
    if (!msg) return false;

    let apm,
      hours = today.getHours();
    mint = today.getMinutes();
    if (today.getHours() >= 12) apm = " pm";
    else apm = " am";
    if (hours == 0) hours = today.getHours() + 12;
    if (hours > 12) hours = today.getHours() - 12;
    if (mint < 10) mint = `0${today.getMinutes()}`;

    if (isReady) {
      outputMessage({
        username,
        text: msg,
        time: hours + ":" + mint + apm,
      });
      //==// Encrypt Sent message

      cipher = await encryptMessage(msg, N, BigInt(pKey));
      msg = cipher;
      socket.emit("chatMessage", { msg, username }); // Emit message to server
      e.target.elements.msg.value = ""; // Clear input
      e.target.elements.msg.focus();
    } else {
      alert("Wait until your friend join the room.");
    }
  });

  // ====== --- ====== > Redirect to index.html < ====== --- ====== //
  //==// it used when room reaches max limit of users (2)
  socket.on("redirect", function (destination) {
    window.location.href = destination;
    alert(
      "This room reaches max limit of users, please select another room id."
    );
  });

  // ====== --- ====== > Redirect to index.html when user leave room < ====== --- ====== //
  //==// it used when room reaches max limit of users (2)
  socket.on("leave", function (destination) {
    window.location.href = destination;
    isReady = false;
  });

  // ====== --- ====== > Disconnect From Server < ====== --- ====== //
  //==// Prompt the user before leave chat room
  document.getElementById("leave-btn").addEventListener("click", async () => {
    const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
    if (leaveRoom) {
      // console.log(username);
      // console.log(room);
      // console.log({ username, room });

      socket.emit("disactive", { username, room }); // Emit message to server
    }
  });
})();

// //////////////////////////////////////////////////////////////////////////////////////////// //
// ====== --- ====== > ============================================= < ====== --- ====== //
// ====== --- ====== > Sun-Function that used to out messages < ====== --- ====== //
// ====== --- ====== > ============================================= < ====== --- ====== //
// //////////////////////////////////////////////////////////////////////////////////////////// //

// ====== --- ====== > Output message to DOM < ====== --- ====== //
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector(".chat-messages").appendChild(div);
}

// ====== --- ====== > Add room name to DOM < ====== --- ====== //
function outputRoomName(room) {
  roomName.innerText = room;
}

// ====== --- ====== > Add users to DOM < ====== --- ====== //
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
