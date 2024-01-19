"use strict";

const Base = require('../index');
const should = require('should');
const Crypto = require("crypto");
const ObjectId = require('mongodb').ObjectId;

describe('Base62', () => {

    it('should return null when crap is given', () => {

        should(Base.base62p.encode()).not.be.ok();
        should(Base.base62p.encode(null)).not.be.ok();
        should(Base.base62p.encode(undefined)).not.be.ok();
        should(Base.base62p.encode(() => {})).not.be.ok();
        should(Base.base62p.encode({})).not.be.ok();
        should(Base.base62p.encode([])).not.be.ok();
    });

    it('should return null when crap is given with prefix', () => {
        should(Base.base62p.encodeWithPrefix()).not.be.ok();
        should(Base.base62p.encodeWithPrefix(null, 'prefix_')).not.be.ok();
        should(Base.base62p.encodeWithPrefix(undefined, 'prefix_')).not.be.ok();
        should(Base.base62p.encodeWithPrefix(() => {}, 'prefix_')).not.be.ok();
        should(Base.base62p.encodeWithPrefix({}, 'prefix_')).not.be.ok();
        should(Base.base62p.encodeWithPrefix([], 'prefix_')).not.be.ok();

        should(Base.base62p.encodeWithPrefix(0, 'prefix_')).equal('prefix_48');
    });

    it('should return null when decoding garbage', () => {
        should(Base.base62p.decode('®')).be.exactly(null);
        should(Base.base62p.decode('SnmsvJ1ziv')).be.exactly(null); // base62 not base62p
    });

    it('should encode number', () => {
        should(Base.base62p.encode(0)).equal('48');
        should(Base.base62p.encode(1)).equal('49');
        should(Base.base62p.encode(10)).equal('4i');
        should(Base.base62p.encode(1000000)).equal('1cAFi');
    });

    it('should decode number', () => {
        Base.base62p.decodeHexToNumeric(Base.base62p.decode('48')).should.equal(0n);
        Base.base62p.decodeHexToNumeric(Base.base62p.decode('49')).should.equal(1n);
        Base.base62p.decodeHexToNumeric(Base.base62p.decode('57')).should.equal(61n);
        Base.base62p.decodeHexToNumeric(Base.base62p.decode('4i')).should.equal(10n);
        Base.base62p.decodeHexToNumeric(Base.base62p.decode('71ZRN5')).should.equal(BigInt(2147483647));
        Base.base62p.decodeHexToNumeric(Base.base62p.decode(Base.base62p.encode('73696d706c792061206c6f6e6720737472696e67'))).toString().should.equal((BigInt('0x73696d706c792061206c6f6e6720737472696e67')).toString());
    });

    it('should encode big numbers', () => {
        const x = BigInt("340282366920938463463374607431768211455");
        should(Base.base62p.encode(x)).equal('fA84qwIaXlxujAhzMevpef');
    });

    it('should encode big numbers', () => {
        const x = BigInt("0");
        should(Base.base62p.encode(x)).equal('48');
    });

    it('should encode hex string', () => {
        const x = "0a372a50deadbeef";
        should(Base.base62p.encode(x)).equal('mR3E2wPbQQL');
    });

    it('should encode byte array', () => {
        let x = [0x0A, 0x37, 0x2A, 0x50, 0xDE, 0xAD, 0xBE, 0xEF];
        should(Base.base62p.encode(x)).equal('mR3E2wPbQQL');

        x = [0x00, 0x0A, 0x37, 0x2A, 0x50, 0xDE, 0xAD, 0xBE, 0xEF];
        should(Base.base62p.encode(x)).equal('1sLqXXb3bu2Kz');
    });

    it('should encode/decode a uuid', async () => {
        // Here is a UUID
        const uuid = 'c939d4cd-3923-44ed-a2d5-450776bdfce9';

        // Encoding the UUID should return work
        should(Base.base62p.encode(uuid)).be.exactly('dULVbFAZK1ptGvuoRTAPTr');

        // Decoding the value should return the uppercase hex value
        should(Base.base62p.decode('dULVbFAZK1ptGvuoRTAPTr')).be.exactly('C939D4CD392344EDA2D5450776BDFCE9');

        // Formatting the hex value as a UUID should match the original string
        should(Base.base62p.getUUIDFromHex('C939D4CD392344EDA2D5450776BDFCE9')).be.exactly(uuid);
        should(Base.base62p.getUUIDFromHex('C939D4CD392344EDA2D5450776BDFCE9', false)).be.exactly(uuid.toUpperCase());

        // Should handle a random value
        const random = Crypto.randomUUID();
        should(Base.base62p.getUUIDFromHex(Base.base62p.decode(Base.base62p.encode(random))));
    });

    it('can encode and decode ObjectId', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62p
        const id = Base.base62p.encode(objId);
        id.should.be.ok().and.be.a.String();

        // Decode it
        Base.base62p.decode(id).toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base62p.decode(id)).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base62p.decode(id).toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('can encode and decode ObjectId with prefix', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62p
        const id = Base.base62p.encodeWithPrefix(objId, 'ac_');
        id.should.be.ok().and.be.a.String();
        id.should.startWith('ac_');
        id.should.not.endWith('ac_');

        // Decode it
        Base.base62p.decodeWithPrefix(id, 'ac_').toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base62p.decodeWithPrefix(id, 'ac_')).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base62p.decodeWithPrefix(id, 'ac_').toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('should generate tokens', () => {
        const res = Base.base62p.generateToken(12, 'prefix_');
        res.should.startWith('prefix_');
        res.length.should.be.greaterThan(20);
    });

    it('should generate tokens with no prefix', () => {
        const res = Base.base62p.generateToken(12);
        res.length.should.be.greaterThan(13);
    });

    it('should generate tokens with no prefix or specific length', () => {
        const res = Base.base62p.generateToken();
        res.length.should.be.greaterThan(8);
    });

    it('should generate bytes as a typed array', () => {
        const res = Base.base62p.generateBytes(10, { array: true });
        res.length.should.be.exactly(10);
        res.should.be.instanceOf(Uint8Array);
    });

    it('base62p should preserve leading zeros', async () => {
        should(Base.base62p.decode(Base.base62p.encode('00'), 0)).be.exactly('00');
        should(Base.base62p.decode(Base.base62p.encode('0039d4cd-3923-44ed-a2d5-450776bdfce9'))).be.exactly('0039D4CD392344EDA2D5450776BDFCE9');
        should(Base.base62p.decode(Base.base62p.encode('0039D4CD392344EDA2D5450776BDFCE9'))).be.exactly('0039D4CD392344EDA2D5450776BDFCE9');
        should(Base.base62p.decode(Base.base62p.encode('00000000000000000000000000000000'))).be.exactly('00000000000000000000000000000000');
    });


});