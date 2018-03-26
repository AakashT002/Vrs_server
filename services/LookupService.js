const constants = require('../constants');

module.exports = {
	lookup: function (gtin) {
		const gtins = ['10505801235015', '10350881006602', '30367534281200'];
		const _gtin = gtins.find(function (element) {
			return element === gtin;
		});

		let ci = {};
		if (_gtin) {
			ci.endpoint = 'https://lp02-team-m-responder-server.herokuapp.com';
			ci.type = constants.CI_TYPE_REST_ENDPOINT;
			ci.entityType = constants.ENTITY_TYPE_MANUFACTURER;
		}
		return ci;
	}
};