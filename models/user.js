import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    avatar: { type: Object, required: false },
    banner: { type: String, required: false },
    bio: { type: String, required: false },
    isActive: { type: Boolean, required: true, default: true },
    role: { type: String, required: true, default: "player" },
  },
  { timestamps: true }
);

export default models.User || model("User", userSchema);
