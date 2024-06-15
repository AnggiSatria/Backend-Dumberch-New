const { Product, User, Category, CategoryProduct } = require("../../models");

// Add Product
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

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    let data = await Product.findAll({
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

    data = data.map((item) => {
      item.image = process.env.PATH_FILE + item.image;
      return item;
    });

    res.send({
      status: "success",
      data: {
        products: data,
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

// Get Product details
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

// Update Product
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

// Delete Product
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
