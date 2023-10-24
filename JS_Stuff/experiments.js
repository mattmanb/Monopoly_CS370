console.log("Hello World");
//this is how to comment in JS
let colorChoices = ['red', 'blue', 'yellow', 'green', 'purple', 'pink']
let player = {
    name: 'Test',
    color: 'red',
    inventory: [],
    turnNumber: 1
};

player.name = 'Player';
player['name'] = 'Name';
let selection = 'color';
player[selection]  ='blue';

function rollDice() {
    let firstDice = Math.floor(Math.random() * 6);
    let secondDice = Math.floor(Math.random() * 6);
    let goAgain = false;
    if(firstDice == secondDice) {
        let goAgain = true;
    }
    return [firstDice, secondDice, goAgain]
}

console.log(rollDice())
