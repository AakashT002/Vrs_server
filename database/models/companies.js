'use strict';
module.exports = (sequelize, DataTypes) => {
	var companies = sequelize.define('companies', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    Name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    City: {
      allowNull: false,
      type: DataTypes.STRING
    },
    State:{
      allowNull: false,
      type: DataTypes.STRING
    }
  },
		{
			freezeTableName: true,
			timestamps: false
		});

	return companies;
};