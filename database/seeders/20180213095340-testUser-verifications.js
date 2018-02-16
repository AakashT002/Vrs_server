'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('verifications', [
			{
				userId: 'eb7a581f-f06c-4290-a805-64e10cb314b4',
				id: '99ea12e9-62ab-46e9-86dd-08e5fc8a2c8b',
				requestorId: 'ABC123',
				responderId: 'PFIZER',
				vrsProviderId: 'COGNIZANTVRS',
				requestSentTime: new Date(),
				responseRcvTime: new Date(),
				status: 'verified',
				deviceType: 'iphone',
				gtin: '10350881006602',
				srn: '13268255316404',
				lot: 'ABC1234',
				expDate: '20190321'
			},
			{
				userId: 'eb7a581f-f06c-4290-a805-64e10cb314b4',
				id: 'c5ac0521-1d2e-4d2f-b0f3-06981b3fb3db',
				requestorId: 'ABC124',
				responderId: 'PFIZER',
				vrsProviderId: 'COGNIZANTVRS',
				requestSentTime: new Date(),
				responseRcvTime: new Date(),
				status: 'pending',
				deviceType: 'desktop',
				gtin: '30367534281200',
				srn: '54804001677517',
				lot: 'O076TK2',
				expDate: '20170415'
			},
			{
				userId: 'eb7a581f-f06c-4290-a805-64e10cb314b4',
				id: 'cfebe32b-da81-4345-8efe-06fc96524027',
				requestorId: 'ABC125',
				responderId: 'PFIZER',
				vrsProviderId: 'COGNIZANTVRS',
				requestSentTime: new Date(),
				responseRcvTime: new Date(),
				status: 'not-verified',
				deviceType: 'iphone',
				gtin: '40311122334565',
				srn: '3796912855039',
				lot: 'O076TK2',
				expDate: '20180629'
			},
			{
				userId: 'eb7a581f-f06c-4290-a805-64e10cb314b4',
				id: 'ffebe32b-da81-4345-8efe-06fc96524027',
				requestorId: 'ABC125',
				responderId: 'PFIZER',
				vrsProviderId: 'COGNIZANTVRS',
				requestSentTime: new Date(2017, 5, 1),
				responseRcvTime: new Date(2017, 5, 1),
				status: 'verified',
				deviceType: 'iphone',
				gtin: '40311122334565',
				srn: '3796912855039',
				lot: 'O076TK2',
				expDate: '20180629'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('verifications', null, {});
	}
};
