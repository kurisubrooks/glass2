const App = require("../../core/App");
const Window = require("../../core/Window");
const TerminalError = require("./Util/TerminalError");

const fs = require("fs");

class TerminalApp extends App {
    constructor() {
        super({
            name: "Terminal",
            directory: "Terminal",
            theme: "dark",
            size: [1024, 576],
            index: "index.html",
            icon: "icon.png"
        });
        this.user = JSON.parse(localStorage.currentUser).username;
        // Set the commands labeled in ./Commands/ folder
        this.commandFiles = fs.readdirSync("./apps/Terminal/Commands/");
        this.commands = {};
        for (let i of this.commandFiles) {
            this.commands[i.split(".")[0]] = { RunCommand: require(`./Commands/${i}`) };
        }
    }
    execute(cwd, input) {
        const [command, ...args] = input.split(" ");
        if (cwd === "~") {
            cwd = `/home/${this.user}`;
        }
        if (this.commands[command] && command !== undefined) {
            return new this.commands[command].RunCommand(cwd, args.join(""));
        }
        return new TerminalError("Unknown Command", command || null, input);
    }
}

module.exports = {
    TerminalApp: TerminalApp,
    TerminalWindow: Window
};
