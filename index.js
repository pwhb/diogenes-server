import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const { PORT, CLIENT_URL } = process.env;

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    // origin: "https://neonaffinity.netlify.app",
  },
});

app.get("/", (req, res) => {
  res.send("welcome to diogenes backend");
});

io.on("connection", (socket) => {
  // Generate a random username and send it to the client to display it
  const username = `User ${Math.round(Math.random() * 999999)}`;
  socket.emit("name", username);
  // socket.join("room");

  socket.on("set-room", (roomName) => {
    console.log(roomName)
    socket.join(roomName)
  });

  // Receive incoming messages and broadcast them
  socket.on("send-message", (newMessage) => {
    console.log(newMessage)
    socket.to(newMessage.room).emit("receive-message", newMessage);
  });
});

httpServer.listen(PORT);
