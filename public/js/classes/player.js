// Player class
export class player {
    constructor(name, piece) {
        this.name = name
        this.piece = piece
        this.money = 1500
        this.currentPosition = 0
        this.inJail = false
        this.turnsInJail = 0
    }

    setName(name) {
        this.name = name
        return
    }

    getName() {
        return this.name
    }

    setPiece(piece) {
        this.piece = piece
        return
    }

    getPiece() {
        return this.piece
    }

    addMoney(money) {
        this.money += money
        return
    }

    getMoney() {
        return this.money
    }

    setPosition(position) {
        this.currentPosition = position
        return
    }

    getPosition() {
        return this.currentPosition
    }

    setInJail(inJail) {
        this.inJail = inJail
        return
    }

    getInJail() {
        return this.inJail
    }

    setTurnsInJail(turns) {
        this.turnsInJail = turns
        return
    }

    getTurnsInJail() {
        return this.turnsInJail
    }


}
