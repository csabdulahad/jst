
/*
*   Biscuit is a class which safely accesses and saves the values into the cookie
*   storage. It has simplified method for each primitive data type for accessing
*   and storing the value.
*
*   Any cookie value can also be deleted too. By default, it save cookie for 1 year
*   or 365 days.
* */
class Biscuit {

    static set(key, value, expDay= 365) {
        const d = new Date();
        d.setTime(d.getTime() + (expDay * 24 * 60 * 60 * 1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";SameSite=Lax; path=/";
    }

    static unset(key) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Lax`;
    }

    static getBool(key, defaultValue) {
        let value = Biscuit.getStr(key, null);
        if (value == null) return defaultValue;
        return value === 'true';
    }

    static getInt(key, defaultValue) {
        return parseInt(Biscuit.getStr(key, defaultValue));
    }

    static getFloat(key, defaultValue) {
        return parseFloat(Biscuit.getStr(key, defaultValue));
    }

    static getStr(key, defaultValue) {
        let name = key + "=";
        let decodedCookie = decodeURIComponent(document.cookie);

        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return defaultValue;
    }

}
