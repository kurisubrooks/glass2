const Command = require("../Util/CommandRegister");

const { readdirSync } = require("fs");

class LSCommand extends Command {
    constructor(Cwd, Arguments) {
        super({
            name: "ls",
            permission: "user"
        });
        this.cwd = Cwd;
        this.arguments = Arguments;
        /*
         * This is a limited functionality `ls` as a completely functional
         * command would take lots of man hours, way too much for one
         * or two people to do.
         */
        this.exec();
    }
    exec() {
        if (!this.arguments) {
            this.return = readdirSync(`./OS/${this.cwd}`);
            return;
        }
        if (this.arguments[0] === "/") {
            this.return = readdirSync(`./OS/${this.arguments}`);
            return;
        }
        this.return = readdirSync(`./OS/${this.cwd}/${this.arguments}`);
        return;
    }
}

module.exports = LSCommand;
