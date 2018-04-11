const constants = require('../constants');
const LookupDirectory = require('../utils/lookupDirectory');

const lookupDirectory = new LookupDirectory(process.env.NODE_ADDRESS);

module.exports = {
	gtins: {
		'10505801235015::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
		'30367534281200::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
		'10350881006602::CognizantVRS': { endpoint : 'https://lp02-team-m-other-vrs-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_VRS_PROVIDER , entityId:'OtherVRS'},
		'10350881006602::OtherVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
		'10350881234567::CognizantVRS': { endpoint : 'http://lp02-team-m-third-vrs-server.herokuapp.com', requestType: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_VRS_PROVIDER , entityId:'VRS3'},
	},
	lookup: async function (gtin) {
		var vrsProviderId = process.env.VRS_PROVIDER_ID;
		var connectivityInfo;
		var gtinForVRS = `${gtin}::${process.env.VRS_PROVIDER_ID}`;
		const _gtin = this.gtins.hasOwnProperty(gtinForVRS);		
		connectivityInfo = await lookupDirectory.queryLookup(gtinForVRS)
		.catch(async function (error){
		});

		if(!connectivityInfo || connectivityInfo.valueOf === Object().valueOf) {
			if (_gtin) {
				connectivityInfo = await this.gtins[gtinForVRS];
			} else {
				connectivityInfo = {};
			}
		}
		return connectivityInfo;
	},
	setLookup: async function (gtin, ci) {
		this.gtins[gtin] = ci;
		await lookupDirectory.setLookup(gtin, ci).catch(function(err) {
		});
	},
	removeLookup: async function (gtin) {
		this.gtins[gtin] = {};
		await lookupDirectory.removeLookup(gtin).catch(function(err) {
		});
	}
};