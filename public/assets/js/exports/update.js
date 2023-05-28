export class Time {
    constructor() {
        this.deltaTime = 0;
        this.lastTime = Date.now();
        this.currentTime = Date.now();
        this.updateFunctions = [];
        this.fixedUpdateFunctions = [];
        this.timeSinceLastFixedUpdate = 0;
        this.update = () => {
            if (this.updateFunctions.length == 0) return;
            for (let i in this.updateFunctions) {
                this.updateFunctions[i](this.deltaTime);
            }
        }
        this.fixedUpdate = () => {
            if (this.fixedUpdateFunctions.length == 0) return;
            for (let i in this.fixedUpdateFunctions) {
                this.fixedUpdateFunctions[i]();
            }
        }
        this.trueUpdate = () => {
            this.currentTime = Date.now();
            this.deltaTime = (this.currentTime - this.lastTime) / 1000;
            this.timeSinceLastFixedUpdate += this.currentTime - this.lastTime;
            this.lastTime = this.currentTime;
            //update every frame
            this.update();
            //fixed update 60 times a second
            while (this.timeSinceLastFixedUpdate >= 1000/60) {
                this.fixedUpdate();
                this.timeSinceLastFixedUpdate -= 1000/60;
            }
            requestAnimationFrame(this.trueUpdate);
        }
        this.subscribeUpdate = (func) => {
            this.updateFunctions.push(func);
        }
        this.unsubscribeUpdate = (func) => {
            this.updateFunctions.splice(this.updateFunctions.indexOf(func), 1);
        }
        this.subscribeFixedUpdate = (func) => {
            this.fixedUpdateFunctions.push(func);
        }
        this.unsubscribeFixedUpdate = (func) => {
            this.fixedUpdateFunctions.splice(this.updateFunctions.indexOf(func), 1);
        }

        //start the loop
        this.trueUpdate();
    }
}