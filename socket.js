import message from "./models/message.js";
import gameModel from "./models/game.js";
import initialState from "./models/initialState.js";
import game from "./models/game.js";
import user from "./models/user.js";
import roomModel from "./models/room.js";
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

    socket.on("update-message", async ({ messageId, seenBy }, callback) => {
      let updatedMessage = await message.findByIdAndUpdate(messageId, { seenBy: [seenBy] }, { new: true })
      updatedMessage = await updatedMessage.populate({
        path: "seenBy",
      });
      console.log("update-message", oldmessage);
      socket.to(roomId).emit("on-start-typing", username);
    })

    socket.on("start-typing", ({ roomId, username }, callback) => {
      console.log("start", { roomId, username });
      socket.to(roomId).emit("on-start-typing", username);
    })

    socket.on("stop-typing", ({ roomId, username }, callback) => {
      console.log("stop", { roomId, username });
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
        await roomModel.findByIdAndUpdate(room, { lastMessage: newMessage })
        callback(newMessage)
        socket.to(room).emit("receive-message", newMessage);
      }
    );

    socket.on("start-game", async ({ room, slug }, callback) => {
      try {
        const { state } = await game.findById(room)
        callback(state)
        socket.to(room).emit("update-state", state);
      } catch (e) {
        console.error(e);
      }


    })

    socket.on("update-game", async ({ room, state }, callback) => {
      const newState = await game.findByIdAndUpdate(room, { state }, { new: true })
      // games[room] = state
      console.log("update-game", newState);
      socket.to(room).emit("update-state", newState.state);
    });
  });


}