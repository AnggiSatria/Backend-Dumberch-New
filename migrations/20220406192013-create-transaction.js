"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
        defaultValue: Sequelize.UUIDV4,
      },
      idProduct: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      idBuyer: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      idSeller: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      price: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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
      "ALTER TABLE `transactions` MODIFY `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;"
    );

    await queryInterface.sequelize.query(
      `CREATE TRIGGER generate_uuid_before_insert_transaction
      BEFORE INSERT ON transactions
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
      "DROP TRIGGER IF EXISTS generate_uuid_before_insert_transaction BEFORE INSERT ON transactions;"
    );

    await queryInterface.dropTable("transactions");
  },
};
