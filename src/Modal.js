/**
* Modal class really simplifies showing modal in the web page. It adds overlay div
* on construction. Method show and hide can be configured with object-config and callback
* functions.
*
* Any div marked with jst-modal will become ready to be shown as modal.
* data-jst-modal-title attribute can add the title to the modal from HTML markup.
* optionally Modal.title() can be invoked for title.
*
* Modal can also be configured with dark() and light() method where appropriate styles are
* applied behind the scene.
*
* The overall layout structure is like the following.
*
*       <div .jst-overlay>
*       <div.jst-modal>
*           <div.jst-modal-flex>
*               <div.jst-modal-flex-child>
*                   <div.jst-modal-header>
*                       <h5.jst-modal-title>
*                       <span.jst-modal-icon-close>
*                   <div.jst-modal-content>
* */

(() => {

    class Modal {

        #id;

        #dismissed = false;
        #hidden = false;

        #dismissCallback;
        #hideCallback;

        // callback invoked when modal is shown from hidden state
        #revivedCallback;

        // whether the modal will be closeable by Esc keyup event or clicking outside the modal
        #cancelable = false;

        #dark = false;
        #title;
        #padding;

        #modal = null;

        /**
        * @param {string} id
        * */
        constructor(id) {
            this.#id = id;
        }

        #checkIfDismissed() {
            if (this.#dismissed) throw new Error('Modal was dismissed. Create a fresh one!');
        }

        #adjustModalSize(width, height) {
            let ele = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            $(ele).css('width', width);
            $(ele).css('height', height);
        }

        #applyTheme() {
            OverlayManager.theme(this.#dark);

            let  ele = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            jst.switchCls(this.#dark, 'jst-modal-flex-child-dark', ele);

            ele = jst.getChildOf('.jst-modal-header', this.#modal);
            jst.switchCls(this.#dark, 'jst-modal-header-dark', ele);

            ele = jst.getChildOf('.jst-modal-icon-close', this.#modal);
            jst.switchCls(this.#dark, 'jst-modal-icon-close-dark', ele);
        }

        #updateCloseIcon() {
            let closeIcon = jst.getChildOf('.jst-modal-icon-close', this.#modal);
            if (!this.#cancelable) $(closeIcon).fadeOut(250);
            else $(closeIcon).fadeIn(250);
        }

        #updateTitle() {
            // get the modal title
            let title =  this.#title || 'jstea Modal 😎';
            $(jst.getChildOf('.jst-modal-title', this.#modal)).html(title);
        }

        #setCloseIconCallback() {
            let btn = jst.getChildOf('.jst-modal-icon-close', this.#modal);
            jst.click(btn, () => this.dismiss());
        }

        #injectDOM() {
            let modalFlex = jst.getChildOf('.jst-modal-flex', this.#modal);

            // check whether the modal dom has already been injected
            if (jst.isDef(modalFlex)) return;

            // wrap all the content of the div of class jst-modal inside the jst-modal-flex
            // so that we can show the modal as display flex where the position x & y will be automatic.
            let modalFlexHtml = `<div class="jst-modal-flex"><div class="jst-modal-flex-child"><div  class="jst-modal-content"></div></div></div>`;
            $($(this.#modal).contents()).wrapAll(modalFlexHtml);

            // adjust padding
            $(this.#modal).find('.jst-modal-content').css('padding', this.#padding);

            let modalFlexChild = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            let modalHeader = `
                <div class="jst-modal-header">
                    <h5 class="jst-m-0 jst-p-0 jst-modal-title"></h5>
                    <span class="material-icons jst-modal-icon-close" title="Close window">close</span>
                </div>
            `;
            $(modalFlexChild).prepend(modalHeader);

            // initiate the scrollbar for the modal content
            let modalContent = jst.getChildOf('.jst-modal-content', modalFlexChild);
            jst.overlayScrollbar(modalContent);
        }

        /**
         * Sets a callback to be notified when user closes the modal or pressed the escape
         * button.
         *
         * @param callback {function} Function to be invoked when the modal is dismissed
         * @return Modal
         * */
        onDismiss(callback) {
            this.#dismissCallback = callback;
            return this;
        }

        /**
         * Sets a callback to be notified when the modal is going to be hidden
         *
         * @param callback {function} Function to be invoked when the modal just has been hidden
         * @return Modal
         * */
        onHide(callback) {
            this.#hideCallback = callback;
            return this;
        }

        /**
         * Sets a callback to be notified when the modal is being shown from hidden state.
         *
         * @param {function()} callback Function to be invoked when the modal is being shown from hidden state
         * @return Modal
         * */
        onRevived(callback) {
            this.#revivedCallback = callback;
            return this;
        }

        /**
         * This method is invoked when a modal is in display and users hits the escape button.
         * OverlayManager calls this method automatically.
         * <br><b>This method should be called directly.</b>
         *
         * @param event {object} Keyup event object passed in by the OverlayManger
         * */
        onEscapeEvent(event) {
            if (this.#cancelable) this.dismiss();
        }

        #show(option) {
            this.#checkIfDismissed();

            let {w=450, h = 'auto', pad = '1rem', cancelable = true} = option;

            this.#id = jst.id(this.#id);
            this.#modal = $(jst.eleId(this.#id));
            this.#cancelable = cancelable;
            this.#padding = pad;

            this.#injectDOM();
            this.#setCloseIconCallback();
            this.#adjustModalSize(w, h);
            this.#updateTitle();
            this.#updateCloseIcon();
            this.#applyTheme();

            // acquire the overlay & show the modal
            OverlayManager.acquire(this);
            this.#modal.fadeIn(250);

            this.#hidden = false;
        }

        /**
         * Shows the modal
         *
         * @param {object=} option Optional values: w=450, h=auto, cancelable=true, padding=1rem
         * @param {number|string=} option.w - The width of the modal in px. Max value is 75% of the window's inner width.
         * @param {number|string=} option.h - The height of the modal in px. Max height is 75% of the window's inner height.
         * @param {string=} option.pad - The padding of the modal in px
         * @param {boolean=} option.cancelable - Flag makes the modal cancellation status
         * */
        show(option = {}) {
            if (OverlayManager.notReady()) {
                // show after a bit of delay to avoid overlay animation glitch because of caching
                jst.runLater(0.05, () => this.#show(option));
            } else this.#show(option);
        }

        /*
        * Dismisses the modal
        * */
        dismiss() {
            if (this.#dismissed) return;
            this.#dismissed = true;

            OverlayManager.release(this);
            $(this.#modal).fadeOut(250);
            if (this.#dismissCallback) this.#dismissCallback();
        }

        /**
         * Hides the modal
         * * */
        hide() {
            if (this.#dismissed) return;

            this.#hidden = true;

            $(this.#modal).fadeOut(250);
            if (this.#hideCallback) this.#hideCallback();
        }

        /**
         * OverlayManager invokes this method when the modal is being shown from hidden
         * state.
         * <br><b>It should be called directly.</b>
         * */
        makeVisible() {
            this.#hidden = false;
            this.#applyTheme();
            $(this.#modal).fadeIn(250);
            if (this.#revivedCallback) this.#revivedCallback();
        }

        /**
         * Sets dark theme to the modal
         *
         * @return Modal
         * */
        dark() { this.#dark = true; return this; }

        /**
         * Sets light theme to the modal
         *
         * @return Modal
         * */
        light() { this.#dark = false; return this; }

        /**
         * Changes the modal title. It overrides the title defined in the data
         * attribute by data-jst-modal-title.
         *
         * @param value {string} Modal title
         * @return Modal
         * */
        title(value) {
            this.#title = value;
            return this;
        }

        /**
         * Makes the modal not cancelable. UI element gets updated automatically.
         *
         * @return {Modal}
         * */
        notCancelable() {
            this.#cancelable = false;
            return this;
        }

        /**
         * Makes the modal cancelable. UI element gets updated behind the scene.
         *
         * @return {Modal}
         * */
        cancelable() {
            this.#cancelable = true;
            return this;
        }

        /**
         * Tells whether the modal is shown or not
         *
         * @return {boolean} true if the modal is shown, false otherwise
         * */
        shown() {
            return !this.hidden;
        }

        get hidden() {
            return this.#hidden;
        }

        get dismissed() {
            return this.#dismissed;
        }

        get id () {
            return this.#id;
        }

        /**
         * Sets the modal title. It can be html or string value
         *
         * @param title {string} Modal title
         * */
        setTitle(title) {
            this.#title =  title;
            this.#updateTitle();
        }

        /**
         * Applies dark theme to the modal
         * */
        makeDark() {
            this.#dark = true;
            this.#applyTheme();
        }

        /**
         * Applies light theme to the modal
         * */
        makeLight() {
            this.#dark = false;
            this.#applyTheme();
        }

        /**
         * Changes the non-cancelable modal to cancelable
         * */
        makeCancelable() {
            this.#cancelable = true;
            this.#updateCloseIcon();
        }

        /**
         * Changes the non-cancelable modal to cancelable
         * */
        makeNotCancelable() {
            this.#cancelable = false;
            this.#updateCloseIcon();
        }


    }

    /**
     * Any DOM element marked with class .jst-modal and id can be modal-ed.
     *
     * @param {string|HTMLElement} id - It can be the id with/without '#' or the html element object which
     * is to be shown as modal.
     * @return {Modal} new modal
     * */
    window.Modal = (id) => new Modal(id);

})();
