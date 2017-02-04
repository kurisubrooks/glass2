const Window = require("./Window");
const windows = {};

class WindowManager {
    static createWindow(options) {
        const window = new Window(options);
        windows[window.id] = window;
        return window;
    }

    static getWindow(id) {
        return windows[id] || null;
    }

    static getTopWindow() {
        const sortedWindows = Object.values(windows).sort((a, b) => a.zIndex - b.zIndex);
        return sortedWindows[0] || null;
    }

    static getTopWindowIndex() {
        const topWindow = WindowManager.getTopWindow() || { zIndex: 1 };
        return topWindow.zIndex;
    }
}

module.exports = WindowManager;
