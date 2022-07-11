
/**
* Web forms are very verbose in taking user inputs. This Form class can greatly simplify
* the form validations with nice and easy coding. Each element is marked with an ID or
* name(where the input type is radio) and elements are registered via the constructor by
* object. The possible properties that the object can have:
*
*       id: 'id of the form element'
*       name: 'name to the radio input'
*       min: 'the min value'
*       max: 'the max value'
*       inline: 'indicates to show feedback as inline'
*       msgPos: 'id of where to show the feedback message div'
*       type: 'can be of type str, int, float, email'
*       pattern: 'any Form pattern constant or custom patter to match'
*       place: 'the floating fractional place length'
*       option: 'array containing the permitted options for the input'
 *      noIcon: 'any value(preferably boolean) indicates not to show icon for the element on error'
* */

class Form {

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
     * When you any of these pattern they will remove any other characters except the
     * mentioned characters in the pattern names.
     * */
    static SAN_A = /[a-zA-Z]/g ;
    static SAN_N = /[0-9]/g;
    static SAN_AN = /[a-zA-Z0-9]/g;
    static SAN_AS = /[a-zA-Z\s]/g;
    static SAN_AC = /[a-zA-Z,]/g;
    static SAN_AD = /[a-zA-Z.]/g;
    static SAN_ANS = /[a-zA-Z0-9\s]/g;
    static SAN_ASC = /[a-zA-Z\s,]/g;
    static SAN_AND = /[a-zA-Z0-9.]/g;
    static SAN_ANSC = /[a-zA-Z0-9\s,]/g;
    static SAN_ANSD = /[a-zA-Z0-9\s.]/g;
    static SAN_ANSCD = /[a-zA-Z0-9\s,.]/g;

    static SAN_ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;
    static SAN_ISO_TIME = /(\d{2}:\d{2}:\d{2})/g;

    // form dom
    #form;

    // holds various information such as firstBlur, input ok status etc.
    #meta = {};

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

    constructor(formId = '', eles, inline = false) {
        // first make sure we have found the form to work with
        if (formId.length === 0) {
            // get the form tag from the element array passed by the argument
            this.#form = $(`#${eles[0].id}`).closest('form')[0];
        } else {
            this.#form = $(`#${formId}`)[0];
        }

        if (jst.isUndef(this.#form)) throw new Error('Form can not validate as it is not of standard HTML.');

        // prevent the form submission automatically and hook to validate method to
        // validate inputs
        $(this.#form).submit((evt) => evt.preventDefault());

        for (const ele of eles) {
            // get the form input element and see if it is defined
            let dom = $(this.#form).find(`#${ele.id}`)[0];

            if (jst.isUndef(dom) && ele.owns('name'))
                dom =  $(this.#form).find(`[name=${ele.name}]`);

            if (jst.isUndef(dom)) {
                console.warn('Undefined form element was ignored');
                continue;
            }

            // add the input dom element to the object
            ele.dom = dom;

            let key = ele.id || ele.name;
            this.#meta[key] = { ok: false, firstBlur: true };

            this.#addListener(ele);
        }

        this.#inline = inline;
    }

    // add various types of listeners such as keyup, blur based on the form element
    // type. It can also perform any needed logic before handing over the listener
    // callback function to verify the input.
    #addListener(ele) {
        let dom = ele.dom;
        let nodeName = $(dom).prop('nodeName').toLowerCase();
        let eleType = $(dom).attr('type');

        $(dom).blur(() => { this.#decorateBlurEvent(ele, this.#filter); });

        if (eleType === 'radio' || eleType === 'checkbox' || nodeName === 'select') {
            $(dom).change(() => this.#filter(ele));
        } else {
            $(dom).keyup(() => { if (!this.#getMeta(ele).firstBlur) this.#filter(ele); });
        }
    }

    #filter = (ele) => {
        let nodeName = $(ele.dom).prop('nodeName').toLowerCase();
        let filterType = ele.type;
        let inputType = $(ele.dom).attr('type');

        let ok;

        // stop from selecting first option of the select input
        if (nodeName === 'select') {
            if(Form.#getValue(ele) === '') {
                this.#getMeta(ele).ok = this.#showMsg(false, ele, 'Select an option.');
                return;
            }
        }

        if (filterType === 'email' || inputType === 'email') ok = this.#email(ele);
        else if (filterType === 'str') ok = this.#str(ele);
        else if (filterType === 'int') ok = this.#int(ele);
        else if (filterType === 'float') ok = this.#float(ele);

        // check if we need to match any pattern
        if (ok && ele.owns('pattern')) ok = this.#pattern(ele);

        this.#getMeta(ele).ok = ok;
    };

    // we don't want to disturb the user with the error message when they are
    // filling out the input for the first time. With constructions, we have
    // already said that it is first blur. Now on this blur callback event we
    // tell this is not first blur anymore to indicate to show the error message
    // as user types in after the first blur has already been taken place.
    #decorateBlurEvent(ele, fn) {
        this.#getMeta(ele).firstBlur = false;
        ele.animate = true;
        if (!this.#getMeta(ele).ok) fn(ele);
    }

    #email = (ele) => {
        let value = Form.#getValue(ele);
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        const emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let result = value.match(emailRegEx) !== null;
        let msg = result ? 'Email accepted.' : 'Invalid email.';
        return this.#showMsg(result, ele, msg);
    };

    #str = (ele) => {
        let value = Form.#getValue(ele);

        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty`);

        value = value.trim();

        if (!this.#checkLen(ele, value)) return false;
        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${Form.#getEleName(ele)} accepted.`);
    };

    #int = (ele) => {
        let value =  Form.#getValue(ele);

        // make sure we have actual string input
        if(!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        // keep anything except numbers from the input then see if it has invalid character
        let iChar = value.replace(/[0-9]/g, '');
        if (iChar.length > 0) return this.#showMsg(false, ele, 'Invalid number.');

        // get the number
        value = parseInt(value);

        if(!this.#checkRange(ele, value)) return false;
        if (!Number.isSafeInteger(value)) return this.#showMsg(false, ele, `Must be an integer.`);
        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${Form.#getEleName(ele)} accepted.`);
    };

    #float = (ele) => {
        let value = Form.#getValue(ele);

        // make sure we have actual string input
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);

        // add the floating point place if it has not
        if (value.match(/\./g) == null) value += '.0';

        if (value.replaceAll(/-?\d+\.\d+/g, '').length !== 0) return this.#showMsg(false, ele, 'Illegal input.');

        if (!this.#checkRange(ele, value)) return false;

        if (ele.owns('place')) {
            if (value.split('.')[1].length !== ele.place)
                return this.#showMsg(false, ele, `Fractional place must be of ${ele.place}.`);
        }

        if (!this.#checkInOption(ele, value)) return false;
        return this.#showMsg(true, ele, `${Form.#getEleName(ele)} accepted.`);
    };

    #pattern = (ele) => {
        let value = Form.#getValue(ele);
        if (!jst.isStr(value)) return this.#showMsg(false, ele, `Can't be empty.`);
        if (value.replaceAll(ele.pattern, '').length !== 0) return this.#showMsg(false, ele, `Invalid input.`);
        return this.#showMsg(true, ele, `${Form.#getEleName(ele)} accepted.`);
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
            let msgEle = inline ?
                `<div class="jst-d-inline jst-form-msg"><span></span> <span></span></div>` :
                `<div class="jst-form-msg"><span></span> <span></span></div>`;

            // add the message element accordingly
            if(havePositionedEle) $(`#${ele.msgPos}`).html(msgEle);
            else $(ele.dom).after(msgEle);
        }


        // update the nextEle to newly inserted one since we have just updated
        let nextEle = havePositionedEle ? $('#' + ele.msgPos) : $(ele.dom).next();

        // update the icon, message and the color class
        let spans = $(nextEle).find('span');
        let iconSpan = spans[0];
        let msgSpan = spans[1];


        if (!this.#noIcon && ele.missing('noIcon')) $(iconSpan).html(icon);
        if (!this.#noMsg  && ele.missing('noMsg')) $(msgSpan).html(msg);

        $(nextEle).removeClass('jst-form-msg-ok jst-form-msg-err');
        $(nextEle).css('color', color);

        if (result) {
            $(nextEle).css('display', 'none');
            $(nextEle).fadeIn(250);
        } else $(nextEle).show();

        // no animation on success!
        if (result) return true;

        // animate if requested by the blur event
        if (ele.owns('animate') && !result) {
            if (this.#animateErr) this.#errAnimation(nextEle);
            ele.erase('animate');
        }

        return false;
    }

    // get the meta based on the key of ID or name.
    #getMeta(ele) {
        let key = ele.id || ele.name;
        return this.#meta[key];
    }

    #checkLen(ele, value) {
        let min = ele.min || 0;
        let max = ele.max || -1;

        if (value.length < min) return this.#showMsg(false, ele, `Must be ${min} in length.`);
        if (max !== -1 && value.length > max) return this.#showMsg(false, ele, `Exceeded maximum length of ${max}.`);
        return true;
    }

    #checkRange(ele, value) {
        let min = ele.min || 0;
        let max = ele.max || -1;

        if (value < min) return this.#showMsg(false, ele, `Can't be less than ${min}.`);
        if (max !== -1 && value > max) return this.#showMsg(false, ele, `Can't greater than ${max}.`);
        return true;
    }

    #checkInOption(ele, value) {
        let inOption = false;
        if (ele.owns('option')) {
            for (const opValue of ele.option) {
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

    // In this method, we first loop through the meta-object which has a flags indicating
    // whether each form element has passed the validation as specified by the config-obj.
    // if one the flags is false, then the form validation result becomes false.
    // on finding false flag for each element, it triggers the blur callback to attract user
    // to correct/complete the input.
    #validate() {
        // say, we can submit the form
        this.#canSubmit = true;

        for (const key in this.#meta) {
            let flag = this.#meta[key].ok;

            if (this.#canSubmit) this.#canSubmit = flag;

            if (!flag) {
                let target = $(`#${key}`)[0];
                if (jst.isDef(target)) $(target).trigger('blur');
                else {
                    let namedDom = $(`input[name="${key}"]`)[0];
                    $(namedDom).trigger('blur');
                }
            }
        }
        return this.#canSubmit;
    }

    submit() {
        $(this.#form).off('submit');
        $(this.#form).submit();
        $(this.#form).on('submit');
    }

    validate() {
        return this.#validate();
    }

    noIcon() { this.#noIcon = true; return this; }

    noMsg() { this.#noMsg = true; return this; }

    iconOk(html) { this.#iconOk = html; return this; }

    iconErr(html) { this.#iconErr = html; return this; }

    noErrAnim() { this.#animateErr = false; return this; }

    errAnim(fn) { this.#errAnimation = fn; return this; }

    errColor(color) { this.#colorErr = color; return this; }

    okColor(color) { this.#colorOk = color; return this; }

}

