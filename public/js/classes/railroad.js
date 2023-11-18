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

}