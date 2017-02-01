const color = require("tinycolor2");

module.exports = wm => class Window {
    constructor(options) {
        this.title = options.title;
        this.size = options.size;

        if (typeof this.title !== "string") {
            this.title = "Window";
            console.error("Window Title was not set");
        }

        if (!(this.size instanceof Array)) {
            this.size = [200, 200];
            console.error("Window Size was not set");
        }

        this.create();
    }

    create(options) {
        let webview = $(`<webview style='height:100%' src='http://google.com'></webview>`);

        webview.on("did-change-theme-color", e => {
            let theme = e.originalEvent.themeColor;
            
            win.$titlebar.css("background-color", theme);

            if (color(theme).isDark()) {
                win.$titlebar.addClass("dark");
                console.log("Dark Theme");
            }
        });

        let win = wm.createWindow({
            title: this.title,
            width: this.size[0],
            height: this.size[1],
            content: webview
        });

        console.log(win);

        win.open();
    }
}