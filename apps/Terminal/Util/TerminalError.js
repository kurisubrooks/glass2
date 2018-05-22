class TerminalError {
    constructor(ErrorString, Command, Offense) {
        this.Error = ErrorString;
        this.Command = Command;
        this.Offense = Offense;
        return `Terminal: ${Command}: ${ErrorString}`;
    }
}

module.exports = TerminalError;
