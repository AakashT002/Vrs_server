'use strict';
module.exports = (sequelize, DataTypes) => {
	var verifications = sequelize.define('verifications', {
		userId: {
			allowNull: false,
			type: DataTypes.UUID
		},
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID
		},
		requestorId: {
			allowNull: false,
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
			allowNull: false,
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
			allowNull: false,
			type: DataTypes.STRING
		},
		gtin: {
			allowNull: false,
			type: DataTypes.STRING
		},
		srn: {
			allowNull: false,
			type: DataTypes.STRING
		},
		lot: {
			allowNull: false,
			type: DataTypes.STRING
		},
		expDate: {
			allowNull: false,
			type: DataTypes.STRING
		},
		productName: {
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