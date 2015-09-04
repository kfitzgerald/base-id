
var bignum = require("bignum"),
    crypto = require('crypto'),
    util = require('util'),
    Base = require('./base');

/**
 * Base-62 conversion tool
 * @constructor
 */
var Base62 = function() {
    Base.call(this); // Inherit from the Base base class (lawls)
    this._base62chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Base 62 library
};

util.inherits(Base62, Base);


/**
 * Encode a hex string or array of bytes
 * @param mixed – Hex string or array of bytes
 * @returns {string} - Base encoded string
 */
Base62.prototype.encode = function(mixed) {

    var hex = this.getHexFromObject(mixed);
    if (!hex) { return null; }

    var origHex = "" + hex;
    hex = this.decodeHexToNumeric(hex);
    var output = "";
    while (hex.cmp(0) == 1) {

        var rem = hex.mod(62);
        hex = hex.div(62);
        output = this._base62chars[rem] + output;

    }

    //leading zeros
    for (var i = 0; i < origHex.length && origHex.substr(i, 2) == "00"; i += 2) {
        output = "0" + output;
    }

    return output;
};


/**
 * Decode a base-encoded string into a hex string
 * @param {String} base62 - Base encoded string
 * @returns {string} – hex encoded string
 */
Base62.prototype.decode = function(base62) {

    //only valid chars allowed
    if (base62.match(/[^0-9A-Za-z]/) != null) {
        return null;
    }

    var output = new bignum(0);
    for (var i = 0; i < base62.length; i++) {

        var current = this._base62chars.indexOf(base62[i]);
        //noinspection JSUnresolvedFunction
        output = output.mul(62).add(current);
    }

    output = this.encodeNumericToHex(output);

    if (output.length == 0){
        output = "00";
    } else if (output.length % 2 == 1) {
        output = "0"+output;
    }

    //noinspection JSUnresolvedFunction
    return output.toUpperCase();
};

module.exports = Base62;