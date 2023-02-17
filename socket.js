import message from "./models/message.js";
import gameModel from "./models/game.js";
import initialState from "./models/initialState.js";

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
        callback(newMessage)
        socket.to(room).emit("receive-message", newMessage);
      }
    );

    socket.on("start-game", async ({ room, slug }, callback) => {
      try {
    
     
        if (games[room]) {
          socket.to(room).emit("update-state", games[room]);
          console.log("old game");
          callback(games[room])
        } else {
          console.log("slug", slug);
          const { state } = await initialState.findOne({ slug }).lean()
          console.log("state from db", state);
          if (slug === "guess-the-number") {
            state.secretNumber = Math.floor(Math.random() * 100)
          }
          games[room] = state
          console.log("new game");
          console.log("games", games);
          socket.to(room).emit("update-state", state);
          callback(state)
        }
      } catch (e) {
        console.error(e);
      }


    })

    socket.on("update-game", ({ room, state }, callback) => {
      console.log("update-game", state);
      games[room] = state
      socket.to(room).emit("update-state", state);
    });
  });


}