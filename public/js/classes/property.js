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
        this.purchaseable = true;
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
            if(this.isMonopoly()) {
                //THIS NEEDS TO BE CHANGED
                player.addMoney(this.rent[rentLevel] * -1 * 2); //if its a monopoly rent doubles
            } else {
                player.addMoney(this.rent[rentLevel] * -1); //subtracts the rent of this property from the player's total
            }
        } 
    }
    isMonopoly() {
        // uses isMonopoly method from the avenue class this property is apart of
        return this.avenue.isMonopoly();
    }
    startAuction() {
        //placeholder
    }
}
module.exports = property;