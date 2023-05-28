import { Sprite } from "./sprite.js";

export function getTileSprites () {
    return [
        new Sprite("assets/img/waterTile.png"),
        new Sprite("assets/img/grassTile.png"),
        new Sprite("assets/img/snowTile.png"),
        new Sprite("assets/img/desertTile.png"),
        new Sprite("assets/img/mountainTile.png")
    ];
}