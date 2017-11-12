const fs = require("fs");
const path = require("path");

const guid = require("./Util/guid");
const Window = require("./Window");
const WindowManager = require("./WindowManager");

class App {
    constructor(data) {
        this.name = data.name;
        this.id = guid();
        this.theme = data.theme || "light";
        this.size = data.size || [1280, 720];
        this.frame = data.frame || true;
        this.icon = path.join(__dirname, "..", "apps", data.directory || data.name, data.icon || "icon.png");
        this.content = fs.readFileSync(path.join(__dirname, "..", "apps", data.directory || data.name, data.index || "index.html"), "utf8");
        this.WindowType = data.WindowType || Window;

        if (!data.name) throw new Error("App Name missing");
        if (data.size && !Array.isArray(data.size)) throw new Error("App Window Size must be an array of 2 digits");
        // if (data.WindowType && !(data.WindowType instanceof Window)) throw new Error("WindowType must be an instance of Window");
    }

    set contextMenu(contextMenu) {
        this.context = contextMenu;
    }

    get contextMenu() {
        return this.context;
    }

    onClick() {
        WindowManager.addWindow(new this.WindowType({
            title: this.name,
            size: this.size,
            frame: this.frame,
            theme: this.theme,
            content: this.content
        })).openIn(".desktop");
    }
}

module.exports = App;
