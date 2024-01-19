"use strict";

const Base58 = require('./lib/base58');
const Base62 = require('./lib/base62');
const Base62p = require('./lib/base62p');

exports.base58 = new Base58();
exports.base62 = new Base62();
exports.base62p = new Base62p();
