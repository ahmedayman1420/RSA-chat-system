// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const express = require("express"); // node.js framework
const http = require("http"); // creating http server
const Connection = require("./Configration/configDB");
const dotenv = require("dotenv");
dotenv.config();


const path = require("path"); // dealing with pathes
const socketio = require("socket.io"); // for chat system

Connection();
const chatSystem = require("./chat/socket"); // function that handling chat requests

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// ====== --- ====== > Chat System < ====== --- ====== //
chatSystem(io);

// ====== --- ====== > Listen Server On Port < ====== --- ====== //
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
