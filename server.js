import express from "express";
import { Server } from "socket.io";
import http from "http";

import { WorldGenerator } from "./assets/js/generator.js";
import { GameConfig } from "./public/assets/js/exports/stateLoader.js";

const config = new GameConfig();
config.loadFromJson("./assets/json/config.json");
const generator = new WorldGenerator(config);

const app = express();
const server = http.createServer(app);
const port = 2020;
app.use(express.static('public'));
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
const io = new Server(server);