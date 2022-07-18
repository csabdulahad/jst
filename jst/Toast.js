
/*
* Any feedback to the user can be displayed at the right bottom side of the document
* with auto hiding animation or can be shown sticky. Toast can invoke callback if set
* when the toast has been done with hiding.
*
* It also has a feature which can look into the cookie to see if any toast is pending to
* show on document ready event and after showing the message it clears the toast cookies.
* */
(() => {

    class Toast {

        #toastMsg = 'A sweet and delicious toast to eat! 😎';

        ERROR = -1;
        WARNING = 0;
        SUCCESS = 1;
        INFO = 2;

        #delay;

        #injected = false;
        #toast;
        #icon;
        #msg;
        #guide;
        #bar;

        #autoHide;
        #callback;

        error(msg, autoHide = true, callback = null, delay = 3) {
            this.show(this.ERROR, msg, autoHide, callback, delay);
        }

        warning(msg, autoHide = true, callback = null, delay = 3) {
            this.show(this.WARNING, msg, autoHide, callback, delay);
        }

        success(msg, autoHide = true, callback = null, delay = 3) {
            this.show(this.SUCCESS, msg, autoHide, callback, delay);
        }

        info(msg, autoHide = true, callback = null, delay = 3) {
            this.show(this.INFO, msg, autoHide, callback, delay);
        }

        show(type, msg, autoHide = true, callback = null, delay = 3) {
            this.#stopAnimation();

            this.#toastMsg = msg;
            this.#autoHide = autoHide;
            this.#callback = callback;
            this.#delay = delay;

            // make sure we have injected DOM into the document
            this.#injectDOM();

            // hider bar border, if it was showing previously
            $(this.#bar).hide();

            // remove listeners from the toast, if added previously
            this.#removeListener();

            if (this.#autoHide) this.#addListener();

            // apply themes, styles to toast DOMs and show the toast with animation
            this.#setup(type);

            if (this.#autoHide) {
                // show bar border
                $(this.#bar).show();
                this.#startAnimation();
            }
        }

        #setup(type) {
            this.hide();
            this.#decorate(type);

            $(this.#toast).show().animate({right: 0}, 750, 'swing');
        }

        #addListener() {
            $(this.#toast).on('mouseenter', () => { this.#stopAnimation(); });
            $(this.#toast).on('mouseleave', () => { this.#startAnimation(); });
        }

        #removeListener() {
            $(this.#toast).off('mouseenter, mouseleave');
        }

        #startAnimation() {
            $(this.#bar).css('width', '0');
            $(this.#bar).delay(750).animate({width: '100%'}, this.#delay * 1000, 'linear', () => {
                $(this.#toast).delay(2000).animate({'right': '-360px'}, 1000, 'swing');
                if (this.#callback != null) this.#callback();
            });
        }

        #stopAnimation() { $(this.#bar).stop(); }

        #injectDOM() {
            if (this.#injected) return;

            let dom = `
                <div id="toast" style="display: none; overflow: clip; position: fixed; right: -360px; bottom: 32px; min-width: 280px; max-width: 360px; font-size: 0.98em; line-height: 1.15em; box-shadow: 1px 1px 2px black; z-index: 9999; border-radius: 0.25rem 0 0 0.25rem;">
                    <div style="display: flex; padding: 16px; align-items: center;">
                        <span id="toast-icon" style="user-select: none; margin-right: 12px; font-size: 24px;">&#128073;</span>
                        <span id="toast-msg" style="line-height: 1.25;">A sweet and delicious toast to eat!😎😉</span>
                    </div>
                    <div id="toast-pro-bar-guide">
                        <div id="toast-pro-bar" style="display: none; width: 100%; height: 1px; margin: 0 0; padding: 2px; background-color: #0B5ED7;"></div>                
                    </div>
                </div>
            `;
            $('body').append(dom);

            this.#toast = $("#toast");
            this.#icon = $("#toast-icon");
            this.#msg = $("#toast-msg");
            this.#guide = $("#toast-pro-bar-guide");
            this.#bar = $("#toast-pro-bar");

            this.#injected = true;
        }

        #decorate(type) {
            $(this.#msg).text(this.#toastMsg);

            // theme for different type of toast
            let themeSettings = {
                success :   { color : '#0f5132', bg : '#d1e7dd', guide : '#009A68', bar : '#52C400', icon : '&#9989;'},
                info    :   { color : '#084298', bg : '#CFF4FC', guide : '#0a95b1', bar : '#0DCAF0', icon : '&#128172;'},
                warning :   { color : '#664d03', bg : '#fff3cd', guide : '#937005', bar : '#FFCA2C', icon : '&#128721;'},
                error   :   { color : '#842029', bg : '#f8d7da', guide : '#7A1E27', bar : '#DB3948', icon : '&#9940;'}
            };

            let theme;
            if (type === this.SUCCESS) theme = themeSettings.success;
            else if (type === this.WARNING) theme = themeSettings.warning;
            else if (type === this.ERROR) theme = themeSettings.error;
            else theme = themeSettings.info;

            $(this.#toast).css('color', theme.color);
            $(this.#toast).css('background-color', theme.bg);
            $(this.#icon).html(theme.icon);
            $(this.#guide).css('background-color', theme.guide);
            $(this.#bar).css('background-color', theme.bar);
        }

        hide() { $(this.#toast).css('right', '-360px'); }

    }

    window.Toast = new Toast();

    window.Toast.loadToast = (msg, type = window.Toast.SUCCESS, autoHide = true, delay = 3) => {
        Biscuit.set('toast_msg', msg);
        Biscuit.set('toast_type', type);
        Biscuit.set('toast_auto_hide', autoHide);
        Biscuit.set('toast_delay', delay);
    };

    jst.run( () => {
        // let's see if we have any cookie message to show
        let msg = Biscuit.getStr('toast_msg', '');
        if (msg.length === 0) return;

        let type = Biscuit.getInt('toast_type', Toast.INFO);
        let autoHide = Biscuit.getBool('toast_auto_hide', true);
        let delay = Biscuit.getInt('toast_delay', 3);

        window.Toast.show(type, msg, autoHide, null, delay);
        Biscuit.unset('toast_msg');
        Biscuit.unset('toast_type');
        Biscuit.unset('toast_auto_hide');
        Biscuit.unset('toast_delay');
    });

})();
