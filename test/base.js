"use strict";

const Base = require('../lib/base');
const should = require('should');

describe('Base', () => {

    it('should throw not extended', () => {
        const b = new Base();

        should(function() { b.encode('nope') }).throw(/overridden/);
        should(function() { b.decode('nope') }).throw(/overridden/);
    });

});

