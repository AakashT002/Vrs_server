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

	var _responseData = {
		'code': 200,
		'GLN': req.body.GLN,
		'GUID': req.body.GUID,
		'data': {
			'additional_info': req.body.REQUEST_TYPE,
			'error_message': '',
		},
	};

	let parsedRequest = await RequestValidation.parseRequest(req);
	parsedRequest.requestReceivedTime = requestReceivedTime;

	const user = await models.users.findOne({
		where: {
			userName: tokenHandler.getUserName()
		}
	});

	let eventRecord = {};
	let deviceId = parsedRequest.deviceType === 'scanner' ? ` ${parsedRequest.deviceId}` : '';
	eventRecord.verificationId = parsedRequest.txId;
	eventRecord.eventTime = parsedRequest.requestReceivedTime;
	eventRecord.eventStatus = constants.REQUEST_RECEIVED;
	eventRecord.eventMessage = `Verification request from 
		${user.firstName} ${user.lastName} with ${parsedRequest.deviceType}
		 ${deviceId}`;
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';

	const verificationRecord = new VerificationRecord(
		user.id,
		parsedRequest.txId,
		parsedRequest.gtin,
		parsedRequest.srn,
		parsedRequest.lot,
		parsedRequest.expDate,
		parsedRequest.deviceType,
		parsedRequest.requestorId,
		parsedRequest.requestReceivedTime,
		constants.PENDING,
		parsedRequest.pi,
		parsedRequest.deviceId,
		parsedRequest.gln
	);
	await VerificationDAOService.persistVerificationRecord(verificationRecord);
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.PARSING_REQUEST;
	eventRecord.eventMessage = 'Parsing request';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	if (parsedRequest.hasErrors || !req.body.GLN || !req.body.pi) {
		verificationRecord.status = constants.ERROR;
		verificationRecord.responseRcvTime = new Date();
		await VerificationDAOService.updateVerificationRecord(verificationRecord);
		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.ERROR;
		eventRecord.eventMessage = constants.INVALID_REQ_MSG;
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = 400;
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);
		return res.send(400, { result: 'Invalid parameters' });
		next();
	}

	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.VALID_REQUEST;
	eventRecord.eventMessage = 'Valid request';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.REQUESTOR_VALIDATION;
	eventRecord.eventMessage = 'Validating requestor';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	const isRequestorValid = await RequestValidation.verifyRequestor(parsedRequest.requestorId);
	let responseRcvTime = new Date();
	if (!isRequestorValid) {
		verificationRecord.status = constants.ERROR;
		verificationRecord.responseRcvTime = responseRcvTime;
		await VerificationDAOService.updateVerificationRecord(verificationRecord);
		eventRecord.eventTime = responseRcvTime;
		eventRecord.eventStatus = constants.ERROR;
		eventRecord.eventMessage = constants.REQUESTOR_UNKNOWN;
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = 403;
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);
		return res.send(403, constants.REQUESTOR_UNKNOWN);
		next();
	}

	// const connectivityInfo = await LookupDirectory.queryLookup(parsedRequest.gtin);
	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.LOOKUP_CONTACTED;
	eventRecord.eventMessage = 'Contacting lookup';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	const connectivityInfo = await LookupService.lookup(parsedRequest.gtin);

	if (connectivityInfo.type === constants.CI_TYPE_REST_ENDPOINT && connectivityInfo.endpoint && connectivityInfo.endpoint.length > 0) {
		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.LOOKUP_FOUND;
		eventRecord.eventMessage = 'Found lookup';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.FORWARDED_TO_OTHER_VRS;
		eventRecord.eventMessage = 'Forwarding request';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord, connectivityInfo);

		const verificationResponse = await RESTServiceHandler.process(connectivityInfo, parsedRequest);

		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.POSTED_TO_RESPONDER;
		eventRecord.eventMessage = 'Contacted responder';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord, connectivityInfo);

		if (verificationResponse.code === 200) {
			eventRecord.eventTime = new Date();
			eventRecord.eventStatus = constants.RESPONSE_RECEIVED;
			eventRecord.eventMessage = 'Response from responder received';
			eventRecord.entityType = constants.REQUESTOR;
			eventRecord.entityId = parsedRequest.requestorId;
			eventRecord.statusCode = '';

			VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);
			let responseRcvTime = new Date();
			if (verificationResponse.data.verified === constants.TRUE) {
				verificationRecord.status = constants.VERIFIED;
				verificationRecord.responseRcvTime = responseRcvTime;
				verificationRecord.responderId = verificationResponse.responderId;
				verificationRecord.productName = verificationResponse.productName;

				await VerificationDAOService.updateVerificationRecord(verificationRecord);
				eventRecord.eventTime = responseRcvTime;
				eventRecord.eventStatus = constants.VERIFIED;
				eventRecord.eventMessage = 'Product verified';
				eventRecord.entityType = constants.RESPONDER;
				eventRecord.entityId = verificationResponse.responderId;
				eventRecord.statusCode = 200;
				VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

				_responseData.responderId = verificationResponse.responderId;
				_responseData.data.verified = constants.TRUE;
				_responseData.timestamp = responseRcvTime;
			} else if (verificationResponse.data.verified === constants.FALSE) {
				verificationRecord.status = constants.NOT_VERIFIED;
				verificationRecord.responseRcvTime = responseRcvTime;
				verificationRecord.responderId = verificationResponse.responderId;
				verificationRecord.productName = verificationResponse.productName;

				await VerificationDAOService.updateVerificationRecord(verificationRecord);
				eventRecord.eventTime = responseRcvTime;
				eventRecord.eventStatus = constants.NOT_VERIFIED;
				eventRecord.eventMessage = 'Product not verified';
				eventRecord.entityType = constants.RESPONDER;
				eventRecord.entityId = verificationResponse.responderId;
				eventRecord.statusCode = 200;
				VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

				_responseData.responderId = verificationResponse.responderId;
				_responseData.data.verified = constants.FALSE;
				_responseData.timestamp = responseRcvTime;
			}
		} else if (verificationResponse.errorCode === 503) {
			delete verificationResponse.errorCode;
			_responseData.data.verified = 'FALSE';
			_responseData.code = 503;
			_responseData.data.error_message = 'Responder might be undergoing maintenance or temporarily unavailable';
			await VerificationDAOService.updateVerificationRecord(verificationResponse);
			eventRecord.eventTime = requestReceivedTime;
			eventRecord.eventStatus = constants.ERROR;
			eventRecord.eventMessage = 'Responder might be undergoing maintenance or temporarily unavailable';
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = 503;
			VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);
		} else if (verificationResponse.errorCode === 404) {
			delete verificationResponse.errorCode;
			_responseData.data.verified = 'FALSE';
			_responseData.code = 404;
			_responseData.data.error_message = 'The requested resource does not exist';
			await VerificationDAOService.updateVerificationRecord(verificationResponse);

			eventRecord.eventTime = requestReceivedTime;
			eventRecord.eventStatus = constants.ERROR;
			eventRecord.eventMessage = 'The requested resource does not exist';
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = 404;
			VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);
		}
	} else {
		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.LOOKUP_NOT_FOUND;
		eventRecord.eventMessage = 'Lookup not found';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		let responseRcvTime = new Date();
		verificationRecord.status = constants.NOT_VERIFIED;
		verificationRecord.responseRcvTime = responseRcvTime;
		await VerificationDAOService.updateVerificationRecord(verificationRecord);
		eventRecord.eventTime = responseRcvTime;
		eventRecord.eventStatus = constants.NOT_VERIFIED;
		eventRecord.eventMessage = 'Responders Repository Connectivity Information Not Found. Contact the Manufacturer / Product GTIN Owner.';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = 200;
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		_responseData.data.verified = constants.FALSE;
		_responseData.timestamp = responseRcvTime;
	}

	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.RESPONSE_DELIVERED;
	eventRecord.eventMessage = 'Response delivered';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	res.send(200, _responseData);
	next();
}

module.exports = assetRouter;
