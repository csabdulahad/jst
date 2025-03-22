
class JstNum {
	
	/*
    * currency sign constants
    * */
	
	static MONEY_BD = '৳';
	static MONEY_GBP = '£';
	static MONEY_USD = '$';
	
	/**
	 * Any number can be formatted in either currency format with sign or fractional
	 * number with specified place.
	 *
	 * @param {number|string} input the number is either in string or number format.
	 * @param {string} money currency sign for the number.
	 * @param {boolean} lead0 indicates whether to add leading zero before the number.
	 * @param {number} place the fractional place of number.
	 * @param {boolean} addComma adds commas in formatted numbers
	 * @return {string} formatted number with currency sign as specified by arguments.
	 * */
	static format(input, money = '', lead0 = false, place = 2, addComma = true) {
		// Ensure we have a valid number
		let num = parseFloat(input);
		if (isNaN(num)) return '0-0';
		
		// Determine if it's an integer or floating-point value
		let integer = Number.isSafeInteger(num);
		
		// Check if it's negative
		let negative = num < 0;
		num = negative ? Math.abs(num) : num;
		
		// Add the symbol for negative values and any currency symbol
		let symbol = negative ? '-' : '';
		symbol += money.length === 0 ? '' : money;
		
		// Format the number with the specified decimal places
		num = !integer ? num.toFixed(place) : num.toString();
		
		// Split the number into integer and decimal parts (if any)
		let [integerPart, decimalPart] = num.split('.');
		
		// Add commas to the integer part if addComma is true
		if (addComma) {
			integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		
		// Rejoin the integer and decimal parts (if any)
		num = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
		
		// Add leading zero if requested
		num = lead0 ? this.lead0(num) : num;
		
		return `${symbol}${num}`;
	}
	
	/**
	 * Number formatted in currency can be parsed back to float number using this
	 * method. By the default, sign is GBP(Great Britten Pound).
	 *
	 * @param {string} input number is in currency format.
	 * @param {string} sign currency sign.
	 * @return {number} the parsed floating number.
	 * */
	static moneyToNum(input, sign = JstNum.MONEY_GBP) {
		input = String(input);
		return parseFloat(input.replace(sign, ''));
	}
	
	/**
	 * Leading zero can be added to any number if it is less than 10.
	 *
	 * @param {number} number the number.
	 * @return {string} number with leading zero if needed.
	 * */
	static lead0(number) {
		return (number < 10) ? `0${number}` : number;
	}
	
	/**
	 * Converts numbers from English to Bangla notation.
	 *
	 * This function takes a number or a string that represents a number in English
	 * notation and returns a string with each digit converted to Bangla. It's designed
	 * to work with both integer and floating-point numbers represented as strings.
	 * Non-numeric characters within the string are not converted but are preserved
	 * in the output.
	 *
	 * @param {Number|String} englishNumber - The number or string representing a number
	 *        to be converted from English to Bangla digits. This parameter can handle
	 *        both numeric and string types. For string inputs, the function iterates
	 *        through each character, converting numeric characters to Bangla while
	 *        leaving non-numeric characters unchanged.
	 *
	 * @returns {String} A string representation of the input number where each English
	 *         digit has been replaced with its corresponding Bangla digit. Non-numeric
	 *         characters in the input are returned as is in the output string.
	 *
	 * @example
	 * // Convert a numeric value
	 * console.log(convertToBanglaNumber(2023)); // Outputs: ২০২৩
	 *
	 * // Convert a string representing a numeric value
	 * console.log(convertToBanglaNumber("4567")); // Outputs: ৪৫৬৭
	 *
	 * // Mixed input with non-numeric characters
	 * console.log(convertToBanglaNumber("Flight 370")); // Outputs: Flight ৩৭০
	 */
	static bdNum(englishNumber) {
		// Mapping of English digits to Bangla digits
		const banglaDigits = {
			'0': '০', '1': '১', '2': '২', '3': '৩',
			'4': '৪', '5': '৫', '6': '৬', '7': '৭',
			'8': '৮', '9': '৯'
		};
		
		// Convert the number to a string to iterate over each digit
		let englishNumberStr = englishNumber.toString();
		
		// Replace each English digit with its Bangla counterpart
		let banglaNumberStr = '';
		for (let char of englishNumberStr) {
			banglaNumberStr += banglaDigits[char] ?? char; // Keep the character as is if not found in the map
		}
		
		return banglaNumberStr;
	}
	
	static bdOrdinal(num) {
		// Ensure num is treated as a number
		num = typeof num === 'string' ? parseInt(num, 10) : num;
		
		// Define ordinal representations for 1 through 10
		const ordinals = {
			1: 'প্রথম',
			2: 'দ্বিতীয়',
			3: 'তৃতীয়',
			4: 'চতুর্থ',
			5: 'পঞ্চম',
			6: 'ষষ্ঠ',
			7: 'সপ্তম',
			8: 'অষ্টম',
			9: 'নবম',
			10: 'দশম'
		}
		
		// Check if num is in the predefined range
		if (ordinals[num]) {
			return ordinals[num]
		} else if (num > 10) {
			return `${this.bdNum(num)}তম`
		} else {
			return '০'
		}
	}
	
	
}