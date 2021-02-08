"use strict";

const Base = require('./base');

class Base62 extends Base {

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
            rem = hex % 62n;
            hex = hex / 62n;
            output = Base62.BASE62_CHARS[rem] + output;
        }

        // leading zeros
        for (let i = 0; i < origHex.length && origHex.substr(i, 2) === "00"; i += 2) {
            output = "0" + output;
        }

        return output;
    }


    /**
     * Decode a base-encoded string into a hex string
     * @param {string} base62 - Base encoded string
     * @returns {string|null} – hex encoded string
     */
    decode(base62) {

        // only valid chars allowed
        if (base62.match(/[^0-9A-Za-z]/) != null) {
            return null;
        }

        let output = BigInt(0);
        let current;
        for (let i = 0; i < base62.length; i++) {
            current = BigInt(Base62.BASE62_CHARS.indexOf(base62[i]));
            output = output * 62n + current;
        }

        let outputHex = this.encodeNumericToHex(output);

        if (outputHex.length === 0) {
            outputHex = "00";
        } else if (outputHex.length % 2 === 1) {
            outputHex = "0" + outputHex;
        }

        //noinspection JSUnresolvedFunction
        return outputHex.toUpperCase();
    }
}

/**
 * Base62 index to char map
 * @type {string}
 */
Base62.BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = Base62;