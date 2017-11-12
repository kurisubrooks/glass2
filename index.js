const { app, BrowserWindow } = require("electron");
const shortcut = require("electron-localshortcut");

let win;
let startup = () => {
    win = new BrowserWindow({
        title: "Glass",
        width: 1280,
        minWidth: 1024,
        height: 720,
        minHeight: 576,
        backgroundColor: "#000",
        autoHideMenuBar: true
    });

    win.loadURL(`file://${__dirname}/render/startup.html`);
    // win.webContents.openDevTools()

    shortcut.register(win, "Ctrl+W", () => {
        return false;
    });

    win.on("closed", () => {
        win = null;
    });
};

app.on("ready", startup);

app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
    if (win === null) startup();
});
