import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const serverConfigSchema = new Schema(
  {},
  {
    strict: false,
    timestamps: false,
  }
);

export default models.ServerConfig || model("ServerConfig", serverConfigSchema);
