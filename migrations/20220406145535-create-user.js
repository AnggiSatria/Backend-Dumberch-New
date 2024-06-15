"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "customer",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.sequelize.query(
      "ALTER TABLE `users` MODIFY `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;"
    );

    await queryInterface.sequelize.query(
      `CREATE TRIGGER generate_uuid_before_insert_user
      BEFORE INSERT ON users
      FOR EACH ROW
      BEGIN
        IF NEW.id IS NULL THEN
          SET NEW.id = '${uuidv4()}';
        END IF;
      END;`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS generate_uuid_before_insert_user BEFORE INSERT ON users;"
    );

    await queryInterface.dropTable("users");
  },
};
