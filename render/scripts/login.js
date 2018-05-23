const { remote } = require("electron");
const moment = require("moment");
const $ = window.jQuery = require("jquery");

const users = [
    {
        name: "Kurisu Brooks",
        username: "kbrooks",
        avatar: "kurisu",
        permission: "root",
        password: "cheese"
    },
    {
        name: "Katie Sekai",
        username: "katiesakai",
        avatar: "katie",
        permission: "user",
        password: "tomato"
    },
    {
        name: "Sammy Sekai",
        username: "sammysekai",
        avatar: "sammy",
        permission: "user",
        password: "pumpkin"
    },
    {
        name: "Anime Catgirl",
        username: "acatgirl",
        permission: "root",
        password: ""
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

document.addEventListener("keyup", (e) => {
    if (e.keyCode === 116) {
        location.reload();
    }
});

$(() => {
    // Loop Through Users, Add them to the page
    for (let index = 0; index < users.length; index++) {
        const head = $(`<div class="head" data-user=${index} style="background-image: url(../assets/avatars/${users[index].avatar || 'default'}.png);"></div>`);

        if (index === 0) selectUser(head);

        $(".heads").append(head);
    }

    // Update Time
    setInterval(() => {
        let time = moment().format("h:mm");
        if ($(".time").text() !== time) $(".time").text(time);
    }, 150);

    // User Head Select
    $(".head").not(".ghost").click(el => selectUser(el.target));

    // Show UI
    $("body").fadeIn(500);

    // Handle Login
    $(".login").submit((evt) => {
        evt.preventDefault();

        const form = $(evt.target);
        const input = form.find("#password");

        let user = users[form.find(".head.active").data("user")];
        let pass = input.val();

        if (user.password === pass) {
            input.attr("disabled", true);
            input.blur();
            localStorage.currentOS = remote.getGlobal("OS");
            localStorage.currentUser = JSON.stringify(user);
            setTimeout(() => $(".container").fadeOut(250), 800);
            setTimeout(() => remote.getCurrentWindow().loadURL(`file://${__dirname}/desktop.html`), 1100);
        } else {
            form.addClass("error");
            form.one("animationend", () => {
                form.removeClass("error");
                input.select();
            });
        }

        return false;
    });
});
