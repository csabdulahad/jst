
/**
 * Web forms are very verbose in taking user inputs. This class can greatly simplify
 * the form validations with nice and easy coding. Each element is marked with an ID or
 * name(where the input type is radio) and elements are registered via the constructor by
 * object. The possible properties that the object can have:
 *
 *   id         : 'id of the form element'
 *   name       : 'name to the radio input'
 *   min        : 'the min value'
 *   max        : 'the max value'
 *   minLen     : 'the minimum length'
 *   maxLen     : 'the maximum length'
 *   inline     : 'indicates to show feedback as inline'
 *   msgPos     : 'id of where to show the feedback message div'
 *   type       : 'can be of type str, int, float, email'
 *   pattern    : 'any Form pattern constant or custom patter to match'
 *   place      : 'the floating fractional place length'
 *   option     : 'array containing the permitted options for the input'
 *   noIcon     : 'any value(preferably boolean) indicates not to show icon for the element on error'
 * */

class FormInspector {

    /**
     * Predefined regular expression pattern for filtering input in various formats.
     * This list has a useful pattern which can be used in general for any project.
     * However, any required pattern can be passed as an argument to the object using
     * the key 'Pattern'.
     *
     * In the naming of these constants, they have meaning like regular expression.
     * A    = Alphabets(including capital & small letters)
     * N    = Numbers
     * AN   = Alphabets & Numbers
     * S    = Space
     * C    = Comma
     * D    = Dot
     *
     * When you use any of these pattern, they will remove any other characters except the
     * mentioned characters in the pattern names.
     * */

    // a-z, A-Z
    static SAN_A = /[a-zA-Z]/g ;

    // 0-9
    static SAN_N = /[0-9]/g;

    // a-z, A-Z, 0-9
    static SAN_AN = /[a-zA-Z0-9]/g;

    // a-z, A-Z, spaces
    static SAN_AS = /[a-zA-Z\s]/g;

    // a-z, A-Z, commas
    static SAN_AC = /[a-zA-Z,]/g;

    // a-z, A-Z, dots
    static SAN_AD = /[a-zA-Z.]/g;

    // a-z, A-Z, 0-9, spaces
    static SAN_ANS = /[a-zA-Z0-9\s]/g;

    // a-z, A-Z, 0-9, spaces, commas
    static SAN_ASC = /[a-zA-Z\s,]/g;

    // a-z, A-Z, 0-9, dots
    static SAN_AND = /[a-zA-Z0-9.]/g;

    // a-z, A-Z, 0-9, spaces, commas
    static SAN_ANSC = /[a-zA-Z0-9\s,]/g;

    // a-z, A-Z, 0-9, spaces, dots
    static SAN_ANSD = /[a-zA-Z0-9\s.]/g;

    // a-z, A-Z, 0-9, spaces, commas, dots
    static SAN_ANSCD = /[a-zA-Z0-9\s,.]/g;

    // ISO date format YYYY-MM-DD
    static SAN_ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;

    // ISO time format HH:MM:SS
    static SAN_ISO_TIME = /(\d{2}:\d{2}:\d{2})/g;

    // form dom
    #form;

    // holds the configuration info for each element
    #eleArr = [];

    // indicated whether the feedback message should be inline or block level element
    #inline;

    #iconOk = '&#10004;';
    #iconErr = '&#10060;';

    #colorOk = 'green';
    #colorErr = 'red';

    #noMsg = false;
    #noIcon = false;
    #animateErr = true;

    #errAnimation = (ele) => {
        $(ele)
            .animate({opacity: '0.5'}, 200)
            .animate({opacity: '1'}, 200)
            .animate({opacity: '0.5'}, 200)
            .animate({opacity: '1'}, 200);
    };

    // indicates whether the form inputs are resolved and ready to be submitted
    #canSubmit = true;

    // form element is identified by id. ID can be separated by '-' so that it
    // can be split into capitalized word for nice feedback message
    static #getEleName(ele) {
        if (ele.owns('msgName')) return ele.msgName;

        let value = ele.id || ele.name;
        value = value.replaceAll(/-/g, ' ');
        return value.capitalize(true);
    }

    // form element can be of various types such as input, select, textarea etc.
    // this method can detect these types and return the value based on types.
    static #getValue(ele) {
        let type = $(ele.dom).attr('type');
        if (type === 'radio') {
            return $(`input[name="${ele.name}"]:checked`).val();
        } else if (type === 'checkbox') {
            return $(ele.dom).is(":checked") ? $(ele.dom).val() : false;
        } else return $(ele.dom).val();
    }

    /**
     *
     * @param {string|object} form The form id or the form object. If empty, FormInspector tries to
     * calculate from the elements
     * @param {boolean=} inline  When true input validation feedback is shown next to input as
     * inline html element otherwise shown as block level element
     *
     * @throws {Error} If the form element can't be found
     * */
    constructor(form, inline = false) {

        // first make sure we have found the form to work with
        if(!$(form).is('form') && typeof form !== 'string') {
            throw new Error('Argument form must be an id or a reference to a form');
        }

        this.#form = jst.eleId(form);
        if (jst.isUndef(this.#form) || this.#form === null) throw new Error(`Failed to find the form as specified`);


        // prevent the form submission automatically and hook to validate method to
        // validate inputs
        $(this.#form).submit((evt) => evt.preventDefault());

        this.#inline = inline;
    }

    /**
     * Adds rules to perform validation on specified element
     *
     *
     * @param {object|array}                    rules Rules the form is validated against. Each rule is an object
     * specifying the filters
     * @param {string}                          rules.id id of the form element
     * @param {'str'|'int'|'float'|'email'}     rules.type the type of the data must be provided in
     * @param {string=}                         rules.name 'name to the radio input
     * @param {number=}                         rules.min the min value
     * @param {number=}                         rules.max the max value
     * @param {number=}                         rules.minLen the minimum length
     * @param {number=}                         rules.maxLen the maximum length
     * @param {boolean=}                        rules.inline indicates to show feedback as inline
     * @param {string=}                         rules.msgPos id of where to show the feedback message div
     * @param {string=}                         rules.msgName the name to be shown with FI feedback message
     * @param {string=}                         rules.pattern any Form pattern constant or custom patter to match
     * @param {number=}                         rules.place the floating fractional place length
     * @param {array=}                          rules.option array containing the permitted options for the input
     * @param {boolean=}                        rules.noIcon indicates not to show icon for the element on error
     * */
    addRule(...rules) {
        // unpack the objects
        if (Array.isArray(rules[0])) rules = rules[0];

        rules.forEach((rule) => {
            // get the form input element and see if it is defined
            let dom = $(this.#form).find(`#${rule.id}`)[0];

            if (jst.isUndef(dom) && rule.owns('name'))
                dom =  $(this.#form).find(`[name=${rule.name}]`);

            if (jst.isUndef(dom)) {
                console.warn('Element with no identity(id/name) has been skipped');
                return;
            }

            // add the input dom element to the object
            rule['dom'] = dom;

            rule['ok'] = false;
            rule['firstBlur'] = true;
            rule['key'] = rule.id || rule.name;

            this.#addListener(rule);

            // store ref to all the passed ele configurations after setup
            this.#eleArr.push(rule);
        });
    }

    /**
    * Resets the form inputs. Optionally it can hide input error/feedback message divs.
    *
    * @param {boolean} hideMsg Indicates whether to hide input error/feedback message divs
    * */
    resetForm(hideMsg = true) {
        if (this.#form) this.#form[0].reset();

        if (!hideMsg) return;

        // hide all the message are currently being show
        for (let ele of this.#eleArr) {

            let msgEle = null;
            if (ele.owns('msgPos')) {
                msgEle = $(`#${ele.msgPos}`);
            } else if (ele.owns('id')) {
                msgEle = $(`#${ele.id} + div.jst-form-msg`);
            }

            if (msgEle === null) continue;

            msgEle.css('display', 'none');
        }
    }

    // add various types of listeners such as keyup, blur based on the form element
    // type. It can also perform any needed logic before handing over the listener
    // callback function to verify the input.
    #addListener(ele) {
        let dom = ele.dom;
        let nodeName = $(dom).prop('nodeName').toLowerCase();
        let eleType = $(dom).attr('type');

        $(dom).on('blur', () => FormInspector.#decorateBlurEvent(ele, this.#filter));

        if (eleType === 'radio' || eleType === 'checkbox' || nodeName === 'select')
            $(dom).change(() => this.#filter(ele));
        else
            $(dom).keyup(() => { if (!ele.firstBlur) this.#filter(ele); });
    }

    #filter = (ele) => {

        let nodeName = $(ele.dom).prop('nodeName').toLowerCase();
        let filterType = ele.type;
        let inputType = $(ele.dom).attr('type');

        let ok;

        // stop from selecting first option of the select input
        if (nodeName === 'select') {
            if(FormInspector.#getValue(ele) === '') {
                ele.ok = this.#showMsg(false, ele, 'Select an option.');
                return;
            }
        }

        if (filterType === 'email' || inputType === 'email') ok = this.#email(ele);
        else if (filterType === 'str') ok = this.#str(ele);
        else if (filterType === 'int') ok = this.#int(ele);
        else if (filterType === 'float') ok = this.#float(ele);

        // check if we need to match any pattern
        if (ok && ele.owns('pattern')) ok = this.#pattern(ele);

        ele.ok = ok;
    };

    // we don't want to disturb the user with the error message when they are
    // filling out the input for the first time. With constructions, we have
    // already said that it is first blur. Now on this blur callback event we
    // tell this is not first blur anymore to indicate to show the error message
    // as user types in after the first blur has already been taken place.
    static #decorateBlurEvent(ele, fn) {
        ele.firstBlur = false;
        ele.animate = true;
        if (!ele.ok) fn(ele);
    }

    #email = (ele) => {
        let value = FormInspector.#getValue(ele);
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let result = emailRegex.test(value);
        let msg = result ? 'Email accepted.' : 'Invalid email.';
        return this.#showMsg(result, ele, msg);
    };

    #str = (ele) => {
        let value = FormInspector.#getValue(ele);

        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty`);

        value = value.trim();

        if (!this.#checkLen(ele, value)) return false;
        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${FormInspector.#getEleName(ele)} accepted.`);
    };

    #int = (ele) => {
        let value =  FormInspector.#getValue(ele);

        // make sure we have actual string input
        if(!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        // keep anything except numbers from the input then see if it has invalid character
        let iChar = value.replace(/[0-9]/g, '');
        if (iChar.length > 0) return this.#showMsg(false, ele, 'Invalid number.');

        // get the number
        value = parseInt(value);

        if (!Number.isSafeInteger(value)) return this.#showMsg(false, ele, `Must be an integer.`);
        if (!this.#checkLen(ele, value)) return false;
        if(!this.#checkRange(ele, value)) return false;
        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${FormInspector.#getEleName(ele)} accepted.`);
    };

    #float = (ele) => {
        let value = FormInspector.#getValue(ele);

        // make sure we have actual string input
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        // add the floating point place if it has not
        if (value.match(/\./g) == null) value += '.0';

        if (value.replaceAll(/-?\d+\.\d+/g, '').length !== 0) return this.#showMsg(false, ele, 'Illegal input.');

        if (!this.#checkLen(ele, value)) return false;

        if (!this.#checkRange(ele, value)) return false;

        if (ele.owns('place')) {
            if (value.split('.')[1].length !== ele['place'])
                return this.#showMsg(false, ele, `Fractional place must be of ${ele['place']}.`);
        }

        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${FormInspector.#getEleName(ele)} accepted.`);
    };

    #pattern = (ele) => {
        let value = FormInspector.#getValue(ele);
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);
        if (value.replaceAll(ele.pattern, '').length !== 0) return this.#showMsg(false, ele, `Invalid input.`);
        return this.#showMsg(true, ele, `${FormInspector.#getEleName(ele)} accepted.`);
    };

    // Based on the value of the result, it either updates or adds the message element
    // into the specified element or to the next of the input element by default.
    #showMsg(result, ele, msg) {
        let inline =  ele.owns('inline') ? ele.inline : this.#inline;
        let icon = result ? this.#iconOk : this.#iconErr;
        let color = result ? this.#colorOk : this.#colorErr;

        // add the msg element if we have none
        let haveNextEle = $(ele.dom).next().hasClass('jst-form-msg');
        let havePositionedEle = ele.owns('msgPos');

        if (!haveNextEle || havePositionedEle) {
            let msgEle = `<div class="jst-form-msg"><span></span> <span></span></div>`;

            // add the message element accordingly
            if(havePositionedEle) $(`#${ele['msgPos']}`).html(msgEle);
            else $(ele.dom).after(msgEle);
        }

        // update the nextEle to newly inserted one since we have just updated
        let nextEle = havePositionedEle ? $('#' + ele['msgPos']) : $(ele.dom).next();

        // update the icon, message and the color class
        let spans = $(nextEle).find('span');
        let iconSpan = spans[0];
        let msgSpan = spans[1];
        if (!this.#noIcon && ele.missing('noIcon')) $(iconSpan).html(icon);
        if (!this.#noMsg  && ele.missing('noMsg')) $(msgSpan).html(msg);

        $(nextEle).css('color', color);

        // make sure the message element is shown; it could be made hidden by reset function
        $(nextEle).css('display', inline ? 'inline' : 'block');

        // animate if requested by the blur event
        if (ele.owns('animate') && !result) {
            if (this.#animateErr) this.#errAnimation(nextEle);
            ele.erase('animate');
        }

        return result;
    }

    #checkLen(ele, value) {
        if ((typeof value).toLowerCase() !== 'string') value = String(value);

        let min = ele.minLen || 0;
        let max = ele.maxLen || -1;

        if (value.length < min) return this.#showMsg(false, ele, `Must be ${min} in length.`);
        if (max !== -1 && value.length > max) return this.#showMsg(false, ele, `Exceeded maximum length of ${max}.`);
        return true;
    }

    #checkRange(ele, value) {
        let min = ele.min || 0;
        let max = ele.max || -1;

        if (value < min) return this.#showMsg(false, ele, `Can't be less than ${min}.`);
        if (max !== -1 && value > max) return this.#showMsg(false, ele, `Can't be greater than ${max}.`);
        return true;
    }

    #checkInOption(ele, value) {
        let inOption = false;
        if (ele.owns('option')) {
            for (const opValue of ele['option']) {
                if (opValue === value) {
                    inOption = true;
                    break;
                }
            }
        } else return true;
        let msg = $(ele.dom).attr('type') === 'checkbox' ? `Must be acknowledged.` : `Must be of valid options.`;
        if (!inOption) return this.#showMsg(false, ele, msg);
        return true;
    }

    /**
     * Submits the form to action set no the form.
     *
     * This method can be useful because FormInspector prevents the default
     * form submission behaviour to validate the form inputs.
     * */
    submit() {
        $(this.#form).off('submit');
        $(this.#form).submit();
        $(this.#form).on('submit');
    }

    /**
     * It checks all the inputs against the rules set.
     *
     * @return {boolean} True if the form inputs pass the rules, false otherwise
     * */
    validate() {
        // say, we can submit the form
        this.#canSubmit = true;

        this.#eleArr.forEach(ele => {
            if (jst.isUndef(ele.dom)) return;

            ele.animate = true;
            ele.firstBlur = false;
            this.#filter(ele);
            if (this.#canSubmit) this.#canSubmit = ele.ok;
        });

        return this.#canSubmit;
    }

    /**
     * For feedback, icon will not be shown
     *
     * @return {FormInspector}
     * */
    noIcon() { this.#noIcon = true; return this; }

    /**
     * Any type of input feedback will not be shown
     *
     * @return {FormInspector}
     * */
    noMsg() { this.#noMsg = true; return this; }

    /**
     * Change the icon to be shown when input is accepted
     *
     * @param html {string} Any HTML value for the icon
     * @return {FormInspector}
     * */
    iconOk(html) { this.#iconOk = html; return this; }

    /**
     * Change the icon to be shown when input has an error
     *
     * @param html {string} Any HTML value for the icon
     * @return {FormInspector}
     * */
    iconErr(html) { this.#iconErr = html; return this; }

    /**
     * Disables animation for error highlighting
     *
     * @return {FormInspector}
     * */
    noErrAnim() { this.#animateErr = false; return this; }

    /**
     * Add custom animation to element when there is any error for the element
     *
     * @param fn {function(HTMLElement)} The callback is invoked with the element which has error.
     * @return {FormInspector}
     * */
    errAnim(fn) { this.#errAnimation = fn; return this; }

    /**
     * Change the color of the error message text
     *
     * @param color {string} Any color value such hex, rgb, color name
     * @return {FormInspector}
     * */
    errColor(color) { this.#colorErr = color; return this; }

    /**
     * Change the color of accepted input message text
     *
     * @param color {string} Any color value such hex, rgb, color name
     * @return {FormInspector}
     * */
    okColor(color) { this.#colorOk = color; return this; }

}
