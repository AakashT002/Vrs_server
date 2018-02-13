'use strict';
module.exports = (sequelize, DataTypes) => {
  var temp_products = sequelize.define('temp_products', {
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
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });
  
  return temp_products;
};