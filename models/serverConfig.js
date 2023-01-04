import { Schema, model } from "mongoose";

const serverConfigSchema = new Schema({

}, {
    strict: false,
    timestamps: false
});

const ServerConfig = model("ServerConfig", serverConfigSchema);

export default ServerConfig;