const Router = require('restify-router').Router;
const productRouter = new Router('temp-products');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const constants = require('../constants');
const models = require('../database/models');
const requiredUserAttrs = [
	'responderId',
	'gtin',
	'srn',
	'lot',
	'expDate',
	'productName'
];

// Route definition
productRouter.post(constants.VERIFY_PRODUCT, verifyProduct);

// Route implementation

// For : /api/productidentifier
function verifyProduct(req, res, next) {
	const productId = req.body.pi;
	const requestorId = req.body.requestorId;

	// const token = req.headers.authorization.replace('Bearer ', '');
	// const decodedToken = jwt.decode(token);
	var requestSentTime = new Date();
	var responseRcvTime = null;
	var userId = null;
	const deviceType = req.body.deviceType;
	const txId = uuidv4();

	try {
		String.prototype.replaceAll = function(target, replacement) {
			return this.split(target).join(replacement);
		};
		var sgtin = productId.replace(productId.charAt(0), '{"');
		var sgtin = sgtin.replaceAll('(', '","');
		var sgtin = sgtin.replaceAll(')', '":"');
		var sgtin = sgtin.concat('"}');
		var parsedProductId = JSON.parse(sgtin);
		var gtin = parsedProductId['01'];
		var srn = parsedProductId['21'];
		var lot = parsedProductId['17'];
		var expDate = parsedProductId['10'];
	} catch (err) {
		res.send(400, { error: 'Invalid Product Identifier' });
		next('error');
	}

	models.users.findOne({
		where: {
			userName: 'testuser'/*decodedToken.preferred_username*/
		},
	}).then(function (_user, err) {
		if (_user) {
			userId = _user.id;
			const verificationRecord = {
				userId: userId,
				id: txId,
				requestorId: requestorId,
				requestSentTime: requestSentTime,
				status: constants.PENDING,
				deviceType: deviceType,
				gtin: gtin,
				srn: srn,
				lot: lot,
				expDate: expDate,
				events: [
					{
						verificationId: txId,
						eventTime: requestSentTime,
						eventStatus: constants.REQUESTING,
						eventMessage: 'Verification request from ' + deviceType,
					}
				]
			};
			_createNewVerifyTransaction(verificationRecord, req, res);
		} else {
			res.send(400, { error: 'Requestor unknown' });
		}
	});
	next();
}

// Private function : Create a new verify transaction
function _createNewVerifyTransaction(verificationRecord, req, res) {
	models.verifications.create(verificationRecord, {
		include: [{ model: models.events }]
	}).then(function (verification) {
		if (verification != null) {
			_findProductAndUpdateVerification(verificationRecord, req, res);
		} else {
			res.send(200, { error: 'Error in creating verification record ' });
		}
	}).catch(function (error) {
		console.error('Error in inputs and hence cannot verify : ' + error);
		res.send(400, { error: 'Insufficient or invalid inputs and hence cannot verify ' });
	});
}

// Private function : Find product details
function _findProductAndUpdateVerification(verificationRecord, req, res) {
	models.temp_products.findOne({
		where: {
			gtin: verificationRecord.gtin,
			srn: verificationRecord.srn,
			lot: verificationRecord.lot,
			expDate: verificationRecord.expDate
		},
		attributes: requiredUserAttrs
	}).then(function (_product, err) {
		if (err) {
			res.send(400, { result: 'Error while contacting VRS' });
		}
		var _scanData = {
			'status': constants.PENDING,
			'gtin': verificationRecord.gtin,
			'srn': verificationRecord.srn,
			'lot': verificationRecord.lot,
			'expDate': verificationRecord.expDate,
			'product': '',
			'transactionId': verificationRecord.id,
			'requestSentTime': verificationRecord.requestSentTime,
			'requestorId': verificationRecord.requestorId,
			'responderId': '',
			'events': [
				{
					'eventTime': verificationRecord.requestSentTime,
					'eventStatus': constants.REQUESTING,
					'eventMessage': 'Verification request from ' + verificationRecord.deviceType,
				}
			]
		};
		responseRcvTime = new Date();	
		if (_product != null) {
			models.events.create({
				verificationId: verificationRecord.id,
				eventTime: responseRcvTime,
				eventStatus: constants.VERIFIED,
				eventMessage: 'Product verified',
			}).then(function (event) {
				if(event != null) {
					_scanData.status = constants.VERIFIED;
					_scanData.product = _product.productName;
					_scanData.responseRcvTime = responseRcvTime;
					_scanData.responderId = _product.responderId;
					_scanData.events.push({
						'eventTime': responseRcvTime,
						'eventStatus': constants.VERIFIED,
						'eventMessage': 'Product verified',
					});
					verificationRecord.status = constants.VERIFIED;
					verificationRecord.responseRcvTime = responseRcvTime;
					verificationRecord.responderId = _product.responderId;
					_updateVerifyTransaction(verificationRecord, _scanData, req, res);
				}
			});
		} else {
			models.events.create({
				verificationId: verificationRecord.id,
				eventTime: responseRcvTime,
				eventStatus: constants.NOT_VERIFIED,
				eventMessage: 'Product not verified',
			}).then(function (event) {
				if(event != null) {
					_scanData.status = constants.NOT_VERIFIED;
					_scanData.responseRcvTime = responseRcvTime;
					_scanData.events.push({
						'eventTime': responseRcvTime,
						'eventStatus': constants.NOT_VERIFIED,
						'eventMessage': 'Product not verified',
					});
					verificationRecord.status = constants.NOT_VERIFIED;
					verificationRecord.responseRcvTime = responseRcvTime;
					_updateVerifyTransaction(verificationRecord, _scanData, req, res);
				}
			});
		}
	});
}

// Private function : Find product details
function _updateVerifyTransaction(verificationRecord, _scanData, req, res) {
	models.verifications.update(verificationRecord, {	
		where: { id: verificationRecord.id }}).then(function (record) {
			res.send(200, { result: _scanData });
		});
}

module.exports = productRouter;