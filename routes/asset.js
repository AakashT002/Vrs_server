const Router = require('restify-router').Router;
const assetRouter = new Router('assets');
const constants = require('../constants');
const models = require('../database/models');
const uuidv4 = require('uuid/v4');
const VerificationDAOService = require('../services/VerificationDAOService');
const tokenHandler = require('../utils/tokenHandler');

const RequestValidation = require('../services/RequestValidation');
const LookupDirectory = require('../utils/lookupDirectory');
const RESTServiceHandler = require('../services/RESTServiceHandler');
const VerificationRecord = require('../models/VerificationRecord');
const LookupService = require('../services/LookupService');

// Route definition
assetRouter.post(constants.ASSET_VERIFICATION, assetValidation);

// Route implementation
// For : /api/asset/:epc_identifier/validation
async function assetValidation(req, res, next) {
	const requestReceivedTime = new Date();
	var EPC_IDENTIFIER = req.params.epc_identifier;
	var lastindexOfColon = EPC_IDENTIFIER.lastIndexOf(':');
	var sgtin = EPC_IDENTIFIER.substr(lastindexOfColon + 1, EPC_IDENTIFIER.length);
	if (sgtin.indexOf('.') > -1) {
		sgtin = sgtin.replace(/[.]/g, '');
	}

	if (!req.body.GUID || !req.body.GLN || !req.body.REQUEST_TYPE ||
		!req.body.data || sgtin.length !== 28) {
		res.send(400, { result: 'Invalid format of request' });
	}
	let data;
	try {
		data = JSON.parse(req.body.data);
	} catch (err) {
		data = req.body.data;
	}
	var gtin;
	var srn;
	var expDate = data.EXPIRY;
	var lot = data.LOT_NUM;

	var _responseData = {
		'GLN': req.body.GLN,
		'GUID': req.body.GUID,
		'data': {
			'additional_info': req.body.REQUEST_TYPE,
			'error_message': '',
		},
	};

	gtin = sgtin.substr(0, 14);
	srn = sgtin.substr(14, sgtin.length + 1);
	const txId = req.body.GUID;
	let parsedRequest = {};

	parsedRequest.txId = txId;
	parsedRequest.gln = '0321012345676';
	parsedRequest.gtin = gtin;
	parsedRequest.srn = srn;
	parsedRequest.lot = lot;
	parsedRequest.expDate = expDate;
	parsedRequest.requestorId = req.headers.requestorid;
	parsedRequest.deviceType = req.headers.devicetype;
	parsedRequest.deviceId = req.headers.deviceId;
	parsedRequest.pi = req.headers.pi;
	const user = await models.users.findOne({
		where: {
			userName: tokenHandler.getUserName()
		}
	});
	const verificationRecord = new VerificationRecord(
		user.id,
		txId,
		parsedRequest.gtin,
		parsedRequest.srn,
		parsedRequest.lot,
		parsedRequest.expDate,
		parsedRequest.deviceType,
		parsedRequest.requestorId,
		requestReceivedTime,
		constants.PENDING, [
			{
				verificationId: txId,
				eventTime: requestReceivedTime,
				eventStatus: constants.REQUEST_RECEIVED,
				eventMessage: 'Verification request from ' +
					user.firstName + ' ' + user.lastName + ' with ' + parsedRequest.deviceType,
				entityType: constants.REQUESTOR,
				entityId: parsedRequest.requestorId,
				statusCode: ''
			}
		],
		parsedRequest.pi,
		parsedRequest.deviceId
	);

	await VerificationDAOService.persistVerificationRecord(verificationRecord);
	const isRequestorValid = await RequestValidation.verifyRequestor(parsedRequest.requestorId);
	let responseRcvTime = new Date();
	if (!isRequestorValid) {
		verificationRecord.status = constants.ERROR;
		verificationRecord.responseRcvTime = responseRcvTime;
		VerificationDAOService.updateVerificationRecord(verificationRecord);
		VerificationDAOService.addEvent(txId, responseRcvTime, constants.ERROR,
			'Requestor unknown', constants.REQUESTOR, parsedRequest.requestorId, 403);
		return res.send(403, 'Requestor unknown');
	}

	const connectivityInfo = await LookupService.lookup(parsedRequest.gtin);
	// const connectivityInfo = await LookupDirectory.queryLookup(parsedRequest.gtin);
	_responseData.code = 200;
	if (connectivityInfo.type === constants.CI_TYPE_REST_ENDPOINT && connectivityInfo.endpoint) {
		const verificationResponse = await RESTServiceHandler.process(connectivityInfo.endpoint, parsedRequest);
		if (verificationResponse.code === 200) {
			let responseRcvTime = new Date();
			if (verificationResponse.data.verified === 'TRUE') {
				verificationRecord.status = constants.VERIFIED;
				verificationRecord.responseRcvTime = responseRcvTime;
				verificationRecord.responderId = verificationResponse.responderId;
				verificationRecord.productName = verificationResponse.productName;

				await VerificationDAOService.updateVerificationRecord(verificationRecord);
				VerificationDAOService.addEvent(txId, responseRcvTime, constants.VERIFIED,
					'Product verified', constants.RESPONDER, verificationResponse.responderId, 200);

				_responseData.responderId = verificationResponse.responderId;
				_responseData.data.verified = 'TRUE';
				_responseData.timestamp = responseRcvTime;
			} else if (verificationResponse.data.verified === 'FALSE') {
				verificationRecord.status = constants.NOT_VERIFIED;
				verificationRecord.responseRcvTime = responseRcvTime;
				verificationRecord.responderId = verificationResponse.responderId;
				verificationRecord.productName = verificationResponse.productName;

				await VerificationDAOService.updateVerificationRecord(verificationRecord);
				VerificationDAOService.addEvent(txId, responseRcvTime, constants.NOT_VERIFIED,
					'Product not verified', constants.RESPONDER, verificationResponse.responderId, 200);

				_responseData.responderId = verificationResponse.responderId;
				_responseData.data.verified = 'FALSE';
				_responseData.timestamp = responseRcvTime;
			}
		}
	} else {
		let responseRcvTime = new Date();
		verificationRecord.status = constants.NOT_VERIFIED;
		verificationRecord.responseRcvTime = responseRcvTime;

		await VerificationDAOService.updateVerificationRecord(verificationRecord);
		VerificationDAOService.addEvent(txId, responseRcvTime, constants.NOT_VERIFIED,
			'GTIN not found in Lookupdirectory', constants.REQUESTOR, parsedRequest.requestorId, 200);

		_responseData.data.verified = 'FALSE';
		_responseData.timestamp = responseRcvTime;
	}
	res.send(200, _responseData);
	next();
}

module.exports = assetRouter;
