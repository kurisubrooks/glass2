
const App = require("../../core/App");
const Window = require("../../core/Window");
const BrowserTab = require("./BrowserTab");

const fs = require("fs");
const path = require("path");

const defaultPage = "https://www.google.com/";

const URL_HIGHLIGHTING_COLORS = {
  protocol: 'green',
  domain: 'white',
  path: 'gray'
};

class BrowserApp extends App {
    constructor() {
        super({
            name: "Browser",
            directory: "Browser",
            theme: "dark",
            index: "index.html",
            icon: "icon.png",
            WindowType: BrowserWindow
        });

        const styles = fs.readFileSync(path.join(__dirname, "templates/style.html"));
        this.content = this.content.replace("{{styles}}", styles);
    }
}

class BrowserWindow extends Window {
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
                console.log(urlBar.text());
                this.openTab.loadURL(urlBar.text());
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

        setTimeout(() => {
            this.width -= 1;
            this.width += 1;
        }, 10);
    }

    closeTab(tabID) {
        this.tabs.get(tabID).webview.remove();
        this.tabs.get(tabID).tab.remove();
        this.tabs.delete(tabID);
        if (this.tabs.size < 1) return this.close();
        if (tabID === this.currentTab) this.focusTab(this.tabs.keys().next().value);
        return false;
    }

    tabSwitch() {
        this.setURLBar(this.openTabWebview[0].getURL());
    }

    setURLBar(url) {
      const highlightingRegex = /^([\w-]*\:\/\/)([\w-\:\.]*)(.*)$/;
      const highlightedURL = url.replace(highlightingRegex, (match, protocol, domain, path) => {
        return `<span style="color: ${URL_HIGHLIGHTING_COLORS.protocol}">${protocol}</span>` +
               `<span style="color: ${URL_HIGHLIGHTING_COLORS.domain}">${domain}</span>` +
               `<span style="color: ${URL_HIGHLIGHTING_COLORS.path}">${path}</span>`;
      });

      this.urlBar.html(highlightedURL);
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
