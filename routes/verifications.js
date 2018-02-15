const Router = require('restify-router').Router;
const verificationsRouter = new Router('verifications');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
const models = require('../database/models');
const sequelize = require('../database/models/index').sequelize;
const requiredUserAttrs = [
	'userName',
	'firstName',
	'lastName',
	'email'
];

// Route definition
verificationsRouter.get(constants.ALL_VERIFICATIONS, getRecentVerifications);

// Route implementation
function getRecentVerifications(req, res, next) {
	const token = req.headers.authorization.replace('Bearer ', '');
	const decodedToken = jwt.decode(token);
	const query = 'SELECT * FROM verifications v1, ' +
		' (SELECT "v"."srn" AS "srn", MAX("v"."requestSentTime") AS "requestSentTime" ' +
		' 	FROM verifications v, users u WHERE  ' +
		'		"u"."userName" = \'' + decodedToken.preferred_username + '\' AND ' +
		'		"v"."userId" = "u"."id" ' +
		'		GROUP BY srn) v2 WHERE ' +
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


function getAllVerifications(req, res, next) {
	const token = req.headers.authorization.replace('Bearer ', '');
	const decodedToken = jwt.decode(token);
	models.verifications.findAll({
		include:
			[
				{
					model: models.users,
					where: {
						userName: decodedToken.preferred_username
					},
					attributes: requiredUserAttrs
				}
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
	next();
}

module.exports = verificationsRouter;

