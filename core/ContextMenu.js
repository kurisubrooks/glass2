const $ = require('jquery');
const guid = require('./Util/guid');

module.exports = class ContextMenu {
  constructor(options) {
    this.controls = options.controls;
    this.location = options.location || $('body');
    this.id = guid();

    this.create();
  }

  create () {
    // Initialize ContextMenu
    this.container = $(`<div class="context-menu" id="context-menu--${this.id}"><ul class="context-menu__list"></ul></div>`);
    this.container.click((e) => {
      this.lastClickOnContainer = true;
    });
    this.fillContainerWithOptions(this.container.find('.context-menu__list'), this.controls);
    $('body').append(this.container);

    this.location.contextmenu((e) => {
      this.container.attr('open', 'open');
      this.container.css('left', e.pageX);
      // Make sure it will fit, if not, move it up enough to fit
      let y = e.pageY + this.container.height() > $(document).height() ? e.pageY - this.container.height() : e.pageY;
      this.container.css('top', y);
    });

    $('body').click((e) => {
      const alreadyOpen = this.container.attr('open') ? true : false;
      if (alreadyOpen && !this.lastClickOnContainer) {
        this.container.removeAttr('open');
      }
      this.lastClickOnContainer = false;
    });
  }

  fillContainerWithOptions (container, items) {
    for (let i = 0; i < items.length; i++) {
      let item = items[i], e;
      if (item.type == 'item') {
        e = $(`<li class="context-menu__item">${item.text}</li>`);
        if (item.click) e.click(item.click);
      } else if (item.type == 'list') {
        e = $(`<li class="context-menu__item-list">${item.text}<ul class="context-menu__list"></ul></li>`);
        this.fillContainerWithOptions(e.find('.context-menu__list'), item.items);
      } else if (item.type == 'separator') {
        e = $('<li class="context-menu__separator"></li>');
      }
      container.append(e);
    }
  }
}
