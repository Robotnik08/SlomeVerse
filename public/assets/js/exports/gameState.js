import { Time } from "./update.js";
import { KeyHandler } from "./keyHandler.js";
import { Colour } from "./colour.js";
import * as VECTOR from "./vector.js";
import { SpriteManager } from "./gameSprites.js";
import { Canvas } from "./canvasHandler.js";
import { Client } from "./clientHandler.js";

export class Game {
    constructor () {
        //instance of a game, including components and data

        //static components:
        const time = new Time();
        const keyHandler = new KeyHandler();
        const textures = new SpriteManager();
        const can = new Canvas(new VECTOR.Vector2(1280,720));
        const tileSprites = textures.getTileSprites();
        const tileDataSprites = textures.getTileDataSprites();

        can.setImageSmoothing(false);
        can.addToDocumentFront();
        
        //world generation:
        this.loaded = false;
        this.world = [];
        this.worldTileData = {};
        const client = new Client(this);

        //positional components:
        this.cameraPos = new VECTOR.Vector2(0,0);
        this.selectedTile = new VECTOR.Vector2(0,0);

        //zoom init:
        const zoomBounds = new VECTOR.Vector2(2.5,7);
        this.zoom = (zoomBounds.y+zoomBounds.x)/2;


        //subscribing to canvas events:

        //scroll zoom
        can.subscribeEventListener('wheel', (e) => {
            e.preventDefault();
            if (!this.loaded) return;
            this.zoom += e.deltaY/1000*-1;
            if (this.zoom < zoomBounds.x) this.zoom = zoomBounds.x;
            if (this.zoom > zoomBounds.y) this.zoom = zoomBounds.y;
        });

        //checking if mouse is held over canvas
        can.subscribeEventListener('mousedown', (e) => {
            e.preventDefault();
            if (!this.loaded) return;
            if (!e.button) keyHandler.keysDown["MouseLeft"] = true;
            if (e.button) keyHandler.keysDown["MouseRight"] = true;
        });
        can.subscribeEventListener('mouseup', (e) => {
            e.preventDefault();
            if (!this.loaded) return;
            if (!e.button) keyHandler.keysDown["MouseLeft"] = false;
            if (e.button) keyHandler.keysDown["MouseRight"] = false;
        });
        //preventing context menu
        can.subscribeEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!this.loaded) return;
        });

        

        //drawing frames
        const draw = () => {
            if (!this.loaded) return;
            const zoom = this.zoom;
            const cameraPos = this.cameraPos;
            const selectedTile = this.selectedTile;

            can.fixScale();
            can.clearCanvas();
            can.setColour(new Colour(255,255,255));
            can.drawRect(new VECTOR.Vector2(0,0),new VECTOR.Vector2(can.width,can.height));
            const localTileSize = can.percentOfCan(zoom);
            can.setFont("Arial",localTileSize.y/3);
            const centerOffset = new VECTOR.Vector2(cameraPos.x*localTileSize.y*-1+can.width/2,cameraPos.y*localTileSize.y*-1 + can.height/2);
            for (let i = Math.max(0,((cameraPos.x-can.width/2/localTileSize.y)|0)-1); i < Math.min(this.world.length,((cameraPos.x+can.width/2/localTileSize.y)|0)+1); i++) {
                for (let j = Math.max(0,((cameraPos.y-can.height/2/localTileSize.y)|0)-1); j < Math.min(this.world[i].length,((cameraPos.y+can.height/2/localTileSize.y)|0)+1); j++) {
                    can.drawSprite(tileSprites[this.world[i][j]],new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y*1.04,localTileSize.y*1.04));
                }
            }
            for (let i = Math.max(0,((cameraPos.x-can.width/2/localTileSize.y)|0)-1); i < Math.min(this.world.length,((cameraPos.x+can.width/2/localTileSize.y)|0)+1); i++) {
                for (let j = Math.max(0,((cameraPos.y-can.height/2/localTileSize.y)|0)-1); j < Math.min(this.world[i].length,((cameraPos.y+can.height/2/localTileSize.y)|0)+1); j++) {
                    if (this.checkIfMetaExist(new VECTOR.Vector2(i,j), "g")) can.drawSprite(tileDataSprites[this.getMetaData(new VECTOR.Vector2(i,j),"g")],new VECTOR.Vector2(i*localTileSize.y+centerOffset.x,j*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y*1.04,localTileSize.y*1.04));
                }
            }
            can.setColour(new Colour(255,255,255,0.4));
            can.drawRect(new VECTOR.Vector2(selectedTile.x*localTileSize.y+centerOffset.x,selectedTile.y*localTileSize.y+centerOffset.y),new VECTOR.Vector2(localTileSize.y,localTileSize.y));
            can.drawCircle(new VECTOR.Vector2(can.width/2,can.height/2),new VECTOR.Vector2(10,10));
        }
        //camera movement
        let lastMousePos = new VECTOR.Vector2(0,0);
        const cameraPosMoveWithMouse = () => {
            if (!this.loaded) return;
            if (keyHandler.getKey("MouseLeft")) {
                
                this.cameraPos.x += (lastMousePos.x-can.mousePos.x)/can.percentOfCan(this.zoom).y;
                this.cameraPos.y += (lastMousePos.y-can.mousePos.y)/can.percentOfCan(this.zoom).y;
            }
            lastMousePos = can.mousePos;
            this.selectedTile = new VECTOR.Vector2(((this.cameraPos.x+can.mousePos.x/can.percentOfCan(this.zoom).y)-can.width/2/can.percentOfCan(this.zoom).y)|0,((this.cameraPos.y+can.mousePos.y/can.percentOfCan(this.zoom).y)-can.height/2/can.percentOfCan(this.zoom).y)|0);
        }
        //subscribe to update (every frame)
        time.subscribeUpdate(draw);
        time.subscribeUpdate(cameraPosMoveWithMouse);


        
        //public functions

        //JSON conversion
        this.convertToJSON = () => {
            if (!this.loaded) return;
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
    }
}
