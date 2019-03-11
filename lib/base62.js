"use strict";

const BigNum = require("bignum");
const Base = require('./base');

class Base62 extends Base {

    constructor() {
        super();
        this._base62chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Base 62 library
    }

    /**
     * Encode a hex string or array of bytes
     * @param mixed – Hex string or array of bytes
     * @returns {string|null} - Base encoded string
     */
    encode(mixed) {
        let hex = this.getHexFromObject(mixed);
        if (!hex) {
            return null;
        }

        const origHex = "" + hex;
        hex = this.decodeHexToNumeric(hex);
        let output = "";
        while (hex.cmp(0) === 1) {

            const rem = hex.mod(62);
            hex = hex.div(62);
            output = this._base62chars[rem] + output;

        }

        //leading zeros
        for (let i = 0; i < origHex.length && origHex.substr(i, 2) === "00"; i += 2) {
            output = "0" + output;
        }

        return output;
    }


    /**
     * Decode a base-encoded string into a hex string
     * @param {String} base62 - Base encoded string
     * @returns {string} – hex encoded string
     */
    decode(base62) {

        //only valid chars allowed
        if (base62.match(/[^0-9A-Za-z]/) != null) {
            return null;
        }

        let output = new BigNum(0);
        for (let i = 0; i < base62.length; i++) {

            const current = this._base62chars.indexOf(base62[i]);
            //noinspection JSUnresolvedFunction
            output = output.mul(62).add(current);
        }

        output = this.encodeNumericToHex(output);

        if (output.length === 0) {
            output = "00";
        } else if (output.length % 2 === 1) {
            output = "0" + output;
        }

        //noinspection JSUnresolvedFunction
        return output.toUpperCase();
    }
}

module.exports = Base62;