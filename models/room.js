import mongoose from "mongoose";
import user from "./user.js";

const { Schema, model, models } = mongoose;

const roomSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: user.modelName,
      },
    ],
    type: {
      type: String,
      default: "private",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
    },
    lastMessage: {
      type: Object
    }
  },
  { timestamps: true }
);

export default models.Room || model("Room", roomSchema);
