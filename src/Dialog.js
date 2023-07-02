(() => {
    class Dialog {

        #id;
        #selfId;

        #dismissed = false;
        #hidden = false;
        #cancelable = true;

        // indicates whether it is a dark themed dialog
        #dark;

        #close;
        #title;
        #msg;

        #dialog;
        #msgEle;
        #titleEle;
        #btnYes;
        #btnNo;
        #btnAck;

        #callbackYes;
        #callbackNo;
        #callbackAck;
        #callbackHide;
        #callbackDismiss;
        #callbackRevived;

        /**
         * @param {string} id
         * */
        constructor(id) {
            this.#id = id;
            this.#selfId = `jst-dialog-${id}`;
            jst.run(() => this.#injectDOM());
        }

        #checkIfDismissed() {
            if (this.#dismissed) throw new Error('Dialog was dismissed. Create a fresh one!');
        }

        #injectDOM() {
            const dialog = `
                <div class="jst-modal" id="${this.#selfId}">
                    <div class="jst-modal-flex">
                        <div class="jst-modal-flex-child">
                            <div class="jst-modal-header">
                                <h5 id="jst-dialog-title"></h5>
                                <span class="material-icons jst-modal-icon-close" title="Close window">close</span>
                            </div>
                            <div class="jst-modal-content">
                                <div id="jst-dialog-msg"></div>
                            </div>
                            <div class="jst-dialog-btn">
                                <button id="jst-dialog-btn-yes" class="jst-btn jst-btn-sm jst-btn-red">Yes</button>
                                <button id="jst-dialog-btn-no"  class="jst-btn jst-btn-sm jst-btn-dark">No</button>
                                <button id="jst-dialog-btn-ack" class="jst-btn jst-btn-sm jst-btn-teal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            $('body').prepend(dialog);

            this.#dialog = $(`#${this.#selfId}`);

            this.#close = jst.getChildOf('.jst-modal-icon-close', this.#dialog);
            this.#titleEle = jst.getChildOf('#jst-dialog-title', this.#dialog);
            this.#msgEle = jst.getChildOf('#jst-dialog-msg', this.#dialog);

            let buttons = jst.getChildrenOf('.jst-dialog-btn', this.#dialog);
            this.#btnYes = buttons[0];
            this.#btnNo = buttons[1];
            this.#btnAck = buttons[2];
        }

        #prepare(width, height, padding) {
            // hide yes & no buttons if it is an acknowledgment dialog
            if (!this.#callbackYes && !this.#callbackNo) {
                $(this.#btnYes).hide();
                $(this.#btnNo).hide();
                $(this.#btnAck).show();
            } else {
                $(this.#btnYes).show();
                $(this.#btnNo).show();
                $(this.#btnAck).hide();
            }

            // set the width & height
            let dialogFlexChild = jst.getChildOf('.jst-modal-flex-child', this.#dialog);
            $(dialogFlexChild).css('width', width);
            $(dialogFlexChild).css('height', height);

            $(this.#msgEle).css('padding', padding);

            let cntWrapper = jst.getChildOf('.jst-modal-content', this.#dialog)
            jst.overlayScrollbar(cntWrapper);
        }

        #applyTheme() {
            OverlayManager.theme(this.#dark);

            let ele = jst.getChildOf('.jst-modal-flex-child', this.#dialog);
            jst.switchCls(this.#dark, 'jst-modal-flex-child-dark', ele);

            ele = jst.getChildOf('.jst-modal-header', this.#dialog);
            jst.switchCls(this.#dark, 'jst-modal-header-dark', ele);

            ele = jst.getChildOf('.jst-modal-icon-close', this.#dialog);
            jst.switchCls(this.#dark, 'jst-modal-icon-close-dark', ele);

            ele = jst.getChildOf('.jst-dialog-btn', this.#dialog);
            jst.switchCls(this.#dark, 'jst-dialog-btn-dark', ele);
        }

        #setCloseIconListener() {
            $(this.#close).on('click', () => this.dismiss());
        }

        #setBtnListener() {
            $(this.#btnYes).on('click', () => { this.#dispatchBtnEvent(1); });
            $(this.#btnNo).on('click', () => { this.#dispatchBtnEvent(-1); });
            $(this.#btnAck).on('click', () => { this.#dispatchBtnEvent(0); });
        }

        #dispatchBtnEvent(result) {
            if (result === 0 && this.#callbackAck) this.#callbackAck();
            else if (result === 1 && this.#callbackYes) this.#callbackYes();
            else if(this.#callbackNo) this.#callbackNo();
        }

        #updateCloseIcon() {
            let closeIcon = jst.getChildOf('.jst-modal-icon-close', this.#dialog);
            if (!this.#cancelable) $(closeIcon).fadeOut(250);
            else $(closeIcon).fadeIn(250);
        }

        #updateTitle() {
            // get the dialog title
            let title =  this.#title || 'jstea Dialog 😎';
            $(this.#titleEle).html(title);
        }

        /**
         * Sets a callback to be notified when user clicks the ok button on the dialog
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        yes(callback) {
            this.#callbackYes = callback;
            this.#callbackAck = null;
            return this;
        }

        /**
         * Sets a callback to be notified when user clicks the no button on the dialog
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        no(callback) {
            this.#callbackNo = callback;
            this.#callbackAck = null;
            return this;
        }

        /**
         * Sets a callback to be notified when user clicks the ok button on the dialog
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        acknowledge(callback) {
            this.#callbackAck = callback;
            return this;
        }

        /**
         * Sets a callback to be notified when the dialog has been hidden
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        onHide(callback) {
            this.#callbackHide = callback;
            return this;
        }

        /**
         * Sets a callback to be notified when the dialog has been dismissed
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        onDismiss(callback) {
            this.#callbackDismiss = callback;
            return this;
        }

        /**
         * This method is invoked when a dialog is in display and users hits the escape button.
         * OverlayManager calls this method automatically.
         * <br><b>This method should be called directly.</b>
         *
         * @param event {Event} Keyup event object passed in by the OverlayManger
         * */
        onEscapeEvent(event) {
            if (this.#cancelable) this.dismiss();
        }

        /**
         * Sets a callback to be notified when the dialog is being shown from hidden state.
         *
         * @param {function()} callback Function to be invoked
         * @return Dialog
         * */
        onRevived(callback) {
            this.#callbackRevived = callback;
            return this;
        }

        /**
         * Sets the dialog title
         *
         * @param title {string} Dialog title
         * @return Dialog
         * */
        title(title) {
            this.#title = title;
            return this;
        }

        /**
         * Sets the dialog message. It can be html or string value
         *
         * @param msg {string} Dialog title
         * @return Dialog
         * */
        msg(msg) {
            this.#msg = msg;
            return this;
        }

        #show(option) {
            this.#checkIfDismissed();

            let {w = 430, h = 'auto', pad = '1rem', cancelable = true} = option;
            this.#cancelable = cancelable;

            this.#prepare(w, h, pad);
            this.#setCloseIconListener();
            this.#setBtnListener();
            this.#applyTheme();

            this.#updateCloseIcon();
            this.#updateTitle();

            let msg = this.#msg ?? 'No dialog message.';
            $(this.#msgEle).html(msg);

            OverlayManager.acquire(this);
            $(this.#dialog).fadeIn(250);

            this.#hidden = false;
        }

        /**
         * Shows the dialog
         *
         * @param {object=} option Optional values: w=450, h=auto, cancelable=true, padding=1rem
         * @param {number|string=} option.w - The width in px. Max value is 75% of the window's inner width.
         * @param {number|string=} option.h - The height in px. Max height is 75% of the window's inner height.
         * @param {string=} option.pad - The padding in px
         * @param {boolean=} option.cancelable - Flag makes the dialog cancellation status
         * */
        show(option = {}) {
            if (OverlayManager.notReady()) {
                // show after a bit of delay to avoid overlay animation glitch because of caching
                jst.runLater(0.05, () => this.#show(option));
            } else this.#show(option);
        }

        /**
         * OverlayManager invokes this method when the dialog is being shown from hidden
         * state.
         * <br><b>It should be called directly.</b>
         * */
        makeVisible() {
            this.#hidden = false;
            this.#applyTheme();
            $(this.#dialog).fadeIn(250);
            if (this.#callbackRevived) this.#callbackRevived();
        }

        /**
         * Hides the dialog
         * */
        hide() {
            this.#checkIfDismissed();
            this.#hidden = true;
            $(this.#dialog).fadeOut(250);
            if (this.#callbackHide) this.#callbackHide();
        }

        /*
        * Dismisses the dialog
        * */
        dismiss() {
            if (this.#dismissed) return;
            this.#dismissed = true;

            OverlayManager.release(this);
            $(this.#dialog).fadeOut(250);

            // remove the dom
            $(this.#dialog).remove();

            if (this.#callbackDismiss) this.#callbackDismiss();
        }

        /**
         * Set the dialog cancelable. UI element gets updated behind the scene.
         *
         * @return {Dialog}
         * */
        cancelable() {
            this.#cancelable = true;
            return this;
        }

        /**
         * Sets the dialog not cancelable. UI element gets updated automatically.
         *
         * @return {Dialog}
         * */
        notCancelable() {
            this.#cancelable = false;
            return this;
        }

        /**
         * Sets dark theme to the dialog
         *
         * @return Dialog
         * */
        dark() {
            this.#dark = true;
            return this;
        }

        /**
         * Sets light theme to the dialog
         *
         * @return Dialog
         * */
        light() {
            this.#dark = false;
            return this;
        }

        get id() {
            return this.#id;
        }

        /**
         * Changes the dialog message. It can be html or string value
         *
         * @param msg {string} Dialog message
         * */
        setMsg(msg) {
            this.#msg = msg;
            $(this.#msgEle).html(msg);
        }

        /**
         * Sets the dialog title. It can be html or string value
         *
         * @param title {string} Dialog title
         * */
        setTitle(title) {
            this.#title =  title;
            this.#updateTitle();
        }

        /**
         * Applies dark theme to the dialog
         * */
        makeDark() {
            this.#dark = true;
            this.#applyTheme();
        }

        /**
         * Applies light theme to the dialog
         * */
        makeLight() {
            this.#dark = false;
            this.#applyTheme();
        }

        /**
         * Changes the non-cancelable dialog to cancelable
         * */
        makeCancelable() {
            this.#cancelable = true;
            this.#updateCloseIcon();
        }

        /**
         * Changes the cancelable dialog to non-cancelable
         * */
        makeNotCancelable() {
            this.#cancelable = false;
            this.#updateCloseIcon();
        }

        /**
         * Hides the dialog button as specified by argument
         *
         * @param {'yes' | 'no' | 'ok'} choice
         * */
        hideChoice(choice) {
            let btn;
            if (choice === 'yes') btn  = this.#btnYes;
            else if (choice === 'no') btn  = this.#btnNo;
            else if (choice === 'ok') btn  = this.#btnAck;
            if (btn) $(btn).fadeOut(500);
        }

        /**
         * Shows the dialog button as specified by argument
         *
         * @param {'yes' | 'no' | 'ok'} choice
         * */
        showChoice(choice) {
            let btn;
            if (choice === 'yes') btn  = this.#btnYes;
            else if (choice === 'no') btn  = this.#btnNo;
            else if (choice === 'ok') btn  = this.#btnAck;
            if (btn) $(btn).fadeIn(500);
        }

    }

    /**
     * Creates a new dialog and gets added to DOM
     *
     * @param {string} id The dialog id. It can be used later to dismiss the dialog
     * @return {Dialog} new dialog
     * */
    window.Dialog = (id) => new Dialog(id);

})();