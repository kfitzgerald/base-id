"use strict";

const BigNum = require("bignum");
const Base = require('./base');

class Base58 extends Base {

    constructor() {
        super();
        this._base58chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"; // Base-58 char library
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

            const rem = hex.mod(58);
            hex = hex.div(58);
            output = this._base58chars[rem] + output;

        }

        //leading zeros
        for (let i = 0; i < origHex.length && origHex.substr(i, 2) === "00"; i += 2) {
            output = "1" + output;
        }

        return output;
    }

    /**
     * Decode a base-encoded string into a hex string
     * @param {String} base58 - Base encoded string
     * @returns {string} – hex encoded string
     */
    decode(base58) {
        const origBase58 = "" + base58;

        //only valid chars allowed
        if (base58.match(/[^1-9A-HJ-NP-Za-km-z]/) != null) {
            return null;
        }

        let output = new BigNum(0);
        for (let i = 0; i < base58.length; i++) {

            const current = this._base58chars.indexOf(base58[i]);
            //noinspection JSUnresolvedFunction
            output = output.mul(58).add(current);
        }

        output = this.encodeNumericToHex(output);

        //leading zeros
        for (let ii = 0; ii < origBase58.length && origBase58[ii] === "1"; ii++) {
            output = "00" + output;
        }

        if (output.length % 2 !== 0) {
            output = "0" + output;
        }

        //noinspection JSUnresolvedFunction
        return output.toUpperCase();
    }
}

module.exports = Base58;