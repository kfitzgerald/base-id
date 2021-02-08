"use strict";

const Base = require('../index');
const should = require('should');
const ObjectId = require('mongodb').ObjectId;

describe('Base62', () => {

    it('should return null when crap is given', () => {

        should(Base.base62.encode()).not.be.ok();
        should(Base.base62.encode(null)).not.be.ok();
        should(Base.base62.encode(undefined)).not.be.ok();
        should(Base.base62.encode(() => {})).not.be.ok();
        should(Base.base62.encode({})).not.be.ok();
        should(Base.base62.encode([])).not.be.ok();

        should(Base.base62.encode(0)).equal('0');
    });

    it('should return null when crap is given with prefix', () => {
        should(Base.base62.encodeWithPrefix()).not.be.ok();
        should(Base.base62.encodeWithPrefix(null, 'prefix_')).not.be.ok();
        should(Base.base62.encodeWithPrefix(undefined, 'prefix_')).not.be.ok();
        should(Base.base62.encodeWithPrefix(() => {}, 'prefix_')).not.be.ok();
        should(Base.base62.encodeWithPrefix({}, 'prefix_')).not.be.ok();
        should(Base.base62.encodeWithPrefix([], 'prefix_')).not.be.ok();

        should(Base.base62.encodeWithPrefix(0, 'prefix_')).equal('prefix_0');
    });

    it('should return null when decoding garbage', () => {
        should(Base.base62.decode('®')).be.exactly(null);
    });

    it('should encode number', () => {
        should(Base.base62.encode(0)).equal('0');
        should(Base.base62.encode(1)).equal('1');
        should(Base.base62.encode(10)).equal('a');
        should(Base.base62.encode(1000000)).equal('4c92');
    });

    it('should decode number', () => {
        Base.base62.decodeHexToNumeric(Base.base62.decode('0')).should.equal(0n);
        Base.base62.decodeHexToNumeric(Base.base62.decode('1')).should.equal(1n);
        Base.base62.decodeHexToNumeric(Base.base62.decode('Z')).should.equal(61n);
        Base.base62.decodeHexToNumeric(Base.base62.decode('10')).should.equal(62n);
        Base.base62.decodeHexToNumeric(Base.base62.decode('2lkCB1')).should.equal(BigInt(2147483647));
        Base.base62.decodeHexToNumeric(Base.base62.decode(Base.base62.encode('73696d706c792061206c6f6e6720737472696e67'))).toString().should.equal((BigInt('0x73696d706c792061206c6f6e6720737472696e67')).toString());
    });

    it('should encode big numbers', () => {
        const x = BigInt("340282366920938463463374607431768211455");
        should(Base.base62.encode(x)).equal('7N42dgm5tFLK9N8MT7fHC7');
    });

    it('should encode big numbers', () => {
        const x = BigInt("0");
        should(Base.base62.encode(x)).equal('0');
    });

    it('should encode hex string', () => {
        const x = "0a372a50deadbeef";
        should(Base.base62.encode(x)).equal('SnmsvJ1ziv');
    });

    it('should encode byte array', () => {
        const x = [10, 55, 42, 80, 0xDE, 0xAD, 0xBE, 0xEF];
        should(Base.base62.encode(x)).equal('SnmsvJ1ziv');
    });

    it('can encode and decode ObjectId', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62
        const id = Base.base62.encode(objId);
        id.should.be.ok().and.be.a.String();

        // Decode it
        Base.base62.decode(id).toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base62.decode(id)).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base62.decode(id).toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('can encode and decode ObjectId with prefix', () => {

        // Create a mongo object id instance
        const objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62
        const id = Base.base62.encodeWithPrefix(objId, 'ac_');
        id.should.be.ok().and.be.a.String();
        id.should.startWith('ac_');
        id.should.not.endWith('ac_');

        // Decode it
        Base.base62.decodeWithPrefix(id, 'ac_').toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(Base.base62.decodeWithPrefix(id, 'ac_')).should.be.equal(true);

        const decodeObjId = new ObjectId(Base.base62.decodeWithPrefix(id, 'ac_').toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('should generate tokens', () => {
        const res = Base.base62.generateToken(12, 'prefix_');
        res.should.startWith('prefix_');
        res.length.should.be.greaterThan(20);
    });

    it('should generate tokens with no prefix', () => {
        const res = Base.base62.generateToken(12);
        res.length.should.be.greaterThan(13);
    });

    it('should generate tokens with no prefix or specific length', () => {
        const res = Base.base62.generateToken();
        res.length.should.be.greaterThan(8);
    });

    it('should generate bytes as a typed array', () => {
        const res = Base.base62.generateBytes(10, { array: true });
        res.length.should.be.exactly(10);
        res.should.be.instanceOf(Uint8Array);
    });


});