"use strict";

const Base = require('./base');

class Base58 extends Base {

    constructor() {
        super();
    }

    /**
     * Encode a hex string or array of bytes
     * @param mixed – Hex string or array of bytes
     * @returns {string|null} - Base encoded string
     */
    encode(mixed) {
        let hex = this.getHexFromObject(mixed);
        if (!hex) return null;

        const origHex = "" + hex;
        hex = this.decodeHexToNumeric(hex);

        let output = "";
        let rem;
        while (hex > 0n) {
            rem = hex % 58n;
            hex = hex / 58n;
            output = Base58.BASE58_CHARS[rem] + output;
        }

        // leading zeros
        for (let i = 0; i < origHex.length && origHex.substr(i, 2) === "00"; i += 2) {
            output = "1" + output;
        }

        return output;
    }

    /**
     * Decode a base-encoded string into a hex string
     * @param {String} base58 - Base encoded string
     * @returns {string|null} – hex encoded string
     */
    decode(base58) {
        const origBase58 = "" + base58;

        //only valid chars allowed
        if (base58.match(/[^1-9A-HJ-NP-Za-km-z]/) != null) {
            return null;
        }

        let output = BigInt(0);
        let current;
        for (let i = 0; i < base58.length; i++) {
            current = BigInt(Base58.BASE58_CHARS.indexOf(base58[i]));
            output = output * 58n + current;
        }

        let outputHex = this.encodeNumericToHex(output);

        // leading zeros
        for (let ii = 0; ii < origBase58.length && origBase58[ii] === "1"; ii++) {
            outputHex = "00" + outputHex;
        }

        if (outputHex.length % 2 !== 0) {
            outputHex = "0" + outputHex;
        }

        return outputHex.toUpperCase();
    }
}

/**
 * Base58 index to char mapping
 * @type {string}
 */
Base58.BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

module.exports = Base58;