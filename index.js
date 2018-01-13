const Main = require("./modules/Main");

Main.createParent({
    title: "Glass",
    width: "1280",
    mainWidth: 1024,
    height: 720,
    minHeight: 576,
    backgroundColor: "#000",
    autoHideMenuBar: true
})
    .then(parentWindow => {
        parentWindow.loadURL(`file://${__dirname}/render/startup.html`);
        parentWindow.on("closed", () => Main.removeParent());

        Main.addShortcut("Parent", "ctrl+w", () => false);
    });
