import message from "./models/message.js";
import gameModel from "./models/game.js"

export default function configureSocket(io) {
  io.on("connection", (socket) => {
    const session = socket.request.session;
    console.log("session", session);

    socket.on("enter-room", ({ roomId, userId }, callback) => {
      socket.join(roomId);
      socket.userId = userId;
      callback(`user ${userId} joined room ${roomId}`);
    });

    socket.on(
      "send-message",
      async ({ sender, body, game, room, type = "text" }, callback) => {
        game = await gameModel.findById(game).populate("template")
        let newMessage = await message.create({
          sender,
          body,
          game,
          room,
          type,
        });
        newMessage = await newMessage.populate(
          {
            path: "sender",
          },
          // {
          //   path: "game",
          //   populate: {
          //     path: "template",
          //   },
          // },
        );
        console.log("send-message", newMessage);
        callback(newMessage);
        socket.to(room).emit("receive-message", newMessage);
      }
    );
  });
}
