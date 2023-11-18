// property class

class property{ //color to be implemented in street.js
    constructor({ name, price, rent, houseCost, mortgage }) {
        this.name = name;
        this.price = price;
        this.rent = rent; //list of rents with houses then hotel
        this.rentLevel = 0; //base rent is rent[0]
        this.houseCost = houseCost;
        this.numHouses = 0;
        this.mortgage = mortgage;
        this.owner = null;
    }
    isOwned() {
        if(this.owner !== null) {
            return true;
        } else {
            return false;
        }
    }
    payRent(player) {
        if(this.owner !== player) {
            player.addMoney(this.rent[rentLevel] * -1); //subtracts the rent of this property from the player's total
        } 
    }
    queryPurchase(player) {
        if(player.money >= this.price) {
            
        }
    }
}
module.exports = property;