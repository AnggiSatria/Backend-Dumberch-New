"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chats", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
        defaultValue: Sequelize.UUIDV4,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      idSender: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      idRecipient: {
        type: Sequelize.CHAR(36),
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
      "ALTER TABLE `chats` MODIFY `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL;"
    );

    await queryInterface.sequelize.query(
      `CREATE TRIGGER generate_uuid_before_insert_chat
      BEFORE INSERT ON chats
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
      "DROP TRIGGER IF EXISTS generate_uuid_before_insert_chat BEFORE INSERT ON chats;"
    );

    await queryInterface.dropTable("chats");
  },
};
