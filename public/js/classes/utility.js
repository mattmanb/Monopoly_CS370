// utility class

class utility {
    constructor({name, price, mortgage}) {
        this.name = name;
        this.price = price;
        this.mortgage = mortgage;
        this.owner = null;
        this.type = "utility";
    }
    isOwned() {
        if(this.owner !== null) {
            return true;
        } else {
            return false;
        }
    }
    payRent(player, diceTotal) {
        if(player === this.owner) {
            console.log("Welcome to your property!");
            return;
        }
        let amountOwed = 0;
        if(this.owner.utilitiesOwned === 2) {
            amountOwed = diceTotal * 10;
        } else if(this.owner.utilitiesOwned === 1) {
            amountOwed = diceTotal * 4;
        }
        player.money -= amountOwed;
        player.checkMoney();
        return amountOwed;
    }
}
module.exports = utility;