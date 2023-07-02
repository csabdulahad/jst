
/**
 * It is a generic implementation for active navigation component.
 *
 * It has two callbacks. one of which handles situations such as how it handles
 * the active link styling and expending the category div for that active link it
 * is from a category.
 *
 * Second callback takes responsibility for expending the category div expending,
 * hiding previously expanded category and updating active link styling as this
 * can vastly tackle situations for SPA application.
 *
 * Default marking for wrapper CSS class is 'jst-nav-cat' and default active link
 * highlighting CSS class is 'jst-nav-act'.
 * */

class ActiveNav {

    /** represent different type of animation **/
    static SLIDE = 1;
    static FADE = 2;
    static TOGGLE = 3;

    #navId;

    // indicates the CSS class which is used to mark top-level link of for navigation.
    #wrapperCls = 'jst-nav-link';

    /**
     * when an active link can be found inside the nav as specified by navId,
     * this callback gets called.
     *
     * this callback gets the object with various information about the active
     * link as per the document hyper reference. the main job this callback is
     * how it can design active link if it is a direct active link or how it
     * shows the links div of category which has the active link inside.
     *
     * The passed object has the following:
     *
     *     activeDom    - the 'a' element which is the active link
     *     wrapper      - holder div of '.jst-nav-cat', inside whom the active link is found
     *     directChild  - flags whether the active link is single direct link having no category
     *                    or is from a category.
    */
    #decorCallback;

    /**
     * This callback mainly handles the default behavior for expending the link-to-open-category.
     * It shows and hides the category based on their click event and visibility(toggling).
     *
     * It gets the div element which acts as wrapper div for the links of the category so that it
     * can toggle, store/restore the active link dom element correctly.
     * */
    #navCatHook;

    // holds currently expanded category div element
    #activeCat = null;

    // animation speed for opening category or hiding
    #speed = 400;

    // default animation is slide down & slide up
    #anim = ActiveNav.SLIDE;

    // icons to be show next to the expended category div link
    #arrowDown = 'expand_more';
    #arrowUp = 'expand_less';

    constructor(navId) {
        this.#navId = navId;

        // default active link styling and expending category handler
        this.#decorCallback = (obj) => {

            // remove active css class from any active element first because
            // we may have active nav for an SPA(Single Page Application); who knows!
            let actEle = $($(`#${this.#navId}`).children()).find('.jst-nav-act');
            $(actEle).removeClass('jst-nav-act');
            $(obj.actDom).addClass('jst-nav-act');

            if (!obj.directChild) {
                // look for 2nd child; if we don't have then it is either a direct
                // link or has no links for the category.
                let children = $(obj.wrapper).find('.jst-nav-cat');
                if (!children) return;

                this.#animate(children, true, obj.wrapper);
            } else {
                // hide actively shown links of category as it is working for SPA.
                if (this.#activeCat) {
                    this.#animate(this.#activeCat, false, obj.wrapper);
                    this.#activeCat = null;
                }
            }

        };

        // default navigation category or direct link click event handler
        this.#navCatHook = (wrapperCatEle) => {

            // default nav cat hook callback implementation assumes that the second
            // element holds the links of the category so that it can toggle the
            // visibility; this implementation can be replaced by providing custom
            // hook callback.

            // hide there is already an active category
            if (this.#activeCat) {
                let parent = $(this.#activeCat).closest('.jst-nav-link');
                this.#animate(this.#activeCat, false, parent);
            }

            let children = $(wrapperCatEle).find('.jst-nav-cat');
            if (!children) return;

            // are we toggling?
            if ($(children).is(this.#activeCat)) {
                this.#activeCat = null;
                return;
            }

            // it is not toggling so show the requested the links for the category
            if (!children) return;
            this.#animate(children, true, wrapperCatEle);
            this.#activeCat = children;
        };

        // add click listener to the first element of the wrapperCls marked container
        // for delegating event to navCatHook callback.
        $(`#${navId} .${this.#wrapperCls}`).each((index, ele) => {
            let children = $(ele).children();
            if (children.length < 1) return;

            $(children).first().click(() => this.#navCatHook(ele));
        });

        // initialize all the icons into default arrow position
        $(`#${navId} .jst-nav-arrow`).html(this.#arrowDown);
    }

    #animate(ele, motion, wrapperDiv) {
        let arrow = $(wrapperDiv).children().first().find('.jst-nav-arrow');
        let icon = motion ? this.#arrowUp : this.#arrowDown;

        if (this.#anim === ActiveNav.FADE) {
            if (motion) $(ele).fadeIn(this.#speed, () => $(arrow).html(icon));
            else $(ele).fadeOut(this.#speed, () => $(arrow).html(icon));
        }

        else if (this.#anim === ActiveNav.TOGGLE) {
            if (motion) $(ele).show(this.#speed, () => $(arrow).html(icon));
            else $(ele).hide(this.#speed, () => $(arrow).html(icon));
        }

        else {
            if (motion) $(ele).slideDown(this.#speed, () => $(arrow).html(icon));
            else $(ele).slideUp(this.#speed, () => $(arrow).html(icon));
        }
    }

    #updateArrow(lastDown, lastUp) {
        let iconDom = $(`#${this.#navId}`).find('.jst-nav-arrow');
        $(iconDom).each((index, ele) => {
            let content = $(ele).html();
            if (content === lastDown) $(ele).html(this.#arrowDown);
            else if (content === lastUp) $(ele).html(this.#arrowUp);
        });

    }

    arrowDown(html) {
        let lastVal = this.#arrowDown;
        this.#arrowDown = html;
        this.#updateArrow(lastVal, null);
        return this;
    }

    arrowUp(html) {
        let lastVal = this.#arrowUp;
        this.#arrowUp = html;
        this.#updateArrow(null, lastVal);
        return this;
    }

    animFn(type) {
        this.#anim = type;
        return this;
    }

    animSpeed(speed) {
        this.#speed = speed;
        return this;
    }

    decorCallback(callback) {
        this.#decorCallback = callback;
        return this;
    }

    navCatHook(callback) {
        this.#navCatHook = callback;
        return this;
    }

    find (href = '') {
        // get the path
        let pathName = new URL(document.location).href;

        if (href.length > 0) pathName = href;

        let dom;
        for(let a of $(`#${this.#navId} a`)) {
            if (a.href === pathName) {
                dom = a;
                break;
            }
        }

        if(!this.#decorCallback) return;

        if (jst.isUndef(dom)) {
            this.#decorCallback({});
            return;
        }

        let obj = {};
        obj.actDom = dom;
        obj.wrapper = $(dom).closest(`.${this.#wrapperCls}`);
        obj.directChild = $(dom).parent().is(obj.wrapper);
        this.#decorCallback(obj);
    }

}
