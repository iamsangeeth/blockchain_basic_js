const EC = require('elliptic').ec;
const ec = EC('secp256k1');

const key = ec.genKeyPair();
const publickey = key.getPublic('hex');
const privatekey = key.getPrivate('hex');

console.log("publickey ", publickey);
console.log();
console.log("privatekey", privatekey);