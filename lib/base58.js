
var bignum = require("bignum"),
    crypto = require('crypto'),
    util = require('util'),
    Base = require('./base');


/**
 * Base-58 conversion tool
 * @constructor
 */
var Base58 = function() {
    Base.call(this); // Inherit from the Base base class (hah)
    this._base58chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; // Base-58 char library
};

util.inherits(Base58, Base);


/**
 * Encode a hex string or array of bytes
 * @param mixed – Hex string or array of bytes
 * @returns {string} - Base encoded string
 */
Base58.prototype.encode = function(mixed) {

    var hex = this.getHexFromObject(mixed);
    if (!hex) { return null; }

    var origHex = "" + hex;
    hex = this.decodeHexToNumeric(hex);
    var output = "";
    while (hex.cmp(0) == 1) {

        var rem = hex.mod(58);
        hex = hex.div(58);
        output = this._base58chars[rem] + output;

    }

    //leading zeros
    for (var i = 0; i < origHex.length && origHex.substr(i, 2) == "00"; i += 2) {
        output = "1" + output;
    }

    return output;

};


/**
 * Decode a base-encoded string into a hex string
 * @param {String} base58 - Base encoded string
 * @returns {string} – hex encoded string
 */
Base58.prototype.decode = function(base58) {
    var origBase58 = "" + base58;

    //only valid chars allowed
    if (base58.match(/[^1-9A-HJ-NP-Za-km-z]/) != null) {
        return "";
    }

    var output = new bignum(0);
    for (var i = 0; i < base58.length; i++) {

        var current = this._base58chars.indexOf(base58[i]);
        //noinspection JSUnresolvedFunction
        output = output.mul(58).add(current);
    }

    output = this.encodeNumericToHex(output);

    //leading zeros
    for (var ii = 0; ii < origBase58.length && origBase58[ii] == "1"; ii++) {
        output = "00" + output;
    }

    if (output.length % 2 != 0) {
        output = "0" + output;
    }

    //noinspection JSUnresolvedFunction
    return output.toUpperCase();
};

module.exports = Base58;