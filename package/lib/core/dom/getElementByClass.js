(function(global, __PN__, factory) {
    /* CommonJS */
    if ( typeof require === 'function' && typeof module === 'object' && module && typeof exports === 'object' && exports)
        module['exports'] = factory();
    /* AMD */
    else if ( typeof define === 'function' && define['amd'])
        define(function() {
            return factory();
        });
    /* Global */
    else if (global.__NS__ && (typeof global[global.__NS__] === 'object' || typeof global[global.__NS__] === 'function') && global[global.__NS__])
        global[global.__NS__][__PN__] = global[global.__NS__][__PN__] || factory();
    else
        global[__PN__] = global[__PN__] || factory();

})( window ? window : this, 'getElementByClass', function() {

    return function(searchClass, node, tag) {
        node = node || document;
        tag = tag || "*";
        var result = [];
        if (document.getElementsByClassName) {
            var nodes = node.getElementsByClassName(searchClass);
            for (var i = 0; node = nodes[i++]; ) {
                if (tag === '*') {
                    result.push(node);
                }
                else {
                    if (node.tagName === tag.toUpperCase()) {
                        result.push(node);
                    }
                }
            }
        }
        else {
            var classes = searchClass.split(" "), elements = (tag === "*" && node.all) ? node.all : node.getElementsByTagName(tag), patterns = [], current, match;
            var i = classes.length;
            while (--i >= 0) {
                patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));
            }
            var j = elements.length;
            while (--j >= 0) {
                current = elements[j];
                match = false;
                for (var k = 0, kl = patterns.length; k < kl; k++) {
                    match = patterns[k].test(current.className);
                    if (!match)
                        break;
                }
                if (match)
                    result.push(current);
            }
        }
        return result.length === 1 ? result[0] : result;
    };
});
