const App = require("../../core/App");
const Window = require("../../core/Window");
const BrowserTab = require("./BrowserTab");

const fs = require("fs");
const tldsFilepath = `${__dirname}/tlds.txt`;

// Get an array of all tlds
const tldsRaw = fs.readFileSync(tldsFilepath, "utf8");
const tlds = tldsRaw.split("\n").slice(0, -1).map(v => v.slice(0, -1));

// Move this to some settings file somewhere
const defaultPage = "https://www.google.com/"; // eslint-disable-line no-unused-vars

class BrowserApp extends App {
    constructor() {
        super("Browser", BrowserWindow);
    }

    get theme() {
        return "dark";
    }
}

class BrowserWindow extends Window {
    constructor(options) {
        super(options);
        this.tlds = tlds;
    }

    openIn(windowArea) {
        super.openIn(windowArea);

        this.tabs = new Map();
        this.header = this.window.find("header");
        this.tabArea = this.window.find(".browser-view");
        this.tabsBar = this.window.find(".tabs");

        const backButton = this.backButton = this.window.find(".button-back");
        const forwardButton = this.forwardButton = this.window.find(".button-forward");
        const refreshButton = this.refreshButton = this.window.find(".button-reload");
        const urlBar = this.urlBar = this.window.find(".browser-url");
        const newTabButton = this.newTabButton = this.window.find(".browser-new-tab");

        backButton.on("click", () => {
            this.openTab.goBack();
        });

        forwardButton.on("click", () => {
            this.openTab.goForward();
        });

        refreshButton.on("click", () => {
            this.openTab.reload();
        });

        urlBar.on("keypress", event => {
            if (event.key === "Enter") {
                this.openTab.loadURL(urlBar.val());
            }
        });

        urlBar.on("focus", () => {
            urlBar.one("mouseup", () => {
                urlBar.select();
                return false;
            }).select();
        });

        newTabButton.on("click", () => {
            this.focusTab(this.newTab(), true);
        });

        this.focusTab(this.newTab(), true);

        return this;
    }

    checkButtons() {
        const webview = this.window.find("webview")[0];

        if (!webview.canGoBack()) {
            this.backButton.addClass("disabled");
        } else {
            this.backButton.removeClass("disabled");
        }

        if (!webview.canGoForward()) {
            this.forwardButton.addClass("disabled");
        } else {
            this.forwardButton.removeClass("disabled");
        }
    }

    newTab() {
        const tab = new BrowserTab(this, { url: defaultPage });
        this.tabs.set(tab.id, tab);
        return tab.id;
    }

    focusTab(tabID, justOpened) {
        this.currentTab = tabID;

        for (let [, value] of this.tabs) {
            value.webview.css("display", "none");
            value.tab.removeClass("active");
        }

        this.openTabWebview.css("display", "flex");
        this.openTab.tab.addClass("active");

        if (!justOpened) {
            this.tabSwitch();
        }
    }

    closeTab(tabID) {
        this.tabs.get(tabID).webview.remove();
        this.tabs.get(tabID).tab.remove();
        this.tabs.delete(tabID);
        if (this.tabs.size <= 1) return this.close();
        if (tabID === this.currentTab) this.focusTab(this.tabs.keys().next().value);
        return false;
    }

    tabSwitch() {
        this.urlBar.val(this.openTabWebview[0].getURL());
    }

    get openTab() {
        return this.tabs.get(this.currentTab);
    }

    get openTabWebview() {
        return this.openTab.webview;
    }
}

module.exports = {
    BrowserApp: BrowserApp,
    BrowserWindow: BrowserWindow
};
