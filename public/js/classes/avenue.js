const property = require("./property");

class avenue {
    constructor({ name, color, spaces }) {
        this.name = name;
        this.color = color;
        this.spaces = spaces; //list of property positions for this avenue on the board
        this.properties = [];
        this.isMonopoly = false;
    }
    addProperty(property) {
        this.properties.push(property);
    }
    checkMonopoly() {
        const ground_owner = this.properties[0].owner;
        for(const property in this.properties) {
            if(property.owner !== ground_owner) {
                this.isMonopoly = false;
                return false;
            }
        }
        this.isMonopoly = true;
        this.setMonopoly();
        return true;
    }
    setMonopoly() {
        for(property in this.properties) {
            property.isMonopoly = true;
        }
    }
    removeMonopoly() {
        for(property in this.properties) {
            property.isMonopoly = false;
        }
    }
}
module.exports = avenue;