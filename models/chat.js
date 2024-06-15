"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, { as: "sender", foreignKey: "idSender" });
      Chat.belongsTo(models.User, {
        as: "recipient",
        foreignKey: "idRecipient",
      });
    }
  }
  Chat.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      message: DataTypes.STRING,
      idSender: DataTypes.CHAR(36),
      idRecipient: DataTypes.CHAR(36),
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
