const $ = require("jquery");
const moment = require("moment");

module.exports = class Taskbar {
    constructor(options) {
        this.clock = moment().format("h:mm A");

        // set other things
    }

    /*
    <div class="toolbar">
        <ul class="apps">
            <li id="app_launcher"><i class="material-icons">apps</i></li>
            <li id="app_browser"><img src="../system/images/chrome.png"></li>
        </ul>

        <ul class="tray">
            <li id="clock">__:__</li>
            <li id="user"><img id="userprofile" src="../users/kurisu/avatar.png"></li>
        </ul>
    </div>
    */

    spawn() {
        const container = $(`body`);
        const toolbar = $(`<div class="toolbar"></div>`);
        const apps = $(`<ul class="apps"></ul>`);
        const tray = $(`<ul class="tray"></ul>`);

        toolbar.hide();
        toolbar.append(apps);
        toolbar.append(tray);
        container.append(toolbar);
        toolbar.slideUp();

        this.toolbar = toolbar;
    }

    static addItem() {
        // add item to .apps
    }

    static removeItem() {
        // remove item from .apps
    }

    static addMeta() {
        // add item to .tray popover
    }
};
