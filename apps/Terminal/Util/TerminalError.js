class TerminalError {
    constructor(ErrorString, Command, Offense) {
        this.Error = `Terminal:${Command !== null ? ` ${Command} :` : ""} ${ErrorString}`;
        this.Command = Command;
        this.Offense = Offense;
    }
}

module.exports = TerminalError;
