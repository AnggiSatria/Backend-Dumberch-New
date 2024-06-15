"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, {
        foreignKey: "idSender",
        as: "sender",
      });
      Chat.belongsTo(models.User, {
        foreignKey: "idRecipient",
        as: "recipient",
      });
    }
  }
  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idSender: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      idRecipient: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats", // Pastikan tabel ini sesuai dengan nama tabel di database Anda
    }
  );
  return Chat;
};
