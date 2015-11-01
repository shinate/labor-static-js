var parseXML = require('../str/parseXML');
var xml2json = require('./xmlToJson');

module.exports = function (xmlString) {
    return xml2json(parseXML(xmlString));
};