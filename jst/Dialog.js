(() => {
    class DialogCls {

        #ready = false;

        #cancelable = true;
        #w;
        #h;
        #padding;

        // indicates whether it is a dark themed dialog
        #dark;

        #dialog;
        #close;
        #title;
        #msg;
        #btnYes;
        #btnNo;
        #btnAck;

        #callbackYes;
        #callbackNo;
        #callbackAsk;
        #callbackAck;
        #callbackCancel;

        constructor() {
            jst.run(() => {
                // add the dialog to the DOM
                const dialog = `
                    <div class="jst-modal" id="jst-dialog">
                        <div class="jst-modal-flex">
                            <div class="jst-modal-flex-child">
                                <div class="jst-modal-header">
                                    <h5 id="jst-dialog-title"></h5>
                                    <span class="material-icons jst-modal-icon-close" onclick="Dialog.cancel()" title="Close window">close</span>
                                </div>
                                <div id="jst-dialog-msg" class="jst-modal-content"></div>
                                <div class="jst-dialog-btn">
                                    <button id="jst-dialog-btn-yes" class="jst-btn jst-btn-sm jst-btn-red">Yes</button>
                                    <button id="jst-dialog-btn-no"  class="jst-btn jst-btn-sm jst-btn-dark">No</button>
                                    <button id="jst-dialog-btn-ack" class="jst-btn jst-btn-sm jst-btn-teal">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $('body').prepend(dialog);

                this.#dialog = $('#jst-dialog')[0];

                this.#close = jst.getChildOf('.jst-modal-icon-close', this.#dialog);
                this.#title = jst.getChildOf('#jst-dialog-title', this.#dialog);
                this.#msg = jst.getChildOf('#jst-dialog-msg', this.#dialog);

                // get all the buttons
                let buttons = jst.getChildrenOf('.jst-dialog-btn', this.#dialog);
                this.#btnYes = buttons[0];
                this.#btnNo = buttons[1];
                this.#btnAck = buttons[2];

                // add click listeners to the buttons
                $(this.#btnYes).click(() => { this.#dialogResponse(1); });
                $(this.#btnNo).click(() => { this.#dialogResponse(-1); });
                $(this.#btnAck).click(() => { this.#dialogResponse(0); });

                this.#ready = true;
            });
        }

        yes(callback) {
            this.#callbackYes = callback;
            this.#callbackAck = null;
            return this;
        }

        no(callback) {
            this.#callbackNo = callback;
            this.#callbackAck = null;
            return this;
        }

        ask(callback) {
            this.#callbackAsk = callback;
            this.#callbackAck = null;
            return this;
        }

        acknowledge(callback) {
            this.#callbackAck = callback;
            return this;
        }

        onCancel(callback){
            this.#callbackCancel = callback;
            return this;
        }

        show(msg, options = {}) {
            // hide previously showing modal if there is any
            this.hide(false);

            let {title = 'Warning', cancelable = true, w = 430, h = 'auto', padding = '1rem'} = options;
            this.#cancelable = cancelable;
            this.#w = w;
            this.#h =  h;
            this.#padding = padding;

            msg = msg || 'No dialog message.';

            this.#prepare();
            this.#addListener();

            // set the title & msg
            $(this.#title).html(title);
            $(this.#msg).html(msg);

            // if we are showing from a dialog then hide the modal
            Modal.visibility(false);

            OverlayManager.request('dialog');
            $(this.#dialog).fadeIn(250);
        }

        // if this is a request to show another dialog while one is being shown, then don't
        // hide the overlay to avoid glitch animation effect and also don't fade out the dialog
        // itself for the same reason.
        hide(overlayHiding = true) {
            if (OverlayManager.isNoReady()) {
                alert('Overlay manager could not instantiate properly.');
                return;
            }

            if (!this.#ready) {
                alert('Dialog could not instantiate properly.');
                return;
            }

            // if for any reason, the dialog is being hidden or shown from a model, then
            // maintain the modal visibility state accordingly.
            Modal.visibility(true);

            if (overlayHiding) OverlayManager.remove('dialog');
            if(overlayHiding) $(this.#dialog).fadeOut(250);
        }

        cancel() { this.#dialogResponse(-2); }

        #dialogResponse(result) {
            this.hide();

            if (result === 0 && this.#callbackAck) this.#callbackAck();
            else if (result === -2 && this.#callbackCancel) this.#callbackCancel();
            else if (result === 1  && this.#callbackYes) this.#callbackYes();
            else if (result === -1 && this.#callbackNo) this.#callbackNo();

            this.#removeListener();
        }

        #prepare() {
            // hide yes & no buttons if it is an acknowledgment dialog
            if (!this.#callbackYes && !this.#callbackNo && !this.#callbackAsk) {
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
            $(dialogFlexChild).css('width', this.#w);
            $(dialogFlexChild).css('height', this.#h);

            $(this.#msg).css('padding', this.#padding);

            // update the close icon accordingly
            $(this.#close).toggle(this.#cancelable);

            this.#applyTheme();
        }

        #addListener() {
            if (!this.#cancelable) return;

            // add click listener to the dialog flex for click on outside hiding dialog.
            let dialogFlex = jst.getChildOf('.jst-modal-flex', this.#dialog);
            $(dialogFlex).click((e) => {
                if (e.target !== dialogFlex) return;
                this.#dialogResponse(-2);
            });
        }

        #removeListener() {
            // reset all the callbacks
            this.#callbackAsk = null;
            this.#callbackYes = null;
            this.#callbackNo = null;
            this.#callbackAck = null;
            this.#callbackCancel = null;

            // get rid of dialog outside click listener
            let dialogFlex = jst.getChildOf('.jst-modal-flex', this.#dialog);
            $(dialogFlex).off('click');
        }

        #applyTheme() {
            let toggleDark = (ele, themeCls) => {
                if (this.#dark) $(ele).addClass(themeCls);
                else $(ele).removeClass(themeCls);
            }

            let ele = jst.getChildOf('.jst-overlay', $('body'));
            toggleDark(ele, 'jst-overlay-dark');

            ele = jst.getChildOf('.jst-modal-flex-child', this.#dialog);
            toggleDark(ele, 'jst-modal-flex-child-dark');

            ele = jst.getChildOf('.jst-modal-header', this.#dialog);
            toggleDark(ele, 'jst-modal-header-dark');

            ele = jst.getChildOf('.jst-modal-icon-close', this.#dialog);
            toggleDark(ele, 'jst-modal-icon-close-dark');

            ele = jst.getChildOf('.jst-dialog-btn', this.#dialog);
            toggleDark(ele, 'jst-dialog-btn-dark');
        }

        dark() {
            this.#dark = true;
            return this;
        }

        light() {
            this.#dark = false;
            return this;
        }

    }

    window.Dialog = new DialogCls();

})();