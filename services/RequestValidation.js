const models = require('../database/models');

module.exports = {
	parseRequest: async function (req) {

		let parsedRequest = {};
		const productId = req.body.pi;
		parsedRequest.requestorId = req.body.requestorId;
		parsedRequest.deviceType = req.body.deviceType;

		try {
			String.prototype.replaceAll = function (target, replacement) {
				return this.split(target).join(replacement);
			};
			var sgtin = productId.replace(productId.charAt(0), '{"');
			var sgtin = sgtin.replaceAll('(', '","');
			var sgtin = sgtin.replaceAll(')', '":"');
			var sgtin = sgtin.concat('"}');
			var parsedProductId = JSON.parse(sgtin);
			parsedRequest.gtin = parsedProductId['01'];
			parsedRequest.srn = parsedProductId['21'];
			parsedRequest.lot = parsedProductId['17'];
			parsedRequest.expDate = parsedProductId['10'];

			parsedRequest.hasErrors = false;
		} catch (err) {
			console.error('Error in parsing the request');
			parsedRequest.hasErrors = true;
		}
		return parsedRequest;
	},

	verifyRequestor: function (requestorId) {
		if (requestorId) {
			return true;
		} else {
			return false;
		}
	},

	validateInput: function (verificationRecord) {
		return true;
	}
};