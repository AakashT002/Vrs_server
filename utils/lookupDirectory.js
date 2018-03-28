const DirectoryContract = require('./directoryContract');
const Web3 = require('web3');
const web3 = new Web3();


class LookupDirectory {
	constructor(addr) {
		this.contract = DirectoryContract(addr);
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

	// example connectivityInfo = {'requestType': _, 'entityType': _, 'entityId': _, 'endpoint': _}
	async setLookup(gtin, connectivityInfo) {
		const contract = await this.contract;
		const txHash = await contract.setLookup(web3.fromAscii(gtin),
							connectivityInfo['requestType'],
							connectivityInfo['entityType'], 
							connectivityInfo['entityId'],
							connectivityInfo['endpoint'], {gas: 4000000});
		return txHash; 
	}

	async removeLookup(gtin) {
		const contract = await this.contract;
		const txHash = await contract.setLookup(web3.fromAscii(gtin), '', '', '', '', {gas: 4000000});
		return txHash;
	}

	async transferOwnership(address) {
		const contract = await this.contract;
		const txHash = await contract.transferOwnership(address, {gas: 4000000});
		return txHash; 
	}

	async queryLookup(gtin) {
		const contract = await this.contract;
		const data = await contract.queryLookup(gtin);
		// return empty object if lookup returns nothing
		if (data[0] == '') {
			return {};
		}
		return {
			'requestType': data[0],
			'entityType': data[1],
			'entityId': data[2],
			'endpoint': data[3]
		};
	}
};


module.exports = LookupDirectory;
