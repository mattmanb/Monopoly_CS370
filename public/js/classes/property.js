// property class

export class property { //color to be implemented in street.js
    constructor({ name, price, rent, houseCost, mortgage }) {
        this.name = name;
        this.price = price;
        this.rent = rent; //list of rents with houses then hotel
        this.houseCost = houseCost;
        this.mortgage = mortgage;
        this.owner = null;
    }
    getName() {
        return this.name;
    }
}
