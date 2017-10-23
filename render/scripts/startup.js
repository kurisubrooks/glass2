const $ = require("jquery");
const { remote } = require("electron");

$(() => {
    $("body").fadeIn(500);

    // doStartup();

    setTimeout(() => {
        $("body").fadeOut(500);
        setTimeout(() => remote.getCurrentWindow().loadURL(`file://${__dirname}/login.html`), 500);
    }, 5000);
});
