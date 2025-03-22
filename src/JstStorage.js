class JstStorage {
	
	/**
	 * @param {string} key
	 * @param {number|string|boolean} value
	 * */
	static set(key, value) {
		localStorage.setItem(key, value);
	}
	
	/**
	 * @param {string} key
	 * */
	static unset(key) {
		localStorage.removeItem(key);
	}
	
	/**
	 * @param {string} key
	 * @param {boolean} defValue
	 * @return {boolean}
	 * */
	static bool(key, defValue) {
		return Boolean(localStorage.getItem(key)) ?? defValue;
	}
	
	/**
	 * @param {string} key
	 * @param {string} defValue
	 * @return {string}
	 * */
	static str(key, defValue) {
		return localStorage.getItem(key) ?? defValue;
	}
	
	/**
	 * @param {string} key
	 * @param {number} defValue
	 * @return {number}
	 * */
	static int (key, defValue) {
		let data = localStorage.getItem(key) ?? defValue;
		data = parseInt(data);
		
		return isNaN(data) ? defValue : data;
	}
	
	/**
	 * @param {string} key
	 * @param {number} defValue
	 * @return {number}
	 * */
	static float (key, defValue) {
		let data = localStorage.getItem(key) ?? defValue;
		data = parseFloat(data);
		
		return isNaN(data) ? defValue : data;
	}
	
	static setCookie(key, value, expDay= 365) {
		const d = new Date();
		d.setTime(d.getTime() + (expDay * 24 * 60 * 60 * 1000));
		let expires = "expires="+ d.toUTCString();
		document.cookie = key + "=" + value + ";" + expires + ";SameSite=Lax; path=/";
	}
	
	static unsetCookie(key) {
		document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Lax`;
	}
	
	static cookieBool(key, defaultValue) {
		let value = JstStorage.cookieStr(key, null);
		if (value == null) return defaultValue;
		return value === 'true';
	}
	
	static cookieInt(key, defaultValue) {
		return parseInt(JstStorage.cookieStr(key, defaultValue));
	}
	
	static cookieFloat(key, defaultValue) {
		return parseFloat(JstStorage.cookieStr(key, defaultValue));
	}
	
	static cookieStr(key, defaultValue) {
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