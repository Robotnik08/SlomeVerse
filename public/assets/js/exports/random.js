export class RandomHandler {
    constructor () {
        this.getRandomNumber = (min, max) => {
            return (Math.random() * (max - min + 1) + min)|0;
        }
        this.randomChance = (chance) => {
            return !this.getRandomNumber(0,chance);
        }
        this.percentChance = (chance) => {
            return this.getRandomNumber(0,100) < chance;
        }
    }
}