class special_event {
    constructor(eventFunction) {
        this.eventExecution = eventFunction;
        this.name = "special_event";
    }
    executeEvent(player) {
        const msg = this.eventExecution(player);
        return msg;
    }
}

module.exports = special_event;