"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { as: "profile", foreignKey: "idUser" });
      User.hasMany(models.Product, { as: "products", foreignKey: "idUser" });
      User.hasMany(models.Transaction, {
        as: "buyerTransactions",
        foreignKey: "idBuyer",
      });
      User.hasMany(models.Transaction, {
        as: "sellerTransactions",
        foreignKey: "idSeller",
      });
      User.hasMany(models.Chat, {
        as: "senderMessage",
        foreignKey: "idSender",
      });
      User.hasMany(models.Chat, {
        as: "recipientMessage",
        foreignKey: "idRecipient",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
