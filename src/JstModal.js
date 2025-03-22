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