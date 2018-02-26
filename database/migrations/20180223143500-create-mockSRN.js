'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('mockSRN', {
			gtin: {
				allowNull: false,
				type: Sequelize.STRING
			},
			srn: {
				allowNull: false,
				type: Sequelize.STRING
			},
			lot: {
				allowNull: false,
				type: Sequelize.STRING
			},
			expDate: {
				allowNull: false,
				type: Sequelize.STRING
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('mockSRN');
	}
};