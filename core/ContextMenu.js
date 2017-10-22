const $ = require("jquery");
const guid = require("./Util/guid");

module.exports = class ContextMenu {
    constructor(options) {
        this.controls = options.controls;
        this.location = options.location || $("body");
        this.id = guid();

        this.create();
    }

    create() {
        // Initialize ContextMenu
        this.container = $(`<div class="context-menu" id="context-menu--${this.id}"><ul class="context-menu__list"></ul></div>`);

        this.container.click(() => {
            this.lastClickOnContainer = true;
        });

        this.fillContainerWithOptions(this.container.find(".context-menu__list"), this.controls);

        $("body").append(this.container);

        this.location.contextmenu(el => {
            this.container.attr("open", "open");
            this.container.css("left", el.pageX);

            // Make sure it will fit, if not, move it up enough to fit
            let posY = el.pageY + this.container.height() > $(document).height() ? el.pageY - this.container.height() : el.pageY;
            this.container.css("top", posY);
        });

        $("body").click(() => {
            const alreadyOpen = this.container.attr("open");

            if (alreadyOpen && !this.lastClickOnContainer) {
                this.container.removeAttr("open");
            }

            this.lastClickOnContainer = false;
        });
    }

    remove() {
        this.container.remove();
    }

    fillContainerWithOptions(container, items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i], el;
            if (item.type === "item") {
                el = $(`<li class="context-menu__item">${item.text}</li>`);
                if (item.click) el.click(item.click);
            } else if (item.type === "list") {
                el = $(`<li class="context-menu__item-list">${item.text}<ul class="context-menu__list"></ul></li>`);
                this.fillContainerWithOptions(el.find(".context-menu__list"), item.items);
            } else if (item.type === "separator") {
                el = $(`<li class="context-menu__separator"></li>`);
            }

            container.append(el);
        }
    }
};
