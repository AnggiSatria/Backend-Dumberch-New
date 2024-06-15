"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.User, { as: "user", foreignKey: "idUser" });
      Product.hasMany(models.Transaction, {
        as: "transactions",
        foreignKey: "idProduct",
      });
      Product.belongsToMany(models.Category, {
        as: "categories",
        through: models.CategoryProduct,
        foreignKey: "idProduct",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      desc: DataTypes.TEXT,
      price: DataTypes.BIGINT,
      image: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      idUser: DataTypes.CHAR(36),
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
