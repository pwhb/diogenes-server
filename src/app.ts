import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import configureServer from "./lib/server";
import configureSocket from "./lib/socket";

const app = express();
const httpServer = createServer(app);

const port = process.env.PORT || 3123;
const clientUrl = process.env.CLIENT_URL;

const io = new Server(httpServer, {
    cors: {
        origin: clientUrl,
    },
});
configureServer(app);
configureSocket(io);

httpServer.listen(port);
console.log(`server listening on ${process.env.ENV === "DEV" ? `http://localhost:${port}` : `port: ${port}`} `);
