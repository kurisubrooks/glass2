const fs = require("fs");
const path = require("path");

const $ = require("jquery");
const Template = require("./Template");

class AppLauncher {
    constructor() {
        this.launcher = new Template("launcher").build();
    }

    onClick() {

    }
}

module.exports = AppLauncher;
