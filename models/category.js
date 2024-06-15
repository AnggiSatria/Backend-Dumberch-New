"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        as: "products",
        through: models.CategoryProduct,
        foreignKey: "idCategory",
      });
    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
