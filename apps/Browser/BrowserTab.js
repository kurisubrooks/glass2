const guid = require("../../core/Util/guid");
const fs = require("fs");
const $ = require("jquery");

const template = fs.readFileSync(`${__dirname}/templates/tab-template.html`, "utf8");
const barTemplate = fs.readFileSync(`${__dirname}/templates/bar-tab-template.html`, "utf8");

const urlRegex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.([a-zA-Z\d-]{2,63})\b(?:\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?[-a-zA-Z0-9@:%_+.~#?&//=]*/gi;

class BrowserTab {
    constructor(window, options) {
        this.window = window;
        this.loadURLImmediately = typeof options.url !== "undefined";
        this.url = options.url || "";
        this.id = guid();

        const webview = this.webview = $(template.replace("{{ id }}", `browser-tab-${this.id}`).replace("{{ src }}", this.loadURLImmediately ? `src="${this.url}"` : ""));
        const tab = this.tab = $(barTemplate.replace("{{ id }}", `browser-bar-tab-${this.id}`).replace("{{ title }}", "New Tab"));
        const closeButton = this.closeButton = tab.find(".button-close");

        window.tabArea.append(webview);
        window.tabsBar.append(tab);

        webview.on("close", () => {
            window.closeTab(this.id);
        });

        webview.on("page-title-updated", event => {
            this.tab.find(".text").text(event.originalEvent.title);
            window.checkButtons();
            window.urlBar.val(webview[0].src);
        });

        webview.on("did-finish-load", () => {
            window.checkButtons();
            window.urlBar.val(webview[0].src);
        });

        tab.click(() => {
            window.focusTab(this.id);
        });

        closeButton.click(event => {
            window.closeTab(this.id);
            event.stopPropagation();
        });
    }

    goBack() {
        const webview = this.webview[0];

        if (webview.canGoBack()) {
            webview.goBack();
        }
    }

    goForward() {
        const webview = this.webview[0];

        if (webview.canGoForward()) {
            webview.goForward();
        }
    }

    reload() {
        const webview = this.webview[0];
        webview.reload();
    }

    loadURL(url) {
        const webview = this.webview[0];
        const validURL = new RegExp(urlRegex).exec(url);

        console.log(url);
        console.log(urlRegex);

        console.log(validURL);

        if (validURL && this.tlds.indexOf(validURL[1].toUpperCase()) !== -1) {
            if (!/^https?:\/\//.test(url)) {
                url = `http://${url}`;
            }
        } else {
            url = `https://www.google.com/#q=${encodeURIComponent(url)}`;
        }

        this.window.urlBar.val(url);
        webview.loadURL(url);
    }

    get tlds() {
        return this.window.tlds;
    }
}

module.exports = BrowserTab;
