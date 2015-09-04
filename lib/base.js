var bignum = require("bignum"),
    crypto = require('crypto'),
    util = require('util');

/**
 * Base base class. Get it?
 * @constructor
 */
var Base = function() {
    this._hexChars = "0123456789ABCDEF";
    this._hexLookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
};


//noinspection JSUnusedLocalSymbols
/**
 * Encode a hex string or array of bytes
 * @param mixed – Hex string or array of bytes
 * @returns {string} - Base encoded string
 */
Base.prototype.encode = function(mixed) {
    throw "Encode function must be overridden. ";
};


//noinspection JSUnusedLocalSymbols
/**
 * Decode a base-encoded string into a hex string
 * @param {String} base - Base encoded string
 * @returns {string} – hex encoded string
 */
Base.prototype.decode = function(base) {
    throw "Decode function must be overridden.";
};


/**
 * Encode a hex string or array of bytes with a string prefix
 * @param mixed - Hex string or array of bytes
 * @param {String} prefix - String prefix, e.g. AC
 * @returns {String} - Base-encoded string
 */
Base.prototype.encodeWithPrefix = function(mixed, prefix) {
    var res = this.encode(mixed);
    if (res === null || res === undefined) {
        return null;
    } else {
        return prefix + res;
    }
};


//noinspection JSUnusedGlobalSymbols
/**
 * Decodes a base-encoded string with the given known prefix
 * @param {String} base - Base encode string
 * @param {String} prefix - String prefix
 * @returns {String} - Hex encoded string
 */
Base.prototype.decodeWithPrefix = function(base, prefix) {
    return this.decode(base.substr(prefix.length))
};


//noinspection JSUnusedGlobalSymbols
/**
 * Generates a secure random token, base encoded, with an optional prefix
 * @param {Number} bytes - How many bytes of entropy to generate
 * @param {String} prefix - Optional string prefix
 * @returns {String} - Base-encoded token
 */
Base.prototype.generateToken = function(bytes, prefix) {
    return (prefix || '') + this.encode(this.generateBytes(bytes || 8, null));
};


/**
 * Generates secure random bytes
 *
 * @param {Number} count - Number of bytes to generate
 * @param {*} options – array:Boolean – return as a Uint8Array if true, else regular array (default)
 * @returns {*} - Array of random bytes
 *
 * @see Adapted from https://github.com/jprichardson/secure-random
 */
Base.prototype.generateBytes = function(count, options) {
    var buf = crypto.randomBytes(count),
        opt = options || {},
        ret = opt.array ? new Uint8Array(count) : [];

    for (var i = 0; i < count; ++i) {
        ret[i] = buf.readUInt8(i);
    }

    return ret;
};


/**
 * Convert bytes to a hex string
 * @param {Array} bytes – Byte array
 * @returns {string} - Hex string
 */
Base.prototype.bytesToHex = function (bytes) {

    var ret = "";
    for(var i = 0; i < bytes.length; i++) {
        ret += bytes[i].toString(16);
    }
    return (ret.length % 2 == 1) ? ('0' + ret) : ret;
};


/**
 * Decodes a hex string to a BigInt number
 * @param {string} hex – Hex string
 * @returns {bignum} – Big number
 */
Base.prototype.decodeHexToNumeric = function(hex) {
    hex = hex.toUpperCase();
    var output = new bignum(0);
    for (var i = 0; i < hex.length; i++) {
        var current = this._hexChars.indexOf(hex[i]);
        //noinspection JSUnresolvedFunction
        output = output.mul(16).add(current);
    }
    //noinspection JSValidateTypes
    return output;
};


/**
 * Encode a number to hex
 * @param {*} dec – Number or number string (e.g. bigint)
 * @returns {string} – Hex string
 */
Base.prototype.encodeNumericToHex = function(dec) {
    var output = "";
    dec = new bignum(dec);
    while (dec.cmp(0) == 1) {

        var rem = dec.mod(16);
        dec = dec.div(16);

        output = this._hexChars[rem] + output;

    }
    return output;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Converts binary string to a hexadecimal string
 * @param {*} s – Binary string
 * @returns {*} – Hex string
 *
 * Adapted from: http://stackoverflow.com/questions/17204912/javascript-need-functions-to-convert-a-string-containing-binary-to-hex-then-co
 *
 * returns an object with key 'valid' to a boolean value, indicating
 * if the string is a valid binary string.
 * If 'valid' is true, the converted hex string can be obtained by
 * the 'result' key of the returned object
 *
 */
Base.prototype.binaryToHex = function(s) {
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
//                return { valid: false };
                return null;
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return null;
//                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return ret;
};


//noinspection JSUnusedGlobalSymbols
/**
 * Converts hexadecimal string to a binary string
 * @param s – hex string
 * @returns {*} – binary string
 *
 * Adapted from http://stackoverflow.com/questions/17204912/javascript-need-functions-to-convert-a-string-containing-binary-to-hex-then-co
 *
 * returns an object with key 'valid' to a boolean value, indicating
 * if the string is a valid hexadecimal string.
 * If 'valid' is true, the converted binary string can be obtained by
 * the 'result' key of the returned object
 */
Base.prototype.hexToBinary = function (s) {
    var i, ret = '';
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'

    for (i = 0; i < s.length; i += 1) {
        if (this._hexLookupTable.hasOwnProperty(s[i])) {
            ret += this._hexLookupTable[s[i]];
        } else {
//            return { valid: false };
            return null;
        }
    }
//    return { valid: true, result: ret };
    return ret;
};


/**
 * Gets the hex bytes from the given object
 * @param {[]|string|ObjectId|bignum|number} mixed – Something to convert to a hex string
 * @returns {string}
 */
Base.prototype.getHexFromObject = function(mixed) {
    if (mixed === null || mixed === undefined) {
        // nope
        return null;
    } else if (util.isArray(mixed)) {
        // byte array
        return this.bytesToHex(mixed);
    } else if ((typeof mixed) == "string"){
        // hex string
        return mixed.toUpperCase();
    } else if ((typeof mixed) == 'object' && mixed.constructor.name == 'ObjectID') {
        // mongo object id
        return mixed.toString();
    } else if ((typeof mixed) == 'object' && mixed instanceof bignum) {
        // big num
        var b = mixed.toString(16);
        return ((b.length % 2) == 1 ? '0' : '') + b;
    } else if (typeof mixed == "number") {
        // regular number
        var n = (new bignum(mixed)).toString(16);
        return ((n.length % 2) == 1 ? '0' : '') + n
    } else {
        // who even knows?
        return null;
    }
};


module.exports = Base;