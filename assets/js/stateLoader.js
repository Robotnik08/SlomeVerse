import fs from 'fs';

export class GameConfig {
    constructor () {
        this.seed;
        this.mapSize;
        this.smoothness;
        this.biomeSmoothness;
        this.frequency;
        this.forestFrequency;
        this.loadFromJson = (jsonLoc) => {
            const json = JSON.parse(fs.readFileSync(jsonLoc));
            this.seed = !json.seed ? (Math.random()*Number.MAX_SAFE_INTEGER)|0 : json.seed;
            this.mapSize = json.mapSize;
            this.smoothness = json.smoothness;
            this.biomeSmoothness = json.biomeSmoothness;
            this.frequency = json.frequency;
            this.forestFrequency = json.forestFrequency;
        }
    }
}