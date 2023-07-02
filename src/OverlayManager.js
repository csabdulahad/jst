(() => {

    class Overlay {

        #clientList = [];

        #ready = false;
        #overlay;

        constructor() {
            jst.run(() => {
                // insert the element once if there is not already one
                let overlay = `<div class="jst-overlay"></div>`;
                $('body').prepend(overlay);
                this.#overlay = $('.jst-overlay');

                // pass the keydown escape or mouse click event to the currently showing modal/dialog
                $(document).on('keydown click', this.#overlay,(event) => {
                    if (this.#cLen() === 0) return true;

                    let keyboard = event.type === 'keydown' && event.key === 'Escape';
                    let click = event.type === 'click' && $(event.target).hasClass('jst-modal-flex');

                    if (!keyboard && !click) return true;

                    let len = this.#cLen(-1);
                    this.#clientList[len]?.onEscapeEvent(event);
                });

                $(this.#overlay).hide(0);
                this.#ready = true;
            });
        }

        #cLen(adjust = 0) {
            return this.#clientList.length + adjust;
        }

        #update() {
            if (this.#cLen() === 0) {
                // If there is no client to overlay then wait for 75 milliseconds before
                // hiding the overlay. Another client may show up in the half way hiding.
                jst.runLater(.075, () => {
                    if (this.#cLen() === 0) {

                        $(this.#overlay).fadeOut(250);
                    }
                    else this.#clientList[this.#cLen(-1)].makeVisible();
                })
            }
            else this.#clientList[this.#cLen(-1)].makeVisible();
        }

        theme(dark = false) {
            let ele = $('.jst-overlay');
            jst.switchCls(dark, 'jst-overlay-dark', ele);
        }

        /**
         * Overlay can be acquired for any client. The client must have the interface
         * consists of methods: id(), onEscapeEvent(event), makeVisible(), hide()
         * */
        acquire(client) {
            // ask the currently showing client to hide, if there is any
            let lastIndex = this.#cLen(-1);
            this.#clientList[lastIndex]?.hide();

            // do we need to show overlay?
            if (lastIndex === -1) $(this.#overlay).fadeIn(250);

            this.#clientList.push(client);
        }

        /**
         * Client can release any acquired overlay. The client must have an interface of
         * essential methods which are needed by OverlayManger to handle the complete
         * lifecycle of the overlay.
         *
         * See OverlayManger.acquire() method for more details.
         * */
        release(client) {
            this.#clientList.erase(client);

            // do we need to hide the overlay itself?
            this.#update();
        }

        notReady() { return !this.#ready; }

        ready() { return this.#ready; }

        get clientList () {
            return this.#clientList;
        }

    }

    window.OverlayManager = new Overlay();

    /**
     * Get any previously or currently showing popup with the id.
     *
     * @param {string} id The popup id
     * @returns {object | undefined} undefined if there is no popup with the id otherwise the popup
     * */
    window.getPopup = (id) => {
        let clients = OverlayManager.clientList;
        for(let i in clients) {
            if (clients[i].id === id) return clients[i];
        }
        return undefined;
    };

    /**
     * Dismiss any previously or currently showing popup with the id.
     *
     * @param {string} id The popup id
     * @returns {boolean} true if it finds the popup with the specified id, false otherwise
     * */
    window.dismissPopup = (id) => {
        let popup = getPopup(id);
        if (jst.isUndef(popup)) return false;
        popup.dismiss();
        return true;
    };

})();