class TerminalError {
    constructor(ErrorString, Command) {
        this.Error = `Terminal:${Command !== null ? ` ${Command} :` : ""} ${ErrorString}`;
    }
}

module.exports = TerminalError;
