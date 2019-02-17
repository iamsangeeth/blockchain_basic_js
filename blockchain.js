const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = EC('secp256k1');

class Transactions{
	constructor(fromaddress, toaddress, amount){
		this.fromaddress = fromaddress;
		this.toaddress = toaddress;
		this.amount = amount;
	}
	calculateHash(){
		return SHA256(this.fromaddress + this.toaddress + this.amount).toString();
	}

	signTransaction(signingKey){
		if(signingKey.getPublic('hex') != this.fromaddress){
			throw new Error("You cannot sign transactions of other wallets")
		}
		const hashTs = this.calculateHash();
		const sig = signingKey.sign(hashTs, 'base64');
		this.signature = sig.toDER();
	}
	isValid(){
		if(this.fromaddress == null) return true;

		if(!this.signature || this.signature.length == 0){
			throw new Error("No signature")
		}
		const publickey = ec.keyFromPublic(this.fromaddress, 'hex');
		return publickey.verify(this.calculateHash(), this.signature);
	}
}

class Block{
	constructor(timestamp, transactions, previouhash=''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previouhash = previouhash;
		this.hash = this.calculateHash();
		this.nounce = 0;
	}
	calculateHash(){
		return SHA256(this.timestamp + this.timestamp + this.nounce + JSON.stringify(this.transactions)).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) != Array(difficulty+1).join("0")){
			this.nounce ++;
			this.hash = this.calculateHash()
		}
		console.log("Block Mined "+ this.hash)
	}

	hasValidTransactions(){
		for(const tx of this.transactions){
			if(!tx.isValid()){
				return false;
			}
		}
	return true;
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
		const rewardTx = new Transactions(null, miningRewardAddress, this.miningrewards);
		this.pendingtransactions.push(rewardTx);

		let block = new Block(Date.now(), this.pendingtransactions);
		block.mineBlock(this.difficulty);
		console.log("Block successfully mined");
		this.chain.push(block);
		this.pendingtransactions = [];
	}

	addTransaction(transaction){
		if(!transaction.fromaddress || !transaction.toaddress){
			throw new Error("from adrress and to address are required")
		}

		if(!transaction.isValid()){
			throw new Error("Cannot add invalid transation to chain")
		}

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

			if(currentBlock.hasValidTransactions()){
				return false;
			}

			if(currentBlock.hash !== currentBlock.calculateHash()){				
				return false;
			}

			if(currentBlock.previouhash !== previousBlock.hash){				
				return false;
			}
		}
		return true; 
	}
}

module.exports.BlockChain = BlockChain;
module.exports.Transactions = Transactions; 