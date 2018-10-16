'use strict';

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const defaultCss = require('defaultcss');
const domify = require('domify');

const titlebarStylesheet = fs.readFileSync(path.join(__dirname, '..', 'css', 'titlebar.css'), 'utf-8');
const titlebarView = fs.readFileSync(path.join(__dirname, '..', 'templates', 'titlebar.html'), 'utf-8');

class TitleBar extends EventEmitter {
    constructor(options = {}) {
        super();

        this.options = {};
        this.options.color = options.color;
        this.options.backgroundColor = options.backgroundColor;
        this.options.darkMode = options.darkMode;
        this.options.draggable = options.draggable;
        this.options.fullscreen = options.fullscreen;

        this.titlebarElement = domify(titlebarView, document);

        this.minimizeButton = this.titlebarElement.querySelector('.titlebar-minimize');
        this.closeButton = this.titlebarElement.querySelector('.titlebar-close');

        this.init();
    };
	
    init() {
        if (this.options.draggable) {
            this.titlebarElement.classList.add('draggable');
        }

        this.minimizeButton.addEventListener('click', event => this.clickMinimize(event));
        this.closeButton.addEventListener('click', event => this.clickClose(event));
    }

    clickClose() {
        this.emit('close');
    };

    clickMinimize() {
        this.emit('minimize');
    };
    appendTo(context = document.body) {
        if (this.options.darkMode !== false) {
            document.querySelector('body').classList.add('titlebar-light');
        }

        if (this.options.color) {
            this.titlebarElement.querySelector('rect').style.fill = this.options.color;
            this.titlebarElement.querySelector('polygon').style.fill = this.options.color;
        }

        if (this.options.backgroundColor) {
            this.titlebarElement.style.backgroundColor = this.options.backgroundColor;
        }

        defaultCss('titlebar', titlebarStylesheet);

        context.appendChild(this.titlebarElement);

        return this;
    };

    destroy() {
        parent.removeChild(this.titlebarElement);

        return this;
    };

}

module.exports = TitleBar;