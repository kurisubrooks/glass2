const Command = require("../Util/CommandRegister");
const TerminalError = require("../Util/TerminalError");

const file = require("file-type");

const { openSync, closeSync, readSync } = require("sandboxed-fs").bind(`${__dirname}/../../../OS`);

class FileCommand extends Command {
    constructor(Cwd, Arguments) {
        super({
            name: "file",
            permission: "user"
        });
        this.cwd = Cwd;
        this.arguments = Arguments;
        this.exec();
    }
    exec() {
        if (!this.arguments) {
            this.Error = new TerminalError(`No such file: ${this.cwd}`, "file").Error;
            return;
        }
        if (this.arguments[0] === "/") {
            try {
                let buf = Buffer.alloc(4100);

                const fd = openSync(this.arguments, "r");
                const bytesRead = readSync(fd, buf, 0, 4100, 0);

                closeSync(fd);

                if (bytesRead < 4100) {
                    buf = buf.slice(0, bytesRead);
                }

                this._return = file(buf);
                this.return = this._return === null ? JSON.stringify({ ext: "txt", mime: "text/plain" }) : JSON.stringify(this._return);
                return;
            } catch(error) {
                this.Error = new TerminalError(`File is corrupted or damaged: ${this.arguments}`, "file").Error;
                return;
            }
        }
        try {
            let buf = Buffer.alloc(4100);

            const fd = openSync(`${this.cwd}/${this.arguments}`, "r");
            const bytesRead = readSync(fd, buf, 0, 4100, 0);

            closeSync(fd);

            if (bytesRead < 4100) {
                buf = buf.slice(0, bytesRead);
            }

            this._return = file(buf);
            this.return = this._return === null ? JSON.stringify({ ext: "txt", mime: "text/plain" }) : JSON.stringify(this._return);
            return;
        } catch(error) {
            this.Error = new TerminalError(`File is corrupted or damaged: ${this.arguments}`, "file").Error;
            return;
        }
    }
}

module.exports = FileCommand;
