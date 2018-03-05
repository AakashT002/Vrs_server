const Router = require('restify-router').Router;
const verificationsRouter = new Router('verifications');
const constants = require('../constants');
const models = require('../database/models');
const sequelize = require('../database/models/index').sequelize;
const requiredUserAttrs = [
	'userName',
	'firstName',
	'lastName',
	'email'
];
const tokenHandler = require('../utils/tokenHandler');
// Route definition
verificationsRouter.get(constants.ALL_VERIFICATIONS, getRecentVerifications);
verificationsRouter.get(constants.GET_VERIFICATION_BY_SRN, getVerificationsBySrn);

// Route implementation
function getRecentVerifications(req, res, next) {
	
	var whereCondition ='';
	
	if(tokenHandler.isReturnSpecialist()) {
		whereCondition='"u"."userName" = \'' + tokenHandler.getUserName() + '\' AND ';		
	}
	
	const query = 'SELECT "v1"."userId", "v1"."id", "v1"."requestorId", "v1"."responderId", ' +
		' "v1"."vrsProviderId", "v1"."requestSentTime", "v1"."responseRcvTime", "v1"."status", ' +
		' "v1"."deviceType", "v1"."gtin", "v1"."srn", "v1"."lot", "v1"."expDate","v1"."productName" ' +
		' FROM verifications v1,' +
		' (SELECT "v"."srn" AS "srn", MAX("v"."requestSentTime") AS "requestSentTime" ' +
		' 	FROM verifications v, users u WHERE  ' + whereCondition +
		'		"v"."userId" = "u"."id" ' +
		'		GROUP BY "v"."userId",srn) v2 WHERE ' +
		'	"v1"."srn" = "v2"."srn" AND ' +
		'	"v1"."requestSentTime" = "v2"."requestSentTime" ' +
		' ORDER BY "v1"."requestSentTime" DESC ';

	sequelize.query(query, {
		model: models.verifications
	}).then(function (rs, err) {
		if (err) {
			res.send(400, { error: 'Unable to find verifications' });
		}
		if (rs != null) {
			res.json({ result: rs });
		} else {
			res.send(400, { error: 'Unable to find verifications' });
		}
	});
	next();
}

function getVerificationsBySrn(req, res, next) {
	var gtin = req.params.gtin;
	var srn = req.params.srn;

	models.users.findOne({
		where: {
			userName: tokenHandler.getUserName()
		},
	}).then(function (_user, err) {
		if (_user) {
			userId = _user.id;
			_fetchTransactionsBySrnAndUserId(userId, gtin, srn, req, res);
		} else {
			res.send(400, { error: 'Requestor unknown' });
		}
	});
	next();
}

// Private function : Fetch transaction by srn
function _fetchTransactionsBySrnAndUserId(userId, gtin, srn, req, res) {
	models.verifications.findAll({
		where: {
			userId: userId,
			gtin: gtin,
			srn: srn
		},
		include:
		[
			{
				model: models.events,
			}
		],
		order: [
			[{ model: models.events }, 'eventTime', 'DESC'], ['requestSentTime', 'DESC']
		]
	}).then(function (_verifications, err) {
		if (err) {
			res.send(400, { error: 'Unable to find verifications' });
		}
		if (_verifications != null) {
			res.json({ result: _verifications });
		} else {
			res.send(400, { error: 'Unable to find verifications' });
		}
	});
}

module.exports = verificationsRouter;

