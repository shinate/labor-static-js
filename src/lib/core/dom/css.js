var isNode = require('./isNode');
var setStyle = require('./setStyle');

module.exports = function (node, styles) {
    if (isNode(node) && typeof styles === 'object') {
        for (var s in styles) {
            setStyle(node, s, styles[s]);
        }
    }
};

