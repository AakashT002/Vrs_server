'use strict';
module.exports = (sequelize, DataTypes) => {
	var products = sequelize.define('products', {
		responderId: {
			allowNull: false,
			type: DataTypes.STRING
		},
		gtin: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.STRING
		},
		productName: {
			allowNull: false,
			type: DataTypes.STRING
		}
	},
		{
			freezeTableName: true,
			timestamps: false
		});

	return products;
};