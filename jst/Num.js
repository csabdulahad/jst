
class Num {

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
     * @param {any} input the number is either in string or number format.
     * @param {string} money currency sign for the number.
     * @param {boolean} lead0 indicates whether to add leading zero before the number.
     * @param {number} place the fractional place of number.
     *
     * @return {string} formatted number with currency sign as specified by arguments.
     * */
    static format(input, money = '', lead0 = false, place = 2) {
        // make sure we have a number
        let num = parseFloat(input);
        if (isNaN(num)) return '0-0';

        // figure out whether it is a round up integer or floating value
        let integer = Number.isSafeInteger(num);

        // learn if it is a positive value
        let negative = num < 0;
        num = negative ? Math.abs(num) : num;

        // create the symbol
        let symbol = negative ? '-' : '';
        symbol += money.length === 0 ? '' : money;

        // add decimal places
        num = !integer ? num.toFixed(place) : num;

        // add leading zero if asked
        num = lead0 ? this.lead0(num) : num;

        return `${symbol}${num}`;
    }

    /**
     * Number formatted in currency can be parsed back to float number using this
     * method. By the default, sign is GBP(Great Britten Pound).
     *
     * @param {string} input number is in currency format.
     * @param {string} sign currency sign.
     *
     * @return {number} the parsed floating number.
     * */
    static moneyToNum(input, sign = Num.MONEY_GBP) {
        input = String(input);
        return parseFloat(input.replace(sign, ''));
    }

    /**
     * Leading zero can be added to any number if it is less than 10.
     *
     * @param {number} number the number.
     *
     * @return {string} number with leading zero if needed.
     * */
    static lead0(number) {
        return (number < 10) ? `0${number}` : number;
    }

}