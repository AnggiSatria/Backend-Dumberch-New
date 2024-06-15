"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class CategoryProduct extends Model {
    static associate(models) {
      // define association here
    }
  }
  CategoryProduct.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      idProduct: DataTypes.CHAR(36),
      idCategory: DataTypes.CHAR(36),
    },
    {
      sequelize,
      modelName: "CategoryProduct",
    }
  );
  return CategoryProduct;
};
