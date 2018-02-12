'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const should = chai.should();
const testconfig = require('./test-config');
const constants = require('../constants');
const models = require('../database/models');
const url = testconfig.url;
const applicationByUser = constants.API_PREFIX + constants.APPLICATIONS_BY_USER;

chai.use(chaiHttp);
let token;
let buyerTaxId = null;
let users = null;

function getUserById(id) {
	return users.find(function (user) {
		return user.id === id;
	});
}

function getUserByRole(role) {
	return users.find(function (user) {
		return user.role === role;
	});
}

describe('Application by User API : ' + applicationByUser, function () {
	before(function (done) {
		// var server = require('../server');
		// make sure the server is started
		return done();
	});

	it('should error as unauthorized when Authorization token is not passed', function (done) {
		return done();
	});

	it('should not support POST', function (done) {
		return done();
	});

});
