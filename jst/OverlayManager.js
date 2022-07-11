(() => {

    class Overlay {

        #holder = [];

        #ready = false;
        #overlay;

        constructor() {
            jst.run(() => {
                // insert the element once if there is not already one
                let overlay = `<div class="jst-overlay"></div>`;
                $('body').prepend(overlay);

                this.#overlay = $('.jst-overlay');

                this.#ready = true;
            });
        }

        request(id) {
            if (this.#holder.missing(id)) this.#holder.push(id);
            if (this.#holder.length > 1) return;
            $(this.#overlay).fadeIn(250);
        }

        remove(id) {
            this.#holder.remove(id);
            if (this.#holder.length === 0) $(this.#overlay).fadeOut(250);
        }

        isNoReady() { return !this.#ready; }

    }

    window.OverlayManager = new Overlay();

})();