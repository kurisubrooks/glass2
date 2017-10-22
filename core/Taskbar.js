const $ = require("jquery");
const moment = require("moment");

const App = require("./App");
const Template = require("./Template");
const ContextMenu = require("./ContextMenu");

class Taskbar {
    constructor(container) {
        this.container = $(container);
        this.apps = new Map();
        this.toolbar = new Template("toolbar").build();

        this.container.append(this.toolbar);
        this.appArea = this.container.find(".apps");
        this.clock = this.container.find("#clock");

        this.container.find("#userprofile").attr("src", `../assets/avatars/${JSON.parse(localStorage.currentUser).avatar}.png`);

        setInterval(() => this.updateClock(), 150);
    }

    updateClock() {
        let time = moment().format("h:mm A");
        if (this.clock.text() !== time) this.clock.text(time);
    }

    addPin(app) {
        this.apps.set(app.id, app);

        const appItem = new Template("toolbarItem").build({
            id: app.id,
            name: app.name,
            icon: app.icon
        });

        app.contextMenu = new ContextMenu({ // eslint-disable-line no-unused-vars
            location: appItem,
            controls: [
                {
                    type: "item",
                    text: "Unpin",
                    click: () => this.removePin(app)
                }
            ]
        });

        appItem.on("click", app.onClick.bind(app));

        this.appArea.append(appItem);
    }

    removePin(app) {
        this.apps.delete(app.id);
        const appItem = this.appArea.find(`#app_${app.name}_${app.id}`);
        appItem.remove();

        app.contextMenu.remove();
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
}

module.exports = Taskbar;
