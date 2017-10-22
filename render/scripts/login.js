const { remote } = require("electron");
const moment = require("moment");
const $ = window.jQuery = require("jquery");

const users = [
    {
        name: "Kurisu Brooks",
        avatar: "kurisu",
        password: "cheese"
    },
    {
        name: "Katie Sekai",
        avatar: "katie",
        password: "tomato"
    },
    {
        name: "Sammy Sekai",
        avatar: "sammy",
        password: "pumpkin"
    }
];

let selectedUserIndex = null;
let selectedUser = null;

const selectUser = head => {
    head = $(head);
    $("#password").val("");
    const index = head.data("user");

    if (selectedUserIndex === index) return;

    $(".head").removeClass("active");

    head.addClass("active");
    $(".login .form .title").text(users[index].name);
    selectedUserIndex = index;
    selectedUser = users[selectedUserIndex];

    $(".ghost").remove();

    const rightElements = users.length - selectedUserIndex - 1;

    addGhosts(Math.abs(selectedUserIndex - rightElements), selectedUserIndex > rightElements);
};

const addGhosts = (amount, append) => {
    const type = append ? "append" : "prepend";
    for (let ghosts = 0; ghosts < amount; ghosts++) {
        $(".heads")[type]($(`<div class="head ghost"></div>`));
    }
};

$(() => {
    for (let index = 0; index < users.length; index++) {
        const head = $(`<div class="head" data-user=${index} style="background-image: url(../assets/avatars/${users[index].avatar}.png);"></div>`);

        if (index === 0) selectUser(head);

        $(".heads").append(head);
    }

    setInterval(() => {
        let time = moment().format("h:mm");
        if ($(".time").text() !== time) $(".time").text(time);
    }, 150);

    $(".head").not(".ghost").click(el => selectUser(el.target));

    $("body").fadeIn(500);

    $(".login").submit((evt) => {
        evt.preventDefault();

        const form = $(evt.target);

        let success = true;
        let user = users[form.find(".head.active").data("user")];
        let pass = form.find("#password").val();

        success &= user.password === pass;

        if (success) {
            setTimeout(() => $("login").fadeOut(250), 1000);
            setTimeout(() => $("main").fadeOut(250), 1500);
            setTimeout(() => remote.getCurrentWindow().loadURL(`file://${__dirname}/desktop.html`), 1600);
        } else {
            form.find("#password").select();
            form.addClass("error").one("animationend", () => {
                form.removeClass("error");
            });
        }

        return false;
    });
});
