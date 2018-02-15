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
	var sgtinParsed = productId.split(")");
 	var gtin = sgtinParsed[1].slice(0,sgtinParsed[1].length-3);
 	var srn = sgtinParsed[2].slice(0,sgtinParsed[2].length-3);
 	var lot = sgtinParsed[3].slice(0,sgtinParsed[3].length-3);
 	var expDate = sgtinParsed[4];
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
			res.json({ result: {
				'status': 'verified',
				'gtin': _product.gtin,
				'srn': _product.srn,
				'lot': _product.lot,
				'expDate': _product.expDate,
				'product': _product.productName,
				'transactionId': uuidv4(),
				'requestSentTime': requestSentTime,
				'responseRcvTime': responseRcvTime,
				'requestorId': requestorId,
				'responderId': _product.responderId,
				"events": [
					{
						"eventTime": "2018-02-15T07:31:43.996Z",
						"eventStatus": "verified",
						"eventMessage": "Product verified",
						},
					{
						"eventTime": "2018-02-15T06:31:43.996Z",
						"eventStatus": "requesting",
						"eventMessage": "Verification request from iPhone",
						}
					]
				}
			});
		} else {
			res.send(400, { result: {
				'status': 'Not verified',
				'gtin': gtin,
				'srn': srn,
				'lot': lot,
				'expDate': expDate,
				'transactionId': uuidv4(),
				'requestorId': requestorId,
				'responderId': 'pfizer',
				'requestSentTime': requestSentTime,
				'responseRcvTime': responseRcvTime,
				"events": [
					{
						"eventTime": "2018-02-15T07:31:43.996Z",
						"eventStatus": "not-verified",
						"eventMessage": "Product not verified",
						},
					{
						"eventTime": "2018-02-15T06:31:43.996Z",
						"eventStatus": "requesting",
						"eventMessage": "Verification request from scanner",
						}
					]
			 }
			});
		}
	});
	next();
}

module.exports = productRouter;