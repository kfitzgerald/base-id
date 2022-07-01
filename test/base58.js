"use strict";

const Base = require('../index');
const should = require('should');
const ObjectId = require('mongodb').ObjectId;
const Crypto = require('crypto');

describe('Base58', () => {

    it('should return null when crap is given', () => {
        should(Base.base58.encode()).not.be.ok();
        should(Base.base58.encode(null)).not.be.ok();
        should(Base.base58.encode(undefined)).not.be.ok();
        should(Base.base58.encode(() => {})).not.be.ok();
        should(Base.base58.encode({})).not.be.ok();
        should(Base.base58.encode([])).not.be.ok();

        should(Base.base58.encode(0)).equal('1');
    });

    it('should return null when crap is given with prefix', () => {
        should(Base.base58.encodeWithPrefix()).not.be.ok();
        should(Base.base58.encodeWithPrefix(null, 'prefix_')).not.be.ok();
        should(Base.base58.encodeWithPrefix(undefined, 'prefix_')).not.be.ok();
        should(Base.base58.encodeWithPrefix(() => {}, 'prefix_')).not.be.ok();
        should(Base.base58.encodeWithPrefix({}, 'prefix_')).not.be.ok();
        should(Base.base58.encodeWithPrefix([], 'prefix_')).not.be.ok();

        should(Base.base58.encodeWithPrefix(0, 'prefix_')).equal('prefix_1');
    });

    it('should return null when decoding garbage', () => {
        should(Base.base58.decode('®')).be.exactly(null);
    });

    it('should encode number', () => {
        should(Base.base58.encode(0)).equal('1');
        should(Base.base58.encode(10)).equal('B');
        should(Base.base58.encode(1000000)).equal('68GP');
    });

    it('should decode number', () => {
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('0'))).should.equal(0n);
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('1'))).should.equal(1n);
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('50'))).should.equal(BigInt(0x50));
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('10'))).should.equal(BigInt(0x10));
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('7fffffff'))).should.equal(BigInt(2147483647));
        Base.base58.decodeHexToNumeric(Base.base58.decode(Base.base58.encode('73696d706c792061206c6f6e6720737472696e67'))).toString().should.equal((BigInt('0x73696d706c792061206c6f6e6720737472696e67')).toString());
    });

    it('should encode big numbers', () => {
        const x = BigInt("340282366920938463463374607431768211455");
        should(Base.base58.encode(x)).equal('YcVfxkQb6JRzqk5kF2tNLv');
    });

    it('should encode big numbers', () => {
        const x = BigInt("0");
        should(Base.base58.encode(x)).equal('1');
    });

    it('should encode hex string', () => {
        const x = "0a372a50deadbeef";
        should(Base.base58.encode(x)).equal('2i6ye84HA6z');
    });

    it('should encode/decode 0-leading strings', () => {
        should(Base.base58.encode('0012')).equal('1K');
        should(Base.base58.decode('1K')).equal('0012');
    });

    it('should encode byte array', () => {
        const x = [10, 55, 42, 80, 0xDE, 0xAD, 0xBE, 0xEF];
        should(Base.base58.encode(x)).equal('2i6ye84HA6z');
    });

    it('should encode/decode a uuid', async () => {
        // Here is a UUID
        const uuid = 'c939d4cd-3923-44ed-a2d5-450776bdfce9';

        // Encoding the UUID should return work
        should(Base.base58.encode(uuid)).be.exactly('RrCTKkrZMkVgnwzZ3QP7Lc');

        // Decoding the value should return the uppercase hex value
        should(Base.base58.decode('RrCTKkrZMkVgnwzZ3QP7Lc')).be.exactly('C939D4CD392344EDA2D5450776BDFCE9');

        // Formatting the hex value as a UUID should match the original string
        should(Base.base58.getUUIDFromHex('C939D4CD392344EDA2D5450776BDFCE9')).be.exactly(uuid);
        should(Base.base58.getUUIDFromHex('C939D4CD392344EDA2D5450776BDFCE9', false)).be.exactly(uuid.toUpperCase());

        // Should handle a random value
        const random = Crypto.randomUUID();
        should(Base.base58.getUUIDFromHex(Base.base58.decode(Base.base58.encode(random))));
    });

    it('can encode and decode ObjectId', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base58
        const id = Base.base58.encode(objId);
        id.should.be.ok().and.be.a.String();

        // Decode it
        Base.base58.decode(id).toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base58.decode(id)).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base58.decode(id).toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('can encode and decode ObjectId with prefix', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base58
        const id = Base.base58.encodeWithPrefix(objId, 'ac_');
        id.should.be.ok().and.be.a.String();
        id.should.startWith('ac_');
        id.should.not.endWith('ac_');

        // Decode it
        Base.base58.decodeWithPrefix(id, 'ac_').toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base58.decodeWithPrefix(id, 'ac_')).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base58.decodeWithPrefix(id, 'ac_').toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('should generate tokens', () => {
        const res = Base.base58.generateToken(12, 'prefix_');
        res.should.startWith('prefix_');
        res.length.should.be.greaterThan(20);
    });

    it('should generate tokens with no prefix', () => {
        const res = Base.base58.generateToken(12);
        res.length.should.be.greaterThan(12);
    });

    it('should generate tokens with no prefix or specific length', () => {
        const res = Base.base58.generateToken();
        res.length.should.be.greaterThan(8);
    });

    it('should generate bytes as a typed array', () => {
        const res = Base.base58.generateBytes(10, { array: true });
        res.length.should.be.exactly(10);
        res.should.be.instanceOf(Uint8Array);
    });

});