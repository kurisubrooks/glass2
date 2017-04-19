const App = require("../../core/App");
const Window = require("../../core/Window");
const BrowserTab = require("./BrowserTab");

const fs = require("fs");
const tldsFilepath = `${__dirname}/tlds.txt`;

// Get an array of all tlds
const tldsRaw = fs.readFileSync(tldsFilepath, "utf8");
const tlds = tldsRaw.split("\n");

// Move this to some settings file somewhere
const defaultPage = "https://google.com"; // eslint-disable-line no-unused-vars

class BrowserApp extends App {
    constructor() {
        super("Browser", BrowserWindow);
    }
}

class BrowserWindow extends Window {
    constructor(options) {
        super(options);
        this.tlds = tlds;
    }
    openIn(windowArea) {
        super.openIn(windowArea);

        this.header = this.window.find("header");
        const backButton = this.backButton = this.window.find(".browser-back");
        const forwardButton = this.forwardButton = this.window.find(".browser-forward");
        const refreshButton = this.refreshButton = this.window.find(".browser-refresh");
        this.tabArea = this.window.find(".browser-tab-area");
        this.tabsBar = this.window.find(".browser-tabs");
        const urlBar = this.urlBar = this.window.find(".browser-url");
        const newTabButton = this.newTabButton = this.window.find(".new-tab-button");
        this.tabs = new Map();

        backButton.click(() => {
            this.openTab.goBack();
        });
        forwardButton.click(() => {
            this.openTab.goForward();
        });
        refreshButton.click(() => {
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
        newTabButton.click(() => {
            this.focusTab(this.newTab(), true);
        });

        this.focusTab(this.newTab(), true);

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
    newTab() {
        const tab = new BrowserTab(this, { url: defaultPage });
        this.tabs.set(tab.id, tab);
        return tab.id;
    }
    focusTab(tabID, justOpened) {
        this.currentTab = tabID;
        for (let [key, value] of this.tabs) { // eslint-disable-line no-unused-vars
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
