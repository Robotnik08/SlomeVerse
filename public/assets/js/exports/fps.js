export class FPS {
    constructor () {
        const filterStrength = 20. 
        let frameTime = 0, lastLoop = new Date, thisLoop;
        this.fpsOut;

        function fpsLoop () {
            var thisFrameTime = (thisLoop=new Date) - lastLoop;
            frameTime+= (thisFrameTime - frameTime) / filterStrength;
            lastLoop = thisLoop;
            requestAnimationFrame(fpsLoop);
        }
        fpsLoop();
        setInterval(() =>{
            if (this.fpsOut) this.fpsOut.innerHTML = (1000/frameTime).toFixed(1) + " fps";
        },1000);
    }
}