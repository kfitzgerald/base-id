
var Base58 = require('./lib/base58'),
    Base62 = require('./lib/base62'),

    base58 = new Base58(),
    base62 = new Base62();

module.exports = exports = {
    base58: base58,
    base62: base62
};