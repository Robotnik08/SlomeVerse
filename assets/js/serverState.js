import { Time } from "./update.js";
import { WorldGenerator } from "./generator.js";
import { MainServer } from "./socketMain.js";

export class Game {
    constructor (config) {
        //instance of a game, including components and data

        //static components:
        const time = new Time();
        const generator = new WorldGenerator(config);
        
        //world generation check:
        this.loaded = true;
        this.world = generator.generateWorld();
        this.worldTileData = generator.populateWorld(this.world);

        //JSON conversion
        this.convertToJSON = () => {
            if (!this.loaded) return;
            return JSON.stringify({
                world: this.world,
                worldTileData: this.worldTileData,
                seed: config.seed
            });
        }
        this.loadFromJSON = (json) => {
            if (!this.loaded) return;
            try {
                const obj = JSON.parse(json);
                this.world = obj.world;
                this.worldTileData = obj.worldTileData;
                config.seed = obj.seed;
            } catch (e) {
                console.log("Failed to load game state from JSON");
            }
        }

        //setting tileData
        this.setMetaData = (pos,dataname,data) => {
            if (!this.loaded) return;
            if (this.worldTileData[pos] == null) this.worldTileData[pos] = {};
            this.worldTileData[pos][dataname] = data;
        }
        this.getMetaData = (pos,dataname) => {
            if (!this.loaded) return;
            if (this.worldTileData[pos] == null) return null;
            return this.worldTileData[pos][dataname];
        }
        this.checkIfMetaExist = (pos,dataname) => {
            if (!this.loaded) return;
            if (this.worldTileData[pos] == null) return false;
            return this.worldTileData[pos][dataname] != null;
        }

        this.server = new MainServer(this, 2020);
    }
}
