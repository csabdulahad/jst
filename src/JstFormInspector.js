/**
 * Web forms are very verbose in taking user inputs. This class can greatly simplify
 * the form validations with nice and easy coding. Each element is marked with an ID or
 * name(where the input type is radio) and elements are registered via the constructor by
 * object.
 * */
class JstFormInspector {
	
	/*
	 * Predefined regular expression patterns for filtering input in various formats.
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
	 */
		
	/**
	 * a-z, A-Z
	 * */
	static SAN_A = /[a-zA-Z]/g ;
	
	/*
	 * 0-9
	 * */
	static SAN_N = /[0-9]/g;
	
	/*
	 * a-z, A-Z, 0-9
	 * */
	static SAN_AN = /[a-zA-Z0-9]/g;
	
	/*
	 * a-z, A-Z, spaces
	 * */
	static SAN_AS = /[a-zA-Z\s]/g;
	
	/*
	 * a-z, A-Z, commas
	 * */
	static SAN_AC = /[a-zA-Z,]/g;
	
	/*
	 * a-z, A-Z, dots
	 * */
	static SAN_AD = /[a-zA-Z.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces
	 * */
	static SAN_ANS = /[a-zA-Z0-9\s]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas
	 * */
	static SAN_ASC = /[a-zA-Z\s,]/g;
	
	/*
	 * a-z, A-Z, 0-9, dots
	 * */
	static SAN_AND = /[a-zA-Z0-9.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas
	 * */
	static SAN_ANSC = /[a-zA-Z0-9\s,]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, dots
	 * */
	static SAN_ANSD = /[a-zA-Z0-9\s.]/g;
	
	/*
	 * a-z, A-Z, 0-9, spaces, commas, dots
	 * */
	static SAN_ANSCD = /[a-zA-Z0-9\s,.]/g;
	
	/**
	 * ISO date format YYYY-MM-DD
	 * */
	static SAN_ISO_DATE = /(\d{4}-\d{2}-\d{2})/g;
	
	/**
	 * ISO time format HH:MM:SS
	 * */
	static SAN_ISO_TIME = /(\d{2}:\d{2}:\d{2})/g;
	
	#option;
	
	// Form dom
	#form;
	
	// Flags if the form submission came from one of non-designated buttons
	#fromUnauthorized = false;
	
	// Indicates whether the form inputs are resolved and ready to be submitted
	#canSubmit = true;
	
	// Holds the configuration info for each element
	#eleConfigArr = [];
	
	#iconOk = '&#10004;';
	#iconErr = '&#10060;';
	
	// Callback invoked when validation is done and ready for consumer code
	#validationConsumer;
	
	// Default validation handler callback
	#validationHandler = (success, eleConfig) => {
		if (this.#option.resettingForm) {
			return;
		}
		
		let inline =  eleConfig.owns('inline') ? eleConfig.inline : this.#option.inline;
		let icon = success ? this.#iconOk : this.#iconErr;
		
		// add the msg element if we have none
		let haveNextEle = $(eleConfig.ele).next().hasClass('jst-form-msg');
		let havePositionedEle = eleConfig.owns('msgPos');
		
		if (!haveNextEle || havePositionedEle) {
			let msgEle = `<div class="jst-form-msg"><span></span> <span></span></div>`;
			
			// add the message element accordingly
			if(havePositionedEle) $(`#${eleConfig['msgPos']}`).html(msgEle);
			else $(eleConfig.ele).after(msgEle);
		}
		
		// update the nextEle to newly inserted one since we have just updated
		let nextEle = havePositionedEle ? $('#' + eleConfig['msgPos']) : $(eleConfig.ele).next();
		
		if (success && this.#option.feedbackErrOnly) {
			nextEle.hide();
			return;
		} else {
			nextEle.show();
		}
		
		/*
		 * Update the icon, message and the color class
		 */
		let spans = $(nextEle).find('span');
		let iconSpan = spans[0];
		let msgSpan = spans[1];
		
		if (eleConfig.owns('showIcon') ? eleConfig.showIcon : this.#option.showIcon) {
			$(iconSpan).html(icon);
		}
		
		if (eleConfig.owns('showMsg') ? eleConfig.showMsg : this.#option.showMsg) {
			$(msgSpan).html(eleConfig.msg);
		}
		
		let addColorCls = success	? 'jst-form-msg-success' : 'jst-form-msg-error';
		$(nextEle)
			.removeClass('jst-form-msg-error jst-form-msg-success')
			.addClass(addColorCls);
		
		// make sure the message element is shown; it could be made hidden by reset function
		$(nextEle).css('display', inline ? 'inline' : 'block');
	};
	
	/**
	 *
	 * @param {string|object} form The form id or the form object.
	 *
	 * @param {object} option
	 * @param {boolean=false} option.inline When true input validation feedback is shown next to input as inline html element otherwise
	 * 										shown as block level element
	 * @param {boolean=true} option.showIcon Whether to show icon on feedback handled by default validation handler.
	 * @param {boolean=true} option.showMsg Whether to show feedback message if validation handled by default validation handler.
	 * @param {boolean=false} option.feedbackErrOnly Whether to show validation error feedback message to the user.
	 * @throws {Error} If the form element can't be found
	 * */
	constructor(form, option = {}) {
		// Indicated whether the feedback message should be inline or block level element
		jst.setProperty(option, 'inline', false);
		
		jst.setProperty(option, 'showIcon', true);
		jst.setProperty(option, 'showMsg', true);
		jst.setProperty(option, 'feedbackErrOnly', false);
		
		// Indicates if the form has already been attempted to be submitted
		option['firstSubmission'] = true;
		
		this.#option = option;
		
		// First make sure we have found the form to work with
		if(!$(form).is('form') && typeof form !== 'string') {
			throw new Error('Argument form must be an id or a reference to a form');
		}
		
		this.#form = jst.eleById(form);
		
		if (jst.isUndef(this.#form) || this.#form === null) {
			throw new Error(`Failed to find the form`);
		}
		
		// Prevent the form submission automatically and hook to validate method to validate inputs
		let formJQ = $(this.#form);
		formJQ.submit((evt) => {
			evt.preventDefault();
			this.validate();
		});
		
		/*
		 * Clicking on buttons with `data-jst-form-submitter` attribute
		 * can submit the form automatically
		 */
		formJQ
			.find(`input[type="submit"]:not([data-jst-form-submitter]), button:not([data-jst-form-submitter])`)
			.click(() => {
				this.#fromUnauthorized = true;
			});
		
		formJQ
			.find('input[data-jst-form-submitter], button[data-jst-form-submitter]')
			.click(() => {
				this.#fromUnauthorized = false;
			});
	}
	
	/**
	 * Form element is identified by id. ID can be separated by '-' so that it
	 * can be split into capitalized word for nice feedback message
	 *
	 * @param {object} eleConfig
	 * @return {string}
	 * */
	static #getEleName(eleConfig) {
		if (eleConfig.owns('alias')) return eleConfig.alias;
		
		let value = eleConfig.id || eleConfig.name;
		value = value.replaceAll(/-/g, ' ');
		return value.capitalize(true);
	}
	
	/**
	 * Form element can be of various types such as input, select, textarea etc.
	 * This method can detect these types and return the value based on types.
	 *
	 * @param {object} eleConfig
	 * @return {boolean|string|number}
	 * */
	static #getValue(eleConfig) {
		let type = $(eleConfig.ele).attr('type');
		
		if (type === 'radio') {
			return $(`input[name="${eleConfig.name}"]:checked`).val();
		} else if (type === 'checkbox') {
			return $(eleConfig.ele).is(":checked") ? $(eleConfig.ele).val() : false;
		} else return $(eleConfig.ele).val();
	}
	
	/**
	 * Adds rules to perform validation on specified element
	 *
	 *
	 * @param {object|array}                    rules Rules the form is validated against. Each rule is an object
	 * 												  specifying the filters
	 * @param {string}                          rules.id id of the form element
	 * @param {'str'|'int'|'float'|'email'}     rules.type the type of the data must be provided in
	 * @param {string=}                         rules.name 'name to the radio input
	 * @param {number=}                         rules.min the min value
	 * @param {number=}                         rules.max the max value
	 * @param {number=}                         rules.minLen the minimum length
	 * @param {number=}                         rules.maxLen the maximum length
	 * @param {boolean=}                        rules.inline indicates to show feedback as inline
	 * @param {string=}                         rules.msgPos id of where to show the feedback message div
	 * @param {string=}                         rules.alias friendly name to be shown to call the element in feedback message
	 * @param {string=}                         rules.pattern any Form pattern constant or custom patter to match
	 * @param {number=}                         rules.place the floating fractional place length
	 * @param {array=}                          rules.option array containing the permitted options for the input
	 * @param {boolean=}                        rules.showIcon whether to show icon on feedback if handled by default validation handler. Default is true.
	 * @param {boolean=}                        rules.showMsg whether to show feedback message if handled by default validation handler. Default is true.
	 * */
	addRule(...rules) {
		// unpack the objects
		if (Array.isArray(rules[0])) rules = rules[0];
		
		rules.forEach((rule) => {
			// Get the form input element and see if it is defined
			let ele = $(this.#form).find(`#${rule.id}`)[0];
			
			if (jst.isUndef(ele) && rule.owns('name'))
				ele =  $(this.#form).find(`[name=${rule.name}]`);
			
			if (jst.isUndef(ele)) {
				console.warn('Element with no identity(id/name) has been skipped');
				return;
			}
			
			// Add the form element to the object
			rule['ele'] = ele;
			
			rule['ok'] = false;
			rule['lastCheckPassed'] = true;
			rule['key'] = rule.id || rule.name;
			
			// Holds last error handled by validationHandler callback
			rule['msg'] = null;
			
			// Indicates if the element previously had errors
			rule['dirty'] = false;
			
			this.#addListener(rule);
			
			// Store ref to all the passed ele configurations after setup
			this.#eleConfigArr.push(rule);
		});
	}
	
	/**
	 * Resets the form inputs. Optionally it can hide input error/feedback message divs.
	 * */
	resetForm() {
		this.#form?.reset();
		
		this.#option.firstSubmission = true;
		this.#option.resettingForm = true;
		
		let formJQ = $(this.#form);
		
		// Reset element config data
		for (let eleConfig of this.#eleConfigArr) {
			eleConfig.ok = false;
			eleConfig.msg = null;
			eleConfig.dirty = false;
			eleConfig.lastCheckPassed = true;
			
			let msgEle;
			
			if (eleConfig.owns('msgPos')) {
				msgEle = $(`#${eleConfig.msgPos}`);
			} else if (eleConfig.owns('id')) {
				msgEle = formJQ.find(`#${eleConfig.id} + .jst-form-msg`);
			}
			
			msgEle?.css('display', 'none');
			
			/*
			 * If validation feedback handler is custom one, then allow them
			 * to reset the form UI be at initial state!
			 * */
			eleConfig.reset = true;
			this.#validationHandler(null, eleConfig);
			delete eleConfig.reset;
		}
		
		this.#option.resettingForm = false;
	}
	
	/**
	 * Submits the form to action set on the form.
	 *
	 * This method can be useful because FormInspector prevents the default
	 * form submission behaviour in order to validate the form inputs.
	 * */
	submit() {
		if (this.#fromUnauthorized) return;
		
		// Disable our submit listener first!
		$(this.#form).off('submit');
		
		// Then submit it
		$(this.#form).submit();
		
		// Prepare if submission failed somehow!
		$(this.#form).on('submit');
	}
	
	/**
	 * It checks all the inputs against the rules set.
	 *
	 * @param {boolean=true} submitOnPass Whether to submit the form on validation pass
	 * */
	validate(submitOnPass = true) {
		/*
		 * Stop validating if it came from an unauthorized button!
		 * And prepare for next time!
		 */
		if (this.#fromUnauthorized) {
			this.#fromUnauthorized = false;
			return;
		}
		// say, we can submit the form
		this.#canSubmit = true;
		
		this.#eleConfigArr.forEach(ele => {
			if (jst.isUndef(ele.ele)) return;
			
			this.#filter(ele);
			
			if (this.#canSubmit) this.#canSubmit = ele.ok;
		});
		
		// Form is no longer submitted as a first timer next time!
		this.#option.firstSubmission = false;
		
		// Stop if it is set not to submit!
		if (this.#canSubmit && !submitOnPass) {
			return this.#canSubmit;
		}
		
		/*
		 * If no one cares about the validation outcome, then submit the form!
		 * Otherwise notify them!
		 * */
		if (!this.#validationConsumer && this.#canSubmit) {
			this.submit();
		} else {
			this.#validationConsumer?.(this.#canSubmit);
		}
		
		return this.#canSubmit;
	}
	
	/**
	 * Sets a custom validation handler which will be invoked on form submit or as user interacts with the
	 * form elements.
	 *
	 * Callback functions receives 2 arguments. A boolean indicating if validation passed, followed by the
	 * element's validation config object which has `msg` property telling about the inspector's feedback.
	 *
	 * Importantly, config object will have a property called 'reset' , if the form is being reset allowing
	 * the callback to put the element at initial state.
	 *
	 * @param {function (status:boolean, config:object)} fn
	 * */
	setFeedbackHandler = (fn) => {
		this.#validationHandler = fn;
	}
	
	/**
	 * Add various types of listeners such as keyup, blur based on the form element type.
	 * It can also perform any needed logic before handing over the listener callback
	 * function to verify the input.
	 *
	 * @param {object} eleConfig
	 * */
	#addListener(eleConfig) {
		let ele = eleConfig.ele;
		let nodeName = $(ele).prop('nodeName').toLowerCase();
		let eleType = $(ele).attr('type');
		
		$(ele).on('blur', () => {
			this.#filter(eleConfig);
			
			/*
			 * Flag on blur whether the validation passed!
			 * If so, then we would allow users modifying input without distracting
			 * with feedback message!
			 * */
			eleConfig.lastCheckPassed = eleConfig.ok;
		});
		
		if (eleType === 'radio' || eleType === 'checkbox' || nodeName === 'select') {
			$(ele).change(() => this.#filter(eleConfig) );
		} else {
			$(ele).keyup(() => {
				/*
				 * No distracting user with feedback message!
				 */
				if (eleConfig.lastCheckPassed) return;
				
				this.#filter(eleConfig);
			});
		}
	}
	
	#filter = (eleConfig) => {
		let nodeName = $(eleConfig.ele).prop('nodeName').toLowerCase();
		let filterType = eleConfig.type;
		let inputType = $(eleConfig.ele).attr('type');
		
		let ok;
		
		// stop from selecting first option of the select input
		if (nodeName === 'select') {
			if(JstFormInspector.#getValue(eleConfig) === '') {
				eleConfig.ok = this.#handleValidation(false, eleConfig, 'Required');
				return;
			}
		}
		
		if (filterType === 'email' || inputType === 'email') ok = this.#email(eleConfig);
		else if (filterType === 'str') 	 ok = this.#str(eleConfig);
		else if (filterType === 'int') 	 ok = this.#int(eleConfig);
		else if (filterType === 'float') ok = this.#float(eleConfig);
		
		// check if we need to match any pattern
		if (ok && eleConfig.owns('pattern')) ok = this.#pattern(eleConfig);
		
		eleConfig.ok = ok;
	};
	
	#email = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let result = emailRegex.test(value);
		let msg = result ? 'Email accepted' : 'Invalid email';
		return this.#handleValidation(result, eleConfig, msg);
	};
	
	#str = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		value = value.trim();
		
		if (!this.#checkLen(eleConfig, value)) return false;
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#int = (eleConfig) => {
		let value =  JstFormInspector.#getValue(eleConfig);
		
		// make sure we have actual string input
		if(!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		// keep anything except numbers from the input then see if it has invalid character
		let iChar = value.replace(/[0-9]/g, '');
		if (iChar.length > 0) return this.#handleValidation(false, eleConfig, 'Invalid number');
		
		// get the number
		value = parseInt(value);
		
		if (!Number.isSafeInteger(value)) return this.#handleValidation(false, eleConfig, `Must be an integer`);
		if (!this.#checkLen(eleConfig, value)) return false;
		if(!this.#checkRange(eleConfig, value)) return false;
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#float = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		
		// make sure we have actual string input
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		
		// add the floating point place if it has not
		if (value.match(/\./g) == null) value += '.0';
		
		if (value.replaceAll(/-?\d+\.\d+/g, '').length !== 0) return this.#handleValidation(false, eleConfig, 'Illegal input');
		
		if (!this.#checkLen(eleConfig, value)) return false;
		
		if (!this.#checkRange(eleConfig, value)) return false;
		
		if (eleConfig.owns('place')) {
			if (value.split('.')[1].length !== eleConfig['place'])
				return this.#handleValidation(false, eleConfig, `Fractional place must be of ${eleConfig['place']}`);
		}
		
		if (!this.#checkInOption(eleConfig, value)) return false;
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#pattern = (eleConfig) => {
		let value = JstFormInspector.#getValue(eleConfig);
		if (!jst.isStr(value)) return this.#handleValidation(false, eleConfig, `Required`);
		if (value.replaceAll(eleConfig.pattern, '').length !== 0) return this.#handleValidation(false, eleConfig, `Invalid input`);
		return this.#handleValidation(true, eleConfig, `${JstFormInspector.#getEleName(eleConfig)} accepted`);
	};
	
	#checkLen(eleConfig, value) {
		if ((typeof value).toLowerCase() !== 'string') value = String(value);
		
		let min = eleConfig.minLen || 0;
		let max = eleConfig.maxLen || -1;
		
		if (value.length < min) return this.#handleValidation(false, eleConfig, `Must be ${min} in length`);
		if (max !== -1 && value.length > max) return this.#handleValidation(false, eleConfig, `Exceeded maximum length of ${max}`);
		return true;
	}
	
	#checkRange(eleConfig, value) {
		let min = eleConfig.min || 0;
		let max = eleConfig.max || -1;
		
		if (value < min) return this.#handleValidation(false, eleConfig, `Can't be less than ${min}`);
		if (max !== -1 && value > max) return this.#handleValidation(false, eleConfig, `Can't be greater than ${max}`);
		return true;
	}
	
	#checkInOption(eleConfig, value) {
		let inOption = false;
		if (eleConfig.owns('option')) {
			for (const opValue of eleConfig['option']) {
				if (opValue === value) {
					inOption = true;
					break;
				}
			}
		} else return true;
		
		let msg = $(eleConfig.ele).attr('type') === 'checkbox' ? `Must be acknowledged` : `Must be of valid options`;
		if (!inOption) return this.#handleValidation(false, eleConfig, msg);
		return true;
	}
	
	// Based on the value of the result, it either updates or adds the message element
	// into the specified element or to the next of the input element by default.
	#handleValidation(success, eleConfig, msg) {
		// Update dirty flag
		if (!success && !eleConfig.dirty) {
			eleConfig.dirty = true;
		}
		
		/*
		 * No drawing attention for successful input on first form submission!
		 * Also consider if form was reset as well as dirty flag!
		 */
		if (success && this.#option.firstSubmission && !eleConfig.dirty) {
			return success;
		}
		
		/*
		 * Always send error, if it hasn't been handled!
		 */
		if (!success && eleConfig.msg !== msg) {
			eleConfig.msg = msg;
			this.#validationHandler(success, eleConfig);
			return success;
		}
		
		/*
		 * User didn't correct the input
		 */
		if (!success && eleConfig.msg === msg) {
			return success;
		}
		
		/*
		 * Here it means that the element is dirty (previously had errors) and user fixed it
		 */
		if (success && eleConfig.dirty && eleConfig.msg !== msg) {
			eleConfig.msg = msg;
			this.#validationHandler(success, eleConfig);
		}
		
		return success;
	}
	
	/**
	 * Change the icon to be shown when input is accepted
	 *
	 * @param html {string} Any HTML value for the icon
	 * @return {JstFormInspector}
	 * */
	setIconOk(html) { this.#iconOk = html; return this; }
	
	/**
	 * Change the icon to be shown when input has an error
	 *
	 * @param html {string} Any HTML value for the icon
	 * @return {JstFormInspector}
	 * */
	setIconErr(html) { this.#iconErr = html; return this; }
	
	/**
	 * Callback to be invoked when validation is done.
	 *
	 * @param {function (success: boolean)} fn function invoked, passing the validation outcome as boolean.
	 */
	onValidate (fn) {
		this.#validationConsumer = fn;
	}
	
	/**
	 * Returns the form element.
	 *
	 * @return HTMLFormElement
	 * */
	getForm() {
		return this.#form;
	}
}