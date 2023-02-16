import message from "./models/message.js";
import gameModel from "./models/game.js";

const games = {}

export default function configureSocket(io) {
  io.on("connection", (socket) => {
    // const session = socket.request.session;
    // console.log("session", session);

    socket.on("enter-room", ({ roomId, userId }, callback) => {
      socket.join(roomId);
      socket.userId = userId;
      // callback(`user ${userId} joined room ${roomId}`);
    });

    socket.on("leave-room", ({ roomId, userId }, callback) => {
      socket.leave(roomId);
      socket.userId = userId;
      // callback(`user ${userId} left room ${roomId}`);
    });

    socket.on("start-typing", ({roomId, username}, callback) => {
      console.log("start", {roomId, username});
      socket.to(roomId).emit("on-start-typing", username);
    })

    socket.on("stop-typing", ({roomId, username}, callback) => {
      console.log("stop", {roomId, username});
      socket.to(roomId).emit("on-stop-typing", username);
    })

    socket.on(
      "send-message",
      async ({ sender, body, game, room, type = "text", inGame = false }, callback) => {
        const payload = {
          sender,
          body,
          room,
          type,
          inGame
        };
        game = await gameModel.findById(game).populate({
          path: "template",
          select: "name"
        }).lean();
        if (game) {
          payload.game = game;
          console.log("game", game);
        }
        let newMessage = await message.create(payload);
        newMessage = await newMessage.populate({
          path: "sender",
        });
        callback(newMessage)
        socket.to(room).emit("receive-message", newMessage);
      }
    );

    socket.on("start-game", ({ room, state }, callback) => {
      if (games[room]) {
        socket.to(room).emit("update-state", games[room]);
      } else {
        games[room] = state
        console.log("games", games);
        socket.to(room).emit("update-state", state);
      }
    })

    socket.on("update-game", ({ room, state }, callback) => {
      console.log("update-game", state);
      games[room] = state
      socket.to(room).emit("update-state", state);
    });
  });


}