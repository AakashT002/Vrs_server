const Router = require('restify-router').Router;
const userRouter = new Router('users');
const jwt = require('jsonwebtoken');
const clone = require('clone');
const moment = require('moment');
const serviceUtils = require('../serviceUtils');
const constants = require('../constants');
const models = require('../database/models');
const requiredUserAttrs = [
	'id',
	'firstName',
	'lastName',
	'email'
];

// Route definition
userRouter.get(constants.CURRENTUSER_URI, currentuser);

// Route implementation

// For : /api/authenticate
function authenticate(req, res, next) {
	const _userName = req.body.userName !== undefined ? req.body.userName.toLowerCase() : '';
	models.user.findOne({
		where: {
			userName: _userName,
			bankCode: req.headers[constants.REQ_HEADER_BANK_CODE],
			role: req.headers[constants.REQ_HEADER_USER_TYPE]
		}
	}).then(function (user, err) {
		if (user != null) {
			var token = jwt.sign(user.dataValues.id, process.env.JWT_SECRET);
			res.json({
				message: 'Authentication succeeded.',
				jwt: token
			});
		} else {
			res.send(400, {
				error: 'Authentication failed. Username or password is invalid.',
			});
		}
	});
	next();
}

// For : /api/currentuser
function currentuser(req, res, next) {
	const userId = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
	models.user.findOne({
		where: {
			id: userId
		},
		attributes: requiredUserAttrs
	}).then(function (_user, err) {
		if (err) {
			res.send(400, { error: 'Unable to find user' });
		}
		if (_user != null) {
			res.json({ user: _user });
		} else {
			res.send(400, { error: 'No User Found' });
		}
	});
	next();
}

module.exports = userRouter;
