
class Moment {

    #datetime;

    constructor(datetime = new Date()) {
        if (jQuery.type(datetime) === 'string' || jQuery.type(datetime) === 'number')
            this.#datetime =  new Date(datetime);
        else if (datetime instanceof Date) this.#datetime = new Date(datetime.toISOString());
        else if (datetime instanceof Moment) this.#datetime = new Date(datetime.iso());
        else new Error('Invalid time value was passed');
    }

    /**
     * Using this method, the starting millisecond of the shomoy can be calculated.
     *
     * @return {number} the starting millisecond of the shomoy object.
     */
    momentStart() { return new Date(this.iso()).setHours(0, 0, 0, 0); }

    /**
     * Using this method, the ending millisecond of the shomoy can be calculated.
     *
     * @return {number} the ending milliseconds of the shomoy object.
     */
    momentEnd() { return this.momentStart() - 1 + Moment.msInDay(1); }

    /**
     * A shomoy object can compare itself with other shomoy object. Internally it
     * uses the valueOf() method of date object to calculate the difference in
     * timestamp and returns either 0, 1, or -1 based on the calculation.
     *
     * @param moment {Moment} The Shomoy object to calculate against
     *
     * @return int the difference between two shomoy objects
     * */
    compare (moment) {
        if (!(moment instanceof Moment)) throw new Error('Argument must be an instance of Moment.');

        let momentA = this.datetime.valueOf();
        let momentB = moment.dateTime.valueOf();

        if (momentA < momentB) return -1;
        else if (momentA > momentB) return 1;
        else return 0;
    }

    /**
     * The difference between two shomoy objects can be calculated either in
     * milliseconds(which is default) or microseconds(timestamp) value. It always
     * finds the difference from $this object to passed one.
     *
     * @param moment {Moment} the Shomoy object to calculate the difference against
     * @param inMilli {boolean} indicates whether to calculate in milliseconds or microseconds
     *
     * @return int the difference between two Shomoy objects.
     * */
    diff(moment, inMilli = true) {
        if (!(moment instanceof Moment)) throw new Error('Argument must be an instance of Moment.');

        if (inMilli) return this.getMilliseconds() - moment.getMilliseconds();
        else return this.getTimestamp() - moment.getTimestamp();
    }

    diffHour(moment) {
        if (!(moment instanceof Moment)) throw new Error('Argument must be an instance of Moment.');
        let diff = this.diff(moment, false);
        return diff / 3600;
    }

    diffCompo(moment) {
        if (!(moment instanceof Moment)) throw new Error('Argument must be an instance of Moment.');

        let time = this.diff(moment, false);

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
     * @param ms {number} number of milliseconds to be added.
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
     * @param sec {number} number of seconds to be added.
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
     * @param min {number} number of minutes to be added.
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
     * @param hour {number} number of hours to be added.
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
     * @param day {number} number of days to be added.
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
     * @param month {number} number of months to be added.
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
     * @param year {number} number of years to be added.
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

    static isoNow = () => { return new Moment().iso(); };

    static secInMin(of) { return 60 * of; }

    static secInHour(of) { return 60 * 60 * of; }

    static secInDay(of) { return 60 * 60 * 24 * of; }

    static msInDay(of) { return 1000 * 60 * 60 * 24 * of; }

    static clone(moment) {
        if (!moment instanceof Moment) throw new Error('Argument must be instance of Moment.');
        return new Moment(moment);
    }

    static firstDayOfMonth(month, year) {
        let now = new Moment();

        if (!Number.isSafeInteger(year)) year = now.getYear();
        month = !Number.isSafeInteger(month) ? now.getMonth() : month;

        now.setYear(year).setMonth(month).setDate(1).setHour(0).setMin(0).setSec(0).setMilli(0);
        return now.datetime;
    }

    static lastDayOfMonth(month, year) {
        let mom = new Moment();

        if (!Number.isSafeInteger(year)) year = mom.getYear();
        month = !Number.isSafeInteger(month) ? mom.getMonth() : month;

        mom.setYear(year).setMonth(month+1).setDate(0).setHour(0).setMin(0).setSec(0).setMilli(0);
        return mom.datetime;
    }

    /**
     * This static method can calculate the weeks since a month util specified month. It returns
     * weeks as array of objects. By default, objects have the key of date with month and the value
     * is an array of the start and end milliseconds of the week.
     *
     * Months are not zero based as in JavaScript. January is always 1 in this case. The week days
     * starts on Monday.
     *
     * Optional key and value decorator can be passed as arguments to configure the weeks listing.
     * Decorator functions take on from and to moment objects.
     *
     * @param since {Array} Containing the month and year in order.
     * @param to {Array} Containing the month and year in order.
     * @param keyDecFn {Function} Decorator function for keys.
     * @param valDecFn {Function} Decorator function for values.
     *
     * @return {Array} Containing objects of time values under keys as specified by decorator functions.
     * */
    static listWeek(since = [], to = [], keyDecFn = null, valDecFn = null) {
        const WEEK_START = 1;

        let valDecorator = valDecFn || Moment.#valDecorator;
        let keyDecorator = keyDecFn || Moment.#weekKeyDecorator;

        let weeks = [];

        // get the limit parameters
        let now = new Date();

        let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth() + 1) ;
        let yearTo = to[1] || now.getFullYear();

        let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
        let yearFrom = since[1] || now.getFullYear();

        // build up moment objects for getting start and end limit
        let end = new Moment(Moment.firstDayOfMonth(monthTo, yearTo)).addSec(-1).valueOf();

        // construct a moment with given month and year
        let moment  = new Moment(Moment.firstDayOfMonth(monthFrom, yearFrom));

        // start with the 'from' month, where we may find broken week and discard that week
        let momStartDay = moment.getDay();
        if (momStartDay !== WEEK_START) {
            // find out how far the next week start day is
            // if it is sunday(0) which is one day to monday.
            let daysTo = (momStartDay === 0) ? 1 : 8 - momStartDay;
            moment.addDay(daysTo);
        }

        let makeStop = false;

        while (true) {
            if (makeStop) break;

            let currentMilli = moment.valueOf();

            // are we exceeding the limit?
            if (currentMilli >= end) {
                break;
            }

            let to = Moment.clone(moment);
            to.addDay(7).addSec(-1);

            let obj = {};
            let key1 = keyDecorator(moment, to);
            obj[key1] = valDecorator(moment, to);
            weeks.push(obj);

            moment.addDay(7);
        }

        return weeks;
    }

    static listMonth(since = [], to = [], keyDecFn = null, valDecFn = null) {

        // get the limit parameters
        let now = new Date();

        let monthFrom = Number.isSafeInteger(since[0]) ? (since[0] - 1) : now.getMonth();
        let yearFrom = since[1] || now.getFullYear();

        let monthTo = Number.isSafeInteger(to[0]) ? (to[0] - 1) : (now.getMonth()) ;
        let yearTo = to[1] || now.getFullYear();

        let end = new Moment(Moment.lastDayOfMonth(monthTo, yearTo)).addHour(24).addSec(-1).valueOf();

        let mom = new Moment();
        mom.setMonth(monthFrom);
        mom.setYear(yearFrom);

        let valDecorator = valDecFn || Moment.#valDecorator;
        let keyDecorator = keyDecFn || Moment.#dayKeyDecorator;
        let result = [];

        while(true) {
            let momA = new Moment(Moment.firstDayOfMonth(mom.getMonth(), mom.getYear()));
            let momB = new Moment(Moment.lastDayOfMonth(mom.getMonth(), mom.getYear())).addHour(24).addSec(-1);
            let a = momA.valueOf();
            let b = momB.valueOf();
            if (b > end) break;

            let obj = {};
            obj[keyDecorator(mom)] = valDecorator(momA, momB);
            result.push(obj);

            // keep going until break
            mom.addMonth(1);
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
     * @param sec {number} Number of seconds is to be added to the current time in second.
     * @param min {number} Number of minutes is to be added to the current time in second.
     * @param hour {number} Number of hours is to be added to the current time in second.
     * @param day {number} Number of days is to be added to the current time in second.
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

    static #valDecorator(from, to) {
        let start = from.getTimestamp();
        let end = to.getTimestamp();
        return [start, end];
    };

    static #weekKeyDecorator(from, to) {
        let month = from.getMonth() !== to.getMonth() ? `${from.monthStr()}-${to.monthStr()}` : `${from.monthStr()}`;
        let year = from.getYear() !== to.getYear() ? `${from.year()}-${to.year()}` : `${from.year()}`;
        return `${from.date()}-${to.date()} ${month}, ${year}`;
    };

    static #dayKeyDecorator(month) {
        return `${month.monthStr()} ${month.year()}`;
    };

}