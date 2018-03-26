const constants = require('../constants');
const axios = require('axios');

module.exports = {
	process: async function (connectivityInfo, verificationRequest) {
		let dataInput = JSON.stringify({
			'GUID': verificationRequest.txId,
			'GLN': verificationRequest.gln,
			'REQUEST_TYPE': '001',
			'data': { 'LOT_NUM': verificationRequest.lot, 'EXPIRY': verificationRequest.expDate }
		});
		let responderEndPoint = connectivityInfo + constants.API_PREFIX + '/asset/' + 'gs1:es:' + verificationRequest.gtin + verificationRequest.srn + '/validation';
		const response = await axios({
			method: 'POST',
			url: responderEndPoint,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.parse(dataInput),
		});
		if (response.status === 200) {
			return response.data.result;
		}
	},
};