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