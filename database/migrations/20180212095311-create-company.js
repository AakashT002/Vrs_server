'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('companies', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			Name: {
				allowNull: false,
				type: Sequelize.STRING
			},
			City: {
				allowNull: false,
				type: Sequelize.STRING
      },
      State:{
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('companies');
	}
};