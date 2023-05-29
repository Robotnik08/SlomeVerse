import { GameConfig } from "./exports/stateLoader.js";
import { Game } from "./exports/gameState.js";
import { FPS } from "./exports/fps.js";

//values used for the main game
const config = new GameConfig();
config.loadFromJson("assets/json/config.json");

//instance of the main game
const game = new Game(config);

//fps counter
const fps = new FPS();
fps.fpsOut = document.getElementById("fps");