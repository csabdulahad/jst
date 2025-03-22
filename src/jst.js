/**
 * JS-Tea is a collection of JavaScript readable classes and utility functions which
 * greatly make the web app development easier.
 *
 * This js file includes all the js-tea library files together and provides the library
 * environment to the code.
 * */
class jst {
	
	static version() {
		return '5.0.0-beta';
	}
	
	/**
	 * Attribute name to apply theme value to by Theme class.
	 * Must prepend with "data-" .
	 * */
	static themeAttribute = 'data-bs-theme';
	
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
	
	static eleById(val, space = document) {
		if (typeof val !== 'string') return val;
		val = val[0] === '#' ? val.substring(1) : val;
		return space.getElementById(val);
	}
	
	/**
	 * Sets the property by the key to specified value only if the property
	 * doesn't already exist in the object.
	 *
	 * @param {object} obj
	 * @param {string} key
	 * @param {any} value
	 * */
	static setProperty(obj, key, value) {
		if (obj.hasOwnProperty(key)) return
		
		obj[key] = value
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
	 * @return {number} a random number in between a & b inclusive
	 * */
	static random = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
	
	/**
	 * This keeps the JavaScript execution thread busy in a loop for specified
	 * amount of seconds
	 *
	 * @param {number} sec amount of seconds to be sleeping for
	 * */
	static sleep(sec) {
		sec = (new Date().valueOf()) + (1000 * sec);
		while (true) if (new Date().valueOf() >= sec) break;
	}
	
	/**
	 * Returns the first child as specified of the parent.
	 *
	 * @param {string} selector CSS selector
	 * @param {jQuery | HTMLElement} parent The parent element
	 *
	 * @return {HTMLElement} the child element
	 * */
	static getChildOf = (selector, parent) => $(parent).find(`${selector}`)[0];
	
	/**
	 * Returns the children as specified by CSS selector of the parent.
	 * @param {string} selector CSS selector
	 * @param {jQuery | HTMLElement} parent The parent element
	 *
	 * @return {[HTMLElement]} the child element
	 * */
	static getChildrenOf = (selector, parent) => $(parent).find(`${selector}`).children();
	
	/**
	 * Returns the query parameter value of the URL.
	 *
	 * @param {string} key
	 * @param {?any} defaultValue
	 * @param {?url} url
	 *
	 * @return {string}
	 * */
	static queryParam(key, defaultValue = null, url = null) {
		if (!url) url = document.location;
		
		let params = new URL(url).searchParams;
		let value = params.get(key);
		
		return value != null ? value : defaultValue;
	}
	
	/**
	 * Generates a unique id composed of current time in milliseconds followed by
	 * a random number between 1-1000 [inclusive].
	 *
	 * @return {string}
	 * */
	static uniqueId() {
		let timestamp = Date.now().toString();
		let random = this.random(1, 1000);
		return `${timestamp}${random}`;
	}
	
	/**
	 * Adds or removes a CSS class (cls) from a specified HTML element (ele) based on a given condition.
	 *  - If true, the class will be added.
	 *  - If false, the class will be removed.
	 * @param {boolean} condition
	 * @param {string} cls CSS class
	 * @param {HTMLElement | string} ele Any html element, jquery or even a css selector
	 * */
	static switchCls(condition, cls, ele) {
		if (condition) $(ele).addClass(cls);
		else $(ele).removeClass(cls);
	}
	
	/**
	 * Converts percentage value to pixels based on the specified axis.
	 *
	 * @param {number|string} percent - The percentage value with/without '%' sign at the end.
	 * @param {string} [axis='x'] - The axis to base the conversion on. Default value is 'x'.
	 * @return {number} The converted value in pixels.
	 */
	static percentToPx(percent, axis = 'x') {
		percent = parseFloat(`${percent}`.replace('%', ''));
		
		let full = axis === 'x' ? window.innerWidth : window.innerHeight
		let uni = full * .01
		return percent * uni;
	}
	
	/**
	 * Converts pixel unit to percentage for the inner height & width of the window
	 *
	 * @param {number|string} px The pixel value with/without 'px' at the end.
	 * @param {'x'|'y'} axis The axis needed to calculate the percentage against either width or height
	 * of the window
	 * @return {number} Percentage value for specified pixel
	 */
	static pxToPercent(px, axis = 'x') {
		px = parseFloat(`${px}`.replace('px', ''));
		
		let full = axis === 'x' ? window.innerWidth : window.innerHeight
		let uni = full * .01
		return px / uni
	}
	
	static _updateProperties() {
		window.log = (msg) => console.log(msg);
		window.warn = (msg) => console.warn(msg);
		window.err = (msg) => console.error(msg);
		window.info = (msg) => console.info(msg);
		
		Object.defineProperty(Array.prototype, 'isEmpty', {
			value: function () {
				return this.length === 0
			},
			writable: false, // no code can rewrite/modify the contain method
			configurable: false // no one can configure this property
		});
		
		Object.defineProperty(Array.prototype, 'peek', {
			value: function () {
				return this?.[this.length - 1]
			},
			writable: false, // no code can rewrite/modify the contain method
			configurable: false // no one can configure this property
		});
		
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
		 */
		
		Object.defineProperty(String.prototype, 'capitalize', {
			value: function (lower = false) {
				return (lower ? this.toLowerCase() : this).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
			}
		});
		
		Object.defineProperty(String.prototype, 'isEmpty', {
			value: function () {
				return this.length === 0;
			}
		});
	}
	
	/**
	 * Create and returns JstModal instance.
	 *
	 * @param {string} id
	 * @param {object=} option Optional values
	 * @param {string=} option.title Sets the modal title. It can be html or string value. Default is "jst-Modal".
	 * @param {boolean=} option.reusable - Whether the modal can be reused. Default is true for non-iFramed modal.
	 * @param {number|string=} option.width - The width of the modal. Default width is 100% of the parent window.
	 * @param {number|string=} option.height - The height of the modal. Default height is 100% of the parent window.
	 * @param {number|string=} option.padding - The padding of the modal. Default is 1rem.
	 * @param {string=} option.url - Url for the iframe webpage
	 * @param {object=} option.injectData - Any data to pass to iFramed modal
	 * @param {boolean=} option.cancelable - Flag makes the modal cancellation status
	 * @param {boolean=} option.overlay - Flag hides/shows the overlay below the modal
	 * @param {boolean=} option.decorated - Flag removes the header from the modal
	 * @param {boolean=} option.showCloseIcon - Whether to show close icon if modal is undecorated
	 * @param {number=} option.opacity - Opacity value 0 to 1 for the overlay behind the modal
	 * @param {'light'|'dark'=} option.theme - Modal theme. Light is default theme
	 * @param {boolean=} option.showLoaderText - Text to display as loader label while fetching iframe paged
	 * @param {string=} option.loaderText - Text to display as loader label while fetching iframe paged
	 * */
	static modal (id, option= {}) {
		/*
		 * Check if the modal was cached in the ModalManager
		 */
		let cachedModal = JstOverlay.getPopup(id);
		
		if (cachedModal) return cachedModal;
		
		/*
		 * Create a new modal
		 */
		return new JstModal(id, option);
	}
	
	
	/**
	 * @param {string} id
	 * @param {object=} option Optional values: w=350, h=auto, cancelable=true, padding=1rem
	 * @param {number|string=} option.title - Title of the alert box
	 * @param {number|string=} option.msg - Message of the alert box
	 * @param {'light'|'dark'=} option.theme - Alert theme. Light is default theme.
	 * @param {number|string=} option.width - Width of alert box. Max value is 75% of the window's inner width.
	 * @param {number|string=} option.height - Height of the alert box. Max height is 75% of the window's inner height.
	 * @param {number|string=} option.padding - Padding for the alert message div
	 * @param {boolean=} option.cancelable - Sets if the alert can be cancelled
	 * */
	static alert (id, option = {}) {
		return new JstAlert(id, option);
	}
	
	/**
	 * Randomly shuffles the elements of an array using the Fisher-Yates algorithm.
	 *
	 * @param {Array} arr - The array to shuffle.
	 * @returns {Array} - The shuffled array.
	 *
	 * @example
	 * const numbers = [1, 2, 3, 4, 5];
	 * const shuffled = shuffle(numbers); // e.g., [3, 5, 1, 4, 2]
	 */
	static shuffle = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			// Generate a random index from 0 to i
			const j = Math.floor(Math.random() * (i + 1));
			// Swap elements at i and j
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	};
	
}

jst._updateProperties();