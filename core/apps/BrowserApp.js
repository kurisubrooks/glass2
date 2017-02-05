const App = require("./App");
const WindowManager = require("../WindowManager");

class BrowserApp extends App {
    constructor() {
        super("Browser", "chrome.png");
    }

    onClick() {
        WindowManager.createWindow({
            title: "Browser",
            size: [1280, 720],
            content: `<webview style="height:100%" src="http://google.com"></webview>`
        }).openIn(".desktop");
    }
}

module.exports = BrowserApp;
