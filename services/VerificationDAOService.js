const models = require('../database/models');

module.exports = {
	persistVerificationRecord: function (verificationRecord) {
		return models.verifications.create(verificationRecord, {
			include: [{ model: models.events }]
		});
	},

	updateVerificationRecord: function (verificationRecord) {
		return models.verifications.update(verificationRecord, {
			where: { id: verificationRecord.id }
		});
	},

	addEvent: function (txId, eventTime, eventStatus, eventMessage, entityType, entityId, statusCode) {
		return models.events.create({
			verificationId: txId,
			eventTime: eventTime,
			eventStatus: eventStatus,
			eventMessage: eventMessage,
			entityType: entityType,
			entityId: entityId,
			statusCode: statusCode
		});
	}
};