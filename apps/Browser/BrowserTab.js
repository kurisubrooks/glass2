const guid = require("../../core/Util/guid");
const fs = require("fs");
const $ = require("jquery");
const color = require("tinycolor2");

const template = fs.readFileSync(`${__dirname}/tab-template.html`, "utf8");
const barTemplate = fs.readFileSync(`${__dirname}/bar-tab-template.html`, "utf8");

class BrowserTab {
    constructor(window, options) {
        this.window = window;
        this.loadURLImmediately = typeof options.url !== "undefined";
        this.url = options.url || "";
        this.id = guid();
        const webview = this.webview = $(template.replace("{{ id }}", `browser-tab-${this.id}`).replace("{{ src }}", this.loadURLImmediately ? `src="${this.url}"` : ""));
        window.tabArea.append(webview);
        const tab = this.tab = $(barTemplate.replace("{{ id }}", `browser-bar-tab-${this.id}`).replace("{{ title }}", "New Tab"));
        window.tabsBar.append(tab);
        const closeButton = this.closeButton = tab.find(".tab-close-button");

        webview.on("did-change-theme-color", event => {
            const theme = event.originalEvent.themeColor;

            window.css("background-color", theme);
            if (color(theme).isDark()) window.addClass("dark");
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
        closeButton.click((event) => {
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
        // Process url (add http)
        let processedUrl;
        if (/https?:\/\//.test(url)) {
            // URL with http:// or https://, it's all set
            processedUrl = url;
        } else {
            // URL that needs to have http:// before it (maybe), check if it has a valid TLD, then go ahead and prepend it
            let isProbablyUrl = false;
            let i;
            for (i = 0; i < this.tlds.length; i++) {
                isProbablyUrl = new RegExp(`.+\\.${this.tlds[i]}$`, "i").test(url);
                if (isProbablyUrl) break;
            }
            if (isProbablyUrl) processedUrl = `http://${url}`;
        }
        if (!processedUrl) {
            // Assume its a query string, http://google.com/#q=${query}
            url = url.replace(/(\+)|(#)|(%)|(&)|(<)|(>)|( )/g, (match, plus, tag, percent, ampersand, lt, gt, space) => {
                if (plus) return "%2B";
                if (tag) return "%23";
                if (percent) return "%25";
                if (ampersand) return "%26";
                if (lt) return "%3E";
                if (gt) return "%3C";
                if (space) return "+";
                return match;
            });
            processedUrl = `https://www.google.com/#q=${url}`;
        }
        this.window.urlBar.val(processedUrl);
        webview.loadURL(processedUrl);
    }

    get tlds() {
        return this.window.tlds;
    }
}

module.exports = BrowserTab;
