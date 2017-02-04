const { app, BrowserWindow } = require("electron");

let win;
let startup = () => {
    win = new BrowserWindow({
        title: "Loading...",
        width: 1280,
        minWidth: 1024,
        height: 720,
        minHeight: 576,
        backgroundColor: "#000000"
    });

    win.loadURL(`file://${__dirname}/render/startup.html`);
    // win.webContents.openDevTools()

    win.on("closed", () => {
        win = null;
    });
};

app.on("ready", startup);
app.on("window-all-closed", () => app.quit());

app.on("activate", () => {
    if (win === null) startup();
});
