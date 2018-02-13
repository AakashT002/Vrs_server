'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
	userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    freezeTableName: true,
    timestamps: false
  });

  return users;
};