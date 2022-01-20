const express = require("express");
const colors = require("colors");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const http = require("http");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected! : ${socket.id}`.green);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined Room: ${data}`.yellow);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected!".red, socket.id.red);
  });
});

server.listen(4000, () => console.log(`Server Up & Running`.cyan));
