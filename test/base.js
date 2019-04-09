"use strict";

const Base = require('../lib/base');
const should = require('should');

describe('Base', () => {

    it('should throw not extended', () => {
        const b = new Base();

        should(function() { b.encode('nope') }).throw(/overridden/);
        should(function() { b.decode('nope') }).throw(/overridden/);
    });

    it('should convert hex to bytes and vise versa', () => {

        const bytes = [ 0x00, 0x01, 0x00, 0xff ];
        const base = new Base();

        base.bytesToHex(bytes).should.be.exactly('000100ff');
        const buffer = Buffer('000100ff', 'hex');

        buffer.length.should.be.exactly(4);
        Array.from(buffer).should.deepEqual(bytes);

    });

});

