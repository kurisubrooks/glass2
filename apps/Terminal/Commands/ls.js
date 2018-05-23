const Command = require("../Util/CommandRegister");
const TerminalError = require("../Util/TerminalError");

const { readdirSync } = require("sandboxed-fs").bind(`${__dirname}/../../../OS`);

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
            try {
                this.return = readdirSync(`${this.cwd}`).join(", ");
            } catch(error) {
                this.Error = new TerminalError(`No such file or directory: ${this.cwd}`, `ls`).Error;
            }
            return;
        }
        if (this.arguments[0] === "/") {
            try {
                this.return = readdirSync(`${this.arguments}`).join(", ");
            } catch(error) {
                this.Error = new TerminalError(`No such file or directory: ${this.arguments}`, `ls`).Error;
            }
            return;
        }
        try {
            this.return = readdirSync(`${this.cwd}/${this.arguments}`).join(", ");
        } catch(error) {
            this.Error = new TerminalError(`No such file or directory: ${this.cwd}/${this.arguments}`, `ls`).Error;
        }
        return;
    }
}

module.exports = LSCommand;
