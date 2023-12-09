// property class

class property{ //color to be implemented in street.js
    constructor({ name, price, rent, houseCost, mortgage, avenue }) {
        this.name = name;
        this.price = price;
        this.rent = rent; //list of rents with houses then hotel
        this.rentLevel = 0; //base rent is rent[0]
        this.isMonopoly = false;
        this.houseCost = houseCost;
        this.numHouses = 0;
        this.mortgage = mortgage;
        this.owner = null;
        this.avenue = avenue; //what avenue this property is a part of
        this.type = "property";
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
            if(this.checkMonopoly()) {
                //THIS NEEDS TO BE CHANGED
                const rent = this.rent[this.rentLevel] * 2
                player.money -= rent; //if its a monopoly rent doubles
                player.checkMoney();
                return rent;
            } else {
                const rent = this.rent[this.rentLevel]
                player.money -= rent; //subtracts the rent of this property from the player's total
                player.checkMoney();
                return rent;
            }
        } else {
            console.log("Welcome to your property!");
            return 0;
        }
    }
    checkMonopoly() {
        // uses isMonopoly method from the avenue class this property is apart of
        return this.avenue.checkMonopoly();
    }
}
module.exports = property;