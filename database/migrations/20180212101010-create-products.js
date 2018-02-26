'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('products', {
			gtin: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			responderId: {
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
		return queryInterface.dropTable('products');
	}
};