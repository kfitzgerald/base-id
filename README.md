# Base-id

A basic base58 and base62 encoding and decoding system. Can optionally add a prefix to make the identifier more identifiable!

Encodes hex-strings, byte arrays, numbers, big numbers, and mongo object ids to base58 or base62.

# Installation 

Install with NPM like so:

```sh
npm install base-id
```

# Examples

```js

var base = require('base-id');

// Generate a new crypto-random id with an arbitrary prefix
base.base58.generateToken(24, 'account_') // account_ifq8PeVV9J3weEtz5V14cr9H7AuKhndD

// Generate a new crypto-random id with an arbitrary prefix
base.base62.generateToken(24, 'product_') // product_8egyAcmiJhK0pFThcYHYIojG9GIKK7A4



// Encode a hex-string to base58
var hex = "0a372a50deadbeef";
var res = base.base58.encode(hex); // 2i6ye84HA6z;

// Encode a hex-string to base62
res = base.base62.encode(hex); // SnmsvJ1ziv;



// Make a MongoDB ObjectId pretty:
var objId = new ObjectId();
res = base.base58.encodeWithPrefix(objId, 'charge_'); // charge_2d2yysrPLNBLYpWfK

// Change a pretty id back into an ObjectId
var objId2 = new ObjectId(base.base58.decodeWithPrefix('charge_2d2yysrPLNBLYpWfK', 'charge_')); // new ObjectId("55ea16f30c169b651ddf40ea")


```

## `base58` and `base62`

The module exports both base58 and base62 instances with the following members. 

### Methods

 * `encode(mixed)` – Encodes the given value to the desired base encoding.
 * `decode(encodedString)` – Decodes the given base-encoded string to a hex string.
 * `encodeWithPrefix(mixed, prefix)` – Encodes the given value to the desired base encoding, prepending a prefix to the result.
 * `decodeWithPrefix(ecodedString, prefix)` – Decodes the given base-encoded string to a hex string, stripping the given prefix.
 * `generateToken(bytes, prefix)` – Generates a secure random string, base encoded, with an optional prefix
 * `generateBytes(count, options)` – Generates secure random bytes
  * `options.array` – when true, will return a `Uint8Array` instead of a standard array
 * `bytesToHex(bytes)` – Convert a byte array to a hex string
 * `decodeHexToNumeric(hex)` – Decodes a hex string to a BigInt number
 * `encodeNumericToHex(dec)` – Encode a number to hex string
 * `binaryToHex(string)` – Converts binary string to a hexadecimal string
 * `hexToBinary(hex)` – Converts hexadecimal string to a binary string
 * `getHexFromObject(mixed)` Gets the hex string from the given thing. Accepts a hex string, number, bignum, byte array, or MongoDB `ObjectId` instance.
 