import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose, { connect } from "mongoose"
import configureServer from "./server.js";
import configureSocket from "./socket.js";


const app = express();
const httpServer = createServer(app);

const { PORT, CLIENT_URL, MONGODB_URI } = process.env;

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
  },
});

configureServer(app)
configureSocket(io)

mongoose.set('strictQuery', false)

connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("database connected")
  httpServer.listen(PORT);
  console.log("server listening on port: ", PORT)
});
