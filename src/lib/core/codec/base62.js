var Base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

module.exports = {
    'encode': function (str) {
        var o = '', i = 0, len = str.length, num = Base62Chars.length;

        while (i < len) {
            o += Base62Chars.charAt(str[i++].charCodeAt() % num);
        }

        return o;
    },
    'decode': function (str) {

    }
};

