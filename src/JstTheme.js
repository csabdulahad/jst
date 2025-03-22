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
