'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('events', {
			id: {
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				type: Sequelize.INTEGER
			},
			verificationId: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'verifications',
					key: 'id'
				}
			},
			eventTime: {
				allowNull: false,
				type: Sequelize.DATE
			},
			eventStatus: {
				allowNull: false,
				type: Sequelize.STRING
			},
			eventMessage: {
				allowNull: false,
				type: Sequelize.STRING
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('events');
	}
};