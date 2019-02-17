const SHA256 = require('crypto-js/sha256')

class Block{
	constructor(index, timestamp, data, previouhash=''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previouhash = previouhash;
		this.hash = this.calculatehash();
		this.nounce = 0;
	}
	calculatehash(){
		return SHA256(this.index + this.timestamp + this.timestamp + this.nounce + JSON.stringify(this.data)).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) != Array(difficulty+1).join("0")){
			this.nounce ++;
			this.hash = this.calculatehash()
		}
		console.log("Block Mined "+ this.hash )
	}
}

class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 4;
	}

	createGenesisBlock(){
		return new Block(0, '01/01/2019',"first block", '0');
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}

	createBlock(newBlock){
		newBlock.previouhash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	isValidBlock(){
		for(let i=1; i<this.chain.length; i++){
			const previousBlock = this.chain[i-1];
			const currentBlock = this.chain[i];

			if(currentBlock.hash !== currentBlock.calculatehash()){				
				return false;
			}

			if(currentBlock.previouhash !== previousBlock.hash){				
				return false;
			}
		}
		return true; 
	}
}

let testblock = new BlockChain();
console.log("Mining block 1")
testblock.createBlock(new Block(1,'02/01/2019',{"amount":10}));
console.log("Mining block 2")
testblock.createBlock(new Block(2,'03/01/2019',{"amount":20}))


