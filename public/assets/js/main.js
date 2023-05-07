import { Canvas } from "./exports/canvasHandler.js";
import * as VECTOR from "./exports/vector.js";
// canvasInit

const can = new Canvas(new VECTOR.Vector2(500,500));
can.addToDocument();
can.drawCircle(new VECTOR.Vector2(250,250), 50);
