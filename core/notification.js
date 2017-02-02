module.exports = class Notification {
    constructor(options) {
        this.title = options.title;
        this.message = options.message;
        this.icon = options.icon;

        if (typeof this.title !== "string") {
            throw new Error("Notification Title was not set");
        }

        if (typeof this.message !== "string") {
            throw new Error("Notification Title was not set");
        }

        if (typeof this.icon !== "string") {
            this.icon = null;
        }

        this.create();
    }

    create() {
        return null;
    }

    destroy() {
        return null;
    }
};
