import mongoose from "mongoose";
import room from "./room.js";
import user from "./user.js";
import game from "./game.js";

const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: room.modelName,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: user.modelName,
    },
    body: {
      type: String,
    },
    game: {
      type: Schema.Types.ObjectId,
      ref: game.modelName,
    },
    type: {
      type: String,
      default: "text",
    },
  },
  { timestamps: true }
);

export default models.Message || model("Message", messageSchema);
