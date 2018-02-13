'use strict';
const uuidv4 = require('uuid/v4');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [
			{
				id: 'eb7a581f-f06c-4290-a805-64e10cb314b4',
				firstName: 'Jim',
				lastName: 'Thomson',
				userName: 'jim',
				email: 'jim@vrs.cognizant.com'
			},
			{
				id: 'b7125675-7953-4b95-911a-6671101c6650',
				firstName: 'Rishika',
				lastName: 'Kapur',
				userName: 'rishika',
				email: 'rishika@vrs.cognizant.com'
			},
			{
				id: 'f1e710ab-c3eb-4b0d-8617-844af593e8dc',
				firstName: 'Shankar',
				lastName: 'Sharma',
				userName: 'shankar',
				email: 'shankar@vrs.cognizant.com'
			},
			{
				id: '058e3066-4376-42ae-bdf4-b10d7427a25f',
				firstName: 'Test',
				lastName: 'User',
				userName: 'testuser',
				email: 'testuser@vrs.cognizant.com'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', null, {});
	}
};
