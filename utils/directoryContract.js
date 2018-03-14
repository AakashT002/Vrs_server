const Web3 = require('web3');
const nodeUrl = 'https://c6c62884.ngrok.io';
const abi = [
	{
		'constant': true,
		'inputs': [
			{
				'name': '_gtin',
				'type': 'bytes32'
			}
		],
		'name': 'queryLookup',
		'outputs': [
			{
				'name': '',
				'type': 'bytes32'
			}
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'owner',
		'outputs': [
			{
				'name': '',
				'type': 'address'
			}
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'constant': true,
		'inputs': [
			{
				'name': '',
				'type': 'bytes32'
			}
		],
		'name': 'directory',
		'outputs': [
			{
				'name': '',
				'type': 'bytes32'
			}
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'constant': true,
		'inputs': [
			{
				'name': '',
				'type': 'address'
			}
		],
		'name': 'authorizedAddresses',
		'outputs': [
			{
				'name': '',
				'type': 'bool'
			}
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'name': 'previousOwner',
				'type': 'address'
			},
			{
				'indexed': true,
				'name': 'newOwner',
				'type': 'address'
			}
		],
		'name': 'OwnershipTransferred',
		'type': 'event'
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': '_address',
				'type': 'address'
			}
		],
		'name': 'addValidAddress',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': '_address',
				'type': 'address'
			}
		],
		'name': 'removeValidAddress',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': '_gtin',
				'type': 'bytes32'
			},
			{
				'name': '_url',
				'type': 'bytes32'
			}
		],
		'name': 'setLookup',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': 'newOwner',
				'type': 'address'
			}
		],
		'name': 'transferOwnership',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'constructor'
	}
];

module.exports = async (addr) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
	web3.eth.defaultAccount = '0x58225f9bc4b87b472f467e66b2e408ccf7559141';
	const LookupDirectory = web3.eth.contract(abi);
	const directoryContract = LookupDirectory.at(addr);
	return directoryContract; 
};