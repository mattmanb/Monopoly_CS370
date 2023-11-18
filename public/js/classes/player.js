// Player class
class player {
    constructor({ name, piece, playerNumber }) {
        this.name = name;
        this.piece = piece;
        this.money = 1500;
        this.currentPosition = 0;
        this.inJail = false;
        this.outOfJailCards = 0;
        this.turnsInJail = 0;
        this.playerNumber = playerNumber;
    }

    addMoney(money) {
        this.money += money
        if(this.money <= 0) {
            bankrupt();
        }
        return
    }
    bankrupt() {
        //method to handle bankrupcy
    }
}
