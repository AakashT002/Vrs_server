'use strict';
module.exports = (sequelize, DataTypes) => {
  var verifications = sequelize.define('verifications', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    transactionId: {
      allowNull: false,
      primaryKey: true,      
      type: DataTypes.INTEGER
    },
    requestorId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    responderId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    vrsProviderId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    requestSentTime: {
      allowNull: false,
      type: DataTypes.DATE
    },
    responseRcvTime: {
      allowNull: false,
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
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });

  return verifications;
};