'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize
			.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
			.then(() => {
				return queryInterface.createTable('verifications', {
					userId: {
						allowNull: true,
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
						allowNull: true,
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
						allowNull: true,
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
						allowNull: true,
						type: Sequelize.STRING
					},
					gtin: {
						allowNull: true,
						type: Sequelize.STRING
					},
					srn: {
						allowNull: true,
						type: Sequelize.STRING
					},
					lot: {
						allowNull: true,
						type: Sequelize.STRING
					},
					expDate: {
						allowNull: true,
						type: Sequelize.STRING
					},
					productName: {
						allowNull: true,
						type: Sequelize.STRING
					},
					pi: {
						allowNull: true,
						type: Sequelize.STRING
					},
					requestorGLN: {
						allowNull: true,
						type: Sequelize.STRING
					},
					deviceId: {
						allowNull: true,
						type: Sequelize.STRING
					},
					nextStepCode: {
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