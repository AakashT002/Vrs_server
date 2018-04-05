const constants = require('../constants');

module.exports = {
	lookup: function (gtin) {
		var vrsProviderId = process.env.VRS_PROVIDER_ID;
		const gtins = {
			'10505801235015::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
			'30367534281200::CognizantVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'},
			'10350881006602::CognizantVRS': { endpoint : 'https://lp02-team-m-other-vrs-server.herokuapp.com', type: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_VRS_PROVIDER , entityId:'OtherVRS'},
			'10350881006602::OtherVRS': { endpoint : 'https://lp02-team-m-responder-server.herokuapp.com', type: constants.CI_TYPE_REST_ENDPOINT, entityType:constants.ENTITY_TYPE_MANUFACTURER , entityId:'Pfizer'}
			};
		
		var gtinForVRS = `${gtin}::${process.env.VRS_PROVIDER_ID}`			
		const _gtin = gtins.hasOwnProperty(gtinForVRS);

		if (_gtin) {
			return gtins[gtinForVRS];
		} else {
			return {};
		}
	}
};