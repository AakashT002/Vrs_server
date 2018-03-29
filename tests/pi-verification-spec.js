'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const should = chai.should();
const testconfig = require('./test-config');
const constants = require('../constants');
const models = require('../database/models');
const url = testconfig.url;
const uuidv4 = require('uuid/v4');
const piVerificationAPI = constants.API_PREFIX + '/asset/' + 'gs1:es:1035088100660212345678904321' + '/validation';

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
							userName: 'jim'
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
		let info = JSON.parse('{"LOT_NUM": "ABC1234", "EXPIRY": "20190321"}');
		let input = {'GUID': uuidv4(),
			'GLN': '0321012345676',
			'REQUEST_TYPE': '001',
			'data': info
		};
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
		let info = JSON.parse('{"LOT_NUM": "ABC1234", "EXPIRY": "20190321"}');
		let input = {'GUID': uuidv4(),
			'GLN': '0321012345676',
			'REQUEST_TYPE': '001',
			'data': info
		};
		chai.request(url)
      .get(piVerificationAPI)
      .set('Authorization', 'Bearer '+token)
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
		let info = JSON.parse('{"LOT_NUM": "ABC1234", "EXPIRY": "20190321"}');
		let input = {'GUID': uuidv4(),
			'GLN': '0321012345676',
			'REQUEST_TYPE': '001',
			'data': info,
			'requestorId': 'ABC123',
			'pi': '(01)10350881006602(21)12345678904321(17)ABC1234(10)20190321',
			'deviceType': 'desktop',
			'deviceId': ''
		};
		chai.request(url)
      .post(piVerificationAPI)
			.set('Authorization', 'Bearer '+token)
			.send(input)
			.end(function (err, res) {
				res.should.not.have.status(405);
				res.body.should.be.a('Object');
				return done();
			});
	});
  
	it('should return error messsage when insufficient input provided', function (done) {
		let input = {'GUID': uuidv4(),
			'REQUEST_TYPE': '001',
			'requestorId': 'ABC123',
			'pi': '(01)10350881006602(21)12345678904321(17)ABC1234(10)20190321',
			'deviceType': 'desktop',
			'deviceId': ''
		};
		chai.request(url)
    .post(piVerificationAPI)
		.set('Authorization', 'Bearer '+token)
    .send(input)
			.end(function (err, res) {
				res.should.not.have.status(200);
				res.body.should.be.a('Object');
				res.body.should.have.property('result');
				return done();
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
		let info = JSON.parse('{"LOT_NUM": "ABC1234", "EXPIRY": "20190321"}');
		let input = {'GUID': uuidv4(),
			'GLN': '0321012345676',
			'REQUEST_TYPE': '001',
			'data': info,
			'requestorId': 'ABC123',
			'pi': '(01)10350881006602(21)12345678904321(17)ABC1234(10)20190321',
			'deviceType': 'desktop',
			'deviceId': ''
		};
		chai.request(url)
      .post(piVerificationAPI)
			.set('Authorization', 'Bearer '+token)
			.send(input)
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				res.should.have.status(200);
				return done();
			});
	});
});
