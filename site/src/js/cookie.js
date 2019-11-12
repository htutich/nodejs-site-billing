module.exports = {
    set(name, value, options) {
        if (value == '') {return}
        val = value;
        options = options || { expires: 99999 };
        var expires = options.expires;
        if (typeof expires == "number" && expires) {
          var d = new Date();
          d.setTime(d.getTime() + expires * 1000);
          expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
          options.expires = expires.toUTCString();
        }
        value = encodeURIComponent(value);
        var updatedCookie = name + "=" + value;
        for (var propName in options) {
          updatedCookie += "; " + propName;
          var propValue = options[propName];
          if (propValue !== true) {
            updatedCookie += "=" + propValue;
          }
        }
        document.cookie = updatedCookie;
        return val;
    },
    get(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        var result = matches ? decodeURIComponent(matches[1]) : undefined;
        result = result == 'true' ? true : result;
        result = result == 'false' ? false : result;
        result = result == undefined ? '' : result;
        return result;
      },
    del(name) {
        this.set(name, "+", { expires: -1 });
    },
    delAll() {
        var cookies = document.cookie.split(";");
    
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
};
