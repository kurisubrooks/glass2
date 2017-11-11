const $ = require("jquery");

const App = require("./App");
const Taskbar = require("./Taskbar");
const Template = require("./Template");
const ContextMenu = require("./ContextMenu");
const WindowManager = require("./WindowManager");

class TaskbarItem extends Taskbar {
    constructor(app) {
        super(".toolbar");

        this.app = app;
        this.element = this.container.find(`#app_${app.name}_${app.id}`);

        this.onClick();
    }

    addApp() {
        this.addPin();
    }

    onClick() {
        console.log(WindowManager.windows);
    }

    addPin() {
        this.apps.set(this.app.id, this.app);

        const appItem = new Template("toolbarItem").build({
            id: this.app.id,
            name: this.app.name,
            icon: this.app.icon
        });

        this.app.contextMenu = new ContextMenu({
            location: appItem,
            controls: [
                {
                    type: "item",
                    text: "Unpin",
                    click: () => this.removePin(this.app)
                }
            ]
        });

        appItem.on("click", this.app.onClick.bind(this.app));

        console.log(this.appArea);

        this.appArea.append(appItem);
    }

    removePin() {
        this.apps.delete(this.app.id);
        const appItem = this.appArea.find(`#app_${this.app.name}_${this.app.id}`);
        appItem.remove();

        this.app.contextMenu.remove();
    }

    hasPin() {
        if (this.app instanceof App) return this.apps.has(this.app.id);
        if (typeof this.app === "string") return this.apps.has(this.app);
        return false;
    }

    setActive(bool) {
        if (bool) {
            return this.element.addClass("active");
        }

        return this.element.removeClass("active");
    }
}

module.exports = TaskbarItem;
