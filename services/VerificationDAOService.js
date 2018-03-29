const models = require('../database/models');
const constants = require('../constants');
const serviceUtils = require('../utils/serviceUtils');
const phases = {
	[constants.REQUEST_RECEIVED]: 'TxId - {txId} - Request Received from requestor - Requestor Id - {requestorId}, Requestor GLN : {gln}',
	[constants.REQUESTOR_VALIDATION]: 'TxId - {txId} - Contacting Requestor directory for validity of requestor : Requestor Id - {requestorId}, Requestor GLN : {gln}',
	[constants.PARSING_REQUEST]: 'TxId - {txId} - Parsing the request...',
	[constants.VALID_REQUEST]: 'TxId - {txId} - Request is valid - gtin: {gtin}, srn: {srn}, lot: {lot} expDate: {expDate}',
	[constants.LOOKUP_CONTACTED]: 'TxId - {txId} - Contacting GTIN lookup directory for valid connectivity information',
	[constants.LOOKUP_FOUND]: 'TxId - {txId} - GTIN found in lookup directory',
	[constants.LOOKUP_NOT_FOUND]: 'TxId - {txId} - GTIN not found in lookup directory',
	[constants.POSTED_TO_RESPONDER]: 'TxId - {txId} - Posted request to {entityType} {entityId}',
	[constants.FORWARDED_TO_OTHER_VRS]: 'TxId - {txId} - Forwarding request to {entityType} {entityId}',
	[constants.RESPONSE_RECEIVED]: 'TxId - {txId} - Response Received',
	[constants.RESPONSE_DELIVERED]: 'TxId - {txId} - Response Delivered to the requestor',
	[constants.ERROR]: 'TxId - {txId} - Product verification status: {status}, Info: {msg}',
	[constants.VERIFIED]: 'TxId - {txId} - Product verification status: {status}, Info: {msg}',
	[constants.NOT_VERIFIED]: 'TxId - {txId} - Product verification status: {status}, Info: {msg}'
};


module.exports = {
	persistVerificationRecord: function (verificationRecord) {
		return models.verifications.create(verificationRecord);
	},

	updateVerificationRecord: function (verificationRecord) {
		return models.verifications.update(verificationRecord, {
			where: { id: verificationRecord.id }
		});
	},

	logAndAddEvent: async function (eventRecord, verificationRecord, connectivityInfo) {

		let obj = {};
		obj.txId = verificationRecord.id;
		obj.requestorId = verificationRecord.requestorId;
		obj.gln = !verificationRecord.requestorGLN ? ' ' : verificationRecord.requestorGLN;
		obj.entityType = !connectivityInfo ? '' : connectivityInfo.entityType;
		obj.entityId = !connectivityInfo ? '' : connectivityInfo.entityId;
		obj.status = verificationRecord.status;
		obj.msg = eventRecord.eventMessage;
		obj.gtin = verificationRecord.gtin;
		obj.srn = verificationRecord.srn;
		obj.lot = verificationRecord.lot;
		obj.expDate = verificationRecord.expDate;

		let messageLog = phases[eventRecord.eventStatus];
		if (messageLog && messageLog.length > 0) {
			console.log(serviceUtils.getResolvedString(messageLog, obj));
		} else {
			console.log(eventRecord.eventMessage);
		}

		await this.addEvent(eventRecord);
	},

	addEvent: function (eventRecord) {
		return models.events.create({
			verificationId: eventRecord.verificationId,
			eventTime: eventRecord.eventTime,
			eventStatus: eventRecord.eventStatus,
			eventMessage: eventRecord.eventMessage,
			entityType: eventRecord.entityType,
			entityId: eventRecord.entityId,
			statusCode: eventRecord.statusCode
		});
	}
};
