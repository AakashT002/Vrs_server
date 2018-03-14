const DirectoryContract = require('./directoryContract');
const Web3 = require('web3');
const web3 = new Web3();

class LookupDirectory {
	constructor(addr) {
		this.contract = DirectoryContract(addr);
	}

	async queryLookup(gtin) {
		const contract = await this.contract;
		const returnGtin = await contract.queryLookup(gtin);
		return web3.toAscii(returnGtin);
	}

	async addValidAddress(address) {
		const contract = await this.contract;
    // txHash is returned since blockchain doesn't return data
		const txHash = await contract.addValidAddress(address);
		return txHash;
	}

	async removeValidAddress(address) {
		const contract = await this.contract;
		const txHash = await contract.removeValidAddress(address);
		return txHash;
	}

	async transferOwnership(address) {
		const contract = await this.contract;
		const txHash = await contract.transferOwnership(address, {gas: 4000000});
		return txHash; 
	}
};

module.exports = LookupDirectory;