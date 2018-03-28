const expect = require('expect');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://c6c62884.ngrok.io'));
const LookupDirectory = require('../utils/lookupDirectory');
const contractAddress = '0x83ab93d00b2f57baa20be99d560c7025d12dd396';

describe('LookupDirectory', () => {
  // if this fails - it's likely that our node has crashed
	//it('can connect to our node', function () {
		//expect(web3.isConnected()).toBe(true);
		//expect(true).toBe(true);
	//});

    // test case commented out - since it depends on seeded
     //blockchain data which is not consistent
	//it('can instantiate a lookup directory object w/ address', async () => {
		//const ld = new LookupDirectory(contractAddress); 
		//const thing = await ld.queryLookup(web3.fromAscii('111'));
		//expect(thing).toBe('www.yes.com');
	//});
});
