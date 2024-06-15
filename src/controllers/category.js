const { Product, User, Category, CategoryProduct } = require("../../models");

// Add Category
exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    const newCategory = await Category.create(data);

    res.send({
      status: "success",
      data: {
        category: {
          id: newCategory.id,
          name: newCategory.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const data = await Category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        categories: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// Get Category details
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Category.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id,
      },
    });

    if (!data) {
      return res.status(404).send({
        status: "failed",
        message: "Category not found",
      });
    }

    res.send({
      status: "success",
      data: {
        category: {
          id: data.id,
          name: data.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await Category.update(data, {
      where: {
        id,
      },
    });

    if (!updated[0]) {
      return res.status(404).send({
        status: "failed",
        message: "Category not found",
      });
    }

    const updatedData = await Category.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      data: {
        category: {
          id: updatedData.id,
          name: updatedData.name,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({
      where: {
        id,
      },
    });

    if (!deleted) {
      return res.status(404).send({
        status: "failed",
        message: "Category not found",
      });
    }

    res.send({
      status: "success",
      data: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server error",
    });
  }
};
