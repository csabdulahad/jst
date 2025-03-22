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