
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
