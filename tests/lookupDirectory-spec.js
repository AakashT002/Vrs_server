const expect = require('expect');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NODE_ENDPOINT));

const LookupDirectory = require('../utils/lookupDirectory');
const contractAddress = process.env.NODE_ADDRESS;

const sampleGtins = {
	'10505801235015::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: 'constants.CI_TYPE_REST_ENDPOINT', entityType:'constants.ENTITY_TYPE_MANUFACTURER', entityId:'Pfizer'},
	'30367534281200::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: 'constants.CI_TYPE_REST_ENDPOINT', entityType:'constants.ENTITY_TYPE_MANUFACTURER', entityId:'Pfizer'},
	'10350881006602::CognizantVRS': { endpoint : 'https://lp02-team-m-other-vrs-server.herokuapp.com', type: 'constants.CI_TYPE_REST_ENDPOINT', entityType:'constants.ENTITY_TYPE_VRS_PROVIDER', entityId:'OtherVRS'},
	'10350881006602::OtherVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: 'constants.CI_TYPE_REST_ENDPOINT', entityType:'constants.ENTITY_TYPE_MANUFACTURER', entityId:'Pfizer'}
};

const sampleCii = {
	'requestType': 'xxx',
	'entityType': 'constants.ENTITY_TYPE_MANUFACTURER',
	'entityId': 'Pfizer',
	'endpoint': 'https://lp02-team-m-responder-server.herokuapp.com'
};

describe('LookupDirectory', () => {
  // if this fails - it's likely that our node has crashed
	/*it('can connect to our node', function () {*/
		//expect(web3.isConnected()).toBe(true);
		//expect(true).toBe(true);
	/*});*/

     //blockchain data which is not consistent
	//it('can instantiate a lookup directory object w/ address', async () => {
		//const gtin = '123';
		//const ld = new LookupDirectory(contractAddress); 
		//const thing = await ld.queryLookup(web3.fromAscii(gtin));
		//expect(thing).toBe('www.yes.com');
	//});
});
