import { Game } from "./exports/gameState.js";
import { FPS } from "./exports/fps.js";

//instance of the main game
const game = new Game();

//fps counter
const fps = new FPS();
fps.fpsOut = document.getElementById("fps");

