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