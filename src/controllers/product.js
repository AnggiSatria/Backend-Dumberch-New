const { Product, User, Category, CategoryProduct } = require("../../models");
const { Op } = require("sequelize");

// Tambah Produk
exports.addProduct = async (req, res) => {
  try {
    let { idCategory } = req.body;
    idCategory = idCategory?.split(",");

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      image: req.file.filename,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    let newProduct = await Product.create(data);

    const productCategoryData = idCategory.map((item) => {
      return { idProduct: newProduct.id, idCategory: item };
    });

    await CategoryProduct.bulkCreate(productCategoryData);

    let productData = await Product.findOne({
      where: { id: newProduct.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Category,
          as: "categories",
          through: { model: CategoryProduct, as: "bridge", attributes: [] },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "idUser"] },
    });

    productData = JSON.parse(JSON.stringify(productData));

    res.send({
      status: "success",
      data: {
        ...productData,
        image: process.env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Ambil Semua Produk dengan pencarian kata kunci, sorting, dan pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      sort_by = "name",
      order = "ASC",
      page = 1,
      limit = 10,
    } = req.query;
    let whereCondition = {};

    if (keyword) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { desc: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }

    const offset = (page - 1) * limit;

    let data = await Product.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Category,
          as: "categories",
          through: { model: CategoryProduct, as: "bridge", attributes: [] },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "idUser"] },
      order: [[sort_by, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
    });

    const totalPages = Math.ceil(data.count / limit);

    data = JSON.parse(JSON.stringify(data.rows));

    data = data.map((item) => {
      item.image = process.env.PATH_FILE + item.image;
      return item;
    });

    res.send({
      status: "success",
      data: {
        products: data,
        totalPages: totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Ambil Detail Produk
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await Product.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Category,
          as: "categories",
          through: { model: CategoryProduct, as: "bridge", attributes: [] },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt", "idUser"] },
    });

    data = JSON.parse(JSON.stringify(data));
    data.image = process.env.PATH_FILE + data.image;

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Update Produk
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { categoryId } = req.body;
    categoryId = categoryId?.split(",");

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    if (req.file) {
      data.image = req.file.filename;
    }

    await CategoryProduct.destroy({
      where: { idProduct: id },
    });

    let productCategoryData = [];
    if (categoryId.length > 0 && categoryId[0] !== "") {
      productCategoryData = categoryId.map((item) => {
        return { idProduct: id, idCategory: item };
      });
    }

    await CategoryProduct.bulkCreate(productCategoryData);

    await Product.update(data, {
      where: { id },
    });

    res.send({
      status: "success",
      data: {
        id,
        ...data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Hapus Produk
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await CategoryProduct.destroy({
      where: { idProduct: id },
    });

    await Product.destroy({
      where: { id },
    });

    res.send({
      status: "success",
      data: { id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
