import { Sprite } from "./sprite.js";

export class SpriteManager {
    constructor () {
        this.getTileSprites = () => {
            return [
                new Sprite("assets/img/waterTile.png"),
                new Sprite("assets/img/grassTile.png"),
                new Sprite("assets/img/snowTile.png"),
                new Sprite("assets/img/desertTile.png")
            ];
        }
        this.getTileDataSprites = () => {
            return [
                new Sprite("assets/img/mountainTile.png"),
                new Sprite("assets/img/forestTile.png")
            ];
        }
    }
}
