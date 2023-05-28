import { Canvas } from "./exports/canvasHandler.js";
import * as VECTOR from "./exports/vector.js";
import { Colour } from "./exports/colour.js";
import { Time } from "./exports/update.js";
import { KeyHandler } from "./exports/keyHandler.js";
import { getNoise } from "./exports/noise.js";
import { Sprite } from "./exports/sprite.js";
import { GameState } from "./exports/gameState.js";

// canvasInit
const names = ["water","grass","snow","desert","mountain","forest",
"swamp","jungle","tundra","taiga","savanna","plains","ice","volcano","cave","beach","ocean","lake","river","cliff","canyon","valley","plateau","mesa","glacier","island","archipelago","peninsula","isthmus","cape","bay","gulf","strait","channel","delta","estuary","fjord","sound","lagoon","atoll","reef","barrier reef","coral reef","barrier island","sandbar","spit","tombolo","isthmus","floodplain","floodway","flood zone","floodgate","floodwall","levee","dike","dam","reservoir","lake","pond","marsh","wetland","swamp","bog","fen","bayou","slough","sluice","sluiceway","sluice gate","sluice valve","sluice room","sluice chamber","sluice tunnel","sluice pipe","sluice shaft","sluice well","sluice pit","sluice hole","sluice duct","sluice channel","sluice canal","sluice waterway","sluice watercourse","sluice waterworks","sluice aqueduct","sluice cistern","sluice reservoir","sluice tank","sluice pool","sluice puddle","sluice lake","sluice pond","sluice marsh","sluice fen","sluice bog","sluice swamp","sluice bayou","sluice slough","sluice creek","sluice stream","sluice river","sluice estuary","sluice delta","sluice mouth","sluice inlet","sluice arm","sluice branch","sluice fork","sluice tributary","sluice confluence","sluice headwaters","sluice source","sluice spring","sluice well","sluice pump","sluice aquifer","sluice waterhole","sluice water pocket"
];
const can = new Canvas(new VECTOR.Vector2(1280,720));
const game = new Time();
const keyHandler = new KeyHandler();
const seed = (Math.random()*Number.MAX_SAFE_INTEGER)|0;
const smoothness = 0.3;
const biomeSmoothness = 0.05;
const frequency = 0.6;
const gameState = new GameState(new VECTOR.Vector2(500,500),seed,smoothness,biomeSmoothness,frequency);
const cameraPos = new VECTOR.Vector2(gameState.world.length/2,gameState.world[0].length/2);
let selectedTile = new VECTOR.Vector2(0,0);
const tileSprites = [
    new Sprite("assets/img/waterTile.png"),
    new Sprite("assets/img/grassTile.png"),
    new Sprite("assets/img/snowTile.png"),
    new Sprite("assets/img/desertTile.png"),
    new Sprite("assets/img/mountainTile.png")
];
can.addToDocumentFront();
const zoomBounds = new VECTOR.Vector2(2.5,7);
let zoom = (zoomBounds.y+zoomBounds.x)/2;

document.getElementById("button-log").addEventListener('click', () => {
    console.log(gameState.convertToJSON());
});
document.getElementById("button-load").addEventListener('click', () => {
    gameState.loadFromJSON(document.getElementById("jsonInput").value);
});
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
    can.setFont("Arial",localTileSize.y/3);
    const centerOffset = new VECTOR.Vector2(cameraPos.x*localTileSize.y*-1+can.width/2,cameraPos.y*localTileSize.y*-1 + can.height/2);
    for (let i = Math.max(0,((cameraPos.x-can.width/2/localTileSize.y)|0)-1); i < Math.min(gameState.world.length,((cameraPos.x+can.width/2/localTileSize.y)|0)+1); i++) {
        for (let j = Math.max(0,((cameraPos.y-can.height/2/localTileSize.y)|0)-1); j < Math.min(gameState.world[i].length,((cameraPos.y+can.height/2/localTileSize.y)|0)+1); j++) {
            can.drawSprite(tileSprites[gameState.world[i][j]],new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y*1.04,localTileSize.y*1.04));
        }
    }
    for (let i = Math.max(0,((cameraPos.x-can.width/2/localTileSize.y)|0)-1); i < Math.min(gameState.world.length,((cameraPos.x+can.width/2/localTileSize.y)|0)+1); i++) {
        for (let j = Math.max(0,((cameraPos.y-can.height/2/localTileSize.y)|0)-1); j < Math.min(gameState.world[i].length,((cameraPos.y+can.height/2/localTileSize.y)|0)+1); j++) {
            if (checkIfMetaExist(new VECTOR.Vector2(i,j), "name")) can.drawText(gameState.worldTileData[new VECTOR.Vector2(i,j)]["name"],new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y+localTileSize.y),new VECTOR.Vector2(localTileSize.y,localTileSize.y));
        }
    }
    can.setColour(new Colour(255,255,255,0.4));
    can.drawRect(new VECTOR.Vector2(selectedTile.x*localTileSize.y+centerOffset.x,selectedTile.y*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y,localTileSize.y));
    can.drawCircle(new VECTOR.Vector2(can.width/2,can.height/2),new VECTOR.Vector2(10,10));
}
let lastMousePos = new VECTOR.Vector2(0,0);
function cameraPosMoveWithMouse () {
    if (keyHandler.getKey("MouseLeft")) {
        
        cameraPos.x += (lastMousePos.x-can.mousePos.x)/can.percentOfCan(zoom).y;
        cameraPos.y += (lastMousePos.y-can.mousePos.y)/can.percentOfCan(zoom).y;
    }
    if (keyHandler.getKey("MouseRight")) {
        setMetaData(selectedTile,"name",names[(Math.random()*names.length)|0]);
    }
    lastMousePos = can.mousePos;
    selectedTile = new VECTOR.Vector2(((cameraPos.x+can.mousePos.x/can.percentOfCan(zoom).y)-can.width/2/can.percentOfCan(zoom).y)|0,((cameraPos.y+can.mousePos.y/can.percentOfCan(zoom).y)-can.height/2/can.percentOfCan(zoom).y)|0);
    requestAnimationFrame(cameraPosMoveWithMouse);
}
function setMetaData (pos,dataname,data) {
    if (gameState.worldTileData[pos] == null) gameState.worldTileData[pos] = {};
    gameState.worldTileData[pos][dataname] = data;
}
function checkIfMetaExist (pos,dataname) {
    if (gameState.worldTileData[pos] == null) return false;
    return gameState.worldTileData[pos][dataname] != null;
}
cameraPosMoveWithMouse();
game.subscribeUpdate(draw);