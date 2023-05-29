import * as VECTOR from "./vector.js";

export class Client {
    constructor (game) {
        const socket = io;
        const main = game;

        setInterval(() => {
            socket.emit('game');
        }, 1000);
        socket.on('game', (data) => {
            if (main.loaded) return;
            main.loadFromJSON(data);
            main.cameraPos = new VECTOR.Vector2(main.world.length/2, main.world[0].length/2);
            main.loaded = true;
        });
    }
}