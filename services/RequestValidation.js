const flatten = require('flat');
const models = require('../database/models');

module.exports = {
	parseRequest: async function (req) {

		let parsedRequest = {};
		parsedRequest.requestorId = req.body.requestorId;
		parsedRequest.deviceType = req.body.deviceType;
		parsedRequest.txId = req.body.GUID;
		parsedRequest.gln = req.body.GLN;
		parsedRequest.deviceId = req.body.deviceId;
		parsedRequest.pi = req.body.pi;
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