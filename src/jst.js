/**********************************************************************************************
 *                                        WARNING:                                             *
 *           PLEASE DON'T MODIFY THIS UNLESS YOU KNOW WHAT YOU ARE DOING. ANY IN APPROPRIATE   *
 *           CHANGE TO THIS CLASS MAY LEAD TO MALFUNCTIONING OR CODE BREAKING.                 *
 ************************************************************************************************/


/**
 * JS-Tea is a collection of JavaScript readable classes and utility functions which
 * greatly make the web app development easier.
 *
 * This js file includes all the js-tea library files together and provides the library
 * environment to the code.
 * */
class jst {

    /**
     * It takes a callback function as argument and executes it immediately when the document
     * is ready, otherwise it adds an event listener to the window and runs the callback when
     * the window is ready. So this method is DOM safe.
     *
     * @param {function()} fn The callback function.
     * */
    static run(fn) {
        if (document.readyState === 'complete') fn();
        else window.addEventListener('load', () => fn());
    }

    /**
     * Runs a function after a specified amount delay. Internally uses jst.run()
     * method. So this method is DOM safe.
     *
     * @param {number} delay in seconds
     * @param {function ()} fn callback to be invoked after the delay specified
     * */
    static runLater(delay, fn) {
        let d = delay * 1000;
        let f = fn;
        jst.run(() => setTimeout(f, d));
    };

    /**
     * This click function can be called from anywhere within the document. The order is
     * not important as the click event attachment happens after the document ready state.
     *
     * @param {string|HTMLElement} ele It can be the id to the element either with # sign or not.
     * The dom element can also be passed as an argument.
     *
     * @param {function(Event)} fn The callback function to execute on event occurs
     *
     * */
    static click(ele, fn) {
        jst.run(() => {
            if (Array.isArray(ele)) {
                ele = ele[0];
            } else if (typeof ele === 'string') {
                let id = ele[0] === '#' ? ele.substring(1) : ele;
                ele = document.getElementById(id);
            }

            if (ele == null) return;
            ele.addEventListener('click', (event) => fn(event));
        });
    }

    static isDef = (val) => val !== undefined;

    static isUndef = (val) => val === undefined;

    static isStr = (val) => !(!val || val.length === 0);

    static isDomEle = (ele) => $(ele).length !== 0;

    static eleId(val, space = document) {
        if (typeof val !== 'string') return val;
        val = val[0] === '#' ? val.substring(1) : val;
        return space.getElementById(val);
    }

    /**
     * Id attribute of a dom element, or a string id with/without "#" can be extracted
     * safely. The returned id is the string without the "#" sign in front.
     *
     * @param id {object|string} It can be a dom element, or the id string
     * @param onMissId {null|string} It is added to element if there is no id attribute for the element
     * @returns {string|undefined} the provided/extracted id
     * @throws {Error} when the passed id is neither a dom element nor a string value
     * */
    static id(id, onMissId = null) {
        if (jst.isDomEle(id)) {
            let i = $(id).attr('id');
            if (jst.isUndef(i) && onMissId !== null) {
                $(id).attr('id', onMissId);
                i = onMissId;
            }
            return i;
        }

        if (typeof id === 'string') {
            if (id.startsWith('#')) return id.substring(1);
            return id;
        }

        throw new Error('Id must be one of the following types: dom element, id string with/without "#"');
    }

    /**
     * Generates a random number from pseudorandom generator using Math.random
     * method.
     *
     * @param a {number} random number start range.
     * @param b {number} random number end range.
     * @return {number} a random number in between a & b.
     * */
    static random = (a, b) => Math.floor(Math.random() * b) + a;

    static jqueryuiISO = (id) => $(`#${id}`).datepicker({dateFormat: "yy-mm-dd"});

    /**
     * This keeps the only JS EXECUTION THREAD busy in a loop for specified
     * amount of seconds
     *
     * @param {number} sec amount of seconds to be sleeping for
     * */
    static sleep(sec) {
        sec = (new Date().valueOf()) + (1000 * sec);
        while (true) if (new Date().valueOf() >= sec) break;
    }

    static getChildOf = (selector, parent) => $(parent).find(`${selector}`)[0];

    static getChildrenOf = (id, parent) => $(parent).find(`${id}`).children();

    static queryParam(key, defaultValue) {
        let params = new URL(document.location).searchParams;
        let value = params.get(key);
        return value != null ? value : defaultValue;
    }

    static uniqueId() {
        let timestamp = Date.now().toString();
        let random = this.random(1, 1000);
        return `${timestamp}${random}`;
    }

    static switchCls(condition, cls, ele) {
        if (condition) $(ele).addClass(cls);
        else $(ele).removeClass(cls);
    }

    static updateProperties() {

        window.log = (msg) => console.log(msg);
        window.warn = (msg) => console.warn(msg);
        window.err = (msg) => console.error(msg);
        window.info = (msg) => console.info(msg);

        Object.defineProperty(Array.prototype, 'owns', {
            value: function (item) {
                if (item === undefined) throw new Error(`Key can't be undefined.`);
                return this.indexOf(item) !== -1;
            },
            writable: false, // no code can rewrite/modify the contain method
            configurable: false // no one can configure this property
        });

        Object.defineProperty(Array.prototype, 'missing', {
            value: function (item) {
                if (item === undefined) throw new Error(`Key can't be undefined.`);
                return this.indexOf(item) === -1;
            },
            writable: false, // no code can rewrite/modify the contain method
            configurable: false // no one can configure this property
        });

        Object.defineProperty(Array.prototype, 'erase', {
            value: function (item) {
                let index = this.indexOf(item);
                if (index < 0) return null;
                let value = this[index];
                this.splice(index, 1);
                return value;
            }, writable: false, configurable: false
        });

        Object.defineProperty(Array.prototype, 'eraseAt', {
            value: function (index) {
                if (typeof index !== 'number' || index < 0) return null;
                let value = this[index];
                this.splice(index, 1);
                return value;
            }, writable: false, configurable: false
        });

        Object.defineProperty(Object.prototype, 'owns', {
            value: function (key) {
                if (key === undefined) throw new Error(`Key can't be undefined.`);
                return this.hasOwnProperty(key);
            },
            writable: false, // no code can rewrite/modify the contain method
            configurable: false // no one can configure this property
        });

        Object.defineProperty(Object.prototype, 'missing', {
            value: function (key) {
                if (key === undefined) throw new Error(`Key can't be undefined.`);
                return !this.owns(key);
            },
            writable: false, // no code can rewrite/modify the contain method
            configurable: false // no one can configure this property
        });

        Object.defineProperty(Object.prototype, 'erase', {
            value: function (key) {
                let val = {key: key, value: this[key]};
                delete this[key];
                return val;
            }, writable: false, configurable: false
        });

        /*
        * Add various helpful property methods to objects os Array, String, Object to
        * make it easier for code writing and clarity.
        * */

        Object.defineProperty(String.prototype, 'capitalize', {
            value: function (lower = false) {
                return (lower ? this.toLowerCase() : this).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
            }
        });
    }

    /**
     * Adds OverlayScrollbars to specified element
     *
     * @param {HTMLElement} ele
     * */
    static overlayScrollbar(ele) {
        if (typeof OverlayScrollbars !== 'function') {
            warn(`OverlayScrollbars is not working properly. Popup can't scroll their content.`);
            return;
        }

        OverlayScrollbars(ele, {
            scrollbars: {
                clickScrolling: true,
                dragScrolling: true,
                autoHide: 'move',
                autoHideDelay: 1500
            },
        })
    }

}

jst.updateProperties();

/*
* Add OverlayScrollbars css file
* */
(() => {
    let cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = 'https://cdn.jsdelivr.net/npm/overlayscrollbars/css/OverlayScrollbars.min.css';
    document.head.appendChild(cssLink);
})();
