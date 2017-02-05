const $ = require("jquery");
const moment = require("moment");

const App = require("./apps/App");
const Template = require("./Template");

module.exports = class Taskbar {
    constructor(container) {
        this.clock = moment().format("h:mm A");
        this.container = $(container);
        this.apps = new Map();

        this.toolbar = new Template("toolbar").build();

        // toolbar.hide();
        this.container.append(this.toolbar);
        // toolbar.slideUp();

        this.appArea = this.toolbar.find(".apps");
    }

    addPin(app) {
        this.apps.set(app.id, app);

        const appItem = new Template("toolbarItem").build({
            id: app.id,
            name: app.name,
            icon: app.icon
        });

        appItem.on("click", app.onClick);
        this.appArea.append(appItem);
    }

    removePin(app) {
        this.apps.delete(app.id);

        const appItem = this.appArea.find(`#${app.id}`);
        appItem.remove();
    }

    getPins() {
        return this.apps;
    }

    hasPin(app) {
        if (app instanceof App) return this.apps.has(app.id);
        if (typeof app === "string") return this.apps.has(app);
        return false;
    }

    static addMeta() {
        // add item to .tray popover
    }
};
