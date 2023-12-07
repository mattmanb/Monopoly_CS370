class special_event {
    constructor(eventFunction) {
        this.eventExecution = eventFunction;
    }
    executeEvent(player) {
        const msg = this.eventExecution(player);
        return msg;
    }
}

module.exports = special_event;