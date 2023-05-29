export class Time {
    constructor() {
        this.updateFunctions = [];
        this.fixedUpdateFunctions = [];
        this.update = () => {
            if (this.updateFunctions.length == 0) return;
            for (let i in this.updateFunctions) {
                this.updateFunctions[i]();
            }
        }
        this.subscribeUpdate = (func) => {
            this.updateFunctions.push(func);
        }
        this.unsubscribeUpdate = (func) => {
            this.updateFunctions.splice(this.updateFunctions.indexOf(func), 1);
        }

        //start the loop
        setInterval(this.update, 1000/60);
    }
}