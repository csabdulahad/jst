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
class JstActiveNav {
	
	#navId;
	#nav;
	#slidingSpeed;
	
	constructor(id, slidingSpeed = 250) {
		this.#navId = id;
		this.#nav = $(`#${this.#navId}`);
		this.#slidingSpeed = slidingSpeed;
		
		/*
		 * Add click listener to all navigation category header
		 */
		$(`#${this.#navId} .jst-nav-cat-header`).click((e) => this.#slideToggle(e));
	}
	
	/**
	 * Toggles arrow icons found in the navigation
	 *
	 * @param {boolean} up indicates whether icon should up/down. True indicates menu is expanded.
	 * @param {HTMLElement} ele element with 'jst-nav-cat-arrow' class which has tbe arrow
	 */
	toggleArrowIcon = (up, ele) => {
		if (up) {
			$(ele).text('keyboard_arrow_up');
		} else {
			$(ele).text('keyboard_arrow_right');
		}
	};
	
	/**
	 * Callback which handles how to slide down/up navigation link group when user
	 * clicks on any navigation category header.
	 * */
	#slideToggle (e) {
		let that = this;
		
		let actNavHeader = $(e.currentTarget);
		
		let actParent = actNavHeader.parent();
		let actGrandParent = actParent.parent();
		
		let actNavGroup = actNavHeader.next();
		let actArrowIcon = actNavHeader.find('.jst-nav-cat-arrow');
		
		let slidingUp = $(actParent).hasClass('jst-nav-cat-expanded');
		
		/*
		 * We just simply need to close local sibling nav-groups found
		 * in the grandparent nav! ;)
		 */
		let closingNav = actGrandParent.find('.jst-nav-cat.jst-nav-cat-expanded');
		closingNav.each(function () {
			let closedNav = this;
			
			$(this).find('.jst-nav-link-group').slideUp(that.#slidingSpeed, function () {
				let icon = $(closedNav).find('.jst-nav-cat-arrow');
				that.toggleArrowIcon(false, icon);
			});
		});
		
		// Remove 'jst-nav-cat-expanded' class from all expanded category
		closingNav.removeClass('jst-nav-cat-expanded');
		
		/*
		 * Slide down the nav link group and update the arrow icon
		 */
		if (!slidingUp) {
			actNavGroup.slideDown(this.#slidingSpeed, () => {
				actParent.addClass('jst-nav-cat-expanded');
				that.toggleArrowIcon(true, actArrowIcon);
			});
		}
	}
	
	find (pathname = '') {
		pathname = pathname.trim();
		
		if (pathname.isEmpty()) {
			pathname = new URL(window.location).pathname;
		}
		
		/*
		 * Let's see which anchor tag matches the current url
		 */
		let links = $(`#${this.#navId} a`);
		let matchedA;
		
		for (let a of links) {
			let aPath = new URL(a.href).pathname;
			
			if (pathname.includes(aPath)) {
				matchedA = a;
				break;
			}
		}
		
		if (!matchedA) return;
		
		matchedA = $(matchedA);
		matchedA.addClass('jst-nav-act-link');
		
		let routeStartNode = this.#discoverActiveRouteUp(matchedA);
		this.#slideDownLinkGroup(routeStartNode);
	}
	
	/**
	 * This method starts from the top most navigation category which was marked
	 * with 'jst-nav-cat-expanded' previously. For each 'jst-nav-link-group' found
	 * in expanded nav, it slides down those and update the arrow icon recursively.
	 *
	 * @param {any|jQuery} ele
	 */
	#slideDownLinkGroup (ele) {
		let that = this;
		
		ele
			.children('.jst-nav-link-group')
			.slideDown(this.#slidingSpeed, function () {
				/*
				 * Update arrow icons
				 */
				let icon = $(this).prev().children('.jst-nav-cat-arrow');
				that.toggleArrowIcon(true, icon);
				
				// Recursion base case
				let childGroup = $(this).children('.jst-nav-cat.jst-nav-cat-expanded');
				if (childGroup.length === 0) return;
				
				that.#slideDownLinkGroup(childGroup);
			});
	}
	
	/**
	 * On getting a match, this method adds 'jst-nav-cat-expanded' to
	 * each navigation category found down the route to the link recursively.
	 *
	 * @param {any|jQuery} ele
	 * @return {any|jQuery}
	 */
	#discoverActiveRouteUp (ele) {
		let parent = ele.closest('.jst-nav-cat');
		
		// Mark it!
		if (parent.length === 1)
			parent.addClass('jst-nav-cat-expanded');
		
		/*
		 * Recursion base case.
		 * We break out of recursion once we hit the nav wrapper!
		 */
		if (parent.parent().attr('id') === this.#navId)
			return parent;
		
		// Keep expanding parent
		return this.#discoverActiveRouteUp(parent.parent());
	}
	
}

class JstAlert {
	
	#id;
	#selfId;
	
	#option;
	
	#dismissed = false;
	
	#closeIcon;
	
	#alertDom;
	#msgEle;
	#titleEle;
	
	#btnYes;
	#btnNo;
	#btnAck;
	
	#callbackAck = () => true;
	#callbackYes;
	#callbackNo;
	
	#callbackDismiss;
	#callbackShown;
	
	get id() {
		return this.#id;
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
	constructor(id, option = {}) {
		this.#id = id;
		this.#selfId = `jst-alert-${id}`;
		
		jst.setProperty(option, 'title', 'One sec...');
		jst.setProperty(option, 'msg', 'A simple warning message here!');
		jst.setProperty(option, 'width', 350);
		jst.setProperty(option, 'height', 'auto');
		jst.setProperty(option, 'padding', '1rem');
		jst.setProperty(option, 'cancelable', true);
		jst.setProperty(option, 'theme', JstOverlay.getTheme());
		
		this.#option = option;
		
		jst.run(() => {
			this.#injectDOM();
			this.#prepare();
			
			this.#updateCloseIcon(0);
			this.#updateTitle();
			this.#updateMsg();
			
			this.#setCloseIconListener();
			this.#setBtnListener();
			
			this.#applyTheme(this.#option.theme === 'dark');
		});
	}
	
	#injectDOM() {
		const alert = `
			<div class="jst-modal" id="${this.#selfId}">
				<div class="jst-modal-d-block">
					<div class="jst-modal-container" style="max-width: 75%; max-height: 75%;">
						<div class="jst-modal-header">
							<h4 id="jst-alert-title"></h4>
							<span class="jst-modal-icon-close" title="Close window"></span>
						</div>
						<div id="jst-alert-msg" class="jst-alert-msg"></div>
						<div class="jst-alert-btn-wrapper">
							<button id="jst-alert-btn-yes" class="jst-btn jst-btn-red">Yes</button>
							<button id="jst-alert-btn-no"  class="jst-btn jst-btn-dark">No</button>
							<button id="jst-alert-btn-ack" class="jst-btn jst-btn-teal">OK</button>
						</div>
					</div>
				</div>
			</div>
		`;
		
		$('body').prepend(alert);
		
		this.#alertDom = $(`#${this.#selfId}`);
		
		this.#closeIcon = jst.getChildOf('.jst-modal-icon-close', this.#alertDom);
		this.#titleEle = jst.getChildOf('#jst-alert-title', this.#alertDom);
		this.#msgEle = jst.getChildOf('#jst-alert-msg', this.#alertDom);
		
		let buttons = jst.getChildrenOf('.jst-alert-btn-wrapper', this.#alertDom);
		this.#btnYes = buttons[0];
		this.#btnNo = buttons[1];
		this.#btnAck = buttons[2];
	}
	
	#prepare() {
		this.#updateBtnVisibility();
		
		// Set the width & height
		let alertContainer = jst.getChildOf('.jst-modal-container', this.#alertDom);
		$(alertContainer).css('width', this.#option.width);
		$(alertContainer).css('height', this.#option.height);
		
		$(this.#msgEle).css('padding', this.#option.padding);
	}
	
	#updateBtnVisibility () {
		// Hide yes & no buttons if it is an acknowledgment alert
		if (!this.#callbackYes && !this.#callbackNo) {
			$(this.#btnYes).hide();
			$(this.#btnNo).hide();
			$(this.#btnAck).show();
		} else {
			$(this.#btnYes).show();
			$(this.#btnNo).show();
			$(this.#btnAck).hide();
		}
	}
	
	#updateCloseIcon(fadeOutTime = 250) {
		if (!this.#option.cancelable) $(this.#closeIcon).fadeOut(fadeOutTime);
		else $(this.#closeIcon).fadeIn(fadeOutTime);
	}
	
	#updateTitle() {
		// Get the alert title
		let title =  this.#option.title;
		$(this.#titleEle).html(title);
	}
	
	#updateMsg () {
		$(this.#msgEle).html(this.#option.msg);
	}
	
	#setCloseIconListener() {
		$(this.#closeIcon).on('click', () => this.dismiss());
	}
	
	#setBtnListener() {
		$(this.#btnYes).on('click', ()  => this.#dispatchBtnEvent(1));
		$(this.#btnNo).on('click',  ()  => this.#dispatchBtnEvent(-1));
		$(this.#btnAck).on('click', ()  => this.#dispatchBtnEvent(0));
	}
	
	#applyTheme(isDark) {
		if (isDark) {
			this.#alertDom.addClass('jst-dark');
		} else {
			this.#alertDom.removeClass('jst-dark');
		}
	}
	
	#show() {
		/*
		 * Alerts can always acquire overlay manager since they are critical!
		 */
		JstOverlay._acquire(this);
		
		$(this.#alertDom).fadeIn(250, () => {
			this.#callbackShown?.(this.#msgEle);
		});
	}
	
	/**
	 * This method is invoked when an alert is in display and users hits the escape button.
	 * JstOverlay calls this method automatically.
	 * <br><b>This method should be called directly.</b>
	 * */
	_handleEscape() {
		if (this.#option.cancelable) this.dismiss();
	}
	
	isIFramedModal = () => false;
	
	getShowOverlay = () => true;
	
	getOpacity = () => -1;
	
	show() {
		if (this.#dismissed) {
			console.warn('Alert already dismissed');
			return;
		}
		
		if (JstOverlay.isReady()) {
			// show after a bit of delay to avoid overlay animation glitch because of caching
			jst.runLater(0.05, () => this.#show());
		} else this.#show();
	}
	
	#dispatchBtnEvent(result) {
		let dismiss;
		
		if (result === 0) {
			dismiss = this.#callbackAck?.() ?? true;
		}
		else if (result === 1) {
			dismiss = this.#callbackYes?.() ?? true;
		}
		else if(this.#callbackNo) {
			dismiss = this.#callbackNo?.() ?? true;
		}
		
		if (dismiss) this.dismiss();
	}
	
	/**
	 * Sets a callback to be notified when user clicks the ok button on the alert
	 *
	 * @param {function() : boolean} callback Function to be invoked. If dismiss the
	 * alert when the callback returns true.
	 * @return JstAlert
	 * */
	yes(callback) {
		this.#callbackYes = callback;
		this.#callbackAck = null;
		
		this.#updateBtnVisibility();
		return this;
	}
	
	/**
	 * Sets a callback to be notified when user clicks the no button on the alert
	 *
	 * @param {function(): boolean} callback Function to be invoked. If dismiss the
	 * alert when the callback returns true.
	 * @return JstAlert
	 * */
	no(callback) {
		this.#callbackNo = callback;
		this.#callbackAck = null;
		
		this.#updateBtnVisibility();
		return this;
	}
	
	/**
	 * Sets a callback to be notified when user clicks the ok button on the alert.
	 *
	 * @param {function(): boolean} callback Function to be invoked. If dismiss the
	 * alert when the callback returns true.
	 * @return JstAlert
	 * */
	acknowledge(callback) {
		this.#callbackAck = callback;
		
		this.#updateBtnVisibility();
		return this;
	}
	
	/**
	 * Sets a callback to be notified when the alert has been dismissed
	 *
	 * @param {function()} callback Function to be invoked
	 * @return JstAlert
	 * */
	onDismiss(callback) {
		this.#callbackDismiss = callback;
		return this;
	}
	
	/**
	 * Sets a callback to be notified when the alert is being shown for the first time
	 *
	 * @param {function(jQuery|any)} callback Function to be invoked
	 * @return JstAlert
	 * */
	onShown(callback) {
		this.#callbackShown = callback;
		return this;
	}
	
	/**
	* Dismisses the alert and removes its DOM from the document.
	* */
	dismiss() {
		if (this.#dismissed) return;
		this.#dismissed = true;
		
		JstOverlay._release(this);
		
		$(this.#alertDom).fadeOut(250, () => {
			// remove the dom
			$(this.#alertDom).remove();
			
			this.#callbackDismiss?.();
		});
	}
	
	/**
	 * Dismisses the alert and removes its DOM from the document.
	 * */
	close () {
		this.dismiss();
	}
	
	/**
	 * Changes the alert message. It can be html or string value
	 *
	 * @param msg {string} Alert message
	 * */
	setMsg(msg) {
		this.#option.msg = msg;
		this.#updateMsg();
	}
	
	/**
	 * Sets the alert title. It can be html or string value
	 *
	 * @param title {string} Alert title
	 * */
	setTitle(title) {
		this.#option.title =  title;
		this.#updateTitle();
	}
	
	/**
	 * Set theme to the alert.
	 *
	 * @param {'light'|'dark'} theme
	 * */
	setTheme(theme) {
		/*
		 * Check if the theme was previously applied!
		 */
		if (this.#option.theme === theme) return;
		
		this.#option.theme = theme;
		
		let dark = theme === 'dark';
		this.#applyTheme(dark);
	}
	
	/**
	 * Changes the cancelable status of the alert
	 * */
	setCancelable(value) {
		this.#option.cancelable = value;
		this.#updateCloseIcon();
	}
	
	/**
	 * Hides the alert button as specified by argument
	 *
	 * @param {'yes' | 'no' | 'ok'} choice
	 * */
	hideChoice(choice) {
		let btn;
		if (choice === 'yes') btn  = this.#btnYes;
		else if (choice === 'no') btn  = this.#btnNo;
		else if (choice === 'ok') btn  = this.#btnAck;
		if (btn) $(btn).fadeOut(250);
	}
	
	/**
	 * Shows the alert button as specified by argument
	 *
	 * @param {'yes' | 'no' | 'ok'} choice
	 * */
	showChoice(choice) {
		let btn;
		if (choice === 'yes') btn  = this.#btnYes;
		else if (choice === 'no') btn  = this.#btnNo;
		else if (choice === 'ok') btn  = this.#btnAck;
		if (btn) $(btn).fadeIn(250);
	}
	
}

(() => {

    class JstConnect {

        #isAsync = false
        #resolve = null

        #url;
        #segments = [];
        #timeout; // number of second for the request to timeout
        #state;
        #status;
        #statusText;

        // Data buffers
        #headers = {};
        #queryParam = {};
        #dataSource = {_raw_data: ''};
        
        // Data that is sent with the request
        #reqData = {};
        
        // Files data
        #formData = null
        
        // Indicates whether to send data-source as JSON
        #keepASJSON = false
        #keepJSONKey = null

        // Buffers the server response.
        // If talking hatish, it will have "response" key trimmed from the
        // json encoded hati server response
        #response;

        // Indicates whether to log the response to the console
        #logResponse = false;

        // Indicates whether it tries to log in json format then falls back to raw text output
        #logAsJson = true;

        // Various callbacks
        #callbackAny;
        #callbackOk;
        #callbackErr;

        #timeoutCallback;
        #unresolvedHost;
        #unknownError;

        #preRedirect;
        #postRun;
        #preRun;

        // Redirection paths and theirs flags
        #anyPath;
        #successPath;
        #errorPath;

        #insDirAny = false;
        #insDirOk = false;
        #insDirErr = false;

        // Variables for toasting
        #noToast = false;
        #toastOnAny = true;
        #autoHideToast = true;
        #toastOnSuccess = false;
        #toastOnError = false;
        #delay = 2;

        // Hati response variables
        #hati = false;
        #hatiMsg;
        #hatiStatus;
        #hatiLevel;

        static HATI_STATUS_SUCCESS = 1;
        static HATI_STATUS_INFO = 2;
        static HATI_STATUS_WARNING = 0;
        static HATI_STATUS_ERROR = -1;
        static HATI_STATUS_UNKNOWN = -2;

        static HATI_LVL_SYSTEM = 0;
        static HATI_LVL_USER = 1;
        static HATI_LVL_UNKNOWN = -2;

        // XHttp state flags
        STATE_REQ_NOT_INITIALIZED = 0;
        STATE_SERVER_CONNECTION_ESTABLISHED = 1;
        STATE_REQ_RECEIVED = 2;
        STATE_REQ_PROCESSING = 3;
        STATE_REQ_FINISH_AND_READY = 4;

        // XHttp status flags
        STATUS_OK = 200;
        STATUS_FORBIDDEN = 403;
        STATUS_PAGE_NOT_FOUND = 404;

        static #contentType = {
            form: 'application/x-www-form-urlencoded',
            json: 'application/json',
            raw: 'text/plain'
        };

        constructor() {
            this.#timeout = 30000;

            this.#timeoutCallback = () => {
                console.warn(`Connection timed out`);
            };
        }

        /**
         * Sets a path to be redirected to after the server response regardless of status/response
         *
         * @param {string} path The path to redirect to
         * @param {boolean} instant Indicates whether to redirect instantly after receiving the response
         * @return {JstConnect}
         * */
        direct(path, instant = false) {
            this.#anyPath = path;
            this.#successPath = null;
            this.#errorPath = null;
            this.#insDirAny = instant;
            return this;
        }

        /**
         * Flags to redirects to the specified path on successful Hati response
         *
         * @param {string} path The path to be redirected to
         * @param {boolean} instant Indicates whether to redirect instantly after receiving the response
         * @return {JstConnect}
         * */
        directSuccess(path, instant = false) {
            this.#anyPath = null;
            this.#successPath = path;
            this.#insDirOk = instant;
            return this;
        }

        /**
         * Flags to redirects to the specified path on error Hati response
         *
         * @param {string} path The path to be redirected to
         * @param {boolean} instant Indicates whether to redirect instantly after receiving the response
         * @return {JstConnect}
         * */
        directError(path, instant = false) {
            this.#anyPath = null;
            this.#errorPath = path;
            this.#insDirErr = instant;
            return this;
        }

        /**
         * Set the callback to be invoked on server response regardless any server
         * response status. This callback can be used as a primary callback for
         * connecting to server which  doesn't talk Hatish.
         * <br>For connection error corresponding callbacks are invoked.
         *
         * @param {function({txt:string, json:object})} callback receives connection
         * result in both raw text format and json format. For json object, it tries
         * to parse the response. If fails then returns null as json value.
         * @return {JstConnect}
         * */
        onAny(callback) {
            this.#callbackAny = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked when the Hati server replied ok response.
         * The callback is invoked for non-hati server, if there is no onAny
         * callback set.
         *
         * @param {function({txt:string, json:object})} callback receives connection
         * result in both raw text format and json format. For json object, it tries
         * to parse the response. If fails then returns null as json value.
         * @return {JstConnect}
         * */
        onOk(callback) {
            this.#callbackOk = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked when the <b>Hati</b> server replied error response
         * <br>
         * This callback is never invoked when JstConnect is decorated with withHati() call. For
         * catching error, use other "on" callback functions such as <b>onTimeout(),
         * onUnresolvedHost()</b> etc.
         *
         * @param {function({txt:string, json:object})} callback receives connection
         * result in both raw text format and json format. For json object, it tries
         * to parse the response. If fails then returns null as json value.
         * @return {JstConnect}
         * */
        onErr(callback) {
            this.#callbackErr = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked before connecting to the server
         *
         * @param {function ()} callback
         * @return {JstConnect}
         * */
        preRun(callback) {
            this.#preRun = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked after receiving server response
         *
         * @param {function ()} callback
         * @return {JstConnect}
         * */
        postRun(callback) {
            this.#postRun = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked before redirection after getting any server response
         *
         * @param {function ()} callback
         * */
        preRedirect(callback) {
            this.#preRedirect = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked on timeout connecting to the server on specified url.
         * Default is 30 seconds.
         *
         * @param {function ()} callback
         * @return {JstConnect}
         * */
        onTimeout(callback) {
            this.#timeoutCallback = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked on encountering unresolved host error
         *
         * @param {function ()} callback
         * @return {JstConnect}
         * */
        onUnresolvedHost(callback) {
            this.#unresolvedHost = callback;
            return this;
        }

        /**
         * Sets the callback to be invoked when any unknown error happened
         *
         * @param {function ()} callback
         * @return {JstConnect}
         * */
        onUnknownError(callback) {
            this.#unknownError = callback;
            return this;
        }

        /**
         * Does further the processing after server replied, and extract Hati API related information accordingly.
         * Also display any Toast was sent by Hati.
         *
         * @return {JstConnect}
         * */
        withHati() {
            this.#hati = true;
            return this;
        }

        #callbackMediator(response) {
            this.#response = response;

            if (!this.#hati) {
                this.#noToast = true;

                /*
                 * Check if http response code starts with 4 or 5 to consider it error!
                 * */
                let firstDigit = this.#status.toString()[0];
                let result = !['4', '5'].includes(firstDigit);

                this.#invokeRedirect(result);
                this.#invokeCallback(result);
                return;
            }

            // validate response for hati & store the response
            try {
                this.#response = JSON.parse(response);
                this.#hatiMsg = this.#response.response['msg'];
                this.#hatiStatus = this.#response.response['status'];

                if (this.#response.response['delay_time'] !== undefined)
                    console.warn('Hati is running in development mode');
            } catch (error) {
                this.#resetHati();
                console.error(`${this.#hatiMsg} ${error.message}.\nResponse: ${this.#response}`);
                this.#invokeCallback(false);
                return;
            }

            let success = this.#hatiStatus === JstConnect.HATI_STATUS_SUCCESS;

            this.#invokeRedirect(success);

            // after any redirection if we are still here yet, then invoke callbacks accordingly
            this.#invokeCallback(success);

            // if no toast then we don't go any further down here
            if (this.#noToast) return;

            // handle sticky toast
            if (!this.#autoHideToast) {
                JstToast.show(this.#hatiStatus, this.#hatiMsg, false);
                this.#directAfterToast(success);
                return;
            }

            if (this.#toastOnAny) {
                // here we know it is toast for all types of flags.
                this.#showToast(success);
            } else {
                // show toast only it is either success or error
                if (this.#toastOnSuccess && success) this.#showToast(true);
                else if (this.#toastOnError && !success) this.#showToast(false);
            }
        }

        #invokeRedirect(success) {
            // firstly process any redirection based on no-toast or instant redirection
            if ((this.#insDirAny || this.#noToast) && this.#anyPath) JstConnect.redirect(this.#anyPath);
            if ((this.#insDirOk || this.#noToast) && success) JstConnect.redirect(this.#successPath);
            if ((this.#insDirErr || this.#noToast) && !success) JstConnect.redirect(this.#errorPath);
        }

        #invokeCallback(success) {
            if (this.#callbackAny != null) {
                this.#callbackAny(this.#decorateRes());
            }
            else {
                if (success && this.#callbackOk != null) this.#callbackOk(this.#decorateRes());
                if (!success && this.#callbackErr != null) this.#callbackErr(this.#decorateRes());
            }

            if (this.#postRun) this.#postRun();
        }

        #decorateRes() {
            return {
                txt: this.responseRaw(),
                json: (() => {
                    let x = this.response();
                    return typeof x === 'object' ? x : null
                })()
            }
        }

        #resetHati() {
            this.#hatiStatus = JstConnect.HATI_STATUS_UNKNOWN;
            this.#hatiLevel = JstConnect.HATI_LVL_UNKNOWN;
            this.#hatiMsg = `Server didn't talk Hatish.`;
        }

        #directAfterToast(success) {
            if (this.#anyPath) this.#direct(this.#anyPath);
            else {
                if (success) this.#direct(this.#successPath);
                else this.#direct(this.#errorPath);
            }
        }

        #direct(path) {
            if (this.#preRedirect) this.#preRedirect();
            JstConnect.redirect(path);
        }

        #showToast(success) {
            JstToast.show(this.#hatiStatus, this.#hatiMsg, true, () => {
                this.#directAfterToast(success);
            }, this.#delay);
        }

        #hit(as, method) {
            as = as.toLowerCase();
            if (!JstConnect.#contentType.owns(as))
                throw new Error(`The argument 'as' must be one of these: form, json, raw`);

            let url = this.#prepareUrl();
            url = JstConnect.#removeExtraSign(url);

            if (!this.#formData) {
                // Otherwise it would interfere with file upload!
                this.header('Content-Type', JstConnect.#contentType[as]);
            }

            if (['json', 'form'].owns(as)) {
                delete this.#dataSource['_raw_data'];
            }

            let data;
            
            if (this.#formData) {
                if (this.#keepASJSON) {
                    this.#formData.append(this.#keepJSONKey ?? 'json', JSON.stringify(this.#dataSource));
                } else {
                    for (let i in this.#dataSource) {
                        this.#formData.append(i, this.#dataSource[i]);
                    }
                }
                
                data = this.#formData;
            } else {
                if (as === 'json') {
                    data = JSON.stringify(this.#dataSource);
                } else if (as === 'form') {
                    data = JstConnect.parameterize(this.#dataSource);
                } else {
                    data = JSON.stringify(this.#dataSource['_raw_data']);
                }
            }
            
            // Cache the request data
            this.#reqData = data;

            if (this.#preRun) this.#preRun();

            let jqxhr = $.ajax({
                url: url,
                method: method,
                crossDomain: true,
                timeout: this.#timeout,
                contentType: false,
                headers: this.#headers,
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                processData: false
            });

            jqxhr.done((data, textStatus, jqXHR) => {
                this.#handle(jqXHR, textStatus);
            });

            jqxhr.fail((jqXHR, textStatus) => {
                this.#handle(jqXHR, textStatus);
            });
        }

        #handle(jqXHR, textStatus) {
            this.#state = jqXHR.readyState;
            this.#status = jqXHR.status;
            this.#statusText = textStatus;

            // log the response
            if (this.#logResponse) {
                let data = jqXHR.responseText ?? '';
                if(data.length === 0) {
                    console.info(`Nothing to log`);
                } else if (!this.#logAsJson) {
                    console.log(data);
                } else {
                    try {
                        console.log(JSON.parse(data));
                    } catch {
                        console.log(data);
                    }
                }
            }

            if (this.#status === this.STATUS_PAGE_NOT_FOUND) {
                if (this.#unresolvedHost != null) this.#unresolvedHost();
            } else if (this.#statusText === 'timeout') {
                if (this.#timeoutCallback != null) this.#timeoutCallback();
            } else {
                this.#callbackMediator(jqXHR.responseText);
            }

            if (this.#isAsync && this.#resolve) {
                this.#resolve();

                this.#isAsync = false;
                this.#resolve = null;
            }
        }

        /**
         * Removes the & and ? marks if it is happened to be
         * */
        static #removeExtraSign(url) {
            if (url.endsWith('&')) url = url.substring(0, url.length - 1);
            if (url.endsWith('?')) url = url.substring(0, url.length - 1);
            return url;
        }

        #prepareUrl() {
            let url = this.#url;

            if (this.#segments.length > 0) {
                if (!url.endsWith('/')) url += '/';

                url += this.#segments.join('/');
            }

            url = url + '?'
            Object.entries(this.#queryParam).forEach(([k, v]) =>
                url += `${k}=${v}&`
            )

            return url;
        }

        /**
         * Sets the Toast to be sticky when Hati send in a toast
         *
         * @return {JstConnect}
         * */
        stickyToast() {
            this.#autoHideToast = false;
            return this;
        }

        /**
         * Sets flag to not show any toast sent by Hati
         *
         * @return {JstConnect}
         * */
        noToast() {
            this.#noToast = true;
            return this;
        }

        /**
         * Flags to show only Success response by Hati
         *
         * @return {JstConnect}
         * */
        toastSuccess() {
            this.#toastOnAny = false;
            this.#toastOnSuccess = true;
            return this;
        }

        /**
         * Flags to show only Error response by Hati
         *
         * @return {JstConnect}
         * */
        toastError() {
            this.#toastOnAny = false;
            this.#toastOnError = true;
            return this;
        }

        /**
         * Sets the duration for toast to be shown
         *
         * @return {JstConnect}
         * */
        toastTime(time) {
            this.#delay = time;
            return this;
        }

        /**
         * Logs the response for the connection to the console.
         * @param {boolean} asJson When true, it tries to log response as JSON object. If fails then falls back
         * to text output.
         * @return {JstConnect}
         * */
        logResponse(asJson = true) {
            this.#logResponse = true;
            this.#logAsJson = asJson;
            return this;
        }

        /**
         * Sets timeout for connection
         *
         * @param {int} ms Number of milliseconds
         * @return {JstConnect}
         * */
        timeout(ms) {
            this.#timeout = ms;
            return this;
        }

        /**
         * Makes a GET request to the specified url. It ignores the raw data.
         *
         * @param {'form'|'json'} as The Content-Type header is set accordingly when data is sent
         * @throws {Error} When as argument is set as raw data
         * */
        get(as = 'form') {
            as = as.toLowerCase();
            if (!['form', 'json'].owns(as))
                throw new Error('The argument as must be one of these: form, json');

            delete this.#dataSource._raw_data;

            // serialize the data source
            let url = this.#prepareUrl();
            this.#reqData = '';
            
            Object.entries(this.#dataSource).forEach(([k, v]) => {
                let data = `${k}=${v}&`;
                
                this.#reqData += data;
                url += data;
            });
            
            url = JstConnect.#removeExtraSign(url);
            
            /*
             * Remove extra # sign from data
             * */
            if (this.#reqData.endsWith('&')) {
                this.#reqData = this.#reqData.substring(0, this.#reqData.length - 1);
            }

            this.header('Content-Type', JstConnect.#contentType[as]);

            if (this.#preRun) this.#preRun();

            let jqxhr = $.ajax({
                url: url,
                method: 'GET',
                crossDomain: true,
                timeout: this.#timeout,
                contentType: false,
                headers: this.#headers,
                xhrFields: {
                    withCredentials: true
                },
                processData: false
            });

            jqxhr.done((data, textStatus, jqXHR) => {
                this.#handle(jqXHR, textStatus);
            });

            jqxhr.fail((jqXHR, textStatus) => {
                this.#handle(jqXHR, textStatus);
            });
        }

        /**
         * Async version of {@link JstConnect.get()}. Callbacks which have been added
         * using on** methods will always run in order first, before the promise is
         * considered fulfilled.
         *
         * @param {'form'|'json'} as The Content-Type header is set accordingly when data is sent
         * @throws {Error} When as argument is set as raw data
         *
         * */
        async getAsync(as = 'form') {
            return new Promise((resolve) => {
                this.#isAsync = true;
                this.#resolve = resolve;

                this.get(as);
            });
        }

        /**
         * Makes a POST request to the specified url. If there is any files already attached with this request
         * using {@link files()} method, then 'Content-Type' header will be ignored and any JSON data will
         * be sent as key-value pairs form-data. The encoding and required headers will be handled by browser.
         *
         * <br>
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         * */
        post(as = 'form') {
            this.#hit(as, 'POST');
        }

        /**
         * Async version of {@link JstConnect.post()}. Callbacks which have been added
         * using on** methods will always run in order first, before the promise is
         * considered fulfilled. Promise is always resolved, not rejected!<br>
         * If there is any files already attached with this request using {@link files()}
         * method, then 'Content-Type' header will be ignored and any JSON data will be sent
         * as key-value pairs form-data. The encoding and required headers will be handled
         * by browser.
         *
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         * */
        postAsync(as = 'form') {
            return new Promise((resolve) => {
                this.#isAsync = true
                this.#resolve = resolve

                this.#hit(as, 'POST');
            })
        }

        /**
         * Makes a PUT request to the specified url.
         * <br>
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         * */
        put(as = 'json') {
            this.#hit(as, 'PUT');
        }

        /**
         * Async version of {@link JstConnect.put()}. Callbacks which have been added
         * using on** methods will always run in order first, before the promise is
         * considered fulfilled. Promise is always resolved, not rejected!<br>
         *
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         *
         * */
        putAsync(as = 'json') {
            return new Promise((resolve) => {
                this.#isAsync = true
                this.#resolve = resolve

                this.#hit(as, 'PUT');
            })
        }

        /**
         * Makes a DELETE request to the specified url.
         * <br>
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         * */
        delete(as = 'json') {
            this.#hit(as, 'DELETE');
        }

        /**
         * Async version of {@link JstConnect.delete()}. Callbacks which have been added
         * using on** methods will always run in order first, before the promise is
         * considered fulfilled. Promise is always resolved, not rejected!<br>
         *
         * For as argument data will be sent as:
         * <br>json -- JSON object as part of request body
         * <br>form -- x-www-form-urlencoded as part of the request body
         * <br>raw  -- raw as part of the request body. Use raw() function to add data.
         *
         * @param {'form'|'json'|'raw'=} as The Content-Type header is set accordingly when data is sent
         *
         * */
        deleteAsync(as = 'json') {
            return new Promise((resolve) => {
                this.#isAsync = true
                this.#resolve = resolve

                this.#hit(as, 'DELETE');
            })
        }

        /**
         * Sets the url the connection is going to be made to
         *
         * @param {string} url API url
         * @return {JstConnect}
         * */
        to(url) {
            this.#url = url;
            return this;
        }

        /**
         * Any header can be added to the request.
         *
         * @param {string} key Header key
         * @param {string} value Header value
         * @return {JstConnect}
         * */
        header(key, value) {
            this.#headers[key] = value;
            return this;
        }

        /**
         * Sends as raw data as part of request body
         *
         * @param {string|number} data Any value to be sent as a raw data
         * @return {JstConnect}
         * */
        raw(data) {
            if (typeof data === 'object')
                throw new Error(`Data of type Object can't be processed as raw data`);

            this.#dataSource['_raw_data'] += data;

            return this;
        }

        /**
         * Any html form data can be sent using this method. The form argument
         * can either be an id(with/without # sign) or the form object.
         *
         * @param {string|HTMLFormElement} form The form to be sent as body of the request
         * @return {JstConnect}
         * */
        form(form) {
            if (typeof form == 'string') {
                let id = form.startsWith('#') ? form.substring(1) : form;
                form = document.getElementById(id);
            }

            if (typeof form != 'object' && !$(form).is('form'))
                throw new Error('Argument must be a form or an id to form');

            // collect the form data as json
            let data = $(form).serializeArray();
            data.forEach((obj) => this.#dataSource[obj.name] = obj.value);

            return this;
        }

        /**
         * Any json object can be sent as part get or post data. For get request
         * the object's key-value pair translates into encoded url query param.
         *
         * @param {string|object} data The JSON data either in object or string form
         * @return {JstConnect}
         * */
        json(data) {
            if (typeof data === 'string') data = JSON.parse(data);

            Object.keys(data).forEach((key) =>
                this.#dataSource[key] = data[key]
            );

            return this;
        }
        
        /**
         * Submits any files with the request. When a FormData is set, it will ignore
         * 'Content-Type' header and allow browser to handler form data encoding with
         * proper content type.
         * <br>
         * Data source object is sent as key-value pairs (form-data) and raw data-source
         * is ignored. To keep the data source as JSON stringify object, make a call to
         * {@link sendDataSourceAsJSON} method.
         *
         * @param {FormData} data The data to be sent as part of request
         * @return {JstConnect}
         * */
        files(data) {
            this.#formData = data
            return this
        }
        
        /**
         * When any file is attached using {@link files} method to the request,
         * JstConnect ignores 'Content-Type' for sending request data as JSON stringify object
         * and whatever the data source object holds will be sent as key-value pairs (form-data)
         * to allow the browser to take care of setting proper form-data encoding & content
         * type. However, this method instructs JstConnect to keep the data source as stringify object
         * as send it under the specified key.
         *
         * @param {string} key The key to send the data under. 'json' is the default key
         * @return {JstConnect}
         * */
        sendDataSourceAsJSON(key = 'json') {
            this.#keepJSONKey = key
            this.#keepASJSON = true
            return this
        }

        /**
         * Sets query parameter to the url
         *
         * @param {string} key The parameter name
         * @param {string|number} value The parameter value
         * @return {JstConnect}
         * */
        queryParam(key, value) {
            this.#queryParam[key] = value;
            return this;
        }

        /**
         * Add segments to URL path
         *
         * @param {string|number} value The segment value
         * @return {JstConnect}
         * */
        segment(value) {
            this.#segments.push(value)
            return this
        }

        /**
         * Returns the ajax connection status
         *
         * @return {number}
         * */
        get conStatus() {
            return this.#status;
        }

        /**
         * Returns the ajax connection message
         *
         * @return {string}
         * */
        get conStatusTxt() {
            return this.#statusText;
        }

        /**
         * Returns the message sent by Hati server
         *
         * @return {string} Message sent by Hati.
         * */
        get msg() {
            return this.#hatiMsg;
        }

        /**
         * Returns the status sent by Hati server
         *
         * @return {number} Status sent by Hati.
         */
        get status() {
            return this.#hatiStatus;
        }

        /**
         * Returns the level sent by Hati server
         *
         * @return {number} Level sent by Hati.
         */
        get level() {
            return this.#hatiLevel;
        }

        /**
         * Returns the response in JSON format
         *
         * @return {?object} JSON decoded response
         * */
        response() {
            if (this.#response === 'null') return null;

            if (typeof this.#response === 'object') return this.#response;

            try {
                return JSON.parse(this.#response);
            } catch {
                return null;
            }
        }

        /**
         * Returns the response in raw format
         *
         * @return {string} Response in raw textual format as replied by the server
         * */
        responseRaw() {
            return typeof this.#response === 'object' ? JSON.stringify(this.#response) : this.#response;
        }

        /**
         * Returns whether the connection was made successfully and the server has replied OK
         *
         * @return {boolean} True if the connection state is FINISH_AND_READY and status is OK, false otherwise
         * */
        serverReplied() {
            return this.#state === this.STATE_REQ_FINISH_AND_READY && this.#status === this.STATUS_OK;
        }

        /**
         * Returns whether Hati server has responded
         *
         * @return {boolean} True if hati functioned & responded correctly, false otherwise.
         * */
        hatiResponse() {
            return this.serverReplied() && this.#hatiLevel !== JstConnect.HATI_LVL_UNKNOWN;
        }

        /**
         * Returns whether the outcome of this connection was successful, reported by server
         * header response with either 200 or 204 code. If it is a hati server response, then
         * it will do further check for the status value found in the response object.
         *
         * @param {number} code Hati status code to match found in the response object. 0, 1 & 2 are
         * considered a successful hati response by default.
         * @return {boolean} True if the connection meets the conditions above, false otherwise.
         * */
        isOk (...code) {
            let firstDigit = this.#status.toString()[0]
            let failed = ['4', '5'].includes(firstDigit)

            if (failed) return false

            if (!this.#hati) return true

            if (code.length === 0) code = [0, 1, 2]

            return code.includes[this.status]
        }

        /**
         * On getting an HTTP response code starting with either 4 or 5 is considered an error.
         * If it passes that condition, it is then checked if the connection was made to a hati
         * server. If so, then hati status code is also evaluated to see it was -1.
         *
         * @return {boolean} True if the connection meets the conditions above, false otherwise.
         * */
        isErr () {
            let firstDigit = this.#status.toString()[0]
            let notErr = !['4', '5'].includes(firstDigit)

            if (notErr) return false

            if (!this.#hati) return true

            return this.status === -1
        }

        /**
         * Runs a callback if the connection returned a successful response which particularly doesn't start
         * with 4, 5 and in case of a response from hati server then also it is not status -1.
         *
         * @param {function({txt:string, json:object})} callback receives connection
         * result in both raw text format and json format. For json object, it tries
         * to parse the response. If fails then returns null as json value.
         * */
        ifOk (callback) {
            if (!this.isOk()) return
            callback(this.#decorateRes())
        }

        /**
         * Runs a callback if the connection was unsuccessful meaning the HTTP response code started
         * with 4, 5 or in case of a response from hati server then also it is status -1.
         *
         * @param {function({txt:string, json:object})} callback receives connection
         * result in both raw text format and json format. For json object, it tries
         * to parse the response. If fails then returns null as json value.
         * */
        ifErr (callback) {
            if (!this.isErr()) return
            callback(this.#decorateRes())
        }
        
        get reqData () {
            return this.#reqData;
        }

        static parameterize(obj) {
            let string = '';
            for (const key in obj) {
                string += `${key}=${obj[key]}&`;
            }
            return string.substring(0, string.length - 1);
        }

        static redirect(path) {
            if (!path) return;
            window.location = path;
        }

    }

    window.JstConnect = () =>  new JstConnect();
    
    /**
     * Retrieves a query parameter or path segment from the current URL.
     *
     * @param {string | number} keyOrPos - When `what` is `'query'`, this is the name of the query parameter to retrieve.
     *                                     When `what` is `'path'`, this is the 1-based position of the path segment to retrieve.
     * @param {string} [what='query'] - Specifies the type of data to retrieve:
     *                                  - `'query'`: retrieves a query parameter by name.
     *                                  - `'path'`: retrieves a path segment by position.
     * @param {*} [defValue=null] - The default value to return if the query parameter or path segment is not found.
     *
     * @returns {*} - The value of the specified query parameter or path segment.
     *                Returns `defValue` if the specified key or position is not found.
     *
     * @example
     * // Example 1: Retrieve a query parameter
     * // URL: https://example.com?page=3
     * getUrl('page'); // Returns: '3'
     *
     * @example
     * // Example 2: Retrieve a path segment
     * // URL: https://example.com/products/electronics
     * getUrl(2, 'path'); // Returns: 'electronics'
     */
    window.JstConnect.getUrl = (keyOrPos, what = 'query', defValue = null) => {
        if (what === 'query') {
            // Parsing query parameters using URLSearchParams
            const params = new URLSearchParams(window.location.search);
            return params.get(keyOrPos) ?? defValue;
        } else if (what === 'path') {
            // Handling URL path segments
            const segments = window.location.pathname.replace(/^\//, '').split('/');
            // Adjusting position to 0-based index
            const position = parseInt(keyOrPos, 10) - 1;
            return segments[position] ?? defValue;
        } else {
            return defValue;
        }
    };

    /**
     * Helper function, transfers key-value pair data into query parameters format
     *
     * @param {object} obj JSON object key-value pair to convert to query parameters
     * @returns {string} Query parameterized string
     * */
    window.JstConnect.parameterize = (obj) => JstConnect.parameterize(obj);

    /**
     * Redirects to specified path. Performs checks if the path is defined.
     *
     * @param {string} path
     * */
    window.JstConnect.redirect = (path) => JstConnect.redirect(path);

})();
/**
 * Web forms are very verbose in taking user inputs. This class can greatly simplify
 * the form validations with nice and easy coding. Each element is marked with an ID or
 * name(where the input type is radio) and elements are registered via the constructor by
 * object.
 * */
class JstFormInspector {
	
	/*
	 * Predefined regular expression patterns for filtering input in various formats.
	 * This list has a useful pattern which can be used in general for any project.
	 * However, any required pattern can be passed as an argument to the object using
	 * the key 'Pattern'.
	 *
	 * In the naming of these constants, they have meaning like regular expression.
	 * A    = Alphabets(including capital & small letters)
	 * N    = Numbers
	 * AN   = Alphabets & Numbers
	 * S    = Space
	 * C    = Comma
	 * D    = Dot
	 *
	 * When you use any of these pattern, they will remove any other characters except the
	 * mentioned characters in the pattern names.
	 */
		
	/**
	 * a-z, A-Z
	 * */
	static SAN_A = /[a-zA-Z]/g ;
	
	/*
	 * 0-9
	 * */
	static SAN_N = /[0-9]/g;
	
	/*
	 * a-z, A-Z, 0-9
	 * */
	static SAN_AN = /[a-zA-Z0-9]/g;
	
	/*
	 * a-z, A-Z, spaces
	 * */
	static SAN_AS = /[a-zA-Z\s]/g;
	
	/*
	 * a-z, A-Z, commas
	 * */
	static SAN_AC = /[a-zA-Z,]/g;
	
	/*
	 * a-z, A-Z, dots
	 * */
	static SAN_AD = /[a-zA-Z.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces
	 * */
	static SAN_ANS = /[a-zA-Z0-9\s]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas
	 * */
	static SAN_ASC = /[a-zA-Z\s,]/g;
	
	/*
	 * a-z, A-Z, 0-9, dots
	 * */
	static SAN_AND = /[a-zA-Z0-9.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas
	 * */
	static SAN_ANSC = /[a-zA-Z0-9\s,]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, dots
	 * */
	static SAN_ANSD = /[a-zA-Z0-9\s.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas, dots
	 * */
	static SAN_ANSCD = /[a-zA-Z0-9\s,.]/g;
	
	/**
	 * ISO date format YYYY-MM-DD
	 * */
	static SAN_ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;
	
	/**
	 * ISO time format HH:MM:SS
	 * */
	static SAN_ISO_TIME = /(\d{2}:\d{2}:\d{2})/g;
	
	#option;
	
	// Form dom
	#form;
	
	// Flags if the form submission came from one of non-designated buttons
	#fromUnauthorized = false;
	
	// Indicates whether the form inputs are resolved and ready to be submitted
	#canSubmit = true;
	
	// Holds the configuration info for each element
	#eleConfigArr = [];
	
	#iconOk = '&#10004;';
	#iconErr = '&#10060;';
	
	// Callback invoked when validation is done and ready for consumer code
	#validationConsumer;
	
	// Default validation handler callback
	#validationHandler = (success, eleConfig) => {
		if (this.#option.resettingForm) {
			return;
		}
		
		let inline =  eleConfig.owns('inline') ? eleConfig.inline : this.#option.inline;
		let icon = success ? this.#iconOk : this.#iconErr;
		
		// add the msg element if we have none
		let haveNextEle = $(eleConfig.ele).next().hasClass('jst-form-msg');
		let havePositionedEle = eleConfig.owns('msgPos');
		
		if (!haveNextEle || havePositionedEle) {
			let msgEle = `<div class="jst-form-msg"><span></span> <span></span></div>`;
			
			// add the message element accordingly
			if(havePositionedEle) $(`#${eleConfig['msgPos']}`).html(msgEle);
			else $(eleConfig.ele).after(msgEle);
		}
		
		// update the nextEle to newly inserted one since we have just updated
		let nextEle = havePositionedEle ? $('#' + eleConfig['msgPos']) : $(eleConfig.ele).next();
		
		if (success && this.#option.feedbackErrOnly) {
			nextEle.hide();
			return;
		} else {
			nextEle.show();
		}
		
		/*
		 * Update the icon, message and the color class
		 */
		let spans = $(nextEle).find('span');
		let iconSpan = spans[0];
		let msgSpan = spans[1];
		
		if (eleConfig.owns('showIcon') ? eleConfig.showIcon : this.#option.showIcon) {
			$(iconSpan).html(icon);
		}
		
		if (eleConfig.owns('showMsg') ? eleConfig.showMsg : this.#option.showMsg) {
			$(msgSpan).html(eleConfig.msg);
		}
		
		let addColorCls = success	? 'jst-form-msg-success' : 'jst-form-msg-error';
		$(nextEle)
			.removeClass('jst-form-msg-error jst-form-msg-success')
			.addClass(addColorCls);
		
		// make sure the message element is shown; it could be made hidden by reset function
		$(nextEle).css('display', inline ? 'inline' : 'block');
	};
	
	/**
	 *
	 * @param {string|object} form The form id or the form object.
	 *
	 * @param {object} option
	 * @param {boolean=false} option.inline When true input validation feedback is shown next to input as inline html element otherwise
	 * 										shown as block level element
	 * @param {boolean=true} option.showIcon Whether to show icon on feedback handled by default validation handler.
	 * @param {boolean=true} option.showMsg Whether to show feedback message if validation handled by default validation handler.
	 * @param {boolean=false} option.feedbackErrOnly Whether to show validation error feedback message to the user.
	 * @throws {Error} If the form element can't be found
	 * */
	constructor(form, option = {}) {
		// Indicated whether the feedback message should be inline or block level element
		jst.setProperty(option, 'inline', false);
		
		jst.setProperty(option, 'showIcon', true);
		jst.setProperty(option, 'showMsg', true);
		jst.setProperty(option, 'feedbackErrOnly', false);
		
		// Indicates if the form has already been attempted to be submitted
		option['firstSubmission'] = true;
		
		this.#option = option;
		
		// First make sure we have found the form to work with
		if(!$(form).is('form') && typeof form !== 'string') {
			throw new Error('Argument form must be an id or a reference to a form');
		}
		
		this.#form = jst.eleById(form);
		
		if (jst.isUndef(this.#form) || this.#form === null) {
			throw new Error(`Failed to find the form`);
		}
		
		// Prevent the form submission automatically and hook to validate method to validate inputs
		let formJQ = $(this.#form);
		formJQ.submit((evt) => {
			evt.preventDefault();
			this.validate();
		});
		
		/*
		 * Clicking on buttons with `data-jst-form-submitter` attribute
		 * can submit the form automatically
		 */
		formJQ
			.find(`input[type="submit"]:not([data-jst-form-submitter]), button:not([data-jst-form-submitter])`)
			.click(() => {
				this.#fromUnauthorized = true;
			});
		
		formJQ
			.find('input[data-jst-form-submitter], button[data-jst-form-submitter]')
			.click(() => {
				this.#fromUnauthorized = false;
			});
	}
	
	/**
	 * Form element is identified by id. ID can be separated by '-' so that it
	 * can be split into capitalized word for nice feedback message
	 *
	 * @param {object} eleConfig
	 * @return {string}
	 * */
	static #getEleName(eleConfig) {
		if (eleConfig.owns('alias')) return eleConfig.alias;
		
		let value = eleConfig.id || eleConfig.name;
		value = value.replaceAll(/-/g, ' ');
		return value.capitalize(true);
	}
	
	/**
	 * Form element can be of various types such as input, select, textarea etc.
	 * This method can detect these types and return the value based on types.
	 *
	 * @param {object} eleConfig
	 * @return {boolean|string|number}
	 * */
	static #getValue(eleConfig) {
		let type = $(eleConfig.ele).attr('type');
		
		if (type === 'radio') {
			return $(`input[name="${eleConfig.name}"]:checked`).val();
		} else if (type === 'checkbox') {
			return $(eleConfig.ele).is(":checked") ? $(eleConfig.ele).val() : false;
		} else return $(eleConfig.ele).val();
	}
	
	/**
	 * Adds rules to perform validation on specified element
	 *
	 *
	 * @param {object|array}                    rules Rules the form is validated against. Each rule is an object
	 * 												  specifying the filters
	 * @param {string}                          rules.id id of the form element
	 * @param {'str'|'int'|'float'|'email'}     rules.type the type of the data must be provided in
	 * @param {string=}                         rules.name 'name to the radio input
	 * @param {number=}                         rules.min the min value
	 * @param {number=}                         rules.max the max value
	 * @param {number=}                         rules.minLen the minimum length
	 * @param {number=}                         rules.maxLen the maximum length
	 * @param {boolean=}                        rules.inline indicates to show feedback as inline
	 * @param {string=}                         rules.msgPos id of where to show the feedback message div
	 * @param {string=}                         rules.alias friendly name to be shown to call the element in feedback message
	 * @param {string=}                         rules.pattern any Form pattern constant or custom patter to match
	 * @param {number=}                         rules.place the floating fractional place length
	 * @param {array=}                          rules.option array containing the permitted options for the input
	 * @param {boolean=}                        rules.showIcon whether to show icon on feedback if handled by default validation handler. Default is true.
	 * @param {boolean=}                        rules.showMsg whether to show feedback message if handled by default validation handler. Default is true.
	 * */
	addRule(...rules) {
		// unpack the objects
		if (Array.isArray(rules[0])) rules = rules[0];
		
		rules.forEach((rule) => {
			// Get the form input element and see if it is defined
			let ele = $(this.#form).find(`#${rule.id}`)[0];
			
			if (jst.isUndef(ele) && rule.owns('name'))
				ele =  $(this.#form).find(`[name=${rule.name}]`);
			
			if (jst.isUndef(ele)) {
				console.warn('Element with no identity(id/name) has been skipped');
				return;
			}
			
			// Add the form element to the object
			rule['ele'] = ele;
			
			rule['ok'] = false;
			rule['lastCheckPassed'] = true;
			rule['key'] = rule.id || rule.name;
			
			// Holds last error handled by validationHandler callback
			rule['msg'] = null;
			
			// Indicates if the element previously had errors
			rule['dirty'] = false;
			
			this.#addListener(rule);
			
			// Store ref to all the passed ele configurations after setup
			this.#eleConfigArr.push(rule);
		});
	}
	
	/**
	 * Resets the form inputs. Optionally it can hide input error/feedback message divs.
	 * */
	resetForm() {
		this.#form?.reset();
		
		this.#option.firstSubmission = true;
		this.#option.resettingForm = true;
		
		let formJQ = $(this.#form);
		
		// Reset element config data
		for (let eleConfig of this.#eleConfigArr) {
			eleConfig.ok = false;
			eleConfig.msg = null;
			eleConfig.dirty = false;
			eleConfig.lastCheckPassed = true;
			
			let msgEle;
			
			if (eleConfig.owns('msgPos')) {
				msgEle = $(`#${eleConfig.msgPos}`);
			} else if (eleConfig.owns('id')) {
				msgEle = formJQ.find(`#${eleConfig.id} + .jst-form-msg`);
			}
			
			msgEle?.css('display', 'none');
			
			/*
			 * If validation feedback handler is custom one, then allow them
			 * to reset the form UI be at initial state!
			 * */
			eleConfig.reset = true;
			this.#validationHandler(null, eleConfig);
			delete eleConfig.reset;
		}
		
		this.#option.resettingForm = false;
	}
	
	/**
	 * Submits the form to action set on the form.
	 *
	 * This method can be useful because FormInspector prevents the default
	 * form submission behaviour in order to validate the form inputs.
	 * */
	submit() {
		if (this.#fromUnauthorized) return;
		
		// Disable our submit listener first!
		$(this.#form).off('submit');
		
		// Then submit it
		$(this.#form).submit();
		
		// Prepare if submission failed somehow!
		$(this.#form).on('submit');
	}
	
	/**
	 * It checks all the inputs against the rules set.
	 *
	 * @param {boolean=true} submitOnPass Whether to submit the form on validation pass
	 * */
	validate(submitOnPass = true) {
		/*
		 * Stop validating if it came from an unauthorized button!
		 * And prepare for next time!
		 */
		if (this.#fromUnauthorized) {
			this.#fromUnauthorized = false;
			return;
		}
		// say, we can submit the form
		this.#canSubmit = true;
		
		this.#eleConfigArr.forEach(ele => {
			if (jst.isUndef(ele.ele)) return;
			
			this.#filter(ele);
			
			if (this.#canSubmit) this.#canSubmit = ele.ok;
		});
		
		// Form is no longer submitted as a first timer next time!
		this.#option.firstSubmission = false;
		
		// Stop if it is set not to submit!
		if (this.#canSubmit && !submitOnPass) {
			return this.#canSubmit;
		}
		
		/*
		 * If no one cares about the validation outcome, then submit the form!
		 * Otherwise notify them!
		 * */
		if (!this.#validationConsumer && this.#canSubmit) {
			this.submit();
		} else {
			this.#validationConsumer?.(this.#canSubmit);
		}
		
		return this.#canSubmit;
	}
	
	/**
	 * Sets a custom validation handler which will be invoked on form submit or as user interacts with the
	 * form elements.
	 *
	 * Callback functions receives 2 arguments. A boolean indicating if validation passed, followed by the
	 * element's validation config object which has `msg` property telling about the inspector's feedback.
	 *
	 * Importantly, config object will have a property called 'reset' , if the form is being reset allowing
	 * the callback to put the element at initial state.
	 *
	 * @param {function (status:boolean, config:object)} fn
	 * */
	setFeedbackHandler = (fn) => {
		this.#validationHandler = fn;
	}
	
	/**
	 * Add various types of listeners such as keyup, blur based on the form element type.
	 * It can also perform any needed logic before handing over the listener callback
	 * function to verify the input.
	 *
	 * @param {object} eleConfig
	 * */
	#addListener(eleConfig) {
		let ele = eleConfig.ele;
		let nodeName = $(ele).prop('nodeName').toLowerCase();
		let eleType = $(ele).attr('type');
		
		$(ele).on('blur', () => {
			this.#filter(eleConfig);
			
			/*
			 * Flag on blur whether the validation passed!
			 * If so, then we would allow users modifying input without distracting
			 * with feedback message!
			 * */
			eleConfig.lastCheckPassed = eleConfig.ok;
		});
		
		if (eleType === 'radio' || eleType === 'checkbox' || nodeName === 'select') {
			$(ele).change(() => this.#filter(eleConfig) );
		} else {
			$(ele).keyup(() => {
				/*
				 * No distracting user with feedback message!
				 */
				if (eleConfig.lastCheckPassed) return;
				
				this.#filter(eleConfig);
			});
		}
	}
	
	#filter = (eleConfig) => {
		let nodeName = $(eleConfig.ele).prop('nodeName').toLowerCase();
		let filterType = eleConfig.type;
		let inputType = $(eleConfig.ele).attr('type');
		
		let ok;
		
		// stop from selecting first option of the select input
		if (nodeName === 'select') {
			if(JstFormInspector.#getValue(eleConfig) === '') {
				eleConfig.ok = this.#handleValidation(false, eleConfig, 'Required');
				return;
			}
		}
		
		if (filterType === 'email' || inputType === 'email') ok = this.#email(eleConfig);
		else if (filterType === 'str') 	 ok = this.#str(eleConfig);
		else if (filterType === 'int') 	 ok = this.#int(eleConfig);
		else if (filterType === 'float') ok = this.#float(eleConfig);
		
		// check if we need to match any pattern
		if (ok && eleConfig.owns('pattern')) ok = this.#pattern(eleConfig);
		
		eleConfig.ok = ok;
	};
	
	#email = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let result = emailRegex.test(value);
		let msg = result ? 'Email accepted' : 'Invalid email';
		return this.#handleValidation(result, eleConfig, msg);
	};
	
	#str = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		value = value.trim();
		
		if (!this.#checkLen(eleConfig, value)) return false;
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#int = (eleConfig) => {
		let value =  JstFormInspector.#getValue(eleConfig);
		
		// make sure we have actual string input
		if(!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		// keep anything except numbers from the input then see if it has invalid character
		let iChar = value.replace(/[0-9]/g, '');
		if (iChar.length > 0) return this.#handleValidation(false, eleConfig, 'Invalid number');
		
		// get the number
		value = parseInt(value);
		
		if (!Number.isSafeInteger(value)) return this.#handleValidation(false, eleConfig, `Must be an integer`);
		if (!this.#checkLen(eleConfig, value)) return false;
		if(!this.#checkRange(eleConfig, value)) return false;
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#float = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		
		// make sure we have actual string input
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		// add the floating point place if it has not
		if (value.match(/\./g) == null) value += '.0';
		
		if (value.replaceAll(/-?\d+\.\d+/g, '').length !== 0) return this.#handleValidation(false, eleConfig, 'Illegal input');
		
		if (!this.#checkLen(eleConfig, value)) return false;
		
		if (!this.#checkRange(eleConfig, value)) return false;
		
		if (eleConfig.owns('place')) {
			if (value.split('.')[1].length !== eleConfig['place'])
				return this.#handleValidation(false, eleConfig, `Fractional place must be of ${eleConfig['place']}`);
		}
		
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#pattern = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		if (value.replaceAll(eleConfig.pattern, '').length !== 0) return this.#handleValidation(false, eleConfig, `Invalid input`);
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#checkLen(eleConfig, value) {
		if ((typeof value).toLowerCase() !== 'string') value = String(value);
		
		let min = eleConfig.minLen || 0;
		let max = eleConfig.maxLen || -1;
		
		if (value.length < min) return this.#handleValidation(false, eleConfig, `Must be ${min} in length`);
		if (max !== -1 && value.length > max) return this.#handleValidation(false, eleConfig, `Exceeded maximum length of ${max}`);
		return true;
	}
	
	#checkRange(eleConfig, value) {
		let min = eleConfig.min || 0;
		let max = eleConfig.max || -1;
		
		if (value < min) return this.#handleValidation(false, eleConfig, `Can't be less than ${min}`);
		if (max !== -1 && value > max) return this.#handleValidation(false, eleConfig, `Can't be greater than ${max}`);
		return true;
	}
	
	#checkInOption(eleConfig, value) {
		let inOption = false;
		if (eleConfig.owns('option')) {
			for (const opValue of eleConfig['option']) {
				if (opValue === value) {
					inOption = true;
					break;
				}
			}
		} else return true;
		
		let msg = $(eleConfig.ele).attr('type') === 'checkbox' ? `Must be acknowledged` : `Must be of valid options`;
		if (!inOption) return this.#handleValidation(false, eleConfig, msg);
		return true;
	}
	
	// Based on the value of the result, it either updates or adds the message element
	// into the specified element or to the next of the input element by default.
	#handleValidation(success, eleConfig, msg) {
		// Update dirty flag
		if (!success && !eleConfig.dirty) {
			eleConfig.dirty = true;
		}
		
		/*
		 * No drawing attention for successful input on first form submission!
		 * Also consider if form was reset as well as dirty flag!
		 */
		if (success && this.#option.firstSubmission && !eleConfig.dirty) {
			return success;
		}
		
		/*
		 * Always send error, if it hasn't been handled!
		 */
		if (!success && eleConfig.msg !== msg) {
			eleConfig.msg = msg;
			this.#validationHandler(success, eleConfig);
			return success;
		}
		
		/*
		 * User didn't correct the input
		 */
		if (!success && eleConfig.msg === msg) {
			return success;
		}
		
		/*
		 * Here it means that the element is dirty (previously had errors) and user fixed it
		 */
		if (success && eleConfig.dirty && eleConfig.msg !== msg) {
			eleConfig.msg = msg;
			this.#validationHandler(success, eleConfig);
		}
		
		return success;
	}
	
	/**
	 * Change the icon to be shown when input is accepted
	 *
	 * @param html {string} Any HTML value for the icon
	 * @return {JstFormInspector}
	 * */
	setIconOk(html) { this.#iconOk = html; return this; }
	
	/**
	 * Change the icon to be shown when input has an error
	 *
	 * @param html {string} Any HTML value for the icon
	 * @return {JstFormInspector}
	 * */
	setIconErr(html) { this.#iconErr = html; return this; }
	
	/**
	 * Callback to be invoked when validation is done.
	 *
	 * @param {function (success: boolean)} fn function invoked, passing the validation outcome as boolean.
	 */
	onValidate (fn) {
		this.#validationConsumer = fn;
	}
	
	/**
	 * Returns the form element.
	 *
	 * @return HTMLFormElement
	 * */
	getForm() {
		return this.#form;
	}
}
(() => {
	class JstIcon  {
		
		#iconPool = {};
		
		#apply(ele, animType, text) {
			ele = jst.eleById(ele);
			if (!ele) throw new Error(`No icon element found for ${ele}`);
			
			// Get the unique id for the icon element so that we can track its animation class
			// and restore it back to the original state. If no id attribute is found; so give
			// it a unique id and save it in the pool.
			let id = $(ele).attr('id');
			if (!id) {
				id = 'jst-id-' + JstIcon.#getUId();
				$(ele).attr('id', id);
			}
			
			// Define an object for holding various information for the icon and its state, parent.
			const obj = {};
			
			obj.id = id;
			obj.ele = ele;
			
			/*
			 * Catch innerHTML
			 */
			obj.innerHTML = ele.innerHTML;
			
			let element = $(ele);
			
			obj.padding = element.css('padding');
			
			/*
			 * Decide the class type & attributes
			 */
			let emptyTxt = (text?.length ?? 0) === 0;
			let txt = emptyTxt ? '' : `&nbsp;${text}`;
			let pad = emptyTxt ? '' : 'jst-px-8';
			let layout = emptyTxt ? 'jst-lay-center' : 'jst-lay-xs-yc jst-gap-4';
			let w = emptyTxt ? `min-width: ${element.innerWidth()}px;` : '';
			let h = element.innerHeight() + 'px';
			
			let iconCls;
			
			switch (animType) {
				case 'spin':
					iconCls = 'jst-anim-spin';
					break;
				
				case 'spin-color':
					iconCls = 'jst-anim-spin-color'
					break;

				default:
					iconCls = 'jst-anim-pulse';
			}
			
			let loaderIconDom = `
				<div class="${layout} ${pad}" style="${w} height: ${h};">
					<span class="jst-icon-swap ${iconCls}"></span>${txt}
				</div>
			`;
			
			element.css('padding', 0);
			element.empty().html(loaderIconDom);
			
			// Before returning the obj modify the parent opacity
			element.animate({opacity: 0.7});
			
			// Also make it disable
			element.attr('disabled', 'true');
			
			// Now save it in the icon pool
			this.#iconPool[id] = obj;
			
			return obj;
		}
		
		#getObj(ele) {
			ele = jst.eleById(ele);
			
			if (!ele) throw new Error(`No element found in the document as specified by the argument.`);
			
			let id = $(ele).attr('id');
			if (!id) throw new Error('This element did not go through icon methods yet.');
			
			if (this.#iconPool.missing(id)) throw new Error('This element was not found in the icon pool.');
			
			return this.#iconPool[id];
		}
		
		/**
		 * Any element can be animated in pulse motion. The element must have an id and its child
		 * must be classed with .jst-icon-swap.
		 *
		 * @param {string|object} ele It can be the id with/without '#' or the element object which
		 * is to be animated.
		 *
		 * @param {string} text Text to show next to icon
		 * */
		pulse(ele, text = '') {
			this.#apply(ele, 'pulse', text);
		}
		
		/**
		 * Any element can be animated in spin motion. The element must have an id and its child
		 * must be classed with .jst-icon-swap.
		 *
		 * @param {string|object} ele It can be the id with/without '#' or the element object which
		 * is to be animated.
		 *
		 * @param {string} text Text to show next to icon
		 * */
		spin(ele, text = '') {
			this.#apply(ele, 'spin', text);
		}
		
		spinColor(ele, text = '') {
			this.#apply(ele, 'spin-color', text);
		}

		/**
		 * Any element in animation can be restored. When restored, in-animation content inside element
		 * is also restored.
		 *
		 * @param ele {string|object} It can be the id with/without '#' or the element object which
		 * is to stop animating
		 * */
		restore(ele) {
			let obj = this.#getObj(ele);
			let element = $(obj.ele);
			
			// Apply padding
			element.css('padding', obj.padding);
			
			// Remove innerHTMl and then put back what was before
			element.empty().html(obj.innerHTML);
			
			// Restore parent opacity
			element.animate({opacity: '1'});
			
			// Make parent intractable
			element.removeAttr('disabled');
			
			// Clear from the icon pool!
			delete this.#iconPool[obj.id];
		}
		
		/**
		 * Sets disabled attribute to the element.
		 *
		 * @param {string | HTMLInputElement} ele Input field id or the element itself. Id can
		 * or can't have # at the beginning.
		 * */
		disable(ele) {
			$(jst.eleById(ele)).attr('disabled', 'true');
		}
		
		/**
		 * Enables the element by removing disabled attribute
		 *
		 * @param {string | HTMLInputElement} ele Input field id or the element itself. Id can
		 * or can't have # at the beginning.
		 * */
		enable(ele) {
			$(jst.eleById(ele)).removeAttr('disabled');
		}
		
		static #getUId = () => new Date().valueOf();
		
	}
	
	window.JstIcon = new JstIcon();
	
})()
class JstModal {
	
	#id;
	#option;
	
	// Indicates whether to run the one time setup callback!
	#runSetupFn = true;
	
	#initialized = false;
	#hidden = false;
	
	/**
	 * Indicates whether the modal is shown for the first time.
	 * It is then always false after every time the modal is shown
	 */
	#firstBoot = true;
	
	#modal = null;
	
	/*
	 * Holds callback for topic event handling
	 * */
	#topicCallback = {};
	
	#injectDataId;
	
	/**
	 * @param {string} id
	 * @param {object=} options Optional values
	 * @param {string=} options.title Sets the modal title. It can be html or string value. Default is "jst-Modal".
	 * @param {boolean=} options.reusable - Whether the modal can be reused. Default is true for non-iFramed modal.
	 * @param {number|string=} options.width - The width of the modal. Default width is 100% of the parent window.
	 * @param {number|string=} options.height - The height of the modal. Default height is 100% of the parent window.
	 * @param {number|string=} options.padding - The padding of the modal. Default is 1rem.
	 * @param {string=} options.url - Url for the iframe webpage
	 * @param {object=} options.injectData - Any data to pass to iFramed modal
	 * @param {boolean=} options.cancelable - Flag makes the modal cancellation status
	 * @param {boolean=} options.overlay - Flag hides/shows the overlay below the modal
	 * @param {boolean=} options.decorated - Flag removes the header from the modal
	 * @param {boolean=} options.showCloseIcon - Whether to show close icon if modal is undecorated
	 * @param {number=} options.opacity - Opacity value 0 to 1 for the overlay behind the modal
	 * @param {'light'|'dark'=} options.theme - Modal theme. Light is default theme
	 * @param {boolean=} options.showLoaderText - Text to display as loader label while fetching iframe paged
	 * @param {string=} options.loaderText - Text to display as loader label while fetching iframe paged
	 * */
	constructor(id, options = {}) {
		this.#id = id;
		
		jst.setProperty(options, 'title', 'jst-Modal');
		jst.setProperty(options, 'width', '100%');
		jst.setProperty(options, 'height', '100%');
		jst.setProperty(options, 'padding', '1rem');
		jst.setProperty(options, 'cancelable', true);
		jst.setProperty(options, 'overlay', true);
		jst.setProperty(options, 'decorated', true);
		jst.setProperty(options, 'showCloseIcon', true);
		jst.setProperty(options, 'theme', JstOverlay.getTheme());
		jst.setProperty(options, 'opacity', -1);
		jst.setProperty(options, 'url', null);
		jst.setProperty(options, 'reusable', !options['url']);
		jst.setProperty(options, 'showLoaderText', true);
		jst.setProperty(options, 'loaderText', 'Loading...');
		jst.setProperty(options, 'injectData', null);
		
		this.#option = options;
		
		// Cache the modal so that we don't waste memory, if possible!
		JstOverlay._cacheClient(this);
		
		// We deferred injecting into DOM since this iFramed modal could cover its parent
		// iFramed modal. So we need to check if parent allows this when showing!
		if (this.isIFramedModal() && JstOverlay.hasParent()) {
			return;
		}
		
		this.#init();
	}
	
	#init () {
		this.#injectDOM();
		this.#attachCloseIconListener();
		this.#adjustModalSize();
		this.#updateCloseIcon();
		
		this.#applyTheme(this.#option.theme === 'dark');
		
		this.#initialized = true;
	}
	
	#injectDOM() {
		let modalContainer;
		
		if (this.#option.url) {
			modalContainer = this.#iframeModal();
		} else {
			modalContainer = this.#pageContentModal();
		}
		
		// Adjust padding
		$(this.#modal)
			.find('.jst-modal-content')
			.css('padding', this.#option.padding);
		
		/*
		 * Inject decorated header, if asked
		 */
		if (!this.#option.url && this.#option.decorated) {
			let modalHeader = `
				<div class="jst-modal-header">
					<h4 class="jst-modal-title">${this.#option.title}</h4>
					<span class="jst-modal-icon-close" title="Close"></span>
				</div>
            `;
			
			$(modalContainer).prepend(modalHeader);
			return;
		}
		
		/*
		 * Or it is only to show the close icon?
		 */
		if (this.#option.showCloseIcon) {
			let headerIcon = `
				<div class="jst-modal-header-less">
					<span class="jst-modal-icon-close" title="Close"></span>
				</div>
			`;
			
			$(modalContainer).prepend(headerIcon);
		}
	}
	
	#iframeModal() {
		let iframeThemeCls = this.#option.theme === 'dark' ? 'jst-dark' : '';
		let loaderText = this.#option.showLoaderText ? `<h4 class="jst-modal-loader-label">${this.#option.loaderText}</h4>` : '';
		
		//Add iframe overlay background class to hide its parent modal
		let iframeOverlayBG = JstOverlay.hasParent() ? 'jst-modal-iframe-overlay-bg' : '';
		
		/*
		 * Set inject data in GOD-parent with a unique id for this modal
		 */
		let dataAttr = '';
		
		if (this.#option.injectData && this.#option.url) {
			this.#injectDataId = jst.uniqueId();
			dataAttr = `data-data-id="${this.#injectDataId}"`;
			JstOverlay._setClientData(this.#injectDataId, this.#option.injectData);
		}
		
		let content = `
			<div class="jst-modal" id="${this.#id}">
				<div class="jst-modal-d-block ${iframeOverlayBG}">
					<div class="jst-modal-loader-wrapper" style="width: ${this.#option.width}; height: ${this.#option.height}">
						<div class="jst-modal-loader"></div>
						${loaderText}
					</div>
	
					<div class="jst-modal-iframe-overlay-bg"></div>
					
					<div class="jst-modal-container" style="display: none;">
						<iframe ${dataAttr}
								id="${this.#id}-frame"
								style="z-index: 1;"
								src="${this.#option.url}">
						</iframe>
						
						<script>
							(() => {
								const iframe = document.getElementById('${this.#id}-frame');
								
								const loaderDiv = $(iframe).parent().prev().prev();
								loaderDiv.css({
									width: '${this.#option.width}',
									height: '${this.#option.height}'
								});
								
								iframe.addEventListener('load', () => {
									let iDoc = iframe.contentDocument || iframe.contentWindow.document;
								
									// Append theme class to the iframe body so that client can apply colors correcntly
									$(iDoc.body).addClass('${iframeThemeCls}');
									
									/*
									 * Set first boot flag to false and then invoke onResume method!
									 */
									const parent = window.parent.JstOverlay.getPopup('${this.#id}');
									parent?.onResume(true);
									
									// Fade-out the loader
									$(loaderDiv).fadeOut(250, () => {
										// Show the iframe body
										$(iframe).parent().fadeIn(250);
										
										parent?.onShown(true);
										parent?._setFirstBootComplete();
									});
									
									$(iDoc).on('keydown', (e) => {
										let keyboard = e.type === 'keydown' && e.key === 'Escape';
										if (!keyboard) return;
										
										JstOverlay._handleEscapeEvent(e);
									});
								});
							})();
						</script>
					</div>
				</div>
			</div>
		`;
		
		$('body').append(content);
		
		this.#modal = $(`#${this.#id}`);
		return jst.getChildOf('.jst-modal-container', this.#modal);
	}
	
	#pageContentModal() {
		this.#modal = $(jst.eleById(this.#id));
		
		/*
		 * Wrap the content of div.jst-modal in div.modal-content.
		 * And then wrap that div.modal-content in div.modal-container
		 */
		let content = `
			<div class="jst-modal-d-block">
				<div class="jst-modal-container">
					<div class="jst-modal-content" id="${this.#id}-content"></div>
				</div>
			</div>
		`;
		
		$($(this.#modal).contents()).wrapAll(content);
		return jst.getChildOf('.jst-modal-container', this.#modal);
	}
	
	#attachCloseIconListener () {
		let btn = jst.getChildOf('.jst-modal-icon-close', this.#modal);
		$(btn).click(() => this.close());
	}
	
	#adjustModalSize() {
		let ele = jst.getChildOf('.jst-modal-container', this.#modal);
		
		$(ele).css({
			width: this.#option.width,
			height: this.#option.height
		});
	}
	
	#updateCloseIcon() {
		let closeIcon = jst.getChildOf('.jst-modal-icon-close', this.#modal);
		closeIcon = $(closeIcon);
		
		if (!this.#option.showCloseIcon) $(closeIcon).fadeOut(250);
		else $(closeIcon).fadeIn(250);
		
		/*
		 * Apply position `absolute` to modal content to show it from
		 * the top-left position within the modal.
		 */
		let modalContent = jst.getChildOf('.jst-modal-content', this.#modal);
		modalContent = $(modalContent);
		
		if (!this.#option.decorated) {
			$(modalContent).css({
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			});
		} else {
			$(modalContent).css({
				position: 'initial'
			});
		}
	}
	
	#applyTheme(isDark) {
		if (isDark) {
			this.#modal.addClass('jst-dark');
		} else {
			this.#modal.removeClass('jst-dark');
		}
		
		if (!this.isIFramedModal()) return;
		
		if (isDark) {
			$(this.getIframeBody()).addClass('jst-dark');
		} else {
			$(this.getIframeBody()).removeClass('jst-dark');
		}
	}
	
	#updateTitle() {
		let titleDOM = jst.getChildOf('.jst-modal-title', this.#modal);
		$(titleDOM).html(this.#option.title);
	}
	
	#show() {
		// #1 - Try to take over the overlay
		let acquired = JstOverlay._acquire(this);
		
		if (!acquired) return;
		
		/*
		 * #2
		 * Only invoke onResume if it is iFramed modal but not the first
		 * or it is not an iFramed modal!
		 * */
		let a = this.isIFramedModal() && !this.#firstBoot;
		let b = !this.isIFramedModal();
		let invoke = a || b;
		if (invoke) {
			this.onResume(this.#firstBoot);
		}
		
		// #3 - Figure out the right callback to invoke on modal shown/resumed
		$(this.#modal).fadeIn(250, () => {
			/*
			 * onShown method will be handled by iframe onLoad event callback
			 * and first boot flag will be set to false. So only call onShown
			 * if it not an iFramed modal or the first boot flag has been set
			 * false!
			 */
			if (this.isIFramedModal() && this.#firstBoot) return;
			
			this.onShown(this.#firstBoot);
			
			if (this.#firstBoot) this.#firstBoot = false;
		})
		
		// #3 - Set hidden status
		this.#hidden = false;
	}
	
	_setFirstBootComplete () {
		this.#firstBoot = false;
	}
	
	/**
	 * This method is invoked when a modal is in display and users hits the escape button.
	 * JstOverlay calls this method automatically.
	 * <br><b>Warning: This method should be called directly.</b>
	 */
	_handleEscape() {
		if (!this.#option.cancelable) return;
		
		this.close();
	}
	
	/**
	 * JstOverlay invokes this method when the modal is being shown from hidden
	 * state.
	 * <br><b>Warning: It should be called directly.</b>
	 */
	_makeVisible() {
		this.#hidden = false;
		
		this.onResume(false);
		
		$(this.#modal).fadeIn(250, () => this.onShown(false));
	}
	
	/**
	 * JstOverlay invokes this method when the modal needs to be hidden on another modal requesting
	 * it to be hidden.
	 * <br><b>Warning: It should be called directly.</b>
	 */
	_hide() {
		if (this.#hidden) {
			warn(`Visible popups must be closed first`);
			return;
		}
		
		this.#hidden = true;
		$(this.#modal).fadeOut(250, () => this.onHidden());
	}
	
	/**
	 * When there is an iframe modal to come, then parent modal needs to hide
	 * its header and stop scrolling its content to avoid capturing child's
	 * event!
	 *
	 * @param {boolean} value whether to set/restore parent state
	 * */
	_prepareForIframe (value) {
		if (!this.isIFramedModal()) return;
		
		let iframe = jst.getChildOf(`#${this.#id}-frame`, this.#modal);
		let body = $(iframe['contentDocument'].body);
		
		let overflow = value ? 'auto' : 'hidden';
		body.css('overflow', overflow);
		
		let header = $(this.#modal).find('.jst-modal-header-less');
		
		if (value) {
			$(header).fadeIn(250);
		} else {
			$(header).fadeOut(250);
		}
	}
	
	/**
	 * Shows the modal.
	 *
	 * @return {JstModal}
	 */
	show() {
		/*
		 * If this modal is shown from an iFramed modal, then we need to check if the
		 * parent modal wants to hide themselves or not. Invoke onHide on parent to
		 * do that. If they agree, then init this modal.
		 */
		if (this.isIFramedModal() && JstOverlay.hasParent()) {
			let parentClient = window.parent.JstOverlay.getTopClient();
			let canParentHide = parentClient?.onHide() ?? true;
			if (!canParentHide) return this;
			
			if (!this.#initialized) this.#init();
		}
		
		if (!this.#initialized) {
			throw new Error(`Modal #${this.#id} must have been initialized before it can be shown`);
		}
		
		/*
		 * Show after a bit of delay to avoid overlay animation glitch because of caching
		 */
		if (JstOverlay.isReady()) {
			this.#show();
			return this;
		}
		
		jst.runLater(0.05, () => this.#show());
		
		return this;
	}
	
	/*
	 * Dismisses the modal
	 */
	close() {
		if (this.#hidden) {
			warn(`Attempted to close hidden model #${this.id}`);
			return;
		}
		
		// Can we close this modal based on the provided close callback?
		let canClose = this.onClose() ?? true;
		
		if (!canClose) return;
		
		JstOverlay._release(this);
		$(this.#modal).fadeOut(250, () => {
			this.onClosed();
			
			/*
			 * Remove the iframe from the DOM and delete client data
			 * if the iframe was set to be not reusable!
			 */
			if (this.isIFramedModal() && !this.isReusable()) {
				this.#modal.remove();
				
				if (this.#option.data && this.#option.url) {
					JstOverlay._deleteClientData(this.#injectDataId)
				}
			}
		});
	}
	
	/**
	 * @return {string}
	 * */
	get id() {
		return this.#id;
	}
	
	/**
	 * Callback, invoked when user closes the modal or pressed the escape
	 * button. It is invoked by JstOverlay to determine if this modal wants to close
	 * itself and release the acquired overlay for the next modals to use.
	 * */
	onClose() {
		return true;
	}
	
	/**
	 * Callback, invoked when user closes the modal or pressed the escape
	 * button.
	 * */
	onClosed() {
	
	}
	
	/**
	 * Callback, invoked when the modal is going to be hidden.
	 * It is invoked by JstOverlay to determine if this modal wants to hide
	 * itself and release the acquired overlay for the next modals to use.
	 *
	 * @return {boolean} boolean to indicate whether the modal can be hid or not
	 * */
	onHide() {
		return true;
	}
	
	/**
	 * Callback, invoked when the modal has just been hidden
	 */
	onHidden() {
	
	}
	
	/**
	 * Callback, invoked when the modal is being shown from hidden state.
	 *
	 * @param {boolean} firstBoot True value indicates the model is shown for the first time. False value indicates
	 * the normal resume of the modal from hidden state or closed state.
	 * */
	onResume(firstBoot) {
	
	}
	
	/**
	 * Callback, invoked when the modal has just been shown.
	 *
	 * @param {boolean} firstBoot True value indicates the model is shown for the first time. False value indicates
	 * the normal resume of the modal from hidden state or closed state.
	 * */
	onShown(firstBoot) {
	
	}
	
	/**
	 * Set theme to the modal.
	 *
	 * @param {'light'|'dark'} theme
	 * */
	setTheme(theme) {
		/*
		 * Check if the theme was previously applied!
		 */
		if (this.#option.theme === theme) return;
		
		this.#option.theme = theme;
		
		let dark = theme === 'dark';
		this.#applyTheme(dark);
	}
	
	/**
	 * Tells whether the modal is shown or not
	 *
	 * @return {boolean} true if the modal is shown, false otherwise
	 * */
	isShown() {
		return !this.#hidden;
	}
	
	/**
	 * Returns whether the modal has overlay to show behind it
	 *
	 * @return boolean
	 * */
	getShowOverlay() {
		return this.#option.overlay;
	}
	
	/**
	 * Returns the opacity for overlay background
	 *
	 * @return {number}
	 */
	getOpacity() {
		return this.#option.opacity;
	}
	
	/**
	 * Returns if the modal is cancelable on keyboard escape event or on mouse clicked
	 * on outside the modal content area.
	 *
	 * @return {boolean}
	 */
	isCancelable() {
		return this.#option.cancelable;
	}
	
	/**
	 * Resizes the model width & height. Values can either be in number, number with units or even
	 * percentage values like '100%' etc.
	 *
	 * @param {number|string} width
	 * @param {number|string} height
	 */
	setSize(width, height) {
		this.#option.width = width;
		this.#option.height = height;
		
		this.#adjustModalSize();
	}
	
	/**
	 * Change the modal width. Value can be number, number with units or even be a percentage value like
	 * '100%' etc.
	 *
	 * @param {number|string} width
	 */
	setWidth(width) {
		this.#option.width = width;
		this.#adjustModalSize();
	}
	
	/**
	 * Change the modal height. Value can be number, number with units or even be a percentage value like
	 * '100%' etc.
	 *
	 * @param {number|string} height
	 */
	setHeight(height) {
		this.#option.height = height;
		this.#adjustModalSize();
	}
	
	/**
	 * Sets the modal title. It can be html or string value
	 *
	 * @param title {string} Modal title
	 * */
	setTitle(title) {
		this.#option.title = title;
		this.#updateTitle();
	}
	
	/**
	 * Changes cancelable property of the modal
	 *
	 * @param {boolean} value
	 */
	setCancelable(value) {
		this.#option.cancelable = value;
		this.#updateCloseIcon();
	}
	
	/**
	 * Show/hides the modal close icon in the header
	 *
	 * @param {boolean} value
	 */
	setShowCloseIcon(value) {
		this.#option.showCloseIcon = value;
		this.#updateCloseIcon();
	}
	
	/**
	 * Returns if the close icon is set to be shown/hidden.
	 *
	 * @return boolean
	 * */
	getShowCloseIcon() {
		return this.#option.showCloseIcon;
	}
	
	/**
	 * Returns if the model loaded an iframe as model content.
	 *
	 * @return boolean
	 * */
	isIFramedModal() {
		return this.#option.url != null;
	}
	
	/**
	 * Runs the callback only once for a reusable modal. Helpful for scenarios
	 * where a code-block needs to run once. It always invokes in order as it appears
	 * in method chaining or program flow!
	 *
	 * @param {function(JstModal)} fn
	 * */
	setup (fn) {
		if (!this.#runSetupFn) return this;
		this.#runSetupFn = false;
		
		fn(this);
		return this;
	}
	
	/**
	 * Any type of topic can be listened and a callback will be invoked on that
	 * topic emission in code. Callback invocation happens down stream meaning
	 * emitting an event of a topic will always go to parent modal/client!
	 *
	 *
	 * @param {string} topic
	 * @param {function(data: object)} callback. Callback should decide whether to bubble down
	 * the topic dispatching down the hierarchy by returning true/false. By default, default it
	 * returns true and propagates the topic event. Return false to stop.
	 *
	 * @return {JstModal}
	 * */
	subscribeEvent (topic, callback) {
		/*
		 * Check if the topic was subscribed previously
		 * */
		if (this.#topicCallback.owns(topic)) {
			console.warn(`Topic ${topic} has already been subscribed`);
			return this;
		}
		
		this.#topicCallback[topic] = JstOverlay.subscribeEvent(topic, callback);
		return this;
	}
	
	/**
	 * Unsubscribes from listening the topic registered before.
	 *
	 * @param {string} topic
	 * */
	unsubscribeEvent (topic) {
		if (!this.#topicCallback.owns(topic)) {
			console.warn(`Unknown topic ${topic} can't be unsubscribed`);
			return false;
		}
		
		delete this.#topicCallback[topic];
		return JstOverlay.unsubscribeEvent(this.#topicCallback[topic]);
	}
	
	/**
	 * For a topic registered with JstOverlay, topic callback id is returned.
	 *
	 * @param {string} topic
	 * @return {?string}
	 * */
	getTopicId (topic) {
		return this.#topicCallback[topic] ?? null;
	}
	
	/**
	 * Emits event for the topic with data.
	 *
	 * @param {string} topic
	 * @param {object} data
	 * */
	emmitEvent (topic, data) {
		JstOverlay.emitEvent(topic, data);
	}
	
	/**
	 * @return {?HTMLElement}
	 * */
	getIframeBody () {
		return document.getElementById(`${this.#id}-frame`)?.contentDocument.body ?? null;
	}
	
	/**
	 * Returns if the modal is set to reusable or not.
	 * This only applies to iframe modal.
	 *
	 * @return {boolean}
	 * */
	isReusable () {
		if (!this.#option.url) return true;
		
		return this.#option.reusable;
	}
	
}

class JstNum {
	
	/*
    * currency sign constants
    * */
	
	static MONEY_BD = '৳';
	static MONEY_GBP = '£';
	static MONEY_USD = '$';
	
	/**
	 * Any number can be formatted in either currency format with sign or fractional
	 * number with specified place.
	 *
	 * @param {number|string} input the number is either in string or number format.
	 * @param {string} money currency sign for the number.
	 * @param {boolean} lead0 indicates whether to add leading zero before the number.
	 * @param {number} place the fractional place of number.
	 * @param {boolean} addComma adds commas in formatted numbers
	 * @return {string} formatted number with currency sign as specified by arguments.
	 * */
	static format(input, money = '', lead0 = false, place = 2, addComma = true) {
		// Ensure we have a valid number
		let num = parseFloat(input);
		if (isNaN(num)) return '0-0';
		
		// Determine if it's an integer or floating-point value
		let integer = Number.isSafeInteger(num);
		
		// Check if it's negative
		let negative = num < 0;
		num = negative ? Math.abs(num) : num;
		
		// Add the symbol for negative values and any currency symbol
		let symbol = negative ? '-' : '';
		symbol += money.length === 0 ? '' : money;
		
		// Format the number with the specified decimal places
		num = !integer ? num.toFixed(place) : num.toString();
		
		// Split the number into integer and decimal parts (if any)
		let [integerPart, decimalPart] = num.split('.');
		
		// Add commas to the integer part if addComma is true
		if (addComma) {
			integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		
		// Rejoin the integer and decimal parts (if any)
		num = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
		
		// Add leading zero if requested
		num = lead0 ? this.lead0(num) : num;
		
		return `${symbol}${num}`;
	}
	
	/**
	 * Number formatted in currency can be parsed back to float number using this
	 * method. By the default, sign is GBP(Great Britten Pound).
	 *
	 * @param {string} input number is in currency format.
	 * @param {string} sign currency sign.
	 * @return {number} the parsed floating number.
	 * */
	static moneyToNum(input, sign = JstNum.MONEY_GBP) {
		input = String(input);
		return parseFloat(input.replace(sign, ''));
	}
	
	/**
	 * Leading zero can be added to any number if it is less than 10.
	 *
	 * @param {number} number the number.
	 * @return {string} number with leading zero if needed.
	 * */
	static lead0(number) {
		return (number < 10) ? `0${number}` : number;
	}
	
	/**
	 * Converts numbers from English to Bangla notation.
	 *
	 * This function takes a number or a string that represents a number in English
	 * notation and returns a string with each digit converted to Bangla. It's designed
	 * to work with both integer and floating-point numbers represented as strings.
	 * Non-numeric characters within the string are not converted but are preserved
	 * in the output.
	 *
	 * @param {Number|String} englishNumber - The number or string representing a number
	 *        to be converted from English to Bangla digits. This parameter can handle
	 *        both numeric and string types. For string inputs, the function iterates
	 *        through each character, converting numeric characters to Bangla while
	 *        leaving non-numeric characters unchanged.
	 *
	 * @returns {String} A string representation of the input number where each English
	 *         digit has been replaced with its corresponding Bangla digit. Non-numeric
	 *         characters in the input are returned as is in the output string.
	 *
	 * @example
	 * // Convert a numeric value
	 * console.log(convertToBanglaNumber(2023)); // Outputs: ২০২৩
	 *
	 * // Convert a string representing a numeric value
	 * console.log(convertToBanglaNumber("4567")); // Outputs: ৪৫৬৭
	 *
	 * // Mixed input with non-numeric characters
	 * console.log(convertToBanglaNumber("Flight 370")); // Outputs: Flight ৩৭০
	 */
	static bdNum(englishNumber) {
		// Mapping of English digits to Bangla digits
		const banglaDigits = {
			'0': '০', '1': '১', '2': '২', '3': '৩',
			'4': '৪', '5': '৫', '6': '৬', '7': '৭',
			'8': '৮', '9': '৯'
		};
		
		// Convert the number to a string to iterate over each digit
		let englishNumberStr = englishNumber.toString();
		
		// Replace each English digit with its Bangla counterpart
		let banglaNumberStr = '';
		for (let char of englishNumberStr) {
			banglaNumberStr += banglaDigits[char] ?? char; // Keep the character as is if not found in the map
		}
		
		return banglaNumberStr;
	}
	
	static bdOrdinal(num) {
		// Ensure num is treated as a number
		num = typeof num === 'string' ? parseInt(num, 10) : num;
		
		// Define ordinal representations for 1 through 10
		const ordinals = {
			1: 'প্রথম',
			2: 'দ্বিতীয়',
			3: 'তৃতীয়',
			4: 'চতুর্থ',
			5: 'পঞ্চম',
			6: 'ষষ্ঠ',
			7: 'সপ্তম',
			8: 'অষ্টম',
			9: 'নবম',
			10: 'দশম'
		}
		
		// Check if num is in the predefined range
		if (ordinals[num]) {
			return ordinals[num]
		} else if (num > 10) {
			return `${this.bdNum(num)}তম`
		} else {
			return '০'
		}
	}
	
	
}
(() => {
	
	class JstOverlay {
		#theme;
		
		#childOverlay = null;
		
		/**
		 * @type {[JstModal]}
		 * */
		#clientList = [];
		
		#reusableClientList = {};
		#injectedData = {};
		
		#ready = false;
		#overlay;
		
		#topicClientMap = {};
		
		constructor() {
			jst.run(() => {
				/*
				 * Initialize the theme
				 */
				this.#theme = JstTheme.isDark() ? 'dark' : 'light';
				
				/*
				 * Check if the overlay DOM was already inserted!
				 */
				let overlayDOM = document.getElementById('jst-overlay');
				
				if (overlayDOM) return;
				
				/*
				 * Insert the overlay DOM element
				 */
				let overlay = `<div id="jst-overlay" class="jst-overlay"></div>`;
				$('body').prepend(overlay);
				this.#overlay = $('#jst-overlay');
				
				// Pass the keydown escape or mouse click event to the currently shown modal/dialog
				$(document).on('keydown click', this.#overlay, (event) => this._handleEscapeEvent(event));
				
				this.#overlay.hide();
				this.#ready = true;
			});
		}
		
		_handleEscapeEvent(e, escapeEventCheck = false) {
			/*
			 * If this overlay has child, then pass down this escape event call
			 * to that & return.
			 */
			if (this.#childOverlay) {
				this.#childOverlay._handleEscapeEvent(e, true);
				return;
			}
			
			let keyboard = e.type === 'keydown' && e.key === 'Escape';
			let click = e.type === 'click' && $(e.target).hasClass('jst-modal-d-block');
			
			/*
			 * The 'escapeEventCheck' parameter will tell us whether the child overlay should ignore
			 * to check if it was a valid escape event coming from its overlay, not from the parent.
			 */
			if (!escapeEventCheck && !keyboard && !click) return;
			
			this.#clientList.peek()?._handleEscape(e);
		}
		
		/*
		 * Shows the last hidden modal if there is any. If it was an inner OM, then on
		 * reaching zero client, it delegates update call to its parent OM so that the
		 * life cycles of modals seem natural!
		 * */
		#update() {
			if (!this.#clientList.isEmpty()) {
				let client = this.#clientList.peek();
				
				this.#updateOverlay(client);
				client._makeVisible();
				
				return;
			}
			
			/*
			 * If there is no client to overlay then wait for 75 milliseconds before
			 * hiding the overlay. Another client may show up in the half way hiding.
			 */
			jst.runLater(.075, () => {
				if (this.#clientList.isEmpty()) {
					this.#hideOverlay();
					
					// Unregister this overlay as child in parent!
					window.parent.JstOverlay._unsetChildOM();
					return;
				}
				
				let client = this.#clientList.peek();
				
				this.#updateOverlay(client);
				client._makeVisible();
			});
		}
		
		/**
		 * Overlay can be acquired by any client. The client must have the interface
		 * consists of methods: id, _handleEscape(event), _makeVisible(), _hide()
		 *
		 * @param {JstModal|JstAlert} client
		 * @return {boolean} Returns if currently shown modal is wiling to release the
		 * overlay to the client modal or not.
		 * */
		_acquire(client) {
			/*
			 * #1
			 * If the child list is empty, check if this overlay has parent.
			 * If so, register this overlay as child.
			 */
			if (this.#clientList.isEmpty() && this.hasParent()) {
				window.parent.JstOverlay._setChildOM(this);
			}
			
			/*
			* #2
			* Important to check if it is iframe coming from an iFramed modal
			* which will cover the parent iFramed modal. It makes sense to call hide
			* related methods and meet the expectations! So try to get parent client.
			*/
			let parentClient;
			
			if (client.isIFramedModal() && this.hasParent()) {
				parentClient = window.parent.JstOverlay.getTopClient();
			}
			
			// #3 - Check if the current client is able to hide
			let topClient = this.#clientList.peek();
			
			// JstAlert can always acquire overlay no matter what!
			let canHide = (client instanceof JstAlert || topClient?.onHide()) ?? true;
			if (!canHide) return false;
			
			// #4 - Push the new client on the stack
			this.clientList.push(client);
			
			// #5 - Invoke onHidden method on parent iFrame, if it has so!
			parentClient?.onHidden();
			
			// #6 - Ask the currently shown client to hide, if there is any shown
			topClient?._hide();
			
			// #7 - Update the overlay as per the client's requirement, whether to show/hide
			this.#updateOverlay(client);
			return true;
		}
		
		/**
		 * Client can release any acquired overlay. The client must have an interface of
		 * essential methods which are needed by JstOverlay to handle the complete
		 * lifecycle of the overlay.
		 *
		 * See {@link JstOverlay._acquire()} method for more details.
		 *
		 * @param {JstModal|JstAlert} client
		 * */
		_release(client) {
			// #1 - Pop, if release request came from the top-most client on the stack
			let topMostClient = this.clientList.peek();
			
			if (topMostClient?.id === client.id) this.#clientList.pop();
			
			// #2 - Update the overlay after releasing the top-most client
			this.#update();
			return true;
		}
		
		/**
		 * Returns if this OM has a parent OM
		 *
		 * @return boolean
		 * */
		hasParent() {
			return window !== window.parent;
		}
		
		#getOpacity() {
			// Adjust the overlay as asked!
			let opacity = this.#clientList.peek().getOpacity();
			
			// Opacity wasn't set by the client or set to -1
			if (opacity === -1) opacity = this.#theme === 'dark' ? .85 : .5;
			
			return opacity;
		}
		
		#showOverlay() {
			this.#overlay.css('opacity', this.#getOpacity());
			
			if (this.#overlay.css('display') === 'block') return;
			
			$(this.#overlay).fadeIn(250);
		}
		
		#hideOverlay() {
			$(this.#overlay).fadeOut(250);
		}
		
		/**
		 * Shows/hides the overlay behind the modal as required by the modal.
		 *
		 * @param {JstModal} client
		 * */
		#updateOverlay(client) {
			if (client.getShowOverlay()) this.#showOverlay();
			else if (!client.getShowOverlay()) this.#hideOverlay();
		}
		
		/**
		 * Caches the modal to be reused if the modal is either an iFramed modal reusable
		 * or a basic modal.
		 *
		 * @param {JstModal} client
		 * */
		_cacheClient (client) {
			if (!client.isIFramedModal() || (client.isIFramedModal() && client.isReusable())) {
				if (!this.#reusableClientList.owns(client.id)) {
					this.#reusableClientList[client.id] = client;
				}
			}
		}
		
		/**
		 * Sets the inner JstOverlay.
		 *
		 * @param {JstOverlay} innerJstOverlay the inner overlay manager instance
		 * */
		_setChildOM(innerJstOverlay) {
			// If set then no need to go further!
			if (this.#childOverlay !== null) return;
			
			this.#childOverlay = innerJstOverlay;
			this._prepareParent();
		}
		
		/**
		 * Unsets the inner OM, as the inner OM has reached zero modal client.
		 * */
		_unsetChildOM() {
			this._restoreParent();
			this.#childOverlay = null;
		}
		
		/*
		 * When there is an inner JstOverlay to come, it hides close icon and
		 * sets the content not scrollable of currently shown modal of this OM.
		 * */
		_prepareParent() {
			let client = this.#clientList.peek();
			
			if (client.isIFramedModal()) {
				client._prepareForIframe(false);
			}
		}
		
		/*
		 * Restores the current client (shown model on this OM) to previous state.
		 * Close icon will be show (if configured so) and content is made scrollable.
		 * */
		_restoreParent() {
			this.#clientList.peek()?._prepareForIframe(true);
		}
		
		/**
		 * Set injected data by client in GOD-parent OM.
		 *
		 * @param {string} clientId randomly generated unique client id for tracking data
		 * @param {object} data injected data
		 * */
		_setClientData (clientId, data) {
			if (this.hasParent()) {
				window.parent.JstOverlay._setClientData(clientId, data);
				return;
			}
			
			this.#injectedData[clientId] = data;
		}
		
		/**
		 * Removes injected data stored by the unique tracking id.
		 *
		 * @param {string} clientId
		 * */
		_deleteClientData (clientId) {
			if (this.hasParent()) {
				window.parent.JstOverlay._deleteClientData(clientId);
				return;
			}
			
			delete this.#injectedData[clientId];
		}
		
		/**
		 * Returns the injected client data.
		 * This method is not invoked on JstOverlay instance directly by code as there
		 * is no way to track the clientId param.
		 *
		 * @param {string} clientId
		 * @return {object} injected data. Returns empty object if none was set.
		 * */
		_getClientData (clientId) {
			if (this.hasParent()) {
				return window.parent.JstOverlay._getClientData(clientId);
			}
			
			return this.#injectedData[clientId] ?? {};
		}
		
		/**
		 * @param {string} topic
		 * @param {function(data: object)} callback
		 * */
		subscribeEvent(topic, callback) {
			let subscriberId = jst.uniqueId();
			
			// Create topic object if it is not present
			if (!this.#topicClientMap.owns(topic)) {
				this.#topicClientMap[topic] = {};
			}
			
			this.#topicClientMap[topic][subscriberId] = callback;
			return subscriberId;
		}
		
		/**
		 * @param {string} subscriberId
		 * */
		unsubscribeEvent(subscriberId) {
			for (let topicKey in this.#topicClientMap) {
				let topicMap = this.#topicClientMap[topicKey];
				
				if (topicMap.hasOwnProperty(subscriberId)) {
					delete topicMap[subscriberId];
					return true;
				}
			}
			
			return false;
		}
		
		/**
		 * @param {string} topic
		 * @param {object} data
		 * */
		emitEvent(topic, data) {
			let topicSubscriberMap = this.#topicClientMap[topic] ?? null;
			
			let bubbleDown = true;
			
			if (topicSubscriberMap) {
				for (let subscriberId in topicSubscriberMap) {
					if (!topicSubscriberMap[subscriberId](data)) {
						bubbleDown = false;
						break;
					}
				}
			}
			
			if (!bubbleDown || !this.hasParent()) {
				return;
			}
			
			window.parent.JstOverlay.emitEvent(topic, data);
		}
		
		/**
		 * Returns the currently active client modal
		 *
		 * @return {JstModal}
		 * */
		getTopClient() {
			return this.#clientList.peek();
		}
		
		/**
		 * Sets the OM theme configuration to light/dark and updates the client modals.
		 *
		 * @param {'light'|'dark'} theme
		 * */
		setTheme(theme) {
			this.#theme = theme;
			
			let isDark = theme === 'dark';
			
			/*
			 * Change background color of the overlay
			 * */
			let ele = $('.jst-overlay');
			jst.switchCls(isDark, 'jst-overlay-dark', ele);
			
			/*
			 * Apply this theme change to all the overlay clients
			 */
			this.#clientList.forEach((client) => client.setTheme(theme));
			
			/*
			 * Let's not forget about reusable clients
			 */
			for (const key in this.#reusableClientList) {
				this.#reusableClientList[key].setTheme(theme);
			}
			
			/*
			 * Pass it down to child JstOverlay
			 * */
			this.#childOverlay?.setTheme(theme);
		}
		
		/**
		 * Returns the current theme set up.
		 *
		 * @return {'light' | 'dark'}
		 * */
		getTheme() {
			return (
				this.hasParent() ?
				window.parent.JstOverlay.getTheme() :
				this.#theme
			);
		}
		
		/**
		 * Returns whether the modal specified by the id is currently shown.
		 *
		 * @return boolean
		 * */
		isUp(id) {
			return this.#clientList.peek()?.id === id;
		}
		
		isReady() {
			return this.#ready;
		}
		
		/**
		 * @return {[JstModal]}
		 * */
		get clientList() {
			return this.#clientList;
		}
		
		
		/**
		 * It looks at the reusable client list to find a popup by id.
		 * If not found, it then uses the client list array to find the modal.
		 *
		 * @param {string} id client id
		 * @return {?JstModal}
		 * */
		getPopup(id) {
			let client = this.#reusableClientList?.[id];
			
			if (client) return client;
			
			for (let i = 0; i < this.#clientList.length; i++) {
				let c = this.#clientList[i];
				
				if (c.id === id) return c;
			}
			
			return null;
		}
		
	}
	
	window.JstOverlay = new JstOverlay();
	
	/**
	 * Any type of topic can be listened and a callback will be invoked on that
	 * topic emission in code. Callback invocation happens down stream meaning
	 * emitting an event of a topic will always go to parent modal/client!
	 *
	 *
	 * @param {string} topic
	 * @param {function(data: object)} callback. Callback should decide whether to bubble down
	 * the topic dispatching down the hierarchy by returning true/false. By default, default it
	 * returns true and propagates the topic event. Return false to stop.
	 *
	 * @return {string} subscription id. It can be used to unsubscribe the topic.
	 * */
	window.subscribeEvent = (topic, callback) => {
		return window.JstOverlay.subscribeEvent(topic, callback);
	};
	
	/**
	 * Any topic can be unsubscribed using subscriber id which was returned by {@link subscribeEvent()}
	 * call.
	 *
	 * @param {string} subscriberId
	 * */
	window.unsubscribeEvent = (subscriberId) => {
		return window.JstOverlay.unsubscribeEvent(subscriberId);
	};
	
	/**
	 * Get popup by the id provided.
	 *
	 * @param {string} id The popup id
	 * @returns {JstModal} undefined if there is no popup with the id otherwise the popup
	 * */
	window.getPopup = (id) => {
		return window.JstOverlay.getPopup(id);
	};
	
	/**
	 * Closes the top-most modal off the stack.
	 * */
	window.closePopup = () => {
		/*
		 * If there is no client and this OM has parent and delegate this
		 * call to the parent OM to close!
		 * */
		let om = window.JstOverlay;
	
		if (om.clientList.isEmpty() && om.hasParent()) {
			window.parent.closePopup();
			return;
		}
		
		// Try to close current client on this OM!
		om.clientList.peek()?.close();
	};
	
	/**
	 * Returns injected data from the parent modal for child modal.
	 *
	 * @return {object} object data. Returns empty object if no data was set by parent!
	 * */
	window.getClientData = () => {
		let iframeId = window.frameElement?.getAttribute('data-data-id') ?? null;
		
		if (!iframeId) return {};
		
		return window.JstOverlay._getClientData(iframeId);
	};
	
})();
class JstStorage {
	
	/**
	 * @param {string} key
	 * @param {number|string|boolean} value
	 * */
	static set(key, value) {
		localStorage.setItem(key, value);
	}
	
	/**
	 * @param {string} key
	 * */
	static unset(key) {
		localStorage.removeItem(key);
	}
	
	/**
	 * @param {string} key
	 * @param {boolean} defValue
	 * @return {boolean}
	 * */
	static bool(key, defValue) {
		return Boolean(localStorage.getItem(key)) ?? defValue;
	}
	
	/**
	 * @param {string} key
	 * @param {string} defValue
	 * @return {string}
	 * */
	static str(key, defValue) {
		return localStorage.getItem(key) ?? defValue;
	}
	
	/**
	 * @param {string} key
	 * @param {number} defValue
	 * @return {number}
	 * */
	static int (key, defValue) {
		let data = localStorage.getItem(key) ?? defValue;
		data = parseInt(data);
		
		return isNaN(data) ? defValue : data;
	}
	
	/**
	 * @param {string} key
	 * @param {number} defValue
	 * @return {number}
	 * */
	static float (key, defValue) {
		let data = localStorage.getItem(key) ?? defValue;
		data = parseFloat(data);
		
		return isNaN(data) ? defValue : data;
	}
	
	static setCookie(key, value, expDay= 365) {
		const d = new Date();
		d.setTime(d.getTime() + (expDay * 24 * 60 * 60 * 1000));
		let expires = "expires="+ d.toUTCString();
		document.cookie = key + "=" + value + ";" + expires + ";SameSite=Lax; path=/";
	}
	
	static unsetCookie(key) {
		document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Lax`;
	}
	
	static cookieBool(key, defaultValue) {
		let value = JstStorage.cookieStr(key, null);
		if (value == null) return defaultValue;
		return value === 'true';
	}
	
	static cookieInt(key, defaultValue) {
		return parseInt(JstStorage.cookieStr(key, defaultValue));
	}
	
	static cookieFloat(key, defaultValue) {
		return parseFloat(JstStorage.cookieStr(key, defaultValue));
	}
	
	static cookieStr(key, defaultValue) {
		let name = key + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		
		let ca = decodedCookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return defaultValue;
	}
}
class JstTable {
	
	#id;
	#table;
	
	#filterBy = -1;
	
	#sort = 'desc';
	#lastSortedIcon = null;
	#lastSortedCol = null;
	
	constructor(id) {
		this.#id = id;
		this.#table = $(`#${id}`);
		
		this.#hookFilterListener();
		this.#loadFilter();
		
		this.#hookSortListener();
	}
	
	#hookSortListener() {
		let thisObj = this;
		
		/*
		 * Add click listener to sort icons found in table header
		 * */
		$(`#${this.#id} .jst-table-col-icon-sort`).click(function () {
			thisObj.#lastSortedIcon = this;
			
			// Toggle the sort direction
			thisObj.#sort = thisObj.#sort === 'asc' ? 'desc' : 'asc';
			
			/*
			 * Update sort icon UI
			 * */
			let angle = thisObj.#sort === 'desc' ? 'rotate(0deg) scaleX(1)' : 'rotate(180deg) scaleX(-1)';
			$(this).css('transform', angle);
			
			/*
			 * Remove all shown sort icons
			 * */
			let parent = this.parentElement;
			$(parent).toggleClass('jst-table-col-icon-sort-show', true);
			
			if (thisObj.#lastSortedCol !== parent) {
				$(thisObj.#lastSortedCol).removeClass('jst-table-col-icon-sort-show');
			}
			
			// Update the last sorted col
			thisObj.#lastSortedCol = parent;
			
			/*
			 * Sort the table rows
			 * */
			let rows = thisObj.#table.find('tbody tr').toArray();
			let index = $(parent).index();
			let descending = thisObj.#sort !== 'asc';
			
			rows.sort(function(rowA, rowB) {
				let cellA = $(rowA).children('td').eq(index).text().trim();
				let cellB = $(rowB).children('td').eq(index).text().trim();
				
				/*
				 * Oh, you number!
				 * */
				if (['৳', '£', '$'].includes(cellA[0])) {
					cellA = cellA.replace(/[৳£$,]/g, '');
				}
				
				if (['৳', '£', '$'].includes(cellB[0])) {
					cellB = cellB.replace(/[৳£$,]/g, '');
				}
				
				if ($.isNumeric(cellA) && $.isNumeric(cellB)) {
					return descending ? cellB - cellA : cellA - cellB;
				}
				
				return descending ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
			});
			
			// Append the sorted rows to the table
			$.each(rows, function(index, row) {
				thisObj.#table.children('tbody').append(row);
			});
		});
	}
	
	/*
	 * For a column name, it figures out the index of the column in table
	 * header. Returns -1 if it couldn't find the column in the table header.
	 * */
	#getColumnIndex(colName) {
		let colIndex = -1;
		
		$(`#${this.#id} th .jst-table-col-label`).each(function (i) {
			if ($(this).text().toLowerCase().trim() === colName.trim().toLowerCase()) {
				colIndex = i;
				return false;
			}
		});
		
		return colIndex;
	}
	
	#loadFilter() {
		let cachedFilter = localStorage.getItem(`jst_tab_filter_by_${this.#id}`) ?? null;
		$(`#${this.#id}-filter input`).prop('disabled', !cachedFilter);
		
		if (!cachedFilter) return;
		
		this.#filterBy = this.#getColumnIndex(cachedFilter);
		
		if (this.#filterBy === -1) return;
		
		/*
		 * Find the option if available in the select by the cached value
		 * */
		let options = $(`#${this.#id}-filter select option`).filter(function () {
			return $(this).val().toLowerCase() === cachedFilter;
		});
		
		if (options.length <= 0) return;
		
		$(`#${this.#id}-filter select`).val(options.val());
	}
	
	#hookFilterListener() {
		let filterDiv = `#${this.#id}-filter`;
		let keywordInput = $(`${filterDiv} input`);
		
		let thisObj = this;
		
		/*
		 * Add select option change listener
		 * */
		$(`${filterDiv} select`).change((i) => {
			/*
			 * Get the selected option value and disable input box if empty/undefined
			 * */
			let colName = i.target.value?.toLowerCase().trim();
			keywordInput.prop('disabled', !colName);
			
			/*
			 * Get the column index
			 * */
			this.#filterBy = this.#getColumnIndex(colName);
			
			/*
			 * TODO - Do we need to allow it via configuration option?
			 * */
			// if (this.#filterBy === -1) return;
			
			// Cache the option selected
			localStorage.setItem(`jst_tab_filter_by_${this.#id}`, colName);
		});
		
		/*
		 * Add keyup listener to filter input box
		 * */
		keywordInput.keyup(function () {
			let column = thisObj.#filterBy;
			if (column === -1) return;
			
			// Get filter keywords
			let keywords = $(this).val()?.trim().toLowerCase();
			
			$(thisObj.#table).find(`tbody tr`).filter(function() {
				// Get column keywords to match the keywords in
				let colValue = $($(this).find('td')[column]).text().trim().toLowerCase();
				$(this).toggle(colValue.includes(keywords));
			});
		});
	}
	
}
(() => {

	class JstTheme {
		#listeners = [];
		
		// TODO - make a method to return 'light|dark'
		// TODO - make sure theme sets JstOverlay properly!

		constructor() {
			jst.run(() => {
				/*
				 * Get the theme attribute
				 */
				let themeAttr = getComputedStyle(document.documentElement).getPropertyValue('--jst-theme-attr');
				if (themeAttr) jst.themeAttribute = themeAttr;
				
				let config = {
					attributes: true,
					attributeFilter: [themeAttr]
				};
	
				let callback = (mutationsList) => {
					let value = this.isDark() ? 'dark' : 'light';
					JstStorage.setCookie('theme', value);
					
					for(let mutation of mutationsList) {
						if (mutation.type !== 'attributes') continue
						
						this.#listeners.forEach((listener) => listener(this.isLight()))
					}
					
					JstOverlay.setTheme(value);
				};

				// Create an observer instance linked to the callback function
				let observer = new MutationObserver(callback);

				// Start observing the target node for configured mutations
				$(document).ready(() => observer.observe($('body')[0], config));
			});
		}

		/**
		 * @param callback {function(string:theme)}
		 * */
		listenChange(callback) {
			this.#listeners.push(callback);
		}
		
		isDark() {
			return document.body.getAttribute(jst.themeAttribute)?.toLowerCase() === 'dark';
		}
		
		isLight() {
			return !this.isDark();
		}

		toggle(theme = null) {
			this.#setTransitionEffect();

			if (theme === null) {
				theme = this.isDark() ? 'light' : 'dark';
			}

			document.body.setAttribute(jst.themeAttribute, theme);
			JstStorage.setCookie('theme', theme);

			jst.runLater(2, this.#removeTransitionEffect);
		}

		load() {
			let theme = JstStorage.cookieStr('theme', 'dark');

			/*
			 * Check if the theme attribute is applied with the value already
			 * */
			if (document.body.getAttribute(jst.themeAttribute)?.toLowerCase() === theme)
				return;

			this.toggle(theme);
		}

		#setTransitionEffect() {
			let style = document.createElement('style');
			style.id = 'dynamicTransition';
			style.innerHTML = `* { transition: background 600ms !important; }`;
			
			document.head.appendChild(style);
		}

		#removeTransitionEffect() {
			let styleElement = document.querySelector('#dynamicTransition');
			
			if (styleElement) {
				styleElement.parentNode.removeChild(styleElement);
			}
		}

	}

	window.JstTheme = new JstTheme();

})();


/*
* Any feedback to the user can be displayed at the right bottom side of the document
* with auto hiding animation or can be shown sticky. Toast can invoke callback if set
* when the toast has been done with hiding.
*
* It also has a feature which can look into the cookie to see if any toast is pending to
* show on document ready event and after showing the message it clears the toast cookies.
* */
(() => {
	
	class JstToast {
		
		#toastMsg = 'A sweet and delicious toast to eat! 😎';
		
		ERROR = -1;
		WARNING = 0;
		SUCCESS = 1;
		INFO = 2;
		
		#delay;
		
		#injected = false;
		#toast;
		#icon;
		#msg;
		#guide;
		#bar;
		
		#autoHide;
		#callback;
		
		error(msg, autoHide = true, callback = null, delay = 3) {
			this.show(this.ERROR, msg, autoHide, callback, delay);
		}
		
		warning(msg, autoHide = true, callback = null, delay = 3) {
			this.show(this.WARNING, msg, autoHide, callback, delay);
		}
		
		success(msg, autoHide = true, callback = null, delay = 3) {
			this.show(this.SUCCESS, msg, autoHide, callback, delay);
		}
		
		info(msg, autoHide = true, callback = null, delay = 3) {
			this.show(this.INFO, msg, autoHide, callback, delay);
		}
		
		show(type, msg, autoHide = true, callback = null, delay = 3) {
			this.#stopAnimation();
			
			this.#toastMsg = msg;
			this.#autoHide = autoHide;
			this.#callback = callback;
			this.#delay = delay;
			
			// make sure we have injected DOM into the document
			this.#injectDOM();
			
			// hider bar border, if it was showing previously
			$(this.#bar).hide();
			
			// remove listeners from the toast, if added previously
			this.#removeListener();
			
			if (this.#autoHide) this.#addListener();
			
			// apply themes, styles to toast DOMs and show the toast with animation
			this.#setup(type);
			
			if (this.#autoHide) {
				// show bar border
				$(this.#bar).show();
				this.#startAnimation();
			}
		}
		
		#setup(type) {
			this.hide();
			this.#decorate(type);
			
			$(this.#toast).show().animate({right: 0}, 750, 'swing');
		}
		
		#addListener() {
			$(this.#toast).on('mouseenter', () => { this.#stopAnimation(); });
			$(this.#toast).on('mouseleave', () => { this.#startAnimation(); });
		}
		
		#removeListener() {
			$(this.#toast).off('mouseenter, mouseleave');
		}
		
		#startAnimation() {
			$(this.#bar).css('width', '0');
			$(this.#bar).delay(750).animate({width: '100%'}, this.#delay * 1000, 'linear', () => {
				$(this.#toast).delay(2000).animate({'right': '-360px'}, 1000, 'swing');
				if (this.#callback != null) this.#callback();
			});
		}
		
		#stopAnimation() { $(this.#bar).stop(); }
		
		#injectDOM() {
			if (this.#injected) return;
			
			let dom = `
                <div id="toast" style="display: none; overflow: clip; position: fixed; right: -360px; bottom: 32px; min-width: 280px; max-width: 360px; font-size: 0.98em; line-height: 1.15em; box-shadow: 1px 1px 2px black; z-index: 100000; border-radius: 0.25rem 0 0 0.25rem;">
                    <div style="display: flex; padding: 16px; align-items: center;">
                        <span id="toast-icon" style="user-select: none; margin-right: 12px; font-size: 24px;">&#128073;</span>
                        <span id="toast-msg" style="line-height: 1.25;">A sweet and delicious toast to eat!😎😉</span>
                    </div>
                    <div id="toast-pro-bar-guide">
                        <div id="toast-pro-bar" style="display: none; width: 100%; height: 1px; margin: 0 0; padding: 2px; background-color: #0B5ED7;"></div>                
                    </div>
                </div>
            `;
			$('body').append(dom);
			
			this.#toast = $("#toast");
			this.#icon = $("#toast-icon");
			this.#msg = $("#toast-msg");
			this.#guide = $("#toast-pro-bar-guide");
			this.#bar = $("#toast-pro-bar");
			
			this.#injected = true;
		}
		
		#decorate(type) {
			$(this.#msg).text(this.#toastMsg);
			
			// theme for different type of toast
			let themeSettings = {
				success :   { color : '#0f5132', bg : '#d1e7dd', guide : '#009A68', bar : '#52C400', icon : '&#9989;'},
				info    :   { color : '#084298', bg : '#CFF4FC', guide : '#0a95b1', bar : '#0DCAF0', icon : '&#128172;'},
				warning :   { color : '#664d03', bg : '#fff3cd', guide : '#937005', bar : '#FFCA2C', icon : '&#128721;'},
				error   :   { color : '#842029', bg : '#f8d7da', guide : '#7A1E27', bar : '#DB3948', icon : '&#9940;'}
			};
			
			let theme;
			if (type === this.SUCCESS) theme = themeSettings.success;
			else if (type === this.WARNING) theme = themeSettings.warning;
			else if (type === this.ERROR) theme = themeSettings.error;
			else theme = themeSettings.info;
			
			$(this.#toast).css('color', theme.color);
			$(this.#toast).css('background-color', theme.bg);
			$(this.#icon).html(theme.icon);
			$(this.#guide).css('background-color', theme.guide);
			$(this.#bar).css('background-color', theme.bar);
		}
		
		hide() { $(this.#toast).css('right', '-360px'); }
		
	}
	
	window.JstToast = new JstToast();
	
	window.JstToast.loadToast = (msg, type = window.JstToast.SUCCESS, autoHide = true, delay = 3) => {
		JstStorage.setCookie('toast_msg', msg);
		JstStorage.setCookie('toast_type', type);
		JstStorage.setCookie('toast_auto_hide', autoHide);
		JstStorage.setCookie('toast_delay', delay);
	};
	
	jst.run( () => {
		// let's see if we have any cookie message to show
		let msg = JstStorage.cookieStr('toast_msg', '');
		if (msg.length === 0) return;
		
		let type = JstStorage.cookieInt('toast_type', JstToast.INFO);
		let autoHide = JstStorage.cookieBool('toast_auto_hide', true);
		let delay = JstStorage.cookieInt('toast_delay', 3);
		
		window.JstToast.show(type, msg, autoHide, null, delay);
		JstStorage.unsetCookie('toast_msg');
		JstStorage.unsetCookie('toast_type');
		JstStorage.unsetCookie('toast_auto_hide');
		JstStorage.unsetCookie('toast_delay');
	});
	
})();
class Shomoy {
	
	#datetime;
	
	/**
	 * Create a shomoy object.
	 *
	 * @param {number|string|Date|Shomoy} datetime The value can a valid value that JS accepts
	 * for Date object. Moreover, another date or shomoy object can passed-in as value.
	 * By default, it creates from the current datetime.
	 * */
	constructor(datetime = new Date()) {
		if (datetime instanceof Date) this.#datetime = new Date(datetime.toISOString());
		else if (datetime instanceof Shomoy) this.#datetime = new Date(datetime.iso());
		else if (jQuery.type(datetime) === 'string') this.#datetime =  new Date(datetime);
		else if (jQuery.type(datetime) === 'number') this.#datetime =  new Date(datetime);
		else new Error('Invalid time value was passed');
	}
	
	/**
	 * Using this method, the starting millisecond of the shomoy can be calculated.
	 *
	 * @return {number} the starting millisecond of the shomoy object.
	 */
	shomoyStart() { return new Date(this.iso()).setHours(0, 0, 0, 0); }
	
	/**
	 * Using this method, the ending millisecond of the shomoy can be calculated.
	 *
	 * @return {number} the ending milliseconds of the shomoy object.
	 */
	shomoyEnd() { return this.shomoyStart() - 1 + Shomoy.msInDay(1); }
	
	/**
	 * A shomoy object can compare itself with other shomoy object. Internally it
	 * uses the valueOf() method of date object to calculate the difference in
	 * timestamp and returns either 0, 1, or -1 based on the calculation.
	 *
	 * @param {Shomoy} shomoy The Shomoy object to calculate against
	 *
	 * @return {number} int the difference between two shomoy objects. Returns 0 if both
	 * shomoy are equal, -1 if the comparing shomoy is bigger, otherwise 1.
	 * */
	compare (shomoy) {
		if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');
		
		let shomoyA = this.datetime.valueOf();
		let shomoyB = shomoy.dateTime.valueOf();
		
		if (shomoyA < shomoyB) return -1;
		else if (shomoyA > shomoyB) return 1;
		else return 0;
	}
	
	/**
	 * The difference between two shomoy objects can be calculated either in
	 * milliseconds(which is default) or microseconds(timestamp) value. It always
	 * finds the difference from $this object to passed one.
	 *
	 * @param {Shomoy} shomoy the Shomoy object to calculate the difference against
	 * @param {boolean} inMilli indicates whether to calculate in milliseconds or microseconds
	 * @return {number} the difference between two Shomoy objects.
	 * */
	diff(shomoy, inMilli = true) {
		if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');
		
		if (inMilli) return this.getMilliseconds() - shomoy.getMilliseconds();
		else return this.getTimestamp() - shomoy.getTimestamp();
	}
	
	/**
	 * Difference in hour with another shomoy object can be calculated. It internally
	 * uses Shomoy.diff() method.
	 *
	 * @param {Shomoy} shomoy A shomoy to calculate against
	 * @return {number} The difference from the passed-in shomoy
	 * */
	diffHour(shomoy) {
		if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');
		let diff = this.diff(shomoy, false);
		return diff / 3600;
	}
	
	/**
	 * Difference with another shomoy object can be calculated and returned as an array of components
	 * of time in order: sec, min, hour, day.
	 *
	 * @param {Shomoy} shomoy The shomoy object to calculate against
	 * @return {array} Containing time components
	 * */
	diffCompo(shomoy) {
		if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');
		
		let time = this.diff(shomoy, false);
		
		let secInDay = 60 * 60 * 24;
		
		// day
		let day = time / secInDay;
		let dayLeft = ~~day;
		
		// hour
		let hour = (day % 1) * 24;
		let hourLeft = ~~hour;
		
		// min
		let min = (hour % 1) * 60;
		let minLeft = ~~min;
		
		// sec
		let secLeft = (min % 1) * 60;
		
		// fix the round up second problem
		if (Math.round(secLeft) === 60) {
			secLeft = 0;
			minLeft += 1;
		}
		
		return [secLeft, minLeft, hourLeft, dayLeft];
	}
	
	/**
	 * Any number of milliseconds can be added to the Shomoy object using this method.
	 * Negative value can be added too.
	 *
	 * @param {number} ms number of milliseconds to be added.
	 * */
	addMs(ms) {
		ms = this.datetime.getMilliseconds() + ms;
		this.datetime.setMilliseconds(ms);
		return this;
	}
	
	/**
	 * Any number of seconds can be added to the Shomoy object using this method.
	 * Negative value can be added too.
	 *
	 * @param {number} sec number of seconds to be added.
	 * */
	addSec(sec) {
		sec = this.datetime.getSeconds() + sec;
		this.datetime.setSeconds(sec);
		return this;
	}
	
	/**
	 * Any number of minutes can be added to the Shomoy object using this method.
	 * Negative value can be added too.
	 *
	 * @param {number} min number of minutes to be added.
	 * */
	addMin(min) {
		min = this.datetime.getMinutes() + min;
		this.datetime.setMinutes(min);
		return this;
	}
	
	/**
	 * Any number of hours can be added to the Shomoy object using this method.
	 * It also takes negative hours which subtracts the hours from the shomoy,
	 *
	 * @param {number} hour number of hours to be added.
	 * */
	addHour(hour) {
		hour = this.datetime.getHours() + hour;
		this.datetime.setHours(hour);
		return this;
	}
	
	/**
	 * Any number of days can be added to the Shomoy object using this method.
	 * It also takes negative day which subtracts the days from the shomoy,
	 *
	 * @param {number} day number of days to be added.
	 * */
	addDay(day) {
		day = this.datetime.getDate() + day;
		this.datetime.setDate(day);
		return this;
	}
	
	/**
	 * Any number of months can be added to the Shomoy object using this method.
	 * Negative value can be added too.
	 *
	 * @param {number} month number of months to be added.
	 * */
	addMonth(month) {
		month = this.datetime.getMonth() + month;
		this.datetime.setMonth(month);
		return this;
	}
	
	/**
	 * Any number of years can be added to the Shomoy object using this method.
	 * Negative value can be added too.
	 *
	 * @param {number} year number of years to be added.
	 * */
	addYear(year) {
		year = this.year() + year;
		this.datetime.setFullYear(year);
		return this;
	}
	
	iso() { return `${this.year()}-${this.month()}-${this.date()} ${this.hour()}:${this.min()}:${this.sec()}`; }
	
	toString() { return this.iso(); }
	
	isoDate () { return this.iso().slice(0, 10); }
	
	isoTime() { return `${this.hour()}:${this.min()}:${this.sec()}`; }
	
	getMilliseconds () { return this.datetime.getTime(); }
	
	getTimestamp () { return this.getMilliseconds() / 1000; }
	
	getDate = () => this.#datetime.getDate();
	
	getMonth = () => this.#datetime.getMonth();
	
	getYear = () => this.#datetime.getFullYear();
	
	getDay = () => this.#datetime.getDay();
	
	getHours = () => this.#datetime.getHours();
	
	getMinutes = () => this.#datetime.getMinutes();
	
	getSeconds = () => this.#datetime.getSeconds();
	
	setYear = (year) => {
		this.#datetime.setYear(year);
		return this;
	}
	
	setMonth = (month) => {
		this.#datetime.setMonth(month);
		return this;
	}
	
	setDate = (date) => {
		this.#datetime.setDate(date);
		return this;
	}
	
	setHour = (hour) => {
		this.#datetime.setHours(hour);
		return this;
	}
	
	setMin = (min) => {
		this.#datetime.setMinutes(min);
		return this;
	}
	
	setSec = (sec) => {
		this.#datetime.setSeconds(sec);
		return this;
	}
	
	setMilli = (milli) => {
		this.#datetime.setMilliseconds(milli);
		return this;
	}
	
	valueOf = () => this.#datetime.valueOf();
	
	hour (twenty_four = true, lead0 = true) {
		let hour = this.datetime.getHours();
		if (!twenty_four) {
			hour = hour % 12;
			hour = hour === 0 ? 12 : hour;
		}
		return lead0 ? JstNum.lead0(hour) : hour;
	}
	
	min (lead0 = true) {
		let min = this.datetime.getMinutes();
		return lead0 ? JstNum.lead0(min) : min;
	}
	
	sec (lead0 = true) {
		let sec = this.datetime.getSeconds();
		return lead0 ? JstNum.lead0(sec) : sec;
	}
	
	year () { return this.datetime.getFullYear(); }
	
	month (lead0 = true) {
		let month = this.datetime.getMonth() + 1;
		return lead0 ? JstNum.lead0(month) : month;
	}
	
	date (lead0 = true) {
		let date = this.datetime.getDate();
		return lead0 ? JstNum.lead0(date) : date;
	}
	
	day(short = true) {
		let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let day = days[this.datetime.getDay()];
		return short ? day.slice(0, 3) : day;
	}
	
	monthStr(short = true) {
		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		let month = months[this.month() - 1];
		return short ? month.slice(0, 3) : month;
	}
	
	ampm(uppercase = true) {
		let hour = this.datetime.getHours() + 1;
		if (hour >= 12 && hour <= 23) {
			return uppercase ? 'PM' : 'pm';
		} else { return uppercase ? 'AM' : 'am'; }
	}
	
	strTime24(sec = true) {
		if (sec) return `${this.hour()}:${this.min()}:${this.sec()}`;
		else return `${this.hour()}:${this.min()}`;
	}
	
	strTime(sec = true, ampm = true, uppercase = true) {
		if (sec) {
			if (ampm)
				return `${this.hour(false)}:${this.min()}:${this.sec()} ${this.ampm(uppercase)}`;
			else
				return `${this.hour(false)}:${this.min()}:${this.sec()}`;
		} else {
			if (ampm)
				return `${this.hour(false)}:${this.min()} ${this.ampm(uppercase)}`;
			else
				return `${this.hour(false)}:${this.min()}`;
		}
	}
	
	strDate(separated = false) {
		if (separated) return `${this.date()}-${this.month()}-${this.year()}`;
		else return `${this.date()} ${this.monthStr(true)}, ${this.year()}`;
	}
	
	strDateTime() {
		return `${this.date()} ${this.monthStr()} ${this.year()}, ${this.hour()}:${this.min()}`;
	}
	
	get datetime () { return this.#datetime; }
	
	static isoNow = () => { return new Shomoy().iso(); };
	
	static secInMin(of) { return 60 * of; }
	
	static secInHour(of) { return 60 * 60 * of; }
	
	static secInDay(of) { return 60 * 60 * 24 * of; }
	
	static msInDay(of) { return 1000 * 60 * 60 * 24 * of; }
	
	static isoDate() { return new Shomoy().isoDate(); }
	
	static isoTime() { return new Shomoy().isoTime(); }
	
	static clone(shomoy) {
		if (!shomoy instanceof Shomoy) throw new Error('Argument must be instance of Shomoy.');
		return new Shomoy(shomoy);
	}
	
	/**
	 * For a specified month and year, it returns Date for the first of day of the month.
	 * <b>Month is not zero based. January is at 1.</b> If no month & year specified, it
	 * returns for the current month.
	 *
	 * @param {number} month Month
	 * @param {number} year Year
	 * @return {Date} Date object for the first of the month as specified
	 * */
	static firstDayOfMonth(month, year) {
		let now = new Shomoy();
		
		if (!Number.isSafeInteger(year)) year = now.getYear();
		month = !Number.isSafeInteger(month) ? now.getMonth() : month-1;
		
		now.setYear(year).setMonth(month).setDate(1).setHour(0).setMin(0).setSec(0).setMilli(0);
		return now.datetime;
	}
	
	/**
	 * For a specified month and year, it returns Date for the last of day of the month.
	 * <b>Month is not zero based. January is at 1.</b> If no month & year specified, it
	 * returns for the current month.
	 *
	 * @param {number} month Month
	 * @param {number} year Year
	 * @return {Date} Date object for the last of the month as specified
	 * */
	static lastDayOfMonth(month, year) {
		let shomoy = new Shomoy();
		
		if (!Number.isSafeInteger(year)) year = shomoy.getYear();
		month = !Number.isSafeInteger(month) ? shomoy.getMonth() : month-1;
		
		shomoy.setYear(year).setMonth(month+1).setDate(0).setHour(0).setMin(0).setSec(0).setMilli(0);
		return shomoy.datetime;
	}
	
	/**
	 * For a time range, specified by month & year pair in two arrays (since & to), it calculates
	 * start & end times in Shomoy for each week found within the range specified.
	 *
	 * End range it not inclusive.
	 *
	 * For each week, it composes objects containing array of time range. Both key & value can be
	 * derived using decorator functions. Decorator functions take on from and to shomoy objects
	 * in order. <b>End range is not inclusive.</b>
	 *
	 * If no range is specified, then the current month & year is calculated only.
	 *
	 * Months are not zero. January is always 1 in this case. The week start from Monday.
	 *
	 * @param {Array} since Containing the month and year in order.
	 * @param {Array} to Containing the month and year in order.
	 * @param {function(Shomoy, Shomoy)} keyDecFn Decorator function for keys.
	 * @param {function(Shomoy, Shomoy)} valDecFn Decorator function for values.
	 * @return {Array} Containing objects of time range values under keys as specified by decorator functions.
	 * */
	static listWeek(since = [], to = [], keyDecFn = null, valDecFn = null) {
		const WEEK_START = 1;
		
		let valDecorator = valDecFn || Shomoy.#valDecorator;
		let keyDecorator = keyDecFn || Shomoy.#weekKeyDecorator;
		
		let weeks = [];
		
		// get the limit parameters
		let now = new Date();
		
		let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth() + 1) ;
		let yearTo = to[1] || now.getFullYear();
		
		let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
		let yearFrom = since[1] || now.getFullYear();
		
		// build up shomoy objects for getting start and end limit
		let end = new Shomoy(Shomoy.firstDayOfMonth(monthTo, yearTo)).addSec(-1).valueOf();
		
		// construct a shomoy with given month and year
		let shomoy  = new Shomoy(Shomoy.firstDayOfMonth(monthFrom, yearFrom));
		
		// start with the 'from' month, where we may find broken week and discard that week
		let momStartDay = shomoy.getDay();
		if (momStartDay !== WEEK_START) {
			// find out how far the next week start day is
			// if it is sunday(0) which is one day to monday.
			let daysTo = (momStartDay === 0) ? 1 : 8 - momStartDay;
			shomoy.addDay(daysTo);
		}
		
		let makeStop = false;
		
		while (true) {
			if (makeStop) break;
			
			let currentMilli = shomoy.valueOf();
			
			// are we exceeding the limit?
			if (currentMilli >= end) {
				break;
			}
			
			let to = Shomoy.clone(shomoy);
			to.addDay(7).addSec(-1);
			
			let obj = {};
			let key1 = keyDecorator(shomoy, to);
			obj[key1] = valDecorator(shomoy, to);
			weeks.push(obj);
			
			shomoy.addDay(7);
		}
		
		return weeks;
	}
	
	/**
	 * For a time range, specified by month & year pair in two arrays (since & to), it calculates
	 * start & end times in Shomoy for each month found within the range specified. <b>End range
	 * is not inclusive.</b>
	 *
	 * If no range is specified, then the current month & year is calculated only.
	 *
	 * For each month, it composes objects containing array of time range. Both key & value can be
	 * derived using decorator functions. Decorator functions take on from and to shomoy objects
	 * in order.
	 *
	 * Months are not zero. January is always 1 in this case. The week start from Monday.
	 *
	 * @param {Array} since Containing the month and year in order.
	 * @param {Array} to Containing the month and year in order.
	 * @param {function(Shomoy)} keyDecFn Decorator function for keys.
	 * @param {function(Shomoy, Shomoy)} valDecFn Decorator function for values.
	 * @return {Array} Containing objects of time range values under keys as specified by decorator functions.
	 * */
	static listMonth(since = [], to = [], keyDecFn = null, valDecFn = null) {
		
		// get the limit parameters
		let now = new Date();
		
		let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
		let yearFrom = since[1] || now.getFullYear();
		
		let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth()) ;
		let yearTo = to[1] || now.getFullYear();
		
		let end = new Shomoy(Shomoy.lastDayOfMonth(monthTo, yearTo)).addHour(24).addSec(-1).valueOf();
		
		let shomoy = new Shomoy();
		shomoy.setMonth(monthFrom);
		shomoy.setYear(yearFrom);
		
		let valDecorator = valDecFn || Shomoy.#valDecorator;
		let keyDecorator = keyDecFn || Shomoy.#dayKeyDecorator;
		let result = [];
		
		while(true) {
			let shoA = new Shomoy(Shomoy.firstDayOfMonth(shomoy.getMonth(), shomoy.getYear()));
			let shoB = new Shomoy(Shomoy.lastDayOfMonth(shomoy.getMonth(), shomoy.getYear())).addHour(24).addSec(-1);
			shoA.valueOf();
			let b = shoB.valueOf();
			if (b > end) break;
			
			let obj = {};
			obj[keyDecorator(shomoy)] = valDecorator(shoA, shoB);
			result.push(obj);
			
			// keep going until break
			shomoy.addMonth(1);
		}
		
		return result;
	}
	
	/**
	 * This method adds given seconds, minutes, hours and day as seconds to current time. When no
	 * argument is set, then it returns current in milliseconds. All the argument's value will be
	 * converted into seconds before they get added to the current time in second except the sec
	 * argument.
	 *
	 * All the arguments values have to be of type number. If not, then an exception is thrown.
	 *
	 * This method can come in handy in situations like setting cookie value with expiration,
	 * calculating future date time etc.
	 *
	 * @param {number} sec Number of seconds is to be added to the current time in second.
	 * @param {number} min Number of minutes is to be added to the current time in second.
	 * @param {number} hour Number of hours is to be added to the current time in second.
	 * @param {number} day Number of days is to be added to the current time in second.
	 *
	 * @return {number} Seconds added to the current time as defined by the arguments.
	 *
	 * @throws {Error} If all the arguments are not of type integer
	 * */
	addToNow(sec = 0, min = 0, hour = 0, day = 0) {
		if (Number.isNaN(day) || Number.isNaN(hour) || Number.isNaN(min) || Number.isNaN(sec))
			throw new Error('Make sure day, hour and minute are of type number.');
		
		let now = new Date().valueOf();
		
		if (sec !== 0) now += sec;
		if (min !== 0) now += min * 60;
		if (hour !== 0) now += hour * 60 * 60;
		if (day !== 0) now += day * 24 * 60 * 60;
		
		return now;
	}
	
	/**
	 * Default value decorator
	 *
	 * @param {Shomoy} from
	 * @param {Shomoy} to
	 * */
	static #valDecorator(from, to) {
		let start = from.getTimestamp();
		let end = to.getTimestamp();
		return [start, end];
	};
	
	/**
	 * Default week key decorator
	 *
	 * @param {Shomoy} from
	 * @param {Shomoy} to
	 * */
	static #weekKeyDecorator(from, to) {
		let month = from.getMonth() !== to.getMonth() ? `${from.monthStr()}-${to.monthStr()}` : `${from.monthStr()}`;
		let year = from.getYear() !== to.getYear() ? `${from.year()}-${to.year()}` : `${from.year()}`;
		return `${from.date()}-${to.date()} ${month}, ${year}`;
	};
	
	/**
	 * Default day key decorator
	 *
	 * @param {Shomoy} month
	 * */
	static #dayKeyDecorator(month) {
		return `${month.monthStr()} ${month.year()}`;
	};
	
}
