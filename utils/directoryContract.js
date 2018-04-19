const Web3 = require('web3');
const nodeUrl = process.env.NODE_ENDPOINT;
const abi = [
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
				'name': 'requestType',
				'type': 'string'
			},
			{
				'name': 'entityType',
				'type': 'string'
			},
			{
				'name': 'entityId',
				'type': 'string'
			},
			{
				'name': 'url',
				'type': 'string'
			}
		],
		'payable': false,
		'stateMutability': 'view',
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
				'name': '_requestType',
				'type': 'string'
			},
			{
				'name': '_entityType',
				'type': 'string'
			},
			{
				'name': '_entityId',
				'type': 'string'
			},
			{
				'name': '_url',
				'type': 'string'
			}
		],
		'name': 'setLookup',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
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
				'type': 'string'
			},
			{
				'name': '',
				'type': 'string'
			},
			{
				'name': '',
				'type': 'string'
			},
			{
				'name': '',
				'type': 'string'
			}
		],
		'payable': false,
		'stateMutability': 'view',
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
	}
];

module.exports = async (addr) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
	web3.eth.defaultAccount = process.env.NODE_ACCOUNT;
	const LookupDirectory = web3.eth.contract(abi);
	const directoryContract = LookupDirectory.at(addr);
	return directoryContract; 
};
