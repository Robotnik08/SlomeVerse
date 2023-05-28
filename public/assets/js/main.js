import { Canvas } from "./exports/canvasHandler.js";
import * as VECTOR from "./exports/vector.js";
import { Colour } from "./exports/colour.js";
import { Time } from "./exports/update.js";
import { KeyHandler } from "./exports/keyHandler.js";
import { getNoise } from "./exports/noise.js";
import { Sprite } from "./exports/sprite.js";

// canvasInit
const can = new Canvas(new VECTOR.Vector2(1280,720));
const game = new Time();
const keyHandler = new KeyHandler();
const seed = 123;
const smoothness = 0.1;
const frequency = 0.6;
const world = generateWorld(new VECTOR.Vector2(1000,1000));
const cameraPos = new VECTOR.Vector2(world.length/2,world[0].length/2);
const selectedTile = new VECTOR.Vector2(0,0);
const tileSprites = [
    new Sprite("assets/img/grassTile.png"),
    new Sprite("assets/img/waterTile.png")
];
function generateWorld (size) {
    const w = [];
    for (let i = 0; i < size.x; i++) {
        w[i] = [];
        for (let j = 0; j < size.y; j++) {
            w[i][j] = (getNoise(i*smoothness,j*smoothness,seed) > frequency+(4-getNoise(i*smoothness*0.1,j*smoothness*0.1,seed)*8)) ? 1 : 0;
        }
    }
    return w;
}
can.addToDocument();
const zoomBounds = new VECTOR.Vector2(2.5,7);
let zoom = (zoomBounds.y+zoomBounds.x)/2;
can.can.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom += e.deltaY/1000*-1;
    if (zoom < zoomBounds.x) zoom = zoomBounds.x;
    if (zoom > zoomBounds.y) zoom = zoomBounds.y;
});
can.can.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (!e.button) keyHandler.keysDown["MouseLeft"] = true;
    if (e.button) keyHandler.keysDown["MouseRight"] = true;
});
can.can.addEventListener('mouseup', (e) => {
    e.preventDefault();
    if (!e.button) keyHandler.keysDown["MouseLeft"] = false;
    if (e.button) keyHandler.keysDown["MouseRight"] = false;
});
can.can.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
// draw
function draw() {
    can.fixScale();
    can.clearCanvas();
    can.setColour(new Colour(255,255,255));
    can.drawRect(new VECTOR.Vector2(0,0),new VECTOR.Vector2(can.width,can.height));
    const localTileSize = can.percentOfCan(zoom);
    const centerOffset = new VECTOR.Vector2(cameraPos.x*localTileSize.y*-1+can.width/2,cameraPos.y*localTileSize.y*-1 + can.height/2);
    for (let i = Math.max(0,((cameraPos.x-can.width/2/localTileSize.y)|0)-1); i < Math.min(world.length,((cameraPos.x+can.width/2/localTileSize.y)|0)+1); i++) {
        for (let j = Math.max(0,((cameraPos.y-can.height/2/localTileSize.y)|0)-1); j < Math.min(world[i].length,((cameraPos.y+can.height/2/localTileSize.y)|0)+1); j++) {
            // switch (world[i][j]) {
            //     case 0:
            //         can.setColour(new Colour(0,255,0));
            //         break;
            //     case 1:
            //         can.setColour(new Colour(0,0,255));
            //         break;
            //     case 2:
            //         can.setColour(new Colour(255,0,0));
            //         break;
            //     default:
            //         can.setColour(new Colour(0,0,0));
            //         break;
            // }
            //can.drawRect(new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y*1.04,localTileSize.y*1.04));
            can.drawSprite(tileSprites[world[i][j]],new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y*1.04,localTileSize.y*1.04));
        }
    }
    can.drawCircle(new VECTOR.Vector2(can.width/2,can.height/2),new VECTOR.Vector2(10,10));
}
let lastMousePos = new VECTOR.Vector2(0,0);
function cameraPosMoveWithMouse () {
    if (keyHandler.getKey("MouseLeft")) {
        
        cameraPos.x += (lastMousePos.x-can.mousePos.x)/can.percentOfCan(zoom).y;
        cameraPos.y += (lastMousePos.y-can.mousePos.y)/can.percentOfCan(zoom).y;
    }
    lastMousePos = can.mousePos;
    requestAnimationFrame(cameraPosMoveWithMouse);
}
cameraPosMoveWithMouse();
game.subscribeUpdate(draw);