
const constants = require('../constants');
const axios = require('axios');
const models = require('../database/models');
const tokenHandler = require('../utils/tokenHandler');
const VerificationDAOService = require('../services/VerificationDAOService');
const VerificationRecord = require('../models/VerificationRecord');

module.exports = {
	process: async function (connectivityInfo, verificationRequest) {
		let dataInput = JSON.stringify({
			'GUID': verificationRequest.txId,
			'GLN': verificationRequest.gln,
			'REQUEST_TYPE': '001',
			'data': { 'LOT_NUM': verificationRequest.lot, 'EXPIRY': verificationRequest.expDate }
		});
		let responderEndPoint = connectivityInfo.endpoint + constants.API_PREFIX + '/asset/' + 'gs1:es:' + verificationRequest.gtin + verificationRequest.srn + '/validation';
		return await axios({
			method: 'POST',
			url: responderEndPoint,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.parse(dataInput),
		}).then(async function (response) {
			if (response.status === 200) {
				return response.data.result;
			}
		}).catch(async function (error) {
			if (!error.response ? error.request.statusText.code === 'ECONNREFUSED' : error.response.status === 503) {
				const user = await models.users.findOne({
					where: {
						userName: tokenHandler.getUserName()
					}
				});
				const verificationRecord = new VerificationRecord(
				user.id,
				verificationRequest.txId,
				verificationRequest.gtin,
				verificationRequest.srn,
				verificationRequest.lot,
				verificationRequest.expDate,
				verificationRequest.deviceType,
				connectivityInfo.entityId,
				verificationRequest.requestReceivedTime,
				constants.ERROR, 			
				verificationRequest.pi,
				verificationRequest.deviceId
		);
				verificationRecord.errorCode=503;			
				return verificationRecord;
			}	else if (error.response.status === 404) {
				const user = await models.users.findOne({
					where: {
						userName: tokenHandler.getUserName()
					}
				});
				const verificationRecord = new VerificationRecord(
				user.id,
				verificationRequest.txId,
				verificationRequest.gtin,
				verificationRequest.srn,
				verificationRequest.lot,
				verificationRequest.expDate,
				verificationRequest.deviceType,
				connectivityInfo.entityId,
				verificationRequest.requestReceivedTime,
				constants.ERROR,		
				verificationRequest.pi,
				verificationRequest.deviceId
		);
				verificationRecord.errorCode=404;
				return verificationRecord;
			}
		});
	},
};
