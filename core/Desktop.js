/* eslint-disable no-new */
const $ = require("jquery");

// Core
const { Notification, Taskbar, TaskbarItem } = require("../core/System");

// Apps
const { BrowserApp } = require("../apps/Browser/");
const { TerminalApp } = require("../apps/Terminal/");

class Desktop {
    constructor() {
        $(() => this.startup());
    }

    loadApps() {
        //
    }

    startup() {
        setTimeout(() => $("body").fadeIn(250), 200);

        const taskbar = new Taskbar(".toolbar");
        const browser = new BrowserApp();
        const terminal = new TerminalApp();

        taskbar.start();

        new TaskbarItem(browser).addApp();
        new TaskbarItem(terminal).addApp();

        setTimeout(() => {
            new Notification({
                title: "System",
                message: "Initialised",
                image: "../assets/images/system.png"
            });
        }, 700);
    }
}

module.exports = Desktop;
