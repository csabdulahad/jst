/**
* Modal class really simplifies showing modal in the web page. It adds overlay div
* on construction. Method show and hide can be configured with object-config and callback
* functions.
*   object-config: {w: INT, w: INT, closeable: fn}
*
* Any div marked with jst-modal will become ready to be shown as model.
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

    class ModalCls {

        // indication of  any model is currently being shown to save callback
        // getting called twice when the hide is performed already by closing the previous
        // modal and new modal's show invocations calls the hide which fires the callback again.
        #amIUp = false;

        #visible = false;

        // indicates whether the modal content will have custom fancy scrollbar
        #scrollbar;

        // whether the modal will be closeable by Esc keyup event or clicking outside the modal
        #cancelable = false;

        #dark = false;

        #title;
        #padding;

        #modal = null;

        #callback;

        #adjustModalSize(width, height) {
            let ele = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            $(ele).css('width', width);
            $(ele).css('height', height);
        }

        #applyTheme() {
            let toggleDark = (ele, themeCls) => {
                if (this.#dark) $(ele).addClass(themeCls);
                else $(ele).removeClass(themeCls);
            }

            let ele = jst.getChildOf('.jst-overlay', $('body'));
            toggleDark(ele, 'jst-overlay-dark');

            ele = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            toggleDark(ele, 'jst-modal-flex-child-dark');

            ele = jst.getChildOf('.jst-modal-header', this.#modal);
            toggleDark(ele, 'jst-modal-header-dark');

            ele = jst.getChildOf('.jst-modal-icon-close', this.#modal);
            toggleDark(ele, 'jst-modal-icon-close-dark');
        }

        #addListener() {
            if (!this.#cancelable) return;

            // add click listener to the modal flex for click on outside hiding modal.
            let modalFlex = jst.getChildOf('.jst-modal-flex', this.#modal);
            $(modalFlex).click((e) => {
                if (e.target !== modalFlex) return;
                this.hide();
            });
        }

        #removeListener() {
            $(document).off('keyup');
            let modalFlex = jst.getChildOf('.jst-modal-flex', this.#modal);
            $(modalFlex).off('click');
        }

        #updateCloseIcon() {
            let closeIcon = jst.getChildOf('.jst-modal-icon-close', this.#modal);
            if (!this.#cancelable) $(closeIcon).remove();
        }

        #prepare(width, height) {
            let modalFlex = jst.getChildOf('.jst-modal-flex', this.#modal);
            if (jst.isDef(modalFlex)) return;

            // wrap all the content of the div of class jst-modal inside the jst-modal-flex
            // so that we can show the modal as display flex where the position x & y will be automatic.
            let modalFlexHtml = `<div class="jst-modal-flex"><div class="jst-modal-flex-child"><div class="jst-modal-content"></div></div></div>`;
            $($(this.#modal).contents()).wrapAll(modalFlexHtml);

            // adjust padding
            $(this.#modal).find('.jst-modal-content').css('padding', this.#padding);

            // get the modal title
            let title =  this.#title || $(this.#modal).attr('data-jst-modal-title');
            title = title || 'jstea Modal';

            let modelFlexChild = jst.getChildOf('.jst-modal-flex-child', this.#modal);
            let modalHeader = `
                <div class="jst-modal-header">
                    <h5 class="jst-m-0 jst-p-0 jst-modal-title">${title}</h5>
                    <span class="material-icons jst-modal-icon-close" onclick="Modal.hide()" title="Close window">close</span>
                </div>
            `;
            $(modelFlexChild).prepend(modalHeader);

            this.#adjustModalSize(width, height);
            this.#updateCloseIcon();
            this.#applyTheme();

            // initiate the scrollbar for the modal content
            let modalContent = jst.getChildOf('.jst-modal-content', modelFlexChild);

            // update fancy scrollbar as per argument
            if (this.#scrollbar) Scrollbar.init(modalContent, {alwaysShowTracks: true});
            else Scrollbar.destroy(modalContent);
        }

        onCancel(callback) {
            this.#callback = callback;
            return this;
        }

        show(id, options = null) {

            // hide previously showing modal if there is any
            this.hide(false);

            let {w = 450, h = 'auto', closable = true, padding = '1rem', scrollbar = true} = options || {};

            this.#modal = $(`#${id}`);
            this.#cancelable = closable;
            this.#padding = padding;
            this.#scrollbar = scrollbar;

            this.#prepare(w, h);
            this.#addListener();

            OverlayManager.request('modal');
            this.#modal.fadeIn(250);

            this.#amIUp = true;
            this.#visible = true;

            // reset the title to null as next modal can have its own title configuration
            // either setting by method call or the HTML data attribute.
            this.#title = null;
        }

        // overlayHiding argument saves from the animation glitch when there is already
        // a model shown but another modal wants to turn up. since another modal is coming
        // so don't hide the overlay.
        hide(overlayHiding = true) {
            if (OverlayManager.isNoReady()) {
                alert('Modal could not instantiated properly.');
                return;
            }
            this.#removeListener();

            if (overlayHiding) OverlayManager.remove('modal');
            $(this.#modal).fadeOut(250);

            if (this.#amIUp && this.#callback) this.#callback();

            this.#amIUp = false;
            this.#visible = false;
        }

        dark() { this.#dark = true; return this; }

        light() { this.#dark = false; return this; }

        title(value) {
            this.#title = value;
            return this;
        }

        visibility(flag) {
            if (!this.#amIUp) return;
            if (flag) $(this.#modal).fadeIn(250);
            else $(this.#modal).fadeOut(250);
        }

    }

    window.Modal = new ModalCls();

})();
