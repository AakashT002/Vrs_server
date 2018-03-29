class VerificationRecord {
	constructor(userId, txId, gtin, srn, lot, expDate, deviceType, requestorId,
		requestSentTime, status, pi, deviceId, gln) {
		this.userId = userId;
		this.id = txId;
		this.gtin = gtin;
		this.srn = srn;
		this.lot = lot;
		this.expDate = expDate;
		this.deviceType = deviceType;
		this.requestorId = requestorId;
		this.requestSentTime = requestSentTime;
		this.status = status;
		this.pi = pi;
		this.deviceId = deviceId;
		this.requestorGLN = gln;
	}
}

module.exports = VerificationRecord;