// railroad class

class railroad {
    constructor({name, price, mortgage}) {
        this.name = name
        this.price = price
        this.mortgage = mortgage
        this.owner = null
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
            player.addMoney(-1 * 25 * 2**(this.owner.railroads.length-1));
        }
        return;
    }
    queryPurchase() {
        // empty function for now
    }
    startAuction() {
        // empty function for now
    }

}
module.exports = railroad;