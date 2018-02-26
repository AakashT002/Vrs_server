'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize
			.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
			.then(() => {
				return queryInterface.createTable('verifications', {
					userId: {
						allowNull: false,
						type: Sequelize.UUID,
						references: {
							model: 'users',
							key: 'id'
						}
					},
					id: {
						allowNull: false,
						primaryKey: true,
						type: Sequelize.UUID,
						defaultValue: Sequelize.literal('uuid_generate_v4()')
					},
					requestorId: {
						allowNull: false,
						type: Sequelize.STRING
					},
					responderId: {
						allowNull: true,
						type: Sequelize.STRING
					},
					vrsProviderId: {
						allowNull: true,
						type: Sequelize.STRING
					},
					requestSentTime: {
						allowNull: false,
						type: Sequelize.DATE
					},
					responseRcvTime: {
						allowNull: true,
						type: Sequelize.DATE
					},
					status: {
						allowNull: false,
						type: Sequelize.STRING
					},
					deviceType: {
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
						allowNull: true,
						type: Sequelize.STRING
					}
				});
			});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('verifications');
	}
};