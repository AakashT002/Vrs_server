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
productRouter.post(constants.VERIFY_SGTIN, verifyProduct);

// Route implementation

// For : /api/sgtin
function verifyProduct(req, res, next) {
	const sgtin = req.body.sgtin;
	const requestorId = req.body.requestorId;
	if (sgtin.length === 43) {
		var gtin = sgtin.substr(0, 14);
		var srn = sgtin.substr(14, 14);
		var lot = sgtin.substr(28, 7);
		var expDate = sgtin.substr(35, 8);
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
				res.json({
					result: {
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
						'responderId': _product.responderId
					}
				});
			} else {
				res.send(400, {
					result: {
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
					}
				});
			}
		});
		next();
	} else {
		res.send(400, { result: 'Invalid SGTIN format' });
	}
}

module.exports = productRouter;