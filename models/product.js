"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, {
        as: "user",
        foreignKey: "idUser",
      });
      Product.hasMany(models.Transaction, {
        as: "transactions",
        foreignKey: "idProduct",
      });
      Product.belongsToMany(models.Category, {
        through: models.CategoryProduct,
        foreignKey: "idProduct",
        as: "categories",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Jika qty defaultnya adalah 0, tambahkan default value di sini
      },
      idUser: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
