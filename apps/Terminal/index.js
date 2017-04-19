const App = require("../../core/App");
const Window = require("../../core/Window");

class TerminalApp extends App {
    constructor() {
        super("Terminal");
    }

    get theme() {
        return "dark";
    }

    get size() {
        return [1024, 576];
    }
}

module.exports = {
    TerminalApp: TerminalApp,
    TerminalWindow: Window
};
