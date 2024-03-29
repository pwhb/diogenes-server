import { Server, Socket } from "socket.io";
import SocketEvents from "./consts/SocketEvents";

const games = {};

interface ISocket extends Socket
{
    userId?: string,
    roomId?: string;
}

export default function configureSocket(io: Server)
{
    io.on(SocketEvents.Connection, (socket: ISocket) =>
    {
        // const session = socket.request.session;
        // console.log("session", session);

        socket.on(SocketEvents.EnterRoom, ({ roomId, userId }, _callback) =>
        {
            socket.join(roomId);
            socket.userId = userId;
            socket.roomId = roomId;
            // callback(`user ${userId} joined room ${roomId}`);
        });

        socket.on(SocketEvents.LeaveRoom, ({ roomId, userId }, _callback) =>
        {
            socket.leave(roomId);
            socket.userId = userId;
            // callback(`user ${userId} left room ${roomId}`);
        });

        socket.on(SocketEvents.StartTyping, ({ roomId, username }, _callback) =>
        {
            console.log("start", { roomId, username });
            socket.to(roomId).emit("on-start-typing", username);
        });

        socket.on(SocketEvents.StopTyping, ({ roomId, username }, _callback) =>
        {
            console.log("stop", { roomId, username });
            socket.to(roomId).emit("on-stop-typing", username);
        });
    });


}