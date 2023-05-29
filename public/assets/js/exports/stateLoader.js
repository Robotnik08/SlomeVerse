export class GameConfig {
    constructor () {
        this.seed;
        this.mapSize;
        this.smoothness;
        this.biomeSmoothness;
        this.frequency;
        this.forestFrequency;
        this.loadFromJson = (jsonLoc) => {
            const json = JSON.parse(`{
                "seed": 0,
                "mapSize": {
                    "x": 400,
                    "y": 400
                },
                "smoothness": 0.3,
                "biomeSmoothness": 0.05,
                "frequency": 0.61,
                "forestFrequency": 0.1
            }`);
            this.seed = !json.seed ? (Math.random()*Number.MAX_SAFE_INTEGER)|0 : json.seed;
            this.mapSize = json.mapSize;
            this.smoothness = json.smoothness;
            this.biomeSmoothness = json.biomeSmoothness;
            this.frequency = json.frequency;
            this.forestFrequency = json.forestFrequency;
        }
    }
}