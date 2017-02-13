const $ = require("jquery");
const color = require("tinycolor2");

const Template = require("./Template");
const guid = require("./Util/guid");

class Window {
    constructor(options) {
        if (!options.title) throw new Error("Window title must not be missing.");
        if (!options.content) throw new Error("Window content must not be missing.");
        if (!options.size) throw new Error("Window size must not be missing.");
        if (typeof options.title !== "string") throw new TypeError("Window title must be a string.");
        if (typeof options.content !== "string") throw new TypeError("Window content must be a string.");
        if (!Array.isArray(options.size)) throw new TypeError("Window size must be an array.");
        if (!options.size.length || options.size.length > 2) throw new Error("Invalid window size.");

        this.title = options.title;
        this.size = options.size;
        this.content = options.content;
        this.theme = options.theme || "light";
        this.id = guid();
        this.maximized = false;

        this.window = new Template("window").build({
            title: this.title,
            content: this.content,
            id: this.id,
            width: this.size[0],
            height: this.size[1]
        });

        if (this.theme === "dark") this.window.addClass("dark");
    }

    openIn(windowArea) {
        $(windowArea).append(this.window);

        const webview = this.window.find("webview");
        const header = this.window.find("header");

        webview.on("did-change-theme-color", event => {
            const theme = event.originalEvent.themeColor;

            header.css("background-color", theme);
            if (color(theme).isDark()) header.addClass("dark");
        });

        webview.on("page-title-updated", event => {
            header.find("h1").text(event.originalEvent.title);
        });

        return this;
    }

    minimize() {
        this.window.addClass("closed");
    }

    maximize() {
        if (!this.maximized) {
            this.window.width(this.window.parent().width());
            this.window.height(this.window.parent().height());

            this.window.addClass("maximized");
        } else {
            this.window.width(this.size[0]);
            this.window.height(this.size[1]);

            this.window.removeClass("maximized");
        }

        this.maximized = !this.maximized;
    }

    close() {
        this.window.remove();
    }
}

module.exports = Window;
