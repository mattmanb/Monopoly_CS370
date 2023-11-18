class jail {
    sendToJail(player) {
        player.inJail = true;
        player.turnsInJail = 3;
        player.currentPosition = 40;
    }
    exitJail(player) {
        player.inJail = false;
        player.turnsInJail = 0;
        player.currentPosition = 10; //position 10 is "Just passing through"
    }
    serveTime(player) {
        player.turnsInJail -= 1;
    }
}