export default function configureSocket(io) {
    io.on("connection", (socket) => {
        // Generate a random username and send it to the client to display it
        const username = `User ${Math.round(Math.random() * 999999)}`;
        socket.emit("name", username);
        // socket.join("room");

        socket.on("set-room", (roomName) => {
            console.log(roomName)
            socket.join(roomName)
        });

        // Receive incoming messages and broadcast them
        socket.on("send-message", (newMessage) => {
            console.log(newMessage)
            socket.to(newMessage.room).emit("receive-message", newMessage);
        });
    });
}