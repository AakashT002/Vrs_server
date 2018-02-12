'use strict';
module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define('user',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER
			},
			userId: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING
			},
			firstName: {
				allowNull: false,
				type: DataTypes.STRING
			},
			lastName: {
				allowNull: false,
				type: DataTypes.STRING
			},
			userName: {
				allowNull: false,
				type: DataTypes.STRING
			},
			email: {
				allowNull: false,
				type: DataTypes.STRING
			}
		},
		{
			freezeTableName: true
		});
	return user;
};