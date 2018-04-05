const constants = require('../constants');
const LookupDirectory = require('../utils/lookupDirectory');

const lookupDirectory = new LookupDirectory("0x83ab93d00b2f57baa20be99d560c7025d12dd396");

module.exports = {
	lookup: async function (gtin) {
		var vrsProviderId = process.env.VRS_PROVIDER_ID;
		const gtins = {
			'10505801235015::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
			'30367534281200::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
			'10350881006602::CognizantVRS': { endpoint : 'https://lp02-team-m-other-vrs-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_VRS_PROVIDER , entityId:'OtherVRS'},
			'10350881006602::OtherVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
			'10350881234567::CognizantVRS': { endpoint : 'http://lp02-team-m-third-vrs-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_VRS_PROVIDER , entityId:'VRS3'},
		};
		var connectivityInfo= {};
		var gtinForVRS = `${gtin}::${process.env.VRS_PROVIDER_ID}`;
		const _gtin = gtins.hasOwnProperty(gtinForVRS);		
		var connectivityInfo = await lookupDirectory.queryLookup(gtinForVRS)
		.catch(async function (error){
		});

		if(connectivityInfo === undefined || connectivityInfo === {}) {
			if (_gtin) {
				connectivityInfo = await gtins[gtinForVRS];
			} else {
				connectivityInfo = {};
			}
		}
		return connectivityInfo;
	}
};