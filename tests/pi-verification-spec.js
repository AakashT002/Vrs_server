'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const should = chai.should();
const testconfig = require('./test-config');
const constants = require('../constants');
const models = require('../database/models');
const url = testconfig.url;
const piVerificationAPI = constants.API_PREFIX + constants.VERIFY_PRODUCT;

chai.use(chaiHttp);
let token = null;

describe('PI verification API : ' + piVerificationAPI, function () {
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
  
	it('should throw 401 Error - Unauthorized as this is unprotected url', function (done) {
		let input = {pi: '', requestorId: '', deviceType: ''};
		chai.request(url)
      .post(piVerificationAPI)
      .send(input)
			.end(function (err, res) {
				res.should.have.status(401);
				res.body.should.be.a('Object');
				return done();
			});
	});
  
	it('should not support GET', function (done) {
		let input = {pi: '', requestorId: '', deviceType: ''};
		chai.request(url)
      .get(piVerificationAPI)
      .set('Authorization', 'Bearer ')
			.send(input)
			.end(function (err, res) {      
				if (err) {
					res.should.have.status(405);
					return done();
				} else {
					return done('GET Method shouldn\'t be supported');
				}
			});
	});
  
	it('should support POST', function (done) {
		let input = {pi: '', requestorId: '', deviceType: ''};
		chai.request(url)
      .post(piVerificationAPI)
      .set('Authorization', 'Bearer ')
			.send(input)
			.end(function (err, res) {
				if (err) {
					res.should.not.have.status(405);
					res.body.should.be.a('Object');
					return done();
				} else {
					res.should.not.have.status(200);
					return done();
				}
			});
	});
  
	it('should return error messsage when insufficient input provided', function (done) {
		let input = {pi: ''};
		chai.request(url)
    .post(piVerificationAPI)
    .set('Authorization', 'Bearer ')
    .send(input)
			.end(function (err, res) {
				if (err) {
					res.should.not.have.status(200);
					res.body.should.be.a('Object');
					res.body.should.have.property('error');
					return done();
				} else {
					return done('Cannot authenticate without required inputs');
				}
			});
	});
  
	it('should error as unathorized when an invalid token is provided in the header', function (done) {
		chai.request(url)
    .post(piVerificationAPI)
    .set('Authorization', '')
		.end(function (err, res) {
			res.should.have.status(401);
			res.body.should.be.a('Object');
			return done();
		});
	});

	it('should get the product details when an valid input is provided', function (done) {
		let input = {
			pi: '(01)10350881006602(21)12345678904321(17)ABC1234(10)20190321',
			requestorId: 'ABC125',
			deviceType: 'mobile'
		};
		chai.request(url)
      .post(piVerificationAPI)
      .set('Authorization', 'Bearer ' + token)
      .send(input)
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
