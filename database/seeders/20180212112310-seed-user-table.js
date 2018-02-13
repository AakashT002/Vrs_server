'use strict';
const uuidv4 = require('uuid/v4');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [
			{
				userId: uuidv4(),
				firstName: 'Jim',
				lastName: 'Thomson',
				userName: 'jim',
				email: 'jim@vrs.cognizant.com'
			},
			{
				userId: uuidv4(),
				firstName: 'Rishika',
				lastName: 'Kapur',
				userName: 'rishika',
				email: 'rishika@vrs.cognizant.com'
			},
			{
				userId: uuidv4(),
				firstName: 'Shankar',
				lastName: 'Raman',
				userName: 'shankar',
				email: 'shankar@vrs.cognizant.com'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', null, {});
	}
};
