'use strict';
module.exports = (sequelize, DataTypes) => {
	var employees = sequelize.define('employees', {
    companyId: {
			allowNull: false,
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE'
		},
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: true,
      type: DataTypes.STRING
    }
	},
		{
			freezeTableName: true,
			timestamps: false
		});
  
	return employees;
};