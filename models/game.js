import mongoose from "mongoose";

import gameTemplate from "./gameTemplate.js";

import user from "./user.js";

const { Schema, model, models } = mongoose;

const gameSchema = new Schema(
  {
    template: {
      type: Schema.Types.ObjectId,
      ref: gameTemplate.modelName,
    },
    mode: { type: String, default: "casual" },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: user.modelName,
      },
    ],
    playerCount: { type: Number },
    state: {
      type: Object
    }
  },
  { timestamps: true }
);

export default models.Game || model("Game", gameSchema);
