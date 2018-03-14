'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const should = chai.should();
const testconfig = require('./test-config');
const constants = require('../constants');
const models = require('../database/models');
const url = testconfig.url;
const getVerificationsBySrnAPI = constants.API_PREFIX + constants.GET_VERIFICATION_BY_SRN;

chai.use(chaiHttp);
let token = null;

describe('Fetch verifications by srn API : ' + getVerificationsBySrnAPI, function () {
	before(function (done) {
		var server = require('../server');
		// make sure the server is started
		setTimeout(function () {
			chai.request(url)
        .get('/')
        .set('Authorization', 'Bearer ')
				.end(function (err, res) {
					if (err) {
						if (err.code === 'ECONNREFUSED')
							return done(new Error('Server is not running.'));
						return done(err);
					}
					models.users.findOne({
						where: {
							userName: 'testuser'
						}
					}).then(function (testuser, err) {
						if (testuser != null) {
							token = jwt.sign({ preferred_username: testuser.userName }, 'secret');
							return done();
						} else {
							return done(new Error('Cannot verify product unless a user exists.'));
						}
					});
				});
		}, 500);
	});
  
	it('As it is unprotected url - error 401 should be thrown', function (done) {
		chai.request(url)
      .get(getVerificationsBySrnAPI)
			.end(function (err, res) {
				res.should.have.status(401);
				res.body.should.be.a('Object');
				return done();
			});
	});
  
	it('should not support POST', function (done) {
		chai.request(url)
      .post(getVerificationsBySrnAPI)
      .set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {      
				if (err) {
					res.should.have.status(405);
					return done();
				} else {
					return done('POST Method shouldn\'t be supported');
				}
			});
	});
  
	it('should support GET', function (done) {
		chai.request(url)
      .get(getVerificationsBySrnAPI)
      .set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				if (err) {
					res.should.not.have.status(405);
					res.body.should.be.a('Object');
					return done();
				} else {
					res.should.have.status(200);
					return done();
				}
			});
	});
  
	it('should error as unathorized when an invalid token is provided', function (done) {
		chai.request(url)
    .get(getVerificationsBySrnAPI)
    .set('Authorization', '')
		.end(function (err, res) {
			res.should.have.status(401);
			res.body.should.be.a('Object');
			return done();
		});
	});

	it('should get the when a valid input is provided', function (done) {
		chai.request(url)
      .get(getVerificationsBySrnAPI)
      .set('Authorization', 'Bearer ' + token)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				res.should.have.status(200);
				res.body.should.be.a('Object');
				res.body.should.not.have.property('error');
				return done();
			});
	});
});
