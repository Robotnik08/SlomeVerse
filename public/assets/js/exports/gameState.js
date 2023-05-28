import { getNoise } from "./noise.js";
export class GameState {
    constructor (size, seed, smoothness, biomeSmoothness, frequency) {
        this.generator = new WorldGenerator(seed, smoothness, biomeSmoothness, frequency);
        this.world = this.generator.generateWorld(size);
        this.worldTileData = {};
        this.seed = seed;

        this.convertToJSON = () => {
            return JSON.stringify({
                world: this.world,
                worldTileData: this.worldTileData,
                seed: seed
            });
        }
        this.loadFromJSON = (json) => {
            try {
                const obj = JSON.parse(json);
                this.world = obj.world;
                this.worldTileData = obj.worldTileData;
                this.seed = obj.seed;
            } catch (e) {
                console.log("Failed to load game state from JSON");
                console.error(e);
            }
        }
    }
}
export class WorldGenerator {
    constructor (seed, smoothness, biomeSmoothness, frequency) {
        this.generateWorld = (size) => {
            const w = [];
            for (let i = 0; i < size.x; i++) {
                w[i] = [];
                for (let j = 0; j < size.y; j++) {
                    w[i][j] = (getNoise(i*smoothness,j*smoothness,seed) > frequency+(8-getNoise(i*smoothness*0.1,j*smoothness*0.1,seed)*16)) ? 0 : this.getBiome(i,j);
                }
            }
            return w;
        }
        this.getBiome = (x,y) => {
            const n = getNoise(x*biomeSmoothness,y*biomeSmoothness,seed);
            if (n < 0.35) return 2;
            if (n > 0.65) return 3;
            return 1;
        }
    }
}