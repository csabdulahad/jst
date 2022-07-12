/**
 * JS-Tea is a collection of JavaScript readable classes and utility functions which
 * greatly make the web app development easier.
 *
 * This js file includes all the js-tea library files together and provides the library
 * environment to the code.
 * */


/**********************************************************************************************
 *                                        WARNING:                                             *
 *           PLEASE DON'T MODIFY THIS UNLESS YOU KNOW WHAT YOU ARE DOING. ANY IN APPROPRIATE   *
 *           CHANGE TO THIS CLASS MAY LEAD TO MALFUNCTIONING OR CODE BREAKING.                 *
 ************************************************************************************************/

class jst {

    /**
     * It takes a callback function as argument and executes it immediately when the document
     * is ready, otherwise it adds an event listener to the window and runs the callback when
     * the window is ready.
     *
     * @param fn {function} The callback function.
     * */
    static run(fn) {
        if (document.readyState === 'complete') fn();
        else window.addEventListener('load', () => fn());
    }

    static runLater(delay, fn) {
        let d = delay * 1000;
        let f = fn;
        jst.run(() => setTimeout(f, d));
    };

    /**
     * This click function can be called from anywhere within the document. The order is
     * not important as the click event attachment happens after the document ready state.
     *
     * @param ele {string|any} It can be the id to the element either with # sign or not.
     * The dom element can also be passed as an argument.
     *
     * @param fn {function} The callback function to execute on event occurs
     *
     * */
    static click(ele, fn) {
        jst.run(() => {
            if (typeof ele === 'string') {
                let id = ele[0] === '#' ? ele.substring(1) : ele;
                ele = document.getElementById(id);
            }

            if (ele == null) return;
            ele.addEventListener('click', (event) => fn(event));
        });
    }

    static isStr = (val) => !(!val || val.length === 0);

    static eleId(val, space = document) {
        if (typeof val !== 'string') return val;
        val = val[0] === '#' ? val.substring(1) : val;
        return space.getElementById(val);
    }

    static isDef = (val) => val !== undefined;

    static isUndef = (val) => val === undefined;

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

}

jst.updateProperties();