'use strict';
module.exports = (sequelize, DataTypes) => {
	var mockSRN = sequelize.define('mockSRN', {
		gtin: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.STRING
		},
		srn: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.STRING
		},
		lot: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.STRING
		},
		expDate: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.STRING
		}
	},
		{
			freezeTableName: true,
			timestamps: false
		});

	return mockSRN;
};