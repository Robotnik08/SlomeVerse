export class Sprite {
    constructor (link) {
        this.image = new Image();
        this.image.src = link;
        this.width = 0;
        this.height = 0;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }
}