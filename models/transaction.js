"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
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
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      idProduct: DataTypes.UUID,
      idBuyer: DataTypes.UUID,
      idSeller: DataTypes.UUID,
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
