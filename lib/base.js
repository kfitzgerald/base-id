"use strict";

const Crypto = require('crypto');
const stringCleanPattern = /-/g;

/**
 * Base class for Base-specific handlers
 */
class Base {

    constructor() {

    }

    //noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic
    /**
     * Encode a hex string or array of bytes
     * @param mixed – Hex string or array of bytes
     * @returns {string|null} - Base encoded string
     */
    encode(mixed) { // eslint-disable-line no-unused-vars
        throw new Error("Encode function must be overridden.");
    }

    //noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic
    /**
     * Decode a base-encoded string into a hex string
     * @param {string} base - Base encoded string
     * @returns {string|null} – hex encoded string
     */
    decode(base) {  // eslint-disable-line no-unused-vars
        throw new Error("Decode function must be overridden.");
    }

    /**
     * Encode a hex string or array of bytes with a string prefix
     * @param mixed - Hex string or array of bytes
     * @param {string} prefix - String prefix, e.g. AC
     * @returns {string|null} - Base-encoded string
     */
    encodeWithPrefix(mixed, prefix) {
        const res = this.encode(mixed);
        if (res === null || res === undefined) {
            return null;
        } else {
            return prefix + res;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Decodes a base-encoded string with the given known prefix
     * @param {string} base - Base encode string
     * @param {string} prefix - String prefix
     * @returns {string|null} - Hex encoded string
     */
    decodeWithPrefix(base, prefix) {
        return this.decode(base.substr(prefix.length))
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Generates a secure random token, base encoded, with an optional prefix
     * @param {number} [bytes] - How many bytes of entropy to generate
     * @param {string} [prefix] - Optional string prefix
     * @returns {string} - Base-encoded token
     */
    generateToken(bytes = 8, prefix = "") {
        return (prefix || '') + this.encode(this.generateBytes(bytes, null));
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Generates secure random bytes
     *
     * @param {number} count - Number of bytes to generate
     * @param {*} [options] – array:Boolean – return as a Uint8Array if true, else regular array (default)
     * @returns {*} - Array of random bytes
     *
     * @see Adapted from https://github.com/jprichardson/secure-random
     */
    generateBytes(count, options) {
        const buf = Crypto.randomBytes(count);
        const opt = options || {};
        const ret = opt.array ? new Uint8Array(count) : [];

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
        let hex = "", val;
        for (let i = 0; i < bytes.length; i++) {
            val = bytes[i].toString(16);
            hex += ((val.length % 2) === 1) ? ('0' + val) : val;
        }
        return hex;
    }

    /**
     * Decodes a hex string to a BigInt number
     * @param {string} hex – Hex string
     * @returns {BigInt} – Big integer
     */
    decodeHexToNumeric(hex) {
        hex = hex.toUpperCase();
        let output = BigInt(0);
        let current;
        for (let i = 0; i < hex.length; i++) {
            current = BigInt(Base.HEX_CHARS.indexOf(hex[i]));
            output = output * 16n + current;
        }
        return output;
    }

    /**
     * Encode a bigint-parsable number to hex
     * @param {*} dec – Number or number string (e.g. bigint)
     * @returns {string} – Hex string
     */
    encodeNumericToHex(dec) {
        let output = "";
        let rem;
        dec = BigInt(dec);
        while (dec > 0n) {
            rem = dec % 16n;
            dec = dec / 16n;

            output = Base.HEX_CHARS[rem] + output;
        }
        return output;
    }

    /**
     * Gets the hex bytes from the given object
     * @param {[]|string|ObjectId|BigInt|number} mixed – Something to convert to a hex string
     * @returns {string|null}
     */
    getHexFromObject(mixed) {
        if (mixed === null || mixed === undefined) {
            // nope
            return null;
        } else if (Array.isArray(mixed)) {
            // byte array
            return this.bytesToHex(mixed);
        } else if ((typeof mixed) === "string") {
            // hex string
            return mixed.toUpperCase().replace(stringCleanPattern, ''); // supports uuids
        } else if ((typeof mixed) === 'object' && (mixed.constructor.name === 'ObjectId' || mixed.constructor.name === 'ObjectID')) {
            // mongo object id
            return mixed.toString();
        } else if (typeof mixed === "bigint") {
            // bigint
            const b = mixed.toString(16);
            return ((b.length % 2) === 1 ? '0' : '') + b;
        } else if (typeof mixed === "number") {
            // regular number
            const n = (BigInt(mixed)).toString(16);
            return ((n.length % 2) === 1 ? '0' : '') + n
        } else {
            // who even knows?
            return null;
        }
    }

    /**
     * Returns a formatted
     * @param hex Hex string value
     * @param [lowercase] Whether to return a lowercase or uppercase value (defaults to lower)
     * @return {string} Formatted UUID
     */
    getUUIDFromHex(hex, lowercase=true) {
        return (lowercase ? hex.toLowerCase() : hex.toUpperCase()).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
}

/**
 * Hex character mapping, index to character
 * @type {string}
 */
Base.HEX_CHARS = '0123456789ABCDEF';

module.exports = Base;