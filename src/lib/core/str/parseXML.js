module.exports = function (xml) {
    var dom = null;
    if (window.hasOwnProperty('DOMParser')) {
        try {
            dom = (new DOMParser()).parseFromString(xml, 'text/xml');
        }
        catch (e) {
            dom = null;
        }
    }
    else if (window.ActiveXObject) {
        try {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml))// parse error ..
                throw dom.parseError.reason + dom.parseError.srcText;
        }
        catch (e) {
            dom = null;
        }
    }
    else
        throw 'cannot parse xml string!';

    return dom;
};
