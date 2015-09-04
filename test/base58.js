
var base = require('../index'),
    should = require('should'),
    bignum = require('bignum'),
    ObjectId = require('mongodb').ObjectId;


describe('Base58', function() {

    it('should return null when crap is given', function() {

        should(base.base58.encode()).be.empty();
        should(base.base58.encode(null)).be.empty();
        should(base.base58.encode(undefined)).be.empty();
        should(base.base58.encode(function(){})).be.empty();
        should(base.base58.encode({})).be.empty();
        should(base.base58.encode([])).be.empty();

        should(base.base58.encode(0)).equal('1');
    });

    it('should encode number', function() {
        should(base.base58.encode(0)).equal('1');
        should(base.base58.encode(10)).equal('B');
        should(base.base58.encode(1000000)).equal('68GP');
    });

    it('should decode number', function() {
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('0'))).toNumber().should.equal(0);
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('1'))).toNumber().should.equal(1);
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('50'))).toNumber().should.equal(0x50);
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('10'))).toNumber().should.equal(0x10);
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('7fffffff'))).toNumber().should.equal(2147483647);
        base.base58.decodeHexToNumeric(base.base58.decode(base.base58.encode('73696d706c792061206c6f6e6720737472696e67'))).toString().should.equal((new bignum('73696d706c792061206c6f6e6720737472696e67', 16)).toString());
    });

    it('should encode big numbers', function() {
        var x = new bignum("340282366920938463463374607431768211455");
        should(base.base58.encode(x)).equal('YcVfxkQb6JRzqk5kF2tNLv');
    });

    it('should encode hex string', function() {
        var x = "0a372a50deadbeef";
        should(base.base58.encode(x)).equal('2i6ye84HA6z');
    });

    it('should encode byte array', function() {
        var x = [ 10, 55, 42, 80, 0xDE, 0xAD, 0xBE, 0xEF ];
        should(base.base58.encode(x)).equal('2i6ye84HA6z');
    });

    it('can encode and decode ObjectId', function() {

        // Create a mongo object id instance
        var objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base58
        var id = base.base58.encode(objId);
        id.should.not.be.empty().and.be.a.String();

        // Decode it
        base.base58.decode(id).toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(base.base58.decode(id)).should.be.equal(true);

        var decodeObjId = new ObjectId(base.base58.decode(id).toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('can encode and decode ObjectId with prefix', function() {

        // Create a mongo object id instance
        var objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base58
        var id = base.base58.encodeWithPrefix(objId, 'ac_');
        id.should.not.be.empty().and.be.a.String();
        id.should.startWith('ac_');
        id.should.not.endWith('ac_');

        // Decode it
        base.base58.decodeWithPrefix(id, 'ac_').toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(base.base58.decodeWithPrefix(id, 'ac_')).should.be.equal(true);

        var decodeObjId = new ObjectId(base.base58.decodeWithPrefix(id, 'ac_').toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    })




});