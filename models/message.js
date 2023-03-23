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
      type: Object,
      // ref: game.modelName,
    },
    type: {
      type: String,
      default: "text",
    },
    inGame: {
      type: Boolean,
      default: false
    },
    seenBy: {
			type: [Schema.Types.ObjectId],
			default: [],
      ref: user.modelName
		}
  },
  { timestamps: true }
);

export default models.Message || model("Message", messageSchema);
