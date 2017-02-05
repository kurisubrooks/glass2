const path = require("path");

const guid = require("../util/guid");

class App {
    constructor(name) {
        if (!name) throw new Error("Missing App Name");

        this.name = name;
        this.icon = path.join(__dirname, "..", "apps", name, "icon.png");
        this.id = guid();
    }

    onCreate() {
        return undefined;
    }
}

module.exports = App;
