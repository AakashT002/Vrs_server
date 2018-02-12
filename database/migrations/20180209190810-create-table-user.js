'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.createTable('user', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userId: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			firstName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			lastName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			userName: {
				allowNull: false,
				type: Sequelize.STRING
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.dropTable('user');
	}
};
