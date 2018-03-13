const expect = require('expect');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://c6c62884.ngrok.io'));

describe('LookupDirectory', () => {
  // if this fails - it's likely that our node has crashed
	it('can connect to our node', function () {
		expect(web3.isConnected()).toBe(true);
	});

});