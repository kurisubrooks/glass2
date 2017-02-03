const $ = window.jQuery = require("jquery");
const wm = window.wm;

const color = require("tinycolor2");
const guid = () => {
    let s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

module.exports = class Window {
    constructor(options) {
        this.title = options.title;
        this.size = options.size;
        this.id = guid();

        if (typeof this.title !== "string") {
            this.title = "Window";
            console.error(`Window Title was not set, using "Window"`);
        }

        if (!(this.size instanceof Array)) {
            this.size = [1280, 720];
            console.error(`Window Size was not set, using 720p`);
        }

        this.create();
    }

    create() {
        this.webview = $(`<webview style="height:100%" src="http://google.com"></webview>`);

        this.webview.on("did-change-theme-color", event => {
            let theme = event.originalEvent.themeColor;

            this.window.$titlebar.css("background-color", theme);

            if (color(theme).isDark()) {
                this.window.$titlebar.addClass("dark");
                console.log("Dark Theme");
            }
        });

        this.window = wm.createWindow({
            title: this.title,
            width: this.size[0],
            height: this.size[1],
            content: this.webview,
            events: { closed: () => this.destroy() }
        });

        this.window.open();
    }

    destroy() {
        this.window.destroy();
        this.webview.remove();
    }
};
