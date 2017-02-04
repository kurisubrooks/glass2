const $ = require("jquery");
const fs = require("fs");
const path = require("path");

class Template {
    constructor(name) {
        this.template = fs.readFileSync(path.join(__dirname, "..", "render", "templates", `${name}.html`), "utf8");
    }

    build(replacements) {
        const templateRender = this.template.replace(/{{\s*(\w+)\s*}}/g, (match, tag) => {
            return replacements[tag];
        });

        return $(templateRender);
    }
}

module.exports = Template;
