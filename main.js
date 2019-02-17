const {BlockChain, Transactions} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = EC('secp256k1');

const mykey = ec.keyFromPrivate('b28b868c784b145ff9a03c121a77b39487396860aa6637580b8d9346169e8a70')
const myWalletAddress = mykey.getPublic('hex')


let testblock = new BlockChain();

const tx1 = new Transactions(myWalletAddress, 'someones public key', 10)
tx1.signTransaction(mykey)
testblock.addTransaction(tx1)

// testblock.createTransaction(new Transactions("address1", "address2", 100))

// testblock.createTransaction(new Transactions("address2", "address1", 50))

console.log("Starting Mining...")
testblock.minePendingTransactions(myWalletAddress);

console.log("Balace: "+testblock.checkBalance(myWalletAddress))

// testblock.chain[1].amount = 1
// console.log("is this chain valid:" +testblock.isValidBlock());
// console.log("Starting Mining...")
// testblock.minePendingTransactions("sangeeth");

// console.log("Balace of sangeeth"+testblock.checkBalance("sangeeth"))


