'use strict';
module.exports = (sequelize, DataTypes) => {
	var events = sequelize.define('events', {
		verificationId: {
			allowNull: false,
			type: DataTypes.UUID
		},
		id: {
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER
		},
		eventTime: {
			allowNull: false,
			type: DataTypes.DATE
		},
		eventStatus: {
			allowNull: false,
			type: DataTypes.STRING
		},
		eventMessage: {
			allowNull: false,
			type: DataTypes.STRING
		}
	},
		{
			freezeTableName: true,
			timestamps: false
		});
  
	return events;
};