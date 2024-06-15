"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Product, {
        as: "product",
        foreignKey: "idProduct",
      });
      Transaction.belongsTo(models.User, {
        as: "buyer",
        foreignKey: "idBuyer",
      });
      Transaction.belongsTo(models.User, {
        as: "seller",
        foreignKey: "idSeller",
      });
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      idProduct: DataTypes.CHAR(36),
      idBuyer: DataTypes.CHAR(36),
      idSeller: DataTypes.CHAR(36),
      price: DataTypes.BIGINT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
