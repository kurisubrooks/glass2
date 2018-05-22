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
        // Set the commands labeled in ./Commands/ folder
        this.commandFiles = fs.readdirSync("./apps/Terminal/Commands/");
        this.commands = {};
        for (let i of this.commandFiles) {
            this.commands[i.split(".")[0]] = { RunCommand: require(`./Commands/${i}`) };
        }
    }
    execute(input) {
        const [command, ...args] = input.split(" ");
        if (this.commands[command]) {
            return new this.commands[command].RunCommand(args);
        }
        return new TerminalError("Unknown Command", command, input);
    }
}

module.exports = {
    TerminalApp: TerminalApp,
    TerminalWindow: Window
};
