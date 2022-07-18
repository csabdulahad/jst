(() => {
    class Connect {

        // for regular use, unlike Hati server the response can be parsed.
        #parseJSON = false;

        // XHttp buffers
        #method;
        #xHttp;
        #state;
        #status;
        #statusText;
        #response;

        // various callbacks
        #callbackAny;
        #callbackOk;
        #callbackErr;
        #timeout;
        #unresolvedHost;
        #unknownError;
        #preRedirect;
        #postRun;
        #preRun;

        // redirection paths and theirs flags
        #anyPath;
        #successPath;
        #errorPath;
        #insDirAny = false;
        #insDirOk = false;
        #insDirErr = false;

        // variables for toasting
        #noToast = false;
        #toastOnAny = true;
        #autoHideToast = true;
        #toastOnSuccess = false;
        #toastOnError = false;
        #delay = 2;

        // hati response variables
        #hati = false;
        #hatiMsg;
        #hatiStatus;
        #hatiLevel;
        #data; // represents the hati object; the response of the JSON will be trimmed.

        // angular scope to digest any watcher who is has been blind
        #ngScope;

        static HATI_STATUS_SUCCESS = 1;
        static HATI_STATUS_INFO = 2;
        static HATI_STATUS_WARNING = 0;
        static HATI_STATUS_ERROR = -1;
        static HATI_STATUS_UNKNOWN = -2;

        static HATI_LVL_SYSTEM = 0;
        static HATI_LVL_USER = 1;
        static HATI_LVL_UNKNOWN = -2;

        // XHttp state flags
        STATE_REQ_NOT_INITIALIZED = 0;
        STATE_SERVER_CONNECTION_ESTABLISHED = 1;
        STATE_REQ_RECEIVED = 2;
        STATE_REQ_PROCESSING = 3;
        STATE_REQ_FINISH_AND_READY = 4;

        // XHttp status flags
        STATUS_OK = 200;
        STATUS_FORBIDDEN = 403;
        STATUS_PAGE_NOT_FOUND = 404;
        STATUS_REQ_TIMEOUT = 408;

        constructor() {
            this.#xHttp = new XMLHttpRequest();
            this.#xHttp.onreadystatechange  = () => {
                this.#state = this.#xHttp.readyState;
                this.#status = this.#xHttp.status;
                this.#statusText = this.#xHttp.statusText;

                if(this.#state !== this.STATE_REQ_FINISH_AND_READY) return;

                if (this.#status === this.STATUS_OK) {
                    this.#callbackMediator(this.#xHttp.responseText);
                } else if (this.#status === this.STATUS_REQ_TIMEOUT) {
                    if (this.#timeout != null) this.#timeout();
                } else if (this.#status === this.STATUS_PAGE_NOT_FOUND) {
                    if (this.#unresolvedHost != null) this.#unresolvedHost();
                } else {
                    if (this.#unknownError != null) this.#unknownError();
                }
            };
        }

        #callbackMediator(response) {

            this.#response = response;

            if (!this.#hati) {
                let result = true;
                if (this.#parseJSON) {
                    try {
                        if (this.#parseJSON) this.#response = JSON.parse(this.#response);
                    } catch (error) {
                        result = false;
                        this.#statusText = `Encountered parsing response as JSON. ${error.message}.\nResponse: ${this.#response}`;
                        console.error(this.#statusText);
                    }
                }
                this.#noToast = true;
                this.#invokeRedirect(result);
                this.#invokeCallback(result);
                this.#resetConnection();
                return;
            }

            // invalidate response for hati & store the response
            try {
                this.#data = JSON.parse(response);
                this.#hatiMsg = this.#data.response['msg'];
                this.#hatiStatus = this.#data.response['status'];
                this.#hatiLevel = this.#data.response['level'];

                if (this.#data.response['delay_time'] !== undefined)
                    console.warn('Hati is in development mode. Configure the Hati.');

                // delete the response property of the Hati response
                delete this.#data.response;
            } catch (error) {
                this.#resetHati();
                console.error(`${this.#hatiMsg} ${error.message}.\nResponse: ${this.#response}`);
                this.#invokeCallback(false);
                this.#resetConnection();
                return;
            }

            let success = this.#hatiStatus === Connect.HATI_STATUS_SUCCESS;

            this.#invokeRedirect(success);

            // after any redirection if we are still here yet, then invoke callbacks accordingly
            this.#invokeCallback(success);

            // if no toast then we don't go any further down here
            if (this.#noToast) {
                this.#resetConnection();
                return;
            }

            // handle sticky toast
            if (!this.#autoHideToast) {
                Toast.show(this.#hatiStatus, this.#hatiMsg, false);
                this.#directAfterToast(success);
                this.#resetConnection();
                return;
            }

            if (this.#toastOnAny) {
                // here we know it is toast for all types of flags.
                this.#showToast(success);
            } else {
                // show toast only it is either success or error
                if (this.#toastOnSuccess && success) this.#showToast(true);
                else if (this.#toastOnError && !success) this.#showToast(false);
                else this.#resetConnection();
            }

        }

        #invokeRedirect(success) {
            // firstly process any redirection based on no-toast or instant redirection
            if ((this.#insDirAny || this.#noToast) && this.#anyPath) Connect.redirect(this.#anyPath);
            if ((this.#insDirOk  || this.#noToast) && success) Connect.redirect(this.#successPath);
            if ((this.#insDirErr || this.#noToast) && !success) Connect.redirect(this.#errorPath);
        }

        #invokeCallback(success) {
            if (this.#callbackAny != null) this.#callbackAny(success);
            else {
                if (success && this.#callbackOk != null) this.#callbackOk();
                if (!success && this.#callbackErr != null) this.#callbackErr();
            }

            if (this.#postRun) this.#postRun();

            // start the angular watchers digestions
            if(this.#ngScope != null) this.#ngScope['$apply']();
        }

        #resetConnection() {
            // for regular use, unlike Hati server the response can be parsed.
            this.#parseJSON = false;

            // various callbacks
            this.#callbackAny = null;
            this.#callbackOk = null;
            this.#callbackErr = null;
            this.#timeout = null;
            this.#unresolvedHost = null;
            this.#unknownError = null;
            this.#preRedirect = null;
            this.#postRun = null;
            this.#preRun = null;

            // redirection paths and theirs flags
            this.#anyPath = null;
            this.#successPath = null;
            this.#errorPath = null;
            this.#insDirAny = false;
            this.#insDirOk = false;
            this.#insDirErr = false;

            // variables for toasting
            this.#noToast = false;
            this.#toastOnAny = true;
            this.#autoHideToast = true;
            this.#toastOnSuccess = false;
            this.#toastOnError = false;
            this.#delay = 2;

            // angular scope to digest any watcher who is has been blind
            this.#ngScope = null;
        }

        #directAfterToast(success) {
            if (this.#anyPath) this.#direct(this.#anyPath);
            else {
                if (success) this.#direct(this.#successPath);
                else this.#direct(this.#errorPath);
            }
        }

        #direct(path) {
            if (this.#preRedirect) this.#preRedirect();
            Connect.redirect(path);
        }

        #showToast(success) {
            Toast.show(this.#hatiStatus, this.#hatiMsg, true, () => {
                this.#directAfterToast(success);
                this.#resetConnection();
            }, this.#delay);
        }

        stickyToast() {
            this.#autoHideToast = false;
            return this;
        }

        noToast() {
            this.#noToast = true;
            return this;
        }

        toastSuccess() {
            this.#toastOnAny = false;
            this.#toastOnSuccess = true;
            return this;
        }

        toastError() {
            this.#toastOnAny = false;
            this.#toastOnError = true;
            return this;
        }

        toastTime(time) {
            this.#delay = time;
            return this;
        }

        direct(path, instantRedirect = false) {
            this.#anyPath = path;
            this.#successPath = null;
            this.#errorPath = null;
            this.#insDirAny = instantRedirect;
            return this;
        }

        directSuccess(path, instantRedirect = false) {
            this.#anyPath = null;
            this.#successPath = path;
            this.#insDirOk = instantRedirect;
            return this;
        }

        directError(path, instantRedirect = false) {
            this.#anyPath = null;
            this.#errorPath =  path;
            this.#insDirErr = instantRedirect;
            return this;
        }

        onAny(callback) {
            this.#callbackAny = callback;
            return this;
        }

        onOk(callback) {
            this.#callbackOk = callback;
            return this;
        }

        onErr(callback) {
            this.#callbackErr = callback;
            return this;
        }

        postRun(callback) {
            this.#postRun = callback;
            return this;
        }

        preRun(callback) {
            this.#preRun = callback;
            return this;
        }

        preRedirect(callback) {
            this.#preRedirect = callback;
            return this;
        }

        onTimeout(callback) {
            this.#timeout = callback;
            return this;
        }

        onUnresolvedHost(callback) {
            this.#unresolvedHost = callback;
            return this;
        }

        onUnknownError(callback) {
            this.#unknownError = callback;
            return this;
        }

        #resetHati() {
            this.#hatiStatus = Connect.HATI_STATUS_UNKNOWN;
            this.#hatiLevel = Connect.HATI_LVL_UNKNOWN;
            this.#hatiMsg = `Server didn't talk Hatish.`;
            this.#data = null;
        }

        withHati(ngScope = null) {
            this.#hati = true;
            this.#ngScope = ngScope;
            return this;
        }

        parseAsJSON() {
            this.#parseJSON = true;
            return this;
        }

        #hitObj(param) {
            let method = this.#method;
            let xHttp = this.#xHttp;

            let obj = {};
            obj.hit = () => {
                if (this.#preRun) this.#preRun();
                if (method === 'POST') xHttp.send(Connect.parameterize(param));
                else xHttp.send();
            };
            return obj;
        }

        get(url, param = null) {
            this.#method = 'GET';
            if (param != null) url += `?${Connect.parameterize(param)}`;
            this.#xHttp.open(this.#method, url);
            return this.#hitObj();
        }

        post(url, param = null) {
            this.#method = 'POST';
            this.#xHttp.open(this.#method, url);
            this.#xHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            return this.#hitObj(param);
        }

        serverReplied() { return this.#state === this.STATE_REQ_FINISH_AND_READY && this.#status === this.STATUS_OK; }

        hatiResponse() { return this.serverReplied() && this.data !== null; }

        get cntStatus() { return this.#status; }

        get cntMsg() { return this.#statusText; }

        get cntData() { return this.#response; }

        get msg() { return this.#hatiMsg; }

        get status() { return this.#hatiStatus; }

        get level() { return this.#hatiLevel; }

        get data() { return this.#data; }

        static parameterize(obj) {
            let string = '';
            for (const key in obj) {
                string += `${key}=${obj[key]}&`;
            }
            return string.substring(0, string.length - 1);
        }

        static redirect(path) {
            if (!path) return;
            window.location = path;
        }

    }

    window.Connect = new Connect();

    window.Connect.parameterize = (obj) => Connect.parameterize(obj);
    window.Connect.redirect = (path) => Connect.redirect(path);

})();
