"use strict";

const Base62 = require('./base62');

/**
 * Base62 but prepends a magic byte to preserve leading zero bytes
 */
class Base62p extends Base62 {

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

        hex = '01' + hex; // prepend magic byte
        hex = this.decodeHexToNumeric(hex);
        let output = "";
        let rem;
        while (hex > 0n) {
            rem = hex % 62n;
            hex = hex / 62n;
            output = Base62p.BASE62_CHARS[rem] + output;
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
            current = BigInt(Base62p.BASE62_CHARS.indexOf(base62[i]));
            output = output * 62n + current;
        }

        let outputHex = this.encodeNumericToHex(output);

        /* istanbul ignore else: shouldn't happen unless garbage input given */
        if (outputHex.length % 2 !== 0) {
            outputHex = "0" + outputHex;
        }

        // magic byte required or nothing will return
        if (outputHex.substring(0, 2) !== '01') {
            return null;
        }

        // strip magic byte
        outputHex = outputHex.substring(2);

        //noinspection JSUnresolvedFunction
        return outputHex.toUpperCase();
    }
}

module.exports = Base62p;