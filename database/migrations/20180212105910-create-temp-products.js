'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('temp_products', {
			responderId: {
				allowNull: false,
				type: Sequelize.STRING
			},
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
			productName: {
				allowNull: false,
				type: Sequelize.STRING
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('temp_products');
	}
};