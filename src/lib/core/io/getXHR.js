/**
 * Get a XMLHttpRequest object
 * @id getXHR
 * @return {object} XMLHttpRequest
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var xhr = getXHR();
 */
module.exports = function () {
    var _XHR = false;
    try {
        _XHR = new XMLHttpRequest();
    }
    catch (try_MS) {
        try {
            _XHR = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (other_MS) {
            try {
                _XHR = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (failed) {
                _XHR = false;
            }
        }
    }
    return _XHR;
};
