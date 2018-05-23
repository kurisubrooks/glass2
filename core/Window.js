const $ = require("jquery");

const Template = require("./Template");
const guid = require("./Util/guid");

const { remote } = require("electron");

class Window {
    constructor(options) {
        if (!options.title) throw new Error("Window title must not be missing.");
        if (!options.content) throw new Error("Window content must not be missing.");
        if (!options.size) throw new Error("Window size must not be missing.");
        if (typeof options.title !== "string") throw new TypeError("Window title must be a string.");
        if (typeof options.content !== "string") throw new TypeError("Window content must be a string.");
        if (!Array.isArray(options.size)) throw new TypeError("Window size must be an array.");
        if (!options.size.length || options.size.length > 2) throw new Error("Invalid window size.");

        this.title = options.title;
        this.size = options.size;
        this.content = options.content;
        this.theme = options.theme || "light";
        this.frame = "frame" in options ? options.frame : true;
        this.id = guid();
        this.maximized = false;

        // console.log(this.title, options.frame);

        this.window = new Template("window").build({
            title: this.title,
            content: this.content,
            id: this.id,
            width: this.size[0],
            height: this.size[1]
        });

        // Initialize events for dragging window around
        this.window.find(".window-title").mousedown(evt => {
            $(evt.target).data("mousedown", true);

            if (evt.target === this.window.find(".window-title h1")[0]) {
                this.startDrag(evt.pageX, evt.pageY, evt.target);
            }
        }).on("mouseup mouseleave", evt => {
            $(evt.target).data("mousedown", false);
        });

        // Initialize events for resizing window
        this.window.find(".window-resize").mousedown(evt => this.startResize(evt.pageX, evt.pageY));

        $(document).mousemove(evt => this.doMousemovement(evt.pageX, evt.pageY));
        $(document).mouseup(() => this.stopMovements());

        this.window.find(".window-title").on("dblclick", () => this.maximize());

        if (this.theme === "dark") {
            this.window.addClass("dark");
            this.window.find(".window-content").addClass("dark");
        }

        if (!this.frame) this.window.addClass("no-frame");
    }

    openIn(windowArea) {
        $(windowArea).append(this.window);
        return this;
    }

    minimize() {
        this.window.addClass("closed");
    }

    maximize() {
        if (!this.maximized) {
            this.oldX = this.posX;
            this.oldY = this.posY;
            this.posX = 0;
            this.posY = 0;
            this.size = [this.width, this.height];

            this.width = this.window.parent().width();
            this.height = this.window.parent().height();

            this.window.addClass("maximized");
        } else {
            remote.process.emit("SizeChange");
            this.width = this.size[0];
            this.height = this.size[1];

            this.posX = this.oldX;
            this.posY = this.oldY;

            this.window.removeClass("maximized");
        }

        this.maximized = !this.maximized;
    }

    close() {
        this.window.remove();
    }

    startDrag(mouseX, mouseY, target) {
        if (this.maximized && target) {
            setTimeout(() => {
                if ($(target).data("mousedown")) {
                    this.maximize();
                    this.posX = 0;
                    this.posY = 0;

                    this.startDrag(mouseX, mouseY);
                }
            }, 150);
        } else {
            this.dragging = true;
            this.startMovement(mouseX, mouseY);
        }
    }

    startResize(mouseX, mouseY) {
        this.resizing = true;
        this.startMovement(mouseX, mouseY);
    }

    startMovement(mouseX, mouseY) {
        this.mx = mouseX;
        this.my = mouseY;
    }

    doMousemovement(mouseX, mouseY) {
        let dx = mouseX - this.mx, dy = mouseY - this.my;
        this.mx = mouseX;
        this.my = mouseY;

        if (this.dragging) {
            this.posX += dx;
            this.posY += dy;
        }

        if (this.resizing) {
            this.width += dx;
            this.height += dy;
        }
    }

    stopMovements() {
        this.resizing = this.dragging = false;
    }

    get posX() {
        return parseInt(this.window.css("left"));
    }

    set posX(val) {
        this.window.css("left", Math.max(val, 0));
    }

    get posY() {
        return parseInt(this.window.css("top"));
    }

    set posY(val) {
        this.window.css("top", Math.max(val, 0));
    }

    get width() {
        return parseInt(this.window.css("width"));
    }

    set width(val) {
        this.window.css("width", Math.max(val, 0));
    }

    get height() {
        return parseInt(this.window.css("height"));
    }

    set height(val) {
        this.window.css("height", Math.max(val, 0));
    }
}

module.exports = Window;
