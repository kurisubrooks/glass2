const path = require("path");

const guid = require("../../util/guid");

class App {
    constructor(name, icon) {
        this.name = name;
        this.icon = path.join(__dirname, "..", "..", "system", "images", icon);
        this.id = guid();
    }

    onCreate() {
        return undefined;
    }
}

module.exports = App;
