// railroad class

class railroad {
    constructor({name, price, mortgage}) {
        this.name = name;
        this.price = price;
        this.mortgage = mortgage;
        this.owner = null;
        this.type = "railroad";
    }
    isOwned() {
        if(this.owner !== null) {
            return true;
        } else {
            return false;
        }
    }
    payRent(player) {
        if(player === this.owner) {
            console.log("Welcome to your property!")
        } else {
            //25 for 1 railroad, 50 for 2, 100 for 3, 200 for all 4
            const rent = 25 * 2**(this.owner.railroadsOwned-1);
            player.money -= rent;
            player.checkMoney();
            return rent;
        }
        return;
    }
}
module.exports = railroad;