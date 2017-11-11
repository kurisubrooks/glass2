const $ = require("jquery");
const moment = require("moment");
const Template = require("./Template");

class Taskbar {
    constructor(container) {
        this.container = $(container);
        this.appArea = this.container.find(".apps");
        this.apps = new Map();
        this.toolbar = new Template("toolbar").build();
    }

    start() {
        this.container.append(this.toolbar);
        this.clock = this.container.find("#clock");
        this.container.find("#userprofile").attr("src", `../assets/avatars/${JSON.parse(localStorage.currentUser).avatar}.png`);

        setInterval(() => this.updateClock(), 150);
    }

    updateClock() {
        let time = moment().format("h:mm A");
        if (this.clock.text() !== time) this.clock.text(time);
    }

    getPins() {
        return this.apps;
    }
}

module.exports = Taskbar;
