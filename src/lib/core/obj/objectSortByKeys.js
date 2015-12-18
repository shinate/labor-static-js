var objectKeys = require('./objectKeys');

module.exports = function (obj, type) {
    type != null && ( type = type.toLowerCase());
    var sortRule = objectKeys(obj);
    sortRule.sort();
    if (type === 'desc') {
        sortRule.reverse();
    }
    var sortIndex = {};
    for (var i = 0, len = sortRule.length; i < len; i++) {
        sortIndex[sortRule[i]] = obj[sortRule[i]];
    }
    return sortIndex;
};
