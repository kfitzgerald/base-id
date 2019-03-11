"use strict";

const BigNum = require("bignum");
const Crypto = require('crypto');
const Util = require('util');

class Base {
    constructor() {
        this._hexChars = "0123456789ABCDEF";
    }

    //noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic
    /**
     * Encode a hex string or array of bytes
     * @param mixed – Hex string or array of bytes
     * @returns {string} - Base encoded string
     */
    encode(mixed) { // eslint-disable-line no-unused-vars
        throw new Error("Encode function must be overridden.");
    }

    //noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic
    /**
     * Decode a base-encoded string into a hex string
     * @param {String} base - Base encoded string
     * @returns {string} – hex encoded string
     */
    decode(base) {  // eslint-disable-line no-unused-vars
        throw new Error("Decode function must be overridden.");
    }

    /**
     * Encode a hex string or array of bytes with a string prefix
     * @param mixed - Hex string or array of bytes
     * @param {String} prefix - String prefix, e.g. AC
     * @returns {String} - Base-encoded string
     */
    encodeWithPrefix(mixed, prefix) {
        const res = this.encode(mixed);
        if (res == null || res === undefined) {
            return null;
        } else {
            return prefix + res;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Decodes a base-encoded string with the given known prefix
     * @param {String} base - Base encode string
     * @param {String} prefix - String prefix
     * @returns {String} - Hex encoded string
     */
    decodeWithPrefix(base, prefix) {
        return this.decode(base.substr(prefix.length))
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Generates a secure random token, base encoded, with an optional prefix
     * @param {Number} [bytes] - How many bytes of entropy to generate
     * @param {String} [prefix] - Optional string prefix
     * @returns {String} - Base-encoded token
     */
    generateToken(bytes = 8, prefix = "") {
        return (prefix || '') + this.encode(this.generateBytes(bytes, null));
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Generates secure random bytes
     *
     * @param {Number} count - Number of bytes to generate
     * @param {*} [options] – array:Boolean – return as a Uint8Array if true, else regular array (default)
     * @returns {*} - Array of random bytes
     *
     * @see Adapted from https://github.com/jprichardson/secure-random
     */
    generateBytes(count, options) {
        const buf = Crypto.randomBytes(count),
            opt = options || {},
            ret = opt.array ? new Uint8Array(count) : [];

        for (let i = 0; i < count; ++i) {
            ret[i] = buf.readUInt8(i);
        }

        return ret;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Convert bytes to a hex string
     * @param {Array} bytes – Byte array
     * @returns {string} - Hex string
     */
    bytesToHex(bytes) {

        let ret = "";
        for (let i = 0; i < bytes.length; i++) {
            ret += bytes[i].toString(16);
        }
        return ((ret.length % 2) === 1) ? ('0' + ret) : ret;
    }

    /**
     * Decodes a hex string to a BigInt number
     * @param {string} hex – Hex string
     * @returns {BigNum} – Big number
     */
    decodeHexToNumeric(hex) {
        hex = hex.toUpperCase();
        let output = new BigNum(0);
        for (let i = 0; i < hex.length; i++) {
            const current = this._hexChars.indexOf(hex[i]);
            //noinspection JSUnresolvedFunction
            output = output.mul(16).add(current);
        }
        //noinspection JSValidateTypes
        return output;
    }

    /**
     * Encode a number to hex
     * @param {*} dec – Number or number string (e.g. bigint)
     * @returns {string} – Hex string
     */
    encodeNumericToHex(dec) {
        let output = "";
        dec = new BigNum(dec);
        while (dec.cmp(0) === 1) {

            const rem = dec.mod(16);
            dec = dec.div(16);

            output = this._hexChars[rem] + output;

        }
        return output;
    }

    /**
     * Gets the hex bytes from the given object
     * @param {[]|string|ObjectId|BigNum|number} mixed – Something to convert to a hex string
     * @returns {string}
     */
    getHexFromObject(mixed) {
        if (mixed === null || mixed === undefined) {
            // nope
            return null;
        } else if (Util.isArray(mixed)) {
            // byte array
            return this.bytesToHex(mixed);
        } else if ((typeof mixed) === "string") {
            // hex string
            return mixed.toUpperCase();
        } else if ((typeof mixed) === 'object' && mixed.constructor.name === 'ObjectID') {
            // mongo object id
            return mixed.toString();
        } else if ((typeof mixed) === 'object' && mixed instanceof BigNum) {
            // big num
            const b = mixed.toString(16);
            return ((b.length % 2) === 1 ? '0' : '') + b;
        } else if (typeof mixed === "number") {
            // regular number
            const n = (new BigNum(mixed)).toString(16);
            return ((n.length % 2) === 1 ? '0' : '') + n
        } else {
            // who even knows?
            return null;
        }
    }
}

module.exports = Base;