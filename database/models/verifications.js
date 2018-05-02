'use strict';
module.exports = (sequelize, DataTypes) => {
	var verifications = sequelize.define('verifications', {
		userId: {
			allowNull: true,
			type: DataTypes.UUID
		},
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID
		},
		requestorId: {
			allowNull: true,
			type: DataTypes.STRING
		},
		responderId: {
			allowNull: true,
			type: DataTypes.STRING
		},
		vrsProviderId: {
			allowNull: true,
			type: DataTypes.STRING
		},
		requestSentTime: {
			allowNull: true,
			type: DataTypes.DATE
		},
		responseRcvTime: {
			allowNull: true,
			type: DataTypes.DATE
		},
		status: {
			allowNull: false,
			type: DataTypes.STRING
		},
		deviceType: {
			allowNull: true,
			type: DataTypes.STRING
		},
		gtin: {
			allowNull: true,
			type: DataTypes.STRING
		},
		srn: {
			allowNull: true,
			type: DataTypes.STRING
		},
		lot: {
			allowNull: true,
			type: DataTypes.STRING
		},
		expDate: {
			allowNull: true,
			type: DataTypes.STRING
		},
		productName: {
			allowNull: true,
			type: DataTypes.STRING
		},
		pi: {
			allowNull: true,
			type: DataTypes.STRING
		},
		requestorGLN: {
			allowNull: true,
			type: DataTypes.STRING
		},
		deviceId: {
			allowNull: true,
			type: DataTypes.STRING
		},
		nextStepCode: {
			allowNull: true,
			type: DataTypes.STRING
		}
	},
		{
			freezeTableName: true,
			timestamps: false
		});

	return verifications;
};