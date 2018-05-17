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
const PubSubService = require('../services/PubSubService');
// const faye = require('faye');
// var bayeaux = new faye.NodeAdapter({mount: '/faye', timeout:45});

// Route definition
assetRouter.post(constants.ASSET_VERIFICATION, assetValidation);

// Route implementation
// For : /api/asset/:epc_identifier/validation
async function assetValidation(req, res, next) {
	const requestReceivedTime = new Date();
	var bayeaux = PubSubService.bayeaux(req.serverObj);

	var _responseData = {
		'code': 200,
		'GLN': req.body.GLN,
		'GUID': req.body.GUID,
		'data': {
			'additional_info': req.body.REQUEST_TYPE,
			'error_message': '',
		},
	};
	var users = constants.USERS;	

	let parsedRequest = await RequestValidation.parseRequest(req);
	
	var EPC_IDENTIFIER = req.params.epc_identifier;
	var lastindexOfColon = EPC_IDENTIFIER.lastIndexOf(':');
	var sgtin = EPC_IDENTIFIER.substr(lastindexOfColon + 1, EPC_IDENTIFIER.length);
	if (sgtin.indexOf('.') > -1) {
		sgtin = sgtin.replace(/[.]/g, '');
	}
	var validSgtin = true;
	if (sgtin.length >= 26) {
		parsedRequest.gtin = sgtin.substr(0, 14);
		parsedRequest.srn = sgtin.substr(14, sgtin.length + 1);
	} else {
		validSgtin = false;
	}

	try{
		var data = JSON.parse(req.body.data);
	} catch(err){
		var data = req.body.data;
	}
	parsedRequest.expDate = data.EXPIRY;
	parsedRequest.lot = data.LOT_NUM;
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

	if (parsedRequest.hasErrors || !req.body.GLN || !validSgtin) {
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

	if (connectivityInfo.requestType === constants.CI_TYPE_REST_ENDPOINT && connectivityInfo.endpoint && connectivityInfo.endpoint.length > 0) {
		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.LOOKUP_FOUND;
		eventRecord.eventMessage = 'Found lookup';
		eventRecord.entityType = constants.REQUESTOR;
		eventRecord.entityId = parsedRequest.requestorId;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		if(connectivityInfo.entityType === constants.ENTITY_TYPE_VRS_PROVIDER) {
			eventRecord.eventTime = new Date();
			eventRecord.eventStatus = constants.FORWARDED_TO_OTHER_VRS;
			eventRecord.eventMessage = 'Forwarding request';
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = '';
			VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord, connectivityInfo);
		} else if (connectivityInfo.entityType === constants.ENTITY_TYPE_MANUFACTURER) {
			eventRecord.eventTime = new Date();
			eventRecord.eventStatus = constants.FORWARDED_TO_MANUFACTURER;
			eventRecord.eventMessage = 'Forwarding request';
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = '';
			VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord, connectivityInfo);
		}
		
		const verificationResponse = await RESTServiceHandler.process(connectivityInfo, parsedRequest);
			
		if (verificationResponse.code === 200) {
			_responseData.code = 200;
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
				eventRecord.entityType = connectivityInfo.entityType;
				eventRecord.entityId = connectivityInfo.entityId;
				eventRecord.statusCode = 200;
				VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

				_responseData.responderId = connectivityInfo.entityId;
				_responseData.data.verified = constants.TRUE;
				_responseData.timestamp = responseRcvTime;
				_responseData.productName = verificationResponse.productName;
				// bayeaux.attach(req.serverObj);
				var messageObj = {
					status: constants.VERIFIED,
					userName: users[verificationRecord.userId],
					deviceId: parsedRequest.deviceId
				};
				console.log('messageObj:', JSON.stringify(messageObj));
				bayeaux.getClient().publish('/messages', {
					text: messageObj
				});
				// req.serverObj.listen(req.port);
			} else if (verificationResponse.data.verified === constants.FALSE) {
				verificationRecord.status = constants.NOT_VERIFIED;
				verificationRecord.responseRcvTime = responseRcvTime;
				verificationRecord.responderId = verificationResponse.responderId;
				verificationRecord.productName = verificationResponse.productName;
				verificationRecord.nextStepCode = constants.PRODUCT_NOT_VERIFIED;

				await VerificationDAOService.updateVerificationRecord(verificationRecord);
				eventRecord.eventTime = responseRcvTime;
				eventRecord.eventStatus = constants.NOT_VERIFIED;
				eventRecord.eventMessage = 'Product not verified';
				eventRecord.entityType = connectivityInfo.entityType;
				eventRecord.entityId = connectivityInfo.entityId;
				eventRecord.statusCode = 200;
				VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

				_responseData.responderId = connectivityInfo.entityId;
				_responseData.data.verified = constants.FALSE;
				_responseData.timestamp = responseRcvTime;
				_responseData.productName = verificationResponse.productName;
				// bayeaux.attach(req.serverObj);
				var messageObj = {
					status: constants.NOT_VERIFIED,
					userName: users[verificationRecord.userId],
					deviceId: parsedRequest.deviceId
				};
				console.log('messageObj:', JSON.stringify(messageObj));				
				bayeaux.getClient().publish('/messages', {
					text: messageObj
				});
				// req.serverObj.listen(req.port);
			}
		} else if (verificationResponse.errorCode === 503) {
			delete verificationResponse.errorCode;
			_responseData.data.verified = 'FALSE';
			_responseData.code = 503;
			var msgEntity = (connectivityInfo.entityType === constants.ENTITY_TYPE_MANUFACTURER) ? 'repository' : constants.VRS_PROVIDER;
			_responseData.data.error_message = `${connectivityInfo.entityId} ${msgEntity} might be undergoing maintenance or temporarily unavailable`;
			verificationResponse.responseRcvTime = new Date();
			verificationRecord.status = constants.ERROR;
			verificationRecord.responseRcvTime = new Date();
			await VerificationDAOService.updateVerificationRecord(verificationRecord);
			eventRecord.eventTime = new Date();
			eventRecord.eventStatus = constants.ERROR;
			eventRecord.eventMessage = `${connectivityInfo.entityId} ${msgEntity} might be undergoing maintenance or temporarily unavailable`;
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = 503;
			VerificationDAOService.logAndAddEvent(eventRecord, verificationResponse);
		} else if (verificationResponse.errorCode === 404) {
			delete verificationResponse.errorCode;
			_responseData.data.verified = 'FALSE';
			_responseData.code = 404;
			_responseData.data.error_message = 'Responder repository info for the GTIN is invalid. Please contact system admin.';
			verificationResponse.responseRcvTime = new Date();
			verificationRecord.status = constants.ERROR;
			verificationRecord.responseRcvTime = new Date();
			await VerificationDAOService.updateVerificationRecord(verificationRecord);

			eventRecord.eventTime = new Date();
			eventRecord.eventStatus = constants.ERROR;
			eventRecord.eventMessage = 'Responder repository info for the GTIN is invalid. Please contact system admin.';
			eventRecord.entityType = connectivityInfo.entityType;
			eventRecord.entityId = connectivityInfo.entityId;
			eventRecord.statusCode = 404;
			VerificationDAOService.logAndAddEvent(eventRecord, verificationResponse);
		}
	} else {
		eventRecord.eventTime = new Date();
		eventRecord.eventStatus = constants.LOOKUP_NOT_FOUND;
		eventRecord.eventMessage = 'Lookup not found';
		eventRecord.entityType = constants.VRS_PROVIDER;
		eventRecord.entityId = process.env.VRS_PROVIDER_ID;
		eventRecord.statusCode = '';
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		let responseRcvTime = new Date();
		verificationRecord.status = constants.NOT_VERIFIED;
		verificationRecord.responseRcvTime = responseRcvTime;
		verificationRecord.nextStepCode = constants.LOOKUP_NOT_FOUND;
		await VerificationDAOService.updateVerificationRecord(verificationRecord);
		eventRecord.eventTime = responseRcvTime;
		eventRecord.eventStatus = constants.NOT_VERIFIED;
		eventRecord.eventMessage = 'Responders Repository Connectivity Information Not Found. Contact the Manufacturer / Product GTIN Owner.';
		eventRecord.entityType = constants.VRS_PROVIDER;
		eventRecord.entityId = process.env.VRS_PROVIDER_ID;
		eventRecord.statusCode = 200;
		VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

		_responseData.data.verified = constants.FALSE;
		_responseData.timestamp = responseRcvTime;
		// bayeaux.attach(req.serverObj);
		var messageObj = {
			status: constants.NOT_VERIFIED,
			userName: users[verificationRecord.userId],
			deviceId: parsedRequest.deviceId
		};
		console.log('messageObj:', JSON.stringify(messageObj));		
		bayeaux.getClient().publish('/messages', {
			text: messageObj
		});
		// req.serverObj.listen(req.port);
	}
	// req.serverObj.listen(req.port);

	eventRecord.eventTime = new Date();
	eventRecord.eventStatus = constants.RESPONSE_DELIVERED;
	eventRecord.eventMessage = 'Response delivered';
	eventRecord.entityType = constants.REQUESTOR;
	eventRecord.entityId = parsedRequest.requestorId;
	eventRecord.statusCode = '';
	await VerificationDAOService.logAndAddEvent(eventRecord, verificationRecord);

	res.send(200, _responseData);
	next();
}

module.exports = assetRouter;
