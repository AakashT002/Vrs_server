'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', [
			{
				verificationId: '99ea12e9-62ab-46e9-86dd-08e5fc8a2c8b',
				id: '1',
				eventTime: new Date(),
				eventStatus: 'verified',
				eventMessage: 'Verification request from iPhone'
			},
			{
				verificationId: '99ea12e9-62ab-46e9-86dd-08e5fc8a2c8b',
				id: '2',
				eventTime: new Date(),
				eventStatus: 'pending',
				eventMessage: 'Verification request from iPhone'
			},
			{
				verificationId: 'c5ac0521-1d2e-4d2f-b0f3-06981b3fb3db',
				id: '3',
				eventTime: new Date(),
				eventStatus: 'verified',
				eventMessage: 'Verification request from iPhone'
      },
      {
				verificationId: 'c5ac0521-1d2e-4d2f-b0f3-06981b3fb3db',
				id: '4',
				eventTime: new Date(),
				eventStatus: 'pending',
				eventMessage: 'Verification request from iPhone'
			}
		]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
