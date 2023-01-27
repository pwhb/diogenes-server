import message from "./models/message.js";

export default function configureSocket(io) {
  io.on("connection", (socket) => {
    const session = socket.request.session;
    console.log("session", session);

    socket.on("enter-room", ({ roomId, userId }, callback) => {
      socket.join(roomId);
      socket.userId = userId;
      callback(`user ${userId} joined room ${roomId}`);
    });

    socket.on("send-message", async ({ sender, body, room }, callback) => {
      const newMessage = await message.create({ sender, body, room });

      console.log("send-message", newMessage);
      callback(newMessage);
      socket.to(room).emit("receive-message", newMessage);
    });
  });
}
