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
	const deviceType = req.body.deviceType;
	try {
		var sgtinParsed = productId.split(")");
		var gtin = sgtinParsed[1].slice(0,sgtinParsed[1].length-3);
		var srn = sgtinParsed[2].slice(0,sgtinParsed[2].length-3);
		var lot = sgtinParsed[3].slice(0,sgtinParsed[3].length-3);
		var expDate = sgtinParsed[4];
	} catch (err) {
			res.send(400, { result: 'Invalid Product Identifier' });
			next('error');
	}

	var _scanData = {
		'status': 'pending',
		'gtin': gtin,
		'srn': srn,
		'lot': lot,
		'expDate': expDate,
		'product': '',
		'transactionId': uuidv4(),
		'requestSentTime': requestSentTime,
		'responseRcvTime': responseRcvTime,
		'requestorId': requestorId,
		'responderId': '',
		"events": [
			{
				"eventTime": new Date(),
				"eventStatus": "requesting",
				"eventMessage": "Verification request from " + deviceType,
			}
		]
	}
	const token = req.headers.authorization.replace('Bearer ', '');
	const decodedToken = jwt.decode(token);
	var requestSentTime = new Date();
	var responseRcvTime;
	models.temp_products.findOne({
		where: {
			gtin: gtin,
			srn: srn,
			lot: lot,
			expDate: expDate
		},
		attributes: requiredUserAttrs
	}).then(function (_product, err) {
		responseRcvTime = new Date();		
		if (err) {
			res.send(400, { result: 'Error while finding product' });
		}
		if (_product != null) {
			_scanData.status = 'verified';
			_scanData.product = _product.productName;
			_scanData.responseRcvTime = new Date();
			_scanData.responderId = _product.responderId;
			_scanData.events.push({
				"eventTime": new Date(),
				"eventStatus": "verified",
				"eventMessage": "Product verified",
				})
				res.send(200, { result: _scanData });
		} else {
			_scanData.status = 'Not verified';
			_scanData.responseRcvTime = new Date();
			_scanData.events.push({
				"eventTime": new Date(),
				"eventStatus": "not-verified",
				"eventMessage": "Product not verified",
				})
			res.send(200, { result: _scanData });
		}
	});
	next();
}

module.exports = productRouter;