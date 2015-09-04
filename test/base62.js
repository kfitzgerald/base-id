
var base = require('../index'),
    should = require('should'),
    bignum = require('bignum'),
    ObjectId = require('mongodb').ObjectId;


describe('Base62', function() {

    it('should return null when crap is given', function() {

        should(base.base62.encode()).be.empty();
        should(base.base62.encode(null)).be.empty();
        should(base.base62.encode(undefined)).be.empty();
        should(base.base62.encode(function(){})).be.empty();
        should(base.base62.encode({})).be.empty();
        should(base.base62.encode([])).be.empty();

        should(base.base62.encode(0)).equal('0');
    });

    it('should encode number', function() {
        should(base.base62.encode(0)).equal('0');
        should(base.base62.encode(1)).equal('1');
        should(base.base62.encode(10)).equal('a');
        should(base.base62.encode(1000000)).equal('4c92');
    });

    it('should decode number', function() {
        base.base62.decodeHexToNumeric(base.base62.decode('0')).toNumber().should.equal(0);
        base.base62.decodeHexToNumeric(base.base62.decode('1')).toNumber().should.equal(1);
        base.base62.decodeHexToNumeric(base.base62.decode('Z')).toNumber().should.equal(61);
        base.base62.decodeHexToNumeric(base.base62.decode('10')).toNumber().should.equal(62);
        base.base62.decodeHexToNumeric(base.base62.decode('2lkCB1')).toNumber().should.equal(2147483647);
        base.base62.decodeHexToNumeric(base.base62.decode(base.base62.encode('73696d706c792061206c6f6e6720737472696e67'))).toString().should.equal((new bignum('73696d706c792061206c6f6e6720737472696e67', 16)).toString());
    });

    it('should encode big numbers', function() {
        var x = new bignum("340282366920938463463374607431768211455");
        should(base.base62.encode(x)).equal('7N42dgm5tFLK9N8MT7fHC7');
    });

    it('should encode hex string', function() {
        var x = "0a372a50deadbeef";
        should(base.base62.encode(x)).equal('SnmsvJ1ziv');
    });

    it('should encode byte array', function() {
        var x = [ 10, 55, 42, 80, 0xDE, 0xAD, 0xBE, 0xEF ];
        should(base.base62.encode(x)).equal('SnmsvJ1ziv');
    });

    it('can encode and decode ObjectId', function() {

        // Create a mongo object id instance
        var objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62
        var id = base.base62.encode(objId);
        id.should.not.be.empty().and.be.a.String();

        // Decode it
        base.base62.decode(id).toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(base.base62.decode(id)).should.be.equal(true);

        var decodeObjId = new ObjectId(base.base62.decode(id).toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    });

    it('can encode and decode ObjectId with prefix', function() {

        // Create a mongo object id instance
        var objId = new ObjectId();
        objId.should.be.instanceOf(ObjectId);

        // Encode it to base62
        var id = base.base62.encodeWithPrefix(objId, 'ac_');
        id.should.not.be.empty().and.be.a.String();
        id.should.startWith('ac_');
        id.should.not.endWith('ac_');

        // Decode it
        base.base62.decodeWithPrefix(id, 'ac_').toLowerCase().should.equal(objId.toString());
        ObjectId.isValid(base.base62.decodeWithPrefix(id, 'ac_')).should.be.equal(true);

        var decodeObjId = new ObjectId(base.base62.decodeWithPrefix(id, 'ac_').toLowerCase());
        decodeObjId.toString().should.equal(objId.toString());
        decodeObjId.equals(objId).should.be.equal(true);

    })




});