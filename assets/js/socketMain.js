import express from "express";
import http from "http";
import { Server } from "socket.io";

export class MainServer  {
    constructor (game, port) {
        const main = game;
        const app = express();
        const server = http.createServer(app);
        app.use(express.static('public'));
        server.listen(port, () => {
            console.log(`listening on *:${port}`);
        });
        const io = new Server(server);

        io.on('connection', (socket) => {
            console.log('a user connected');
            let send = false;
            socket.on('game', () => {
                if (send) return;
                socket.emit('game', main.convertToJSON());
                send = true;
            });
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
} 