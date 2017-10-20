const fs = require("fs");
const path = require("path");

const guid = require("./Util/guid");
const WindowManager = require("./WindowManager");
const Window = require("./Window");

class App {
    constructor(name, WindowType) {
        if (!name) throw new Error("Missing App Name");

        this.name = name;
        this.id = guid();
        this.icon = path.join(__dirname, "..", "apps", name, "icon.png");
        this.content = fs.readFileSync(path.join(__dirname, "..", "apps", name, "index.html"), "utf8");
        this.WindowType = WindowType || Window;

        // console.log(this.name, this.frame);
    }

    get theme() {
        return "light";
    }

    get size() {
        return [1280, 720];
    }

    get frame() {
        return true;
    }

    onClick() {
        WindowManager.addWindow(new this.WindowType({
            title: this.name,
            size: this.size,
            frame: this.frame,
            theme: this.theme,
            content: this.content
        })).openIn(".desktop");
        // WindowManager.createWindow({
        //     title: this.name,
        //     size: this.size,
        //     theme: this.theme,
        //     content: this.content
        // }).openIn(".desktop");
    }
}

module.exports = App;
