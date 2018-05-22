class Command {
    constructor(CommandOptions) {
        this.name = CommandOptions.name;
        this.permission = CommandOptions.permission || "user";
    }
}

module.exports = Command;
