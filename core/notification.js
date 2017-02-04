const $ = window.jQuery = require("jquery");

const guid = require("../util/guid");

const fadeRemove = (el, sp) => el.fadeOut(sp || "fast", () => el.remove());

let notifications = {};

module.exports = class Notification {
    constructor(options) {
        this.title = options.title;
        this.message = options.message;
        this.image = options.image || "";
        this.app = options.app || null;
        this.icon = options.icon || "";
        this.colour = options.colour || "inherit";
        this.duration = options.duration * 1000 || 8000;
        this.id = guid();

        if (typeof this.title !== "string") throw new Error("Notification Title was not set");
        if (typeof this.message !== "string") throw new Error("Notification Message was not set");

        this.create();
    }

    create() {
        const container = $(`#breadbox`);
        const notification = $(`<div class="notification" id="${this.id}"></div>`);
        const referring = $(`<div class="app" style="color:${this.colour};"></div>`);
        const icon = $(`<img src="${this.icon}">`);
        const app = $(`<span></span>`).text(this.app);
        const content = $(`<div class="content"></div>`);
        const message = $(`<div class="message"></div>`);
        const title = $(`<div class="title"></div>`).text(this.title);
        const text = $(`<div class="text"></div>`).text(this.message);
        const image = $(`<div class="image"><img src="${this.image}"></div>`);

        this.notif = notification;
        this.notif.hide();
        message.append(title);
        message.append(text);
        content.append(message);
        if (this.image !== "") content.append(image);
        if (this.icon !== "") referring.append(icon);
        if (this.app) referring.append(app);
        if (this.app && this.colour !== "inherit") this.notif.prepend(referring);
        this.notif.append(content);
        container.append(this.notif);
        this.notif.fadeIn("fast");

        notifications[this.id] = setTimeout(() => fadeRemove(this.notif), this.duration);

        this.notif.hover(event => {
            if (event.type === "mouseenter") this.clear();
            if (event.type === "mouseleave") this.destroy();
        });

        this.notif.click(event => {
            event.stopImmediatePropagation();
            this.clear();
            this.destroy();
        });
    }

    destroy() {
        delete notifications[this.id];
        fadeRemove(this.notif);
    }

    clear() {
        clearTimeout(notifications[this.id]);
    }
};
