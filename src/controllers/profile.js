const { Profile } = require("../../models");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    if (!profile) {
      return res.status(404).json({
        status: "failed",
        message: "Profile not found",
      });
    }

    let data = {
      ...profile.toJSON(), // Menggunakan toJSON untuk mengonversi objek Sequelize menjadi objek JavaScript biasa
      image: profile.image
        ? process.env.PATH_FILE + profile.image
        : process.env.PATH_FILE + "Frame.png",
    };

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
};
