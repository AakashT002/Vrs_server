const Router = require('restify-router').Router;
const verificationsRouter = new Router('verifications');
const jwt = require('jsonwebtoken');
const constants = require('../constants');
const models = require('../database/models');
const requiredUserAttrs = [
	'userName',
	'firstName',
	'lastName',
	'email'
];

// Route definition
verificationsRouter.get(constants.GET_VERIFICATIONS, getVerifications);

// Route implementation
function getVerifications(req, res, next) {
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

