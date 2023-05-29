import { GameConfig } from "./assets/js/stateLoader.js";
import { Game } from "./assets/js/serverState.js";

const config = new GameConfig();
config.loadFromJson("assets/json/config.json");

const main = new Game(config);