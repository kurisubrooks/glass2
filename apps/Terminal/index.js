const App = require("../../core/App");
const Window = require("../../core/Window");

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
    }
}

module.exports = {
    TerminalApp: TerminalApp,
    TerminalWindow: Window
};
