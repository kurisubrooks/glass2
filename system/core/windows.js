"use strict"

const _ = require("lodash")
const $ = require("jquery")

let windows = {}
let notifications = {}
let activeWindows = []

module.exports = {
    window: (object) => {
        let data
        let id = guid()
        let windows = $(".windows")

        let win =   $(`<div class="window frame" id="${id}"></div>`).hide()
        let menubar =      $(`<div class="menubar"></div>`)
        let title =            $(`<div class="title"></div>`)
        let controls =         $(`<div class="controls"></div>`)
        let ui_min =               $(`<span id="minimize"><i class="material-icons">remove</i></span>`)
        let ui_max =               $(`<span id="maximize"><i class="material-icons">add</i></span>`)
        let ui_close =             $(`<span class="close"><i class="material-icons">close</i></span>`)
        let content =      $(`<div class="content"></div>`)
        let frame =            $(`<webview src="${object.url}"></webview>`)

        // Build Window
        title.text(object.title)
        win.addClass(object.theme)
        win.height(object.height - 50)
        win.width(object.width)
        content.height(object.height || 400)
        content.width(object.width || 700)

        //controls.append(ui_min)
        //controls.append(ui_max)
        controls.append(ui_close)
        menubar.append(title)
        menubar.append(controls)
        content.append(frame)
        win.append(menubar)
        win.append(content)
        windows.append(win)

        // Window Positioning
        win.draggable({
            handle: menubar,
            scroll: false,
            containment: "parent",
            start: () => {
                _.pull(activeWindows, id)
                activeWindows.push(id)
                updateZIndexes(activeWindows)
            }
        })

        win.resizable({
            minHeight: 420,
            minWidth: 700,
            containment: "parent",
            handles: "all",
            alsoResize: content
        })

        win.position({
            my: "center",
            at: "center",
            of: windows,
            collision: "fit"
        })

        win.fadeIn("fast")
        win.focus()

        // Window Activation
        if (!windows[object.app]) windows[object.app] = {}
        //if (!$("#" + object.app).hasClass("active")) $("#" + object.app).addClass("active")
        windows[object.app][id] = true

        $(`.window#${id}`).click((e) => {
            _.pull(activeWindows, id)
            activeWindows.push(id)
            updateZIndexes(activeWindows)
        })

        // Window Close
        $(`.window#${id} .controls .close`).click((e) => {
            // Prevent Double Trigger
            e.stopImmediatePropagation()

            // Destroy Window
            fadeRemove(win, 85)
            windows[object.app][id] = false

            // Remove from list of active windows
            _.pull(activeWindows, id)

            // Remove Window Indicator if All Windows Closed
            /*if (_.every(_.values(windows[object.app]), function(v) {return !v})) $("#" + object.app).removeClass("active")*/
        })
    }
}

let guid = () => {
    let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}

let fadeRemove = (el, sp) => el.fadeOut(sp || "fast", () => el.remove())

let updateZIndexes = (ids) => {
    let baseIndex = 100

    for (let i = 0; i < ids.length; ++i) {
        let id = ids[i]
        $("#" + id).css("z-index", baseIndex + i)
    }
}

let safe = (string) => {
    console.log(string)

    let entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    }

    return String(string).replace(/[&<>"'\/]/g, (s) => entityMap[s])
}
