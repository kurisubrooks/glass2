const guid = require("../../core/Util/guid");
const fs = require("fs");
const $ = require("jquery");
const validateUrl = require('url-validate');

const template = fs.readFileSync(`${__dirname}/templates/tab-template.html`, "utf8");
const barTemplate = fs.readFileSync(`${__dirname}/templates/bar-tab-template.html`, "utf8");

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
        const validURL = validateUrl(url);

        console.log(url);
        console.log(validURL);

        if (validURL) {
            if (!/[a-z0-9\-]{1,}:\/\//.test(url)) {
                url = `http://${url}`;
            }
        } else {
            url = `https://www.google.com/#q=${encodeURIComponent(url)}`;
        }

        this.window.urlBar.val(url);
        webview.loadURL(url);
    }
}

module.exports = BrowserTab;
