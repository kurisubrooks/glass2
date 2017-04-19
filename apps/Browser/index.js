const App = require("../../core/App");
const Window = require("../../core/Window");

const color = require("tinycolor2");
const fs = require("fs");
const tldsFilepath = `${__dirname}/tlds.txt`;

// Get an array of all tlds
const tldsRaw = fs.readFileSync(tldsFilepath, "utf8");
const tlds = tldsRaw.split("\n");

class BrowserApp extends App {
    constructor() {
        super("Browser", BrowserWindow);
    }
}

class BrowserWindow extends Window {
    constructor(options) { // eslint-disable-line no-useless-constructor
        super(options);
    }

    openIn(windowArea) {
        super.openIn(windowArea);

        const webview = this.window.find("webview");
        const header = this.window.find("header");
        const backButton = this.backButton = this.window.find(".browser-back");
        const forwardButton = this.forwardButton = this.window.find(".browser-forward");
        const refreshButton = this.refreshButton = this.window.find(".browser-refresh");
        const urlBar = this.urlBar = this.window.find(".browser-url");

        webview.on("did-change-theme-color", event => {
            const theme = event.originalEvent.themeColor;

            header.css("background-color", theme);
            if (color(theme).isDark()) header.addClass("dark");
        });
        webview.on("page-title-updated", event => {
            header.find("h1").text(event.originalEvent.title);
        });
        webview.on("did-finish-load", () => {
            this.checkButtons();
            urlBar.val(webview[0].src);
        });

        backButton.click(() => {
            this.goBack();
        });
        forwardButton.click(() => {
            this.goForward();
        });
        refreshButton.click(() => {
            webview[0].reload();
        });
        urlBar.on("keypress", event => {
            if (event.key === "Enter") {
                this.loadURL(urlBar.val());
            }
        });
        urlBar.on("focus", () => {
            urlBar.one("mouseup", () => {
                urlBar.select();
                return false;
            }).select();
        });

        return this;
    }

    checkButtons() {
        const webview = this.window.find("webview")[0];
        if (!webview.canGoBack()) {
            this.backButton.attr("disabled", true);
        } else {
            this.backButton.removeAttr("disabled");
        }
        if (!webview.canGoForward()) {
            this.forwardButton.attr("disabled", true);
        } else {
            this.forwardButton.removeAttr("disabled");
        }
    }

    goBack() {
        const webview = this.window.find("webview")[0];
        if (webview.canGoBack()) {
            webview.goBack();
        }
    }

    goForward() {
        const webview = this.window.find("webview")[0];
        if (webview.canGoForward()) {
            webview.goForward();
        }
    }

    loadURL(url) {
        const webview = this.window.find("webview")[0];
        // Process url (add http)
        let processedUrl;
        if (/https?:\/\//.test(url)) {
            // URL with http:// or https://, it's all set
            processedUrl = url;
        } else {
            // URL that needs to have http:// before it (maybe), check if it has a valid TLD, then go ahead and prepend it
            let isProbablyUrl = false;
            let i;
            for (i = 0; i < tlds.length; i++) {
                isProbablyUrl = new RegExp(`.+\\.${tlds[i]}$`, "i").test(url);
                if (isProbablyUrl) break;
            }
            if (isProbablyUrl) processedUrl = `http://${url}`;
        }
        if (!processedUrl) {
            // Assume its a query string, http://google.com/#q=${query}
            url = url.replace("+", "%2B")
            .replace("#", "%23")
            .replace("%", "%25")
            .replace("&", "%26")
            .replace("<", "%3E")
            .replace(">", "%3C");
            processedUrl = `http://google.com/#q=${url}`;
        }
        webview.loadURL(processedUrl);
    }
}

module.exports = {
    BrowserApp: BrowserApp,
    BrowserWindow: BrowserWindow
};
