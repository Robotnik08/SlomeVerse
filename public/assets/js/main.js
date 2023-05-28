import * as VECTOR from "./exports/vector.js";
import { Game } from "./exports/gameState.js";
import { FPS } from "./exports/fps.js";

//values used for the main game
const seed = (Math.random()*Number.MAX_SAFE_INTEGER)|0;
const smoothness = 0.3;
const biomeSmoothness = 0.05;
const frequency = 0.6;

//instance of the main game
const game = new Game(new VECTOR.Vector2(400,400),seed,smoothness,biomeSmoothness,frequency);

//fps counter
const fps = new FPS();
fps.fpsOut = document.getElementById("fps");