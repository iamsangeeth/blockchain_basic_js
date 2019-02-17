const SHA256 = require('crypto-js/sha256')

class Block{
	constructor(index, timestamp, data, previouhash=''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previouhash = previouhash;
		this.hash = this.calculatehash();
	}
	calculatehash(){
		return SHA256(this.index + this.timestamp + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock(){
		return new Block(0, '01/01/2019',"first block", '0');
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}

	createBlock(newBlock){
		newBlock.previouhash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculatehash()
		this.chain.push(newBlock)
	}
}

let testblock = new BlockChain();
testblock.createBlock(new Block(1,'02/01/2019',{"amount":10}));
testblock.createBlock(new Block(2,'03/01/2019',{"amount":20}))
console.log(JSON.stringify(testblock).toString());