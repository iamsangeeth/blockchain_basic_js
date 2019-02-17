const SHA256 = require('crypto-js/sha256')

class Transactions{
	constructor(fromaddress, toaddress, amount){
		this.fromaddress = fromaddress;
		this.toaddress = toaddress;
		this.amount = amount;
	}
}

class Block{
	constructor(timestamp, transactions, previouhash=''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previouhash = previouhash;
		this.hash = this.calculatehash();
		this.nounce = 0;
	}
	calculatehash(){
		return SHA256(this.timestamp + this.timestamp + this.nounce + JSON.stringify(this.transactions)).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) != Array(difficulty+1).join("0")){
			this.nounce ++;
			this.hash = this.calculatehash()
		}
		console.log("Block Mined "+ this.hash)
	}
}

class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 1;
		this.pendingtransactions = [];
		this.miningrewards = 100;
	}

	createGenesisBlock(){
		return new Block('01/01/2019',"first block", '0');
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}

	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingtransactions);
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined");
		this.chain.push(block);
		this.pendingtransactions = [new Transactions(null, miningRewardAddress, this.miningrewards)];
	}

	createTransaction(transaction){
		this.pendingtransactions.push(transaction);
	}

	checkBalance(address){
		let balance = 0;

		for(const block of this.chain){
			for(const transaction of block.transactions){
				if(address== transaction.fromaddress){
					balance -= transaction.amount;
				}
				if(address==transaction.toaddress){
					balance += transaction.amount;
				}
			}
		}
		return balance;
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
testblock.createTransaction(new Transactions("address1", "address2", 100))

testblock.createTransaction(new Transactions("address2", "address1", 50))

console.log("Starting Mining...")
testblock.minePendingTransactions("sangeeth");

console.log("Balace of sangeeth"+testblock.checkBalance("sangeeth"))

console.log("Starting Mining...")
testblock.minePendingTransactions("sangeeth");

console.log("Balace of sangeeth"+testblock.checkBalance("sangeeth"))


