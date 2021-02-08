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
        const buffer = Buffer.from('000100ff', 'hex');

        buffer.length.should.be.exactly(4);
        Array.from(buffer).should.deepEqual(bytes);

    });

    it('should pad hex numbers appropriately', () => {

        const base = new Base();
        let res = base.getHexFromObject(0);
        res.should.be.exactly('00');

        res = base.getHexFromObject(128);
        res.should.be.exactly('80');
    });

});

