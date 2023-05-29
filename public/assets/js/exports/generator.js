import { getNoise } from "./noise.js";
import * as VECTOR from "./vector.js";
import { RandomHandler } from "./random.js";

export class WorldGenerator {
    constructor (config) {
        this.random = new RandomHandler();
        this.generateWorld = (size) => {
            const w = [];
            for (let i = 0; i < size.x; i++) {
                w[i] = [];
                for (let j = 0; j < size.y; j++) {
                    w[i][j] = (getNoise(i*config.smoothness,j*config.smoothness,config.seed) > config.frequency+(8-getNoise(i*config.smoothness*0.1,j*config.smoothness*0.1,config.seed)*16)) ? 0 : this.getBiome(i,j);
                }
            }
            return w;
        }
        this.populateWorld = (world) => {
            const w = {};
            for (let i = 0; i < world.length; i++) {
                for (let j = 0; j < world[i].length; j++) {
                    if (world[i][j] == 0) continue;
                    const noiseValue = getNoise(i*config.smoothness*0.5,j*config.smoothness*0.5,config.seed);
                    if (noiseValue > 0.73) {
                        w[new VECTOR.Vector2(i,j)] = {
                            g: 0
                        }
                    } else if (noiseValue < 0.2) {
                        w[new VECTOR.Vector2(i,j)] = {
                            g: 1
                        }
                    }
                    if (this.random.percentChance(config.forestFrequency)) {
                        w[new VECTOR.Vector2(i,j)] = {
                            g: 1
                        }
                    }
                }
            }
            return w;
        }
        this.getBiome = (x,y) => {
            const n = getNoise(x*config.biomeSmoothness,y*config.biomeSmoothness,config.seed);
            if (n < 0.35) return 2;
            if (n > 0.65) return 3;
            return 1;
        }
    }
}