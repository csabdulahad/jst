
class Shomoy {

    #datetime;

    /**
     * Create a shomoy object.
     *
     * @param {number|string|Date|Shomoy} datetime The value can a valid value that JS accepts
     * for Date object. Moreover, another date or shomoy object can passed-in as value.
     * By default, it creates from the current datetime.
     * */
    constructor(datetime = new Date()) {
        if (datetime instanceof Date) this.#datetime = new Date(datetime.toISOString());
        else if (datetime instanceof Shomoy) this.#datetime = new Date(datetime.iso());
        else if (jQuery.type(datetime) === 'string') this.#datetime =  new Date(datetime);
        else if (jQuery.type(datetime) === 'number') this.#datetime =  new Date(datetime);
        else new Error('Invalid time value was passed');
    }

    /**
     * Using this method, the starting millisecond of the shomoy can be calculated.
     *
     * @return {number} the starting millisecond of the shomoy object.
     */
    shomoyStart() { return new Date(this.iso()).setHours(0, 0, 0, 0); }

    /**
     * Using this method, the ending millisecond of the shomoy can be calculated.
     *
     * @return {number} the ending milliseconds of the shomoy object.
     */
    shomoyEnd() { return this.shomoyStart() - 1 + Shomoy.msInDay(1); }

    /**
     * A shomoy object can compare itself with other shomoy object. Internally it
     * uses the valueOf() method of date object to calculate the difference in
     * timestamp and returns either 0, 1, or -1 based on the calculation.
     *
     * @param {Shomoy} shomoy The Shomoy object to calculate against
     *
     * @return {number} int the difference between two shomoy objects. Returns 0 if both
     * shomoy are equal, -1 if the comparing shomoy is bigger, otherwise 1.
     * */
    compare (shomoy) {
        if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');

        let shomoyA = this.datetime.valueOf();
        let shomoyB = shomoy.dateTime.valueOf();

        if (shomoyA < shomoyB) return -1;
        else if (shomoyA > shomoyB) return 1;
        else return 0;
    }

    /**
     * The difference between two shomoy objects can be calculated either in
     * milliseconds(which is default) or microseconds(timestamp) value. It always
     * finds the difference from $this object to passed one.
     *
     * @param {Shomoy} shomoy the Shomoy object to calculate the difference against
     * @param {boolean} inMilli indicates whether to calculate in milliseconds or microseconds
     * @return {number} the difference between two Shomoy objects.
     * */
    diff(shomoy, inMilli = true) {
        if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');

        if (inMilli) return this.getMilliseconds() - shomoy.getMilliseconds();
        else return this.getTimestamp() - shomoy.getTimestamp();
    }

    /**
     * Difference in hour with another shomoy object can be calculated. It internally
     * uses Shomoy.diff() method.
     *
     * @param {Shomoy} shomoy A shomoy to calculate against
     * @return {number} The difference from the passed-in shomoy
     * */
    diffHour(shomoy) {
        if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');
        let diff = this.diff(shomoy, false);
        return diff / 3600;
    }

    /**
     * Difference with another shomoy object can be calculated and returned as an array of components
     * of time in order: sec, min, hour, day.
     *
     * @param {Shomoy} shomoy The shomoy object to calculate against
     * @return {array} Containing time components
     * */
    diffCompo(shomoy) {
        if (!(shomoy instanceof Shomoy)) throw new Error('Argument must be an instance of shomoy.');

        let time = this.diff(shomoy, false);

        let secInDay = 60 * 60 * 24;

        // day
        let day = time / secInDay;
        let dayLeft = ~~day;

        // hour
        let hour = (day % 1) * 24;
        let hourLeft = ~~hour;

        // min
        let min = (hour % 1) * 60;
        let minLeft = ~~min;

        // sec
        let secLeft = (min % 1) * 60;

        // fix the round up second problem
        if (Math.round(secLeft) === 60) {
            secLeft = 0;
            minLeft += 1;
        }

        return [secLeft, minLeft, hourLeft, dayLeft];
    }

    /**
     * Any number of milliseconds can be added to the Shomoy object using this method.
     * Negative value can be added too.
     *
     * @param {number} ms number of milliseconds to be added.
     * */
    addMs(ms) {
        ms = this.datetime.getMilliseconds() + ms;
        this.datetime.setMilliseconds(ms);
        return this;
    }

    /**
     * Any number of seconds can be added to the Shomoy object using this method.
     * Negative value can be added too.
     *
     * @param {number} sec number of seconds to be added.
     * */
    addSec(sec) {
        sec = this.datetime.getSeconds() + sec;
        this.datetime.setSeconds(sec);
        return this;
    }

    /**
     * Any number of minutes can be added to the Shomoy object using this method.
     * Negative value can be added too.
     *
     * @param {number} min number of minutes to be added.
     * */
    addMin(min) {
        min = this.datetime.getMinutes() + min;
        this.datetime.setMinutes(min);
        return this;
    }

    /**
     * Any number of hours can be added to the Shomoy object using this method.
     * It also takes negative hours which subtracts the hours from the shomoy,
     *
     * @param {number} hour number of hours to be added.
     * */
    addHour(hour) {
        hour = this.datetime.getHours() + hour;
        this.datetime.setHours(hour);
        return this;
    }

    /**
     * Any number of days can be added to the Shomoy object using this method.
     * It also takes negative day which subtracts the days from the shomoy,
     *
     * @param {number} day number of days to be added.
     * */
    addDay(day) {
        day = this.datetime.getDate() + day;
        this.datetime.setDate(day);
        return this;
    }

    /**
     * Any number of months can be added to the Shomoy object using this method.
     * Negative value can be added too.
     *
     * @param {number} month number of months to be added.
     * */
    addMonth(month) {
        month = this.datetime.getMonth() + month;
        this.datetime.setMonth(month);
        return this;
    }

    /**
     * Any number of years can be added to the Shomoy object using this method.
     * Negative value can be added too.
     *
     * @param {number} year number of years to be added.
     * */
    addYear(year) {
        year = this.year() + year;
        this.datetime.setFullYear(year);
        return this;
    }

    iso() { return `${this.year()}-${this.month()}-${this.date()} ${this.hour()}:${this.min()}:${this.sec()}`; }

    toString() { return this.iso(); }

    isoDate () { return this.iso().slice(0, 10); }

    isoTime() { return `${this.hour()}:${this.min()}:${this.sec()}`; }

    getMilliseconds () { return this.datetime.getTime(); }

    getTimestamp () { return this.getMilliseconds() / 1000; }

    getDate = () => this.#datetime.getDate();

    getMonth = () => this.#datetime.getMonth();

    getYear = () => this.#datetime.getFullYear();

    getDay = () => this.#datetime.getDay();

    getHours = () => this.#datetime.getHours();

    getMinutes = () => this.#datetime.getMinutes();

    getSeconds = () => this.#datetime.getSeconds();

    setYear = (year) => {
        this.#datetime.setYear(year);
        return this;
    }

    setMonth = (month) => {
        this.#datetime.setMonth(month);
        return this;
    }

    setDate = (date) => {
        this.#datetime.setDate(date);
        return this;
    }

    setHour = (hour) => {
        this.#datetime.setHours(hour);
        return this;
    }

    setMin = (min) => {
        this.#datetime.setMinutes(min);
        return this;
    }

    setSec = (sec) => {
        this.#datetime.setSeconds(sec);
        return this;
    }

    setMilli = (milli) => {
        this.#datetime.setMilliseconds(milli);
        return this;
    }

    valueOf = () => this.#datetime.valueOf();

    hour (twenty_four = true, lead0 = true) {
        let hour = this.datetime.getHours();
        if (!twenty_four) {
            hour = hour % 12;
            hour = hour === 0 ? 12 : hour;
        }
        return lead0 ? Num.lead0(hour) : hour;
    }

    min (lead0 = true) {
        let min = this.datetime.getMinutes();
        return lead0 ? Num.lead0(min) : min;
    }

    sec (lead0 = true) {
        let sec = this.datetime.getSeconds();
        return lead0 ? Num.lead0(sec) : sec;
    }

    year () { return this.datetime.getFullYear(); }

    month (lead0 = true) {
        let month = this.datetime.getMonth() + 1;
        return lead0 ? Num.lead0(month) : month;
    }

    date (lead0 = true) {
        let date = this.datetime.getDate();
        return lead0 ? Num.lead0(date) : date;
    }

    day(short = true) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = days[this.datetime.getDay()];
        return short ? day.slice(0, 3) : day;
    }

    monthStr(short = true) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let month = months[this.month() - 1];
        return short ? month.slice(0, 3) : month;
    }

    ampm(uppercase = true) {
        let hour = this.datetime.getHours() + 1;
        if (hour >= 12 && hour <= 23) {
            return uppercase ? 'PM' : 'pm';
        } else { return uppercase ? 'AM' : 'am'; }
    }

    strTime24(sec = true) {
        if (sec) return `${this.hour()}:${this.min()}:${this.sec()}`;
        else return `${this.hour()}:${this.min()}`;
    }

    strTime(sec = true, ampm = true, uppercase = true) {
        if (sec) {
            if (ampm)
                return `${this.hour(false)}:${this.min()}:${this.sec()} ${this.ampm(uppercase)}`;
            else
                return `${this.hour(false)}:${this.min()}:${this.sec()}`;
        } else {
            if (ampm)
                return `${this.hour(false)}:${this.min()} ${this.ampm(uppercase)}`;
            else
                return `${this.hour(false)}:${this.min()}`;
        }
    }

    strDate(separated = false) {
        if (separated) return `${this.date()}-${this.month()}-${this.year()}`;
        else return `${this.date()} ${this.monthStr(true)}, ${this.year()}`;
    }

    strDateTime() {
        return `${this.date()} ${this.monthStr()} ${this.year()}, ${this.hour()}:${this.min()}`;
    }

    get datetime () { return this.#datetime; }

    static isoNow = () => { return new Shomoy().iso(); };

    static secInMin(of) { return 60 * of; }

    static secInHour(of) { return 60 * 60 * of; }

    static secInDay(of) { return 60 * 60 * 24 * of; }

    static msInDay(of) { return 1000 * 60 * 60 * 24 * of; }

    static isoDate() { return new Shomoy().isoDate(); }

    static isoTime() { return new Shomoy().isoTime(); }

    static clone(shomoy) {
        if (!shomoy instanceof Shomoy) throw new Error('Argument must be instance of Shomoy.');
        return new Shomoy(shomoy);
    }

    /**
     * For a specified month and year, it returns Date for the first of day of the month.
     * <b>Month is not zero based. January is at 1.</b> If no month & year specified, it
     * returns for the current month.
     *
     * @param {number} month Month
     * @param {number} year Year
     * @return {Date} Date object for the first of the month as specified
     * */
    static firstDayOfMonth(month, year) {
        let now = new Shomoy();

        if (!Number.isSafeInteger(year)) year = now.getYear();
        month = !Number.isSafeInteger(month) ? now.getMonth() : month-1;

        now.setYear(year).setMonth(month).setDate(1).setHour(0).setMin(0).setSec(0).setMilli(0);
        return now.datetime;
    }

    /**
     * For a specified month and year, it returns Date for the last of day of the month.
     * <b>Month is not zero based. January is at 1.</b> If no month & year specified, it
     * returns for the current month.
     *
     * @param {number} month Month
     * @param {number} year Year
     * @return {Date} Date object for the last of the month as specified
     * */
    static lastDayOfMonth(month, year) {
        let shomoy = new Shomoy();

        if (!Number.isSafeInteger(year)) year = shomoy.getYear();
        month = !Number.isSafeInteger(month) ? shomoy.getMonth() : month-1;

        shomoy.setYear(year).setMonth(month+1).setDate(0).setHour(0).setMin(0).setSec(0).setMilli(0);
        return shomoy.datetime;
    }

    /**
     * For a time range, specified by month & year pair in two arrays (since & to), it calculates
     * start & end times in Shomoy for each week found within the range specified.
     *
     * End range it not inclusive.
     *
     * For each week, it composes objects containing array of time range. Both key & value can be
     * derived using decorator functions. Decorator functions take on from and to shomoy objects
     * in order. <b>End range is not inclusive.</b>
     *
     * If no range is specified, then the current month & year is calculated only.
     *
     * Months are not zero. January is always 1 in this case. The week start from Monday.
     *
     * @param {Array} since Containing the month and year in order.
     * @param {Array} to Containing the month and year in order.
     * @param {function(Shomoy, Shomoy)} keyDecFn Decorator function for keys.
     * @param {function(Shomoy, Shomoy)} valDecFn Decorator function for values.
     * @return {Array} Containing objects of time range values under keys as specified by decorator functions.
     * */
    static listWeek(since = [], to = [], keyDecFn = null, valDecFn = null) {
        const WEEK_START = 1;

        let valDecorator = valDecFn || Shomoy.#valDecorator;
        let keyDecorator = keyDecFn || Shomoy.#weekKeyDecorator;

        let weeks = [];

        // get the limit parameters
        let now = new Date();

        let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth() + 1) ;
        let yearTo = to[1] || now.getFullYear();

        let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
        let yearFrom = since[1] || now.getFullYear();

        // build up shomoy objects for getting start and end limit
        let end = new Shomoy(Shomoy.firstDayOfMonth(monthTo, yearTo)).addSec(-1).valueOf();

        // construct a shomoy with given month and year
        let shomoy  = new Shomoy(Shomoy.firstDayOfMonth(monthFrom, yearFrom));

        // start with the 'from' month, where we may find broken week and discard that week
        let momStartDay = shomoy.getDay();
        if (momStartDay !== WEEK_START) {
            // find out how far the next week start day is
            // if it is sunday(0) which is one day to monday.
            let daysTo = (momStartDay === 0) ? 1 : 8 - momStartDay;
            shomoy.addDay(daysTo);
        }

        let makeStop = false;

        while (true) {
            if (makeStop) break;

            let currentMilli = shomoy.valueOf();

            // are we exceeding the limit?
            if (currentMilli >= end) {
                break;
            }

            let to = Shomoy.clone(shomoy);
            to.addDay(7).addSec(-1);

            let obj = {};
            let key1 = keyDecorator(shomoy, to);
            obj[key1] = valDecorator(shomoy, to);
            weeks.push(obj);

            shomoy.addDay(7);
        }

        return weeks;
    }

    /**
     * For a time range, specified by month & year pair in two arrays (since & to), it calculates
     * start & end times in Shomoy for each month found within the range specified. <b>End range
     * is not inclusive.</b>
     *
     * If no range is specified, then the current month & year is calculated only.
     *
     * For each month, it composes objects containing array of time range. Both key & value can be
     * derived using decorator functions. Decorator functions take on from and to shomoy objects
     * in order.
     *
     * Months are not zero. January is always 1 in this case. The week start from Monday.
     *
     * @param {Array} since Containing the month and year in order.
     * @param {Array} to Containing the month and year in order.
     * @param {function(Shomoy)} keyDecFn Decorator function for keys.
     * @param {function(Shomoy, Shomoy)} valDecFn Decorator function for values.
     * @return {Array} Containing objects of time range values under keys as specified by decorator functions.
     * */
    static listMonth(since = [], to = [], keyDecFn = null, valDecFn = null) {

        // get the limit parameters
        let now = new Date();

        let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
        let yearFrom = since[1] || now.getFullYear();

        let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth()) ;
        let yearTo = to[1] || now.getFullYear();

        let end = new Shomoy(Shomoy.lastDayOfMonth(monthTo, yearTo)).addHour(24).addSec(-1).valueOf();

        let shomoy = new Shomoy();
        shomoy.setMonth(monthFrom);
        shomoy.setYear(yearFrom);

        let valDecorator = valDecFn || Shomoy.#valDecorator;
        let keyDecorator = keyDecFn || Shomoy.#dayKeyDecorator;
        let result = [];

        while(true) {
            let shoA = new Shomoy(Shomoy.firstDayOfMonth(shomoy.getMonth(), shomoy.getYear()));
            let shoB = new Shomoy(Shomoy.lastDayOfMonth(shomoy.getMonth(), shomoy.getYear())).addHour(24).addSec(-1);
            shoA.valueOf();
            let b = shoB.valueOf();
            if (b > end) break;

            let obj = {};
            obj[keyDecorator(shomoy)] = valDecorator(shoA, shoB);
            result.push(obj);

            // keep going until break
            shomoy.addMonth(1);
        }

        return result;
    }

    /**
     * This method adds given seconds, minutes, hours and day as seconds to current time. When no
     * argument is set, then it returns current in milliseconds. All the argument's value will be
     * converted into seconds before they get added to the current time in second except the sec
     * argument.
     *
     * All the arguments values have to be of type number. If not, then an exception is thrown.
     *
     * This method can come in handy in situations like setting cookie value with expiration,
     * calculating future date time etc.
     *
     * @param {number} sec Number of seconds is to be added to the current time in second.
     * @param {number} min Number of minutes is to be added to the current time in second.
     * @param {number} hour Number of hours is to be added to the current time in second.
     * @param {number} day Number of days is to be added to the current time in second.
     *
     * @return {number} Seconds added to the current time as defined by the arguments.
     *
     * @throws {Error} If all the arguments are not of type integer
     * */
    addToNow(sec = 0, min = 0, hour = 0, day = 0) {
        if (Number.isNaN(day) || Number.isNaN(hour) || Number.isNaN(min) || Number.isNaN(sec))
            throw new Error('Make sure day, hour and minute are of type number.');

        let now = new Date().valueOf();

        if (sec !== 0) now += sec;
        if (min !== 0) now += min * 60;
        if (hour !== 0) now += hour * 60 * 60;
        if (day !== 0) now += day * 24 * 60 * 60;

        return now;
    }

    /**
     * Default value decorator
     *
     * @param {Shomoy} from
     * @param {Shomoy} to
     * */
    static #valDecorator(from, to) {
        let start = from.getTimestamp();
        let end = to.getTimestamp();
        return [start, end];
    };

    /**
     * Default week key decorator
     *
     * @param {Shomoy} from
     * @param {Shomoy} to
     * */
    static #weekKeyDecorator(from, to) {
        let month = from.getMonth() !== to.getMonth() ? `${from.monthStr()}-${to.monthStr()}` : `${from.monthStr()}`;
        let year = from.getYear() !== to.getYear() ? `${from.year()}-${to.year()}` : `${from.year()}`;
        return `${from.date()}-${to.date()} ${month}, ${year}`;
    };

    /**
     * Default day key decorator
     *
     * @param {Shomoy} month
     * */
    static #dayKeyDecorator(month) {
        return `${month.monthStr()} ${month.year()}`;
    };

}