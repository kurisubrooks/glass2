const App = require("../../core/App");

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

module.exports = TerminalApp;
